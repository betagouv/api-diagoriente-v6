import { models, connection, Model } from 'mongoose';
import connect from 'config/mongoose';

import users from './users.json';
import User from 'models/user.model';

async function generateDocs(documents: any[], Model: Model<any>) {
  await Promise.all(
    documents.map((d) => {
      const doc = new Model(d);
      return doc.save();
    }),
  );
}

async function generate() {
  await connect();

  await Promise.all(Object.keys(models).map((key) => models[key].collection.drop()));

  /*** fixtures ***/
  await generateDocs(users, User);
  /*** fixtures ***/

  await connection.close();
  process.exit(0);
}

generate();
