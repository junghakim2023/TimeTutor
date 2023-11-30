module.exports = (sequelize, DataTypes) => {
    const Qna = sequelize.define('qna', {
      idx: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      user_index: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      }
    }, {
      charset: 'utf8',
      collate: 'utf_general_ci',
      timestamps: true
    });
  
    Qna.createQna = (userIndex,question, answer) => {
      return Qna.create({
        question: question,
        user_index: userIndex,
        answer: answer
      });
    };
  
    return Qna;
  };
  