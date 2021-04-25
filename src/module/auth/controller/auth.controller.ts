import { Controller, Post, Res, Body, HttpException, Get, Logger } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateAuthRequestDTO } from '../dto/createAuthRequest.dto';
import { Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';
import { CreateAuthResponseDTO } from '../dto/createAuthResponse.dto';

@Controller('auth')
export class AuthController {


    constructor(private authService:AuthService){}

    @ApiResponse({type: CreateAuthResponseDTO,status: 201})
    @ApiResponse({ description:"Credenciales Inválidas",status: 404})

    @Post()
    async authenication(@Res() res:Response, @Body() credentials:CreateAuthRequestDTO){

        try {
            const foundUser = await this.authService.authenticate(credentials);
            res.json(foundUser);

            
        } catch (error) {
            Logger.error(`${credentials} no ingresó sus credenciales correctamente`)
            res.status(404).json({"message": "Credenciales invàlidas"})
        }




    }


}
