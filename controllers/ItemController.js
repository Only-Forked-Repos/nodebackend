import sCode from "../custom/status-codes";
const { ok, created, bad_request, server_error } = sCode;

import {
    getValidationErrMsg,
    getIdNotFoundCommonMsg,
    getServerErrorMsg,
} from '../custom/error-msg';

// models import here
import model from '../db/models';
const { Item, Category } = model;

// validation import here
import validateItem from '../requests/itemRequest';

export default {
    async getItems(req, res) {
        try {
            const result = await Item.getList(req.query);
            const { items, pageData } = result || {};
            res.status(ok).send({ items, pageData });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async addItem(req, res) {
        try {
            const { error } = validateItem(req.body);
            if (error) return res.status(bad_request).send({ error: getValidationErrMsg(error) });
            const item = await Item.saveRecord(req.body);
            if (!item) return  res.status(server_error).send({ message: getServerErrorMsg() });
            res.status(created).send({ item });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async getItem(req, res) {
        try {
            const { id } = req.params;
            const recordExist = await Item.getRecordById(id);
            if (!recordExist) return res.status(bad_request).send({ message: getIdNotFoundCommonMsg('item') });
            const categories = await Category.getDS();
            res.status(ok).send({ item: recordExist, categories });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async updateItem(req, res) {
        try {
            const { error } = validateItem(req.body);
            if (error) return res.status(bad_request).send({ error: getValidationErrMsg(error) });

            const { id } = req.params;
            let recordExist = await Item.getRecordById(id);
            if (!recordExist) return res.status(bad_request).send({ message: getIdNotFoundCommonMsg('item') });

            const item = await Item.updateRecord( recordExist, req.body );
            if (!item) return  res.status(server_error).send({ message: getServerErrorMsg() });
            res.status(created).send({ item });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async deleteItem(req, res) {
        try {
            const { id } = req.params;
            let recordExist = await Item.getRecordById(id);
            if (!recordExist) return res.status(bad_request).send({ message: getIdNotFoundCommonMsg('item') });

            // const checkUsage = await Category.checkUsage(id);
            // if (checkUsage) return res.status(bad_request).send({ message: getIdAssignedMsg('category') });

            const item = await Item.deleteRecord( recordExist );
            if (!item) return  res.status(server_error).send({ message: getServerErrorMsg() });
            res.status(ok).send({ item });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    }
}