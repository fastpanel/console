/**
 * console.interfaces.ts
 *
 * @author    Desionlab <support@desionlab.net>
 * @copyright 2018 - 2021 Desionlab
 * @license   MIT
 */

import { ModuleMetadata, Type } from '@nestjs/common';
import { IArgumentProps, ICommandProps, IOptionProps } from 'src/decorators';

export interface IConsoleModuleOptions {
  name?: string;
  version?: string;
  description?: string;
  logger?: any;
  bin?: string;
  strict?: boolean;
  separator?: string;
}

export interface IConsoleOptionsFactory {
  createConsoleOptions(): Promise<IConsoleModuleOptions> | IConsoleModuleOptions;
}

export interface IConsoleModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<IConsoleOptionsFactory>;
  useClass?: Type<IConsoleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<IConsoleModuleOptions> | IConsoleModuleOptions;
  inject?: any[];
}

export interface IConsoleCommandListItem extends ICommandProps {
  arguments: IArgumentProps[];
  options: IOptionProps[];
  method: string;
  instance: Object;
}
