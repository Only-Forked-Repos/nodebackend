import Joi from '@hapi/joi';

export default (requestData) => {
    const schema = Joi.object({
        category_id: Joi.number().min(1).required().messages({
            'number.base' : `category_id should be a type of 'number'`,
            'number.empty': `category_id cannot be an empty field`,
            'number.min'  : `category_id length must be at least 1 characters`,
            'any.required': `category_id is a required field`
        }),
        name: Joi.string().required().messages({
            'string.base': `item name should be a type of 'text'`,
            'string.empty': `item name cannot be an empty field`,
            'any.required': `item name is a required field`
        }),
        price: Joi.string().required().messages({
            'string.base': `item price should be a type of 'text'`,
            'string.empty': `item price cannot be an empty field`,
            'any.required': `item price is a required field`
        })
    });
    return schema.validate(requestData, {abortEarly: false});
}