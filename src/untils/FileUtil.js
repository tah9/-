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
// <div class="pics">
// </div>
//     .pics {
//     display: flex;
//     flex-wrap: wrap;
// }
//
// .pics *{
//     margin: 3px;
//     width: 100px;
//     height: 100px;
// }
// <div class="upload" ref="upload">+</div>
//
//     .upload {
//     text-align: center;
//     line-height: 100px;
//     background-color: @gay-bg;
//     font-size: 5em;
//     color: @gay-font;
// }
//拖动上传图片
// let uploadEm=_this.$refs.upload
// uploadEm.addEventListener("dragenter", function(e){
//   e.preventDefault();
// });
// uploadEm.addEventListener('dragover', (e) => {
//   e.preventDefault();
// })
// uploadEm.addEventListener('drop', (e) => {
//   // e.stopPropagation();
//   e.preventDefault();
//   let files = e.dataTransfer.files; //获取文件
//   console.log(files);
//   for (let i = 0; i < files.length; i++) {
//     _this.resultFiles.push(files[i])
//   }
//
// })
export {dataURLtoFile}