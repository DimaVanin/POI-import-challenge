import { Nullable } from '../../../../common/types';

export interface POIItemResponse {
  id: number;
  numberOfPoints: number;
  statusTypeID: number;
  dateCreated: string;
  dataProvider: {
    websiteURL: string;
    isApprovedImport: boolean;
    id: number;
    title: string;
  };
  addressInfo: {
    id: number;
    title: string;
    countryID: number;
    latitude: number;
    longitude: number;
  };
  connections: {
    id: number;
    connectionTypeID: number;
    statusTypeID: number;
    amps: Nullable<number>;
    voltage: Nullable<number>;
    powerKW: Nullable<number>;
    currentTypeID: number;
    quantity: number;
  }[];
}
