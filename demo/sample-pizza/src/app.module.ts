import { Module } from '@nestjs/common';
import { ConsoleModule } from '@fastpanel/console';
import { PizzaModule } from './pizza/pizza.module';

@Module({
  imports: [
    ConsoleModule.forRoot({
      name: 'sample-pizza',
      version: '1.0.0',
      description: 'Demo sample pizza app',
      bin: 'npm run console -- ',
    }),
    PizzaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
