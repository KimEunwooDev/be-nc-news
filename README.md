# Northcoders News API

Northcoders News API is a news aggregator using NC news database.
This repository is the Backend of a NC-news application where users can post and read articles, post comment, vote on articles or comments.

Hosted version of this API can be found at

```
https://eunwoo-nc-news.onrender.com/
```

## Prerequisites

The API has been tested with Node.js v22.2.0 and node-postgres v16.3.3. Earlier versions may work but are not officially supported.

## Cloning the repo

In order to clone this repo use the following:

```bash
$ git clone https://github.com/KimEunwooDev/be-nc-news
```

If you would like to make changes to this repo yourself, fork the repo then clone it.

## Installisation

After cloning the project, open the terminal and navigate to project root directory.

This repository uses npm, jest, dotenv, express, fs, and pg. You should install dependencies using the following command:

```bash
$ npm i # install dependencies
```

## Devlopment Environment Variables Setup

To successfully connect two databases locally, developers will need to create two environment files .env.development and env.test. These files should contain the necessary environment variables to connect to the development and test databases respectively.

1. Create two new files within the root directory named: `.env.development` and `.env.test`

2. Within the `.env.development` file add the following code:

```javascript
PGDATABASE = <database_name_here>;
```

3. Within the `.env.test` file add the following code:

```javascript
PGDATABASE = <database_name_here>;
```

## Seed databases

```bash
$ npm run setup-dbs # create database

$ npm run seed # seed database for development

$ npm test # seed database for test and test them

$ npm run seed-pod # seed database for porduction. Production database must be hosted before seeding.
```

## Testing

Existing tests can be run by using following command :

```bash
$ npm test
```
