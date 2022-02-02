import { GraphQLSchema } from "graphql";
import { schemaComposer } from "graphql-compose";
import { UserMutation } from "./user";
import { WordQuery, WordMutation } from "./word";
import { TopicQuery, TopicMutation } from "./topic";
import { ProfileQuery, ProfileMutation } from "./profile";

const UserSchema = new GraphQLSchema({
  mutation: UserMutation,
});

const ProfileSchema = new GraphQLSchema({
  query: ProfileQuery,
  mutation: ProfileMutation,
});

const WorldSchema = new GraphQLSchema({
  query: WordQuery,
  mutation: WordMutation,
});

const TopicSchema = new GraphQLSchema({
  query: TopicQuery,
  mutation: TopicMutation,
});

schemaComposer.merge(UserSchema);
schemaComposer.merge(ProfileSchema);
schemaComposer.merge(WorldSchema);
schemaComposer.merge(TopicSchema);

const schema = schemaComposer.buildSchema();

export default schema;
