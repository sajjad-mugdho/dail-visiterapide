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
			type: DataTypes.STRING,
			allowNull: false
		},
		lng: {
			type: DataTypes.STRING,
			allowNull: false
		},
  	});

module.exports = Customer;