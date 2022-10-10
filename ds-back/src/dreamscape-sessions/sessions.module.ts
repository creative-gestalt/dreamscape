import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsSchema } from './schemas/sessions.schema';
import { SessionsService } from './sessions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Sessions',
        schema: SessionsSchema,
        collection: 'sessions',
      },
    ]),
  ],
  controllers: [SessionController],
  providers: [SessionsService],
})
export class SessionsModule {}
