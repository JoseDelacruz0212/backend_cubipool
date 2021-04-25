import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from '../../../entity/reserva.entity';
import { Repository } from 'typeorm';
import { CreateReservaDTO } from '../dto/create-reserva.dto';
import { Cubiculo } from '../../../entity/cubiculo.entity';
import { User } from '../../../entity/user.entity';
import { UserManyReserva } from '../../../entity/userManyReservas.entity';
import * as moment from 'moment';
import { ReservaDetailDTO } from '../dto/create-reservaDetail.dto';
import { addPMorAM, calculateDateForCron } from '../../../utils/algorithms';
import { UsersService } from '../../../module/users/services/users.service';
import { TIMEZONE_PERU } from '../../../utils/timeZone';
import { ReservaActivation } from '../dto/create-reservaActivation.dto';
import { CronService } from '../../../module/cron/service/cron.service';
import { OfertaCubiculo } from '../../../entity/ofertaCubiculo.entity';

@Injectable()
export class ReservationService {
    constructor(
        @InjectRepository(Reserva)
        private reservaRepository: Repository<Reserva>,

        @InjectRepository(Cubiculo)
        private cubiculoRepository: Repository<Cubiculo>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(UserManyReserva)
        private userManyReservaRepository: Repository<UserManyReserva>,

        @InjectRepository(OfertaCubiculo)
        private ofertaCubiculoRepository: Repository<OfertaCubiculo>,

        private userService: UsersService,

        private cronService: CronService,
    ) {}

    async create(_reserva: CreateReservaDTO) {
        try {
            /**
             *  Entrada de los tiempos del body -> hh:mm (16:00)
             *  La variable creada acontinuaciòn parsea el tiempo a formato UTC
             *  aaaa-mm-ddThh:mm:mil
             *
             * Ejemplo: 16:00 el dia 2020-04-15    -->  2020-04-15T16:00:00
             *
             */

            const UTC_StartTime = `${_reserva.fecha}T${_reserva.hora_inicio}:00`;

            const UTC_EndTime = `${_reserva.fecha}T${_reserva.hora_fin}:00`;

            const UTC_Date = `${_reserva.fecha}T${_reserva.hora_inicio}:00`;

            const reserva = new Reserva();

            const day = moment(UTC_StartTime).get('day') === TIMEZONE_PERU.get('day') ? 'Hoy' : 'Mañana';

            const cubiculoTarget = await this.cubiculoRepository.findOne({
                id: _reserva.cubiculo_id,
            });

            const usuario_owner_1 = await this.userRepository.findOne({
                codigo: _reserva.codigo_uno,
            });

            const usuario_owner_2 = await this.userRepository.findOne({
                codigo: _reserva.codigo_dos,
            });

            const hoursAvailableUser2 = await this.userService.findHoursAvailablePerDay(usuario_owner_2.codigo, day);

            if (hoursAvailableUser2 == 0 || !(hoursAvailableUser2 >= moment(UTC_EndTime).get('hour') - moment(UTC_StartTime).get('hour'))) {
                console.log('error');
                return ErrorEvent;
            }

            const many_to_many_1 = new UserManyReserva();

            many_to_many_1.role = 'Admin';
            many_to_many_1.user = usuario_owner_1;

            const many_to_many_2 = new UserManyReserva();

            many_to_many_2.role = 'Admin';
            many_to_many_2.user = usuario_owner_2;

            reserva.cubiculo = cubiculoTarget;
            reserva.estado = 'PorActivar';
            reserva.fecha = new Date(UTC_Date);
            reserva.hora_fin = new Date(UTC_EndTime);
            reserva.hora_inicio = new Date(UTC_StartTime);
            reserva.sede = _reserva.sede;
            reserva.theme = _reserva.theme;

            await this.reservaRepository.save(reserva);

            many_to_many_2.reserva = reserva;
            many_to_many_1.reserva = reserva;

            many_to_many_2.activate = 'false';
            many_to_many_1.activate = 'false';

            this.cronService.addActivationEnableJob(reserva.id, _reserva.fecha, _reserva.hora_inicio);

            // const cronJob = await this.activationEnableJob(
            //     reserva.id,
            //     _reserva.fecha,
            //     _reserva.hora_inicio,
            // );

            await this.userManyReservaRepository.save(many_to_many_1);

            await this.userManyReservaRepository.save(many_to_many_2);

            return { message: 'Reserva realizada con èxito' };
        } catch (e) {
            return ErrorEvent;
        }
    }

