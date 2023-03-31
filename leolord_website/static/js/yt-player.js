let player;
let socket = io();
let videoUrl = document.getElementById("video-url").value;

function onYouTubeIframeAPIReady() {
    const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : "";
    player = new YT.Player("background-video", {
      videoId: videoId,
      playerVars: {
        autoplay: 1, 
        controls: 0,
        mute: 1,
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

function onPlayerReady(event) {
    event.target.setPlaybackQuality("hd1080p");
    event.target.pauseVideo();
    player.addEventListener("onStateChange", onPlayerStateChange);
}
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    event.target.seekTo(0);
  }
}

  function toggleMute() {
    if (player.isMuted()) {
      player.unMute();
    } else {
      player.mute();
    }
  }

function updateVideo() {
    let videoUrl = document.getElementById("video-url").value;
    let videoId = getYoutubeVideoId(videoUrl);
    if (videoId) {
        let playbackTime = player.getCurrentTime();
        socket.emit('update_video', {'video_id': videoId, 'playback_time': playbackTime});
    } else {
        alert("Invalid YouTube video URL");
    }
}

function getYoutubeVideoId(url) {
    let regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regex);
    return (match && match[2].length === 11) ? match[2] : false;
}

socket.on('update_video', function(data) {
    let newVideoId = data['video_id'];
    let playbackTime = data['playback_time'];
    let currentVideoId = player.getVideoData()['video_id'];

    if (currentVideoId !== newVideoId) {
        player.loadVideoById(newVideoId, playbackTime);
    }
});

socket.on('connect', function() {
    socket.emit('client_connected');
});

setInterval(function() {
    let currentVideoId = player.getVideoData()['video_id'];
    let playbackTime = player.getCurrentTime();

    if (currentVideoId) {
        socket.emit('update_video', {'video_id': currentVideoId, 'playback_time': playbackTime});
    }
}, 1000);


const hideElements = () => {
  const elementsToHide = document.querySelectorAll('.autohide');
  elementsToHide.forEach((el) => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.5s ease-out';
  });
}

const showElements = () => {
  const elementsToShow = document.querySelectorAll('.autohide');
  elementsToShow.forEach((el) => {
    el.style.opacity = '1';
    el.style.transition = 'opacity 0.5s ease-in';
  });
}

let timeout;

document.addEventListener('mousemove', () => {
  showElements();
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    hideElements();
  }, 5000);
});

