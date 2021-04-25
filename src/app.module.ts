import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as DB_CONFIGURATION from './config/db.config';
import { UsersModule } from './module/users/users.module';
import { AuthModule } from './module/auth/auth.module';
import { AuthService } from './module/auth/services/auth.service';
import { ReservationModule } from './module/reservation/reservation.module';
import { CubiclesModule } from './module/cubicles/cubicles.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './module/cron/cron.module';
import { CronService } from './module/cron/service/cron.service';
import { OffersModule } from './module/offers/offers.module';
@Module({
    imports: [
        TypeOrmModule.forRoot(DB_CONFIGURATION),
        UsersModule,
        AuthModule,
        ReservationModule,
        CubiclesModule,
        ScheduleModule.forRoot(),
        CronModule,
        OffersModule,
    ],

    controllers: [AppController],
    providers: [AppService, AuthService],
})
export class AppModule {
    // constructor(private cronService:CronService) {
    //     this.cronService.initCronJobs()
    // }

    // async initCron() {
        
    //     console.log("Iniciando los")
    // }
}
