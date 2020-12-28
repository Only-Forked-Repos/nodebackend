'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('invoice_items', {
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
			item_id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
			},
			quantity: {
				type: Sequelize.STRING(191),
				allowNull: false,
			},
			unit_price: {
				type: Sequelize.STRING(191),
				allowNull: false,
			},
			amount: {
				type: Sequelize.STRING(191),
				allowNull: false,
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

	down: queryInterface /* , Sequelize */ => queryInterface.dropTable('invoice_items')
};