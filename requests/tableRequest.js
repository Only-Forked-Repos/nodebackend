import Joi from '@hapi/joi';

export default (requestData) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.base': `table name should be a type of 'text'`,
            'string.empty': `table name cannot be an empty field`,
            'any.required': `table name is a required field`
        }),
        capacity: Joi.string().required().messages({
            'string.base': `table capacity should be a type of 'text'`,
            'string.empty': `table capacity cannot be an empty field`,
            'any.required': `table capacity is a required field`
        })
    });
    return schema.validate(requestData, {abortEarly: false});
}