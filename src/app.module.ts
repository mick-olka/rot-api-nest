import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductsModule } from './modules/products/products.module'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { CollectionsModule } from './modules/collections/collections.module'
import { PhotosModule } from './modules/photos/photos.module'
import { TextBlocksModule } from './modules/text_blocks/textBlocks.module'
import { MulterModule } from '@nestjs/platform-express'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { OrdersModule } from './modules/orders/orders.module'
import { EventEmitterModule } from '@nestjs/event-emitter'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    EventEmitterModule.forRoot(),
    MulterModule.register({
      dest: './upload',
    }),
    ServeStaticModule.forRoot({
      // http://localhost:4000/upload/20230130T140642201Z443397.png
      rootPath: join(__dirname, '..', 'upload'),
      serveRoot: '/api/upload/', //last slash is important
    }),
    ProductsModule,
    CollectionsModule,
    PhotosModule,
    AuthModule,
    UsersModule,
    TextBlocksModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
