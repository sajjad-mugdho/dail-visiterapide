const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

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
		lat: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		lng: {
			type: DataTypes.FLOAT,
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


  	});

module.exports = Agent;