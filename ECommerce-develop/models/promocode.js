/*
CREATE TABLE `promocode` (
  `promocode` varchar(15) NOT NULL,
  `discount_percent` int unsigned DEFAULT NULL,
  `max_discount` int NOT NULL,
  `is_active` bit(1) NOT NULL,
  PRIMARY KEY (`promocode`)
)
*/

//same code struct as cart.js

module.exports = (sequelize, DataTypes) => {
    const Promocode = sequelize.define("Promocode", {
        promocode: 
        {
            type: DataTypes.STRING(15),
            primaryKey: true,
            allowNull: false
        },
        discount_percent: 
        {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        max_discount: 
        {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_active: 
        {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'Promocode',
        tableName: 'promocode',
        timestamps:false,
        //underscored: true,
    });
    
    Promocode.sync({ force: false })
    .then(() => {
        console.log('OTP table, if one doesnt exist');
    })
    .catch(error => {
        console.log('This error occured', error);
    });

    return Promocode;
}
