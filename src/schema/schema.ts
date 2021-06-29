import { GraphQLObjectType, GraphQLString, GraphQLSchema } from "graphql";

const words = [
  {
    id: "1",
    word: "permanent job",
    translate: "постоянная работа",
  },
  {
    id: "2",
    word: "shallow",
    translate: "мелкий",
  },
  {
    id: "3",
    word: "narrow",
    translate: "узкий",
  },
  {
    id: "4",
    word: "cowardly",
    translate: "трусливый",
  },
  {
    id: "5",
    word: "messy",
    translate: "беспорядочный",
  },
  {
    id: "6",
    word: "clumsy",
    translate: "неуклюжий",
  },
  {
    id: "7",
    word: "the key thing",
    translate: "ключевая вещь",
  },
  {
    id: "8",
    word: "anticipation",
    translate: "предвкушение, ожидание",
  },
];

const MovieType = new GraphQLObjectType({
  name: "Words",
  fields: () => ({
    id: { type: GraphQLString },
    word: { type: GraphQLString },
    translate: { type: GraphQLString },
  }),
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return words.find((word) => word.id == args.id);
      },
    },
  },
});

export default new GraphQLSchema({
  query: Query,
});
