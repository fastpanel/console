import { Module } from '@nestjs/common';
import { PizzaService } from './pizza.service';
import { PizzaCommands } from './pizza.commands';

@Module({
  providers: [PizzaService, PizzaCommands]
})
export class PizzaModule {}
