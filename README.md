# Books Collection App

A simple RESTful API server in Node.js for the book collection app. Each book has a title, description, and 1-n authors. API endpoints allows searching in collection and book management (CRUD)

## Prerequisites

- Working internet connection
- Node.js installed (https://nodejs.org/)
  - The application was developed using `Node` version `17.1.0` and `npm` version `8.1.2`
- MongoDB installed and running locally (https://www.mongodb.com/)
  - Using Windows, just open the terminal at where you installed mongo and run `mongod.exe`
  - For Mac OS X, visit https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x
- Run `npm install` in your root project folder to install the required application dependencies

## Running the tests

- `npm run tests`

## Starting the application

To start, run the following command from the project root folder:

- `npm start`
  - It will run the server at port 3000

## Stopping the application

- You can press `Ctrl` + `C` on the keyboard to stop the application

## Some Assumptions

- A Book must contain a `title`, `description` and one or more `authors`
  - `title` must be a string
  - `description` must be a string
  - `authors` must be an array of string
  - Any other fields if given as input will either be ignored or an appropriate errors will be returned
- While searching for a book using multiple authors, the result will show books having all combinations of authors in any order
- While searching for a book using a search term present in the title, the matching will be `case-insensitive`
- When updating a book, any additional fields in the input field apart from the expected ones will be ignored

## API Details

For the purposes of documentation, the below examples will assume that the server is running at `localhost:3000` or `127.0.0.1:3000`.

- Add a book
  - Method: `POST`
  - Endpoint: `127.0.0.1:3000/book`
  - Payload: `{ "title": "dummy title", "description": dummy description, "authors": ["dummy author"] }`
  - Success Response: `{ "id": "6196acc6bb5be6e07d85a468" }`
- Get a book by ID
  - Method: `GET`
  - Endpoint: `127.0.0.1:3000/book/bookID`
  - Success Response: `{ "_id": "6196acc6bb5be6e07d85a468", "title": "dummy title", "description": "dummy description", "authors": ["dummy author"] }`
- Get all books
  - Method: `GET`
  - Endpoint: `127.0.0.1:3000/getAllBooks`
  - Success Response: `[ { "_id": "6196acc6bb5be6e07d85a468", "title": "dummy title", "description": "dummy description", "authors": [ "dummy author" ], "__v": 0 } ]`
- Delete a book by ID
  - Method: `DELETE`
  - Endpoint: `127.0.0.1:3000/book/bookID`
- Delete all books
  - Method: `DELETE`
  - Endpoint: `127.0.0.1:3000/deleteAllBooks`
- Update a book by ID
  - Method: `PATCH`
  - Endpoint: `127.0.0.1:3000/book/bookID`
  - Payload: `{ "title": "dummy title", "description": "dummy description", "authors": ["dummy author"] }`
- Search books by one or more authors
  - Method: `SEARCH`
  - Endpoint: `127.0.0.1:3000/getBooksByAuthors`
  - Payload: `{ "authors": ["Mr. Dummy Surname"] }`
  - Success Response: `[ { "_id": "6196acc6bb5be6e07d85a468", "title": "Dummy title", "description": "dummy description", "authors": [ "Mr. Dummy Surname" ], "__v": 0 } ]`
- Search books with title containing a word
  - Method: `SEARCH`
  - Endpoint: `127.0.0.1:3000/getAllBooksByTitle`
  - Payload: `{ "searchWord": "Dummy" }`
  - Success Response: `[ { "_id": "6196acc6bb5be6e07d85a468", "title": "Dummy title", "description": "dummy description", "authors": [ "Mr. Dummy Surname" ], "__v": 0 } ]`

## Important Links

- https://tecadmin.net/install-nvm-macos-with-homebrew/
- https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
- https://nodejs.org/
- https://www.mongodb.com/
