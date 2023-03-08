# Project Salus

## About

Liam Pickering's dissertation project for Swansea University.

## Setup

### ENV File

Create a `.env.local` file in the root directory of the project with the following template:

```txt
MONGODB_URI=
MONGODB_NAME=

NEXTAUTH_SECRET=
NEXTAUTH_URL=

NODE_ENV=development

PASSWORD_SALT_ROUNDS=10
```

### User Creation

Before running the application in a production environment, you should run it in development mode and login with the admin user using the following credentials:

```txt
Username: admin@salus.com
Password: admin
```

Then, on the app's navbar, click Admin -> Organisation and scroll to find User Management. Make sure to create an admin user, setting your own email and password.
Once you have created your own user, shut down the application and run it in production mode. You can then login with your own username and password.

## Running

Open a terminal and navigate to the root folder.
Run the commands:

```sh
npm i
npm run build
npm run start
```

If you wish to make changes to the app, run:

```sh
npm i
npm run dev
```

*Note: `npm i` only needs to be run once.*
