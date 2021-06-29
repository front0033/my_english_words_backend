import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";

import Request from "../../types/Request";
import Word, { IWord } from "../../models/Word";
import auth from "../../middleware/auth";

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
    auth,
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { word, translate, example, dictionary } = req.body;

    try {
      let wordItem: IWord = await Word.findOne({ word: req.body.word });

      if (wordItem) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Word already exists",
            },
          ],
        });
      }

      // Build user object based on IUser
      const wordFields = {
        word,
        translate,
        example,
        dictionary,
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

router.get(
  "/byDictionary",
  auth,
  async (req: Request & { dictionary: string }, res: Response) => {
    try {
      const dictionaryName = req.query.name;
      if (!dictionaryName) {
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
        return;
      }

      const list = await Word.find({ dictionary: String(dictionaryName) });

      res.json(list);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

export default router;
