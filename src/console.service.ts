/**
 * console.service.ts
 *
 * @author    Desionlab <support@desionlab.net>
 * @copyright 2018 - 2021 Desionlab
 * @license   MIT
 */

import { ActionParameters, ParserTypes, Program } from '@caporal/core';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { IConsoleModuleOptions } from './interfaces';
import { CONSOLE_CAPORAL_PROVIDER, CONSOLE_MODULE_OPTIONS } from './console.constants';
import { ConsoleMetadataAccessor } from './console-metadata.accessor';
import { IArgumentProps, ICommandProps, IConsoleProps, IOptionProps } from './decorators';

@Injectable()
export class ConsoleService implements OnModuleInit {
  /* Namespace separator. */
  #separator = '-';

  /* Namespace separator getter. */
  get separator(): string {
    return this.#separator;
  }

  /* Command handler getter. */
  get getHandler(): Program {
    return this.handler;
  }

  /**
   * ConsoleService constructor.
   *
   * @param handler
   * @param options
   * @param discoveryService
   * @param metadataScanner
   * @param metadataAccessor
   */
  public constructor(
    @Inject(CONSOLE_CAPORAL_PROVIDER) private readonly handler: Program,
    @Inject(CONSOLE_MODULE_OPTIONS) private readonly options: IConsoleModuleOptions,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly metadataAccessor: ConsoleMetadataAccessor
  ) {
    /* Clear handler. */
    this.handler.reset();

    /* Set handler options. */
    if (this.options.bin) this.handler.bin(this.options.bin);
    if (this.options.name) this.handler.name(this.options.name);
    if (this.options.logger) this.handler.logger(this.options.logger);
    if (this.options.version) this.handler.version(this.options.version);
    if (this.options.description) this.handler.description(this.options.description);
    if (typeof this.options.strict !== 'undefined') this.handler.strict(this.options.strict);

    /* Set service options. */
    if (this.options.separator) this.#separator = this.options.separator;
  }

  /**
   *
   */
  onModuleInit() {
    this.explore();
  }

  /**
   * Alias to caporal run method.
   *
   * @param argv
   */
  public async run(argv: string[] = null): Promise<unknown> {
    return this.handler.run(argv);
  }

  /**
   * Alias to caporal exec method.
   *
   * @param args
   * @param options
   */
  public async exec(args: string[], options?: Record<string, ParserTypes>, ddash?: string[]): Promise<unknown> {
    return this.handler.exec(args, options, ddash);
  }

  /**
   *
   */
  protected explore() {
    const providers: InstanceWrapper[] = this.discoveryService
      .getProviders()
      .filter((wrapper: InstanceWrapper) => this.metadataAccessor.isConsole(wrapper.metatype));

    /*  */
    providers.forEach((wrapper: InstanceWrapper) => {
      const { instance, metatype } = wrapper;
      const consoleMeta: IConsoleProps = this.metadataAccessor.getConsoleMetadata(metatype);

      /*  */
      this.metadataScanner.scanFromPrototype(instance, Object.getPrototypeOf(instance), (key: string) => {
        if (this.metadataAccessor.isCommand(instance, key)) {
          const commandMeta = this.metadataAccessor.getCommandMetadata(instance, key);
          const optionsMeta = this.metadataAccessor.getOptionsMetadata(instance, key);
          const argumentsMeta = this.metadataAccessor.getArgumentsMetadata(instance, key);

          /*  */
          this.handleCommand(instance, key, consoleMeta, commandMeta, optionsMeta, argumentsMeta);
        }
      });
    });
  }

  /**
   * Bind command in to caporal instant.
   *
   * @param console
   * @param command
   * @param opts
   * @param args
   */
  protected handleCommand(instance: object, key: string, console: IConsoleProps, command: ICommandProps, opts: IOptionProps[], args: IArgumentProps[]) {
    /* Name buffer */
    const nb = [];

    /* Preparing command name elements. */
    if (console.name) nb.push(console.name);
    nb.push(command.name);

    /* Create command. */
    const tc = this.handler.command(nb.join(this.separator), command.description, command.config);

    /* Set command alias. */
    if (command.alias) tc.alias(...command.alias);

    /* Add arguments to command. */
    args.forEach(argument => {
      tc.argument(argument.synopsis, argument.description, argument.options);
    });

    /* Add options to command. */
    opts.forEach(option => {
      tc.option(option.synopsis, option.description, option.options);
    });

    /* Bind command action. */
    tc.action(async (params: ActionParameters) => {
      return await instance[key](params);
    });
  }
}
