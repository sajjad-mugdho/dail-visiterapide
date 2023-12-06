const express = require('express');
const router = express.Router();
const HomeController = require('../app/controllers/HomeController');
const { check, validationResult } = require('express-validator')

// home page
router.get('/', HomeController.home);

// register agent
router.post('/', [
    check('first_name', 'This First name must me 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('last_name', 'This Last name must me 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
], async (req, res)=> {
    const errors = validationResult(req)
    //if there are errors
    if(!errors.isEmpty()) {
        const alert = errors.array({ onlyFirstError: true })
        //send alert to view with errors and form values
        res.render('index', {
            alert,
            first_name: req.body.first_name,
            last_name: req.body.last_name
        })
    }else{
        //if no errors register agent
        await HomeController.agentRegister(req, res)
        res.render('index', {
            success_msg: 'Agent added successfully'
        })
    }
})
module.exports = router;