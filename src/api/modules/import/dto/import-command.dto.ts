import { IsBoundingBox } from '../../../decorators';

export class CreateImportCommandDto {
  @IsBoundingBox()
  boundingbox: string;

  // TODO: add additional query parameters like countrycode, etc.
}
