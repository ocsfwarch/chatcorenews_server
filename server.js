const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const PORT = 4000;
const fs = require('fs');
const path = require('path');
const os = require('os');

// Create instances of middleware
app.use(cors());
app.use(bodyParser.json());

// DB Connection Configuration
const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'ocsfwarch',
    password: 'TP2013bb',
    database:'chat_news'
});

// Connect to database
dbConn.connect();

// Default route
app.get('/', function(req,res){
    return res.send({error:false,message:'hello'});
});

app.get('/feeds', function(req,res){
    dbConn.query('SELECT nFeedId, strFeedName AS name,strFeedValue AS value,strFeedCategory AS category FROM feedlist_table WHERE nActive = 1 ORDER BY category, name',
    function(error, results, fields){
        if(error){
            res.send({error:true,message:'An Error Occurred'});
        }
        res.send({error:false, data: results, message: 'Feed List'});
    });
});

app.get('/getnews/:fileName', function(req,res){
    console.log("fileName = " + req.params.fileName);
    const strPath = `d:${path.sep}common${path.sep}feed_results${path.sep}${req.params.fileName}.txt`;
    console.log(strPath);
    console.log(os.platform());
    const objOptions = {encoding:'utf8',flag:'r'};
    fs.access(strPath, fs.F_OK, (err) => {
        if(err){
            // Need to create some sort of error feedback here
            console.log(`${strPath}, not found`);
            res.json({'ocsaResultsJson':[]});
        }else{
            let fileReadStream = fs.createReadStream(strPath, objOptions);
            fileReadStream.pipe(res);
        }
    });
});

app.listen(PORT, function(){
    console.log("Server is running on Port:" + PORT);
});