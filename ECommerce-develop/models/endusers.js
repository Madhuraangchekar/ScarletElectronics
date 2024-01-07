module.exports = (sequelize, DataTypes) => {
    const EndUser = sequelize.define('EndUsers', {
        userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        },
        address_line1: DataTypes.STRING(50),
        address_line2: DataTypes.STRING(50),
        address_city: DataTypes.STRING(50),
        address_state_code: DataTypes.STRING(2),
        address_zipcode: DataTypes.STRING(6),
        phone_nr: DataTypes.STRING(15),
        created_by: DataTypes.INTEGER,
        created_on: DataTypes.DATE,
        updated_by: DataTypes.INTEGER,
        updated_on: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'EndUsers',
        tableName: 'end_user',
        timestamps: false,  // This will remove the automatic timestamp fields (createdAt, updatedAt)
        //underscored: true,
    });

    EndUser.associate = (models) => {
        EndUser.hasMany(models.ItemListing, {
            foreignKey: 'sellerId'
        });
        EndUser.belongsTo(models.User, {
            foreignKey: 'userId'
        });
        EndUser.hasMany(models.EndUserRequest, {
            foreignKey: 'userId'
        });
        
    };

    return EndUser;
}
  