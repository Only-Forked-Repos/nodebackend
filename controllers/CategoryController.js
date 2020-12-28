import sCode from "../custom/status-codes";
const { ok, created, bad_request, server_error } = sCode;

import {
    getValidationErrMsg,
    getIdNotFoundCommonMsg,
    getServerErrorMsg,
} from '../custom/error-msg';

// models import here
import model from '../db/models';
const { Category } = model;

// validation import here
import validateCategory from '../requests/categoryRequest';

export default {
    async getCategories(req, res) {
        try {
            const result = await Category.getList(req.query);
            const { categories, pageData } = result || {};
            res.status(ok).send({ categories, pageData });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async getCategoriesDS(req, res) {
        try {
            let categories = [];
            categories = await Category.getDS();
            res.status(ok).send({ categories });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async addCategory(req, res) {
        try {
            const { error } = validateCategory(req.body);
            if (error) return res.status(bad_request).send({ error: getValidationErrMsg(error) });
            const category = await Category.saveRecord(req.body);
            if (!category) return  res.status(server_error).send({ message: getServerErrorMsg() });
            res.status(created).send({ category });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async getCategory(req, res) {
        try {
            const { id } = req.params;
            const recordExist = await Category.getRecordById(id);
            if (!recordExist) return res.status(bad_request).send({ message: getIdNotFoundCommonMsg('category') });
            res.status(ok).send({ category: recordExist });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async updateCategory(req, res) {
        try {
            const { error } = validateCategory(req.body);
            if (error) return res.status(bad_request).send({ error: getValidationErrMsg(error) });

            const { id } = req.params;
            let recordExist = await Category.getRecordById(id);
            if (!recordExist) return res.status(bad_request).send({ message: getIdNotFoundCommonMsg('category') });

            const category = await Category.updateRecord( recordExist, req.body );
            if (!category) return  res.status(server_error).send({ message: getServerErrorMsg() });
            res.status(created).send({ category });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    },

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            let recordExist = await Category.getRecordById(id);
            if (!recordExist) return res.status(bad_request).send({ message: getIdNotFoundCommonMsg('category') });

            // const checkUsage = await Category.checkUsage(id);
            // if (checkUsage) return res.status(bad_request).send({ message: getIdAssignedMsg('category') });

            const category = await Category.deleteRecord( recordExist );
            if (!category) return  res.status(server_error).send({ message: getServerErrorMsg() });
            res.status(ok).send({ category });
        } catch (e) {
            console.log(e);
            res.status(server_error).send(e);
        }
    }

}