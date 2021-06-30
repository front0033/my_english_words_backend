import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} from "graphql";
import Word from "../models/Word";
import WordType from "./word";

const TopicType: GraphQLObjectType = new GraphQLObjectType({
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

export default TopicType;
