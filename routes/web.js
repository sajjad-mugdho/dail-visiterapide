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
    check('first_name', 'Le prénom doit contenir plus de 3 caractères')
        .exists()
        .isLength({ min: 3 }),
    check('last_name', 'Le nom de famille doit comporter plus de 3 caractères')
        .exists()
        .isLength({ min: 3 }),
    check('phone', 'Ce numéro de téléphone doit contenir 10 caractères')
        .exists()
        .isLength({ min: 10 }),
    check('email', "Cet email n'est pas valide")
        .exists()
        .isEmail()
        .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                Agent.findOne({ where: { email: req.body.email } })
                    .then(agent => {
                        if (agent !== null) {
                            reject(new Error('Email déjà utilisé'))
                        }
                        resolve(true)
                    })
            });
        }),
        
    check('address', 'Cette adresse doit comporter plus de 3 caractères')
        .exists()
        .isLength({ min: 3 }),

    check('lat', "La Latitude n'est pas valide")
        .exists()
        .isNumeric(),
    check('lng', "La longitude n'est pas valide")
        .exists()
        .isNumeric(),

    check('password', 'Votre mot de passe doit comporter au moins 10 caractères et doit comporter quatre types de caractères différents : majuscules, minuscules, chiffres, et signes de ponctuation ou caractères spéciaux (€, # . . .)')
        .exists()
        .isLength({ min: 10 })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/, "i"),
    check('availibility', 'Veuillez cocher au moins 3 heures de disponibilité')
        .exists()
        .custom((value, { req }) => {
            var availibility = req.body.availibility
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
            password: req.body.password,
            street_number: req.body.street_number,
            route: req.body.route,
            locality: req.body.locality,
            postal_code: req.body.postal_code,
            hd_camera: req.body.hd_camera,
            condition1: req.body.condition1,
            condition2: req.body.condition2,
            condition3: req.body.condition3,
        })
    }else{
        //if no errors register agent
        await HomeController.agentRegister(req, res)
        res.render('agent', {
            success_msg: 'Agent ajouté avec succès',
            customer_rating:5,
			reliability:5,
            order_qty:10,
			GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY

        })
        
        
    }
})

// register customer
router.post('/customer', [
    check('first_name', 'Le prénom doit contenir plus de 3 caractères')
        .exists()
        .isLength({ min: 3 }),
    check('last_name', 'Le nom de famille doit comporter plus de 3 caractères')
        .exists()
        .isLength({ min: 3 }),
    check('email', "Cet email n'est pas valide")
        .exists()
        .isEmail()
        .custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                Customer.findOne({ where: { email: req.body.email } })
                    .then(customer => {
                        if (customer !== null) {
                            reject(new Error('Email déjà utilisé'))
                        }
                        resolve(true)
                    })
            });
        }),
    check('address', 'Cette adresse doit comporter plus de 3 caractères')
        .exists()
        .isLength({ min: 3 }),
    check('lat', "La latitude n'est pas valide")
        .exists()
        .isNumeric(),
    check('lng', "La longitude n'est pas valide")
        .exists()
        .isNumeric(),
    check('phone', 'Ce numéro de téléphone doit contenir 10 caractères')
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
    check('password', 'Votre mot de passe doit comporter au moins 10 caractères et doit comporter quatre types de caractères différents : majuscules, minuscules, chiffres, et signes de ponctuation ou caractères spéciaux (€, # . . .)')
        .exists()
        .isLength({ min: 10 })
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/, "i"),

        
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
            password: req.body.password,
            street_number: req.body.street_number,
            route: req.body.route,
            locality: req.body.locality,
            postal_code: req.body.postal_code,
            condition1: req.body.condition1,
            condition2: req.body.condition2,   

        })
    }else{
        //if no errors register customer
        await HomeController.customerRegister(req, res)
        res.render('customer', {
            success_msg: 'Client ajouté avec succès',
			GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY

        })
    }
})
module.exports = router;