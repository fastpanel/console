/**
 * console.service.ts
 *
 * @author    Desionlab <support@desionlab.net>
 * @copyright 2018 - 2021 Desionlab
 * @license   MIT
 */

import { sortBy } from 'lodash';
import { ActionParameters, ParserTypes, Program } from '@caporal/core';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { IConsoleCommandListItem, IConsoleModuleOptions } from './interfaces';
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
  onModuleInit(): void {
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
  protected explore(): void {
    /* Commands data buffer. */
    const commandList: IConsoleCommandListItem[] = [];

    /* Search console controllers. */
    const providers: InstanceWrapper[] = this.discoveryService
      .getProviders()
      .filter((wrapper: InstanceWrapper) => this.metadataAccessor.isConsole(wrapper.metatype));

    /* Collect command data. */
    providers.forEach((wrapper: InstanceWrapper) => {
      const { instance, metatype } = wrapper;

      /* Get console metadata. */
      const consoleMeta: IConsoleProps = this.metadataAccessor.getConsoleMetadata(metatype);

      /* Get a list of classes methods. */
      this.metadataScanner.scanFromPrototype(instance, Object.getPrototypeOf(instance), (key: string) => {
        if (this.metadataAccessor.isCommand(instance, key)) {
          const nameBuffer: string[] = [];

          /* Get command metadata. */
          const commandMeta: ICommandProps = this.metadataAccessor.getCommandMetadata(instance, key);

          /* Preparing command name elements. */
          if (consoleMeta.name) nameBuffer.push(consoleMeta.name);
          nameBuffer.push(commandMeta.name);

          /* Add command to list. */
          commandList.push({
            name: nameBuffer.join(this.separator),
            description: commandMeta.description || '',
            config: commandMeta.config || {},
            alias: commandMeta.alias || null,
            arguments: this.metadataAccessor.getArgumentsMetadata(instance, key) || [],
            options: this.metadataAccessor.getOptionsMetadata(instance, key) || [],
            method: key,
            instance: instance
          });
        }
      });
    });

    /* Bind commands. */
    for (const item of sortBy(commandList, 'name')) {
      this.handleCommand(item);
    }
  }

  /**
   * Bind command in to caporal instant.
   *
   * @param console
   * @param command
   * @param opts
   * @param args
   */
  protected handleCommand(command: IConsoleCommandListItem): void {
    /* Create command. */
    const tc = this.handler.command(command.name, command.description, command.config);

    /* Set command alias. */
    if (command.alias) tc.alias(...command.alias);

    /* Add arguments to command. */
    command.arguments.forEach((argument: IArgumentProps) => {
      tc.argument(argument.synopsis, argument.description, argument.options);
    });

    /* Add options to command. */
    command.options.forEach((option: IOptionProps) => {
      tc.option(option.synopsis, option.description, option.options);
    });

    /* Bind command action. */
    tc.action(async (params: ActionParameters) => {
      return await command.instance[command.method](params);
    });
  }
}
