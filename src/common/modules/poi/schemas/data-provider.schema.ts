import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';

export type DataProviderDocument = HydratedDocument<DataProvider>;

@Schema({
  shardKey: {
    externalId: 1,
  },
})
export class DataProvider {
  @Prop({ type: String, default: () => uuid() })
  _id: string;

  @Prop({ type: Number, unique: true, index: 1 })
  externalId: number;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  websiteURL: string;

  @Prop({ type: Boolean })
  isApprovedImport: boolean;
}

export const DataProviderSchema = SchemaFactory.createForClass(DataProvider);
