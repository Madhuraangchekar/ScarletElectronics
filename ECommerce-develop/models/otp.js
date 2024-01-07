const { encrypt, decrypt } = require('../util/encryptionUtil'); // Assuming the encryptionUtil.js file is in the same directory
const User = require('./users');

module.exports = (sequelize, DataTypes) => {
    const OTP = sequelize.define('OTP', {
        emailId: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        encrypted_emailId: {
            type: DataTypes.STRING(1024),
            allowNull: true
        },
        otp: {
            type: DataTypes.STRING(5),
            allowNull: true
        },
        encrypted_otp: {
            type: DataTypes.STRING(1024),
            allowNull: true
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        expires_on:{
            
            type: DataTypes.DATE,
            allowNull: false
            
        },
    },{
        sequelize,
        modelName: 'OTP',
        tableName: 'otps',
        timestamps:false,
        //underscored: true,
        hooks: {
            beforeCreate: (otp, options) => {
                if (otp.emailId) {
                    otp.encrypted_emailId = encrypt(otp.emailId);
                }
                if (otp.otp) {
                    otp.encrypted_otp = encrypt(otp.otp);
                }
            },
            beforeUpdate: (otp, options) => {
                if (otp.changed('emailId')) {
                    otp.encrypted_emailId = encrypt(otp.emailId);
                }
                if (otp.changed('otp')) {
                    otp.encrypted_otp = encrypt(otp.otp);
                }
            }
        }

    });
    
    OTP.sync({ force: false })
    .then(() => {
        console.log('OTP table, if one doesnt exist');
    })
    .catch(error => {
        console.log('This error occured', error);
    });


return OTP;
}