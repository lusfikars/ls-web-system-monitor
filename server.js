var osu = require('os-utils');
var fs = require('fs');
var express = require('express');
var app = express();

app.use('/scripts', express.static(__dirname + '/node_modules/chart.js/dist/'));
app.use('/scripts', express.static(__dirname + '/node_modules/vue/dist/'));
app.use('/scripts', express.static(__dirname + '/node_modules/vue-resource/dist/'));
app.use('/scripts', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/scripts', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/assets', express.static(__dirname + '/assets/'));

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
    res.sendfile("assets/index.html");
});

app.get('/api/home', function (req, res) {
    res.json({title: "Home", message: "Selamat Datang di Node.js Web System Monitor!"});
});

app.get('/api/about', function (req, res) {
    res.json({title: "About", message: "Node.js Web System Monitor dibuat oleh Lusfikar Sheba."});
});

app.get('/api/contact', function (req, res) {
    res.json({title: "Contact", message: "Kontak Saya di http://www.ciyy.space atau Email ke rakifsul@gmail.com"});
});

var cpuUsageVal = 0;
app.get('/api/os_utils_cpu_usage', function (req, res) {
    
    osu.cpuUsage(function(v){
        cpuUsageVal = v;
    });
    res.json({name: "CPU Usage", value: cpuUsageVal});
});

app.get('/api/os_utils_memory_usage', function (req, res) {
    res.json({name: "Memory Usage", value: osu.freememPercentage()});
});

app.get('/api/os_utils_others', function (req, res) {
    var ret = {
        platform: osu.platform(),
        cpuCount: osu.cpuCount(),
        freeMem: osu.freemem(),
        totalMem: osu.totalmem(),
        sysUpTime: osu.sysUptime(),
        processUpTime: osu.processUptime()
    };
    res.json({name: "Other Informations", value: ret});
});

app.get('/api/download_snapshot', function (req, res) {
    var snapshot = {
        when: new Date(),
        cpuUsage: cpuUsageVal,
        freememPercentage: osu.freememPercentage(),
        platform: osu.platform(),
        cpuCount: osu.cpuCount(),
        freeMem: osu.freemem(),
        totalMem: osu.totalmem(),
        sysUpTime: osu.sysUptime(),
        processUpTime: osu.processUptime()
    };

    var jstr = JSON.stringify(snapshot,null,'\n');
    
    fs.writeFile(__dirname + '/assets/snapshot.json', jstr, function(err) {
        if(err) 
            return console.error(err);
        console.log('done');
        res.download(__dirname + '/assets/snapshot.json');
    });
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});