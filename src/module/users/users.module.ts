import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { Reserva } from '../../entity/reserva.entity';
import { UserManyReserva } from '../../entity/userManyReservas.entity';

@Module({

  imports: [TypeOrmModule.forFeature([User,Reserva,UserManyReserva])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [TypeOrmModule,UsersService],

})
export class UsersModule {}
