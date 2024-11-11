# Running the (database) server

In order to run the database server you should have the following

- [Python](https://www.python.org/)
- Pip (probably installed with Python, check with `pip --version`)
- [Flask](https://pypi.org/project/Flask/)
- [SQLite](https://www.sqlite.org/)

Then switch to the `server` directory and run

```
cd server
npm run db-server
```

You should see the flask server running at `http://127.0.0.1:5000`

If you wanted to manually execute queries in the database, in a separate terminal run

```
cd server
sqlite3 main.db
```

Now you are able to execute normal SQL on the second terminal.
