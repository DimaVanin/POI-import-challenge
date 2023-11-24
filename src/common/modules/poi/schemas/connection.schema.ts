import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';

export type ConnectionDocument = HydratedDocument<Connection>;

@Schema({
  shardKey: { externalId: 1 },
})
export class Connection {
  @Prop({ type: String, default: () => uuid() })
  _id: string;

  @Prop({ type: Number, unique: true })
  externalId: number;

  @Prop({ type: Number })
  quantity: number;

  @Prop({ type: Number })
  currentTypeId: number;

  @Prop({ type: Number })
  powerKW: number;

  @Prop({ type: Number })
  amps: number;

  @Prop({ type: Number })
  voltage: number;

  @Prop({ type: Number })
  statusTypeId: number;

  @Prop({ type: Number })
  connectionTypeId: number;
}

export const ConnectionSchema = SchemaFactory.createForClass(Connection);
