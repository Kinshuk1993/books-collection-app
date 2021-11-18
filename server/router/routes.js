"use strict";

import * as bookshop from "../controller/operations.js";

// define all routes
export const allRoutes = (app) => {
  app.post("/book", [
    bookshop.insert
  ]);
  app.get("/book/:bookId", [
    bookshop.getBookById
  ]);
  app.get("/getAllBooks", [
    bookshop.getAllBooks
  ]);
  app.delete("/book/:bookId", [
    bookshop.removeBookById
  ]);
  app.delete("/deleteAllBooks", [
    bookshop.removeAllBooks
  ]);
  app.patch("/book/:bookId", [
    bookshop.patchBook
  ]);
  app.search("/getBooksByAuthors", [
    bookshop.getAllBooksByAuthors
  ]);
  app.search("/getAllBooksByTitle", [
    bookshop.getAllBooksByTitle
  ]);
  app.get("/*", [
    bookshop.defaultReply
  ]);
};

