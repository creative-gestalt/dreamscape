import { Injectable } from '@nestjs/common';
import { HydratedDocument, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Dream } from './interfaces/dream.interface';
import { AddDreamDto } from './dto/add-dream.dto';

@Injectable()
export class DreamsService {
  constructor(
    @InjectModel('Dreams') private readonly dreamModel: Model<Dream>,
  ) {}

  async getDreams(skip, limit): Promise<Dream[]> {
    return await this.dreamModel
      .find()
      .sort({ date: 'desc' })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getDreamsCount(): Promise<number> {
    const dates = await this.getField('date');
    return dates.length;
  }

  async getDreamsByFieldValue(
    field: string,
    value: any,
  ): Promise<string[] | Dream[]> {
    return await this.dreamModel
      .find({ [field]: { $regex: `.*${value}.*`, $options: 'i' } })
      .exec();
  }

  async getField(field: string): Promise<any[]> {
    return await this.dreamModel.find().select(field).exec();
  }

  async getDream(dreamID): Promise<Dream> {
    return await this.dreamModel.findById(dreamID).exec();
  }

  async searchDreams(target): Promise<Dream[]> {
    return await this.dreamModel
      .find({
        $or: [
          {
            dreams: {
              $elemMatch: {
                subDream: {
                  $regex: `.*${target}.*`,
                  $options: 'i',
                },
              },
            },
          },
          {
            keywords: {
              $elemMatch: {
                $regex: `.*${target}.*`,
                $options: 'i',
              },
            },
          },
        ],
      })
      .sort({ date: 'desc' })
      .exec();
  }

  async addDream(addDreamDto: AddDreamDto): Promise<HydratedDocument<Dream>[]> {
    return await this.dreamModel.insertMany(addDreamDto);
  }

  async deleteDreams(dreams): Promise<any> {
    return this.dreamModel.deleteMany({ _id: { $in: dreams } });
  }

  async updateDream(dreamID: string, addDreamDto: AddDreamDto): Promise<Dream> {
    return this.dreamModel.findByIdAndUpdate(dreamID, addDreamDto, {
      new: true,
    });
  }
}
