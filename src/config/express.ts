import express from 'express';
import path from 'path';
import passport from 'passport';
import { graphqlHTTP } from 'express-graphql';
import depthLimit from 'graphql-depth-limit';
import noIntrospection from 'graphql-disable-introspection';
import { graphqlUploadExpress } from 'graphql-upload';
import compress from 'compression';
import RateLimit from 'express-rate-limit';
import costAnalysis from 'graphql-cost-analysis';
import cors from 'cors';
import authorization from 'middlewares/auth';

import schema from './graphql';
import strategies from './passport';
import { clientUrl, env } from './vars';

const apiLimiter = RateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  skipSuccessfulRequests: true,
});

const app = express();

app.use(apiLimiter);

app.use(compress());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

passport.use('jwt', strategies.jwt);

app.use(authorization);

const whitelist = [clientUrl];
const corsOptions =
  env !== 'production'
    ? {}
    : {
        origin: (origin: any, callback: (err: Error | null, success: boolean) => void) => {
          if (origin === undefined || whitelist.indexOf(origin) !== -1) {
            return callback(null, true);
          } else {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
          }
        },
      };

app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

const validationRules = [depthLimit(8), costAnalysis({ maximumCost: 1000 })];

if (env === 'production') {
  validationRules.unshift(noIntrospection);
}

app.use(
  '/graphql',
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP({
    schema: schema,
    graphiql: env !== 'production',
  }),
);

export default app;
