/**
 * console.decorator.ts
 *
 * @author    Desionlab <support@desionlab.net>
 * @copyright 2018 - 2021 Desionlab
 * @license   MIT
 */

import { META_CONSOLE } from '../console.constants';

export interface IConsoleProps {
  name?: string;
}

export function Console(props: IConsoleProps = {}): ClassDecorator {
  return (target: object) => {
    Reflect.defineMetadata(META_CONSOLE, props, target);
  };
}
