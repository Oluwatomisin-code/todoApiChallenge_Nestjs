import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { task } from './tasks.model';
import {Model} from 'mongoose'


@Injectable()
export class TasksService {
    tasks:any =[
        {id:'1', title: 'task number one',  description: "simple task for the day"},
        {id:'2', title: 'task number two',  description: "simple task for the day"},
        {id:'3', title: 'task number three',  description: "simple task for the day"},
        {id:'4', title: 'task number four',  description: "simple task for the day"},
        {id:'5', title: 'task number five',  description: "simple task for the day"}
    ];
    constructor(@InjectModel('tasks') private readonly taskModel: Model<task>){}


    //create task
    async createTask(task: task):Promise<task>{
        if (task.title === '' || task.description === ''){
            throw new BadRequestException()
        }

        const taskToCreate: any = new this.taskModel({
            title: task.title,
            description: task.description
        })

        const result = await taskToCreate.save()
        // console.log(result)
        // this.tasks.push(taskToCreate)
        // return [...this.tasks]
        return result
    }

    //Get all tasks
    async getTasks(): Promise<task[]> {
        const tasks: task[] = await this.taskModel.find().exec();
        return tasks
    }

    //Get one task
    async getOneTask(id:string) :Promise<task | {}>{
        const task : task = await this.findTask(id);

        if(!task){
            return new NotFoundException('could not find task');
        }
        else{
            return task
        }
    }


    //Update task
    async updateTask(id:string, task:task):Promise<task>{
        if (task.title ==='' || task.description === ''){
            throw new BadRequestException();
        }
        const find = await this.findTask(id)
        if (task.title){
            find.title = task.title
        }
        if (task.description){
            find.description = task.description
        }

        const update: task = await find.save()

        return update
    }

    async deleteTask(id:string):Promise<string>{
        try {
            const taskToDelete: task = await this.taskModel.findByIdAndDelete(id)
            
            if(!taskToDelete){
                throw new NotFoundException('could not find task to delete')
            }
            
        } catch (error) {
            throw new NotFoundException('could not delete, try again')
        }
        

        return `${id} is deleted`;
    }

    private async findTask(id: string){
        const task = await this.taskModel.findById(id);
        if(!task){
            throw new NotFoundException('could not find task.')
        }
        return task 
    }
}
