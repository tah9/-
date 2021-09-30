import * as faceapi from "../../public/face-api.min";

function screenShot_File(video, box) {
    let cc = document.createElement('canvas');
    let offHeight = box.height / 3.8
    let cWidth = box.width
    let cHeight = box.height + offHeight
    cc.width = cWidth
    cc.height = cHeight
    let ccCtx = cc.getContext("2d");
    ccCtx.drawImage(video, box.x, box.y - offHeight, cWidth, cHeight, 0, 0, cWidth, cHeight)
    return cc.toDataURL("image/jpeg");
}
async function loadOneDescriptor(name) {
    const descriptions = []
    let i = 0;
    while (i !== -1) {
        try {
            const img = await faceapi.fetchImage(`/api/graduate/face/${name}/${i++}.jpg`);
            //人脸标识符
            const itemDesc = await faceapi.detectSingleFace(img).withFaceLandmarks(/*true*/).withFaceDescriptor();
            descriptions.push(itemDesc.descriptor)
        } catch (e) {
            //console.log(name + '>>>' + e);
            i = -1
        }
    }
    let labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(name, descriptions);
    console.log(labeledFaceDescriptors);
    return labeledFaceDescriptors
}
async function loadAllDescriptor(faceDescriptors,names) {
    for (let name of names) {
        let item = await loadOneDescriptor(name);
        if (item.descriptors.length > 0) {
            faceDescriptors.push(item)
        }
    }
}
export {
    loadOneDescriptor,loadAllDescriptor,screenShot_File
}