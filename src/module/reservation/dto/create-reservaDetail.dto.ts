import { ApiProperty } from "@nestjs/swagger";




 class Student{
    codigo:string;
    nombre:string;     
 }


export class ReservaDetailDTO{

    @ApiProperty()
    cubiculoNombre:string;
    
    @ApiProperty()
    sede:string;
    
    @ApiProperty()
    horaInicio:string;
    
    @ApiProperty()
    horaFin:string;
    
    @ApiProperty()
    participantes:Student[]
    
    @ApiProperty()
    tema:string;
    
    @ApiProperty()
    sitiosDisponible:number;
    
    @ApiProperty()
    estado:string;

    @ApiProperty()
    activate:string;

    @ApiProperty()
    rol:string;

    @ApiProperty()
    offer:any;
    
    constructor(){}
}