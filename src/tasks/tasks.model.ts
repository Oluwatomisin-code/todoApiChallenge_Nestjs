import * as mongoose from 'mongoose'

export const taskSchema = new mongoose.Schema({
    
    title: String,
    description: String

});

export interface task{
    id?: string;
    title: string;
    description: string
}