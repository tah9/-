function getTime(oldTime) {
    let time = Date.parse(new Date()) / 1000;
    let offTime = time - oldTime;

    //刚刚活跃
    if (offTime<=60) {
        return '刚刚'
    }
    //1小时内活跃
    else if (offTime < 60 * 60) {
        return Math.floor(offTime / (60)) + '分钟前'
    }
    //24小时内活跃
    else if (offTime > 60 * 60 && offTime < 60 * 60 * 24) {
        return Math.floor(offTime / (60 * 60)) + '小时前'
    }
    //30天内活跃
    else if ( offTime<= 60 * 60 * 24 * 30) {
        return Math.floor(offTime / (60 * 60 * 24)) + '天前'
    }
    //直接显示日期
    else {
        return timeConvers(oldTime*1000)
        // return new Date(parseInt(oldTime) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    }
}

function timeConvers(time) {
    let times = new Date(time);
    let Year = times.getFullYear() + '-';
    //月份时间为0-11月，所以必须+1，判断小于10，月数前面补0
    let Mouth = times.getMonth()+1+'-'
    //判断小于10，日数前面补0
    let Dates = times.getDate() ;
    return Year+Mouth+Dates;
}
export {getTime}
