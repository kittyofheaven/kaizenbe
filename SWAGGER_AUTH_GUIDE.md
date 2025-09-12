# 🔐 Swagger JWT Authentication Guide

## 📋 Step-by-Step: Cara Menggunakan JWT Token di Swagger UI

### 🚀 Quick Steps

1. **Buka Swagger UI** → http://localhost:3000/api/docs
2. **Login dulu untuk dapat token** → Test `/api/v1/auth/login`
3. **Copy JWT token** → Dari response login
4. **Click tombol "Authorize"** → Di kanan atas Swagger
5. **Paste token** → Tanpa kata "Bearer"
6. **Test protected endpoints** → Sekarang bisa akses semua API

---

## 🔑 Detailed Instructions

### Step 1: Buka Swagger UI

```
http://localhost:3000/api/docs
```

### Step 2: Test Login Endpoint

1. **Cari endpoint** `/api/v1/auth/login`
2. **Click "Try it out"**
3. **Isi Request Body:**

```json
{
  "nomorWa": "+6285790826168",
  "password": "12345678"
}
```

4. **Click "Execute"**

### Step 3: Copy JWT Token

Dari response login, copy token (tanpa quotes):

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzU3NjY3NzA4LCJleHAiOjE3NTc2NzEzMDh9.-J7ErQAUDl90c4ZBJvK4GzEODgiZizc1piJU5QCARXY",
    "expiresIn": "1h"
  }
}
```

**Copy yang ini:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzU3NjY3NzA4LCJleHAiOjE3NTc2NzEzMDh9.-J7ErQAUDl90c4ZBJvK4GzEODgiZizc1piJU5QCARXY
```

### Step 4: Authorize di Swagger

1. **Click tombol "Authorize"** (🔒) di kanan atas Swagger UI
2. **Paste token** di field "Value" (TANPA kata "Bearer")
3. **Click "Authorize"**
4. **Click "Close"**

### Step 5: Test Protected Endpoints

Sekarang semua endpoint yang butuh authentication bisa ditest:

- ✅ `/api/v1/users` - Get all users
- ✅ `/api/v1/auth/profile` - Get user profile  
- ✅ `/api/v1/communal` - Communal bookings
- ✅ `/api/v1/serbaguna` - Serbaguna bookings
- ✅ Dan semua endpoint lainnya

---

## 🎯 Visual Guide

### 1. Login Response
```
POST /api/v1/auth/login

Response:
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." ← COPY INI
  }
}
```

### 2. Authorize Button
```
[Swagger UI Header]
┌─────────────────────────────────────┐
│ Kaizen API                [Authorize] │ ← CLICK INI
└─────────────────────────────────────┘
```

### 3. Authorization Modal
```
┌─────────────────────────────────────┐
│ Available authorizations            │
│                                     │
│ bearerAuth (http, bearer)           │
│ ┌─────────────────────────────────┐ │
│ │ Value: [paste_token_here]       │ │ ← PASTE TOKEN TANPA "Bearer"
│ └─────────────────────────────────┘ │
│                                     │
│           [Authorize] [Close]       │
└─────────────────────────────────────┘
```

### 4. Authorized Status
```
[Swagger UI Header]
┌─────────────────────────────────────┐
│ Kaizen API              [Logout] 🔓 │ ← Berubah jadi "Logout"
└─────────────────────────────────────┘

[Protected Endpoints]
🔒 GET /api/v1/users           ← Lock icon hilang
🔒 GET /api/v1/auth/profile    ← Bisa ditest sekarang
```

---

## 🧪 Test Credentials

### User 1: Test User
```json
{
  "nomorWa": "+6281234567890",
  "password": "password123"
}
```

### User 2: Hazel
```json
{
  "nomorWa": "+6285790826168", 
  "password": "12345678"
}
```

---

## ❗ Important Notes

### ✅ DO's:
- ✅ Paste token TANPA kata "Bearer"
- ✅ Copy full token dari response login
- ✅ Login dulu sebelum test protected endpoints
- ✅ Token berlaku 1 jam setelah login

### ❌ DON'Ts:
- ❌ Jangan tambah "Bearer " di depan token
- ❌ Jangan copy quotes ("")
- ❌ Jangan gunakan expired token
- ❌ Jangan lupa logout setelah selesai

---

## 🔄 Token Expired?

Jika token expired (setelah 1 jam):

1. **Click "Logout"** di Swagger UI
2. **Login ulang** di `/api/v1/auth/login`
3. **Copy token baru**
4. **Authorize lagi** dengan token baru

---

## 🚨 Troubleshooting

### Problem: "Unauthorized" error
**Solution:** Token belum di-set atau expired. Ulangi step authorize.

### Problem: "Invalid token format"  
**Solution:** Jangan tambah "Bearer " di depan token.

### Problem: Tombol "Authorize" tidak muncul
**Solution:** Refresh page dan coba lagi.

### Problem: Token tidak work
**Solution:** 
1. Check token masih valid (belum 1 jam)
2. Copy ulang token dari login response
3. Logout dan authorize ulang

---

## 🎉 Success!

Setelah authorize berhasil, semua protected endpoints bisa ditest langsung dari Swagger UI tanpa perlu copy-paste token manual lagi!

**Happy Testing! 🚀**