    async findById(id: number, code) {
        const user = await this.userRepository.findOne({
            where: { codigo: code },
        });

        const reserva = await this.reservaRepository.findOne({
            where: { id: id },
            relations: ['cubiculo'],
        });
        const userManyReservas = await this.userManyReservaRepository.find({
            where: { reserva: reserva },
            relations: ['user', 'reserva'],
        });
        const userManyReservasStatus = await this.userManyReservaRepository.find({ where: { user: user, reserva: reserva } });

        const offer = await this.ofertaCubiculoRepository.find({
            where: { reserva: reserva, disponible: true },
        });

        let reservationDetailDTO = new ReservaDetailDTO();

        reservationDetailDTO.cubiculoNombre = reserva.cubiculo.nombre;
        reservationDetailDTO.horaInicio = addPMorAM(moment(reserva.hora_inicio).get('hour'));
        reservationDetailDTO.horaFin = addPMorAM(moment(reserva.hora_fin).get('hour'));
        reservationDetailDTO.tema = reserva.theme;
        reservationDetailDTO.estado = reserva.estado;
        reservationDetailDTO.sitiosDisponible = 6 - userManyReservas.length;
        reservationDetailDTO.sede = reserva.sede;
        reservationDetailDTO.participantes = [];
        reservationDetailDTO.rol = userManyReservasStatus[0].role;
        reservationDetailDTO.activate = userManyReservasStatus[0].activate;
        reservationDetailDTO.offer = offer;
        userManyReservas.forEach(e => {
            reservationDetailDTO.participantes.push({
                codigo: e.user.codigo,
                nombre: e.user.nombres.split(' ')[0] + ' ' + e.user.apellidos,
            });
        });
        return reservationDetailDTO;
    }

    async activateReservation(reservaActivate: ReservaActivation) {
        console.log('Reserva', reservaActivate);
        console.log('Reserva,id', reservaActivate.reservaId);
        const user = await this.userRepository.findOne({
            where: { codigo: reservaActivate.codigo },
        });

        const reserva = await this.reservaRepository.findOne({
            where: { id: reservaActivate.reservaId },
        });
        const userManyReservas = await this.userManyReservaRepository.find({
            where: { user: user, reserva: reserva },
        });

        if (reserva.estado == 'PorActivar') {
            reserva.estado = 'Activado1';
        } else if (reserva.estado === 'Activado1') {
            reserva.estado = 'Activado';
        }

        userManyReservas[0].activate = 'true';

        await this.userManyReservaRepository.save(userManyReservas);

        await this.reservaRepository.save(reserva);

        return await { '2': 3 };
    }

    async delete(id: number) {
        const reserva = await this.reservaRepository.findOne({
            where: { id: id },
        });
        const usermanyreservas = await this.userManyReservaRepository.find({
            where: { reserva: reserva },
        });

        const ofertaCubiculo = await this.ofertaCubiculoRepository.findOne({
            where: { reserva: reserva },
        });

        if (!ofertaCubiculo) {
            this.userManyReservaRepository.remove(usermanyreservas).then(() => {
                this.reservaRepository.delete(reserva);
            });
        } else {
            await this.ofertaCubiculoRepository
                .delete(ofertaCubiculo)
                .then(async () => {
                    await this.userManyReservaRepository.remove(usermanyreservas);
                })
                .then(async () => {
                    await this.reservaRepository.delete(reserva);
                });
        }

        return { message: 'Se ha removido con exito la reserva' };
    }
}
