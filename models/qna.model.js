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
      },
      correct: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false

      },
      bad: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
    }, {
      charset: 'utf8',
      collate: 'utf_general_ci',
      timestamps: true
    });
  
    Qna.createQna = (userIndex,question, answer) => {
      return Qna.create({
        question: question,
        user_index: userIndex,
        answer: answer,
        correct: 0,
        bad:0
      });
    };
    
    Qna.increaseCorrect = async (qnaIdx) => {
      return await Qna.update(
        { correct: sequelize.literal('correct + 1') },
        { where: { idx: qnaIdx } }
      );
    };

    Qna.increaseBad = async (qnaIdx) => {
      return await Qna.update(
        { bad: sequelize.literal('bad + 1') },
        { where: { idx: qnaIdx } }
      );
    };
  
    return Qna;
  };
  