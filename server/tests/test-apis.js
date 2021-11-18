"use strict";

import { BooksDB } from "../model/bookSchema.js";

import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../../app.js';
let should = chai.should();

chai.use(chaiHttp);

describe('Books', () => {

  beforeEach((done) => {
    BooksDB.deleteMany({}, (_err) => {
      done();
    });
  });
  afterEach((done) => {
    BooksDB.deleteMany({}, (_err) => {
      done();
    });
  });

  describe('/POST book', () => {
    it('it should not POST a book with empty string as author list', (done) => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: [""]
      }
      chai.request(app)
        .post('/book')
        .send(book)
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          chai.assert(res.body.error.includes("Input validation failed"));
          done();
        });
    });
    it('it should not POST a book with all inputs missing', (done) => {
      chai.request(app)
        .post('/book')
        .send({})
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          chai.assert(res.body.error.includes("Input validation failed"));
          done();
        });
    });
    it('it should not POST a book with missing author field', (done) => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1"
      }
      chai.request(app)
        .post('/book')
        .send(book)
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          chai.assert(res.body.error.includes("Input validation failed"));
          done();
        });
    });
    it('it should not POST a book with authors as number', (done) => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: 1234
      }
      chai.request(app)
        .post('/book')
        .send(book)
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          chai.assert(res.body.error.includes("Input validation failed"));
          done();
        });
    });
    it('it should not POST a book with authors as string', (done) => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: "dummy author"
      }
      chai.request(app)
        .post('/book')
        .send(book)
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          chai.assert(res.body.error.includes("Input validation failed"));
          done();
        });
    });
    it('it should not POST a book with missing title', (done) => {
      let book = {
        description: "Dummy description 1",
        authors: "dummy author"
      }
      chai.request(app)
        .post('/book')
        .send(book)
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          chai.assert(res.body.error.includes("Input validation failed"));
          done();
        });
    });
    it('it should not POST a book with missing description', (done) => {
      let book = {
        title: "Dummy Book 1",
        authors: "dummy author"
      }
      chai.request(app)
        .post('/book')
        .send(book)
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          chai.assert(res.body.error.includes("Input validation failed"));
          done();
        });
    });
    it('it should not POST a book with missing title and description', (done) => {
      let book = {
        authors: "dummy author"
      }
      chai.request(app)
        .post('/book')
        .send(book)
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
    });
    it('it should POST a book with valid input', (done) => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      chai.request(app)
        .post('/book')
        .send(book)
        .end((_err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          done();
        });
    });
    it('it should POST a book with valid input and ignore any additional input fields', (done) => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"],
        year: 2021,
        publisher: "dummy publisher"
      }
      chai.request(app)
        .post('/book')
        .send(book)
        .end((_err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.not.have.property('year');
          res.body.should.not.have.property('publisher');
          done();
        });
    });
  });

  describe('/GET/:id book', () => {
    it('it should GET a book by the given id after creating it', (done) => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      new BooksDB(book).save((_err, book) => {
        chai.request(app)
          .get('/book/' + book.id)
          .send()
          .end((_err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('description');
            res.body.should.have.property('authors');
            res.body.should.have.property('_id').eql(book.id);
            done();
          });
      });
    });
    it('it should not GET a book by the given id that does not exist', (done) => {
      chai.request(app)
        .get('/book/61967133c1626e60e9750f7a')
        .send()
        .end((_err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.not.have.property('title');
          res.body.should.not.have.property('description');
          res.body.should.not.have.property('authors');
          res.body.should.not.have.property('_id').eql("61967133c1626e60e9750f7a");
          res.body.should.have.property('error');
          chai.assert(res.body.error.includes("Book with id 61967133c1626e60e9750f7a not found"));
          done();
        });
    });
    it('it should not GET a book by an invalid id', (done) => {
      chai.request(app)
        .get('/book/61967133c1626e60e9750f7a12345g')
        .send()
        .end((_err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.not.have.property('title');
          res.body.should.not.have.property('description');
          res.body.should.not.have.property('authors');
          res.body.should.not.have.property('_id').eql("61967133c1626e60e9750f7a");
          res.body.should.have.property('error');
          chai.assert(res.body.error.message.includes("Cast to ObjectId failed for value"));
          done();
        });
    });
  });

  describe('/GET getAllBooks', () => {
    it('it should GET all the books', (done) => {
      chai.request(app)
        .get('/getAllBooks')
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('/DELETE/:id book', () => {
    it('it should DELETE a book given the id', (done) => {
      let book = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      new BooksDB(book).save((_err, book) => {
        chai.request(app)
          .delete('/book/' + book.id)
          .end((_err, res) => {
            res.should.have.status(204);
            res.body.should.be.a('object');
            res.body.should.be.empty;
            done();
          });
      });
    });
    it('it should not DELETE a book if it does not exist', (done) => {
      chai.request(app)
        .delete('/book/61967133c1626e60e9750f7a')
        .end((_err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          chai.assert(res.body.error.includes("Book with id 61967133c1626e60e9750f7a not found"));
          done();
        });
    });
    it('it should not DELETE a book by an invalid id', (done) => {
      chai.request(app)
        .delete('/book/61967133c1626e60e9750f7a12345g')
        .send()
        .end((_err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          chai.assert(res.body.error.message.includes("Cast to ObjectId failed for value"));
          done();
        });
    });
  });

  describe('/DELETE all books', () => {
    it('it should delete all books', (done) => {
      chai.request(app)
        .delete('/deleteAllBooks')
        .send()
        .end((_err, res) => {
          res.should.have.status(204);
          res.body.should.be.a('object');
          res.body.should.be.empty;
          done();
        });
    });
  });

  describe('/PATCH/:id book', () => {
    it('it should not PATCH a book with empty inputs', (done) => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      new BooksDB(saveBookObj).save((_err, book) => {
        chai.request(app)
          .patch('/book/' + book.id)
          .send()
          .end((_err, res) => {
            res.should.have.status(204);
            res.body.should.be.a('object');
            res.body.should.be.empty;
            done();
          });
      });
    });
    it('it should not PATCH a book with empty title', (done) => {
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
      new BooksDB(saveBookObj).save((_err, book) => {
        chai.request(app)
          .patch('/book/' + book.id)
          .send(updateBookObj)
          .end((_err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            chai.assert(res.body.error.includes("Patch validation failed"));
            done();
          });
      });
    });
    it('it should not PATCH a book with empty description', (done) => {
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
      new BooksDB(saveBookObj).save((_err, book) => {
        chai.request(app)
          .patch('/book/' + book.id)
          .send(updateBookObj)
          .end((_err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            chai.assert(res.body.error.includes("Patch validation failed"));
            done();
          });
      });
    });
    it('it should not PATCH a book with authors as string', (done) => {
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
      new BooksDB(saveBookObj).save((_err, book) => {
        chai.request(app)
          .patch('/book/' + book.id)
          .send(updateBookObj)
          .end((_err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            chai.assert(res.body.error.includes("Patch validation failed"));
            done();
          });
      });
    });
    it('it should not PATCH a book with authors as number', (done) => {
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
      new BooksDB(saveBookObj).save((_err, book) => {
        chai.request(app)
          .patch('/book/' + book.id)
          .send(updateBookObj)
          .end((_err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            chai.assert(res.body.error.includes("Patch validation failed"));
            done();
          });
      });
    });
    it('it should not PATCH a book with authors as empty list', (done) => {
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
      new BooksDB(saveBookObj).save((_err, book) => {
        chai.request(app)
          .patch('/book/' + book.id)
          .send(updateBookObj)
          .end((_err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            chai.assert(res.body.error.includes("Patch validation failed"));
            done();
          });
      });
    });
    it('it should not PATCH a book with authors as empty string in the list', (done) => {
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
      new BooksDB(saveBookObj).save((_err, book) => {
        chai.request(app)
          .patch('/book/' + book.id)
          .send(updateBookObj)
          .end((_err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            chai.assert(res.body.error.includes("Patch validation failed"));
            done();
          });
      });
    });
    it('it should PATCH a book with valid inputs', (done) => {
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
      new BooksDB(saveBookObj).save((_err, book) => {
        chai.request(app)
          .patch('/book/' + book.id)
          .send(updateBookObj)
          .end((_err, res) => {
            res.should.have.status(204);
            res.body.should.be.a('object');
            res.body.should.not.have.property('error');
            res.body.should.be.empty;
            done();
          });
      });
    });
    it('it should PATCH a book with valid inputs ignoring additional fields', (done) => {
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
      new BooksDB(saveBookObj).save((_err, book) => {
        chai.request(app)
          .patch('/book/' + book.id)
          .send(updateBookObj)
          .end((_err, res) => {
            res.should.have.status(204);
            res.body.should.be.a('object');
            res.body.should.not.have.property('error');
            res.body.should.be.empty;
          });

        chai.request(app)
          .get('/book/' + book.id)
          .send()
          .end((_err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('description');
            res.body.should.have.property('authors');
            res.body.should.not.have.property('year');
            res.body.should.not.have.property('publisher');
            res.body.should.have.property('_id').eql(book.id);
            done();
          });
      });
    });
  });

  describe('/SEARCH book by author(s)', () => {
    it('it should return error if empty search body or no authors specified to search', (done) => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      new BooksDB(saveBookObj).save((_err, _book) => {
        chai.request(app)
          .search('/getBooksByAuthors')
          .send()
          .end((_err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            chai.assert(res.body.error.includes("Incorrect format or no authors specified to search"));
            done();
          });
      });
    });
    it('it should return error if no authors provided to search', (done) => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let searchObj = {
        "authors": []
      }
      new BooksDB(saveBookObj).save((_err, _book) => {
        chai.request(app)
          .search('/getBooksByAuthors')
          .send(searchObj)
          .end((_err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            chai.assert(res.body.error.includes("Incorrect format or no authors specified to search"));
            done();
          });
      });
    });
    it('it should return error if empty string provided as authors', (done) => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let searchObj = {
        "authors": [""]
      }
      new BooksDB(saveBookObj).save((_err, _book) => {
        chai.request(app)
          .search('/getBooksByAuthors')
          .send(searchObj)
          .end((_err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            chai.assert(res.body.error.includes("No book found having one or more authors in ''"));
            done();
          });
      });
    });
    it('it should find a book if a book exists having one or all authors provided in the search', (done) => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let searchObj = {
        "authors": ["dummy author"]
      }
      new BooksDB(saveBookObj).save((_err, book) => {
        chai.request(app)
          .search('/getBooksByAuthors')
          .send(searchObj)
          .end((_err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            chai.expect(res.body.length).to.be.eql(1);
            chai.expect(res.body[0].authors.length).to.be.eql(1);
            chai.expect(res.body[0]).to.have.property('title', saveBookObj.title);
            chai.expect(res.body[0]).to.have.property('description', saveBookObj.description);
            chai.expect(res.body[0].authors).to.be.eql(saveBookObj.authors);
            chai.expect(res.body[0]).to.have.property('_id', book.id);
            done();
          });
      });
    });
    it('it should find a book if a book exists having multiple authors and search has only one author', (done) => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author 1", "dummy author 2"]
      }
      let searchObj = {
        "authors": ["dummy author 1"]
      }
      new BooksDB(saveBookObj).save((_err, book) => {
        chai.request(app)
          .search('/getBooksByAuthors')
          .send(searchObj)
          .end((_err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            chai.expect(res.body.length).to.be.eql(1);
            chai.expect(res.body[0].authors.length).to.be.eql(2);
            chai.expect(res.body[0]).to.have.property('title', saveBookObj.title);
            chai.expect(res.body[0]).to.have.property('description', saveBookObj.description);
            chai.expect(res.body[0].authors).to.be.eql(saveBookObj.authors);
            chai.expect(res.body[0]).to.have.property('_id', book.id);
            done();
          });
      });
    });
    it('it should find a book if a book exists having only one author and search has multiple authors', (done) => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author 1"]
      }
      let searchObj = {
        authors: ["dummy author 1", "dummy author 2"]
      }
      new BooksDB(saveBookObj).save((_err, book) => {
        chai.request(app)
          .search('/getBooksByAuthors')
          .send(searchObj)
          .end((_err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            chai.expect(res.body.length).to.be.eql(1);
            chai.expect(res.body[0].authors.length).to.be.eql(1);
            chai.expect(res.body[0]).to.have.property('title', saveBookObj.title);
            chai.expect(res.body[0]).to.have.property('description', saveBookObj.description);
            chai.expect(res.body[0].authors).to.be.eql(saveBookObj.authors);
            chai.expect(res.body[0]).to.have.property('_id', book.id);
            done();
          });
      });
    });
    it('it should find all books if multiple books exists and search has one author common to both books', (done) => {
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
      new BooksDB(saveBookObj1).save();
      new BooksDB(saveBookObj2).save((_err, _book) => {
        chai.request(app)
          .search('/getBooksByAuthors')
          .send(searchObj)
          .end((_err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            chai.expect(res.body.length).to.be.eql(2);
            done();
          });
      });
    });
    it('it should find all books if multiple books exists and search has one author unique to only one book', (done) => {
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
      new BooksDB(saveBookObj1).save();
      new BooksDB(saveBookObj2).save((_err, book) => {
        chai.request(app)
          .search('/getBooksByAuthors')
          .send(searchObj)
          .end((_err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            chai.expect(res.body.length).to.be.eql(1);
            chai.expect(res.body[0]).to.have.property('title', saveBookObj2.title);
            chai.expect(res.body[0]).to.have.property('description', saveBookObj2.description);
            chai.expect(res.body[0].authors).to.be.eql(saveBookObj2.authors);
            chai.expect(res.body[0]).to.have.property('_id', book.id);
            done();
          });
      });
    });
    it('it should return no books if multiple books exists and search has one or more authors not of any book', (done) => {
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
      new BooksDB(saveBookObj1).save();
      new BooksDB(saveBookObj2).save((_err, book) => {
        chai.request(app)
          .search('/getBooksByAuthors')
          .send(searchObj)
          .end((_err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            chai.assert(res.body.error.includes("No book found having one or more authors in 'dummy author 3'"));
            done();
          });
      });
    });
  });

  describe('/SEARCH book by title using a keyword', () => {
    it('it should return error if no search object provided', (done) => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      new BooksDB(saveBookObj).save((_err, _book) => {
        chai.request(app)
          .search('/getAllBooksByTitle')
          .send()
          .end((_err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            chai.assert(res.body.error.includes("Incorrect format or missing search word"));
            done();
          });
      });
    });
    it('it should return error if no search word not a string', (done) => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let searchObj = {
        searchWord: []
      }
      new BooksDB(saveBookObj).save((_err, _book) => {
        chai.request(app)
          .search('/getAllBooksByTitle')
          .send(searchObj)
          .end((_err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            chai.assert(res.body.error.includes("Incorrect format or missing search word"));
          });
        searchObj.searchWord = 1234;
        chai.request(app)
          .search('/getAllBooksByTitle')
          .send(searchObj)
          .end((_err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            chai.assert(res.body.error.includes("Incorrect format or missing search word"));
            done();
          });
      });
    });
    it('it should return error if no search word key not present', (done) => {
      let saveBookObj = {
        title: "Dummy Book 1",
        description: "Dummy description 1",
        authors: ["dummy author"]
      }
      let searchObj = {
        word: "dummy"
      }
      new BooksDB(saveBookObj).save((_err, _book) => {
        chai.request(app)
          .search('/getAllBooksByTitle')
          .send(searchObj)
          .end((_err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            chai.assert(res.body.error.includes("Incorrect format or missing search word"));
            done();
          });
      });
    });
    it('it should return all books if title contains the exact search word', (done) => {
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
      new BooksDB(saveBookObj1).save();
      new BooksDB(saveBookObj2).save((_err, _book) => {
        chai.request(app)
          .search('/getAllBooksByTitle')
          .send(searchObj)
          .end((_err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            chai.expect(res.body.length).to.be.eql(2);
            done();
          });
      });
    });
    it('it should return no books if no book\'s title contains the search word', (done) => {
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
      new BooksDB(saveBookObj1).save();
      new BooksDB(saveBookObj2).save((_err, _book) => {
        chai.request(app)
          .search('/getAllBooksByTitle')
          .send(searchObj)
          .end((_err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            chai.assert(res.body.error.includes("No book found with title containing the word 'unique'"));
            done();
          });
      });
    });
  });
});
