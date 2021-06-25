import { models, connection, Model } from 'mongoose';
import connect from 'config/mongoose';

// user
import users from './users.json';
import User from 'models/user.model';

// sector
import sectors from './sectors.json';
import Sector from 'models/sector.model';

// tag
import tags from './tags.json';
import Tag from 'models/tag.model';

// theme
import themes from './themes.json';
import Theme from 'models/theme.model';

async function generateDocs(documents: any[], Model: Model<any>) {
  return Model.insertMany(documents);
}

async function generate() {
  await connect();

  await Promise.all(Object.keys(models).map((key) => models[key].collection.drop()));

  /*** fixtures ***/
  await generateDocs(users, User);
  await generateDocs(sectors, Sector);
  await generateDocs(tags, Tag);
  await generateDocs(themes, Theme);
  /*** fixtures ***/

  await connection.close();
  process.exit(0);
}

generate();
