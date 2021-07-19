import { BadRequestException, Body, Controller, Post, UseInterceptors, Res, NotFoundException, Get, Req } from '@nestjs/common';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@UseInterceptors(new SanitizeMongooseModelInterceptor({
    excludeMongooseId: false,
    excludeMongooseV: true
}))
@Controller()
export class AuthController {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private authService: AuthService
    ) {}

    @Post('register')
    async register(@Body() body: RegisterDto) {
        if (body.password !== body.passwordConfirm) throw new BadRequestException('Contraseñas no son iguales');
        const emailExists = await this.userService.findOne({ email: body.email });
        if (emailExists) throw new BadRequestException('Correo ya esta registrado');
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(body.password, salt);
        return this.userService.create({ ...body, password: hash });
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) response: Response
    ) {
        console.log(email)
        const user = await this.userService.findOne({email});
        if (!user) throw new NotFoundException('Usuario no encontrado');
        if (!await bcrypt.compare(password, user.password)) throw new BadRequestException('Usuario o contraseña invalido');
        const jwt = await this.jwtService.signAsync({id: user._id});
        response.cookie('jwt', jwt, { httpOnly: true })
        return user;
    }

    @Get('user')
    async user(@Req() request: Request) {
        const id = await this.authService.userId(request);
        return this.userService.findById(id);
    }

    @Post('logout')
    async logout(
        @Res({ passthrough: true }) response: Response
    ) {
        response.clearCookie('jwt');
        return {
            message: 'Success'
        }
    }
}
