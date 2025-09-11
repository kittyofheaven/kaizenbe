export class TimeValidationUtil {
  /**
   * Validate 1-hour time slots (e.g., 1:00-2:00, 2:00-3:00)
   */
  static validateOneHourSlot(waktuMulai: Date, waktuBerakhir: Date): boolean {
    const diffInMs = waktuBerakhir.getTime() - waktuMulai.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    // Must be exactly 1 hour
    if (diffInHours !== 1) {
      return false;
    }

    // Must start at exact hour (minutes and seconds should be 0)
    if (
      waktuMulai.getMinutes() !== 0 ||
      waktuMulai.getSeconds() !== 0 ||
      waktuMulai.getMilliseconds() !== 0
    ) {
      return false;
    }

    // Must end at exact hour
    if (
      waktuBerakhir.getMinutes() !== 0 ||
      waktuBerakhir.getSeconds() !== 0 ||
      waktuBerakhir.getMilliseconds() !== 0
    ) {
      return false;
    }

    return true;
  }

  /**
   * Validate 2-hour time slots for CWS (e.g., 1:00-3:00, 3:00-5:00)
   */
  static validateTwoHourSlot(waktuMulai: Date, waktuBerakhir: Date): boolean {
    const diffInMs = waktuBerakhir.getTime() - waktuMulai.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    // Must be exactly 2 hours
    if (diffInHours !== 2) {
      return false;
    }

    // Must start at exact hour
    if (
      waktuMulai.getMinutes() !== 0 ||
      waktuMulai.getSeconds() !== 0 ||
      waktuMulai.getMilliseconds() !== 0
    ) {
      return false;
    }

    // Must end at exact hour
    if (
      waktuBerakhir.getMinutes() !== 0 ||
      waktuBerakhir.getSeconds() !== 0 ||
      waktuBerakhir.getMilliseconds() !== 0
    ) {
      return false;
    }

    return true;
  }

  /**
   * Get suggested time slots for 1-hour bookings
   */
  static getOneHourTimeSlots(
    date: Date
  ): { waktuMulai: Date; waktuBerakhir: Date }[] {
    const slots = [];
    const baseDate = new Date(date);
    baseDate.setHours(6, 0, 0, 0); // Start from 6 AM

    // Generate slots from 6 AM to 10 PM (16 slots)
    for (let hour = 6; hour < 22; hour++) {
      const waktuMulai = new Date(baseDate);
      waktuMulai.setHours(hour);

      const waktuBerakhir = new Date(baseDate);
      waktuBerakhir.setHours(hour + 1);

      slots.push({ waktuMulai, waktuBerakhir });
    }

    return slots;
  }

  /**
   * Get suggested time slots for 2-hour bookings (CWS)
   */
  static getTwoHourTimeSlots(
    date: Date
  ): { waktuMulai: Date; waktuBerakhir: Date }[] {
    const slots = [];
    const baseDate = new Date(date);
    baseDate.setHours(6, 0, 0, 0); // Start from 6 AM

    // Generate slots from 6 AM to 10 PM (8 slots)
    for (let hour = 6; hour < 22; hour += 2) {
      const waktuMulai = new Date(baseDate);
      waktuMulai.setHours(hour);

      const waktuBerakhir = new Date(baseDate);
      waktuBerakhir.setHours(hour + 2);

      slots.push({ waktuMulai, waktuBerakhir });
    }

    return slots;
  }

  /**
   * Format time slot for display
   */
  static formatTimeSlot(waktuMulai: Date, waktuBerakhir: Date): string {
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    return `${formatTime(waktuMulai)} - ${formatTime(waktuBerakhir)}`;
  }

  /**
   * Check if time is in the past
   */
  static isTimeInPast(waktuMulai: Date): boolean {
    return waktuMulai.getTime() < new Date().getTime();
  }

  /**
   * Validate time is not in the past
   */
  static validateFutureTime(waktuMulai: Date): boolean {
    return !this.isTimeInPast(waktuMulai);
  }
}
