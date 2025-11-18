#!/usr/bin/env python3
import json
import os
import sys
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

import requests

BASE_URL = os.environ.get("KAIZEN_BASE_URL", "http://localhost:3000")
LOGIN_PAYLOAD = {
    "nomorWa": os.environ.get("KAIZEN_USER_WA", "+6285790826168"),
    "password": os.environ.get("KAIZEN_USER_PASSWORD", "12345678"),
}
OUTPUT_PATH = Path(os.environ.get("KAIZEN_METRICS_PATH", "screenshots/response_times.json"))
DATE_SAMPLE = os.environ.get("KAIZEN_SAMPLE_DATE", "2025-09-20")
START_TIME = os.environ.get("KAIZEN_SAMPLE_START", "2025-09-01T00:00:00.000Z")
END_TIME = os.environ.get("KAIZEN_SAMPLE_END", "2025-09-30T23:59:59.999Z")

def measure(
    session: requests.Session,
    method: str,
    path: str,
    name: str,
    token: Optional[str] = None,
    requires_auth: bool = True,
    params: Optional[Dict[str, Any]] = None,
    json_data: Optional[Dict[str, Any]] = None,
) -> Tuple[Dict[str, Any], Union[Dict[str, Any], str, None]]:
    url = f"{BASE_URL}{path}"
    headers = {}
    if requires_auth:
        if not token:
            raise RuntimeError(f"Token is required for {method} {path}")
        headers["Authorization"] = f"Bearer {token}"
    start = time.perf_counter()
    try:
        response = session.request(
            method=method,
            url=url,
            headers=headers,
            params=params,
            json=json_data,
            timeout=30,
        )
        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
        body: Union[Dict[str, Any], str, None]
        try:
            body = response.json()
        except ValueError:
            body = response.text
        result = {
            "name": name,
            "method": method,
            "path": path,
            "status_code": response.status_code,
            "elapsed_ms": elapsed_ms,
            "message": body.get("message") if isinstance(body, dict) else None,
        }
        return result, body
    except requests.RequestException as exc:
        elapsed_ms = round((time.perf_counter() - start) * 1000, 2)
        result = {
            "name": name,
            "method": method,
            "path": path,
            "status_code": None,
            "elapsed_ms": elapsed_ms,
            "message": None,
            "error": str(exc),
        }
        return result, None

