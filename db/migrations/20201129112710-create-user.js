'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('users', {
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
			email_id: {
				type: Sequelize.STRING(191),
				allowNull: false,
				// unique: true
			},
			password: {
				type: Sequelize.STRING(666),
				allowNull: false,
			},
			mobile: {
				type: Sequelize.STRING(20),
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

	down: queryInterface /* , Sequelize */ => queryInterface.dropTable('users')
};