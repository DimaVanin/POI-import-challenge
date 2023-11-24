// TODO: Use nested dtos
export interface UpsertPOIDto {
  externalId: number;
  dateCreated: string;
  numberOfPoints: number;
  addressInfo: {
    externalId: number;
    latitude: number;
    longitude: number;
    countryId: number;
    title: string;
  };
  dataProvider: {
    externalId: number;
    title: string;
    websiteURL: string;
    isApprovedImport: boolean;
  };
  connections: {
    externalId: number;
    quantity: number;
    currentTypeId: number;
    powerKW: number;
    amps: number;
    voltage: number;
    statusTypeId: number;
    connectionTypeId: number;
  }[];
}
