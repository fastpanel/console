/**
 * pizza.commands.ts
 */

import { Injectable } from '@nestjs/common';
import { Console, Command, Argument, Option } from '@fastpanel/console';

@Console({ name: 'pizza' })
@Injectable()
export class PizzaCommands {
  @Command({ name: 'order', description: 'Order a pizza' })
  @Argument({ synopsis: '<type>', description: 'Type of pizza' })
  @Option({
    synopsis: '-e, --extra-ingredients <ingredients>',
    description: 'Extra ingredients',
  })
  public async orderAction({ logger, args, options }) {
    logger.info('Order received: %s', args.type);

    if (options.extraIngredients) {
      logger.info('Extra: %s', options.extraIngredients);
    }
  }

  @Command({ name: 'cancel', description: 'Cancel an order' })
  @Argument({ synopsis: '<order-id>', description: 'Order id' })
  public async cancelAction({ logger, args }) {
    logger.info('Order canceled: %s', args.orderId);
  }
}
