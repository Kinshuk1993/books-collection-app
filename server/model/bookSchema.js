"use strict";

import { mongoose } from "./service.js";
const Schema = mongoose.Schema;
const model = mongoose.model;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
    required: true,
  }
});

// create a text type index on the title to enable full text search
bookSchema.index({ title: 'text' });

export const BooksDB = model("BooksDB", bookSchema);
