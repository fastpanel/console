# fastPanel [console]
Create console (cli) application in NestJS framework context.

> The a wrapper "[caporal](https://caporal.io/)" lib for use in "[nestjs](https://nestjs.com/)" framework.

## Install

### Stable
```bash
npm i @fastpanel/console
```

### Develop
```bash
npm i @fastpanel/console --registry https://npmjs.desionlab.net
```

## Usage

1. Add command providers.

```typescript
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
  @Option({ synopsis: '-e, --extra-ingredients <ingredients>', description: 'Extra ingredients' })
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
```

2. Add console module and command providers to app module.

```typescript
/**
 * app.module.ts
 */

import { Module } from '@nestjs/common';
import { ConsoleModule } from '@fastpanel/console';
import { PizzaCommands } from './pizza.commands.ts';

@Module({
  imports: [
    ConsoleModule.forRoot({
      name: 'my-test-app',
      version: '1.0.0',
      description: 'My test app'
    })
  ],
  providers: [PizzaCommands]
})
export class AppModule {}
```

3. Create application context.

```typescript
/**
 * cli.ts
 */

import { NestFactory } from '@nestjs/core';
import { ConsoleService } from '@fastpanel/console';
import { AppModule } from './app.module';

async function bootstrap() {
  /* Create app instant. */
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false
  });

  /* Get console service. */
  const consoleService = app.get<ConsoleService>(ConsoleService);

  /* Add default help command. */
  consoleService.getHandler.action(async ({ program }) => {
    await program.exec(['help']);
  });

  /* Run cli handler. */
  await consoleService.run();

  /* End app. */
  await app.close();
}

/* Run app. */
bootstrap();
```

4. Add scripts to package.json

```json
{
  "scripts": {
    "console": "node dist/cli.js",
    "console:dev": "ts-node -r tsconfig-paths/register src/cli.ts"
  }
}
```

5. Use in terminal.

```bash
# Run in development mode
npm run console:dev -- help
npm run console:dev -- command-name

# Run in prod or build mode
npm run console -- help
npm run console -- command-name
```

## License

[MIT licensed](LICENSE).
