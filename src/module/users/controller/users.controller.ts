import { Controller, Get, Res, Post, Body, Logger, Query, Param, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../services/users.service';
import { CreateUserRequestDTO } from '../dto/createUserRequest.dto';
import { ApiResponse, ApiConflictResponse,  ApiQuery, ApiParam } from '@nestjs/swagger';
import { UserHoursAvailableDTO } from '../dto/createHoursAvailableUser.dto';
import { UserReservationsAvailables } from '../dto/createUserReservationsAvailables.dto';
import { UserHistoryReservations } from '../dto/createUserHistoryReservation.dto';
import { UserResponseDTO } from '../dto/createUserResponse.dto';
@Controller('users')
export class UsersController {


    constructor(private userService: UsersService) { }


    @ApiResponse({ description: "Registro de usuario con éxito", status: 201 })
    @ApiConflictResponse({ description: "Usuario ya registrado", status: 409 })
    @Post()
    async create(@Res() res: Response, @Body() createUser: CreateUserRequestDTO) {

        try {
            const user = await this.userService.create(createUser);
            res.json(user)
        } catch (error) {
            res.status(409).json({ message: "Usuario ya existe" })
        }

    }



    @ApiResponse({ description: "Busca la cantidad de horas disponibles de un alumno ya sea para el dia actual o mañana", status: 200, type: UserHoursAvailableDTO })
    @ApiQuery({ required: true, description: "Hoy o Mañana", name: "date" })
    @ApiParam({ required: true, name: "id", description: "u201413797" })
    @Get(':id/hoursAvailable')
    async findHoursAvailablePerDay(
        @Res() res: Response,
        @Param('id') id: string,
        @Query('date') date: string
    ) {
        Logger.log(`${id} esta buscando horas disponibles para ${date}`, "Busqueda de horas disponibles");


        try {
            const result = await this.userService.findHoursAvailablePerDay(id, date)
            res.json({ "horasDisponibles": result })
            Logger.log(`${id} tiene para ${date} un total de ${result} horas`, "Resultado de busqueda de horas disponibles");


        } catch (error) {
            Logger.error(error);
            // return res.json({"N": "QWE"});
            throw new HttpException("Not found", HttpStatus.NOT_FOUND)
        }

    }


    @ApiResponse({description: "Busca todas las reservas disponibles o historial", status: 200, type: UserReservationsAvailables || UserHistoryReservations})
    @ApiQuery({required: false, name:'availables', description: "true"})
    @ApiParam({required:true, name:'id', description: 'u201413797'})
    @Get(':id/reservations')
    async findAllReservationsByStudent(
        @Res() res:Response,
        @Param('id')id:string,
        @Query('availables') availables:boolean
    ){


        if(availables){
            Logger.log(`${id} esta solicitando sus reservas activas`, "Busqueda de horas disponibles");

            const result =  await this.userService.findAllReservationsAvailableByStudent(id);
            res.json(result);
        }
        else{
            Logger.log(`${id} esta solicitando su historial de reservas`, "Busqueda de horas disponibles");

            const result =  await this.userService.findAllReservations(id);
            res.json(result)
        }

        
    }


    @ApiResponse({description: 'Busca un usuario por código', status:200, type: UserResponseDTO})
    @ApiParam({required:true,name:'id', description: 'u201413797'})
    @Get(':id')
    async findById(
        @Res() res:Response,
        @Param('id') id:string
    ){

        Logger.log(id,"Usuario ID");
        const user =  await this.userService.findById(id);

        res.status(user.status).json(user.response)
    }

}
