import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DataProvider } from './data-provider.schema';
import { Connection } from './connection.schema';

export type PoiDocument = HydratedDocument<POI>;

@Schema()
export class AddressInfo {
  @Prop({ type: Number, index: 1 })
  externalId: number;

  @Prop({ type: String })
  title: string;

  @Prop({ type: Number, index: 1 })
  countryId: number;

  @Prop({ type: Number })
  latitude: number;

  @Prop({ type: Number })
  longitude: number;
}

@Schema({
  shardKey: {
    'addressInfo.latitude': 1,
    'addressInfo.longitude': 1,
  },
})
export class POI {
  @Prop({ type: String, default: () => uuid() })
  _id: string;

  @Prop({ type: Number, unique: true, index: 1 })
  externalId: number;

  @Prop({ type: AddressInfo })
  addressInfo: AddressInfo;

  @Prop({ type: String })
  dateCreated: string;

  @Prop({ type: Number })
  numberOfPoints: number;

  @Prop({ type: mongoose.Schema.Types.String, ref: 'DataProvider' })
  dataProvider: DataProvider;

  @Prop([{ type: mongoose.Schema.Types.String, ref: 'Connection' }])
  connections: Connection[];
}

export const POISchema = SchemaFactory.createForClass(POI);
