import express from "express";
const apiRouter = express.Router();

import authToken from '../middleware/authToken'; // Auth token Middleware

/* Routes for Login */
import loginControl from '../controllers/auth/LoginController';
apiRouter.route('/login').post(loginControl.getLogin);
// apiRouter.route('/logout').post(loginControl.getLogout);

/* Routes for Dashboard */
import dashControl from '../controllers/DashboardController';
apiRouter.route('/dashboard-count').get(/*authToken,*/ dashControl.getCounts);

/* Routes for Category */
import catControl from '../controllers/CategoryController';
apiRouter.route('/categories').get(authToken, catControl.getCategories);
apiRouter.route('/categories-ds').get(authToken, catControl.getCategoriesDS);
apiRouter.route('/category-add').post(authToken, catControl.addCategory);
apiRouter.route('/category-get/:id').get(authToken, catControl.getCategory);
apiRouter.route('/category-update/:id').put(authToken, catControl.updateCategory);
apiRouter.route('/category-delete/:id').delete(authToken, catControl.deleteCategory);

/* Routes for Item */
import itemControl from '../controllers/ItemController';
apiRouter.route('/items').get(authToken, itemControl.getItems);
apiRouter.route('/item-add').post(authToken, itemControl.addItem);
apiRouter.route('/item-get/:id').get(authToken, itemControl.getItem);
apiRouter.route('/item-update/:id').put(authToken, itemControl.updateItem);
apiRouter.route('/item-delete/:id').delete(authToken, itemControl.deleteItem);

/* Routes for Table */
import tableControl from '../controllers/TableController';
apiRouter.route('/tables').get(authToken, tableControl.getTables);
apiRouter.route('/tables-ds').get(authToken, tableControl.getTableDS);
apiRouter.route('/table-add').post(authToken, tableControl.addTable);
apiRouter.route('/table-get/:id').get(authToken, tableControl.getTable);
apiRouter.route('/table-update/:id').put(authToken, tableControl.updateTable);
apiRouter.route('/table-delete/:id').delete(authToken, tableControl.deleteTable);

/* Routes for Invoice */
import invoiceControl from '../controllers/InvoiceController';
apiRouter.route('/invoices').get(authToken, invoiceControl.getInvoices);
apiRouter.route('/invoices-ds').get(authToken, invoiceControl.getInvoiceDS);
apiRouter.route('/invoice-add').post(authToken, invoiceControl.addInvoice);
apiRouter.route('/invoice-get/:id').get(authToken, invoiceControl.getInvoice);
apiRouter.route('/invoice-update/:id').put(authToken, invoiceControl.updateInvoice);
apiRouter.route('/invoice-delete/:id').delete(authToken, invoiceControl.deleteInvoice);

export default apiRouter;