import { registerDecorator, ValidationArguments } from 'class-validator';
import { boundingBoxStringToParams } from '../utils';

const isNumberInRange = (value: unknown, min: number, max: number): boolean =>
  typeof value === 'number' && !isNaN(value) && value >= min && value <= max;

export function IsBoundingBox() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsBoundingBox',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Invalid bounding box value',
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const { property } = args;
          const relatedValue = (args.object as any)[property];

          if (typeof value !== 'string') {
            return false;
          }

          const { lat1, lng1, lat2, lng2 } =
            boundingBoxStringToParams(relatedValue);

          return (
            [lat1, lat2].every((value) => isNumberInRange(value, -90, 90)) &&
            [lng1, lng2].every((value) => isNumberInRange(value, -180, 180))
          );
        },
      },
    });
  };
}
