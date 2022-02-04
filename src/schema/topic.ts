import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} from "graphql";
import Word, { IWord } from "../models/Word";
import Topic from "../models/Topic";
import { WordType } from "./word";

export const TopicType: GraphQLObjectType = new GraphQLObjectType({
  name: "Topic",
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    words: {
      type: new GraphQLList(WordType),
      resolve(parent, args) {
        return Word.find({ topicId: parent.id });
      },
    },
  }),
});

export const TopicQuery = new GraphQLObjectType({
  name: "TopicQuery",
  fields: {
    topic: {
      type: TopicType,
      args: {
        id: { type: GraphQLID },
        userId: { type: GraphQLID },
      },
      resolve(_parent, { id }) {
        return Topic.findById(id).select("-userId");
      },
    },
    topics: {
      type: new GraphQLList(TopicType),
      args: { userId: { type: GraphQLID } },
      resolve(_parent, { userId }) {
        return Topic.find({ userId }).select("-userId");
      },
    },
  },
});

export const TopicMutation = new GraphQLObjectType({
  name: "TopicMutation",
  fields: {
    addTopic: {
      type: TopicType,
      args: {
        name: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      resolve(_parent, { name, userId }) {
        const newTopic = new Topic({ name, userId });
        return newTopic.save();
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
    updateTopic: {
      type: TopicType,
      args: {
        id: { type: GraphQLID },
        userId: { type: GraphQLID },
        name: { type: GraphQLString },
      },
      resolve(_parent, { id, name, userId }) {
        return Topic.findByIdAndUpdate(id, { name, userId }).select("-userId");
      },
    },
  },
});
