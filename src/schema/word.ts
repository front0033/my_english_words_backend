import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} from "graphql";
import Word, { IWord } from "../models/Word";
import Topic from "../models/Topic";
import { TopicType } from "./topic";

export const WordType: GraphQLObjectType = new GraphQLObjectType({
  name: "WordType",
  fields: () => ({
    id: { type: GraphQLID },
    word: { type: new GraphQLNonNull(GraphQLString) },
    translate: { type: new GraphQLNonNull(GraphQLString) },
    example: { type: GraphQLString },
    topic: {
      type: TopicType,
      resolve(parent, args) {
        return Topic.findById(parent.topicId);
      },
    },
  }),
});

export const WordQuery = new GraphQLObjectType({
  name: "WordQuery",
  fields: {
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
  },
});

export const WordMutation = new GraphQLObjectType({
  name: "WordMutation",
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
    deleteWord: {
      type: WordType,
      args: { id: { type: GraphQLID } },
      resolve(_parent, { id }) {
        return Word.findByIdAndRemove(id);
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
  },
});
