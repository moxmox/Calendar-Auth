//jshint esversion: 8

const Event = function(username, datetime, description){
    this.username = username;
    this.datetime = datetime;
    this.description = description;
};

Event.prototype.save = function() {
    //TODO: save event to database
};

module.exports = Event;