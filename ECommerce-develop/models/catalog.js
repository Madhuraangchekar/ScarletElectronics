const { encrypt, decrypt } = require('../util/encryptionUtil'); 
const IV_LENGTH = 16;
module.exports = (sequelize, DataTypes) => {
    const Catalog = sequelize.define('Catalog', {
        itemId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          name: {
            type: DataTypes.STRING(350),
            allowNull: false,
          },
          description: {
            type: DataTypes.STRING(1000),
            defaultValue: "NA",
            allowNull: false,
          },
          category: {
            type: DataTypes.STRING(50),
          },
          cpu: {
            type: DataTypes.STRING(350),
            allowNull: true,
          },
          gpu: {
            type: DataTypes.STRING(350),
            allowNull: true,
          },
          ram: {
            type: DataTypes.STRING(350),
            allowNull: true,
          },
          storage: {
            type: DataTypes.STRING(350),
          },
          operating_system: {
            type: DataTypes.STRING(350),
            allowNull: true,
          },
          screen_size: {
            type: DataTypes.STRING(350),
          },
          screen_type: {
            type: DataTypes.STRING(350),
          },
          screen_resolution: {
            type: DataTypes.STRING(350),
          },
          front_camera: {
            type: DataTypes.STRING(350),
            allowNull: true,
          },
          rear_camera: {
            type: DataTypes.STRING(350),
            allowNull: true,
          },
          itemImage: {
            type: DataTypes.BLOB('long'),
          },
          listing_Status: {
            type: DataTypes.STRING(10),
          },
          approval_Status: {
            type: DataTypes.STRING(10),
          },
          created_on: {
            type: DataTypes.DATE,
          },
          created_by: {
            type: DataTypes.INTEGER,
          },
          remarks: {
            type: DataTypes.STRING(350),
          },
          updated_by: {
            type: DataTypes.STRING(20),
          },
          updated_on: {
            type: DataTypes.DATE,
          },
        }, {
        sequelize,
        modelName: 'Catalog',
        tableName: 'ref_catalog',
        timestamps: false,  // This will remove the automatic timestamp fields (createdAt, updatedAt)
        //underscored: true,
        
    });

    Catalog.associate = (models) => {
      Catalog.hasMany(models.ItemListing, {
          foreignKey: 'itemId',
      });
      Catalog.hasMany(models.Review, {
        foreignKey: 'itemId',
    });
  };

    Catalog.sync({ force: false })
        .then(() => {
            console.log('catalog table has been successfully created, if one doesnt exist');
        })
        .catch(error => {
            console.log('This error occured', error);
        });
    return Catalog;
};
