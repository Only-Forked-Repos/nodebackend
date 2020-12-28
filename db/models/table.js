'use strict';

import { checkDataIsValid, perPageDisplay } from '../../custom/secure';

export default (sequelize, DataTypes) => {
	const Table = sequelize.define('Table', {
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
		capacity: {
			type: DataTypes.STRING(20),
			allowNull: false
		},
		table_status: {
			type: DataTypes.ENUM,
			values: ['1', '2', '3'], // 1-available, 2-occupied, 3-merged
			defaultValue: '1'
		},
		current_order_data: {
            type: DataTypes.TEXT,
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
		tableName: 'tables'
	});

	Table.associate = function(models) {
		// associations can be defined here
	};

	// queries and other function starts
	Table.getCount = async (condStatus) => {
		try {
			return await Table.count({
                where: {
					status: true,
					table_status: condStatus
				}
            });
		} catch (e) {
			return 0;
		}
	};

	Table.getDS = async () => {
		try {
			return await Table.findAll({
				where:{
					status: true
				},
				attributes: ['id','name','capacity','table_status']
			});
		} catch (e) {
			return [];
		}
	};

	Table.getList = async (reqData) => {
		try {
			const { pageNo } 	= reqData;
			const page = (checkDataIsValid(pageNo)) ? pageNo : 1;

			const tableResult = await Table.findAndCountAll({
				where:{
					status: true
				},
				distinct: true,
                // order: [['name', 'ASC']],
                offset: (page-1)*perPageDisplay,
				limit: perPageDisplay,
				attributes: ['id','name','capacity','table_status']
			});

			const totalPages = Math.ceil(tableResult.count / perPageDisplay);

			const pageData = {
                total_record : tableResult.count,
                per_page     : perPageDisplay,
                current_page : page,
                total_pages  : totalPages
			}

			return { tables: tableResult.rows, pageData };
		} catch (e) {
			return [];
		}
	};

	Table.saveRecord = async (reqData) => {
		try {
			const result = await sequelize.transaction(async (t) => {
				const saveObj = {
					...reqData,
					createdAt: new Date(),
					updatedAt: new Date()
				};
				return await Table.create(saveObj, { transaction: t });
			});
			// return result from saved record
			return result;
		} catch (e) {
			return false;
		}
	};

	Table.getRecordById = async (id) => {
		try {
			const searchRecord = await Table.findByPk(id, {
				attributes: ['id','name','capacity','table_status','current_order_data','status']
			});
			if(!searchRecord || !searchRecord.status) return false;
			return searchRecord;
		} catch (e) {
			return false;
		}
	};

	Table.updateRecord = async (record, reqData) => {
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

	Table.deleteRecord = async (record) => {
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

	// Table.checkUsage = async (recordId) => {
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

	return Table;
};