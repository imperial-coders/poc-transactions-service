import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Transaction as TransactionModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('transactions')
  async getTransactionsById(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
    ids: string[],
  ): Promise<TransactionModel[]> {
    return this.prismaService.transaction.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  @Get('transactions/search')
  async search(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
    @Query('keywords') keywords?: string,
    @Query('userId') userId?: string,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
  ): Promise<{
    results: TransactionModel[];
    total: number;
  }> {
    const [total, results] = await Promise.all([
      this.prismaService.transaction.count({
        where: {
          ...(userId && { userId }),
          ...(keywords && {
            OR: [
              { summary: { contains: keywords } },
              { merchant: { contains: keywords } },
            ],
          }),
        },
      }),
      this.prismaService.transaction.findMany({
        where: {
          ...(userId && { userId }),
          ...(keywords && {
            OR: [
              { summary: { contains: keywords } },
              { merchant: { contains: keywords } },
            ],
          }),
        },
        take: Number(take) || undefined,
        skip: Number(skip) || undefined,
        orderBy: {
          updatedAt: orderBy ?? 'desc',
        },
      }),
    ]);

    return {
      results,
      total,
    };
  }

  // @Post('transaction')
  // async createDraft(
  //   @Body()
  //   postData: {
  //     merchant?: string;
  //     amountInCents: number;
  //     summary?: string;
  //     transactionDate: Date;
  //   },
  // ): Promise<TransactionModel> {
  //   const { merchant, amountInCents, summary, transactionDate } = postData;
  //   return this.prismaService.transaction.create({
  //     data: {
  //       merchant,
  //       amountInCents,
  //       summary,
  //       transactionDate,
  //     },
  //   });
  // }

  @Delete('transactions/:id')
  async deleteTransaction(@Param('id') id: string): Promise<TransactionModel> {
    return this.prismaService.transaction.delete({ where: { id } });
  }
}
