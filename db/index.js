var config = require("../server/config/config");

var sequelizeConfig = {url: config.databaseUrl, dialect: "mysql"}

sequelizeConfig.production = sequelizeConfig;
sequelizeConfig.test = sequelizeConfig;
sequelizeConfig.development = sequelizeConfig;

module.exports = sequelizeConfig;
