# WIP

Everything here is currently being worked on.

# Installation

Make sure [git](https://git-scm.com) and [node.js](https://nodejs.org/en) are installed, and then run

```
git clone https://github.com/ahmed-el-awad/senior-project-interface
```

to have a copy of the project locally.

## Run the client (web, mobile)

From the root directory, run

```
npm install
npm run start
```

To install the dependencies and start the development server. Now press `w` in the same terminal to open the website on web.
Alternatively you can run the application on mobile through [Expo Go](https://expo.dev/go) but for now, web is preferred for debugging.

## Run the server

Install nodemon globally.

```
npm i -g nodemon
```

This will help with reflecting changes done on `server.js` without needing to stop and run the server again.

On a separate terminal, run the following commands

```
npm install
cd server
nodemon server.js
```

Now your server is running and you should see `Server is running on port 3000`.

Note that both servers (the client and server) should be running together (on separate terminals.)
