const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Address = require('./Address');

const Agent = sequelize.define('agents', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true
		},
		first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false
		},
		customer_rating: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		reliability: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		distance: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		order_qty: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		availibility: {
			type: DataTypes.STRING,
			allowNull: true
		},
		number_of_visits_made: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true
		},
		hd_camera: {	
			type: DataTypes.INTEGER,
			allowNull: true
		},


  	});
	Agent.hasOne(Address, {
		foreignKey: 'user_id',
		as: 'address_details',
		scope: {
			user_type: 'agent'
		}
	});
module.exports = Agent;