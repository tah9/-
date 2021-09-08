import {Toast} from "vant";

// require('tracking/build/tracking-min');
// require('tracking/build/data/face-min');
let trackerTask = null;
let video = null;
let videoConstraints = {
    video: {
        width: null,
        height: null,
        facingMode: "user",
    },
    audio: false  //不开启音频
}

function openUserMedia(mvideo, trackerEvent) {
    video = mvideo;
    videoConstraints.video.width = video.offsetWidth;
    videoConstraints.video.height = video.offsetHeight;
    console.log(videoConstraints);
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
    try {
        window.stream = stream
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
    console.log(run)
    tracker = new window.tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);
    trackerTask = tracking.track(video, tracker);
    setTimeout(() => {
        tracker.on('track', event => {
            if (!run) {//停止是异步的，停止过程中还会执行下面语句所以过滤掉（如果视频流暂停的情况下异步）
                return
            }
            try {
                trackerEvent(event)
            } catch (e) {
                console.log(e);
            } finally {
            }
        });
    }, 2000)

}

let run = true;
let tracker;

/* 识别过程中视频不会暂停，如需要暂停打开注释即可
 * @param: null
 * @return:
 */
function syncStopTrack() {
    run = false//先同步关闭开关
    // trackerTask.stop();
    // video.pause()
    // //异步执行
    // video.srcObject.getVideoTracks().forEach(videoTrack => {
    //     videoTrack.stop()
    // });
}

function restartTrack() {
    // trackerTask.run()
    // getUserMediaToPhoto(videoConstraints, success, error);
    setTimeout(() => {
        run = true
    }, 2000)
}

function destroyTrack() {
    video.srcObject = null;
    run = true
    //关闭摄像头
    window.stream.getTracks().forEach(track => track.stop());
    tracker.removeAllListeners()
}

function getImg(video) {
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    //返回去除头信息的base64
    return canvas.toDataURL("image/png").split(',')[1]
}

export {
    openUserMedia, syncStopTrack, restartTrack, getImg, destroyTrack
}
