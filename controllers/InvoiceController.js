import sCode from "../custom/status-codes";
const { ok, created, bad_request, server_error } = sCode;

import {
    getValidationErrMsg,
    getIdNotFoundCommonMsg,
    getServerErrorMsg,
} from '../custom/error-msg';

// models import here
import model from '../db/models';
const { Invoice, Item, Category, Table } = model;

// validation import here
import validateInvoice from '../requests/invoiceRequest';

export default {
    async getInvoiceDS(req, res) {
        try {
            let items = [];
            let categories = [];
            let tables = [];
            items = await Item.getDS();
            categories = await Category.getDS();
            tables = await Table.getDS();
            res.status(ok).send({ items, categories, tables });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async getInvoices(req, res) {
        try {
            const result = await Invoice.getList(req.query);
            const { invoices, pageData } = result || {};
            res.status(ok).send({ invoices, pageData });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async addInvoice(req, res) {
        try {
            const { error } = validateInvoice(req.body);
            if (error) return res.status(bad_request).send({ error: getValidationErrMsg(error) });
            const invoice = await Invoice.saveRecord(req.body);
            if (!invoice) return  res.status(server_error).send({ message: getServerErrorMsg() });
            res.status(created).send({ invoice });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async getInvoice(req, res) {
        try {
            const { id } = req.params;
            const recordExist = await Invoice.getRecordById(id);
            if (!recordExist) return res.status(bad_request).send({ message: getIdNotFoundCommonMsg('invoice') });
            res.status(ok).send({ invoice: recordExist });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async updateInvoice(req, res) {
        try {
            const { error } = validateInvoice(req.body);
            if (error) return res.status(bad_request).send({ error: getValidationErrMsg(error) });

            const { id } = req.params;
            let recordExist = await Invoice.getRecordById(id);
            if (!recordExist) return res.status(bad_request).send({ message: getIdNotFoundCommonMsg('invoice') });

            const invoice = await Invoice.updateRecord( recordExist, req.body );
            if (!invoice) return  res.status(server_error).send({ message: getServerErrorMsg() });
            res.status(created).send({ invoice });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async deleteInvoice(req, res) {
        try {
            const { id } = req.params;
            let recordExist = await Invoice.getRecordById(id);
            if (!recordExist) return res.status(bad_request).send({ message: getIdNotFoundCommonMsg('invoice') });

            // const checkUsage = await Category.checkUsage(id);
            // if (checkUsage) return res.status(bad_request).send({ message: getIdAssignedMsg('category') });

            const invoice = await Invoice.deleteRecord( recordExist );
            if (!invoice) return  res.status(server_error).send({ message: getServerErrorMsg() });
            res.status(ok).send({ invoice });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    }
}