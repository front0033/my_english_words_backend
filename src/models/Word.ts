import { Document, Model, model, Schema } from "mongoose";
import { IUser } from "./User";

/**
 * Interface to model the User Schema for TypeScript.
 * @param word:string
 * @param translate:string
 * @param example:string
 * @param dictionary:string
 */
export interface IWord extends Document {
  user: IUser["_id"];
  word: string;
  translate: string;
  example: string;
  dictionary: string;
}

const wordSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  word: {
    type: String,
    required: true,
  },
  translate: {
    type: String,
    required: true,
  },
  example: {
    type: String,
  },
  dictionary: {
    type: String,
    required: true,
  },
});

const Word: Model<IWord> = model("Word", wordSchema);

export default Word;
