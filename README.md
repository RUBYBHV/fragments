# Fragments

Fragments back-end API

## Scripts

This project includes several npm scripts to help with development:

- `npm run lint`: Runs ESLint to check for code quality and style issues.
- `npm start`: Starts the server normally (used in production).
- `npm run dev`: Starts the server in watch mode using Node's built-in `--watch` flag. The server will automatically restart when code changes are detected. Uses `.env.debug` for environment variables.
- `npm run debug`: Starts the server in watch mode and enables the Node inspector on port `9229`. This allows you to attach a debugger like VSCode to the running process. Uses `.env.debug` for environment variables.

## Running the Server

To start the server for development, run:

```sh
npm run dev
```

Then, you can check the health route:

```sh
curl http://localhost:8080
```
