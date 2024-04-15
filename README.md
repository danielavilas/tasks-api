# Task API

Welcome to the Task API, a simple application for managing tasks with different states. This README will guide you through setting up and using the API.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)

## Requirements

To get started with the Task API, ensure you have the following:

- Docker (and Docker Compose)
- Node.js (optional for development)

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:danielavilas/tasks-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd task-api
   ```

3. Ensure Docker is installed on your system.

## Usage

To run the Task API using Docker Compose:

1. Build and start the Docker containers:

   ```bash
   docker-compose up --build
   ```

2. The API will be accessible at `http://localhost:3000`.

3. The GraphQL playground interface will be available to test it.

4. The migrations will create 10 tasks and 2 users with the same password for tests (Test123!):
   - daniel (has access to all 10 tasks)
   - avila (has access to all DONE tasks)
   - To authenticate a user and obtain an access token, use the following mutation:
```graphql
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    accessToken
  }
}
```
   - Use `Authorization: YOUR_ACCESS_TOKEN` to access queries and mutations

5. The postgres DB will be available at `5432` with user `admin` and password `admin`

## Testing

To run the tests for the Task API:

```bash
npm test
```
