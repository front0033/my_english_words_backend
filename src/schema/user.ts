import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";
import gravatar from "gravatar";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "config";

import User, { IUser } from "../models/User";

const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const UserMutation = new GraphQLObjectType({
  name: "UserMutation",
  fields: {
    // Register NEW user given their email and password, returns the token upon successful registration
    createUser: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(_parent, { email, password }) {
        const newTopic = new User({ name });

        try {
          let user: IUser = await User.findOne({ email });

          if (user) {
            throw new Error(
              `${HttpStatusCodes.BAD_REQUEST} - User already exists.`
            );
          }

          const options: gravatar.Options = {
            s: "200",
            r: "pg",
            d: "mm",
          };

          const avatar = gravatar.url(email, options);

          const salt = await bcrypt.genSalt(10);
          const hashed = await bcrypt.hash(password, salt);

          // Build user object based on IUser
          const userFields = {
            email,
            password: hashed,
            avatar,
          };

          user = new User(userFields);

          await user.save();

          const payload = {
            userId: user.id,
          };

          jwt.sign(
            payload,
            config.get("jwtSecret"),
            { expiresIn: config.get("jwtExpiration") },
            (err) => {
              if (err) throw err;
            }
          );
        } catch (err) {
          console.error(err.message);
          throw new Error(
            `${HttpStatusCodes.INTERNAL_SERVER_ERROR} - Server Error.`
          );
        }
      },
    },
  },
});

export default UserType;
