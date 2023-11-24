import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';

export type ConnectionDocument = HydratedDocument<Connection>;

@Schema({
  shardKey: {
    externalId: 1,
  },
})
export class Connection {
  @Prop({ type: String, default: () => uuid() })
  _id: string;

  @Prop({ type: Number, unique: true, index: 1 })
  externalId: number;

  @Prop({ type: Number, index: 1 })
  quantity: number;

  @Prop({ type: Number, index: 1 })
  currentTypeId: number;

  @Prop({ type: Number, index: 1 })
  powerKW: number;

  @Prop({ type: Number, index: 1 })
  amps: number;

  @Prop({ type: Number, index: 1 })
  voltage: number;

  @Prop({ type: Number, index: 1 })
  statusTypeId: number;

  @Prop({ type: Number, index: 1 })
  connectionTypeId: number;
}

export const ConnectionSchema = SchemaFactory.createForClass(Connection);
