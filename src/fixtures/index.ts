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
import themesPro from './themes-pro.json';
import themesPerso from './themes-perso.json';
import themesVoluntary from './themes-voluntary.json';
import Theme from 'models/theme.model';

// activity
import activitiesPerso from './activities-perso.json';
import ActivitiesVoluntary from './activities-voluntary.json';
import Activity from 'models/activity.model';

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(null), ms);
  });

const dropped: string[] = [];

async function generateDocs(documents: any[], model: Model<any>, counter?: number) {
  try {
    if (!dropped.find((name) => name === model.collection.name)) {
      await model.collection.drop();
      dropped.push(model.collection.name);
    }
    await model.insertMany(documents);
  } catch (e) {
    if (!counter || counter < 5) {
      await delay(1000);
      await generateDocs(documents, model, counter ? counter + 1 : 1);
    } else {
      console.log(e);
      process.exit(1);
    }
  }
}

async function generate() {
  await connect();

  /*** fixtures ***/
  if (env === 'development') {
    await generateDocs(users, User);
  }
  await generateDocs(sectors, Sector);
  await generateDocs(tags, Tag);
  await generateDocs(themesPro, Theme);
  await generateDocs(themesPerso, Theme);
  await generateDocs(themesVoluntary, Theme);
  await generateDocs(activitiesPerso, Activity);
  await generateDocs(ActivitiesVoluntary, Activity);
  /*** fixtures ***/

  await connection.close();
  process.exit(0);
}

generate();
