import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService
  ){}
  async canActivate(context: ExecutionContext) {
    const access = this.reflector.get<string>('access', context.getHandler());
    if (!access) {
      console.log('gaaaaaaaaaaaaaaa')
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const id = await this.authService.userId(request);
    const {roleId}: User = await this.userService.findById(id);
    const role = await this.roleService.findById(roleId);
    if (request.method === 'GET') {
      return role.permissions.some(p => (p.name === `view_${access}`) || (p.name === `view_${access}`));
    }
    return role.permissions.some(p => p.name === `edit_${access}`);
  }
}
