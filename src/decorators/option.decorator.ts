/**
 * option.decorator.ts
 *
 * @author    Desionlab <support@desionlab.net>
 * @copyright 2018 - 2021 Desionlab
 * @license   MIT
 */

import { CreateOptionCommandOpts } from '@caporal/core';
import { META_COMMAND_OPTIONS } from '../console.constants';

export interface IOptionProps {
  synopsis: string;
  description?: string;
  options?: CreateOptionCommandOpts;
}

export function Option(props: IOptionProps): MethodDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const options = Reflect.getMetadata(META_COMMAND_OPTIONS, target, propertyKey) || [];

    if (options.length > 0 && options.filter((item: IOptionProps) => item.synopsis === props.synopsis).length > 0) {
      throw new Error('Duplicated option definition exception');
    }

    options.push({
      synopsis: props.synopsis,
      description: props.description || '',
      options: props.options || {}
    });

    return Reflect.defineMetadata(META_COMMAND_OPTIONS, options, target, propertyKey);
  };
}
