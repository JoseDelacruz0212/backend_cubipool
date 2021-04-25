import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../entity/user.entity';
import { Repository, In, MoreThanOrEqual, Equal, Not } from 'typeorm';
import { CreateUserRequestDTO } from '../dto/createUserRequest.dto';
import { AES } from "crypto-js";
import { secretKey } from '../../../key/key';
import { Reserva } from '../../../entity/reserva.entity';
import { UserManyReserva } from '../../../entity/userManyReservas.entity';
import *  as moment from 'moment';
import { addPMorAM } from '../../../utils/algorithms';
import { UserHistoryReservations } from '../dto/createUserHistoryReservation.dto';
import { UserReservationsAvailables } from '../dto/createUserReservationsAvailables.dto';
import { UserResponseDTO } from '../dto/createUserResponse.dto';
//import { moment().subtract(5,"hours") } from '../../../utils/timeZone';
@Injectable()
export class UsersService {


    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Reserva)
        private reservaRepository: Repository<Reserva>,

        @InjectRepository(UserManyReserva)
        private userManyReservaRepository: Repository<UserManyReserva>
    ) { }


    async create(_newUser: CreateUserRequestDTO) {

        const isUserExist = await this.userRepository.findOne({ where: { codigo: _newUser.code } })

        if (!isUserExist) {

            const newUser = await this.userRepository.create({
                codigo: _newUser.code,
                apellidos: _newUser.lastName,
                nombres: _newUser.name,
                password: AES.encrypt(_newUser.password, secretKey).toString()
            });
            await this.userRepository.save(newUser);
            Logger.log(`${newUser} se ha registrado correctamente`, 'User Activity')
            return { "message": "Usuario creado correctamente" };
        }

        else {
            return ErrorEvent;
        }

    }


    async findAllReservationsAvailableByStudent(code) {
        // Encontrar al usuario

        const user = await this.userRepository.findOneOrFail({ codigo: code })

        const reserva = await this.reservaRepository.find(
            {
                where: { estado: Not("Terminado"), fecha: MoreThanOrEqual(moment().subtract(5,"hours").format("YYYY-MM-DD")) },
                relations: ["cubiculo"]
            })

        
            Logger.log(moment().subtract(5,"hours").format("YYYY-MM-DD"), "FECHA ACTUAL");
        

        // Encontrar las reservas del usuario
        const userManyReserva = await this.userManyReservaRepository.find(
            {
                where: { user: user },
                relations: ["reserva"]
            })


        const createCubiculosDTO: UserReservationsAvailables[] = [];
        
        console.log(reserva);

        userManyReserva.forEach((e) => {
            reserva.forEach((j) => {
                if ( j.id === e.reserva.id) {

                    createCubiculosDTO.push({
                        id: j.id,
                        name: j.cubiculo.nombre,
                        day: j.fecha.toString() === moment().subtract(5,"hours").format("YYYY-MM-DD").toString() ? "Hoy" : "Mañana",
                        startTime: addPMorAM(moment(e.reserva.hora_inicio).get("hours")),
                        endTime: addPMorAM(moment(e.reserva.hora_fin).get("hours")),
                        status: j.estado,

                    })
                }

            })

        })
        return await createCubiculosDTO;
    }


    async findHoursAvailablePerDay(code: string, date) {
        // Encontrar al usuario
        let timeToReservation = " "
        let hoursTotal = 0;
        if (date === "Hoy") {
            timeToReservation = moment().subtract(5,"hours").format('YYYY-MM-DD')

        }
        else if (date == "Mañana") {
            timeToReservation = moment().subtract(5,"hours").add(1, "days").format("YYYY-MM-DD")
        }


        const user = await this.userRepository.findOne({ codigo: code })
        if (!user) {
            Logger.error("Usuario no existe")

            return new ErrorEvent("qwe")
        }

        Logger.log(timeToReservation, "TIME TO RESERVATION");

        // Buscar todas las reservas del dia del usuario
        const reserva = await this.reservaRepository.find({ where: { fecha: timeToReservation } })

        Logger.log(reserva, "RESERVA ARRAY");

        const userManyReserva = await this.userManyReservaRepository.find({ where: { user: user, role: "Admin" }, relations: ["reserva"] })



        if (userManyReserva.length) {

            const time = moment(userManyReserva[0].reserva.hora_inicio).get("hour");
            const time_fin = moment(userManyReserva[0].reserva.hora_fin).get("hour");


            userManyReserva.forEach(e =>{
                reserva.forEach(j=>{
                    if(e.reserva.id === j.id){
                        Logger.log(moment(e.reserva.hora_inicio).get("hour"), "qwe")
                        hoursTotal =  hoursTotal + (moment(e.reserva.hora_fin).get("hour") - moment(e.reserva.hora_inicio).get("hour"))
                        Logger.log(hoursTotal, "HoursTotal")
                    }
                })
            })
            

            return await 2 - hoursTotal

        }
        else {
            return await 2
        }

    }


    async findAllReservations(code) {
        const user = await this.userRepository.findOneOrFail({ codigo: code })

        const reserva = await this.reservaRepository.find(
            {
                where: { estado: "Terminado" },
                relations: ["cubiculo"]
            })




        const createUserHistoryReservations: UserHistoryReservations[] = [];

        // Encontrar las reservas del usuario
        const userManyReserva = await this.userManyReservaRepository.find(
            {
                where: { user: user },
                relations: ["reserva"]
            })

        Logger.log(reserva.length, "Reservas terminadas");
        Logger.log(userManyReserva.length, "Reservas many user terminadas");
        userManyReserva.forEach((e, index) => {
            reserva.forEach((j) => {
                if (j.id === e.reserva.id) {

                    createUserHistoryReservations.push({
                        id: j.id,
                        cubiculoName: j.cubiculo.nombre,
                        fecha: moment().subtract(5,"hours").format("DD-MM-YYYY"),
                        rol: e.role
                    })
                }

            })

        })


        return await createUserHistoryReservations;



    }


    async findById(code:string){
        const user =  await this.userRepository.findOne({codigo:code})
        if(user){
            return {
                status: 200,
                response:new UserResponseDTO(user)
            }
        }else{
            return{
                status:404,
                response: {"message": "Usuario no encontrado"}
            }
        }
    }



}
