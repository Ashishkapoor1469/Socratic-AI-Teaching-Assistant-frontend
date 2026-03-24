import * as Joi from "joi"

export const EnvConfig = Joi.object({
    DATABASE_URL :Joi.string().required(),
    JWT_SECRET : Joi.string().required()
})