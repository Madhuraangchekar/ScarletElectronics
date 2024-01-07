const { encrypt, decrypt } = require('../util/encryptionUtil'); // Assuming the encryptionUtil.js file is in the same directory


const IV_LENGTH = 16;
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        userid: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        encrypted_name: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        },
        emailId: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        encrypted_emailId: {
            type: DataTypes.STRING(1024),
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        encrypted_password: {
            type: DataTypes.STRING(1024),
            allowNull: true
        },
        created_by: {
            type: DataTypes.STRING(20),
            defaultValue: null
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        remarks: {
            type: DataTypes.STRING(100),
            defaultValue: null
        },
        status: {
            type: DataTypes.STRING(1),
            defaultValue: null
        },
        updated_by: {
            type: DataTypes.STRING(20),
            defaultValue: null
        },
        updated_on: {
            type: DataTypes.DATE,
            defaultValue: null
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false,  // This will remove the automatic timestamp fields (createdAt, updatedAt)
        //underscored: true,
        hooks: {
            beforeCreate: (user, options) => {
                if (user.name) {
                    user.encrypted_name = encrypt(user.name);
                }
                if (user.emailId) {
                    user.encrypted_emailId = encrypt(user.emailId);
                }
                if (user.password) {
                    user.encrypted_password = encrypt(user.password);
                }
            },
            beforeUpdate: (user, options) => {
                if (user.changed('name')) {
                    user.encrypted_name = encrypt(user.name);
                }
                if (user.changed('emailId')) {
                    user.encrypted_emailId = encrypt(user.emailId);
                }
                if (user.changed('password')) {
                    user.encrypted_password = encrypt(user.password);
                }
            }
        }
    });

    User.associate = (models) => {
        User.hasOne(models.EndUsers, {
            foreignKey: 'userId',
        });
        User.hasOne(models.Staff, {
            foreignKey: 'userId' 
        });
    };

    User.sync({ force: false })
        .then(() => {
            console.log('User table has been successfully created, if one doesnt exist');
        })
        .catch(error => {
            console.log('This error occured', error);
        });
    return User;
};
