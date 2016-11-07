var myGroup = 1;
var myData;
var today;
var now = {
    day: 0
};

var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
now.day = days[new Date().getUTCDay()];

function renderData() {
    $("#details").html("");
    var html = '<table>'
    for (var d in myData) {
        if (d != 'all') {

            var day = myData[d];

            //highlight current day        
            html += '<tr class="' + (d === now.day ? "active" : "") + '">';

            //day
            html += '<td><div class="day">' + d + '</div></td><td><div class="routine">';

            //schedules
            var diff = 0; //time differences each
            for (var time in day) {
                html += '<label>' + to12HrFormat(day[time].start) + ' - ' + to12HrFormat(day[time].end) + '</label><br>';
                diff += parseAsMoment(day[time].end).diff(parseAsMoment(day[time].start));
            }
            html += '</div></td>';

            //total
            var h = moment.duration(diff)._data.hours;
            var m = moment.duration(diff)._data.minutes;
            var total = (h == 0 ? '' : h + ' hr ') + (m == 0 ? '' : m + ' min');
            html += '<td><div class="total-time">' + total + '</div></td></tr>'
        }
    }
    html += '</table>';
    $("#details").html(html);
    generateMessage();
}

$(".btn-circle").click(function () {
    var gNo = parseInt($(this).text()) - 1;
    myGroup = gNo;
    myData = schedule[myGroup];
    today = myData[now.day];
    renderData();
    $(".btn-circle").removeClass('btn-active');
    $(this).addClass("btn-active");
});


function init() {
    $.ajax({
        url: 'http://meroloadsheddingapp.herokuapp.com/api/schedule',
        method: 'GET',
        success: function (data) {
            schedule = data.data;
            myData = schedule[myGroup - 1];
            today = myData[now.day];
            renderData();
        }
    })
}

init();


function parseAsMoment(time) {
    return moment.utc('2016-01-01T' + time + ':00');
}

function to12HrFormat(in24Hr) {
    var hr = parseInt(in24Hr.split(':')[0]);
    var min = in24Hr.split(':')[1];
    if (hr > 12) hr = Math.abs(12 - hr);
    if (hr < 10) hr = '0' + hr; //add 0 at begining
    return (hr + ":" + min);
}

setInterval(function () {
    now.time = moment().format('HH:mm');
    generateMessage();
}, 1000);


function generateMessage() {
    var message;
    var l = false;
    var m = parseAsMoment(now.time);

    for (var i = 0; i < today.length; i++) {
        var start = parseAsMoment(today[i].start);
        var end = parseAsMoment(today[i].end);

        if (start.diff(m) > 0) {
            var d = moment.duration(start.diff(m));
            message = "Session " + (i + 1) + " : Starting in " + (d._data.hours == 0 ? '' : d._data.hours + " hr ") + (d._data.minutes == 0 ? '' : d._data.minutes + " min");
            l = true;
            break;
        } else if (end.diff(m) > 0) {
            var d = moment.duration(end.diff(m));
            message = "Session " + (i + 1) + " : Ending in " + (d._data.hours == 0 ? '' : d._data.hours + " hr ") + (d._data.minutes == 0 ? '' : d._data.minutes + " min");
            l = true;
            break;
        }
    }

    if (!l)
        message = "Finished for today";
    $("#msg").text(message);
}