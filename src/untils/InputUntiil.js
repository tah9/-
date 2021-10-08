let head = '<img class="content-emoji" src="/api/graduate/emoji/'
let end = '.jpg">'

function formatText(innerHTML) {
    console.log(innerHTML);
    //表情转换
    //replaceAll只支持2021es6
    innerHTML = innerHTML.replace(new RegExp(head, "gm"), '[')
    innerHTML = innerHTML.replace(new RegExp(end, "gm"), ']')

    innerHTML = innerHTML.replace(new RegExp(']<div', 'gm'), end)
    //替换a标签多余内容
    innerHTML = innerHTML.replace(new RegExp('[\\?].*?[0-9]', "gm"), '')
    // console.log(innerHTML)
    return innerHTML
}

function textToOld(text) {
    //表情转换
    //replaceAll只支持2021es6
    text = text.replace(new RegExp('\\[', "gm"), head)
    text = text.replace(new RegExp(']', "gm"), end)
    //替换a标签多余内容
    text = text.replace(new RegExp('[\\?].*?[0-9]', "gm"), '')
    // console.log(text);
    return text
}

function addComment(authName,item) {
    let cell = document.createElement('div');
    cell.id = item.id + ""
    cell.className = 'cell-comment'

    let uname = document.createElement('a');
    uname.innerText = item.username
    uname.href = '/u/' + item.username
    uname.className = 'feed-link-uname'

    cell.appendChild(uname)
    if (item.isFeedAuthor === 1) {
        let lou = document.createElement('span')
        lou.className = "lou"
        lou.innerText = '楼主'
        cell.appendChild(lou)
    }

    //不是直接回复评论，而是回复子评论
    if (item.rid !== item.rrid) {
        cell.append(' 回复 ')
        let runame = document.createElement('a');
        runame.innerText = item.rusername
        runame.href = item.rusername
        runame.className = 'feed-link-uname'
        cell.appendChild(runame)
        if (item.rusername === authName) {
            let lou = document.createElement('span')
            lou.className = "lou"
            lou.innerText = '楼主'
            cell.appendChild(lou)
        }
    }
    let message = document.createElement('span');
    message.innerHTML = textToOld("：" + item.message)
    cell.appendChild(message)
    return cell
}

export {formatText, textToOld,addComment}