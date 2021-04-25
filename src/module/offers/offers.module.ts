import { Module, forwardRef } from '@nestjs/common';
import { OffersController } from './controller/offers.controller';
import { OffersService } from './service/offers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from '../../entity/reserva.entity';
import { User } from '../../entity/user.entity';
import { OfertaCubiculo } from '../../entity/ofertaCubiculo.entity';
import { UserManyReserva } from '../../entity/userManyReservas.entity';
import { UsersModule } from '../users/users.module';
import { ReservationModule } from '../reservation/reservation.module';
import { Repository } from 'typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Reserva,
            User,
            OfertaCubiculo,
            UserManyReserva,
        ]),
        UsersModule,
        forwardRef(() => ReservationModule),
    ],
    controllers: [OffersController],
    providers: [OffersService, Repository],
})
export class OffersModule {}
