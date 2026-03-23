import { prisma } from './prisma.service';

export const userService = {
  async createUser(email: string, name?: string) {
    return prisma.user.create({
      data: { email, name },
    });
  },

  async getUsers() {
    return prisma.user.findMany();
  },

  async getUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  },
};