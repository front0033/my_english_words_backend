import { Document, Model, model, Schema } from "mongoose";

/**
 * Interface to model the User Schema for TypeScript.
 * @param name:string
 */
export interface ITopic extends Document {
  name: string;
  userId: string;
}

const topicSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Topic: Model<ITopic> = model("Topic", topicSchema);

export default Topic;
