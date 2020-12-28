'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('invoice_taxes', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			invoice_id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
			},
			category_id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
			},
			taxable_amount: {
				type: Sequelize.STRING(191),
				allowNull: false,
			},
			tax_percent: {
				type: Sequelize.STRING(191),
				allowNull: false,
			},
			tax_amount: {
				type: Sequelize.STRING(191),
				allowNull: false,
			},
			tax_amt_obj: {
				type: Sequelize.STRING(191),
				allowNull: true,
			},
			status: {
				type: Sequelize.BOOLEAN(true),
				allowNull: true,
				defaultValue: '1'
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},

	down: queryInterface /* , Sequelize */ => queryInterface.dropTable('invoice_taxes')
};