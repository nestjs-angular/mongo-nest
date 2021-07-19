import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { AbstractService } from '../common/abstract.service';

@Injectable()
export class UserService extends AbstractService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
        super(userModel)
     }

}
