/**
 * Utility class for handling BigInt serialization in API responses
 */
export class BigIntSerializer {
  /**
   * Convert BigInt fields to string for JSON serialization
   */
  static serialize(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === "bigint") {
      return obj.toString();
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.serialize(item));
    }

    if (typeof obj === "object") {
      const serialized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        serialized[key] = this.serialize(value);
      }
      return serialized;
    }

    return obj;
  }

  /**
   * Configure global BigInt serialization for JSON.stringify
   */
  static configureGlobalSerialization(): void {
    // @ts-ignore
    BigInt.prototype.toJSON = function () {
      return this.toString();
    };
  }
}
