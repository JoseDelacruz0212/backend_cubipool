import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from '../../../entity/reserva.entity';
import { Repository, MoreThan } from 'typeorm';
import { OfertaCubiculo } from '../../../entity/ofertaCubiculo.entity';
import { CreateOfferReservationDTO } from '../dto/create-offer.dto';
import * as moment from 'moment';
import { CreateOfferReponseDTO } from '../dto/create-offerResponse.dto';
import { addPMorAM } from '../../../utils/algorithms';
import { CreateOfferDetailDTO } from '../dto/create-offerDetail.dto';
import { JoinReservationDTO } from '../dto/create-joinReservation.dto';
import { UserManyReserva } from '../../../entity/userManyReservas.entity';
import { User } from '../../../entity/user.entity';
@Injectable()
export class OffersService {
 
    
    constructor(
        @InjectRepository(Reserva)
        private reservaRepository: Repository<Reserva>,

        @InjectRepository(OfertaCubiculo)
        private ofertaRepository: Repository<OfertaCubiculo>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(UserManyReserva)
        private userManyReservaRepository: Repository<UserManyReserva>,
    ) {}

    async createOffer(offer: CreateOfferReservationDTO) {
        const reserva = await this.reservaRepository.findOne({
            where: { id: offer.reservaId },
        });

        const nuevaOferta = new OfertaCubiculo();

        nuevaOferta.apple = offer.apple;
        nuevaOferta.pizarra = offer.pizarra;
        nuevaOferta.reserva = reserva;
        nuevaOferta.sitios = offer.sitios;
        nuevaOferta.disponible = true;
        await this.reservaRepository.save(reserva);
        await this.ofertaRepository.save(nuevaOferta);

        return true;
    }
    async findByIdReservation(id: number) {
        const offer =  await this.ofertaRepository.findOne({where: {id: id}, relations: ['reserva']})

        
        let createOffer = new CreateOfferReservationDTO()
        createOffer.id =  offer.id;
        createOffer.apple =  offer.apple;
        createOffer.sitios  = offer.sitios;
        createOffer.pizarra =  offer.pizarra
        createOffer.reservaId =  offer.reserva.id

        return await createOffer;
    }
    async findById(id: number) {
        const offer = await this.ofertaRepository.findOne({
            where: { id: id },
            relations: ['reserva'],
        });

        console.log(offer);
        const reserva = await this.reservaRepository.findOne({
            where: { id: offer.reserva.id },
            relations: ['cubiculo'],
        });

        let offerDetail = new CreateOfferDetailDTO();
        offerDetail.appleTv = offer.apple;
        offerDetail.asientos = offer.sitios;
        offerDetail.pizarra = offer.pizarra;
        offerDetail.cubiculoNombre = reserva.cubiculo.nombre;

        return offerDetail;
    }


    async updateOffer(id:number,body: any) {
        let offer =  await this.ofertaRepository.findOne({where:{ id: id}});
        offer =  body;
        await this.ofertaRepository.update(id,offer);
    }

    async getAllOffesAvailable() {
        const offers = await this.ofertaRepository.find({
            where: { disponible: true, sitios: MoreThan(0) },
            relations: ['reserva'],
        });

        if( offers.length < 1){
            return []
        }
        const reserva = await this.reservaRepository.find({
            where: { estado: 'Activado' },
            relations: ['cubiculo'],
        });
        let result: CreateOfferReponseDTO[] = [];

        offers.forEach(offer => {
            reserva.forEach(e => {
                if (offer.reserva.id === e.id) {
                    result.push({
                        apple: offer.apple,
                        pizarra: offer.pizarra,
                        asientos: offer.sitios,
                        cubiculoNombre: e.cubiculo.nombre,
                        horaInicio: addPMorAM(
                            moment(e.hora_inicio).get('hours'),
                        ),
                        horaFin: addPMorAM(moment(e.hora_fin).get('hours')),
                        tema: e.theme,
                        offerId: offer.id
                    });
                }
            });
        });

        return result;
    }

    async joinReservation(joinReservation: JoinReservationDTO) {
        const offer = await this.ofertaRepository.findOne({
            where: { id: joinReservation.ofertaId },
            relations: ['reserva'],
        });

        console.log(offer);

        const student = await this.userRepository.findOne({
            where: { codigo: joinReservation.codigo },
        });

        const reserva = await this.reservaRepository.findOne({
            where: { id: offer.reserva.id },
        });

        const userManyReservas = new UserManyReserva();

        userManyReservas.role = 'Participante';
        userManyReservas.user = student;
        userManyReservas.reserva = reserva;
        userManyReservas.activate = 'true';

        if (joinReservation.apple) {
            offer.apple = false;
        }

        if (joinReservation.pizarra) {
            offer.pizarra = false;
        }

        offer.sitios = offer.sitios - 1;

        await this.ofertaRepository.save(offer);
        await this.userManyReservaRepository.save(userManyReservas);
    }

    async delete(id: number) {
        const offer = await this.ofertaRepository.findOneOrFail({
            where: { id: id },
        });
        offer.disponible = false;
        await this.ofertaRepository.save(offer);
    }
}
