'use strict';

import { numPad, checkDataIsValid, perPageDisplay } from '../../custom/secure'

export default (sequelize, DataTypes) => {
	const Invoice = sequelize.define('Invoice', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		table_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
		},
		invoice_no: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		invoice_date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		sub_total: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		discount_on_amt: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		discount_percent: {
			type: DataTypes.STRING(191),
			allowNull: true,
		},
		discount_amount: {
			type: DataTypes.STRING(191),
			allowNull: true,
		},
		taxable_amount: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		amount_to_pay: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		paid_amount: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		balance: {
			type: DataTypes.STRING(191),
			allowNull: true,
		},
		pay_mode: {
			type: DataTypes.STRING(191),
			allowNull: true,
		},
		note: {
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
		tableName: 'invoices'
	});

	Invoice.associate = function(models) {
		// associations can be defined here
		Invoice.hasMany(models.InvoiceItem, {
            foreignKey: "invoice_id",
            as: "invoiceitems",
		}),

		Invoice.hasMany(models.InvoiceTax, {
            foreignKey: "invoice_id",
            as: "invoicetaxes",
		}),

		Invoice.hasOne(models.InvoiceTax, {
            foreignKey: "invoice_id",
            as: "gsttax",
		}),

		Invoice.belongsTo(models.Table, {
			foreignKey: "table_id",
			as: "table",
		})
	};

	// queries and other function starts
	Invoice.getCount = async (cond) => {
		try {
			return await Invoice.count({
                where: cond
            });
		} catch (e) {
			return 0;
		}
	};

	Invoice.getList = async (reqData) => {
		try {
			const { pageNo } = reqData;
			const page = (checkDataIsValid(pageNo)) ? pageNo : 1;

			const { Table, InvoiceTax } = sequelize.models;
			const invoiceResult = await Invoice.findAndCountAll({
				where:{
					status: true
				},
				distinct: true,
                offset: (page-1)*perPageDisplay,
				limit: perPageDisplay,
				attributes: [
					'id','table_id','invoice_no','invoice_date','sub_total','discount_on_amt','discount_percent',
					'discount_amount','taxable_amount','amount_to_pay','paid_amount','balance','pay_mode','note'
				],
				order: [[ 'id', 'DESC' ]],
				include: [
					{ model: InvoiceTax, as: 'gsttax', attributes: ['tax_amount'] },
					{ model: Table, as: 'table', attributes: ['name'] }
				]
			});

			const totalPages = Math.ceil(invoiceResult.count / perPageDisplay);

			const pageData = {
                total_record : invoiceResult.count,
                per_page     : perPageDisplay,
                current_page : page,
                total_pages  : totalPages
			}

			return { invoices: invoiceResult.rows, pageData };
		} catch (e) {
			return [];
		}
	};

	Invoice.saveRecord = async (reqData) => {
		try {
			const { InvoiceItem, InvoiceTax } = sequelize.models;
			const result = await sequelize.transaction(async (t) => {
				const invoice_no = await Invoice.generateInvoiceNo();
				const saveObj = {
					...reqData,
					invoice_no,
					createdAt: new Date(),
					updatedAt: new Date()
				};
				return await Invoice.create(saveObj, {
					include: [
						{ model: InvoiceItem, as: 'invoiceitems'},
						{ model: InvoiceTax, as: 'invoicetaxes'}
					]
				}, { transaction: t });
			});
			// return result from saved record
			return result;
		} catch (e) {
			return false;
		}
	};

	Invoice.getRecordById = async (id) => {
		try {
			const { InvoiceItem, InvoiceTax, Table, Item } = sequelize.models;
			const searchRecord = await Invoice.findByPk(id, {
				attributes: [
					'id','table_id','invoice_no','invoice_date','sub_total','discount_on_amt','discount_percent',
					'discount_amount','taxable_amount','amount_to_pay','paid_amount','balance','pay_mode','note','status','createdAt'
				],
				include: [
					{
						model: InvoiceItem, as: 'invoiceitems',
						attributes: ['category_id','item_id','quantity','unit_price','amount'],
						include: [
							{
								model: Item, as: 'item',
								attributes: ['name']
							}
						]
					},
					{
						model: InvoiceTax, as: 'invoicetaxes',
						attributes: ['category_id','tax_amount','tax_amt_obj']
					},
					{
						model: Table, as: 'table',
						attributes: ['name','capacity']
					}
				]
			});
			if(!searchRecord || !searchRecord.status) return false;
			return searchRecord;
		} catch (e) {
			return false;
		}
	};

	Invoice.updateRecord = async (record, reqData) => {
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

	Invoice.deleteRecord = async (record) => {
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

	Invoice.generateInvoiceNo = async () => {
		try {
			let serialNo = '000001';
			const result = await Invoice.findOne({
				order: [ [ 'id', 'DESC' ]],
				attributes: [
					'id','invoice_no'
				]
			});
			if(result){
				const { invoice_no } = result;
				const invNo = Number(invoice_no) + 1;
				serialNo = numPad(invNo, serialNo.length);
			}
			return serialNo;
		} catch (e) {
			return false;
		}
	};

	// Invoice.checkUsage = async (recordId) => {
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

	return Invoice;
};