import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} from "graphql";
import HttpStatusCodes from "http-status-codes";
import User, { IUser } from "../models/User";
import Profile, { IProfile } from "../models/Profile";
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

export const ProfileQuery = new GraphQLObjectType({
  name: "ProfileQuery",
  fields: {
    getMe: {
      type: ProfileType,
      args: { userId: { type: GraphQLID } },
      resolve(_parent, { userId }) {
        return Profile.findOne({
          user: userId,
        }).populate("user", ["avatar", "email"]);
      },
    },
    getProfiles: {
      type: new GraphQLList(ProfileType),
      resolve(_parent, args) {
        return Profile.find({});
      },
    },
  },
});

export const ProfileMutation = new GraphQLObjectType({
  name: "ProfileMutation",
  fields: {
    // Firstly, you have to create NEW user, then create new Profile !!!
    createProfile: {
      type: ProfileType,
      args: {
        userId: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        username: { type: GraphQLString },
      },
      async resolve(_parent, { userId, firstName, lastName, username }) {
        // Build profile object based on IProfile
        const profileFields = {
          user: userId,
          firstName,
          lastName,
          username,
        };

        try {
          let user: IUser = await User.findOne({ _id: userId });

          if (!user) {
            throw new Error(
              `${HttpStatusCodes.BAD_REQUEST} - User not registered.`
            );
          }

          let profile: IProfile = await Profile.findOne({ user: userId });
          if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
              { user: userId },
              { $set: profileFields },
              { new: true }
            );

            return profile;
          }

          // Create
          profile = new Profile(profileFields);

          return profile.save();
        } catch (err) {
          console.error(err.message);
          throw new Error(
            `${HttpStatusCodes.INTERNAL_SERVER_ERROR} - Server Error.`
          );
        }
      },
    },
    deleteProfile: {
      type: ProfileType,
      args: { userId: { type: GraphQLID } },
      async resolve(_parent, { userId }) {
        try {
          // Remove profile
          await Profile.findOneAndRemove({ user: userId });
          // Remove user
          await User.findOneAndRemove({ _id: userId });

          return { msg: "User removed" };
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

export default ProfileType;
