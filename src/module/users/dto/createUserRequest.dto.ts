import {  IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDTO{

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(10)
    code:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastName:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password:string;
}