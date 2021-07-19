import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('permissions')
export class PermissionController {
    constructor(
        private permissionService:PermissionService
    ){}


    @Get()
    async all(): Promise<any> {
        return this.permissionService.all();
    }
    
    @Post()
    async create(@Body('name') name: string): Promise<any> {
        return this.permissionService.create({ name });
    }
}
