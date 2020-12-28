import Joi from '@hapi/joi';

export default (requestData) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.base': `category name should be a type of 'text'`,
            'string.empty': `category name cannot be an empty field`,
            'any.required': `category name is a required field`
        })
    });
    return schema.validate(requestData, {abortEarly: false});
}