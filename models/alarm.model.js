module.exports = (sequelize, DataTypes) => {
    const Alarm = sequelize.define('alarm', {
      idx: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      time: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      user_index: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
    }, {
      charset: 'utf8',
      collate: 'utf_general_ci',
      timestamps: true
    });
  
    Alarm.createAlarm = (userIndex, time) => {
      return Alarm.create({
        time: time,
        user_index: userIndex
      });
    };
  
    return Alarm;
  };
  