import { ApiProperty } from "@nestjs/swagger";

export class UserHoursAvailableDTO{
    @ApiProperty()
    horasDisponibles:number 
}