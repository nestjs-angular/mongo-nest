import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ExcludeProperty } from 'nestjs-mongoose-exclude';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema({
    timestamps: true,
    versionKey: false
})
export class User {
    
    @Prop({ type: String, required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;
    
    @Prop({ required: true })
    @ExcludeProperty()
    password: string;

    @Prop({ autopopulate: true, type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
    roleId: string;    
}

export const UserSchema = SchemaFactory.createForClass(User);
