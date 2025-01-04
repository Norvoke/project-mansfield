# Project Skeleton
## Project Workflow Status Badge
![workflow status](https://github.com/csci312-f24/project-mansfield/actions/workflows/node.js.yml/badge.svg)

## Project Description
MiddZillow is a student-curated online housing rating system that enables current students to share their reviews of their housing experiences. By curating and circulating housing information among students, MiddZillow provides the necessary resources for students to make more informed decisions during the housing process.

## Project Link
https://mansfield.csci312.dev

## Creation

This project skeleton has been setup similar to our assignments and practicals. It is a Next.JS application, created with create-next-app `💻 npx create-next-app@latest`, which uses Jest and Testing Library for testing, ESLint for static analysis, Prettier for styling, and is configured to use GitHub actions for testing pull requests.

Development dependencies installed with:

```
💻 npm install -D jest jest-environment-jsdom husky lint-staged prettier eslint-config-prettier @testing-library/react @testing-library/jest-dom cross-env
💻 npx install-peerdeps --dev eslint-config-airbnb
💻 npm install -D eslint-import-resolver-alias
```

Other dependencies installed with:

```
💻 npm install -S prop-types
```

### Additional tools you might need

#### Mocking fetch

Tools for mocking fetch can be installed with

```
💻 npm install -D fetch-mock-jest node-fetch@2.6.7
```

Note we need to pin the `node-fetch` version due to breaking changes when used with Jest in newer versions.

#### DB Setup

Dev DB is created and seeded using knex and seed files contained within the /data directory. Before running application in development, create and seed the DB with:

```
💻 npx knex migrate:latest
💻 npx knex seed:run
```
