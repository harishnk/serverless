'use strict';
var config   = require('./config');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var request = require('request');

const spawnSync = require('child_process').spawnSync;

app.get('/', function(req, res){
    res.send('hey!\n');
});

app.get('/run/:language', function(req, res){
    res.writeHead(200, { "Content-Type": "text/event-stream",
                         "Cache-control": "no-cache" });
    
    console.log(req.params.language)

    if (req.params.language == 'Python') {
      const command = 'python';
      const extension = '.py'
    } else if (req.params.language == 'NodeJS') {
      const command = 'node';
      const extension = '.js'
    }

    var filename = './code_to_run/lambda' + extension;
    var spw = spawnSync(command, [filename]),
    str = "";

    spw.stdout.on('data', function (data) {
        str += data.toString();

        // just so we can see the server is doing something
        console.log("data");

        // Flush out line by line.
        var lines = str.split("\n");
        for(var i in lines) {
            if(i == lines.length - 1) {
                str = lines[i];
            } else{
                // Note: The double-newline is *required*
                res.write('data: ' + lines[i] + "\n\n");
            }
        }
    });

    spw.on('close', function (code) {
        res.end(str);
    });

    spw.stderr.on('data', function (data) {
        res.end('stderr: ' + data);
    });
});

//start the server
server.listen(config.express.port, function () {
  var port = server.address().port;
  console.log(' Application started on port', port);
});