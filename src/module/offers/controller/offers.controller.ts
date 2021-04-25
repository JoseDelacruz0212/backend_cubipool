import { Controller, Post, Res, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { OffersService } from '../service/offers.service';
import { Response } from 'express';
import { CreateOfferReservationDTO } from '../dto/create-offer.dto';
import { JoinReservationDTO } from '../dto/create-joinReservation.dto';
import { off } from 'process';

@Controller('offers')
export class OffersController {
    constructor(private offerService: OffersService) {}

    @Get()
    async getAllAvailableOffer(@Res() res: Response) {
        try {
            const result = await this.offerService.getAllOffesAvailable();
            res.json(result);
        } catch (error) {
            res.json({ error: 'error' });
        }
    }

    @Get(':id')
    async findById(@Res() res: Response, @Param('id') id: number) {
        try {
            const result = await this.offerService.findById(id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }
    @Get(':id/reservation')
    async findByIdByReservation(@Res() res: Response, @Param('id') id: number) {
        try {
            const result = await this.offerService.findByIdReservation(id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
    @Post()
    async makeOffer(@Res() res: Response, @Body() offert: CreateOfferReservationDTO) {
        try {
            const result = await this.offerService.createOffer(offert);

            res.json({ message: 'Reservado' });
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    @Post('invitation')
    async joinReservationOffer(@Res() res: Response, @Body() joinReservation: JoinReservationDTO) {
        try {
            const result = await this.offerService.joinReservation(joinReservation);
            res.json({ message: 'Se ha unido con exito a la reserva' });
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }

    @Put(':id')
    async updateOffer(@Res() res: Response, @Param('id') id: number, @Body() body: any) {
        try {
            const reuslt = await this.offerService.updateOffer(id, body);
            res.json({ message: 'Oferta actualizada' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    @Delete(':id')
    async delete(@Res() res: Response, @Param('id') id: number) {
        try {
            const result = await this.offerService.delete(id);
            res.json({ message: 'Se ha eliminado la oferta' });
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    }
}
