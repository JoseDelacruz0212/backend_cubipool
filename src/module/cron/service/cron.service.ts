import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '../../../entity/cron.entity';
import { Repository } from 'typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Reserva } from '../../../entity/reserva.entity';
import { CronJob } from 'cron';
import { calculateDateForCron } from '../../../utils/algorithms';

@Injectable()
export class CronService {
    constructor(
        @InjectRepository(Cron)
        private cronRepository: Repository<Cron>,

        @InjectRepository(Reserva)
        private reservaRepository: Repository<Reserva>,

        private schedulerRegistry: SchedulerRegistry,
    ) {}

    async initCronJobs() {
        const res = await this.cronRepository.find();
        res.forEach(async e => {
            await this.addActivationEnableJob(
                e.name,
                e.fecha,
                e.horaInicio,
                true,
            );
        });
    }

    async addActivationEnableJob(
        name: any,
        fecha: string,
        horaInicio: string,
        initEvent = false,
    ) {
        const resultsTimes = calculateDateForCron(fecha, horaInicio, 15);

        // const job = new CronJob(
        //     `0 ${resultsTimes.minutos} ${resultsTimes.horaAction} * * ${resultsTimes.dayOfWeek}`,
        //     async () => {
        //         const reserva = await this.reservaRepository.findOne({
        //             where: { id: parseInt(name) },
        //         });

        //         Logger.warn(`Reserva ${name} lista para su activacion`);

        //         reserva.estado = 'PorActivar';

        //         this.reservaRepository.save(reserva);

        //         this.deleteCron(name);
        //     },
        // );
        const job = new CronJob(`0 56 22 * * 4`, async () => {
            const reserva = await this.reservaRepository.findOne({
                where: { id: parseInt(name) },
            });

            Logger.warn(`Reserva ${name} lista para su activacion`);

            reserva.estado = 'PorActivar';

            this.reservaRepository.save(reserva);

            this.deleteCron(name);
        });
        if (!initEvent) {
            await this.createCron({
                fecha: fecha,
                horaInicio: horaInicio,
                name: name,
            });
        }
        console.log('Job finished');
        this.schedulerRegistry.addCronJob(name, job);

        job.start();

        return { qwe: 'qwe' };
    }

    deleteCron(name: string) {
        this.schedulerRegistry.deleteCronJob(name);
        Logger.warn(`La cron de la reserva ${name} ha sido eliminada`);
    }

    async createCron(_cron: Cron | any) {
        let cron = new Cron();
        cron.name = _cron.name;
        cron.fecha = _cron.fecha;
        cron.horaInicio = _cron.horaInicio;
        console.log('cron', cron);

        await this.cronRepository.save(cron);
    }
}
