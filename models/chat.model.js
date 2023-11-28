module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('chat', {
    idx: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sender_name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    is_me: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    user_index: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    contents: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
      allowNull: false
    }
  }, {
    charset: 'utf8',
    collate: 'utf_general_ci',
    timestamps: false
  });

  Chat.createChat = (senderName, userIndex, isMe, contents) => {
    return Chat.create({
      sender_name: senderName,
      user_index: userIndex,
      is_me: isMe,
      contents: contents
    });
  };

  return Chat;
};
