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
