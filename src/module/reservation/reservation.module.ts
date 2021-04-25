import { Module, forwardRef } from '@nestjs/common';
import { ReservationService } from './services/reservation.service';
import { ReservationController } from './controller/reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from '../../entity/reserva.entity';
import { User } from '../../entity/user.entity';
import { Cubiculo } from '../../entity/cubiculo.entity';
import { Repository } from 'typeorm';
import { UserManyReserva } from '../../entity/userManyReservas.entity';
import { UsersModule } from '../users/users.module';
import { CronModule } from '../cron/cron.module';
import { OfertaCubiculo } from '../../entity/ofertaCubiculo.entity';
import { OffersModule } from '../offers/offers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva,User,Cubiculo,UserManyReserva, OfertaCubiculo]),UsersModule,CronModule, forwardRef(()=>OffersModule)],
  providers: [ReservationService,Repository],
  controllers: [ReservationController],
  
})
export class ReservationModule {}
