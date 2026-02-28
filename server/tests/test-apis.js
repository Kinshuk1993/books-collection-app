"use strict";

import { BooksDB } from "../model/bookSchema.js";

import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../../app.js';
let should = chai.should();

chai.use(chaiHttp);

describe('Books', () => {

  beforeEach(async () => {
    await BooksDB.deleteMany({});
  });
  afterEach(async () => {
    await BooksDB.deleteMany({});
  });

  describe('/POST book', () => {
    it('it should not POST a book with empty string as author list', async () => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: [""]
      }
      const res = await chai.request(app)
        .post('/book')
        .send(book);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Input validation failed"));
    });
    it('it should not POST a book with all inputs missing', async () => {
      const res = await chai.request(app)
        .post('/book')
        .send({});
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Input validation failed"));
    });
    it('it should not POST a book with missing author field', async () => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1"
      }
      const res = await chai.request(app)
        .post('/book')
        .send(book);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Input validation failed"));
    });
    it('it should not POST a book with authors as number', async () => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: 1234
      }
      const res = await chai.request(app)
        .post('/book')
        .send(book);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Input validation failed"));
    });
    it('it should not POST a book with authors as string', async () => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: "dummy author"
      }
      const res = await chai.request(app)
        .post('/book')
        .send(book);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Input validation failed"));
    });
    it('it should not POST a book with missing title', async () => {
      let book = {
        description: "Dummy description 1",
        authors: "dummy author"
      }
      const res = await chai.request(app)
        .post('/book')
        .send(book);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Input validation failed"));
    });
    it('it should not POST a book with missing description', async () => {
      let book = {
        title: "Dummy Book 1",
        authors: "dummy author"
      }
      const res = await chai.request(app)
        .post('/book')
        .send(book);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Input validation failed"));
    });
    it('it should not POST a book with missing title and description', async () => {
      let book = {
        authors: "dummy author"
      }
      const res = await chai.request(app)
        .post('/book')
        .send(book);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
    });
    it('it should POST a book with valid input', async () => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      const res = await chai.request(app)
        .post('/book')
        .send(book);
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('id');
    });
    it('it should POST a book with valid input and ignore any additional input fields', async () => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"],
        year: 2021,
        publisher: "dummy publisher"
      }
      const res = await chai.request(app)
        .post('/book')
        .send(book);
      res.should.have.status(201);
      res.body.should.be.a('object');
      res.body.should.have.property('id');
      res.body.should.not.have.property('year');
      res.body.should.not.have.property('publisher');
    });
  });

  describe('/GET/:id book', () => {
    it('it should GET a book by the given id after creating it', async () => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      const savedBook = await new BooksDB(book).save();
      const res = await chai.request(app)
        .get('/book/' + savedBook.id)
        .send();
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.should.have.property('description');
      res.body.should.have.property('authors');
      res.body.should.have.property('_id').eql(savedBook.id);
    });
    it('it should not GET a book by the given id that does not exist', async () => {
      const res = await chai.request(app)
        .get('/book/61967133c1626e60e9750f7a')
        .send();
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.not.have.property('title');
      res.body.should.not.have.property('description');
      res.body.should.not.have.property('authors');
      res.body.should.not.have.property('_id').eql("61967133c1626e60e9750f7a");
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Book with id 61967133c1626e60e9750f7a not found"));
    });
    it('it should not GET a book by an invalid id', async () => {
      const res = await chai.request(app)
        .get('/book/61967133c1626e60e9750f7a12345g')
        .send();
      res.should.have.status(500);
      res.body.should.be.a('object');
      res.body.should.not.have.property('title');
      res.body.should.not.have.property('description');
      res.body.should.not.have.property('authors');
      res.body.should.not.have.property('_id').eql("61967133c1626e60e9750f7a");
      res.body.should.have.property('error');
      chai.assert(res.body.error.message.includes("Cast to ObjectId failed for value"));
    });
  });

  describe('/GET getAllBooks', () => {
    it('it should GET all the books', async () => {
      const res = await chai.request(app)
        .get('/getAllBooks');
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(0);
    });
  });

  describe('/DELETE/:id book', () => {
    it('it should DELETE a book given the id', async () => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      const savedBook = await new BooksDB(book).save();
      const res = await chai.request(app)
        .delete('/book/' + savedBook.id);
      res.should.have.status(204);
      res.body.should.be.a('object');
      res.body.should.be.empty;
    });
    it('it should not DELETE a book if it does not exist', async () => {
      const res = await chai.request(app)
        .delete('/book/61967133c1626e60e9750f7a');
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Book with id 61967133c1626e60e9750f7a not found"));
    });
    it('it should not DELETE a book by an invalid id', async () => {
      const res = await chai.request(app)
        .delete('/book/61967133c1626e60e9750f7a12345g')
        .send();
      res.should.have.status(500);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.message.includes("Cast to ObjectId failed for value"));
    });
  });

  describe('/DELETE all books', () => {
    it('it should delete all books', async () => {
      const res = await chai.request(app)
        .delete('/deleteAllBooks')
        .send();
      res.should.have.status(204);
      res.body.should.be.a('object');
      res.body.should.be.empty;
    });
  });

  describe('/PATCH/:id book', () => {
    it('it should not PATCH a book with empty inputs', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      const savedBook = await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .patch('/book/' + savedBook.id)
        .send();
      res.should.have.status(204);
      res.body.should.be.a('object');
      res.body.should.be.empty;
    });
    it('it should not PATCH a book with empty title', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let updateBookObj = {
        title: "",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      const savedBook = await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .patch('/book/' + savedBook.id)
        .send(updateBookObj);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Patch validation failed"));
    });
    it('it should not PATCH a book with empty description', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let updateBookObj = {
        title: "Dummy title",
        description: "",
        authors: ["dummy author"]
      }
      const savedBook = await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .patch('/book/' + savedBook.id)
        .send(updateBookObj);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Patch validation failed"));
    });
    it('it should not PATCH a book with authors as string', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let updateBookObj = {
        title: "Dummy title",
        description: "Dummy description",
        authors: "new dummy author"
      }
      const savedBook = await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .patch('/book/' + savedBook.id)
        .send(updateBookObj);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Patch validation failed"));
    });
    it('it should not PATCH a book with authors as number', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let updateBookObj = {
        title: "Dummy title",
        description: "Dummy description",
        authors: 1234
      }
      const savedBook = await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .patch('/book/' + savedBook.id)
        .send(updateBookObj);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Patch validation failed"));
    });
    it('it should not PATCH a book with authors as empty list', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let updateBookObj = {
        title: "Dummy title",
        description: "Dummy description",
        authors: []
      }
      const savedBook = await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .patch('/book/' + savedBook.id)
        .send(updateBookObj);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Patch validation failed"));
    });
    it('it should not PATCH a book with authors as empty string in the list', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let updateBookObj = {
        title: "Dummy title",
        description: "Dummy description",
        authors: ["dummy author", ""]
      }
      const savedBook = await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .patch('/book/' + savedBook.id)
        .send(updateBookObj);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Patch validation failed"));
    });
    it('it should PATCH a book with valid inputs', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let updateBookObj = {
        title: "Dummy title updated",
        description: "Dummy description updated",
        authors: ["dummy author", "dummy author 2"]
      }
      const savedBook = await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .patch('/book/' + savedBook.id)
        .send(updateBookObj);
      res.should.have.status(204);
      res.body.should.be.a('object');
      res.body.should.not.have.property('error');
      res.body.should.be.empty;
    });
    it('it should PATCH a book with valid inputs ignoring additional fields', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let updateBookObj = {
        title: "Dummy title updated",
        description: "Dummy description updated",
        authors: ["dummy author", "dummy author 2"],
        year: 2021,
        publisher: "dummy publisher"
      }
      const savedBook = await new BooksDB(saveBookObj).save();
      await chai.request(app)
        .patch('/book/' + savedBook.id)
        .send(updateBookObj);

      const res = await chai.request(app)
        .get('/book/' + savedBook.id)
        .send();
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.should.have.property('description');
      res.body.should.have.property('authors');
      res.body.should.not.have.property('year');
      res.body.should.not.have.property('publisher');
      res.body.should.have.property('_id').eql(savedBook.id);
    });
  });

  describe('/SEARCH book by author(s)', () => {
    it('it should return error if empty search body or no authors specified to search', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .search('/getBooksByAuthors')
        .send();
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Incorrect format or no authors specified to search"));
    });
    it('it should return error if no authors provided to search', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let searchObj = {
        "authors": []
      }
      await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .search('/getBooksByAuthors')
        .send(searchObj);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Incorrect format or no authors specified to search"));
    });
    it('it should return error if empty string provided as authors', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let searchObj = {
        "authors": [""]
      }
      await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .search('/getBooksByAuthors')
        .send(searchObj);
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("No book found having one or more authors in ''"));
    });
    it('it should find a book if a book exists having one or all authors provided in the search', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let searchObj = {
        "authors": ["dummy author"]
      }
      const savedBook = await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .search('/getBooksByAuthors')
        .send(searchObj);
      res.should.have.status(200);
      res.body.should.be.a('array');
      chai.expect(res.body.length).to.be.eql(1);
      chai.expect(res.body[0].authors.length).to.be.eql(1);
      chai.expect(res.body[0]).to.have.property('title', saveBookObj.title);
      chai.expect(res.body[0]).to.have.property('description', saveBookObj.description);
      chai.expect(res.body[0].authors).to.be.eql(saveBookObj.authors);
      chai.expect(res.body[0]).to.have.property('_id', savedBook.id);
    });
    it('it should find a book if a book exists having multiple authors and search has only one author', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author 1", "dummy author 2"]
      }
      let searchObj = {
        "authors": ["dummy author 1"]
      }
      const savedBook = await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .search('/getBooksByAuthors')
        .send(searchObj);
      res.should.have.status(200);
      res.body.should.be.a('array');
      chai.expect(res.body.length).to.be.eql(1);
      chai.expect(res.body[0].authors.length).to.be.eql(2);
      chai.expect(res.body[0]).to.have.property('title', saveBookObj.title);
      chai.expect(res.body[0]).to.have.property('description', saveBookObj.description);
      chai.expect(res.body[0].authors).to.be.eql(saveBookObj.authors);
      chai.expect(res.body[0]).to.have.property('_id', savedBook.id);
    });
    it('it should find a book if a book exists having only one author and search has multiple authors', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author 1"]
      }
      let searchObj = {
        authors: ["dummy author 1", "dummy author 2"]
      }
      const savedBook = await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .search('/getBooksByAuthors')
        .send(searchObj);
      res.should.have.status(200);
      res.body.should.be.a('array');
      chai.expect(res.body.length).to.be.eql(1);
      chai.expect(res.body[0].authors.length).to.be.eql(1);
      chai.expect(res.body[0]).to.have.property('title', saveBookObj.title);
      chai.expect(res.body[0]).to.have.property('description', saveBookObj.description);
      chai.expect(res.body[0].authors).to.be.eql(saveBookObj.authors);
      chai.expect(res.body[0]).to.have.property('_id', savedBook.id);
    });
    it('it should find all books if multiple books exists and search has one author common to both books', async () => {
      let saveBookObj1 = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author 1"]
      }
      let saveBookObj2 = {
        title: "Dummy Book 2",
        description: "Dummy description 2",
        authors: ["dummy author 1", "dummy author 2"]
      }
      let searchObj = {
        authors: ["dummy author 1"]
      }
      await new BooksDB(saveBookObj1).save();
      await new BooksDB(saveBookObj2).save();
      const res = await chai.request(app)
        .search('/getBooksByAuthors')
        .send(searchObj);
      res.should.have.status(200);
      res.body.should.be.a('array');
      chai.expect(res.body.length).to.be.eql(2);
    });
    it('it should find all books if multiple books exists and search has one author unique to only one book', async () => {
      let saveBookObj1 = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author 1"]
      }
      let saveBookObj2 = {
        title: "Dummy Book 2",
        description: "Dummy description 2",
        authors: ["dummy author 1", "dummy author 2"]
      }
      let searchObj = {
        authors: ["dummy author 2"]
      }
      await new BooksDB(saveBookObj1).save();
      const savedBook2 = await new BooksDB(saveBookObj2).save();
      const res = await chai.request(app)
        .search('/getBooksByAuthors')
        .send(searchObj);
      res.should.have.status(200);
      res.body.should.be.a('array');
      chai.expect(res.body.length).to.be.eql(1);
      chai.expect(res.body[0]).to.have.property('title', saveBookObj2.title);
      chai.expect(res.body[0]).to.have.property('description', saveBookObj2.description);
      chai.expect(res.body[0].authors).to.be.eql(saveBookObj2.authors);
      chai.expect(res.body[0]).to.have.property('_id', savedBook2.id);
    });
    it('it should return no books if multiple books exists and search has one or more authors not of any book', async () => {
      let saveBookObj1 = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author 1"]
      }
      let saveBookObj2 = {
        title: "Dummy Book 2",
        description: "Dummy description 2",
        authors: ["dummy author 1", "dummy author 2"]
      }
      let searchObj = {
        authors: ["dummy author 3"]
      }
      await new BooksDB(saveBookObj1).save();
      await new BooksDB(saveBookObj2).save();
      const res = await chai.request(app)
        .search('/getBooksByAuthors')
        .send(searchObj);
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("No book found having one or more authors in 'dummy author 3'"));
    });
  });

  describe('/SEARCH book by title using a keyword', () => {
    it('it should return error if no search object provided', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .search('/getAllBooksByTitle')
        .send();
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Incorrect format or missing search word"));
    });
    it('it should return error if no search word not a string', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let searchObj = {
        searchWord: []
      }
      await new BooksDB(saveBookObj).save();
      const res1 = await chai.request(app)
        .search('/getAllBooksByTitle')
        .send(searchObj);
      res1.should.have.status(400);
      res1.body.should.be.a('object');
      res1.body.should.have.property('error');
      chai.assert(res1.body.error.includes("Incorrect format or missing search word"));

      searchObj.searchWord = 1234;
      const res2 = await chai.request(app)
        .search('/getAllBooksByTitle')
        .send(searchObj);
      res2.should.have.status(400);
      res2.body.should.be.a('object');
      res2.body.should.have.property('error');
      chai.assert(res2.body.error.includes("Incorrect format or missing search word"));
    });
    it('it should return error if no search word key not present', async () => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let searchObj = {
        word: "dummy"
      }
      await new BooksDB(saveBookObj).save();
      const res = await chai.request(app)
        .search('/getAllBooksByTitle')
        .send(searchObj);
      res.should.have.status(400);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("Incorrect format or missing search word"));
    });
    it('it should return all books if title contains the exact search word', async () => {
      let saveBookObj1 = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author 1"]
      }
      let saveBookObj2 = {
        title: "Dummy Book 2",
        description: "Dummy description 2",
        authors: ["dummy author 2"]
      }
      let searchObj = {
        searchWord: "Dummy"
      }
      await new BooksDB(saveBookObj1).save();
      await new BooksDB(saveBookObj2).save();
      const res = await chai.request(app)
        .search('/getAllBooksByTitle')
        .send(searchObj);
      res.should.have.status(200);
      res.body.should.be.a('array');
      chai.expect(res.body.length).to.be.eql(2);
    });
    it('it should return no books if no book\'s title contains the search word', async () => {
      let saveBookObj1 = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author 1"]
      }
      let saveBookObj2 = {
        title: "Dummy Book 2",
        description: "Dummy description 2",
        authors: ["dummy author 2"]
      }
      let searchObj = {
        searchWord: "unique"
      }
      await new BooksDB(saveBookObj1).save();
      await new BooksDB(saveBookObj2).save();
      const res = await chai.request(app)
        .search('/getAllBooksByTitle')
        .send(searchObj);
      res.should.have.status(404);
      res.body.should.be.a('object');
      res.body.should.have.property('error');
      chai.assert(res.body.error.includes("No book found with title containing the word 'unique'"));
    });
  });

  describe('/INVALID operation', () => {
    it('it should return error if any other path is hit or some path hit with incorrect http method', async () => {
      const res1 = await chai.request(app)
        .get('/invalid')
        .send();
      res1.should.have.status(501);
      res1.body.should.be.a('object');
      res1.body.should.have.property('error');
      chai.assert(res1.body.error.includes("GET method is not implemented for path /invalid"));

      const res2 = await chai.request(app)
        .get('/getBooksByAuthors')
        .send();
      res2.should.have.status(501);
      res2.body.should.be.a('object');
      res2.body.should.have.property('error');
      chai.assert(res2.body.error.includes("GET method is not implemented for path /getBooksByAuthors"));
    });
  });
});
