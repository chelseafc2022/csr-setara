const tglConvert = (tgl) => {
    var date = new Date(tgl);
    // console.log(date)
    var getBulan = date.getMonth() + 1; var bulan = '';
    if (getBulan == '1') {bulan = 'Jan'} 
    else if(getBulan == '2') {bulan = 'Feb'}
    else if(getBulan == '3') {bulan = 'Mar'}
    else if(getBulan == '4') {bulan = 'Apr'}
    else if(getBulan == '5') {bulan = 'Mei'}
    else if(getBulan == '6') {bulan = 'Jun'}
    else if(getBulan == '7') {bulan = 'Jul'}
    else if(getBulan == '8') {bulan = 'Agt'}
    else if(getBulan == '9') {bulan = 'Sep'}
    else if(getBulan == '10') {bulan = 'Okt'}
    else if(getBulan == '11') {bulan = 'Nov'}
    else if(getBulan == '12') {bulan = 'Des'}

    if (tgl == undefined || tgl == null || tgl == '') {
        var tglku = "-";
        var time = "-"
    } else {
        var tglku = date.getDate() + " " + bulan + " " + date.getFullYear();
        var time = date.getHours() +':'+date.getMinutes()+':'+date.getSeconds()
    }


    return {
        tgl : tglku,
        time : time
    };
}

module.exports = {
    tglConvert: tglConvert
}