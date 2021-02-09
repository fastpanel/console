/**
 * console.module.ts
 *
 * @author    Desionlab <support@desionlab.net>
 * @copyright 2018 - 2021 Desionlab
 * @license   MIT
 */

import { Program } from '@caporal/core';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { IConsoleModuleAsyncOptions, IConsoleModuleOptions, IConsoleOptionsFactory } from './interfaces';
import { CONSOLE_MODULE_OPTIONS, CONSOLE_CAPORAL_PROVIDER } from './console.constants';
import { ConsoleMetadataAccessor } from './console-metadata.accessor';
import { ConsoleService } from './console.service';

const CAPORAL_FACTORY = {
  provide: CONSOLE_CAPORAL_PROVIDER,
  useFactory: () => {
    return new Program();
  }
};

@Module({})
export class ConsoleModule {
  public static forRoot(options: IConsoleModuleOptions): DynamicModule {
    return {
      global: true,
      module: ConsoleModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: CONSOLE_MODULE_OPTIONS,
          useValue: options
        },
        CAPORAL_FACTORY,
        ConsoleMetadataAccessor,
        ConsoleService
      ],
      exports: [CAPORAL_FACTORY, ConsoleService]
    };
  }

  public static forRootAsync(options: IConsoleModuleAsyncOptions): DynamicModule {
    return {
      global: true,
      module: ConsoleModule,
      imports: [DiscoveryModule],
      providers: [...this.createOptionsProviders(options), CAPORAL_FACTORY, ConsoleMetadataAccessor, ConsoleService],
      exports: [CAPORAL_FACTORY, ConsoleService]
    };
  }

  private static createOptionsProviders(options: IConsoleModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createOptionsProvider(options)];
    }

    return [
      this.createOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass
      }
    ];
  }

  private static createOptionsProvider(options: IConsoleModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: CONSOLE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || []
      };
    }

    return {
      provide: CONSOLE_MODULE_OPTIONS,
      useFactory: async (optionsFactory: IConsoleOptionsFactory) => await optionsFactory.createConsoleOptions(),
      inject: [options.useExisting || options.useClass]
    };
  }
}
