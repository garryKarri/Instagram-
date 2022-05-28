// eslint-disable-next-line strict

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId' });
    }
  }
  Post.init({
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    data: DataTypes.TEXT,
    img: DataTypes.TEXT,
    userId: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
