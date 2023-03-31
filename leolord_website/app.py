from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory, jsonify
from flask_socketio import SocketIO, emit
import os, time

app = Flask(__name__)
socketio = SocketIO(app)
app.config['SECRET_KEY'] = 'your-secret-key'

current_video_id = None
current_playback_time = 0

## HOME PAGE ##
@app.route("/", methods=["GET", "POST"])
def index():
    return render_template('index.html')

@socketio.on('client_connected')
def client_connected():
    global current_video_id, current_playback_time
    if current_video_id is not None:
        emit('update_video', {'video_id': current_video_id, 'playback_time': current_playback_time})

@socketio.on('update_video')
def update_video(data):
    global current_video_id, current_playback_time
    video_id = data['video_id']
    current_video_id = video_id
    current_playback_time = data['playback_time']
    emit('update_video', {'video_id': video_id, 'playback_time': current_playback_time}, broadcast=True)


## REQUESTS PAGE ##
# Initialize the messages list
messages = []
@app.route("/requests", methods=["GET", "POST"])
def requests():
    global messages
    if request.method == "POST":
        # Save the submitted message to the messages list
        name = request.form.get("name")
        subject = request.form.get("subject")
        message = request.form.get("message")
        messages.append({"name": name, "subject": subject, "message": message})
        return redirect(url_for("requests"))
    return render_template("requests.html", messages=messages)

## ABOUT PAGE ##
@app.route('/about')
def about():
    return render_template('about.html')

## MEDIA PAGE ##
# Initialize the video URL with an empty string
current_video_url = ""
@app.route("/get_current_video_url", methods=["GET"])
def get_current_video_url():
    global current_video_url
    return jsonify({"video_url": current_video_url})

media_folder = 'media'
@app.route('/media')
def media():
    media_folder = os.path.join(app.static_folder, 'media')
    media_files = os.listdir(media_folder)
    return render_template('media.html', media_files=media_files)

if __name__ == '__main__':
    socketio.run(app)
    # app.run(debug=True)
