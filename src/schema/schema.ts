import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} from "graphql";

import Word from "../models/Word";

const WordType = new GraphQLObjectType({
  name: "Word",
  fields: () => ({
    id: { type: GraphQLString },
    word: { type: GraphQLString },
    translate: { type: GraphQLString },
  }),
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    word: {
      type: WordType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Word.findById(args.id);
      },
    },
    words: {
      type: new GraphQLList(WordType),
      resolve(parent, args) {
        // return movies;
        return Word.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addWord: {
      type: WordType,
      args: {
        word: { type: GraphQLString },
        translate: { type: GraphQLString },
        example: { type: GraphQLString },
      },
      resolve(parent, { word, translate, example }) {
        const newWord = new Word({ word, translate, example });
        return newWord.save();
      },
    },
  },
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
