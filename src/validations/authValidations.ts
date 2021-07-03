import Joi from "joi";

export const validateLoginData = (data: any) => Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
}).validate(data, { abortEarly: false });

export const validateSignupData = (data: any) => Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    password_confirmation: Joi.string().valid(Joi.ref("password")).required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    username: Joi.string().required(),
    phone: Joi.string().required()
}).validate(data, { abortEarly: false });