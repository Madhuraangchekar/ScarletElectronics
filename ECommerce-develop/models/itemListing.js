module.exports = (sequelize, DataTypes) => {
    const ItemListing = sequelize.define('ItemListing', {
        listingId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sellerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        created_on: DataTypes.DATE,
        created_by: DataTypes.STRING,
        remarks: DataTypes.STRING,
        updated_by: DataTypes.STRING,
        updated_on: DataTypes.DATE,
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
    }, {
        sequelize,
        modelName: 'ItemListing',
        tableName: 'item_listing',
        timestamps: false,  // This will remove the automatic timestamp fields (createdAt, updatedAt)
        //underscored: true,
    });

    ItemListing.associate = (models) => {
        ItemListing.belongsTo(models.Catalog, {
            foreignKey: 'itemId',
        });
        ItemListing.belongsTo(models.EndUsers, {
            foreignKey: 'sellerId' 
        });
    };

    ItemListing.sync({ force: false })
        .then(() => {
            console.log('item_listing table has been successfully synched');
        })
        .catch(error => {
            console.log('item_listing sync error occured : ', error);
        });
    return ItemListing;
}