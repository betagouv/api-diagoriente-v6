import { connection, Model } from 'mongoose';
import connect from 'config/mongoose';
import { env } from 'config/vars';

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

// activity
import activities from './activities.json';
import Activity from 'models/activity.model';

async function generateDocs(documents: any[], Model: Model<any>) {
  await Model.collection.drop();
  await Model.insertMany(documents);
}

async function generate() {
  await connect();

  /*** fixtures ***/
  if (env === 'development') {
    await generateDocs(users, User);
    await generateDocs(activities, Activity);
  }
  await generateDocs(sectors, Sector);
  await generateDocs(tags, Tag);
  await generateDocs(themes, Theme);
  /*** fixtures ***/

  await connection.close();
  process.exit(0);
}

generate();
