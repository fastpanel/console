/**
 * pizza.commands.ts
 */

import { Injectable } from '@nestjs/common';
import { Console, Command, Argument, Option } from '../../../src';

@Console({ name: 'pizza' })
@Injectable()
export class PizzaCommands {
  @Command({ name: 'order', description: 'Order a pizza.' })
  @Argument({ synopsis: '<type>', description: 'Type of pizza.' })
  @Option({ synopsis: '-e, --extra-ingredients <ingredients>', description: 'Extra ingredients.' })
  public async orderAction({ logger, args, options }) {
    console.log(`Order received: ${args.type}`);

    if (options.extraIngredients) {
      console.log(`Extra: ${options.extraIngredients}`);
    }
  }

  @Command({ name: 'cancel', description: 'Cancel an order.' })
  @Argument({ synopsis: '<order-id>', description: 'Order id.' })
  public async cancelAction({ logger, args }) {
    console.log(`Order canceled: ${args.orderId}`);
  }
}
