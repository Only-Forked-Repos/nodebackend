'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("categories", [
			{
				name: "Food",
				status: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				name: "Packed Item",
				status: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("categories", null, {});
	}
};
