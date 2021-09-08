import request from "@/network/request";

let baiduUrl = 'https://aip.baidubce.com/rest/2.0/face/v3'

function match_1vsN(jsonData) {
    return request.post(baiduUrl + '/multi-search', jsonData)
}

function registerFace(jsonData) {
    return request.post(baiduUrl + '/faceset/user/add', jsonData)
}
function deleteUser(jsonData){
    return request.post(baiduUrl+'/faceset/user/delete',jsonData)
}
function searchGroupUser(group_id){
    return request.post(baiduUrl+'/faceset/group/getusers',{group_id:group_id})
}

export {
    match_1vsN, registerFace,deleteUser,searchGroupUser
}
