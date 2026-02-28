# Books Collection App - User Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Starting the Application](#starting-the-application)
6. [Using the API](#using-the-api)
7. [Common Workflows](#common-workflows)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)
10. [FAQs](#faqs)

---

## Introduction

The Books Collection App is a RESTful API application that allows you to manage a digital library of books. You can add books, view your collection, search for specific books, update book information, and remove books from your collection.

### What Can You Do?
- Add new books with title, description, and author(s)
- View all books in your collection
- Search for books by author name(s)
- Search for books by title keywords
- Update book information
- Delete individual books or your entire collection

---

## Getting Started

### Prerequisites

Before you can use the Books Collection App, ensure you have the following installed on your computer:

#### 1. Node.js
- **Version:** 17.1.0 or higher recommended
- **Download:** https://nodejs.org/
- **Verify installation:** Open a terminal/command prompt and run:
  ```bash
  node --version
  ```

#### 2. MongoDB
- **Version:** 5.0.3 or higher recommended
- **Download:** https://www.mongodb.com/

**MongoDB Setup Instructions:**

**For Windows:**
1. Download and install MongoDB from the official website
2. Navigate to your MongoDB installation directory (e.g., `C:\Program Files\MongoDB\Server\5.0\bin`)
3. Open a terminal in that directory
4. Run: `mongod.exe`
5. Keep this terminal window open while using the application

**For macOS:**
1. Install using Homebrew: `brew install mongodb-community`
2. Start MongoDB: `brew services start mongodb-community`
3. Or run manually: `mongod --config /usr/local/etc/mongod.conf`

For detailed instructions, visit: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x

#### 3. Internet Connection
An active internet connection is required for initial setup to download dependencies.

---

## Installation

### Step 1: Get the Application Code
Obtain the Books Collection App source code (via download or git clone).

### Step 2: Navigate to Project Directory
Open a terminal/command prompt and navigate to the project folder:
```bash
cd path/to/books-collection-app
```

### Step 3: Install Dependencies
Run the following command to install all required packages:
```bash
npm install
```

This will download and install all necessary dependencies. Wait for the process to complete.

---

## Starting the Application

### Step 1: Start MongoDB
Before starting the application, ensure MongoDB is running (see [Prerequisites](#prerequisites) section).

### Step 2: Start the Application
In your project directory, run:
```bash
npm start
```

You should see output similar to:
```
2024-11-02 10:30:15 info: Successfully connected to the database
2024-11-02 10:30:15 info: MongoDB URL: mongodb://127.0.0.1/bookshop
2024-11-02 10:30:15 info: Starting the books collection app server at 127.0.0.1:3000
```

The application is now running at: **http://127.0.0.1:3000**

### Step 3: Verify the Application is Running
You can verify the server is running by trying to access a valid endpoint.

### Stopping the Application
To stop the application, press `Ctrl + C` in the terminal where the application is running.

---

## Using the API

The Books Collection App is a RESTful API, which means you interact with it by sending HTTP requests. You can use various tools to send these requests:

### Tools You Can Use

#### 1. cURL (Command Line)
Built into most operating systems. Great for quick tests and scripting.

#### 2. Postman
A popular GUI application for testing APIs.
- Download: https://www.postman.com/
- User-friendly interface
- Save and organize requests

#### 3. Thunder Client (VS Code Extension)
If you use VS Code, this extension provides API testing within your editor.

#### 4. HTTPie
A user-friendly command-line HTTP client.
- Download: https://httpie.io/
- Simpler syntax than cURL

#### 5. Programming Languages
You can also interact with the API using JavaScript, Python, Java, or any language that supports HTTP requests.

---

## Common Workflows

### Workflow 1: Adding Your First Book

**Goal:** Add "The Great Gatsby" to your collection.

**Using cURL:**
```bash
curl -X POST http://127.0.0.1:3000/book \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "description": "A classic American novel set in the Jazz Age",
    "authors": ["F. Scott Fitzgerald"]
  }'
```

**Expected Response:**
```json
{
  "id": "6196acc6bb5be6e07d85a468"
}
```

**Using Postman:**
1. Create a new request
2. Set method to `POST`
3. Enter URL: `http://127.0.0.1:3000/book`
4. Go to "Headers" tab, add:
   - Key: `Content-Type`
   - Value: `application/json`
5. Go to "Body" tab, select "raw" and paste:
```json
{
  "title": "The Great Gatsby",
  "description": "A classic American novel set in the Jazz Age",
  "authors": ["F. Scott Fitzgerald"]
}
```
6. Click "Send"

**Note:** Save the returned `id` - you'll need it to access this specific book later!

---

### Workflow 2: Viewing All Your Books

**Goal:** See all books in your collection.

**Using cURL:**
```bash
curl -X GET http://127.0.0.1:3000/getAllBooks
```

**Expected Response:**
```json
[
  {
    "_id": "6196acc6bb5be6e07d85a468",
    "title": "The Great Gatsby",
    "description": "A classic American novel set in the Jazz Age",
    "authors": ["F. Scott Fitzgerald"],
    "__v": 0
  }
]
```

**Using Postman:**
1. Create a new request
2. Set method to `GET`
3. Enter URL: `http://127.0.0.1:3000/getAllBooks`
4. Click "Send"

---

### Workflow 3: Finding a Specific Book by ID

**Goal:** View details of a specific book using its ID.

**Using cURL:**
```bash
curl -X GET http://127.0.0.1:3000/book/6196acc6bb5be6e07d85a468
```

**Expected Response:**
```json
{
  "_id": "6196acc6bb5be6e07d85a468",
  "title": "The Great Gatsby",
  "description": "A classic American novel set in the Jazz Age",
  "authors": ["F. Scott Fitzgerald"]
}
```

**Using Postman:**
1. Create a new request
2. Set method to `GET`
3. Enter URL: `http://127.0.0.1:3000/book/YOUR_BOOK_ID_HERE`
4. Replace `YOUR_BOOK_ID_HERE` with the actual book ID
5. Click "Send"

---

### Workflow 4: Searching for Books by Author

**Goal:** Find all books by a specific author or set of authors.

**Using cURL:**
```bash
curl -X SEARCH http://127.0.0.1:3000/getBooksByAuthors \
  -H "Content-Type: application/json" \
  -d '{
    "authors": ["F. Scott Fitzgerald"]
  }'
```

**Expected Response:**
```json
[
  {
    "_id": "6196acc6bb5be6e07d85a468",
    "title": "The Great Gatsby",
    "description": "A classic American novel set in the Jazz Age",
    "authors": ["F. Scott Fitzgerald"],
    "__v": 0
  }
]
```

**Search Multiple Authors:**
```bash
curl -X SEARCH http://127.0.0.1:3000/getBooksByAuthors \
  -H "Content-Type: application/json" \
  -d '{
    "authors": ["F. Scott Fitzgerald", "Ernest Hemingway"]
  }'
```

**Note:** This will return books that have ANY of the specified authors.

---

### Workflow 5: Searching for Books by Title

**Goal:** Find books whose titles contain a specific word.

**Using cURL:**
```bash
curl -X SEARCH http://127.0.0.1:3000/getAllBooksByTitle \
  -H "Content-Type: application/json" \
  -d '{
    "searchWord": "Great"
  }'
```

**Expected Response:**
```json
[
  {
    "_id": "6196acc6bb5be6e07d85a468",
    "title": "The Great Gatsby",
    "description": "A classic American novel set in the Jazz Age",
    "authors": ["F. Scott Fitzgerald"],
    "__v": 0
  }
]
```

**Using Postman:**
1. Create a new request
2. Set method to `SEARCH`
3. Enter URL: `http://127.0.0.1:3000/getAllBooksByTitle`
4. Go to "Headers" tab, add:
   - Key: `Content-Type`
   - Value: `application/json`
5. Go to "Body" tab, select "raw" and paste:
```json
{
  "searchWord": "Great"
}
```
6. Click "Send"

**Note:** The search is case-insensitive, so "great", "Great", or "GREAT" will all work.

---

### Workflow 6: Updating a Book

**Goal:** Update information for an existing book.

**Scenario:** You want to update the description of "The Great Gatsby".

**Using cURL:**
```bash
curl -X PATCH http://127.0.0.1:3000/book/6196acc6bb5be6e07d85a468 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "A 1925 novel by F. Scott Fitzgerald set in the Jazz Age that critiques the American Dream"
  }'
```

**Expected Response:**
- Status: `204 No Content` (empty response means success)

**You can update any combination of fields:**
```bash
curl -X PATCH http://127.0.0.1:3000/book/6196acc6bb5be6e07d85a468 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby - Special Edition",
    "description": "A 1925 novel by F. Scott Fitzgerald",
    "authors": ["F. Scott Fitzgerald", "Editor Name"]
  }'
```

**Using Postman:**
1. Create a new request
2. Set method to `PATCH`
3. Enter URL: `http://127.0.0.1:3000/book/YOUR_BOOK_ID_HERE`
4. Go to "Headers" tab, add:
   - Key: `Content-Type`
   - Value: `application/json`
5. Go to "Body" tab, select "raw" and paste the fields you want to update
6. Click "Send"

---

### Workflow 7: Deleting a Book

**Goal:** Remove a specific book from your collection.

**WARNING:** This action cannot be undone!

**Using cURL:**
```bash
curl -X DELETE http://127.0.0.1:3000/book/6196acc6bb5be6e07d85a468
```

**Expected Response:**
- Status: `204 No Content` (empty response means success)

**Using Postman:**
1. Create a new request
2. Set method to `DELETE`
3. Enter URL: `http://127.0.0.1:3000/book/YOUR_BOOK_ID_HERE`
4. Click "Send"

---

### Workflow 8: Building a Complete Library

**Goal:** Add multiple books to create a collection.

**Step 1:** Add first book
```bash
curl -X POST http://127.0.0.1:3000/book \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1984",
    "description": "A dystopian social science fiction novel",
    "authors": ["George Orwell"]
  }'
```

**Step 2:** Add second book
```bash
curl -X POST http://127.0.0.1:3000/book \
  -H "Content-Type: application/json" \
  -d '{
    "title": "To Kill a Mockingbird",
    "description": "A novel about racial injustice in the American South",
    "authors": ["Harper Lee"]
  }'
```

**Step 3:** Add book with multiple authors
```bash
curl -X POST http://127.0.0.1:3000/book \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Good Omens",
    "description": "A comedy about the apocalypse",
    "authors": ["Neil Gaiman", "Terry Pratchett"]
  }'
```

**Step 4:** View your complete collection
```bash
curl -X GET http://127.0.0.1:3000/getAllBooks
```

---

## Troubleshooting

### Problem: "Cannot connect to MongoDB"

**Symptoms:**
```
Error connecting to the database
Retrying in 10 seconds, tried 1 times
```

**Solutions:**
1. Ensure MongoDB is running
   - Windows: Open terminal in MongoDB bin directory and run `mongod.exe`
   - macOS: Run `brew services start mongodb-community`
2. Check if another application is using port 27017
3. Verify MongoDB installation

---

### Problem: "Port 3000 is already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
1. Another instance of the application might be running - close it
2. Another application is using port 3000
   - Find and stop the application using port 3000
   - Or modify `server/config/env.js` to use a different port

---

### Problem: "Input validation failed"

**Symptoms:**
```json
{
  "error": "Input validation failed - incorrect or missing input"
}
```

**Causes and Solutions:**

1. **Missing required fields**
   - Ensure you include `title`, `description`, and `authors`

2. **Authors is not an array**
   ```json
   // Wrong:
   "authors": "F. Scott Fitzgerald"

   // Correct:
   "authors": ["F. Scott Fitzgerald"]
   ```

3. **Empty strings**
   ```json
   // Wrong:
   "title": ""

   // Correct:
   "title": "The Great Gatsby"
   ```

4. **Empty array**
   ```json
   // Wrong:
   "authors": []

   // Correct:
   "authors": ["F. Scott Fitzgerald"]
   ```

---

### Problem: "Book not found"

**Symptoms:**
```json
{
  "error": "Book with id 6196acc6bb5be6e07d85a468 not found"
}
```

**Solutions:**
1. Verify the book ID is correct
2. The book might have been deleted
3. Get all books to see available IDs: `GET /getAllBooks`

---

### Problem: "No book found" when searching

**Symptoms:**
```json
{
  "error": "No book found with title containing the word 'searchterm'"
}
```

**Solutions:**
1. Check spelling of search term
2. Ensure books with that term exist
3. For author search, author names must match exactly (case-sensitive)
4. For title search, the search uses word matching (not substring)

---

### Problem: "Method not implemented"

**Symptoms:**
```json
{
  "error": "GET method is not implemented for path /getBooksByAuthors"
}
```

**Solution:**
- You're using the wrong HTTP method
- `/getBooksByAuthors` requires `SEARCH` method, not `GET`
- `/getAllBooksByTitle` requires `SEARCH` method, not `GET`

---

## Best Practices

### 1. Save Book IDs
When you create a book, save the returned ID in a safe place. You'll need it for updates and deletions.

### 2. Use Descriptive Information
- Write clear, descriptive titles
- Include comprehensive descriptions
- Use full author names

### 3. Consistent Author Naming
Use consistent naming for authors:
- "F. Scott Fitzgerald" vs "Fitzgerald, F. Scott"
- Choose one format and stick with it

### 4. Regular Backups
Since this is a local application, consider periodically backing up your MongoDB data.

### 5. Test Before Deleting
Before using `DELETE /deleteAllBooks`, make sure you really want to delete everything!

### 6. Validate Input Before Sending
Double-check your JSON formatting and required fields before sending requests.

### 7. Monitor Log Files
Check the `Book-Collection-Server-Logs` directory for detailed operation logs if something goes wrong.

---

## FAQs

### Q1: Can I access the API from a different computer?

**A:** The default configuration only allows local access (127.0.0.1). To allow remote access, you would need to modify the server configuration and ensure proper security measures.

---

### Q2: Is there a limit to how many books I can add?

**A:** There's no hard limit in the application. The limit would be determined by your available disk space and MongoDB configuration.

---

### Q3: Can I add a book without a description?

**A:** No, all three fields (title, description, authors) are required for every book.

---

### Q4: Can I search for books by description?

**A:** Currently, the API only supports searching by title keywords and author names. Description search is not implemented.

---

### Q5: Is my data secure?

**A:** This application doesn't include authentication or encryption. It's designed for local, personal use. Don't store sensitive information or expose it to the internet without adding proper security measures.

---

### Q6: Can I export my book collection?

**A:** You can use the `GET /getAllBooks` endpoint to retrieve all books in JSON format, which you can then save to a file.

Example:
```bash
curl -X GET http://127.0.0.1:3000/getAllBooks > my-books.json
```

---

### Q7: What happens if I add the same book twice?

**A:** The application will create two separate entries with different IDs. There's no duplicate detection.

---

### Q8: Can I undo a delete operation?

**A:** No, delete operations are permanent. Make sure you really want to delete before confirming.

---

### Q9: Why do I see `__v` in the response?

**A:** This is a Mongoose version key used internally. You can safely ignore it.

---

### Q10: Can I update just the title without changing the description?

**A:** Yes! The PATCH operation allows partial updates. You only need to include the fields you want to change.

---

## Additional Resources

- **API Documentation:** See `API_DOCUMENTATION.md` for complete API reference
- **Technical Specification:** See `TECHNICAL_SPECIFICATION.md` for architecture details
- **Developer Guide:** See `DEVELOPER_GUIDE.md` for development setup

---

## Getting Help

If you encounter issues not covered in this guide:

1. Check the log files in `Book-Collection-Server-Logs` directory
2. Review the error message carefully
3. Verify all prerequisites are properly installed
4. Ensure MongoDB is running
5. Refer to the API Documentation for correct request formats

---

## Conclusion

Congratulations! You now have a complete understanding of how to use the Books Collection App. Start building your digital library today!

Remember:
- Always keep MongoDB running when using the application
- Save book IDs for future reference
- Check the logs if something goes wrong
- Use the right HTTP methods for each endpoint

Happy reading!
