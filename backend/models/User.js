var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;
module.exports = (sequelize, Sequelize, DataTypes ) => {

  const User = sequelize.define("user", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique : true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique : true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING
    },
    mobile: {
      type: DataTypes.STRING
    },
    cnic: {
      type: DataTypes.STRING
    },
    hash: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING(1024)
    }

  });

  User.prototype.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
  };
  User.prototype.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  };
  User.prototype.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: this.id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    }, secret);
  };
  User.prototype.toAuthJSON = function(){
    return {
      user : {
        username: this.username,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
      },
      token: this.generateJWT(),
    };
  };
  return User;

};