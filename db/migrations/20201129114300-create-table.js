'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('tables', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING(191),
				allowNull: false,
			},
			capacity: {
				type: Sequelize.STRING(20),
				allowNull: false
			},
			table_status: {
				type: Sequelize.ENUM,
            	values: ['1', '2', '3'],
				defaultValue: '1'
			},
			current_order_data: {
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

	down: queryInterface /* , Sequelize */ => queryInterface.dropTable('tables')
};