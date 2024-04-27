const express = require('express');
const router = express.Router();
const HomeController = require('../app/controllers/HomeController');
const { check, validationResult } = require('express-validator')
const Agent = require('../app/models/Agent');
const Customer = require('../app/models/Customer');

// home page
router.get('/', HomeController.home);

router.get('/agent', HomeController.agent);
router.get('/customer', HomeController.customer);
router.get('/customers', HomeController.customers);
router.post('/customers', HomeController.customer_search);

router.get('/customer/:id', HomeController.searchAgent);
router.post('/agent/search', HomeController.searchAgentFilter);


// register agent
router.post('/agent', [
    check('first_name', 'This First name must me 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('last_name', 'This Last name must me 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('phone', 'This Phone number must me 10+ characters long')
        .exists()
        .isLength({ min: 10 }),
    check('email', 'This email is not valid')
        .exists()
        .isEmail()
        .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                Agent.findOne({ where: { email: req.body.email } })
                    .then(agent => {
                        if (agent !== null) {
                            reject(new Error('E-mail already in use'))
                        }
                        resolve(true)
                    })
            });
        }),
        
    check('address', 'This address must me 3+ characters long')
        .exists()
        .isLength({ min: 3 }),

    check('lat', 'This latitude is not valid')
        .exists()
        .isNumeric(),
    check('lng', 'This longitude is not valid')
        .exists()
        .isNumeric(),

    check('password', 'Votre mot de passe doit comporter au moins 10 caractères et doit comporter quatre types de caractères différents : majuscules, minuscules, chiffres, et signes de ponctuation ou caractères spéciaux (€, # . . .)')
        .exists()
        .isLength({ min: 10 })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/, "i"),
    check('availibility', 'Veuillez cocher au moins 3 heures de disponibilité')
        .exists()
        .custom((value, { req }) => {
            const availibility = req.body.availibility
            availibility=availibility.split(',')
            //remove 0 values from array
            availibility = availibility.filter(function(e) { return e !== '0' })
            if(availibility.length >= 6) {
                return true
            }else{
                return false
            }
        }),




        

    

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
            availibility: req.body.availibility,
			GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
            phone: req.body.phone,
            password: req.body.password
        })
    }else{
        //if no errors register agent
        await HomeController.agentRegister(req, res)
        res.render('agent', {
            success_msg: 'Agent added successfully',
            customer_rating:5,
			reliability:5,
            order_qty:10,
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
        .isEmail()
        .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                Customer.findOne({ where: { email: req.body.email } })
                    .then(customer => {
                        if (customer !== null) {
                            reject(new Error('E-mail already in use'))
                        }
                        resolve(true)
                    })
            });
        }),
    check('address', 'This address must me 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('lat', 'This latitude is not valid')
        .exists()
        .isNumeric(),
    check('lng', 'This longitude is not valid')
        .exists()
        .isNumeric(),
    check('phone', 'This Phone number must me 10 characters long')
        .exists()
        .custom((value, { req }) => {
            //remove spaces
            const phone = value.replace(/\s/g, '')
            //check if phone number is valid
            if(phone.match(/^\d{10}$/) !== null) {
                return true
            }else{
                return false
            }
        }),

        
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
            availibility: req.body.availibility,
			GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
            phone: req.body.phone,
            password: req.body.password

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