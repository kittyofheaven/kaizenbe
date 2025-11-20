import { prisma } from "./database";

export class AccessControlUtil {
  static async isAdmin(userId: bigint): Promise<boolean> {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { accessLevel: true },
    });

    return user?.accessLevel === "ADMIN";
  }
}

