import Joi from '@hapi/joi';

export default (requestData) => {
    const schema = Joi.object({
        table_id: Joi.number().min(1).required().messages({
            'number.base' : `table_id should be a type of 'number'`,
            'number.empty': `table_id cannot be an empty field`,
            'number.min'  : `table_id length must be at least 1 characters`,
            'any.required': `table_id is a required field`
        }),
        invoice_date: Joi.string().required().messages({
            'string.base': `invoice date should be a type of 'text'`,
            'string.empty': `invoice date cannot be an empty field`,
            'any.required': `invoice date is a required field`
        }),
        sub_total: Joi.required().messages({
            'any.required': `sub total is a required field`
        }),
        discount_on_amt: Joi.required().messages({
            'any.required': `discount on amount is a required field`
        }),
        discount_percent: Joi.number().allow('').messages({
            'string.base': `discount percent should be a type of 'text'`,
        }),
        discount_amount: Joi.string().allow('').messages({
            'string.base': `basic amount should be a type of 'text'`,
        }),
        taxable_amount: Joi.required().messages({
            'any.required': `taxable amount is a required field`
        }),
        amount_to_pay: Joi.required().messages({
            'any.required': `amount to pay is a required field`
        }),
        paid_amount: Joi.string().required().messages({
            'string.base': `paid amount should be a type of 'text'`,
            'string.empty': `paid amount cannot be an empty field`,
            'any.required': `paid amount is a required field`
        }),
        balance: Joi.number().allow('').messages({
            'number.base': `balance amount should be a type of 'number'`,
        }),
        pay_mode: Joi.string().allow('').messages({
            'string.base': `payment mode should be a type of 'text'`,
        }),
        note: Joi.string().allow('').messages({
            'string.base': `note should be a type of 'text'`,
        }),
        // For Invoice items validation
        invoiceitems: Joi.array().min(1).required().items(
            Joi.object({
                category_id: Joi.string().required().messages({
                    'string.base' : `category should be a type of 'text'`,
                    'string.empty': `category cannot be an empty`,
                    'any.required': `category is a required`
                }),
                item_id: Joi.number().required().messages({
                    'number.base' : `item_id should be a type of 'text'`,
                    'number.empty': `item_id cannot be an empty`,
                    'any.required': `item_id is a required`
                }),
                quantity: Joi.number().required().messages({
                    'number.base' : `quantity should be a type of 'text'`,
                    'number.empty': `quantity cannot be an empty`,
                    'any.required': `quantity is a required`
                }),
                unit_price: Joi.string().required().messages({
                    'string.base' : `price should be a type of 'text'`,
                    'string.empty': `price cannot be an empty`,
                    'any.required': `price is a required`
                }),
                amount: Joi.number().required().messages({
                    'number.base' : `amount should be a type of 'text'`,
                    'number.empty': `amount cannot be an empty`,
                    'any.required': `amount is a required`
                })
            })
        ),
        // For Invoice taxes validation
        invoicetaxes: Joi.array().min(1).required().items(
            Joi.object({
                category_id: Joi.number().required().messages({
                    'number.base' : `category should be a type of 'text'`,
                    'number.empty': `category cannot be an empty`,
                    'any.required': `category is a required`
                }),
                taxable_amount: Joi.number().required().messages({
                    'number.base' : `taxable_amount should be a type of 'text'`,
                    'number.empty': `taxable_amount cannot be an empty`,
                    'any.required': `taxable_amount is a required`
                }),
                tax_percent: Joi.number().required().messages({
                    'number.base' : `tax_percent should be a type of 'text'`,
                    'number.empty': `tax_percent cannot be an empty`,
                    'any.required': `tax_percent is a required`
                }),
                tax_amt_obj: Joi.string().allow('').messages({
                    'string.base' : `tax amount obj should be a type of 'text'`
                }),
                tax_amount: Joi.string().required().messages({
                    'string.base' : `tax amount should be a type of 'text'`,
                    'string.empty': `tax amount cannot be an empty`,
                    'any.required': `tax amount is a required`
                })
            })
        ),
    });
    return schema.validate(requestData, {abortEarly: false});
}