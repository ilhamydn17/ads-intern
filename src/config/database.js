import { Sequelize } from '@sequelize/core';
import  User  from '../models/user.model.js';

const sequelize = new Sequelize('ads-assn1-jwt', 'root', 'ilhamyudantyo', {
	host: '127.0.0.1',
    dialect: 'mysql',
    models: [User]
});

try {
	await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
	console.error('Unable to connect to the database:', error);
}



export default sequelize;