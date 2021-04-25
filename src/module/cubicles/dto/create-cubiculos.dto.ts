import { Cubiculo } from "../../../entity/cubiculo.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCubiculoDTO{

    @ApiProperty()
    public id:number;

    @ApiProperty()
    public name:string;
    
    @ApiProperty()
    public startTime:string;
    
    @ApiProperty()
    public endTime:string;
    
    @ApiProperty()
    public day:string;


    constructor(cubiculo:Cubiculo | any){
        this.id =  cubiculo.id;
        this.name = cubiculo.nombre
        this.startTime =  cubiculo.startTime
        this.endTime =  cubiculo.endTime
        this.day  = cubiculo.day

    }

}