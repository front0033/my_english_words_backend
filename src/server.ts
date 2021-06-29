import bodyParser from "body-parser";
import express from "express";
import { graphqlHTTP } from "express-graphql";

import connectDB from "../config/database";
import schema from "./schema/schema";

const app = express();

// Connect to MongoDB
connectDB();

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
