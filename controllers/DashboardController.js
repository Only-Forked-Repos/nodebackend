import sCode from "../custom/status-codes";
const { ok, server_error } = sCode;

import moment from 'moment';

import Sequelize from 'sequelize';
const Op = Sequelize.Op;

// models import here
import model from '../db/models';
const { Invoice, InvoiceTax, Table } = model;

export default {
    async getCounts(req, res) {
        try {
            const startOfMonth = moment().startOf('month').toDate();
	        const endOfMonth   = moment().endOf('month').toDate();

            // Invoice condition start
            const monthlyInvCond = {
                invoice_date: {
                    [Op.gte]: startOfMonth,
                    [Op.lt]: endOfMonth
                },
                status: true
            };

            const todayInvCon = {
                invoice_date: {
                    [Op.eq]: moment()
                },
                status: true
            };
            // Invoice condition end

            // Invoice Count Start
            const monthlyInv = await Invoice.getCount(monthlyInvCond);
            const todayInv = await Invoice.getCount(todayInvCon);
            const invoiceCount = {
                monthly: monthlyInv, today: todayInv
            };
            // Invoice Count End

            // Invoice Collected Amount Start
            const monthlyColAmt = await Invoice.sum('amount_to_pay', { where: monthlyInvCond });
            const todayColAmt = await Invoice.sum('amount_to_pay', { where: todayInvCon });
            const collectAmtCount = {
                monthly: monthlyColAmt, today: todayColAmt
            };
            // Invoice Collected Amount End

            // Invoice tax Condition start
            const monthlyTaxCond = {
                createdAt: {
                    [Op.gte]: startOfMonth,
                    [Op.lt]: endOfMonth
                },
                status: true
            };
            const todayTaxCon = {
                createdAt: {
                    [Op.eq]: moment()
                },
                status: true
            };
            // Invoice tax Condition end

            // Invoice Tax Amount Start
            const monthlyTaxAmt = await InvoiceTax.sum('tax_amount', { where: monthlyTaxCond });

            const todayTaxAmt = await InvoiceTax.sum('tax_amount', { where: todayTaxCon });

            const taxAmtCount = {
                monthly: monthlyTaxAmt, today: todayTaxAmt
            };
            // Invoice Tax Amount End

            // Table start
            const available = await Table.getCount(1); // available
            const occupied = await Table.getCount(2); // occupied
            // Table end

            const tableCount = {
                available, occupied
            };

            res.status(ok).send({ invoiceCount, collectAmtCount, taxAmtCount, tableCount });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },
}