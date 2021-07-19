import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthGuard } from '../auth/auth.guard';
import { HasPermission } from '../permission/has-permission.decorator';

@UseGuards(AuthGuard)
@Controller('roles')
export class RoleController {
    constructor(
        private roleService: RoleService
    ) {}

    @Get()
    @HasPermission('roles')
    async all(): Promise<any> {
        return this.roleService.all();
    }

    @Post()
    @HasPermission('roles')
    async create(
        @Body() body: CreateRoleDto,
    ){
        return this.roleService.create(body);
    }

    @Get(':id')
    @HasPermission('roles')
    async get(@Param('id') id: string) {
        return this.roleService.findById(id);
    }

    @Put(':id')
    @HasPermission('roles')
    async update(
        @Param('id') id: string,
        @Body() body: UpdateRoleDto,
    ) {
        return this.roleService.update(id, body);
    }

    @Delete(':id')
    @HasPermission('roles')
    async delete(@Param('id') id: string) {
        return this.roleService.delete(id);
    }
}
