import { models, connection, Document } from 'mongoose';

import users from './user';

// connect to database keep it as last import
import 'config/mongoose';

async function generateDocs(documents: Document[]) {
  await Promise.all(documents.map((d) => d.save()));
}

async function generate() {
  await Promise.all(Object.keys(models).map((key) => models[key].collection.drop()));

  /*** fixtures ***/
  await generateDocs(users);

  /*** fixtures ***/

  await connection.close();
  process.exit(0);
}

generate();
