module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define('Staff', {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        
        
        ssn: DataTypes.INTEGER,
        designation: DataTypes.STRING,
        // status: DataTypes.STRING,
        created_on: DataTypes.DATE,
        created_by: DataTypes.STRING,
        remarks: DataTypes.STRING,
        updated_by: DataTypes.STRING,
        updated_on: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Staff',
        tableName: 'staff',
        timestamps: false,  // This will remove the automatic timestamp fields (createdAt, updatedAt)
        //underscored: true,
    });

    Staff.associate = (models) => {
        Staff.belongsTo(models.User, {
            foreignKey: 'userId'
        });
        
    };

    return Staff;
}