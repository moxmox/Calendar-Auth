//jshint esversion: 8

const express = require("express");
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ActionCode = require('./modules/ActionCode');
const ResponseCode = require('./modules/ResponseCode');

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

app.all('/failAuth', (req, res) => {
    //TODO: add code to indicate a reason for failure e.g. no such user or incorrect password
    res.send(ResponseCode.AUTH_FAIL);
});


app.post('/auth', passport.authenticate('local', { failureRedirect: '/failAuth' }), (req, res) => {
    //TODO: if success parse req.body to search for req.body.action variable and call appropriate action functioin
    console.log(`req.body ${req.body}`); //this indicates desired action
    try{
        if(req.body.action === ActionCode.CHECK_CREDENTIALS){
            res.send(ResponseCode.CREDENTIALS_VALID);
        }else{
            res.send(ResponseCode.INVALID_REQUEST);
        }
    }catch(err){
        console.error(err);
        res.ResponseCode(ResponseCode.REQUEST_FAILED);
    }
});

app.listen(server.port, server.ipaddr, () => {
    console.log(`\n\taddr: ${server.ipaddr}
    \n\tport: ${server.port}
    \nCtrl+C to Exit . . .`);
});