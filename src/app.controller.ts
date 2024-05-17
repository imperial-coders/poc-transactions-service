import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Query,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Transaction as TransactionModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('transactions/:id')
  async getPostById(@Param('id') id: string): Promise<TransactionModel> {
    return this.prismaService.transaction.findUnique({
      where: { id: Number(id) },
    });
  }

  @Get('transactions')
  async getFilteredPosts(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
    @Query('searchString') searchString?: string,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
  ): Promise<TransactionModel[]> {
    const or = searchString
      ? {
          OR: [
            { summary: { contains: searchString } },
            { merchange: { contains: searchString } },
          ],
        }
      : {};

    return this.prismaService.transaction.findMany({
      where: {
        ...or,
      },
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      orderBy: {
        updatedAt: orderBy,
      },
    });
  }

  @Post('transaction')
  async createDraft(
    @Body()
    postData: {
      merchant?: string;
      amountInCents: number;
      summary?: string;
      transactionDate: Date;
    },
  ): Promise<TransactionModel> {
    const { merchant, amountInCents, summary, transactionDate } = postData;
    return this.prismaService.transaction.create({
      data: {
        merchant,
        amountInCents,
        summary,
        transactionDate,
      },
    });
  }

  @Delete('transactions/:id')
  async deleteTransaction(@Param('id') id: string): Promise<TransactionModel> {
    return this.prismaService.transaction.delete({ where: { id: Number(id) } });
  }
}
