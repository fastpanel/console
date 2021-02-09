/**
 * command.decorator.ts
 *
 * @author    Desionlab <support@desionlab.net>
 * @copyright 2018 - 2021 Desionlab
 * @license   MIT
 */

import { CommandConfig } from '@caporal/core';
import { META_COMMAND } from '../console.constants';

export interface ICommandProps {
  name: string;
  description?: string;
  config?: Partial<CommandConfig>;
  alias?: string[];
}

export function Command(props: ICommandProps): MethodDecorator {
  return (target: object, propertyKey: string | symbol) => {
    Reflect.defineMetadata(
      META_COMMAND,
      {
        name: props.name,
        description: props.description || '',
        config: props.config || {},
        alias: props.alias || null
      },
      target,
      propertyKey
    );
  };
}
