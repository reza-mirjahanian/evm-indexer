import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ETHERSCAN_MAX_BLOCK_RANGE } from '../../../constants/etherscan';

export function IsBlockRangeValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBlockRangeValid',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;

          if (
            typeof obj.startblock !== 'number' ||
            typeof obj.endblock !== 'number'
          ) {
            return true; // skip if other validators haven't run yet
          }

          const blockRange = obj.endblock - obj.startblock;
          return (
            obj.endblock > obj.startblock &&
            blockRange <= ETHERSCAN_MAX_BLOCK_RANGE
          );
        },
        defaultMessage() {
          return `Block range too large. Maximum ${ETHERSCAN_MAX_BLOCK_RANGE} blocks allowed, and endblock must be greater than startblock`;
        },
      },
    });
  };
}
