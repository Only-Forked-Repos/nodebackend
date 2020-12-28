'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('invoices', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			table_id: {
				type: Sequelize.INTEGER(11),
				allowNull: false,
			},
			invoice_no: {
				type: Sequelize.STRING(191),
				allowNull: false,
			},
			invoice_date: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			sub_total: {
				type: Sequelize.STRING(191),
				allowNull: false,
			},
			discount_on_amt: {
				type: Sequelize.STRING(191),
				allowNull: false,
			},
			discount_percent: {
				type: Sequelize.STRING(191),
				allowNull: false,
			},
			discount_amount: {
				type: Sequelize.STRING(191),
				allowNull: false,
			},
			taxable_amount: {
				type: Sequelize.STRING(191),
				allowNull: false,
			},
			amount_to_pay: {
				type: Sequelize.STRING(191),
				allowNull: false,
			},
			paid_amount: {
				type: Sequelize.STRING(191),
				allowNull: false,
			},
			balance: {
				type: Sequelize.STRING(191),
				allowNull: true,
			},
			pay_mode: {
				type: Sequelize.STRING(191),
				allowNull: true,
			},
			note: {
				type: Sequelize.TEXT,
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

	down: queryInterface /* , Sequelize */ => queryInterface.dropTable('invoices')
};