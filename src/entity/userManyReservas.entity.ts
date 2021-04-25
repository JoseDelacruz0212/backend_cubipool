import { Entity, Column, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Reserva } from "./reserva.entity";


@Entity()
export class UserManyReserva{


    @PrimaryGeneratedColumn("rowid")
    id:number;
    
    @Column()
    role:string;
    
    @Column()
    activate:string;

    @ManyToOne(type => User, user => user.userManyReservas)
    public user!: User;

    @ManyToOne(type => Reserva, reserva => reserva.userManyReservas)
    public reserva!: Reserva;

}