const { encrypt, decrypt } = require('../util/encryptionUtil'); // Assuming the encryptionUtil.js file is in the same directory

module.exports = (sequelize, DataTypes) => {
    const StripeUser = sequelize.define('StripeUser', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        stripeCustomerId: {
            type: DataTypes.STRING(20),
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: 'StripeUser',
        tableName: 'stripe_user',
        timestamps: false,
    });

    StripeUser.associate = (models) => {
        StripeUser.hasOne(models.User, {
            foreignKey: 'userId',
        });
    };

    StripeUser.sync({ force: false })
        .then(() => {
            console.log('StripeUser table has been successfully created, if one doesnt exist');
        })
        .catch(error => {
            console.log('This error occured', error);
        });
    return StripeUser;
};
