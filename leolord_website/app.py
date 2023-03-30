from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory, jsonify
import os

app = Flask(__name__)

## HOME PAGE ##
@app.route("/", methods=["GET", "POST"])
def home():
    global current_video_url
    if request.method == "POST":
        # Update the video URL when a user submits a new one
        current_video_url = request.form.get("videoUrl")
        return redirect(url_for("home"))
    return render_template("home.html", video_url=current_video_url)

# Initialize the playback time with 0
current_playback_time = 0

@app.route("/get_playback_info", methods=["GET", "POST"])
def get_playback_info():
    global current_playback_time
    if request.method == "POST":
        # Update the playback time from the client's data
        current_playback_time = float(request.form.get("playback_time"))
        return "OK", 200
    return jsonify({"playback_time": current_playback_time})

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
    app.run(debug=True)
