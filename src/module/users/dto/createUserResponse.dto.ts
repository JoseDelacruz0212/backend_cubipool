import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../../entity/user.entity";

export class UserResponseDTO{

    @ApiProperty()
    codigo:string;

    @ApiProperty()
    nombres:string;

    @ApiProperty()
    apellidos:string;


    constructor(user:User){
        this.codigo =  user.codigo;
        this.nombres= user.nombres;
        this.apellidos =  user.apellidos;
    }   
}