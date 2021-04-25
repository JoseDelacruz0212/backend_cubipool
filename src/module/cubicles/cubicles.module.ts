import { Module } from '@nestjs/common';
import { CubiclesService } from './services/cubicles.service';
import { CubiclesController } from './controller/cubicles.controller';
import { Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from '../../entity/reserva.entity';
import { Cubiculo } from '../../entity/cubiculo.entity';

@Module({
  imports:  [TypeOrmModule.forFeature([Reserva,Cubiculo])],
  providers: [CubiclesService,Repository],
  controllers: [CubiclesController]
})
export class CubiclesModule {}
