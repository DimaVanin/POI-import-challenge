import { Controller, Logger } from '@nestjs/common';

@Controller()
export class ImportController {
  private logger = new Logger(ImportController.name);

  async onApplicationBootstrap() {
    this.logger.log('Jobs subscription initiated');
  }
}
