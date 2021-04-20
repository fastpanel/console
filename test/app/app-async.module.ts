/**
 * app.module.ts
 *
 * @author    Desionlab <support@desionlab.net>
 * @copyright 2018 - 2021 Desionlab
 * @license   MIT
 */

import { Module } from '@nestjs/common';
import { ConsoleModule } from '../../src';
import { PizzaCommands } from './commands/pizza.commands';

@Module({
  imports: [
    ConsoleModule.forRootAsync({
      useFactory: async () => {
        return {
          name: 'my-test-app',
          version: '1.0.0',
          description: 'My test app'
        };
      }
    })
  ],
  providers: [PizzaCommands]
})
export class AppAsyncModule {}
