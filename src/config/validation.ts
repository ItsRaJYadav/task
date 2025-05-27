import * as Joi from 'joi';

export const appValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),

  PORT: Joi.number().default(3000),

  // Database
  DB_TYPE: Joi.string().valid('mysql').required(),
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().port().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SSL: Joi.string().valid('true', 'false').default('false'),

  JWT_EXPIRES_IN: Joi.string().default('1d'),
});
