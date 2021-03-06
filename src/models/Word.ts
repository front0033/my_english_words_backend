import { Document, Model, model, Schema } from "mongoose";

/**
 * Interface to model the User Schema for TypeScript.
 * @param word:string
 * @param translate:string
 * @param example:string
 * @param topic:string
 */
export interface IWord extends Document {
  word: string;
  translate: string;
  topicId: string;
  example?: string;
}

const wordSchema: Schema = new Schema({
  word: {
    type: String,
    required: true,
  },
  translate: {
    type: String,
    required: true,
  },
  topicId: {
    type: String,
    required: true,
  },
  example: {
    type: String,
  },
});

const Word: Model<IWord> = model("Word", wordSchema);

export default Word;
