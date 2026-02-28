# Books Collection App - Developer Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Development Environment Setup](#development-environment-setup)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Development Workflow](#development-workflow)
6. [Code Standards](#code-standards)
7. [Testing Guide](#testing-guide)
8. [Debugging](#debugging)
9. [Common Development Tasks](#common-development-tasks)
10. [Contributing Guidelines](#contributing-guidelines)
11. [Troubleshooting Development Issues](#troubleshooting-development-issues)
12. [Build and Deployment](#build-and-deployment)

---

## Introduction

Welcome to the Books Collection App development guide! This document will help you set up your development environment and understand the codebase.

### Technology Overview

- **Runtime:** Node.js 17.1.0+
- **Framework:** Express.js 4.21.2
- **Database:** MongoDB 5.0.3+
- **ODM:** Mongoose 8.19.2
- **Testing:** Mocha + Chai + Chai-HTTP
- **Logging:** Winston
- **Module System:** ES6 Modules

---

## Development Environment Setup

### Prerequisites Installation

#### 1. Install Node.js

**Using NVM (Recommended for macOS/Linux):**
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js
nvm install 17.1.0
nvm use 17.1.0
nvm alias default 17.1.0
```

**Direct Installation:**
- Download from https://nodejs.org/
- Install version 17.1.0 or higher

**Verify Installation:**
```bash
node --version  # Should output v17.1.0 or higher
npm --version   # Should output 8.1.2 or higher
```

#### 2. Install MongoDB

**macOS (using Homebrew):**
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@5.0

# Start MongoDB
brew services start mongodb-community@5.0

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run the installer
3. Navigate to MongoDB bin directory (e.g., `C:\Program Files\MongoDB\Server\5.0\bin`)
4. Run `mongod.exe`

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
```

**Verify MongoDB Installation:**
```bash
mongo --version
```

#### 3. Install Git (for version control)

**macOS:**
```bash
brew install git
```

**Windows:**
- Download from https://git-scm.com/

**Linux:**
```bash
sudo apt-get install git
```

#### 4. Recommended Code Editor

**Visual Studio Code (Recommended):**
- Download from https://code.visualstudio.com/

**Recommended VS Code Extensions:**
- ESLint
- Prettier
- MongoDB for VS Code
- REST Client
- Thunder Client (API testing)

---

## Project Structure

### Directory Layout

```
books-collection-app/
│
├── app.js                              # Application entry point
├── package.json                        # Dependencies and scripts
├── package-lock.json                   # Locked dependency versions
│
├── server/                             # Server code
│   ├── config/                         # Configuration files
│   │   ├── env.js                      # Environment variables
│   │   └── logConfig.js                # Winston logging configuration
│   │
│   ├── controller/                     # Business logic layer
│   │   └── operations.js               # All CRUD operations
│   │
│   ├── model/                          # Data layer
│   │   ├── bookSchema.js               # Mongoose schema
│   │   └── service.js                  # Database connection
│   │
│   ├── router/                         # Routing layer
│   │   └── routes.js                   # Route definitions
│   │
│   └── tests/                          # Test files
│       └── test-apis.js                # Integration tests
│
├── Book-Collection-Server-Logs/        # Generated log files
│   └── DD-MM-YYYY.log                  # Daily log files
│
├── docs/                               # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── USER_GUIDE.md
│   ├── TECHNICAL_SPECIFICATION.md
│   └── DEVELOPER_GUIDE.md
│
├── node_modules/                       # Dependencies (auto-generated)
│
└── README.md                           # Project overview
```

### File Descriptions

#### app.js
- **Purpose:** Application bootstrap
- **Responsibilities:**
  - Initialize Express
  - Configure middleware
  - Connect to database
  - Load routes
  - Start server

#### server/config/env.js
- **Purpose:** Configuration constants
- **Contains:**
  - Database URL
  - Server host/port
  - API endpoint

#### server/config/logConfig.js
- **Purpose:** Logging configuration
- **Features:**
  - Console transport
  - Daily rotating file transport
  - Custom formatting

#### server/controller/operations.js
- **Purpose:** Business logic
- **Contains:** All controller functions for CRUD operations

#### server/model/bookSchema.js
- **Purpose:** Data model
- **Defines:** Mongoose schema for Book

#### server/model/service.js
- **Purpose:** Database connection
- **Features:** Connection with retry logic

#### server/router/routes.js
- **Purpose:** Route definitions
- **Maps:** HTTP methods to controller functions

#### server/tests/test-apis.js
- **Purpose:** Integration tests
- **Contains:** 50+ test cases

---

## Getting Started

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd books-collection-app
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Production dependencies (Express, Mongoose, Winston, etc.)
- Development dependencies (Mocha, Chai, Nodemon, etc.)

### Step 3: Configure Environment

The application uses default configuration in `server/config/env.js`:

```javascript
export const url = "mongodb://127.0.0.1/bookshop";
export const host = "127.0.0.1";
export const appEndpoint = "http://localhost:3000";
export const httpPort = 3000;
```

**For Custom Configuration:**
1. Create a `.env` file (future enhancement)
2. Modify `env.js` directly (current approach)

### Step 4: Start MongoDB

Ensure MongoDB is running:

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Navigate to MongoDB bin directory and run:
mongod.exe
```

### Step 5: Start Development Server

**Option 1: Production Mode**
```bash
npm start
```

**Option 2: Development Mode (with auto-reload)**
```bash
npm run live
```

The server will start at `http://127.0.0.1:3000`

### Step 6: Verify Installation

**Test the server:**
```bash
curl http://127.0.0.1:3000/getAllBooks
```

Expected response: `[]` (empty array)

---

## Development Workflow

### Typical Development Cycle

1. **Start Development Server**
   ```bash
   npm run live
   ```

2. **Make Code Changes**
   - Edit files in `server/` directory
   - Nodemon will auto-restart the server

3. **Test Changes**
   - Use cURL, Postman, or Thunder Client
   - Run automated tests: `npm test`

4. **Check Logs**
   - Console output
   - Log files in `Book-Collection-Server-Logs/`

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

### Available NPM Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| start | `npm start` | Start production server |
| live | `npm run live` | Start development server with auto-reload |
| test | `npm test` | Run test suite |

---

## Code Standards

### JavaScript Style Guide

**Module System:**
```javascript
// Use ES6 imports/exports
import express from "express";
export const functionName = () => {};
```

**String Declarations:**
```javascript
// Use strict mode
"use strict";
```

**Async/Await:**
```javascript
// Prefer async/await over callbacks
export const getBookById = async (req, res) => {
  try {
    let book = await BooksDB.findById(bookId);
    // ...
  } catch (err) {
    // ...
  }
}
```

**Variable Declarations:**
```javascript
// Use const by default
const value = 10;

// Use let for reassignment
let counter = 0;

// Avoid var
```

**Naming Conventions:**
```javascript
// camelCase for functions and variables
const myFunction = () => {};
let userName = "John";

// PascalCase for models
const BooksDB = model("BooksDB", schema);

// UPPERCASE for constants
const MAX_RETRIES = 10;
```

**Error Handling:**
```javascript
// Always use try-catch for async operations
try {
  let result = await operation();
  // Handle success
} catch (err) {
  logger.error(`Error: ${err}`);
  res.status(500).send({error: err});
}
```

### Code Organization Principles

1. **Separation of Concerns**
   - Routes only handle routing
   - Controllers handle business logic
   - Models handle data access

2. **Single Responsibility**
   - Each function does one thing
   - Keep functions small and focused

3. **DRY (Don't Repeat Yourself)**
   - Extract common logic into functions
   - Reuse validation functions

4. **Error Handling First**
   - Validate input early
   - Handle errors before success cases

### Comments and Documentation

```javascript
/**
 * Creates a new book in the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const insert = (req, res) => {
  // Validate input
  if (!validateBookAuthorForPost(req.body)) {
    return res.status(400).send({error: 'Validation failed'});
  }
  // ...
}
```

---

## Testing Guide

### Test Structure

**Location:** `server/tests/test-apis.js`

**Framework:** Mocha + Chai + Chai-HTTP

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run with verbose output:**
```bash
npm test -- --reporter spec
```

### Writing Tests

**Basic Test Structure:**
```javascript
describe('Feature/Endpoint Name', () => {
  beforeEach(async () => {
    // Setup: Clean database
    await BooksDB.deleteMany({});
  });

  afterEach(async () => {
    // Teardown: Clean database
    await BooksDB.deleteMany({});
  });

  it('should do something specific', async () => {
    // Arrange
    let testData = {
      title: "Test Book",
      description: "Test Description",
      authors: ["Test Author"]
    };

    // Act
    const res = await chai.request(app)
      .post('/book')
      .send(testData);

    // Assert
    res.should.have.status(201);
    res.body.should.have.property('id');
  });
});
```

### Test Categories

1. **Unit Tests:** Test individual functions (currently not implemented)
2. **Integration Tests:** Test API endpoints (current implementation)
3. **End-to-End Tests:** Test complete workflows (currently not implemented)

### Test Coverage

**Current Coverage:**
- POST /book: 10 tests
- GET /book/:id: 3 tests
- GET /getAllBooks: 1 test
- DELETE /book/:id: 3 tests
- DELETE /deleteAllBooks: 1 test
- PATCH /book/:id: 10 tests
- SEARCH /getBooksByAuthors: 9 tests
- SEARCH /getAllBooksByTitle: 7 tests
- Invalid operations: 2 tests

**Total:** 50+ tests

### Adding New Tests

1. **Open** `server/tests/test-apis.js`
2. **Add** new describe block or it statement
3. **Follow** existing patterns
4. **Run** tests to verify: `npm test`

**Example - Adding a new test:**
```javascript
describe('/POST book', () => {
  // Existing tests...

  it('should not POST a book with numeric title', async () => {
    let book = {
      title: 12345,
      description: "Valid description",
      authors: ["Valid Author"]
    };

    const res = await chai.request(app)
      .post('/book')
      .send(book);

    res.should.have.status(400);
    res.body.should.have.property('error');
  });
});
```

---

## Debugging

### Console Logging

**Quick debugging:**
```javascript
console.log('Variable value:', variableName);
console.log('Request body:', req.body);
```

**Better approach - Use Winston logger:**
```javascript
import { logger } from "../config/logConfig.js";

logger.info('Info message');
logger.error('Error message');
logger.verbose('Detailed message');  // Only in development
```

### VS Code Debugging

**Create `.vscode/launch.json`:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug App",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/app.js"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
      "args": [
        "${workspaceFolder}/server/tests/test-apis.js",
        "--timeout",
        "10000"
      ]
    }
  ]
}
```

**Usage:**
1. Set breakpoints by clicking left of line numbers
2. Press F5 to start debugging
3. Use debug toolbar to step through code

### Debugging Database Issues

**Connect to MongoDB shell:**
```bash
mongo
```

**View databases:**
```javascript
show dbs
```

**Use bookshop database:**
```javascript
use bookshop
```

**View collections:**
```javascript
show collections
```

**View all books:**
```javascript
db.booksdbs.find().pretty()
```

**Count books:**
```javascript
db.booksdbs.count()
```

**Delete all books:**
```javascript
db.booksdbs.deleteMany({})
```

### Log Analysis

**View recent logs:**
```bash
# macOS/Linux
tail -f Book-Collection-Server-Logs/$(date +%d-%m-%Y).log

# Windows
type Book-Collection-Server-Logs\02-11-2024.log
```

**Search logs for errors:**
```bash
# macOS/Linux
grep "error" Book-Collection-Server-Logs/*.log

# Windows
findstr "error" Book-Collection-Server-Logs\*.log
```

---

## Common Development Tasks

### Task 1: Adding a New Field to Book Schema

**Scenario:** Add a `publishYear` field to books.

**Steps:**

1. **Update Schema** (`server/model/bookSchema.js`):
```javascript
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
  },
  publishYear: {      // NEW FIELD
    type: Number,
    required: false,
    min: 1000,
    max: 9999
  }
});
```

2. **Update Validation** (`server/controller/operations.js`):
```javascript
const validateBookAuthorForPost = (book) => {
  if (!book.title || book.title.length === 0 ||
    !book.description || book.description.length === 0 ||
    !book.authors || typeof book.authors === "number" ||
    book.authors.length === 0 || book.authors.includes("")) {
    logger.error(`Input validation failed - incorrect or missing input`)
    return false;
  }
  // Validate publishYear if provided
  if (book.publishYear !== undefined &&
      (typeof book.publishYear !== 'number' ||
       book.publishYear < 1000 ||
       book.publishYear > 9999)) {
    logger.error(`Invalid publish year`);
    return false;
  }
  return true;
}
```

3. **Add Tests** (`server/tests/test-apis.js`):
```javascript
it('should POST a book with valid publishYear', async () => {
  let book = {
    title: "Test Book",
    description: "Test Description",
    authors: ["Test Author"],
    publishYear: 2024
  };
  const res = await chai.request(app)
    .post('/book')
    .send(book);
  res.should.have.status(201);
});

it('should not POST a book with invalid publishYear', async () => {
  let book = {
    title: "Test Book",
    description: "Test Description",
    authors: ["Test Author"],
    publishYear: 999  // Invalid
  };
  const res = await chai.request(app)
    .post('/book')
    .send(book);
  res.should.have.status(400);
});
```

4. **Test Changes:**
```bash
npm test
```

5. **Update Documentation:**
- Update API_DOCUMENTATION.md
- Update TECHNICAL_SPECIFICATION.md

---

### Task 2: Adding a New Endpoint

**Scenario:** Add endpoint to get books by publish year.

**Steps:**

1. **Add Route** (`server/router/routes.js`):
```javascript
app.get("/books/year/:year", [
  bookshop.getBooksByYear
]);
```

2. **Add Controller Function** (`server/controller/operations.js`):
```javascript
export const getBooksByYear = async (req, res) => {
  let year = parseInt(req.params.year);

  if (isNaN(year) || year < 1000 || year > 9999) {
    logger.error(`Invalid year: ${req.params.year}`);
    return res.status(400).send({error: 'Invalid year'});
  }

  try {
    let books = await BooksDB.find({ publishYear: year });

    if (books.length === 0) {
      logger.info(`No books found for year ${year}`);
      return res.status(404).send({
        error: `No books found for year ${year}`
      });
    }

    logger.info(`${books.length} books found for year ${year}`);
    return res.status(200).send(books);
  } catch (err) {
    logger.error(`Error getting books by year: ${err}`);
    return res.status(500).send({error: err});
  }
}
```

3. **Add Tests** (`server/tests/test-apis.js`):
```javascript
describe('/GET books by year', () => {
  it('should GET books published in a specific year', async () => {
    let book = {
      title: "2024 Book",
      description: "Published in 2024",
      authors: ["Test Author"],
      publishYear: 2024
    };
    await new BooksDB(book).save();

    const res = await chai.request(app)
      .get('/books/year/2024');

    res.should.have.status(200);
    res.body.should.be.a('array');
    res.body.length.should.be.eql(1);
  });

  it('should return 404 if no books found for year', async () => {
    const res = await chai.request(app)
      .get('/books/year/2023');

    res.should.have.status(404);
  });
});
```

4. **Test:**
```bash
npm test
npm run live
curl http://127.0.0.1:3000/books/year/2024
```

---

### Task 3: Adding Input Sanitization

**Scenario:** Prevent NoSQL injection attacks.

**Steps:**

1. **Install Package:**
```bash
npm install express-mongo-sanitize
```

2. **Update app.js:**
```javascript
import mongoSanitize from 'express-mongo-sanitize';

// After json() middleware
app.use(json());
app.use(mongoSanitize());  // Add this
```

3. **Test:**
```bash
# Try injection attack
curl -X POST http://127.0.0.1:3000/book \
  -H "Content-Type: application/json" \
  -d '{
    "title": {"$gt": ""},
    "description": "Test",
    "authors": ["Test"]
  }'

# Should return validation error instead of processing
```

---

### Task 4: Adding Request Validation Middleware

**Scenario:** Centralize input validation.

**Steps:**

1. **Install Package:**
```bash
npm install express-validator
```

2. **Create Validation Middleware** (`server/middleware/validators.js`):
```javascript
import { body, validationResult } from 'express-validator';

export const bookValidationRules = () => {
  return [
    body('title')
      .notEmpty().withMessage('Title is required')
      .isString().withMessage('Title must be a string'),
    body('description')
      .notEmpty().withMessage('Description is required')
      .isString().withMessage('Description must be a string'),
    body('authors')
      .isArray({ min: 1 }).withMessage('Authors must be a non-empty array')
      .custom((value) => {
        if (value.some(author => author === '')) {
          throw new Error('Authors cannot contain empty strings');
        }
        return true;
      })
  ];
};

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg
    });
  }
  next();
};
```

3. **Update Routes:**
```javascript
import { bookValidationRules, validate } from '../middleware/validators.js';

app.post("/book",
  bookValidationRules(),
  validate,
  [bookshop.insert]
);
```

4. **Simplify Controller:**
```javascript
// Remove manual validation from insert function
export const insert = (req, res) => {
  // Validation is now handled by middleware
  let newBook = new BooksDB(req.body);
  return newBook.save()
    // ...
};
```

---

## Contributing Guidelines

### Branching Strategy

**Main Branches:**
- `main` - Production-ready code
- `develop` - Development branch

**Feature Branches:**
```bash
git checkout -b feature/add-publish-year
git checkout -b fix/validation-bug
git checkout -b docs/update-api-docs
```

### Commit Messages

**Format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat: add publish year field to book schema

- Add publishYear field to bookSchema
- Update validation logic
- Add tests for new field

Closes #123
```

```
fix: prevent empty string in authors array

- Add validation for empty strings in authors
- Update error message
- Add test case

Fixes #456
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make Changes and Commit**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

4. **Push Branch**
   ```bash
   git push origin feature/your-feature
   ```

5. **Create Pull Request**
   - Describe changes
   - Reference related issues
   - Ensure tests pass
   - Request review

6. **Address Review Comments**
   - Make requested changes
   - Push updates
   - Re-request review

7. **Merge**
   - Once approved, merge to develop
   - Delete feature branch

---

## Troubleshooting Development Issues

### Issue: "Cannot find module"

**Error:**
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
```

**Solutions:**
1. Ensure file extension is included: `.js`
2. Check import path is correct
3. Run `npm install` to install dependencies

---

### Issue: "Port 3000 already in use"

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

**Find and kill process (macOS/Linux):**
```bash
lsof -i :3000
kill -9 <PID>
```

**Find and kill process (Windows):**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Change port:**
Edit `server/config/env.js`:
```javascript
export const httpPort = 3001;
```

---

### Issue: MongoDB connection fails

**Error:**
```
Error connecting to the database
```

**Solutions:**
1. Ensure MongoDB is running
2. Check MongoDB is listening on port 27017
3. Verify database URL in `env.js`
4. Check MongoDB logs

---

### Issue: Tests failing

**Common causes:**
1. MongoDB not running
2. Previous test run didn't clean up
3. Port conflict
4. Timeout (increase in package.json)

**Solutions:**
```bash
# Clean database manually
mongo
use bookshop
db.booksdbs.deleteMany({})
exit

# Run tests again
npm test
```

---

### Issue: Nodemon not restarting

**Solutions:**
1. Kill nodemon process
2. Restart: `npm run live`
3. Check file is being saved
4. Clear console: `Ctrl + L`

---

## Build and Deployment

### Production Build Checklist

- [ ] All tests passing: `npm test`
- [ ] No console.log statements (use logger)
- [ ] Environment variables configured
- [ ] Security middleware added
- [ ] Error handling comprehensive
- [ ] Documentation updated
- [ ] Dependencies updated
- [ ] Database indexes created
- [ ] Log rotation configured
- [ ] Monitoring set up

### Deployment Steps

1. **Prepare Environment**
   ```bash
   npm install --production
   ```

2. **Configure Environment Variables**
   - Set up `.env` file
   - Configure database URL
   - Set up port

3. **Start with Process Manager**
   ```bash
   npm install -g pm2
   pm2 start app.js --name books-api
   pm2 save
   pm2 startup
   ```

4. **Configure Reverse Proxy (Nginx)**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

5. **Monitor Application**
   ```bash
   pm2 logs books-api
   pm2 monit
   ```

### Docker Deployment (Optional)

**Create Dockerfile:**
```dockerfile
FROM node:17

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
```

**Create docker-compose.yml:**
```yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mongo
    environment:
      - MONGODB_URL=mongodb://mongo:27017/bookshop

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

**Deploy:**
```bash
docker-compose up -d
```

---

## Additional Resources

### Useful Links

- **Node.js Documentation:** https://nodejs.org/docs/
- **Express.js Guide:** https://expressjs.com/
- **Mongoose Documentation:** https://mongoosejs.com/docs/
- **MongoDB Manual:** https://docs.mongodb.com/manual/
- **Mocha Documentation:** https://mochajs.org/
- **Chai Assertion Library:** https://www.chaijs.com/

### Learning Resources

- **Node.js Best Practices:** https://github.com/goldbergyoni/nodebestpractices
- **Express.js Best Practices:** https://expressjs.com/en/advanced/best-practice-performance.html
- **MongoDB University:** https://university.mongodb.com/

---

## Getting Help

### Internal Documentation
- `API_DOCUMENTATION.md` - API reference
- `TECHNICAL_SPECIFICATION.md` - Architecture details
- `USER_GUIDE.md` - End-user guide

### Community Support
- Stack Overflow
- MongoDB Community Forums
- Node.js Discord

---

**Happy Coding! 🚀**

For questions or issues, please open an issue in the project repository.
