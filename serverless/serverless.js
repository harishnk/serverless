'use strict';
var config   = require('./config');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var request = require('request');

var spawnSync = require('child_process').spawnSync;

app.get('/', function(req, res){
    res.send('hey!\n');
});

app.get('/run/:language', function(req, res){
    res.writeHead(200, { "Content-Type": "text/event-stream",
                         "Cache-control": "no-cache" });
    
    console.log(req.params.language)

    if (req.params.language == 'python') {
      var command = 'python';
      var extension = '.py';
    } else if (req.params.language == 'nodejs') {
      var command = 'node';
      var extension = '.js';
    } else {
        var command = null;
        var extension = null;
    }
    //@see https://nodejs.org/api/child_process.html#child_process_options_stdio for stdio options, //https://nodejs.org/docs/v0.11.13/api/child_process.html#child_process_child_process_spawnsync_command_args_options for {} options
    var filename = './code_to_run/lambda' + extension;
    var childProcess = spawnSync(command, [filename], {
            cwd: process.cwd(),
            input: null,
            env: process.env,
            stdio: 'pipe',
            timeout: 50000,
            killSignal: 'SIGTERM',
            encoding: 'utf-8'});

    if (childProcess.status == 0) {
        res.write(childProcess.stdout + "\n\n");
    } else {
        res.write(childProcess.stderr + "\n\n");
    }
    res.end(childProcess.status);
});

//start the server
server.listen(config.express.port, function () {
  var port = server.address().port;
  console.log(' Application started on port', port);
});