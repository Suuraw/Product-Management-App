import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: { name: string; description: string; category: string; price: number; rating: number; userId: string; image?: string }) {
    return this.prisma.product.create({ data });
  }

  async getProducts(page: number = 1, limit: number = 10, sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc') {
    const skip = (page - 1) * limit;
    return this.prisma.product.findMany({
      skip,
      take: limit,
      orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
    });
  }

  async updateProduct(id: string, data: Partial<{ name: string; description: string; category: string; price: number; rating: number; image?: string }>) {
    return this.prisma.product.update({ where: { id }, data });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
  async getProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }
  async filterProducts(category?: string, priceMin?: number, priceMax?: number, rating?: number) {
    return this.prisma.product.findMany({
      where: {
        ...(category && { category }),
        ...(priceMin && { price: { gte: priceMin } }),
        ...(priceMax && { price: { lte: priceMax } }),
        ...(rating && { rating: { gte: rating } }),
      },
    });
  }

  async searchProducts(query: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }
}