function dataURLtoFile(imgCompleteBase) {
    //base64转File
    let arr = imgCompleteBase.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    //去除base64头部信息
    let inCompleteBase = atob(arr[1]);
    let n = inCompleteBase.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = inCompleteBase.charCodeAt(n);
    }
    return new File([u8arr], 'aFile', {type: mime});
}
export {dataURLtoFile}