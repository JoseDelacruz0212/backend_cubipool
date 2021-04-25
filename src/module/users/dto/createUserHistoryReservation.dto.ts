import { ApiProperty } from "@nestjs/swagger";

export class UserHistoryReservations{

    @ApiProperty()
    id:number;

    @ApiProperty()
    rol:string;

    @ApiProperty()
    fecha:string;

    @ApiProperty()
    cubiculoName:string;
}