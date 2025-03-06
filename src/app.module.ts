import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { TrackService } from './services/track.service';
import { TrackController } from './controllers/track.controller';

@Module({
  imports: [],
  controllers: [AppController, AdminController, TrackController],
  providers: [AppService, AdminService, TrackService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('admin');
  }
}
