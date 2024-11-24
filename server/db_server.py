import sqlite3
import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

DATABASE = 'main.db'

@app.route('/flight_data', methods=["POST"])
def insert_data():
    db = sqlite3.connect(DATABASE)
    cursor = db.cursor()
    
    data = request.json
    cursor.execute("""
        INSERT INTO flight_data 
        (tahr_count, intruder_detections, flight_date, flight_duration)
        VALUES (?, ?, ?, ?)
    """, (
        data['tahr_count'],
        data['intruder_detections'],
        data['flight_date'],
        data['flight_duration']
    ))
    
    db.commit()
    return jsonify({"message": "Flight data added successfully"}), 201

@app.route('/flight_data', methods=["GET"])
def get_data():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    cursor = db.cursor()

    cursor.execute("SELECT * FROM flight_data ORDER BY flight_date DESC")
    flights = cursor.fetchall()

    flights_list = []
    for row in flights:
        flights_list.append(dict(row))

    return jsonify(flights_list)

@app.route('/flight_data/<int:id>', methods=["DELETE"])
def delete_data(id):
    db = sqlite3.connect(DATABASE)
    cursor = db.cursor()
    
    cursor.execute("DELETE FROM flight_data WHERE id = ?", (id,))
    db.commit()
    
    return jsonify({"message": "Flight data deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)