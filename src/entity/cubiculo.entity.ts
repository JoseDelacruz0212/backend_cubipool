import { Entity, Column,  PrimaryColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reserva } from './reserva.entity';

@Entity()
export class Cubiculo{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nombre:string;

    @Column()
    sitios_disponibles:number;

    @Column()
    disponible:boolean;

    @OneToMany(type=>Reserva , reserva=> reserva.cubiculo)
    reservas:Reserva[]
}