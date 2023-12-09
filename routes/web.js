const express = require('express');
const router = express.Router();
const HomeController = require('../app/controllers/HomeController');
const { check, validationResult } = require('express-validator')

// home page
router.get('/', HomeController.home);

router.get('/agent', HomeController.agent);
router.get('/customer', HomeController.customer);

// register agent
router.post('/agent', [
    check('first_name', 'This First name must me 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('last_name', 'This Last name must me 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('email', 'This email is not valid')
        .exists()
        .isEmail(),
        
    check('address', 'This address must me 3+ characters long')
        .exists()
        .isLength({ min: 3 }),

    check('lat', 'This latitude is not valid')
        .exists()
        .isNumeric(),
    check('lng', 'This longitude is not valid')
        .exists()
        .isNumeric(),

    

], async (req, res)=> {
    const errors = validationResult(req)
    //if there are errors
    if(!errors.isEmpty()) {
        const alert = errors.array({ onlyFirstError: true })
        //send alert to view with errors and form values
        res.render('agent', {
            alert,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            address: req.body.address,
            lat: req.body.lat,
            lng: req.body.lng,
            customer_rating: req.body.customer_rating,
            reliability: req.body.reliability,
            distance: req.body.distance,
            order_qty: req.body.order_qty,
			GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY
        })
    }else{
        //if no errors register agent
        await HomeController.agentRegister(req, res)
        res.render('agent', {
            success_msg: 'Agent added successfully',
			GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY

        })
        
        
    }
})

// register customer
router.post('/customer', [
    check('first_name', 'This First name must me 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('last_name', 'This Last name must me 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('email', 'This email is not valid')
        .exists()
        .isEmail(),
    check('address', 'This address must me 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('lat', 'This latitude is not valid')
        .exists()
        .isNumeric(),
    check('lng', 'This longitude is not valid')
        .exists()
        .isNumeric(),
], async (req, res)=> {
    const errors = validationResult(req)
    //if there are errors
    if(!errors.isEmpty()) {
        const alert = errors.array({ onlyFirstError: true })
        //send alert to view with errors and form values
        res.render('customer', {
            alert,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            address: req.body.address,
            lat: req.body.lat,
            lng: req.body.lng,
			GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY

        })
    }else{
        //if no errors register customer
        await HomeController.customerRegister(req, res)
        res.render('customer', {
            success_msg: 'Customer added successfully',
			GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY

        })
    }
})
module.exports = router;