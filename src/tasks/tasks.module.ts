import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksController } from './tasks.controller';
import { taskSchema } from './tasks.model';
import { TasksService } from './tasks.service';

@Module({
  imports:[MongooseModule.forFeature([{name:'tasks', schema: taskSchema}])],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
