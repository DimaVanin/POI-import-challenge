import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { CreateImportCommandDto } from './dto/import-command.dto';

@Controller('imports')
export class ImportController {
  @Post()
  @HttpCode(201)
  async createImportCommand(@Body() dto: CreateImportCommandDto): Promise<{}> {
    return {};
  }
}
