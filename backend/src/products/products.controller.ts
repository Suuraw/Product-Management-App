import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UseGuards(RoleGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    }),
  }))
  async create(
    @Body() body: { name: string; description: string; category: string; price: string; rating: string; userId: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = {
      name: body.name,
      description: body.description,
      category: body.category,
      price: parseFloat(body.price),
      rating: parseFloat(body.rating),
      userId: body.userId,
      image: file ? file.filename : undefined,
    };
    return this.productsService.createProduct(data);
  }

  @Get()
  getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    return this.productsService.getProducts(parseInt(page), parseInt(limit), sortBy, sortOrder);
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    }),
  }))
  update(
    @Param('id') id: string,
    @Body() body: Partial<{ name: string; description: string; category: string; price: string; rating: string }>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = {
      ...body,
      price: body.price ? parseFloat(body.price) : undefined,
      rating: body.rating ? parseFloat(body.rating) : undefined,
      image: file ? file.filename : undefined,
    };
    return this.productsService.updateProduct(id, data);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  delete(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}