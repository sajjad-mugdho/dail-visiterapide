const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

// load env vars
require('dotenv').config();

//Loading Routes
const webRoutes = require('./routes/web');
const sequelize = require('./config/database');

// parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(webRoutes);

// set views
app.set('view engine', 'ejs');

sequelize
	.sync()
	.then(() => {
		app.listen(process.env.PORT, process.env.IP, function () {
			console.log('Example app started!')
		})
		//pending set timezone
		console.log("App listening on port " + process.env.PORT);
	})
	.catch(err => {
		console.log(err);
	});
