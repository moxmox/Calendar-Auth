//jshint esversion: 8

const mysql = require('mysql');
const User = require('../models/User');
const Event = require('../models/Event');

//TODO: store password securely
const MYSQL_PASSWORD = 'X78v9o!3';

const database = {};

database.initialize = () => {
    let connection = mysql.createConnection({
        //TODO: remove hardcoded host address
        host    : '192.168.0.6',
        database: 'cloud_calendar',
        user    : 'calendar_user',
        password:  MYSQL_PASSWORD
    });
        
    connection.connect((err) => {
        if(err){
            console.err('error connecting');
            throw error;
        }
        console.log('connection successful');
    });

    return connection;
};

module.exports = database;