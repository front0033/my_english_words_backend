import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} from "graphql";

import Word from "../models/Word";
import Topic from "../models/Topic";

const WordType = new GraphQLObjectType({
  name: "Word",
  fields: () => ({
    id: { type: GraphQLID },
    word: { type: new GraphQLNonNull(GraphQLString) },
    translate: { type: new GraphQLNonNull(GraphQLString) },
    example: { type: GraphQLString },
    topic: { type: GraphQLString },
  }),
});

const TopicType = new GraphQLObjectType({
  name: "Topic",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
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
    topic: {
      type: TopicType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Topic.findById(args.id);
      },
    },
    topics: {
      type: new GraphQLList(TopicType),
      resolve(parent, args) {
        // return movies;
        return Topic.find({});
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
        topic: { type: GraphQLString },
      },
      resolve(parent, { word, translate, example, topic }) {
        const newWord = new Word({ word, translate, example, topic });
        return newWord.save();
      },
    },
    addTopic: {
      type: TopicType,
      args: {
        name: { type: GraphQLString },
      },
      resolve(parent, { name }) {
        const newTopic = new Topic({ name });
        return newTopic.save();
      },
    },
  },
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
