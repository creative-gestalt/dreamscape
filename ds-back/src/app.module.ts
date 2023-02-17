import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DreamsModule } from './dreamscape-dreams/dreams.module';
import { SessionsModule } from './dreamscape-sessions/sessions.module';
import { SettingsModule } from './dreamscape-settings/settings.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.development.local' }),
    MongooseModule.forRoot(
      process.env.DEV_MONGODB_CONNSTRING || process.env.MONGODB_CONNSTRING,
      {
        useNewUrlParser: true,
      },
    ),
    DreamsModule,
    SessionsModule,
    SettingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
