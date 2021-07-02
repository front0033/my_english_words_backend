import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
} from "graphql";

import Word from "../models/Word";
import Topic from "../models/Topic";
import WordType from "./word";
import TopicType from "./topic";

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    word: {
      type: WordType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Word.findById(args.id);
      },
    },
    words: {
      type: new GraphQLList(WordType),
      resolve(parent, args) {
        return Word.find({});
      },
    },
    wordsByTopicId: {
      type: new GraphQLList(WordType),
      args: { topicId: { type: GraphQLID } },
      resolve(parent, { topicId }) {
        return Word.find({ topicId });
      },
    },
    topic: {
      type: TopicType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Topic.findById(args.id);
      },
    },
    topics: {
      type: new GraphQLList(TopicType),
      resolve(parent, args) {
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
        topicId: { type: GraphQLID },
      },
      resolve(parent, { word, translate, example, topicId }) {
        const newWord = new Word({ word, translate, example, topicId });
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
    deleteWord: {
      type: WordType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Word.findByIdAndRemove(id);
      },
    },
    deleteTopic: {
      type: TopicType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return Topic.findByIdAndRemove(id);
      },
    },
    updateWord: {
      type: WordType,
      args: {
        id: { type: GraphQLID },
        word: { type: GraphQLString },
        translate: { type: GraphQLString },
        example: { type: GraphQLString },
        topicId: { type: GraphQLString },
      },
      resolve(parent, { id, word, translate, example, topicId }) {
        return Word.findByIdAndUpdate(id, {
          word,
          translate,
          example,
          topicId,
        });
      },
    },
    updateTopic: {
      type: TopicType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
      },
      resolve(parent, { id, name }) {
        return Topic.findByIdAndUpdate(id, { name });
      },
    },
  },
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
