var myTime = moment().format('hh:mm');
console.log(parseAsMoment(myTime));

function parseAsMoment(time) {
    return moment.utc('2016-01-01T' + time + ':00');
}

var m = parseAsMoment(myTime);
var start = parseAsMoment("05:30");
var end = parseAsMoment("08:00");
var l;

if (start.diff(m) > 0) {
    var d = moment.duration(start.diff(m));
    message = "Starting in " + d._data.hours + " hr " + d._data.minutes + " min";
    l = true;
    
} else if (end.diff(m) > 0) {
    var d = moment.duration(end.diff(m));
    message = "Ending in " + d._data.hours + " hr " + d._data.minutes + " min " + d._data.seconds;
   
    l = true;
   
}

console.log(message);