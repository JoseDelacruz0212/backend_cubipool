import {  config} from "dotenv";
import { User } from "../entity/user.entity";
import { ConnectionOptions } from "typeorm";
import { Reserva } from "../entity/reserva.entity";
import { Cubiculo } from "../entity/cubiculo.entity";
import { UserManyReserva } from "../entity/userManyReservas.entity";
import { Cron } from "../entity/cron.entity";
import { OfertaCubiculo } from "../entity/ofertaCubiculo.entity";
config();
 const DB_CONFIGURATION :ConnectionOptions = {
    type: "postgres",
    host: '127.0.0.1',
    port: parseInt(process.env.DATABASE_PORT),
    username: 'postgres',
    password: 'admin',
    database: 'cubipool',
    entities: [User, Reserva,Cubiculo,UserManyReserva, Cron,OfertaCubiculo],
    synchronize: false,
    logging: false,
    migrationsRun:true,
    migrationsTableName: 'migration',
    migrations: ['dist/migrations/*.js'],
    cli: {
        "entitiesDir": "dist/entity/*.js",
        "migrationsDir": "src/migrations"
    },
    
  
}

export =  DB_CONFIGURATION