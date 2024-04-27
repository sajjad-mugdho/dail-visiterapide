const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Customer = sequelize.define('customers', {
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
		lat: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		lng: {
			type: DataTypes.FLOAT,
			allowNull: false
		}, 
		availibility: {
			type: DataTypes.STRING,
			allowNull: true
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true
		}
  	});

module.exports = Customer;