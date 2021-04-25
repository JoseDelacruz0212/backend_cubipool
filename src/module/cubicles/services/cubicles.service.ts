import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from '../../../entity/reserva.entity';
import { Repository, Not, In } from 'typeorm';
import { Cubiculo } from '../../../entity/cubiculo.entity';
import * as moment from "moment";
import { CreateCubiculoDTO } from '../dto/create-cubiculos.dto';
import { addPMorAM } from '../../../utils/algorithms';
import { TIMEZONE_PERU } from '../../../utils/timeZone';

@Injectable()
export class CubiclesService {

    constructor(
        @InjectRepository(Reserva)
        private reservaRepository: Repository<Reserva>,

        @InjectRepository(Cubiculo)
        private cubiculoRepository: Repository<Cubiculo>,
    ) {

    }


    async findCubicles(_date: any, _startTime: any, _hours: number): Promise<CreateCubiculoDTO[]> {

    
        let timeToReservation  =" "
        if(_date === "Hoy"){
            _date = TIMEZONE_PERU.format('YYYY-MM-DD')

            timeToReservation = "Hoy"
        }
        else if(_date === "Mañana"){
            _date = TIMEZONE_PERU.add(1,"days").format("YYYY-MM-DD")
            timeToReservation =  "Mañana"
        }

        const startTime = TIMEZONE_PERU.utc().format(`${_date}T${_startTime}:00`);

        const endHour = moment(startTime).add(_hours, 'hour').get("hour");

        const endTime = TIMEZONE_PERU.utc().format(`${_date}T${endHour}:00:00`)

      
      
        /**
         * Busca todas las reservas que existen en los intervalos de hora establicadas en el parametros
         * para luego sacar los cubiculos que ya esta reservados y posteriormente sacar los id de los cubiculos
         * que estan ocupado y poder diferenciar de los cubiculos disponibles
         */
        const allReservations = await this.reservaRepository.createQueryBuilder("reserva")
            .where("hora_inicio = :startTime", { startTime })
            .orWhere("hora_fin > :endTime", { endTime })
            .andWhere("hora_inicio < :endTime", { endTime })
            .orWhere("hora_fin > :startTime", { startTime })
            .andWhere("hora_inicio < :startTime", { startTime })
            .execute()



        /**
         * Busca todos los cubiculos en lo que sus id son distintos a los encontrados en la variable allReservations
         */
        const cubiculos = await this.cubiculoRepository.find({
            where: { id: Not(In((allReservations.length) ? allReservations.map(e => e.reserva_cubiculoId) : [0])) }
            , order: { id: "ASC" }
        })


        /**
         * DTO
         */
        const createCubiculosDTO: CreateCubiculoDTO[] = [];



        /**
         * Booleano para saber si la reserva es para hoy o mañana
         * true: mañana
         * false: hoy
         */
        


        /**
         * Rellenando datos al DTO
         */
        cubiculos.forEach(e => {
            createCubiculosDTO.push({
                id: e.id,
                name: e.nombre,
                day: timeToReservation,
                startTime: addPMorAM(moment(startTime).get("hours")),
                endTime: addPMorAM(endHour),
            })
        })



        return createCubiculosDTO;
    }
}
