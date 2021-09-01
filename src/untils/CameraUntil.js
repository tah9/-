import {Toast} from "vant";

require('tracking/build/tracking-min.js');
require('tracking/build/data/face-min.js');

let trackerTask = null;
let mediaStreamTrack = null;
let videoConstraints = {
    video: {
        width: 300,
        height: 300,
        facingMode: "user",
    },
    audio: false  //不开启音频
}

function openUserMedia(trackerEvent) {
    if (navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia) {
        getUserMediaToPhoto(videoConstraints, success, error);
    } else {
        Toast.fail('不支持打开摄像头');
    }
    openCamera(trackerEvent)
}

function getUserMediaToPhoto(constraints, success, error) {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
    } else if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia(constraints, success, error);
    } else if (navigator.mozGetUserMedia) {
        navigator.mozGetUserMedia(constraints, success, error);
    } else if (navigator.getUserMedia) {
        navigator.getUserMedia(constraints, success, error);
    }
}

function success(stream) {
    let video = document.getElementById("video");
    mediaStreamTrack = null;
    mediaStreamTrack = stream;
    try {
        video.srcObject = stream;
    } catch (e) {
        console.log("访问用户媒体设备失败：", e.name, e.message);
    }
    video.play();
}

function error(error) {
    console.log('访问用户媒体失败：', error.name, error.message);
}

function openCamera(trackerEvent) {
    let tracker = new window.tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);
    trackerTask = tracking.track('#video', tracker)
    tracker.on('track', trackerEvent)
}

export {
    openUserMedia
}
