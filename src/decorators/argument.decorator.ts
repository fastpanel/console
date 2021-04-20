/**
 * argument.decorator.ts
 *
 * @author    Desionlab <support@desionlab.net>
 * @copyright 2018 - 2021 Desionlab
 * @license   MIT
 */

import { CreateArgumentOpts } from '@caporal/core';
import { META_COMMAND_ARGUMENTS } from '../console.constants';

export interface IArgumentProps {
  synopsis: string;
  description?: string;
  options?: CreateArgumentOpts;
}

export function Argument(props: IArgumentProps): MethodDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const args = Reflect.getMetadata(META_COMMAND_ARGUMENTS, target, propertyKey) || [];

    if (args.length > 0 && args.filter((item: IArgumentProps) => item.synopsis === props.synopsis).length > 0) {
      throw new Error('Duplicated argument definition exception');
    }

    args.push({
      synopsis: props.synopsis,
      description: props.description || '',
      options: props.options || {}
    });

    return Reflect.defineMetadata(META_COMMAND_ARGUMENTS, args, target, propertyKey);
  };
}
