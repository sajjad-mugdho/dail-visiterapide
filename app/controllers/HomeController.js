const Agent = require('../models/Agent');
const Customer = require('../models/Customer');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
			order_qty:10,
			GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY
			
		});
	}

	// [GET] /
	// search agent page
	async searchAgent(req, res) {
		var customer_id=req.params.id;
		if (customer_id==undefined){
			return res.redirect('/customers');
		}
		var customer=await Customer.findOne({
			where: {
				id: customer_id
			}
		});
		if (customer==undefined){
			return res.redirect('/customers');
		}
		res.render('search_agent', {
			title: 'Search Agent page',
			customer: customer,
		});
	}

	// [POST] /
	// search agent filter
	searchAgentFilter(req, res) {

		return res.json(req.body);

	}

	// [GET] /
	// customer page
	customer(req, res) {
		res.render('customer', {
			title: 'Customer page',
			GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY
			
		});
	}

	// [GET] /
	// customers page
	customers(req, res) {
		res.render('customers', {
			title: 'Customers page'
			
		});
	}

	// [POST] /
	// customers post request for list
	async customer_search(req, res) {
		//return datatable values
		var skip=req.body.start;
		var limit=req.body.length;
		var search=req.body.search;
		var order=req.body.order;
		var columns=req.body.columns;
		var dir=req.body.order[0].dir;
		var column=req.body.order[0].column;
		var sort_column=req.body.columns[column].data;

		var query={};
		if(search.value!=""){
			query[Op.or]=[
				{
					first_name:{
						[Op.like]: '%'+search.value+'%'
					}
				},
				{
					last_name:{
						[Op.like]: '%'+search.value+'%'
					}
				},
				{
					email:{
						[Op.like]: '%'+search.value+'%'
					}
				},
				{
					address:{
						[Op.like]: '%'+search.value+'%'
					}
				}
			];
		}

		console.log(sort_column,dir);

		var data=await Customer.findAll({
			offset: parseInt(skip),
			limit: parseInt(limit),
			where: query,
			order: [[sort_column, dir]]

		});

		var total=await Customer.count();
		var filtered=await Customer.count({
			where: query
		});
		return res.json({
			"draw": req.body.draw,
			"recordsTotal": total,
			"recordsFiltered": filtered,
			"data": data
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