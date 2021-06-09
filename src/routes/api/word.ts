import bcrypt from "bcryptjs";
import config from "config";
import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import gravatar from "gravatar";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Request from "../../types/Request";
import Word, { IWord } from "../../models/Word";

const router: Router = Router();

// @route   POST api/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post(
  "/",
  [
    check("word", "Please include a valid word").isString(),
    check("translate", "Please include a valid translate").isString(),
    check("dictionary", "Please include a valid dictionary").isString(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    console.log(JSON.stringify(req.body));
    const { word, translate, example, dictionary } = req.body;
    console.log(word, translate, example, dictionary)
    try {
      let wordItem: IWord = await Word.findOne({ word: req.body.word });

      if (wordItem) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Word already exists"
            }
          ]
        });
      }

      // Build user object based on IUser
      const wordFields = {
        word, translate, example, dictionary 
      };

      const newWord = new Word(wordFields);

      await newWord.save();

      res.json(newWord);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

export default router;
