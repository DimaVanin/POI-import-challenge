import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { CreateImportCommandDto } from './dto/import-command.dto';
import { ImportService } from './import.service';
import { boundingBoxStringToParams } from '../../../api/utils';

@Controller('imports')
export class ImportController {
  constructor(private readonly importService: ImportService) {}
  @Post()
  @HttpCode(201)
  async createImportCommand(
    @Body() dto: CreateImportCommandDto,
  ): Promise<{ id: string }> {
    const id = await this.importService.addJob(
      boundingBoxStringToParams(dto.boundingbox),
    );
    return { id };
  }
}
