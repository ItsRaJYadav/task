<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod

```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```


## Project Overview
The Book Review API is a RESTful service built using NestJS and TypeORM, allowing users to register, authenticate with JWT, and manage books and reviews with a MySQL database.

## Features Released

### Authentication
- POST /signup: User registration
- POST /login: User login with JWT token generation

### Book Management
- POST /books: Add new book (Authenticated users only)
- GET /books: Get all books with pagination and optional filters (author, genre)
- GET /books/:id: Get book details with average rating and paginated reviews

### Review Management
- POST /books/:id/reviews: Submit a review (one per user per book)
- PUT /reviews/:id: Edit your review
- DELETE /reviews/:id: Delete your review

### Search
- GET /search: Search books by title or author (case-insensitive, partial match)

## Tech Stack
- NestJS with Express.js
- TypeORM with MySQL
- JWT for authentication
- Class-validator and class-transformer for validation and data transformation
- bcryptjs for password hashing

## Project Highlights
- Modular and scalable architecture with NestJS modules
- Environment variables managed via .env for configuration
- Secure authentication with JWT and Passport.js integration
- Pagination and filtering support for enhanced API usability
- Input validation using class-validator for data integrity


