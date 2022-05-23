module.exports = (sequelize, Sequelize, DataTypes ) => {

  const Albums = sequelize.define("albums", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title : {
      type : DataTypes.STRING,
      allowNull : false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });
  return Albums;

};