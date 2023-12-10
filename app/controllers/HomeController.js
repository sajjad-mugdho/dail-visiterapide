const Agent = require('../models/Agent');
const Customer = require('../models/Customer');

class HomeController {
	// [GET] /
	// home page
	home(req, res) {
		res.render('index', {
			title: 'Home page'			
		});
	}

	// [GET] /
	// agent page
	agent(req, res) {
		res.render('agent', {
			title: 'Agent page',
			customer_rating:5,
			reliability:5,
			GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY
			
		});
	}

	// [GET] /
	// customer page
	customer(req, res) {
		res.render('customer', {
			title: 'Customer page',
			GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY
			
		});
	}

	// [POST] /
	// register agent
	async agentRegister(req, res) {
		const { first_name, last_name, email, address, lat, lng,
			customer_rating, reliability, distance, order_qty,availibility
		} = req.body;

		// Create agent
		const agent = await Agent.create({
			first_name,
			last_name,
			email,
			address,
			lat,
			lng,
			customer_rating,
			reliability,
			distance,
			order_qty,
			availibility
		});
		return agent;
	}

	// [POST] /
	// register customer
	async customerRegister(req, res) {
		const { first_name, last_name, email, address, lat, lng,
			availibility
		} = req.body;

		// Create customer
		const customer = await Customer.create({
			first_name,
			last_name,
			email,
			address,
			lat,
			lng,
			availibility
		});
		return customer;
	}
}

module.exports = new HomeController();