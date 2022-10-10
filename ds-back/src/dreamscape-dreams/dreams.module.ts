import { Module } from '@nestjs/common';
import { DreamController } from './dream.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DreamsSchema } from './schemas/dreams.schema';
import { DreamsService } from './dreams.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Dreams', schema: DreamsSchema, collection: 'dreams' },
    ]),
  ],
  controllers: [DreamController],
  providers: [DreamsService],
})
export class DreamsModule {}
