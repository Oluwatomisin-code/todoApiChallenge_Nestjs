import * as mongoose from 'mongoose'

export const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    token: String
});

export interface user{
    id?: string;
    email: string;
    password: string;
    token?: string
}