import { Controller, Get, Res, Query, Logger } from '@nestjs/common';
import { Response } from 'express';
import { CubiclesService } from '../services/cubicles.service';
import { ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateCubiculoDTO } from '../dto/create-cubiculos.dto';

@Controller('cubicles')
export class CubiclesController {

    constructor(private cubiclesServices: CubiclesService) { }

    @ApiResponse({ description: "Retorna todos los cubìculos disponibles", status: 200, type: [CreateCubiculoDTO] })
    @ApiQuery({ required: true, description: "Fecha (Hoy o Mañana)", name: "date" })
    @ApiQuery({ required: true, description: "Hora de inicio (hh:00,  07 < hh < 22)", name: "startTime" })
    @ApiQuery({ required: true, description: "Horas", name: "hours" })
    @Get()
    async findAvailablesCubicles(
        @Res() res: Response,
        @Query('date') date,
        @Query('startTime') startTime,
        @Query('hours') hours) {


            Logger.log(`Buscando cubìculos`, 'Cubicle Activity')
        try {   
            const allCUbiculesAvailable = await this.cubiclesServices.findCubicles(date, startTime, hours);

            Logger.log(`Ha encontrado ${allCUbiculesAvailable.length} cubìculos`, 'Cubicle Activity')
            res.json(allCUbiculesAvailable);

            
        } catch (error) {
            Logger.error(`Erro de servidor al buscar cubìculos`, 'Cubicle Activity')

            res.status(501).json({ message: "Error en el servidor" })
        }

    }

}
