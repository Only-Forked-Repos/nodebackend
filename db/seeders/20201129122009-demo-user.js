'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("users", [
			{
				name: "Sankalp Gajbhiye",
				email_id: "gajbhiye.sankalp@gmail.com",
				password: bcrypt.hashSync("12345678", bcrypt.genSaltSync(10), null),
				mobile: "8109847928",
				status: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
  	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("users", null, {});
	}
};
