# Books Collection API Documentation

## Overview
The Books Collection API is a RESTful service built with Node.js and Express.js that provides comprehensive book management functionality. The API allows you to create, read, update, delete, and search books in a MongoDB database.

**Base URL:** `http://127.0.0.1:3000`

**API Version:** 1.0.0

**Content Type:** `application/json`

---

## Table of Contents
1. [Authentication](#authentication)
2. [Error Handling](#error-handling)
3. [API Endpoints](#api-endpoints)
   - [Create Book](#1-create-book)
   - [Get Book by ID](#2-get-book-by-id)
   - [Get All Books](#3-get-all-books)
   - [Update Book](#4-update-book)
   - [Delete Book by ID](#5-delete-book-by-id)
   - [Delete All Books](#6-delete-all-books)
   - [Search Books by Authors](#7-search-books-by-authors)
   - [Search Books by Title](#8-search-books-by-title)
4. [Data Models](#data-models)
5. [Status Codes](#status-codes)

---

## Authentication
Currently, the API does not require authentication. All endpoints are publicly accessible.

---

## Error Handling

### Error Response Format
All error responses follow a consistent format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Error Scenarios
- **400 Bad Request**: Invalid input data or validation failure
- **404 Not Found**: Requested resource does not exist
- **500 Internal Server Error**: Database or server error
- **501 Not Implemented**: Invalid HTTP method for the endpoint

---

## API Endpoints

### 1. Create Book

Creates a new book in the collection.

**Endpoint:** `POST /book`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "The Great Gatsby",
  "description": "A novel set in the summer of 1922 on Long Island, New York",
  "authors": ["F. Scott Fitzgerald"]
}
```

**Field Requirements:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | String | Yes | Non-empty string |
| description | String | Yes | Non-empty string |
| authors | Array[String] | Yes | Non-empty array, no empty strings |

**Success Response:**
- **Status Code:** `201 Created`
- **Response Body:**
```json
{
  "id": "6196acc6bb5be6e07d85a468"
}
```

**Error Responses:**

*Missing or Invalid Input (400):*
```json
{
  "error": "Input validation failed - incorrect or missing input"
}
```

*Server Error (500):*
```json
{
  "error": "Database error details"
}
```

**Example cURL:**
```bash
curl -X POST http://127.0.0.1:3000/book \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "description": "A novel set in the summer of 1922 on Long Island, New York",
    "authors": ["F. Scott Fitzgerald"]
  }'
```

**Notes:**
- Additional fields in the request body are ignored
- Authors must be provided as an array, even for a single author
- Empty strings in the authors array will cause validation to fail

---

### 2. Get Book by ID

Retrieves a specific book by its unique identifier.

**Endpoint:** `GET /book/:bookId`

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| bookId | String | MongoDB ObjectId of the book |

**Success Response:**
- **Status Code:** `200 OK`
- **Response Body:**
```json
{
  "_id": "6196acc6bb5be6e07d85a468",
  "title": "The Great Gatsby",
  "description": "A novel set in the summer of 1922 on Long Island, New York",
  "authors": ["F. Scott Fitzgerald"]
}
```

**Error Responses:**

*Book Not Found (404):*
```json
{
  "error": "Book with id 6196acc6bb5be6e07d85a468 not found"
}
```

*Invalid Book ID Format (500):*
```json
{
  "error": "Cast to ObjectId failed for value..."
}
```

**Example cURL:**
```bash
curl -X GET http://127.0.0.1:3000/book/6196acc6bb5be6e07d85a468
```

**Notes:**
- The `__v` field (Mongoose version key) is removed from the response
- BookId must be a valid MongoDB ObjectId (24-character hexadecimal string)

---

### 3. Get All Books

Retrieves all books in the collection.

**Endpoint:** `GET /getAllBooks`

**Success Response:**
- **Status Code:** `200 OK`
- **Response Body:**
```json
[
  {
    "_id": "6196acc6bb5be6e07d85a468",
    "title": "The Great Gatsby",
    "description": "A novel set in the summer of 1922 on Long Island, New York",
    "authors": ["F. Scott Fitzgerald"],
    "__v": 0
  },
  {
    "_id": "6196acc6bb5be6e07d85a469",
    "title": "1984",
    "description": "A dystopian social science fiction novel",
    "authors": ["George Orwell"],
    "__v": 0
  }
]
```

**Error Responses:**

*Server Error (500):*
```json
{
  "error": "Database error details"
}
```

**Example cURL:**
```bash
curl -X GET http://127.0.0.1:3000/getAllBooks
```

**Notes:**
- Returns an empty array `[]` if no books exist
- The `__v` field is included in this response (unlike single book retrieval)
- Results are not paginated in the current implementation

---

### 4. Update Book

Updates an existing book's information. This is a partial update operation.

**Endpoint:** `PATCH /book/:bookId`

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| bookId | String | MongoDB ObjectId of the book |

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "The Great Gatsby - Revised Edition",
  "description": "An updated description",
  "authors": ["F. Scott Fitzgerald", "Editor Name"]
}
```

**Field Requirements:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| title | String | No | If provided, must be non-empty |
| description | String | No | If provided, must be non-empty |
| authors | Array[String] | No | If provided, must be non-empty array with no empty strings |

**Success Response:**
- **Status Code:** `204 No Content`
- **Response Body:** Empty

**Error Responses:**

*Invalid Input (400):*
```json
{
  "error": "Patch validation failed - title (string), description (string) and authors (array) must be valid"
}
```

*Book Not Found (404):*
```json
{
  "error": "Book with id 6196acc6bb5be6e07d85a468 not found"
}
```

*Server Error (500):*
```json
{
  "error": "Database error details"
}
```

**Example cURL:**
```bash
curl -X PATCH http://127.0.0.1:3000/book/6196acc6bb5be6e07d85a468 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby - Revised Edition"
  }'
```

**Notes:**
- You can update any combination of fields (title, description, authors)
- Only the fields provided in the request body will be updated
- Additional fields in the request body are ignored
- Empty request body will result in a successful response with no changes

---

### 5. Delete Book by ID

Deletes a specific book from the collection.

**Endpoint:** `DELETE /book/:bookId`

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| bookId | String | MongoDB ObjectId of the book |

**Success Response:**
- **Status Code:** `204 No Content`
- **Response Body:** Empty

**Error Responses:**

*Book Not Found (404):*
```json
{
  "error": "Book with id 6196acc6bb5be6e07d85a468 not found"
}
```

*Invalid Book ID Format (500):*
```json
{
  "error": "Database error details"
}
```

**Example cURL:**
```bash
curl -X DELETE http://127.0.0.1:3000/book/6196acc6bb5be6e07d85a468
```

**Notes:**
- This operation is permanent and cannot be undone
- Returns 204 even if the book doesn't exist on subsequent delete attempts

---

### 6. Delete All Books

Deletes all books from the collection.

**Endpoint:** `DELETE /deleteAllBooks`

**Success Response:**
- **Status Code:** `204 No Content`
- **Response Body:** Empty

**Error Responses:**

*Server Error (500):*
```json
{
  "error": "Database error details"
}
```

**Example cURL:**
```bash
curl -X DELETE http://127.0.0.1:3000/deleteAllBooks
```

**Notes:**
- This operation is permanent and cannot be undone
- Use with extreme caution in production environments
- Returns 204 even if no books exist
- The operation is logged with the count of deleted books

---

### 7. Search Books by Authors

Searches for books that have one or more of the specified authors.

**Endpoint:** `SEARCH /getBooksByAuthors`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "authors": ["F. Scott Fitzgerald", "George Orwell"]
}
```

**Field Requirements:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| authors | Array[String] | Yes | Non-empty array |

**Success Response:**
- **Status Code:** `200 OK`
- **Response Body:**
```json
[
  {
    "_id": "6196acc6bb5be6e07d85a468",
    "title": "The Great Gatsby",
    "description": "A novel set in the summer of 1922 on Long Island, New York",
    "authors": ["F. Scott Fitzgerald"],
    "__v": 0
  },
  {
    "_id": "6196acc6bb5be6e07d85a469",
    "title": "1984",
    "description": "A dystopian social science fiction novel",
    "authors": ["George Orwell"],
    "__v": 0
  }
]
```

**Error Responses:**

*Invalid Input (400):*
```json
{
  "error": "Incorrect format or no authors specified to search"
}
```

*No Books Found (404):*
```json
{
  "error": "No book found having one or more authors in 'F. Scott Fitzgerald,George Orwell'"
}
```

*Server Error (500):*
```json
{
  "error": "Database error details"
}
```

**Example cURL:**
```bash
curl -X SEARCH http://127.0.0.1:3000/getBooksByAuthors \
  -H "Content-Type: application/json" \
  -d '{
    "authors": ["F. Scott Fitzgerald", "George Orwell"]
  }'
```

**Notes:**
- Search uses MongoDB's `$in` operator, returning books that contain ANY of the specified authors
- If a book has authors ["A", "B"] and you search for ["A"], the book will be returned
- If a book has authors ["A"] and you search for ["A", "C"], the book will be returned
- Search is case-sensitive and requires exact matches
- Empty authors array will result in a 400 error

---

### 8. Search Books by Title

Searches for books whose titles contain the specified search word.

**Endpoint:** `SEARCH /getAllBooksByTitle`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "searchWord": "Great"
}
```

**Field Requirements:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| searchWord | String | Yes | Non-empty string |

**Success Response:**
- **Status Code:** `200 OK`
- **Response Body:**
```json
[
  {
    "_id": "6196acc6bb5be6e07d85a468",
    "title": "The Great Gatsby",
    "description": "A novel set in the summer of 1922 on Long Island, New York",
    "authors": ["F. Scott Fitzgerald"],
    "__v": 0
  }
]
```

**Error Responses:**

*Invalid Input (400):*
```json
{
  "error": "Incorrect format or missing search word"
}
```

*No Books Found (404):*
```json
{
  "error": "No book found with title containing the word 'searchterm'"
}
```

*Server Error (500):*
```json
{
  "error": "Database error details"
}
```

**Example cURL:**
```bash
curl -X SEARCH http://127.0.0.1:3000/getAllBooksByTitle \
  -H "Content-Type: application/json" \
  -d '{
    "searchWord": "Great"
  }'
```

**Notes:**
- Search uses MongoDB's full-text search with a text index on the title field
- Search is **case-insensitive**
- Searches for words, not substrings (e.g., "Great" will match but "Grea" may not)
- Multiple words in searchWord will search for books containing any of those words
- The searchWord must be a string; arrays or numbers will result in a 400 error

---

## Data Models

### Book Model

The Book model represents a book in the collection.

**MongoDB Schema:**
```javascript
{
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  authors: {
    type: [String],
    required: true
  }
}
```

**Indexes:**
- Standard index on `title` field
- Text index on `title` field for full-text search

**Example Document:**
```json
{
  "_id": "6196acc6bb5be6e07d85a468",
  "title": "The Great Gatsby",
  "description": "A novel set in the summer of 1922 on Long Island, New York",
  "authors": ["F. Scott Fitzgerald"],
  "__v": 0
}
```

**Field Descriptions:**
- `_id`: Auto-generated MongoDB ObjectId (24-character hexadecimal string)
- `title`: The book's title
- `description`: A description or synopsis of the book
- `authors`: An array of author names (supports multiple authors)
- `__v`: Mongoose version key (internal use)

---

## Status Codes

The API uses standard HTTP status codes:

| Status Code | Description | When Used |
|-------------|-------------|-----------|
| 200 OK | Success | GET requests returning data, successful searches |
| 201 Created | Resource created | POST /book successful creation |
| 204 No Content | Success, no content | PATCH, DELETE operations successful |
| 400 Bad Request | Invalid input | Validation failures, malformed requests |
| 404 Not Found | Resource not found | Book not found, search returns no results |
| 500 Internal Server Error | Server error | Database errors, unexpected server issues |
| 501 Not Implemented | Method not implemented | Invalid HTTP method for endpoint |

---

## Rate Limiting

Currently, the API does not implement rate limiting. For production use, consider implementing rate limiting to prevent abuse.

---

## Logging

All API operations are logged to both:
- Console output (with colors)
- Daily rotating log files in the `Book-Collection-Server-Logs` directory

Log format: `YYYY-MM-DD HH:mm:ss [level]: message`

---

## Testing

To run the API test suite:
```bash
npm test
```

The test suite includes over 50 tests covering:
- Input validation
- CRUD operations
- Search functionality
- Error handling
- Edge cases

---

## Support and Issues

For issues or questions, please refer to the project repository or contact the development team.

---

## Changelog

### Version 1.0.0
- Initial API release
- Full CRUD operations for books
- Search by authors
- Search by title
- Comprehensive input validation
- Error handling and logging
