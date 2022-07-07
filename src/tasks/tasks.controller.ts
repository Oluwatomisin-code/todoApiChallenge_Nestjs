import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { task } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(
        private tasksService: TasksService
    ){}



    //Create task
    @UseGuards(JwtAuthGuard)
    @Post()
    async createTask(
        @Body() body:any
    ): Promise<task>{
        console.log(body)
        return await this.tasksService.createTask(body) 
    }

    
    //Get tasks
    @UseGuards(JwtAuthGuard)
    @Get()
    async getTasks():Promise<any>{
        return await this.tasksService.getTasks()
    }

    //Get one task
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getOneTask(@Param ('id')id:string):Promise<any>{
        return await this.tasksService.getOneTask(id)
    }

    //Update task
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateTask(
        @Param('id')id:string,
        @Body() body: any
    ):Promise<any>{
        
        return await this.tasksService.updateTask(id, body)
    }

    //Delete a task
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteTask(@Param ('id')id:string): Promise<string>{
        return await this.tasksService.deleteTask(id)
    }

}
