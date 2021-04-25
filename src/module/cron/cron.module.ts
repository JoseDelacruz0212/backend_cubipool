import { Module } from '@nestjs/common';
import { CronService } from './service/cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cron } from '../../entity/cron.entity';
import { Reserva } from '../../entity/reserva.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Cron,Reserva])],
  providers: [CronService],
  exports:[TypeOrmModule,CronService]
})
export class CronModule {}
