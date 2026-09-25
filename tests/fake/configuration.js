import Joi from 'joi';

// https://12factor.net/config

const schema = Joi.object({
  apiListeningPort: Joi.number().integer().min(1).max(65535).required(),
  database: {
    url: Joi.string().uri().required(),
  },
}).options({ allowUnknown: false });

/*eslint-disable no-undef,n/no-process-env*/
const configuration = {
  apiListeningPort: process.env.FAKE_RNIPP_API_LISTENING_PORT,
  database: {
    url: process.env.DATABASE_URL,
  },
};
/*eslint-enable no-undef,n/no-process-env*/

const { error } = schema.validate(configuration);
if (error) {
  throw new Error('Configuration is invalid: ' + error.message + ', but was: ' + error.details[0].context.value);
}

export { configuration };
