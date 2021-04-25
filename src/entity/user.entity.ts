import { Entity, Column,  PrimaryColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Reserva } from './reserva.entity';
import { UserManyReserva } from './userManyReservas.entity';


@Entity()
export class User {



  @PrimaryColumn()
  codigo:string;
  
  @Column()
  nombres:string;

  @Column()
  apellidos:string;
  
  @Column()
  password:string;


 
  @OneToMany(type => UserManyReserva, userManyReserva=> userManyReserva.user)
  userManyReservas!: UserManyReserva[];
}