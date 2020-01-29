//jshint esversion: 8

const express = require("express");
const session = require('express-session');
const uuid = require('uuid/v4');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

const server = require("./modules/server");
const database = require('./modules/database');
const User = require('./models/User');
const Event = require('./models/Event');

//TODO: store session secret securely
const SESSION_SECRET = '0198aAvV8';

if(!server.init(process.argv.slice(2, process.argv.length)))
{
    console.error('server not initialized!');
}

passport.use(new LocalStrategy({session: false}, (username, password, done) => {
    console.log(`${username} ${password}`);
    let user = new User(username, password);
    user.verify(db, (isValid) => {
        console.log('verify callback ' + isValid);
        if(!isValid){
            return done(null, false);
        }else{
            return done(null, user);
        }
    });
}));

passport.serializeUser((user, done) => {
    console.log('passport.serializeUser()');
    done(null, user);
});

passport.deserializeUser((id, done) => {
    console.log('passport.deserial');
    done(null, user);
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

let db = database.initialize();

app.post('/register', (req, res) => {
    let user = new User(req.body.username, req.body.password);
    user.exists(db, (match) => {
        if(!match){
            user.save(db, (result, err) => {
                if(err){
                    res.redirect('/failReg');
                    return;
                }
                res.send('saved user');
            });
        }else{
            res.redirect('/failReg');
        }
    });
});

app.post('/failReg', (req, res) => {
    //TODO: add logic to differentiate between causes of registration failure
    res.send('failed to register new user. This user may already exist');
});

app.post('/failAuth', (req, res) => {
    res.send('failure to authenticate user');
});

app.post('/main', (req, res) => {
    res.send('success');
});

app.post('/auth', passport.authenticate('local', { failureRedirect: '/failAuth' }), (req, res) => {
    //TODO: if success parse req.body to search for req.body.action variable and redirect based on value
    console.log(`req.body.action: ${req.body.action}`); //this indicates desired action
    try{
        res.redirect(308, '/main');
    }catch(err){
        console.error(err);
    }
});

app.listen(server.port, server.ipaddr, () => {
    console.log(`\n\taddr: ${server.ipaddr}
    \n\tport: ${server.port}
    \nCtrl+C to Exit . . .`);
});