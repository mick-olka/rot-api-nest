import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { OrdersService } from './orders.service'
import { Order } from 'src/schemas/order.schema'
import { PaginationQuery, PromisePaginationResT } from 'src/utils/interfaces'
import mongoose from 'mongoose'
import { AuthGuard } from '@nestjs/passport'

type OrderI = Order & { _id: mongoose.Types.ObjectId }

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched orders.',
  })
  async findAll(
    @Query() query: PaginationQuery,
  ): PromisePaginationResT<OrderI> {
    return this.ordersService.findAll(query)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched order.',
  })
  //   @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  getTodoById(@Param('id') id: string): Promise<OrderI> {
    return this.ordersService.findOne(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created order.',
  })
  //   @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async create(@Body() data: CreateOrderDto): Promise<OrderI> {
    return this.ordersService.create(data)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated order.',
  })
  //   @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateOrderDto,
  ): Promise<OrderI> {
    return this.ordersService.update(id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted order.',
  })
  async delete(@Param('id') id: string): Promise<OrderI> {
    return this.ordersService.delete(id)
  }
}
