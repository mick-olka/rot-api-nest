import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:4000',
      credentials: true,
    },
  })
  const config = new DocumentBuilder()
    .setTitle('Template')
    .setDescription('Template API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  await app.listen(4000, () => {
    console.log('DOCS: http://localhost:4000/api')
  })
}
bootstrap()
