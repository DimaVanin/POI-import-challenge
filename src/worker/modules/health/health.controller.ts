import { Controller, Get } from '@nestjs/common';

@Controller('health-check')
export class HealthController {
  @Get()
  async healthCheck(): Promise<{}> {
    // TODO: add pings to queues and mongo client
    return {};
  }
}
