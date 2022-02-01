import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql";
import User from "../models/User";
import UserType from "./user";

const ProfileType: GraphQLObjectType = new GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export default ProfileType;
