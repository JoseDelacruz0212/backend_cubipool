import {
    Controller,
    Post,
    Res,
    Body,
    Get,
    Logger,
    Param,
    Put,
    Delete,
} from '@nestjs/common';
import { ReservationService } from '../services/reservation.service';
import { Response } from 'express';
import { CreateReservaDTO } from '../dto/create-reserva.dto';
import { ApiResponse } from '@nestjs/swagger';
import { ReservaDetailDTO } from '../dto/create-reservaDetail.dto';
import { ReservaActivation } from '../dto/create-reservaActivation.dto';

@Controller('reservation')
export class ReservationController {
    constructor(private reservarService: ReservationService) {}

    @ApiResponse({ description: 'Registro de una reserva', status: 201 })
    @Post()
    async createReservation(
        @Res() res: Response,
        @Body() reserva: CreateReservaDTO,
    ) {

        try {
            const response = await this.reservarService.create(reserva);
            res.json(response);
            Logger.log(
                `${reserva.codigo_uno} ha reservado un cubículo`,
                'Reservation Activity',
            );
        } catch (error) {
            res.status(500).json({ message: 'Hubo un error al reservar' });
            Logger.error(`Hubo error al reservar`, 'Reservation Activity');
        }
    }

    @ApiResponse({
        description: 'Ver detalle de reserva',
        status: 201,
        type: ReservaDetailDTO,
    })
    @Get(':id/:code')
    async findReservationById(
        @Res() res: Response,
        @Param('id') id: string,
        @Param('code') code: string,
    ) {
        const result = await this.reservarService.findById(parseInt(id), code);
        res.json(result);
    }

    @Put('/activate')
    async activateReservation(
        @Res() res: Response,
        @Body() reservaActivation: ReservaActivation,
    ) {
        const result = await this.reservarService.activateReservation(
            reservaActivation,
        );
        res.json({ message: 'Reserva realizada' });
    }

    @Delete(':id')
    async delete(@Res() res: Response, @Param('id') id: string) {
        const result = await this.reservarService.delete(parseInt(id));
        res.json(result);
    }
}
