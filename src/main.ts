import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UsersService } from './module/users/services/users.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const options = new DocumentBuilder()
        .setTitle('Cubiculo Pool')
        .setDescription('Descripcion del API')
        .setVersion('1.0')
        .addTag('UPC')
        .build();

    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT || 3000);
}
bootstrap();