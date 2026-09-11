import Joi from 'joi';

const schema = Joi.object({
  apiListeningPort: Joi.number().integer().min(1).max(65535).required(),
}).options({ allowUnknown: false });

/*eslint-disable no-undef,n/no-process-env*/
const configuration = {
  apiListeningPort: process.env.PORT || 3000,
};
/*eslint-enable no-undef,n/no-process-env*/

const { error } = schema.validate(configuration);
if (error) {
  throw new Error('Configuration is invalid: ' + error.message + ', but was: ' + error.details[0].context.value);
}

export { configuration };
