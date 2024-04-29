const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Address = sequelize.define('addresses', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true
		},
        street_number:{
            type: DataTypes.STRING
        },
		street_address:{
			type: DataTypes.STRING
		},
		locality:{
			type: DataTypes.STRING
		},
		postal_code:{
			type: DataTypes.STRING
		},
		user_type:{
			type: DataTypes.STRING
		},
		user_id:{
			type: DataTypes.INTEGER
		},
		lat:{
			type: DataTypes.DOUBLE
		},
		lng:{
			type: DataTypes.DOUBLE
		},
		


  	},{
		timestamps: false
	});

module.exports = Address;