import {  config} from "dotenv";
config();

/* Llave secreta para el desencriptar las contraseñas */
export const secretKey =  process.env.KEY_PASSWORD