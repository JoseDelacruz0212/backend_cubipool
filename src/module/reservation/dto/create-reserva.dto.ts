import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateReservaDTO{


    @ApiProperty()
    @IsNotEmpty()
    fecha:string;

    @IsNotEmpty()
    @ApiProperty()
    hora_inicio:string;
    
    @IsNotEmpty()
    @ApiProperty()
    hora_fin:string;
    
    @IsNotEmpty()
    @ApiProperty()
    sede:string;
    
    @IsNotEmpty()
    @ApiProperty()
    codigo_uno:string;
    
    @IsNotEmpty()
    @ApiProperty()
    codigo_dos:string;
    
    @IsNotEmpty()
    @ApiProperty()
    cubiculo_id:number;

    @IsNotEmpty()
    @ApiProperty()
    theme:string;
}