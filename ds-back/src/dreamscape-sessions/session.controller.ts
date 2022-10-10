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
import { SessionsService } from './sessions.service';
import { AddSessionDto } from './dto/add-session.dto';
import { Session } from './interfaces/session.interface';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';

@Controller()
export class SessionController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get('getSessions/:params')
  async getSessions(@Res() res, @Param('params') params) {
    const skip = Number(params.split('-')[0]);
    const limit = Number(params.split('-')[1]);
    const sessions = await this.sessionsService.getSessions(skip, limit);
    return res.status(HttpStatus.OK).json(sessions);
  }

  @Get('getSession/:sessionID')
  async getSession(
    @Res() res,
    @Param('sessionID', new ValidateObjectId()) sessionID,
  ) {
    const session = await this.sessionsService.getSession(sessionID);
    if (!session) throw new NotFoundException('Session does not exist!');
    return res.status(HttpStatus.OK).json(session);
  }

  @Post('addSession')
  async addSession(@Res() res, @Body() addSessionDto: AddSessionDto) {
    const session = await this.sessionsService.addSession(addSessionDto);
    return res.status(HttpStatus.OK).json({
      message: 'Session added successfully.',
      session: session[0],
    });
  }

  @Post('deleteSessions')
  async deleteSessions(@Res() res, @Body() sessions: Session[]) {
    const deletedSessions = await this.sessionsService.deleteSessions(sessions);
    return res.status(HttpStatus.OK).json({
      message: 'Sessions have been deleted.',
      sessions: deletedSessions,
    });
  }

  @Put('updateSession')
  async updateSession(
    @Res() res,
    @Query('sessionID', new ValidateObjectId()) sessionID,
    @Body() addSessionDto: AddSessionDto,
  ) {
    const session = await this.sessionsService.updateSession(
      sessionID,
      addSessionDto,
    );
    return res.status(HttpStatus.OK).json(session);
  }
}
