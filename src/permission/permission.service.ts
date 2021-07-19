import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractService } from '../common/abstract.service';
import { Permission, PermissionDocument } from './schemas/permission.schema';

@Injectable()
export class PermissionService extends AbstractService {
    constructor(@InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>) {
        super(permissionModel)
    }
}
