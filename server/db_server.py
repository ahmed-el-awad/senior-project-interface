import sqlite3
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
 
app = Flask(__name__)
cors = CORS(app)
 
DATABASE = 'main.db'
 
def init_db():
    db = sqlite3.connect(DATABASE)
    cursor = db.cursor()
   
    # Create patrols table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS patrols (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patrol_number TEXT NOT NULL,
            check_in_time TEXT NOT NULL,
            check_out_time TEXT NOT NULL,
            patrol_area TEXT NOT NULL,
            team_members TEXT NOT NULL,
            notes TEXT,
            date TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
   
    db.commit()
    db.close()
 
# Initialize database tables
init_db()
 
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
 
@app.route('/patrols', methods=['GET'])
def get_patrols():
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    cursor = db.cursor()
   
    cursor.execute('SELECT * FROM patrols ORDER BY date DESC, check_in_time DESC')
    patrols = cursor.fetchall()
   
    patrols_list = []
    for row in patrols:
        patrols_list.append(dict(row))
   
    return jsonify(patrols_list)
 
@app.route('/patrols', methods=['POST'])
def add_patrol():
    try:
        db = sqlite3.connect(DATABASE)
        cursor = db.cursor()
       
        data = request.json
        print("Received data:", data)  # Add logging
       
        # Generate patrol number (PYYYYMMDDXXX format)
        today = datetime.now()
        base_number = f"P{today.strftime('%Y%m%d')}"
       
        # Get the count of patrols for today to generate sequence
        cursor.execute(
            'SELECT COUNT(*) FROM patrols WHERE date = ?',
            (today.strftime('%Y-%m-%d'),)
        )
        today_patrols = cursor.fetchone()[0]
       
        patrol_number = f"{base_number}{(today_patrols + 1):03d}"
       
        cursor.execute('''
            INSERT INTO patrols (
                patrol_number, check_in_time, check_out_time,
                patrol_area, team_members, notes, date
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            patrol_number,
            data['check_in_time'],
            data['check_out_time'],
            data['patrol_area'],
            data['team_members'],
            data.get('notes', ''),  # Handle optional notes
            data['date']
        ))
       
        db.commit()
        return jsonify({"message": "Patrol added successfully", "patrol_number": patrol_number}), 201
    except Exception as e:
        print("Error:", str(e))  # Add logging
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
 
@app.route('/patrols/<int:id>', methods=['DELETE'])
def delete_patrol(id):
    db = sqlite3.connect(DATABASE)
    cursor = db.cursor()
   
    cursor.execute("DELETE FROM patrols WHERE id = ?", (id,))
    db.commit()
   
    return jsonify({"message": "Patrol deleted successfully"}), 200
 
if __name__ == '__main__':
    app.run(debug=True)