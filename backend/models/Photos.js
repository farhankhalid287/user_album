module.exports = (sequelize, Sequelize, DataTypes ) => {

  const Photos = sequelize.define("photos", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title : {
      type : DataTypes.STRING,
      allowNull : false,
    },
    url : {
      type : DataTypes.STRING,
      allowNull : false,
    },
    album_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });
  return Photos;

};