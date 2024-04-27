const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Address = require('./Address');

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
		},
		

  	});
Customer.hasOne(Address, {
	foreignKey: 'user_id',
	as: 'address_details',
	scope: {
		user_type: 'customer'
	}
});
module.exports = Customer;