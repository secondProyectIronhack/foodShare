/*jshint esversion: 6*/
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const bcryptSalt = 10;
const passport = require('passport');
const {
    ensureLoggedIn,
    ensureLoggedOut
} = require('connect-ensure-login');
const User = require('../models/user');
const Food = require("../models/food");

router.get('/signup', ensureLoggedOut(), (req, res, next) => {
    res.render('authentication/signup', {
        errorMessage: 'ERROR'
    });
});

router.post('/signup', ensureLoggedOut(), (req, res, next) => {
    const {
        name,
        email,
        password
    } = req.body;
    if (email === '' || password === '') {
        res.render('authentication/signup', {
            errorMessage: 'Email or password are required'
        });
        return;
    }
    User.findOne({
        email: email
    }, '_id', (err, existingUser) => {
        if (err) {
            next(err);
            return;
        }

        if (existingUser !== null) {
            res.render('authentication/signup', {
                errorMessage: `The email ${email} is already in use.`
            });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashedPass = bcrypt.hashSync(password, salt);

        const userSubmission = {
            name: name,
            email: email,
            password: hashedPass
        };

        const theUser = new User(userSubmission);

        theUser.save((err) => {
            if (err) {
                res.render('authentication/signup', {
                    errorMessage: 'Something went wrong. Try again later.'
                });
                return;
            }
            req.session.currentUser = theUser;
            res.redirect('/');
        });
    });
});

router.get('/login', ensureLoggedOut(), (req, res, next) => {
    res.render('authentication/login', {
        errorMessage: ''
    });
});

router.post('/login', ensureLoggedOut(), (req, res, next) => {
    const emailInput = req.body.email;
    const passwordInput = req.body.password;

    if (emailInput === '' || passwordInput === '') {
        res.render('authentication/login', {
            errorMessage: 'Enter both email and password to log in.'
        });
        return;
    }

    User.findOne({
        email: emailInput
    }, (err, theUser) => {
        if (err || theUser === null) {
            res.render('authentication/login', {
                errorMessage: `There isn't an account with email ${emailInput}.`
            });
            return;
        }

        if (!bcrypt.compareSync(passwordInput, theUser.password)) {
            res.render('authentication/login', {
                errorMessage: 'Invalid password.'
            });
            return;
        }

        req.session.currentUser = theUser;
        res.redirect('/');
    });
});

router.get('/logout', (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/');
        return;
    }

    req.session.destroy((err) => {
        if (err) {
            next(err);
            return;
        }
        res.redirect('/');
    });
});

module.exports = router;