def main() -> int:
    session = requests.Session()
    results: List[Dict[str, Any]] = []

    login_result, login_body = measure(
        session=session,
        method="POST",
        path="/api/v1/auth/login",
        name="Auth Login",
        token=None,
        requires_auth=False,
        json_data=LOGIN_PAYLOAD,
    )
    results.append(login_result)

    if not isinstance(login_body, dict) or not login_body.get("success"):
        print("Login failed; cannot continue", file=sys.stderr)
        write_results(results)
        return 1

    token = login_body["data"]["token"]

    def add_result(
        method: str,
        path: str,
        name: str,
        *,
        requires_auth: bool = True,
        params: Optional[Dict[str, Any]] = None,
        json_data: Optional[Dict[str, Any]] = None,
        note: Optional[str] = None,
    ) -> Tuple[Dict[str, Any], Union[Dict[str, Any], str, None]]:
        result, body = measure(
            session=session,
            method=method,
            path=path,
            name=name,
            token=token,
            requires_auth=requires_auth,
            params=params,
            json_data=json_data,
        )
        if note and note.strip():
            result["note"] = note
        results.append(result)
        return result, body

    add_result("GET", "/health", "Health Check", requires_auth=False)
    add_result("GET", "/api/v1", "API Info", requires_auth=False)
    add_result("GET", "/api/v1/auth/profile", "Profile")

    users_result, users_body = add_result("GET", "/api/v1/users", "Users List")
    user_id = None
    angkatan_id = None
    nomor_wa = None
    if isinstance(users_body, dict) and users_body.get("data"):
        first_user = users_body["data"][0]
        user_id = first_user.get("id")
        angkatan_id = first_user.get("idAngkatan") or (
            first_user.get("angkatan", {}).get("id") if first_user.get("angkatan") else None
        )
        nomor_wa = first_user.get("nomorWa")

    add_result(
        "GET",
        f"/api/v1/users/{user_id or '1'}",
        "User Detail",
        note="Fallback ID used" if not user_id else None,
    )
    add_result(
        "GET",
        f"/api/v1/users/angkatan/{angkatan_id or '1'}",
        "Users By Angkatan",
        note="Fallback angkatanId used" if not angkatan_id else None,
    )
    add_result(
        "GET",
        f"/api/v1/users/wa/{(nomor_wa or '+6281234567890').replace('+', '%2B')}",
        "User By WhatsApp",
        note="Fallback nomorWa used" if not nomor_wa else None,
    )

    communal_result, communal_body = add_result("GET", "/api/v1/communal", "Communal List")
    communal_id = None
    if isinstance(communal_body, dict) and communal_body.get("data"):
        first_communal = communal_body["data"][0]
        communal_id = first_communal.get("id")
        communal_penanggung = first_communal.get("idPenanggungJawab")
        communal_lantai = first_communal.get("lantai")
    else:
        communal_penanggung = user_id or "1"
        communal_lantai = "1"

    add_result(
        "GET",
        f"/api/v1/communal/{communal_id or '1'}",
        "Communal Detail",
        note="Fallback ID used" if not communal_id else None,
    )
    add_result(
        "GET",
        f"/api/v1/communal/penanggung-jawab/{communal_penanggung}",
        "Communal By Penanggung Jawab",
    )
    add_result(
        "GET",
        f"/api/v1/communal/lantai/{communal_lantai}",
        "Communal By Lantai",
    )
    add_result(
        "GET",
        f"/api/v1/communal/available-slots/{DATE_SAMPLE}/{communal_lantai}",
        "Communal Available Slots",
    )
    add_result(
        "GET",
        "/api/v1/communal/time-slots",
        "Communal Time Slots",
        params={"date": DATE_SAMPLE},
    )

    serbaguna_result, serbaguna_body = add_result(
        "GET", "/api/v1/serbaguna", "Serbaguna List"
    )
    serbaguna_id = None
    serbaguna_penanggung = None
    serbaguna_area = None
    if isinstance(serbaguna_body, dict) and serbaguna_body.get("data"):
        first_serbaguna = serbaguna_body["data"][0]
        serbaguna_id = first_serbaguna.get("id")
        serbaguna_penanggung = first_serbaguna.get("idPenanggungJawab")
        serbaguna_area = first_serbaguna.get("idArea")
    if not serbaguna_penanggung:
        serbaguna_penanggung = user_id or "1"
    if not serbaguna_area:
        serbaguna_area = "1"

    add_result(
        "GET",
        f"/api/v1/serbaguna/{serbaguna_id or '1'}",
        "Serbaguna Detail",
        note="Fallback ID used" if not serbaguna_id else None,
    )
    add_result(
        "GET",
        f"/api/v1/serbaguna/penanggung-jawab/{serbaguna_penanggung}",
        "Serbaguna By Penanggung Jawab",
    )
    add_result(
        "GET",
        f"/api/v1/serbaguna/area/{serbaguna_area}",
        "Serbaguna By Area",
    )
    add_result("GET", "/api/v1/serbaguna/areas", "Serbaguna Areas")
    add_result(
        "GET",
        "/api/v1/serbaguna/time-slots",
        "Serbaguna Time Slots",
        params={"date": DATE_SAMPLE, "areaId": serbaguna_area},
    )
    add_result(
        "GET",
        f"/api/v1/serbaguna/available-slots/{DATE_SAMPLE}/{serbaguna_area}",
        "Serbaguna Available Slots",
    )

    dapur_result, dapur_body = add_result("GET", "/api/v1/dapur", "Dapur List")
    dapur_id = None
    dapur_peminjam = user_id or "1"
    dapur_fasilitas = "1"
    if isinstance(dapur_body, dict) and dapur_body.get("data"):
        first_dapur = dapur_body["data"][0]
        dapur_id = first_dapur.get("id")
        dapur_peminjam = first_dapur.get("idPeminjam", dapur_peminjam)
        dapur_fasilitas = first_dapur.get("idFasilitas", dapur_fasilitas)

    add_result(
        "GET",
        f"/api/v1/dapur/{dapur_id or '1'}",
        "Dapur Detail",
        note="Fallback ID used" if not dapur_id else None,
    )
    add_result(
        "GET",
        f"/api/v1/dapur/peminjam/{dapur_peminjam}",
        "Dapur By Peminjam",
    )
    add_result(
        "GET",
        f"/api/v1/dapur/fasilitas/{dapur_fasilitas}",
        "Dapur By Fasilitas",
    )
    add_result("GET", "/api/v1/dapur/facilities", "Dapur Facilities")
    add_result(
        "GET",
        "/api/v1/dapur/time-range",
        "Dapur By Time Range",
        params={"startTime": START_TIME, "endTime": END_TIME},
    )
    add_result(
        "GET",
        "/api/v1/dapur/time-slots",
        "Dapur Time Slots",
        params={"date": DATE_SAMPLE, "facilityId": dapur_fasilitas},
    )

    cewe_result, cewe_body = add_result(
        "GET", "/api/v1/mesin-cuci-cewe", "Mesin Cuci Cewe List"
    )
    cewe_id = None
    cewe_peminjam = user_id or "1"
    cewe_fasilitas = "1"
    if isinstance(cewe_body, dict) and cewe_body.get("data"):
        first_cewe = cewe_body["data"][0]
        cewe_id = first_cewe.get("id")
        cewe_peminjam = first_cewe.get("idPeminjam", cewe_peminjam)
        cewe_fasilitas = first_cewe.get("idFasilitas", cewe_fasilitas)

    add_result(
        "GET",
        f"/api/v1/mesin-cuci-cewe/{cewe_id or '1'}",
        "Mesin Cuci Cewe Detail",
        note="Fallback ID used" if not cewe_id else None,
    )
    add_result(
        "GET",
        f"/api/v1/mesin-cuci-cewe/peminjam/{cewe_peminjam}",
        "Mesin Cuci Cewe By Peminjam",
    )
    add_result(
        "GET",
        f"/api/v1/mesin-cuci-cewe/fasilitas/{cewe_fasilitas}",
        "Mesin Cuci Cewe By Fasilitas",
    )
    add_result("GET", "/api/v1/mesin-cuci-cewe/facilities", "Mesin Cuci Cewe Facilities")
    add_result(
        "GET",
        "/api/v1/mesin-cuci-cewe/time-range",
        "Mesin Cuci Cewe By Time Range",
        params={"startTime": START_TIME, "endTime": END_TIME},
    )
    add_result(
        "GET",
        "/api/v1/mesin-cuci-cewe/time-slots",
        "Mesin Cuci Cewe Time Slots",
        params={"date": DATE_SAMPLE, "facilityId": cewe_fasilitas},
    )

    cowo_result, cowo_body = add_result(
        "GET", "/api/v1/mesin-cuci-cowo", "Mesin Cuci Cowo List"
    )
    cowo_id = None
    cowo_peminjam = user_id or "1"
    cowo_fasilitas = "1"
    if isinstance(cowo_body, dict) and cowo_body.get("data"):
        first_cowo = cowo_body["data"][0]
        cowo_id = first_cowo.get("id")
        cowo_peminjam = first_cowo.get("idPeminjam", cowo_peminjam)
        cowo_fasilitas = first_cowo.get("idFasilitas", cowo_fasilitas)

    add_result(
        "GET",
        f"/api/v1/mesin-cuci-cowo/{cowo_id or '1'}",
        "Mesin Cuci Cowo Detail",
        note="Fallback ID used" if not cowo_id else None,
    )
    add_result(
        "GET",
        f"/api/v1/mesin-cuci-cowo/peminjam/{cowo_peminjam}",
        "Mesin Cuci Cowo By Peminjam",
    )
    add_result(
        "GET",
        f"/api/v1/mesin-cuci-cowo/fasilitas/{cowo_fasilitas}",
        "Mesin Cuci Cowo By Fasilitas",
    )
    add_result("GET", "/api/v1/mesin-cuci-cowo/facilities", "Mesin Cuci Cowo Facilities")
    add_result(
        "GET",
        "/api/v1/mesin-cuci-cowo/time-range",
        "Mesin Cuci Cowo By Time Range",
        params={"startTime": START_TIME, "endTime": END_TIME},
    )
    add_result(
        "GET",
        "/api/v1/mesin-cuci-cowo/time-slots",
        "Mesin Cuci Cowo Time Slots",
        params={"date": DATE_SAMPLE, "facilityId": cowo_fasilitas},
    )

    cws_result, cws_body = add_result("GET", "/api/v1/cws", "CWS List")
    cws_id = None
    cws_penanggung = user_id or "1"
    if isinstance(cws_body, dict) and cws_body.get("data"):
        first_cws = cws_body["data"][0]
        cws_id = first_cws.get("id")
        cws_penanggung = first_cws.get("idPenanggungJawab", cws_penanggung)

    add_result(
        "GET",
        f"/api/v1/cws/{cws_id or '1'}",
        "CWS Detail",
        note="Fallback ID used" if not cws_id else None,
    )
    add_result(
        "GET",
        f"/api/v1/cws/penanggung-jawab/{cws_penanggung}",
        "CWS By Penanggung Jawab",
    )
    add_result(
        "GET",
        f"/api/v1/cws/date/{DATE_SAMPLE}",
        "CWS By Date",
    )
    add_result(
        "GET",
        "/api/v1/cws/time-slots",
        "CWS Time Slots",
        params={"date": DATE_SAMPLE},
    )
    add_result(
        "GET",
        "/api/v1/cws/time-suggestions",
        "CWS Time Suggestions",
        params={"date": DATE_SAMPLE},
    )

    write_results(results)
    print(f"Saved results for {len(results)} endpoints to {OUTPUT_PATH}")
    return 0


def write_results(results: List[Dict[str, Any]]) -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT_PATH.open("w", encoding="utf-8") as fh:
        json.dump(results, fh, indent=2)


if __name__ == "__main__":
    sys.exit(main())
