import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { SanitizeMongooseModelInterceptor } from 'nestjs-mongoose-exclude';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { HasPermission } from '../permission/has-permission.decorator';

@UseInterceptors(new SanitizeMongooseModelInterceptor({
    excludeMongooseId: false,
    excludeMongooseV: true
}))
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Get('all')
    async all(): Promise<any> {
        return this.userService.all();
    }

    @Get()
    @HasPermission('users')
    async paginate(
        @Query('page') page: number,
        @Query('pageSizes') pageSizes: number,
        @Query('q') q: string
    ): Promise<any> {
        // Paginación, clafica y busca por campos
        return this.userService.paginate(
            page, // pagina
            pageSizes, // tamaños de página
            { _id: -1 }, // SORT
            { q, inputs: ['firstName', 'lastName', 'email'] } // OR campos para buscar
        );
    }

    @Get(':id')
    @HasPermission('users')
    async get(@Param('id') id: string) {
        return this.userService.findById(id);
    }

    @Post()
    @HasPermission('users')
    async create(@Body() body: CreateUserDto): Promise<User> {
        const emailExists = await this.userService.findOne({ email: body.email });
        if (emailExists) throw new BadRequestException('Correo ya esta registrado');
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(body.password, salt);
        const roleId = body.roleId || '60f5d3a5e9f5e90d2056811d';
        return this.userService.create({ ...body, password: hash,  roleId});
    }

    @Put(':id')
    @HasPermission('users')
    async update(
        @Param('id') id: string,
        @Body() body: UpdateUserDto
    ) {
        delete body.email;
        const user = await this.userService.findById(id);
        if (!user) throw new NotFoundException('No existe un usuario por ese id');
        return this.userService.update(id, body);
    }

    @Delete(':id')
    @HasPermission('users')
    async delete(@Param('id') id: string) {
        const user = await this.userService.findById(id);
        if (!user) throw new NotFoundException('No existe un usuario por ese id');
        return this.userService.delete(id);
    }

}
