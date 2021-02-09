/**
 * app.spec.ts
 *
 * @author    Desionlab <support@desionlab.net>
 * @copyright 2018 - 2020 Desionlab
 * @license   MIT
 */

import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConsoleService } from '../src';
import { AppModule } from './app/app.module';

describe('fastpanel/console', () => {
  let mockLog: jest.SpyInstance;

  let app: INestApplicationContext = null;
  let consoleService: ConsoleService = null;

  beforeEach(async () => {
    mockLog = jest.spyOn(console, 'log').mockImplementation();

    app = await NestFactory.createApplicationContext(AppModule, {
      logger: false
    });

    consoleService = app.get<ConsoleService>(ConsoleService);
  });

  afterEach(async () => {
    await app.close();

    mockLog.mockRestore();
  });

  it('should be defined', async () => {
    expect(app).toBeDefined();
    expect(consoleService).toBeDefined();
  });

  it('should be command array', async () => {
    expect(consoleService.getHandler.getCommands().length).toBe(3);
  });

  it('should be help command', async () => {
    await consoleService.run(['--help']);

    /*  */
    expect(mockLog.mock.calls[0][0]).toMatch('my-test-app');
    expect(mockLog.mock.calls[0][0]).toMatch('USAGE');

    /*  */
    expect(mockLog.mock.calls[0][0]).toMatch('pizza-order');
    expect(mockLog.mock.calls[0][0]).toMatch('pizza-cancel');
  });

  it('should be help for order command', async () => {
    await consoleService.run(['pizza-order', '--help']);

    /*  */
    expect(mockLog.mock.calls[0][0]).toMatch('my-test-app');
    expect(mockLog.mock.calls[0][0]).toMatch('USAGE');

    /*  */
    expect(mockLog.mock.calls[0][0]).toMatch('pizza-order');
    expect(mockLog.mock.calls[0][0]).toMatch('<type>');
  });

  it('should be order command', async () => {
    await consoleService.run(['pizza-order', 'peperoni']);
    expect(mockLog.mock.calls[0][0]).toMatch('Order received: peperoni');
  });

  it('should be order command with options', async () => {
    await consoleService.run(['pizza-order', 'peperoni', '-e', 'pineapple']);
    expect(mockLog.mock.calls[0][0]).toMatch('Order received: peperoni');
    expect(mockLog.mock.calls[1][0]).toMatch('Extra: pineapple');
  });

  it('should be cancel command', async () => {
    await consoleService.run(['pizza-cancel', '987654321']);
    expect(mockLog.mock.calls[0][0]).toMatch('Order canceled: 987654321');
  });
});
