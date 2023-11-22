import { v4 as uuid } from 'uuid';

export const PINO_LOGGER_OPTIONS = {
  pinoHttp: {
    redact: ['req.headers', 'req.query', 'req.params', 'res.headers'],
    genReqId: () => uuid(),
  },
};
