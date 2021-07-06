import { GraphQLID, GraphQLList, GraphQLString } from 'graphql';
import list from 'crud/list';
import get from 'crud/get';

import { Role } from 'models/user.model';
import Question from 'models/question.model';
import Option from 'models/option.model';

import { QuestionType } from 'types/question.type';

import { reg } from 'utils/regs';

export default {
  questions: list(Question, QuestionType, {
    authorizationRoles: [Role.USER, Role.ADMIN],
    args: { search: { type: GraphQLString }, parent: { type: GraphQLID }, path: { type: new GraphQLList(GraphQLID) } },
    pre: async (args) => {
      const { search, path, ...rest } = args;
      const searchReg = reg(search);
      let ids = [];
      if (Array.isArray(path)) {
        if (path.length === 0) {
          return { title: searchReg, parent: { $exists: false }, ...rest };
        }
        const relatedOptions = await Option.find({ _id: { $in: path } });
        const index = relatedOptions.findIndex((o) => o.user);

        if (index !== -1) {
          const relatedPlaceholder = await Option.findOne({
            title: '___plus___',
            'parent.path': path.slice(0, index),
            user: { $exists: false },
          });
          if (relatedPlaceholder) {
            path[index] = relatedPlaceholder.id.toString();
            relatedOptions[index] = relatedPlaceholder;
          }
        }
        ids = relatedOptions.map((option) => option.question.toString());

        const nextQuestion = await Option.findOne({ 'parent.path': path });
        if (nextQuestion) {
          ids.push(nextQuestion.question.toString());
        }

        return { title: searchReg, _id: { $in: ids }, ...rest };
      }

      return { title: searchReg, ...rest };
    },
  }),
  question: get(Question, QuestionType, { authorizationRoles: [Role.ADMIN] }),
};
