/**
 * console-metadata.accessor.ts
 *
 * @author    Desionlab <support@desionlab.net>
 * @copyright 2018 - 2021 Desionlab
 * @license   MIT
 */

import { Injectable, Type } from '@nestjs/common';
import { META_COMMAND, META_COMMAND_ARGUMENTS, META_COMMAND_OPTIONS, META_CONSOLE } from './console.constants';
import { IArgumentProps, ICommandProps, IConsoleProps, IOptionProps } from './decorators';

@Injectable()
export class ConsoleMetadataAccessor {
  isConsole(target: Type<any> | Function): boolean {
    if (!target) {
      return false;
    }

    return !!Reflect.getMetadata(META_CONSOLE, target);
  }

  isCommand(target: Type<any> | Function, key: string): boolean {
    if (!target) {
      return false;
    }

    return !!Reflect.getMetadata(META_COMMAND, target, key);
  }

  getConsoleMetadata(target: Type<any> | Function): IConsoleProps {
    return Reflect.getMetadata(META_CONSOLE, target);
  }

  getCommandMetadata(target: Type<any> | Function, key: string): ICommandProps {
    return Reflect.getMetadata(META_COMMAND, target, key);
  }

  getOptionsMetadata(target: Type<any> | Function, key: string): IOptionProps[] {
    return Reflect.getMetadata(META_COMMAND_OPTIONS, target, key) || [];
  }

  getArgumentsMetadata(target: Type<any> | Function, key: string): IArgumentProps[] {
    return Reflect.getMetadata(META_COMMAND_ARGUMENTS, target, key) || [];
  }
}
