"use strict";

import { BooksDB } from "./../model/bookSchema.js";
import { logger } from "../config/logConfig.js"

export const defaultReply = (req, res) => {
  logger.info(`${req.method} method is not implemented for path ${req.url}`);
  res.status(501).send({ error: `${req.method} method is not implemented for path ${req.url}` });
}

const validateBookAuthorForPost = (book) => {
  if (!book.title || book.title.length === 0 ||
    !book.description || book.description.length === 0 ||
    !book.authors || typeof book.authors === "number" || book.authors.length === 0 || book.authors.includes("")) {
    logger.error(`Input validation failed - incorrect or missing input`)
    return false;
  }
  return true;
}

const validateInputForPatch = (book) => {
  if ((book.authors !== undefined && (typeof book.authors === "number" || book.authors.length === 0 || book.authors.includes(""))) ||
    (book.title !== undefined && book.title.length === 0) ||
    (book.description !== undefined && book.description.length === 0)) {
    logger.error(`Patch validation failed - title (string), description (string) and authors (array) must be valid`);
    return false;
  }
  return true;
}

export const insert = (req, res) => {
  if (!validateBookAuthorForPost(req.body)) return res.status(400).send({ error: `Input validation failed - incorrect or missing input` });
  let newBook = new BooksDB(req.body);
  return newBook.save()
    .then((savedBook) => {
      logger.info(`New book added: ${JSON.stringify(savedBook)}`);
      res.status(201).send({ id: savedBook._id });
    })
    .catch((err) => {
      logger.error('Error in saving new book to the database: ' + err);
      res.status(500).send({ error: err });
    });
};

export const getBookById = async (req, res) => {
  let bookId = req.params.bookId
  try {
    let book = await BooksDB.findById(bookId);
    if (!book) {
      logger.info(`Book not found with id: ${bookId}`);
      return res.status(404).send({ error: `Book with id ${bookId} not found` });
    }
    logger.info(`Book found: ${JSON.stringify(book)}`);
    book = book.toJSON();
    delete book.__v;
    return res.status(200).send(book);
  } catch (err) {
    logger.error(`Error searching for book: ${err}`);
    res.status(500).send({ error: err });
  }
}

export const getAllBooks = async (_req, res) => {
  try {
    let allBooks = await BooksDB.find({});
    logger.info(`${allBooks.length} books retrieved`);
    return res.status(200).send(allBooks);
  } catch (err) {
    logger.error(`Error retrieving all books: ${err}`);
    return res.status(500).send({ error: err });
  }
}

export const removeBookById = async (req, res) => {
  let bookId = req.params.bookId
  try {
    let deletedBook = await BooksDB.findByIdAndDelete(bookId);
    if (!deletedBook) {
      logger.error(`No book found with id: ${bookId}`);
      return res.status(404).send({ error: `Book with id ${bookId} not found` });
    }
    logger.info(`Deleted the book with id: ${bookId}`);
    return res.status(204).send();
  } catch (err) {
    logger.error(`Error deleting book: ${err}`);
    res.status(500).send({ error: err });
  }
}

export const removeAllBooks = async (_req, res) => {
  try {
    let deletedBooks = await BooksDB.deleteMany({});
    logger.info(`Deleted ${deletedBooks.deletedCount} book(s) from the database`);
    return res.status(204).send();
  } catch (err) {
    logger.error(`Error deleting all books from the database: ${err}`);
    return res.status(500).send({ error: err });
  }
}

export const patchBook = async (req, res) => {
  let bookId = req.params.bookId
  if (!validateInputForPatch(req.body)) return res.status(400).send({ error: `Patch validation failed - title (string), description (string) and authors (array) must be valid` });
  try {
    let updatedBook = await BooksDB.findOneAndUpdate({ _id: bookId }, req.body);
    if (!updatedBook) {
      logger.error(`No book updated as book with id ${bookId} not found`);
      return res.status(404).send({ error: `Book with id ${bookId} not found` });
    }
    logger.info(`Updated the book with id: ${bookId}`);
    return res.status(204).send();
  } catch (err) {
    logger.error(`Error updating books with id: ${bookId}`);
    res.status(500).send({ error: err });
  }
}

export const getAllBooksByAuthors = async (req, res) => {
  if (req.body.authors === undefined || req.body.authors.length === 0) {
    logger.error(`Incorrect format or no authors specified to search`);
    return res.status(400).send({ error: `Incorrect format or no authors specified to search` });
  }
  try {
    let allBooksByAuthors = await BooksDB.find({ authors: { $in: req.body.authors } });
    if (allBooksByAuthors.length === 0) {
      logger.info(`No book found having one or more authors in '${req.body.authors}'`);
      return res.status(404).send({ error: `No book found having one or more authors in '${req.body.authors}'` });
    }
    logger.info(`${allBooksByAuthors.length} books found having one or more authors in: '${req.body.authors}'`);
    return res.status(200).send(allBooksByAuthors);
  } catch (err) {
    logger.error(`Error getting all books by authors: ${err}`);
    return res.status(500).send({ error: err });
  }
}

export const getAllBooksByTitle = async (req, res) => {
  if (req.body.searchWord === undefined || typeof req.body.searchWord !== "string" || req.body.searchWord.length === 0) {
    logger.error(`Incorrect format or missing search word`);
    return res.status(400).send({ error: `Incorrect format or missing search word` });
  }
  let searchWord = req.body.searchWord;
  try {
    let allBooksByHavingTitle = await BooksDB.find({ $text: { $search: searchWord } });
    if (allBooksByHavingTitle.length === 0) {
      logger.info(`No book found with title containing the word '${searchWord}'`);
      return res.status(404).send({ error: `No book found with title containing the word '${searchWord}'` });
    }
    logger.info(`${allBooksByHavingTitle.length} books found with title containing the word '${searchWord}'`);
    return res.status(200).send(allBooksByHavingTitle);
  } catch (err) {
    logger.error(`Error getting all books by title: ${err}`);
    return res.status(500).send({ error: err });
  }
}
