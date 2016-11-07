var fs = require('fs'),
    PDFParser = require("pdf2json");
var pdfParser = new PDFParser(this, 1);
var http = require('http');

function Group() {
    this.all;
    this.sun = [];
    this.mon = [];
    this.tue = [];
    this.wed = [];
    this.thu = [];
    this.fri = [];
    this.sat = [];
}

//7 loadshedding groups
var g1 = new Group();
var g2 = new Group();
var g3 = new Group();
var g4 = new Group();
var g5 = new Group();
var g6 = new Group();
var g7 = new Group();

var groups = [g1, g2, g3, g4, g5, g6, g7];

var all = [];
pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));

pdfParser.on("pdfParser_dataReady", pdfData => {

    var data = pdfParser.getRawTextContent().toString();

    //convery nepali digits to numeric
    data = data.replace(/\)/g, 0);
    data = data.replace(/!/g, 1);
    data = data.replace(/@/g, 2);
    data = data.replace(/#/g, 3);
    data = data.replace(/\$/g, 4);
    data = data.replace(/%/g, 5);
    data = data.replace(/\^/g, 6);
    data = data.replace(/&/g, 7);
    data = data.replace(/\*/g, 8);
    data = data.replace(/\(/g, 9);
    data = data.replace(/M/g, ':');
    data = data.replace(/–/g, '-'); // strange minus sign

    // get data for 7 groups in array
    all = data.match(/\d{2}:\d{2}.\d{2}:\d{2}/g).slice(0, 98);

    //distribute schedule to each group
    for (var i = 0; i < groups.length; i++) {
        var g = groups[i];
        g.all = all.slice(14 * i, 14 * (i + 1));
        g.sun = toObject(g.all.slice(0, 2));
        g.mon = toObject(g.all.slice(2, 4));
        g.tue = toObject(g.all.slice(4, 6));
        g.wed = toObject(g.all.slice(6, 8));
        g.thu = toObject(g.all.slice(8, 10));
        g.fri = toObject(g.all.slice(10, 12));
        g.sat = toObject(g.all.slice(12, 14));

        delete g.all;
    }

    console.log("completed Parsing");
});

module.exports.scrapeData = function () {
    downloadAndParse();
}

module.exports.allData = function () {
    return groups;
}


function toObject(array) {
    var toGive = [];
    for (var i = 0; i < array.length; i++) {
        var a = array[i].toString();
        var pieces = a.split("-");
        var start = (pieces[0]);
        var end = (pieces[1]);

        toGive.push({
            'start': start,
            'end': end
        });
    }
    return toGive;
}



function downloadAndParse() {     
    var file = fs.createWriteStream("schedule.pdf");
    var request = http.get("http://nea.org.np/images/supportive_docs/3848loadshedding.pdf", function (response) {
        response.pipe(file);  
    });
    file.on('close', function(){
        pdfParser.loadPDF("schedule.pdf");
    })     
}