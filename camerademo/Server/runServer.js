
// Load the http module to create an http server.
const http = require('http');
const {exec} = require('child_process');
const express = require('express');
var spawn = require("child_process").spawn,child;
var multer  = require('multer');

const appRouter = express();
// eslint-disable-next-line new-cap
const app =express.Router();
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

let status=[]
const port = 8000;
// Create a server
const server = http.createServer(appRouter);
// Lets start our server
server.listen(port, function() {
    // Callback triggered when server is successfully listening. Hurray!
    console.log('Server listening on: http://localhost:%s', port);

});
appRouter.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded
appRouter.use(bodyParser.json());

// for parsing multipart/form-data
appRouter.use(express.static('public'));
appRouter.use(cors());


function runLocalProgram(command){
    exec( command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

}

appRouter.use('/startCPP', function(req,res) {
    // eslint-disable-next-line max-len
    console.log("Running Mars");
    // eslint-disable-next-line max-len
    const command = 'C:\\"Program Files"\\"Intel MARS"\\"MARS v5.0"\\Build\\Bin\\MARS.exe';
    const Parameters = ' C:\\"Program Files"\\"Intel MARS"\\"MARS v5.0"\\"Room_Entry"\\"Outside Trigger"\\Room_Entry_Trigger.xml';
    const fileName = 'MARS.exe';
    const calc = 'C:\\Windows\\System32\\calc.exe';
    const cppDemoATM = 'C:\\Users\\NCR\\Desktop\\obstruct\\opencv\\obstruct\\x64\\Release\\obstruct.exe';
    runLocalProgram(cppDemoATM);

    res.send("good");
    /*
    child = spawn('powershell.exe',['C:\\"Program Files"\\"Intel MARS"\\"MARS v5.0"\\Build\\Bin\\MARS.exe',' C:\\"Program Files"\\"Intel MARS"\\"MARS v5.0"\\Room_Entry\\"Outside Trigger"\\Room_Entry_Trigger.xml']);
    child.stdout.on("data",function(data){
        console.log("Powershell Data: " + data);
    });
    child.stderr.on("data",function(data){
        console.log("Powershell Errors: " + data);
    });
    child.on("exit",function(){
        console.log("Powershell Script finished");
    });
    child.stdin.end(); //end input*/
});
appRouter.use('/startPython', function(req,res){
    const pythonCommand = 'python ..\\python_quad_proc\\dynamic_proc.py';
    runLocalProgram(pythonCommand);
    res.send('good')
});





appRouter.use('/kill', function(req,res) {
    console.log("Killing Mars");
    exec( 'taskkill /IM "MARS.exe" /F', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    res.send('good');
});

let varState={};
appRouter.use('/lumeo', function(req,res){
    console.log(req.body); // Call your action on the request here
    varState=req.body
    res.status(200).end() // Responding is important
});
appRouter.use('/getlumeostatus', (req,res)=>{
    if(varState)
    {res.json(varState)}
    else
        res.json({"message":"nothing"}).end()
     // Responding is important

});



appRouter.use('/getCash', function(req,res){
    const getCash = `curl --location --request PUT 'http://localhost:3001/api/deliverypoints/ATM/Atlanta/6684-BAY04A/allocations/1' \\
--header 'Content-Type: application/json' \\
--data-raw '{
  "action": "DISPENSE",
  "params": "{\\"amount\\": \\"40\\",\\"notes_taken_timeout\\": 40}"
}'`;


    runLocalProgram(getCash);
    res.send('good')
});

