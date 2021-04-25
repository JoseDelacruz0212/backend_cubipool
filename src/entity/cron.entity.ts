import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity()
export class Cron{

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column()
    fecha:string

    @Column()
    horaInicio:string

}