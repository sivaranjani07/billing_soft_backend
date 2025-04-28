import { DataSource } from 'typeorm';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
    type:"postgres",
    host:"localhost",
    port:5432,
    username:"postgres",
    password:"12345",
    database:"test_orm",
    synchronize:true,
    entities:[User],
    migrations:[]

})