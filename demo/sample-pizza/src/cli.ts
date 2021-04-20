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
