import { Injectable } from '@nestjs/common';
import { HydratedDocument, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from './interfaces/session.interface';
import { AddSessionDto } from './dto/add-session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel('Sessions') private readonly sessionModel: Model<Session>,
  ) {}

  async getSessions(skip, limit): Promise<Session[]> {
    return await this.sessionModel
      .find()
      .sort({ date: 'desc' })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getSession(sessionID): Promise<Session> {
    return await this.sessionModel.findById(sessionID).exec();
  }

  async addSession(
    addSessionDto: AddSessionDto,
  ): Promise<HydratedDocument<Session>[]> {
    return await this.sessionModel.insertMany(addSessionDto);
  }

  async deleteSessions(sessions): Promise<any> {
    return this.sessionModel.deleteMany({ _id: { $in: sessions } });
  }

  async updateSession(
    sessionID: string,
    addSessionDto: AddSessionDto,
  ): Promise<Session> {
    return this.sessionModel.findByIdAndUpdate(sessionID, addSessionDto, {
      new: true,
    });
  }
}
