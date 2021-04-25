import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../entity/user.entity';
import { Repository } from 'typeorm';
import { CreateAuthRequestDTO } from '../dto/createAuthRequest.dto';
import { secretKey } from '../../../key/key';
import { AES, enc } from "crypto-js";
import { CreateAuthResponseDTO } from '../dto/createAuthResponse.dto';

@Injectable()
export class AuthService {


    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }


    async authenticate(credentials: CreateAuthRequestDTO): Promise<CreateAuthResponseDTO | any> {


        const authUser = await this.userRepository.findOne({
            where: {
                codigo: credentials.username,
            }
        })

        if (AES.decrypt(authUser.password, secretKey).toString(enc.Utf8) === credentials.password) {

            return new CreateAuthResponseDTO(authUser);
        }
        else {
            return ErrorEvent;
        }
    }
}
