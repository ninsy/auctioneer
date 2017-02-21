"use strict";

var Sequelize = require("sequelize");
var config = require("../config/config");
var fs = require("fs");
var path = require("path");
var sequelize = new Sequelize(config.databaseName, config.databaseOptions.user, process.env.DB_PASS, config.databaseOptions);

// TODO: some flag to be run when need to sync


var db = {};
fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "db.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize =  Sequelize;

setInterval(function () {
    db.query('SELECT 1');
}, 5000);


// db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
//     .then(function(){
//         return db.sequelize.sync();
//     })
//     .then(function(){
//         return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
//     });
module.exports = db;
