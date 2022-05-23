const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const DataTypes = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./User.js")(sequelize, Sequelize, DataTypes);
db.albums = require("./Albums.js")(sequelize, Sequelize, DataTypes);
db.photos = require("./Photos.js")(sequelize, Sequelize, DataTypes);
db.user.hasMany(db.albums, { foreignKey: "user_id" });
db.albums.belongsTo(db.user, { foreignKey: "user_id" });
db.albums.hasMany(db.photos, { foreignKey: "album_id" });
db.photos.belongsTo(db.albums, { foreignKey: "album_id" });
module.exports = db;
