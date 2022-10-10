import { Injectable } from '@nestjs/common';
import { HydratedDocument, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Settings } from './interfaces/settings.interface';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel('Settings') private readonly settingsModel: Model<Settings>,
  ) {}

  async getSettings(): Promise<any> {
    return this.settingsModel.findOne().exec();
  }

  async updateSettings(
    settingsID: string,
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<any> {
    return this.settingsModel.findByIdAndUpdate(settingsID, updateSettingsDto, {
      new: true,
    });
  }

  async createSettings(
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<HydratedDocument<Settings>> {
    return await this.settingsModel.create(updateSettingsDto);
  }
}
