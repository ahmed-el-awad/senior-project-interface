import os
from flask import Flask, Response, jsonify
from flask_cors import CORS
import cv2
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

# Load YOLO model
MODEL_PATH = "latestv11intruders.pt"  # Replace with the correct path to your model
model = YOLO(MODEL_PATH)

# Global variables for object counts
human_count = 0
donkey_count = 0
tahr_count = 0

# Path to video or camera stream
VIDEO_PATH = "DJI_0004_.mp4"  # Replace with your video file or use 0 for a webcam

# Function to generate frames and perform object detection
def generate_frames():
    global human_count, donkey_count, tahr_count

    cap = cv2.VideoCapture(VIDEO_PATH)
    if not cap.isOpened():
        raise RuntimeError(f"Unable to open video source: {VIDEO_PATH}")

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        # Resize frame for efficiency
        frame = cv2.resize(frame, (640, 360))

        # Run YOLO model on the frame
        results = model(frame)
        detections = results[0].boxes  # Get detected objects

        # Reset counts for the current frame
        human_count = 0
        donkey_count = 0
        tahr_count = 0

        # Process detections
        for detection in detections:
            x1, y1, x2, y2 = map(int, detection.xyxy[0])  # Bounding box coordinates
            confidence = detection.conf[0]  # Confidence score
            class_id = int(detection.cls[0])  # Class ID

            # Only consider detections above a certain confidence threshold
            if confidence < 0.5:
                continue

            # Count detected objects
            if class_id == 2:  # Human
                human_count += 1
            elif class_id == 0:  # Donkey
                donkey_count += 1
            elif class_id == 1:  # Tahr
                tahr_count += 1

            # Draw bounding boxes and labels on the frame (optional for debugging)
            label = f"{model.names[class_id]} {confidence:.2f}"
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

        # Encode the frame as JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            break

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n\r\n')

    cap.release()

@app.route('/video_feed')
def video_feed():
    """Stream video frames as MJPEG with real-time object detection."""
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/object_count')
def object_count():
    """Return the current object detection counts."""
    response = {
        "detections": {
            "human": human_count,
            "donkey": donkey_count,
            "tahr": tahr_count
        }
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
