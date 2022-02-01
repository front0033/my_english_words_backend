import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
} from "graphql";

import User from "../models/User";
import Word, { IWord } from "../models/Word";
import Topic from "../models/Topic";
import WordType from "./word";
import TopicType from "./topic";
import { Error } from "mongoose";
import UserType from "./user";
import ProfileType from "./profile";

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(_parent, args) {
        return User.findById(args.id);
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: GraphQLID } },
      resolve(_parent, args) {
        return User.findById(args.id);
      },
    },
    words: {
      type: new GraphQLList(WordType),
      resolve(_parent, args) {
        return Word.find({});
      },
    },
    wordsByTopicId: {
      type: new GraphQLList(WordType),
      args: { topicId: { type: GraphQLID } },
      resolve(_parent, { topicId }) {
        return Word.find({ topicId });
      },
    },
    topic: {
      type: TopicType,
      args: { id: { type: GraphQLID } },
      resolve(_parent, args) {
        return Topic.findById(args.id);
      },
    },
    topics: {
      type: new GraphQLList(TopicType),
      resolve(_parent, args) {
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
      resolve(_parent, { word, translate, example, topicId }) {
        const newWord = new Word({ word, translate, example, topicId });
        return newWord.save();
      },
    },
    addTopic: {
      type: TopicType,
      args: {
        name: { type: GraphQLString },
      },
      resolve(_parent, { name }) {
        const newTopic = new Topic({ name });
        return newTopic.save();
      },
    },
    deleteWord: {
      type: WordType,
      args: { id: { type: GraphQLID } },
      resolve(_parent, { id }) {
        return Word.findByIdAndRemove(id);
      },
    },
    deleteTopic: {
      type: TopicType,
      args: { id: { type: GraphQLID } },
      resolve(_parent, { id }) {
        return Word.findOne({ topicId: id }, (_err: Error, word: IWord) => {
          if (!word) {
            return Topic.deleteOne({ _id: id });
          } else {
            throw new Error(
              `${word.word} - exist in current dictionary. Error delete topic.`
            );
          }
        });
      },
    },
    updateWord: {
      type: WordType,
      args: {
        id: { type: GraphQLID },
        word: { type: GraphQLString },
        translate: { type: GraphQLString },
        example: { type: GraphQLString },
        topicId: { type: GraphQLID },
      },
      resolve(_parent, { id, word, translate, example, topicId }) {
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
      resolve(_parent, { id, name }) {
        return Topic.findByIdAndUpdate(id, { name });
      },
    },
  },
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
