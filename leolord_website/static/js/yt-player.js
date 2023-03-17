
// Initialize the player with the current video URL from the server
function onYouTubeIframeAPIReady() {
  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : "";
  player = new YT.Player("background-video", {
    videoId: videoId,
    playerVars: {
      autoplay: 1,
      controls: 0,
      mute: 0, // Change this value to 0 to enable audio
      loop: 1,
      playlist: videoId,
      enablejsapi: 1,
      modestbranding: 1,
      showinfo: 0,
      rel: 0,
      iv_load_policy: 3,
    },
    events: {
      onReady: onPlayerReady,
    },
  });
}

// Add the toggleMute function
function toggleMute() {
  const muteButton = document.getElementById("mute-button");
  if (player.isMuted()) {
    player.unMute();
    muteButton.textContent = "Mute";
  } else {
    player.mute();
    muteButton.textContent = "Unmute";
  }
}

function onPlayerReady(event) {
  event.target.setPlaybackQuality("hd720");
}

function getYouTubeVideoId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be\.com\/watch\?v=)([\w-]+)/;
  const matches = url.match(regex);
  return matches ? matches[1] : null;
}

function checkForNewVideo() {
  fetch("/get_current_video_url")
    .then((response) => response.json())
    .then((data) => {
      const newVideoUrl = data.video_url;
      if (newVideoUrl !== videoUrl) {
        const videoId = getYouTubeVideoId(newVideoUrl);
        if (videoId) {
          player.loadVideoById(videoId);
          player.setLoop(true);
          videoUrl = newVideoUrl;
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching current video URL:", error);
    });
}

// Check for a new video every 10 seconds
setInterval(checkForNewVideo, 5000);

