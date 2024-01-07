module.exports = (sequelize, DataTypes) => {
    const EndUserRequest = sequelize.define('EndUserRequest', {
        requestId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        userId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false
        },
        listingId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
          defaultValue: null
        },
        update_description: {
          type: DataTypes.STRING(200),
          defaultValue: null
        },
        created_on: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        current_status: {
          type: DataTypes.STRING(5),
          defaultValue: null
        },
        customer_rep: {
          type: DataTypes.INTEGER.UNSIGNED,
          defaultValue: null
        },
        updated_on: {
          type: DataTypes.DATE,
          defaultValue: null
        }
      }, {
        sequelize,
        modelName: 'EndUserRequest',
        tableName: 'end_user_request',
        timestamps: false // If you want Sequelize to handle timestamps (created_at, updated_at), set this to true
      });
      
      // Define associations if needed
      EndUserRequest.associate = (models) => {
        EndUserRequest.belongsTo(models.EndUsers, { foreignKey: 'userId', onDelete: 'CASCADE' });
        EndUserRequest.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
        
        // EndUserRequest.belongsTo(models.ItemListing, { foreignKey: 'listingId', onDelete: 'CASCADE' });
        //EndUserRequest.belongsTo(models.Staff, { foreignKey: 'customer_rep', onDelete: 'CASCADE' });
    };

    return EndUserRequest;
        
};
