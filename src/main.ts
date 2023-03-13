import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as bodyParser from 'body-parser'
import { AppModule } from './app.module'
import { constants } from './utils/constants'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    // origin: 'http://localhost:5173',
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  })
  app.setGlobalPrefix('/api')
  app.useGlobalPipes(new ValidationPipe())
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  const config = new DocumentBuilder()
    .setTitle('Template')
    .setDescription('Template API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)
  await app.listen(4000, () => {
    console.log('DOCS: http://localhost:4000/api-docs')
    constants.ADMIN_KEY = process.env.ADMIN_KEY
  })
}
bootstrap()
