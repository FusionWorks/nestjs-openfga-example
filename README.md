# NestJS Auth0 OpenFGA Demo

Welcome to the **NestJS Auth0 OpenFGA Demo** project! This project showcases how to integrate **Auth0** for authentication and **OpenFGA** for permissions management within a **NestJS** application. By following this demo, you'll learn how to build a secure and scalable API with robust fine-grained access control.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [Testing](#testing)
10. [Project Structure](#project-structure)
11. [Authorization Model](#authorization-model)
12. [Contributing](#contributing)
13. [License](#license)

---

## Introduction

In modern web applications, managing user authentication and authorization is crucial for ensuring security and providing appropriate access to resources. This demo project illustrates how to seamlessly integrate **Auth0** for handling user authentication and **OpenFGA** for managing fine-grained permissions within a **NestJS** framework.

**Note:** This project serves as supplementary material for the [FusionWorks article](https://fusion.works/fine-grained-authorization-for-apis-with-nestjs-and-openfga/), providing practical examples and source code to enhance your understanding of fine-grained authorization in NestJS applications.

## Features

- **User Authentication**: Secure user authentication using Auth0.
- **Role-Based Access Control (RBAC)**: Define and manage user roles and permissions with OpenFGA.
- **API Documentation**: Interactive API documentation using Swagger, secured with Auth0 authentication.
- **Projects Management**: Create and manage projects with roles such as Owner, Admin, and Member.
- **Secure Endpoints**: Protect API endpoints with JWT authentication and permission guards.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Auth0**: A flexible authentication and authorization platform.
- **OpenFGA**: An open-source fine-grained authorization system.
- **MongoDB**: A NoSQL database for storing project data.
- **Swagger**: For API documentation and testing.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.

## Prerequisites

Before getting started, ensure you have the following installed on your machine:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (local or hosted instance)
- **Auth0 Account**: [Sign up here](https://auth0.com/)
- **Okta FGA Account**: [Sign up here](https://fga.dev/)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/FusionWorks/nestjs-openfga-example.git
   cd nestjs-openfga-example
   ```
nstall Dependencies

bash
Copy code
npm install
Configuration
1. Environment Variables
Create a .env file in the root directory of the project and populate it with the following variables:

env
Copy code
# Auth0 Configuration
AUTH0_DOMAIN=your-auth0-domain
AUTH0_AUDIENCE=your-auth0-audience
AUTH0_OAUTH_CLIENT_ID=your-auth0-oauth-client-id

# OpenFGA Configuration
FGA_API_URL=your-openfga-api-url
FGA_STORE_ID=your-openfga-store-id
FGA_CLIENT_ID=your-openfga-client-id
FGA_CLIENT_SECRET=your-openfga-client-secret
FGA_API_TOKEN_ISSUER=your-openfga-token-issuer
FGA_API_AUDIENCE=your-openfga-audience

# MongoDB Configuration
MONGODB_URI=your-mongodb-uri

# Application Port
PORT=3000
Replace the placeholder values with your actual configuration details:

Auth0: Obtain these from your Auth0 dashboard under your application's settings.
OpenFGA: Sign up at fga.dev and create an authorization model to get the necessary credentials.
MongoDB: Provide your MongoDB connection string.
2. Define the Authorization Model
Using fga.dev, design and host your authorization model. For this demo, the model is defined as:

plaintext
Copy code
model
  schema 1.1

  type user

  type project
    relations
      define admin: [user] or owner
      define member: [user] or admin or owner
      define owner: [user]
This model sets up the following relationships:

Owner: A user with full permissions on the project.
Admin: A user who can manage other members or be an owner.
Member: A user with standard access, who can be promoted to admin or owner.
Ensure your OpenFGA store is configured with this model.

Running the Application
1. Build the Project
bash
Copy code
npm run build
2. Start the Application
Development Mode (with hot-reloading):

bash
Copy code
npm run start:dev
Production Mode:

bash
Copy code
npm run start:prod
The application will start on the port specified in your .env file (default is 3000).

API Documentation
Interactive API documentation is available via Swagger. To access it:

Ensure the application is running.
Navigate to http://localhost:3000/api in your browser.
Authenticate using Auth0 to access and test the API endpoints.
Testing
Running Tests
The project includes end-to-end (e2e) tests using Jest and Supertest.

bash
Copy code
npm run test:e2e
Linting
Ensure code quality and consistency by running ESLint:

bash
Copy code
npm run lint
Formatting
Automatically format your code with Prettier:

bash
Copy code
npm run format
Project Structure
arduino
Copy code
nestjs-auth0-openfga/
├── src/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── jwt-auth.guard.ts
│   │   ├── jwt.strategy.ts
│   │   └── user.decorator.ts
│   ├── authorization/
│   │   ├── authorization.module.ts
│   │   ├── authorization.service.ts
│   │   ├── authorization-party.ts
│   │   ├── authorization-types.enum.ts
│   │   ├── authorization-relationships.enum.ts
│   │   ├── permissions.decorator.ts
│   │   └── permissions.guard.ts
│   ├── projects/
│   │   ├── dto/
│   │   │   ├── add-project-member.dto.ts
│   │   │   ├── create-project.dto.ts
│   │   │   ├── delete-project-member.dto.ts
│   │   │   ├── member.dto.ts
│   │   │   └── project.dto.ts
│   │   ├── schemas/
│   │   │   └── project.schema.ts
│   │   ├── projects.controller.ts
│   │   ├── projects.module.ts
│   │   └── projects.service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .eslintrc.js
├── nest-cli.json
├── package.json
├── tsconfig.build.json
└── tsconfig.json
Authorization Model
The authorization model defines the types of users and their relationships with projects. Here's a brief overview:

Types:

user: Represents the users in the system.
project: Represents the projects managed within the application.
Relations for project:

admin: A user who can manage other users or be an owner.
member: A user with standard access, who can be promoted to admin or owner.
owner: A user with full permissions on the project.
This model ensures a clear hierarchy and permission flow, allowing for scalable and maintainable authorization logic.

Contributing
Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

Fork the Repository

Create a Feature Branch

bash
Copy code
git checkout -b feature/YourFeature
Commit Your Changes

bash
Copy code
git commit -m "Add your feature"
Push to the Branch

bash
Copy code
git push origin feature/YourFeature
Open a Pull Request

License
This project is UNLICENSED. Feel free to use and modify it as you see fit.

Happy Coding! 🚀

For any questions or issues, please open an issue in the repository or contact the maintainer.

Copy code



You said:
please provide markdown code
ChatGPT

Thought for 7 seconds
markdown
Copy code
# NestJS Auth0 OpenFGA Demo

Welcome to the **NestJS Auth0 OpenFGA Demo** project! This project showcases how to integrate **Auth0** for authentication and **OpenFGA** for permissions management within a **NestJS** application. By following this demo, you'll learn how to build a secure and scalable API with robust role-based access control.

**This project was created as support material for the [FusionWorks article](https://fusion.works/fine-grained-authorization-for-apis-with-nestjs-and-openfga/). You can find the repository here: [https://github.com/FusionWorks/nestjs-openfga-example](https://github.com/FusionWorks/nestjs-openfga-example).**

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [License](#license)

---

## Introduction

In modern web applications, managing user authentication and authorization is crucial for ensuring security and providing appropriate access to resources. This demo project illustrates how to seamlessly integrate **Auth0** for handling user authentication and **OpenFGA** for managing fine-grained permissions within a **NestJS** framework.

**Note:** This project serves as supplementary material for the [FusionWorks article](https://fusion.works/fine-grained-authorization-for-apis-with-nestjs-and-openfga/), providing practical examples and source code to enhance your understanding of fine-grained authorization in NestJS applications.

## Features

- **User Authentication**: Secure user authentication using Auth0.
- **Role-Based Access Control (RBAC)**: Define and manage user roles and permissions with OpenFGA.
- **API Documentation**: Interactive API documentation using Swagger, secured with Auth0 authentication.
- **Projects Management**: Create and manage projects with roles such as Owner, Admin, and Member.
- **Secure Endpoints**: Protect API endpoints with JWT authentication and permission guards.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Auth0**: A flexible authentication and authorization platform.
- **OpenFGA**: An open-source fine-grained authorization system.
- **MongoDB**: A NoSQL database for storing project data.
- **Swagger**: For API documentation and testing.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.

## Prerequisites

Before getting started, ensure you have the following installed on your machine:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (local or hosted instance)
- **Auth0 Account**: [Sign up here](https://auth0.com/signup)
- **OpenFGA Account**: [Sign up here](https://openfga.dev/signup)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/FusionWorks/nestjs-openfga-example.git
   ```

2. **Install Dependencies**

   ```bash
   cd nestjs-openfga-example
   npm install
   ```
   
## Configuration

1. **Environment Variables**

   Create a .env file in the root directory of the project and populate it with the following variables:

   ```env
   # Auth0 Configuration
   AUTH0_DOMAIN=your-auth0-domain
   AUTH0_AUDIENCE=your-auth0-audience
   AUTH0_OAUTH_CLIENT_ID=your-auth0-oauth-client-id
   
   # OpenFGA Configuration
   FGA_API_URL=your-openfga-api-url
   FGA_STORE_ID=your-openfga-store-id
   FGA_CLIENT_ID=your-openfga-client-id
   FGA_CLIENT_SECRET=your-openfga-client-secret
   FGA_API_TOKEN_ISSUER=your-openfga-token-issuer
   FGA_API_AUDIENCE=your-openfga-audience
   
   # MongoDB Configuration
   MONGODB_URI=your-mongodb-uri
   
   # Application Port
   PORT=3000
   ```
   
   Replace the placeholder values with your actual configuration details:
   
   - Auth0: Obtain these from your Auth0 dashboard under your application's settings.
   - OpenFGA: Sign up at fga.dev and create an authorization model to get the necessary credentials.
   - MongoDB: Provide your MongoDB connection string.

2. **Define the Authorization Model**
   
   Using fga.dev, design and host your authorization model. For this demo, the model is defined as:

   ```plaintext
   model
     schema 1.1
   
     type user
   
     type project
       relations
         define admin: [user] or owner
         define member: [user] or admin
         define owner: [user]
   ```

## Running the Application

1. Start the Application

Development Mode (with hot-reloading):

```bash
npm run start:dev
```

Production Mode:

```bash
npm run start:prod
```

The application will start on the port specified in your .env file (default is 3000).

### API Documentation

Interactive API documentation is available via Swagger. To access it:

Ensure the application is running.
Navigate to http://localhost:3000/api/ in your browser.
Authenticate using Auth0 to access and test the API endpoints.
   
