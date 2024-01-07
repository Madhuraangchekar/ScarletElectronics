'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};


let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log("Starting to create assosciations!!");
const User = require('./users.js')(sequelize, Sequelize.DataTypes);

const EndUser = require('./endusers.js')(sequelize, Sequelize.DataTypes);
// User.hasOne(EndUser, { foreignKey: 'userId' });
// EndUser.belongsTo(User, { foreignKey: 'userId' });

const Order = require('./order.js')(sequelize, Sequelize.DataTypes);
const Purchase = require('./purchase.js')(sequelize, Sequelize.DataTypes);
// Purchase.hasMany(Order);
// purchase.hasOne(User);
// User.hasMany(purchase);

const Staff = require('./staff.js')(sequelize, Sequelize.DataTypes);
// User.hasOne(Staff, { foreignKey: 'userId' });
// Staff.belongsTo(User, { foreignKey: 'userId' });

const ItemListing = require('./itemListing.js')(sequelize, Sequelize.DataTypes);
// EndUser.hasMany(ItemListing, { foreignKey: 'sellerId' });
// ItemListing.belongsTo(EndUser, { foreignKey: 'sellerId' });

const Catalog = require('./catalog.js')(sequelize, Sequelize.DataTypes);
// Catalog.hasMany(ItemListing, { foreignKey: 'itemId' });
// ItemListing.belongsTo(Catalog, { foreignKey: 'itemId' });

console.log("Associations created!!");

const Review = require('./review.js')(sequelize, Sequelize.DataTypes);

// console.log("Db object : ", db);

module.exports = db;
