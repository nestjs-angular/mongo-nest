import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractService } from '../common/abstract.service';
import { Role, RoleDocument } from './schemas/role.schema';

@Injectable()
export class RoleService extends AbstractService {
    constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {
        super(roleModel)
    }
}
