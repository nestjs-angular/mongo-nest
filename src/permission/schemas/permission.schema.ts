import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PermissionDocument = Permission & Document;

@Schema({
    timestamps: true,
    versionKey: false
})
export class Permission {

    @Prop({ type: String, required: true })
    name: string;

}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
