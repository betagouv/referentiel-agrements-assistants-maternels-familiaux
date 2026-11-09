import Joi from 'joi';
import Knex from 'knex';

const expected = Joi.object({
  databaseUrl: Joi.string().uri().required(),
}).options({ allowUnknown: false });

const actual = {
  // eslint-disable-next-line n/no-process-env,no-undef
  databaseUrl: process.env.DATABASE_URL,
};

const { error: validationError } = expected.validate(actual);

if (validationError) {
  const cause = `expecting ${validationError.message}, actual is ${validationError.details[0].context.value}`;
  const error = new Error('Database client configuration is invalid', { cause });
  throw error;
}

const configuration = {
  client: 'pg',
  connection: {
    connectionString: actual.databaseUrl,
  },
};

const knex = Knex(configuration);

export { knex };
