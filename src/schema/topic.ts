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

export const TopicMutation = new GraphQLObjectType({
  name: "TopicMutation",
  fields: {
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
        name: { type: GraphQLString },
      },
      resolve(_parent, { id, name }) {
        return Topic.findByIdAndUpdate(id, { name });
      },
    },
  },
});
