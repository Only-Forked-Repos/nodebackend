'use strict';
export default (sequelize, DataTypes) => {
	const InvoiceTax = sequelize.define('InvoiceTax', {
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
		taxable_amount: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		tax_percent: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		tax_amount: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		tax_amt_obj: {
			type: DataTypes.STRING(191),
			allowNull: true,
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
		tableName: 'invoice_taxes'
	});

	InvoiceTax.associate = function(models) {
		// associations can be defined here
		InvoiceTax.belongsTo(models.Invoice, {
			foreignKey: "invoice_id",
			as: "invoice",
		})
	};

	return InvoiceTax;
};