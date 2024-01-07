module.exports = (sequelize, DataTypes) => {
    const Messages = sequelize.define('Messages', {
        messageId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        requestId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'EndUserRequest', // This should match your Sequelize model name for end_user
                key: 'requestId',
            },
            onDelete: 'CASCADE'
            
            
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'end_user', // This should match your Sequelize model name for end_user
                key: 'userId',
            },
            onDelete: 'CASCADE'
        },
        customer_rep: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: null
        },
        listingId: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: null
        },
        update_description: {
            type: DataTypes.STRING(200),
            defaultValue: null
        },
        created_on: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        created_by: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    
    }, {
        sequelize,
        modelName: 'Messages',
        tableName: 'messages',
        timestamps: false // If you want Sequelize to handle timestamps (created_at, updated_at), set this to true
      });
      
      // Define associations if needed
      Messages.associate = (models) => {
        Messages.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
        Messages.belongsTo(models.EndUserRequest, { foreignKey: 'requestId', onDelete: 'CASCADE'  });
        
        //EndUserRequest.belongsTo(models.Staff, { foreignKey: 'customer_rep', onDelete: 'CASCADE' });
    };


    

    return Messages;
        
};
