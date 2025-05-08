import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Products } from './entity/products';
import { Customer } from './entity/Customer';
import { Invoice } from './entity/invoice';
import { InvoiceItem } from './entity/billgenerate';
import { GstConfig } from './entity/GstConfig';
// import { Billgenerate } from './entity/billgenerate';

export const AppDataSource = new DataSource({
    type:"postgres",
    host:"localhost",
    port:5432,
    username:"postgres",
    password:"12345",
    database:"test_orm",
    synchronize:true,
    entities:[User,Products,Customer,Invoice,InvoiceItem,GstConfig],
    migrations:[]

})