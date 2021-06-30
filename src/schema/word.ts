import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import Topic from "../models/Topic";
import TopicType from "./topic";

const WordType: GraphQLObjectType = new GraphQLObjectType({
  name: "Word",
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

export default WordType;
