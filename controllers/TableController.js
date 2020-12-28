import sCode from "../custom/status-codes";
const { ok, created, bad_request, server_error } = sCode;

import {
    getValidationErrMsg,
    getIdNotFoundCommonMsg,
    getServerErrorMsg,
} from '../custom/error-msg';

// models import here
import model from '../db/models';
const { Table } = model;

// validation import here
import validateTable from '../requests/tableRequest';

export default {
    async getTableDS(req, res) {
        try {
            let tables = [];
            tables = await Table.getDS();
            res.status(ok).send({ tables });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async getTables(req, res) {
        try {
            const result = await Table.getList(req.query);
            const { tables, pageData } = result || {};
            res.status(ok).send({ tables, pageData });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async addTable(req, res) {
        try {
            const { error } = validateTable(req.body);
            if (error) return res.status(bad_request).send({ error: getValidationErrMsg(error) });
            const table = await Table.saveRecord(req.body);
            if (!table) return  res.status(server_error).send({ message: getServerErrorMsg() });
            res.status(created).send({ table });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async getTable(req, res) {
        try {
            const { id } = req.params;
            const recordExist = await Table.getRecordById(id);
            if (!recordExist) return res.status(bad_request).send({ message: getIdNotFoundCommonMsg('table') });
            res.status(ok).send({ table: recordExist });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async updateTable(req, res) {
        try {
            const { error } = validateTable(req.body);
            if (error) return res.status(bad_request).send({ error: getValidationErrMsg(error) });

            const { id } = req.params;
            let recordExist = await Table.getRecordById(id);
            if (!recordExist) return res.status(bad_request).send({ message: getIdNotFoundCommonMsg('table') });

            const table = await Table.updateRecord( recordExist, req.body );
            if (!table) return  res.status(server_error).send({ message: getServerErrorMsg() });
            res.status(created).send({ table });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async deleteTable(req, res) {
        try {
            const { id } = req.params;
            let recordExist = await Table.getRecordById(id);
            if (!recordExist) return res.status(bad_request).send({ message: getIdNotFoundCommonMsg('table') });

            // const checkUsage = await Category.checkUsage(id);
            // if (checkUsage) return res.status(bad_request).send({ message: getIdAssignedMsg('category') });

            const table = await Table.deleteRecord( recordExist );
            if (!table) return  res.status(server_error).send({ message: getServerErrorMsg() });
            res.status(ok).send({ table });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    }
}