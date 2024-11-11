import sqlite3
import json
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

DATABASE = 'main.db'

@app.route('/movies', methods=["POST"])
def insert_data():
    db = sqlite3.connect(DATABASE)
    cursor = db.cursor()

    res = cursor.execute("INSERT INTO movie VALUES ('Dune', 2021, 4.0)")
    db.commit()

    return res, 201

@app.route('/movies', methods=["GET"])
def get_data():
    db = sqlite3.connect(DATABASE)
    
    # This makes rows accessible by column names
    db.row_factory = sqlite3.Row  
    cursor = db.cursor()

    cursor.execute("SELECT * FROM movie")
    movies = cursor.fetchall()

    movies_list = []
    for row in movies:
        movies_list.append(dict(row))

    return jsonify(movies_list)