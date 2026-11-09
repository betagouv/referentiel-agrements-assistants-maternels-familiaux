import Joi from 'joi';

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
  migrations: {
    directory: './migrations/',
    tableName: 'knex_migrations',
  },
  connection: {
    connectionString: actual.databaseUrl,
  },
};

export default configuration;
