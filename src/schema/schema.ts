import { GraphQLSchema } from "graphql";
import { schemaComposer } from "graphql-compose";
import { WordQuery, WordMutation } from "./word";
import { TopicQuery, TopicMutation } from "./topic";

const WorldSchema = new GraphQLSchema({
  query: WordQuery,
  mutation: WordMutation,
});

const TopicSchema = new GraphQLSchema({
  query: TopicQuery,
  mutation: TopicMutation,
});

schemaComposer.merge(WorldSchema);

schemaComposer.merge(TopicSchema);

const schema = schemaComposer.buildSchema();

export default schema;
