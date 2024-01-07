module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define("Review", {
        reviewId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        itemId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        rating: {
            type: DataTypes.ENUM('1', '2', '3', '4', '5'),
            allowNull: false
        },
        comments: {
            type: DataTypes.STRING(256)
        }
    }, {
        sequelize,
        modelName: 'Review',
        tableName: 'review',
        timestamps: false,
        //underscored: true,
    });

    // Define associations if needed
    Review.associate = (models) => {
        Review.belongsTo(models.User, { foreignKey: 'userId' });
        Review.belongsTo(models.Catalog, { foreignKey: 'itemId' });
    };

    Review.sync({ force: false })
    .then(() => {
        console.log('Review table, if one doesn\'t exist');
    })
    .catch(error => {
        console.log('This error occurred', error);
    });

    return Review;
};
