//jshint esversion: 8

const bcrypt = require('bcrypt');

const User = function(username, password){
    this.username = username;
    this.password = password;
};

User.prototype.verify = function(dbConnection, done){
    let sql = `SELECT * FROM cloud_user WHERE username = '${this.username}' LIMIT 1;`;
    let valid = false;
    let storedHash;
    dbConnection.query(sql, (err, results, fields) => {
        if(err){
            console.error(err);
            throw err;
        }
        if(!results[0]){
            return false;
        }
        storedHash = results[0].password;
    });
    bcrypt.compare(this.password, storedHash, (err, res) => {
        console.log('compare running');
        valid = true;
        done(valid);
        return;
    });
    done(valid);
    return;
};

User.prototype.exists = function(dbConnection, done){
    let sql = `SELECT * FROM cloud_user WHERE username = '${this.username}' LIMIT 1;`;
    let match = false;
    dbConnection.query(sql, (err, results, fields) => {
        if(err){
            console.error(err);
            throw err;
        }
        if(results[0])
        {
            match = true;
        }
        done(match);
    });
};

User.prototype.save = function(dbConnection, done){
    bcrypt.hash(this.password, 10).then((hash) => {
        let sql = "INSERT INTO cloud_user (username, password) VALUES ( '" + this.username + "', '" + hash + "')";
        dbConnection.query(sql, (err, result) => {
            if(err){
                done(result, err);
                return;
            }
                done(result);
        });
    });
};

module.exports = User;