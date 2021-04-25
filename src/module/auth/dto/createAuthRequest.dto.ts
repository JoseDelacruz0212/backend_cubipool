import {  IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthRequestDTO{
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password:string;
}