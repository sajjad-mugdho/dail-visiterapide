const Agent = require('../models/Agent');
const Customer = require('../models/Customer');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');


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
	async searchAgentFilter(req, res) {

		const skip=req.body.start;
		const limit=req.body.length;
		const search=req.body.search;
		const order=req.body.order;
		const columns=req.body.columns;
		const dir=req.body.order[0].dir;
		const column=req.body.order[0].column;
		const sort_column=req.body.columns[column].data;
		const customer_id=req.body.customer_id;
		const customer_rating=req.body.customer_rating;
		const reliability=req.body.reliability;
		var hours=req.body.hours;
		
		//get customer
		const customer=await Customer.findOne({
			where: {
				id: customer_id
			}
		});
		
		
		var filters=[
			{
				customer_rating: {
					[Op.gte]: customer_rating
				}
			},
			{
				reliability: {
					[Op.gte]: reliability
				}
			}
		];
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
		if(query.length>0){
			filters.push(query);
		}
		
		var targetLat=customer.lat;
		var targetLng=customer.lng;
		
		filters.push({
			distance: {
				[Op.gte]: Sequelize.literal(
				`(
					6371 * acos(
					cos(radians(${targetLat})) * cos(radians(lat)) * cos(radians(lng) - radians(${targetLng})) +
					sin(radians(${targetLat})) * sin(radians(lat))
					)
				)`
				),
			}
		});	

		
		

		var data=await Agent.findAll({
			offset: parseInt(skip),
			limit: parseInt(limit),
			where: filters,
			order: [[sort_column, dir]]
		});

		for (var i=0;i<data.length;i++){
			var agent=data[i];
			

			//check availibility
			if(customer.availibility!="" && agent.availibility!=""){
				var availibility=customer.availibility.split(',');
				//remove 0 from array
				availibility = availibility.filter(function (el) {
					return el != 0;
				});

				var agent_availibility=agent.availibility.split(',');
				//remove 0 from array
				agent_availibility = agent_availibility.filter(function (el) {
					return el != 0;
				});

				//find common availibility
				var common_availibility=availibility.filter(value => agent_availibility.includes(value));
				if(common_availibility.length==0 || common_availibility.length<Number(hours)*2){
					data.splice(i, 1);
					i--;
					continue;
				}
			}
		}
		
		
		return res.json({
			"draw": req.body.draw,
			"recordsTotal": data.length,
			"recordsFiltered": data.length,
			"data": data
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


	// Function to generate encryption key from user identifier
	async generateEncryptionKey(userId) {
		// Convert the user ID to a string
		const userIdString = userId.toString();
		// Use SHA-256 hash function to generate encryption key
		const encryptionKey = crypto.createHash('sha256').update(userIdString).digest('hex');
		return encryptionKey;
	}

	// Function to hash the password using encryption key
	async hashPassword(password, encryptionKey) {
		// Convert password and encryption key to buffers
		const passwordBuffer = Buffer.from(password, 'utf-8');
		const encryptionKeyBuffer = Buffer.from(encryptionKey, 'hex');
		// Use PBKDF2 algorithm for key derivation
		const hashedPassword = crypto.pbkdf2Sync(passwordBuffer, encryptionKeyBuffer, 100000, 64, 'sha512').toString('hex');
		return hashedPassword;
	}

	async verifyPassword(password, storedHashedPassword, encryptionKey) {
		// Hash the provided password using the same encryption key
		const hashedPasswordToCheck = await this.hashPassword(password, encryptionKey);
		// Compare the hashed password with the stored hashed password
		
		return hashedPasswordToCheck.toString() === storedHashedPassword.toString();
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
			availibility, phone, password
		} = req.body;


		// Create customer
		const customer = await Customer.create({
			first_name,
			last_name,
			email,
			address,
			lat,
			lng,
			availibility,
			phone,
		});

		const userId = customer.id;
		const encryptionKey = await this.generateEncryptionKey(userId);
		const hashedPassword = await this.hashPassword(password, encryptionKey);
		// Update the customer with the hashed password
		await Customer.update({
			password: hashedPassword
		}, {
			where: {
				id: userId
			}
		});


		// const encryptionKey2 =await this.generateEncryptionKey(userId);

		// const passwordMatches =await this.verifyPassword(password, hashedPassword, encryptionKey2);
		// console.log(passwordMatches); // true

		return customer;
	}
}

module.exports = new HomeController();