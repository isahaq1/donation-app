# NestJS Role-Based Permission Application

This project is a NestJS application that implements role-based permissions with user registration, authentication, and donation management features. It uses PostgreSQL as the database.

## Features

- User Registration
- User Login and Authentication
- Role-Based Access Control
- Create and List Users
- Create and List Donations

## Technologies Used

- NestJS
- TypeScript
- PostgreSQL
- JWT for Authentication

## Project Structure

```
nestjs-app
├── src
│   ├── app.module.ts
│   ├── main.ts
│   ├── auth
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── users
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── user.entity.ts
│   │   └── dto
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   ├── donations
│   │   ├── donations.controller.ts
│   │   ├── donations.module.ts
│   │   ├── donations.service.ts
│   │   └── donation.entity.ts
│   ├── common
│   │   ├── guards
│   │   │   └── roles.guard.ts
│   │   ├── decorators
│   │   │   └── roles.decorator.ts
│   │   └── interceptors
│   │       └── transform.interceptor.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── nest-cli.json
├── package.json
├── tsconfig.build.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd nestjs-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up PostgreSQL database and update the configuration in `src/app.module.ts`.

4. Run the application:
   ```
   npm run start
   ```

## API Endpoints

- **Authentication**
  - `POST /auth/register` - Register a new user
  - `POST /auth/login` - Login a user

- **Users**
  - `GET /users` - List all users
  - `POST /users` - Create a new user

- **Donations**
  - `GET /donations` - List all donations
  - `POST /donations` - Create a new donation

## Testing

Run the end-to-end tests using:
```
npm run test:e2e
```

## License

This project is licensed under the MIT License.