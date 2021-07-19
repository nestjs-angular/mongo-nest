import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';

@Module({
    imports: [
        forwardRef(()=> UserModule),
        CommonModule
    ],
    controllers: [AuthController],
    providers:[ AuthService ],
    exports: [AuthService]
})
export class AuthModule { }
