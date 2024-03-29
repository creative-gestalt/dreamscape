import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { DreamsService } from './dreams.service';
import { AddDreamDto } from './dto/add-dream.dto';
import { Dream } from './interfaces/dream.interface';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';

@Controller()
export class DreamController {
  constructor(private readonly dreamsService: DreamsService) {}

  @Get('getDreamsCount')
  async getDreamsCount(@Res() res) {
    const dates = await this.dreamsService.getField('date');
    const count = dates.length;
    const years = [
      ...new Set(
        [...dates].map((dreamDate: any) => dreamDate.date.slice(0, 4)),
      ),
    ]
      .sort()
      .reverse();
    return res.status(HttpStatus.OK).json({ count, years });
  }

  @Get('getDreams/:params')
  async getDreams(@Res() res, @Param('params') params) {
    const skip = Number(params.split('-')[0]);
    const limit = Number(params.split('-')[1]);
    const dreams = await this.dreamsService.getDreams(skip, limit);
    const count = await this.dreamsService.getDreamsCount();
    return res.status(HttpStatus.OK).json({ dreams, count });
  }

  @Get('getDream/:dreamID')
  async getDream(
    @Res() res,
    @Param('dreamID', new ValidateObjectId()) dreamID,
  ) {
    const dream = await this.dreamsService.getDream(dreamID);
    if (!dream) throw new NotFoundException('Dream does not exist!');
    return res.status(HttpStatus.OK).json(dream);
  }

  @Get('searchDreams')
  async searchDreams(@Res() res, @Query('target') target) {
    const search = await this.dreamsService.searchDreams(target);
    const response = { count: search.length, dreams: search };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getDreamDates/:year')
  async getDreamDates(@Res() res, @Param('year') year) {
    const dreams = await this.dreamsService.getDreamsByFieldValue('date', year);
    const dates = dreams.map((dream) => {
      return {
        _id: dream._id,
        date: dream.date,
      };
    });
    return res.status(HttpStatus.OK).json(dates);
  }

  @Post('addDream')
  async addDream(@Res() res, @Body() addDreamDto: AddDreamDto) {
    const dream = await this.dreamsService.addDream(addDreamDto);
    return res.status(HttpStatus.OK).json({
      message: 'Dream added successfully.',
      dream: dream[0],
    });
  }

  @Post('deleteDreams')
  async deleteDreams(@Res() res, @Body() dreams: Dream[]) {
    const deletedDreams = await this.dreamsService.deleteDreams(dreams);
    return res.status(HttpStatus.OK).json({
      message: 'Dreams have been deleted.',
      dreams: deletedDreams,
    });
  }

  @Put('updateDream')
  async updateDream(
    @Res() res,
    @Query('dreamID', new ValidateObjectId()) dreamID,
    @Body() addDreamDto: AddDreamDto,
  ) {
    const dream = await this.dreamsService.updateDream(dreamID, addDreamDto);
    return res.status(HttpStatus.OK).json(dream);
  }
}
