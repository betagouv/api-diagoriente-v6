import { connection, Model } from 'mongoose';
import connect from 'config/mongoose';
import bcrypt from 'bcryptjs';
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
import ActivitiesPro from './activities-pro.json';
import Activity from 'models/activity.model';

// reference
import references from './references.json';
import Reference from 'models/reference.model';

// competence
import competences from './competences.json';
import Competence from 'models/competence.model';

// question
import questions from './questions.json';
import Question from 'models/question.model';

// option
import options from './options.json';
import Option from 'models/option.model';

// interest
import interests from './interests.json';
import Interest from 'models/interest.model';

// cursors
import cursors from './cursors.json';
import Cursor from 'models/cursor.model';

// level
import levels from './levels.json';
import Level from 'models/level.model';

function addThemeLevel(theme: any, i: number) {
  const level = (i % 5) + 2;
  return { level, ...theme };
}

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
    if (e.message === 'ns not found') {
      dropped.push(model.collection.name);
    }
    if (!counter || counter < 5) {
      await delay(1000);
      await generateDocs(documents, model, counter ? counter + 1 : 1);
    } else {
      console.log(e.message);
      process.exit(1);
    }
  }
}

async function generate() {
  await connect();

  /*** fixtures ***/
  if (env === 'development') {
    await generateDocs(
      users.map((user) => ({ ...user, password: bcrypt.hashSync(user.password) })),
      User,
    );
  }
  await generateDocs(sectors, Sector);
  await generateDocs(tags, Tag);
  await generateDocs(themesPro, Theme);
  await generateDocs(themesPerso.map(addThemeLevel), Theme);
  await generateDocs(themesVoluntary.map(addThemeLevel), Theme);
  await generateDocs(activitiesPerso, Activity);
  await generateDocs(ActivitiesVoluntary, Activity);
  await generateDocs(ActivitiesPro, Activity);
  await generateDocs(references, Reference);
  await generateDocs(competences, Competence);
  await generateDocs(questions, Question);
  await generateDocs(options, Option);
  await generateDocs(interests, Interest);
  await generateDocs(cursors, Cursor);
  await generateDocs(levels, Level);
  /*** fixtures ***/

  await connection.close();
  process.exit(0);
}

generate();
