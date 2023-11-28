
module.exports = (sequelize, DataTypes)=>{
  return sequelize.define('chat',{
    idx:{
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sender_name:{
      type: DataTypes.STRING(30),
      allowNull: false
    },
    is_me:{
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    user_index:{
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    contents:{
      type: DataTypes.TEXT,
      allowNull:false
    },

  },{
    chatset:'utf8',
    collate:'utf_general_ci',
    timestamps: true
  });
}


