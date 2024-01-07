
module.exports = (sequelize, DataTypes) => {
    const purchase = sequelize.define("Purchase", {
            purchaseId:
                {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                },
            paymentId:
                {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                },
            purchase_date:
                {
                    type: 'TIMESTAMP',
                    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
                    allowNull: false
                },
            total_price:
                {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
            userId:
                {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                }
        },
        {
            sequelize,
            modelName: 'Purchase',
            tableName: 'purchase',
            timestamps:false,
            //underscored: true,
        });


    purchase.sync({ force: false })
        .then(() => {
            console.log('Purchase table created, if one doesnt exist');
        })
        .catch(error => {
            console.log('An error occurred', error);
        });


    return purchase;
}


