import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Permission } from 'src/permission/schemas/permission.schema';

export type RoleDocument = Role & Document;

@Schema({
    timestamps: true,
    versionKey: false
})
export class Role {
    
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ autopopulate: true, type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }] })
    permissions: Permission[];

}

export const RoleSchema = SchemaFactory.createForClass(Role);
