import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Reserva } from './reserva.entity';

@Entity()
export class OfertaCubiculo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    apple: boolean;

    @Column()
    pizarra: boolean;

    @Column()
    sitios: number;

    @ManyToOne(
        type => Reserva,
        reserva => reserva.ofertas,
    )
    reserva: Reserva;

    @Column()
    disponible:boolean;
}
