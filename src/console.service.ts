/**
 * console.service.ts
 *
 * @author    Desionlab <support@desionlab.net>
 * @copyright 2018 - 2021 Desionlab
 * @license   MIT
 */

import { ParserTypes, Program } from '@caporal/core';
import { Inject, Injectable } from '@nestjs/common';
import { CONSOLE_CAPORAL_PROVIDER } from './console.constants';
import { ConsoleExplorer } from './console.explorer';

@Injectable()
export class ConsoleService {
  /* Namespace separator getter. */
  get separator(): string {
    return this.consoleExplorer.separator;
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
    private readonly consoleExplorer: ConsoleExplorer
  ) {}

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
}
