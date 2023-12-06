const Agent = require('../models/Agent');

class HomeController {
	// [GET] /
	// home page
	home(req, res) {
		res.render('index');
	}

	// [POST] /
	// register agent
	async agentRegister(req, res) {
		const { first_name, last_name} = req.body;

		// Create agent
		const agent = await Agent.create({
			first_name,
			last_name
		});
		return agent;
	}
}

module.exports = new HomeController();