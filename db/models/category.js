'use strict';

import { checkDataIsValid, perPageDisplay } from '../../custom/secure';

export default (sequelize, DataTypes) => {
	const Category = sequelize.define('Category', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		name: {
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
		tableName: 'categories'
	});

	Category.associate = function(models) {
		// associations can be defined here
		Category.hasMany(models.Item, {
            foreignKey: "category_id",
            as: "categoryitems",
		})
	};

	// queries and other function starts
	Category.getDS = async () => {
		try {
			return await Category.findAll({
				where:{
					status: true
				},
				attributes: ['id','name']
			});
		} catch (e) {
			return [];
		}
	};

	Category.getList = async (reqData) => {
		try {
			const { pageNo } 	= reqData;
			const page = (checkDataIsValid(pageNo)) ? pageNo : 1;

			const categoryResult = await Category.findAndCountAll({
				where:{
					status: true
				},
				distinct: true,
                order: [['name', 'ASC']],
                offset: (page-1)*perPageDisplay,
				limit: perPageDisplay,
				attributes: ['id','name']
			});

			const totalPages = Math.ceil(categoryResult.count / perPageDisplay);

			const pageData = {
                total_record : categoryResult.count,
                per_page     : perPageDisplay,
                current_page : page,
                total_pages  : totalPages
			}

			return { categories: categoryResult.rows, pageData };

		} catch (e) {
			return [];
		}
	};

	Category.saveRecord = async (reqData) => {
		try {
			const result = await sequelize.transaction(async (t) => {
				const saveObj = {
					...reqData,
					createdAt: new Date(),
					updatedAt: new Date()
				};
				return await Category.create(saveObj, { transaction: t });
			});
			// return result from saved record
			return result;
		} catch (e) {
			return false;
		}
	};

	Category.getRecordById = async (id) => {
		try {
			const searchRecord = await Category.findByPk(id, {
				attributes: ['id','name','status']
			});
			if(!searchRecord || !searchRecord.status) return false;
			return searchRecord;
		} catch (e) {
			return false;
		}
	};

	Category.updateRecord = async (record, reqData) => {
		try {
			const result = await sequelize.transaction(async (t) => {
				const updateObj = {
					...reqData,
					updatedAt: new Date()
				};
				return await record.update(updateObj, { transaction: t });
			});
			// return result from updated record
			return result;
		} catch (e) {
			return false;
		}
	};

	Category.deleteRecord = async (record) => {
		try {
			const result = await sequelize.transaction(async (t) => {
				return await record.update({
					status: false,
					updatedAt: new Date()
				}, { transaction: t });
			});
			// return result from updated record
			return result;
		} catch (e) {
			return false;
		}
	};

	// Category.checkUsage = async (recordId) => {
	// 	try {
	// 		const { User } = sequelize.models;
	// 		const condition = { role_id: recordId, status: true };
	// 		const user = await User.findOne({ where: condition });
	// 		if (user === null) return false;
	// 		return true;
	// 	} catch (e) {
	// 		return true;
	// 	}
	// };

	return Category;
};