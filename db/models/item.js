'use strict';

import { checkDataIsValid, perPageDisplay } from '../../custom/secure';

export default (sequelize, DataTypes) => {
	const Item = sequelize.define('Item', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		category_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		price: {
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
		tableName: 'items'
	});

	Item.associate = function(models) {
		// associations can be defined here
		Item.belongsTo(models.Category, {
			foreignKey: "category_id",
			as: "category",
		})
	};

	Item.getDS = async () => {
		try {
			return await Item.findAll({
				where:{
					status: true
				},
				attributes: ['id','category_id','name','price']
			});
		} catch (e) {
			return [];
		}
	};

	Item.getList = async (reqData) => {
		try {
			const { Category } 	= sequelize.models;
			const { pageNo } 	= reqData;

			const page = (checkDataIsValid(pageNo)) ? pageNo : 1;

			const itemResult = await Item.findAndCountAll({
				where:{
					status: true
				},
				distinct: true,
                order: [['category_id', 'ASC'],['name', 'ASC']],
                offset: (page-1)*perPageDisplay,
				limit: perPageDisplay,
				attributes: ['id','category_id','name','price'],
				include: [
                    { model : Category, as : 'category', attributes: ['name'] }
                ],
			});

			const totalPages = Math.ceil(itemResult.count / perPageDisplay);

			const pageData = {
                total_record : itemResult.count,
                per_page     : perPageDisplay,
                current_page : page,
                total_pages  : totalPages
			}

			return { items: itemResult.rows, pageData };

		} catch (e) {
			return [];
		}
	};

	Item.saveRecord = async (reqData) => {
		try {
			const result = await sequelize.transaction(async (t) => {
				const saveObj = {
					...reqData,
					createdAt: new Date(),
					updatedAt: new Date()
				};
				return await Item.create(saveObj, { transaction: t });
			});
			// return result from saved record
			return result;
		} catch (e) {
			return false;
		}
	};

	Item.getRecordById = async (id) => {
		try {
			const searchRecord = await Item.findByPk(id, {
				attributes: ['id','category_id','name','price','status']
			});
			if(!searchRecord || !searchRecord.status) return false;
			return searchRecord;
		} catch (e) {
			return false;
		}
	};

	Item.updateRecord = async (record, reqData) => {
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

	Item.deleteRecord = async (record) => {
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

	// Item.checkUsage = async (recordId) => {
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

	return Item;
};