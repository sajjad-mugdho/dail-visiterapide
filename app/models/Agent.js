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
  	});

module.exports = Agent;