# Northcoders News API

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

## Cloning the repo

In order to clone this repo use the following:

```
git clone https://github.com/KimEunwooDev/be-nc-news
```

If you would like to make changes to this repo yourself, fork the repo then clone it.

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
