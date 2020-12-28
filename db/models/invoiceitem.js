'use strict';
export default (sequelize, DataTypes) => {
    const InvoiceItem = sequelize.define('InvoiceItem', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		invoice_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
		},
		category_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
		},
		item_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
		},
		quantity: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		unit_price: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		amount: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		status: {
			type: DataTypes.BOOLEAN(true),
			allowNull: true,
			defaultValue: '1'
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE
		}
    }, {
		tableName: 'invoice_items'
    });

    InvoiceItem.associate = function(models) {
		// associations can be defined here
		InvoiceItem.belongsTo(models.Invoice, {
			foreignKey: "invoice_id",
			as: "invoice",
		}),

		InvoiceItem.belongsTo(models.Item, {
			foreignKey: "item_id",
			as: "item",
		})
    };

    return InvoiceItem;
};