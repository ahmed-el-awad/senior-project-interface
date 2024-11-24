from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import time
import cv2
from ultralytics import YOLO
import numpy as np

app = Flask(__name__)
CORS(app)

# Variables to control the detection loop and store the latest detection result
is_running = False
latest_detection = {"detections": "No data available"}

# Load YOLO model (Replace with the correct path to your model file)
model = YOLO("Tahryolov8.pt")

def run_detection_loop():
    global is_running, latest_detection
    cap = cv2.VideoCapture("DJI_0004_V .MP4")  # Load the video file
    assert cap.isOpened(), "Error reading video file"

    tracked_objects = {}
    next_object_id = 0

    def create_tracker():
        return cv2.TrackerCSRT_create()

    while is_running and cap.isOpened():
        success, frame = cap.read()
        if not success:
            print("Video processing completed or frame could not be read.")
            break

        # Run YOLO model on the frame
        results = model(frame)
        detections = results[0].boxes

        # Update object tracking and assign IDs
        tracked_objects.clear()  # Reset tracked objects
        for detection in detections:
            x1, y1, x2, y2 = map(int, detection.xyxy[0])
            confidence = detection.conf[0]
            class_id = int(detection.cls[0])

            if confidence < 0.5:
                continue

            # Add the detection as a tracked object
            bbox = (x1, y1, x2 - x1, y2 - y1)  # (x, y, width, height)
            new_tracker = create_tracker()
            new_tracker.init(frame, bbox)
            tracked_objects[next_object_id] = (new_tracker, class_id)
            next_object_id += 1

        # Update latest_detection with the object count
        object_count = len(tracked_objects)
        latest_detection = {"detections": f"Tahrs Count: {object_count}"}
        
        print("Running detection on video source... Object count:", object_count)

        # Sleep for 0.5 seconds between each frame processing
        time.sleep(0.5)

    # Release the video capture when done
    cap.release()

@app.route('/start_detection', methods=['POST'])
def start_detection():
    global is_running
    if is_running:
        return jsonify({"message": "Detection is already running"}), 400

    # Set the flag to start detection
    is_running = True

    # Start the detection loop in a separate thread
    thread = threading.Thread(target=run_detection_loop)
    thread.start()

    return jsonify({"message": "Detection started"}), 200

@app.route('/end_detection', methods=['POST'])
def end_detection():
    global is_running
    if not is_running:
        return jsonify({"message": "Detection is not running"}), 400

    # Set the flag to stop detection
    is_running = False
    return jsonify({"message": "Detection stopped"}), 200

@app.route('/get_latest_detection', methods=['GET'])
def get_latest_detection():
    # Return the latest detection data
    return jsonify(latest_detection)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
