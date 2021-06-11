const express = require('express');
const bodyParser = require('body-parser');
//New thing for documentation tool called swagger
const swaggerUi = require('swagger-ui-express');

//sql module
const sql = require('mssql');

//Calling my config file
const config = require('./config');

//JSON WEB TOKENS HERE
const jwt = require('jsonwebtoken');

const logger = require('./logger');

const bcrypt = require('bcrypt');

const cors = require('cors');


//imports finish here

const swaggerDocument = require('./swagger.json');
const app = express();
const port = 4000;

app.use(bodyParser.json({limit:'100mb'}));
app.use(cors());

app.all('*', function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','PUT,GET,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
})

app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.post('/api/runsp', function (req,res) {

    var ev = req.body;
    execSql(req,res).then(function(d){
        console.log(d);
        res.send(d);
    })
    
});

function getConnectionString(appname) {

    let connection;
    for(let i=0;i<=config.databases.length;i++){
        if(config.databases[i].name == appname){
            return connection = config.databases[i];
        }
    }
    
}

async function execSql(req,res) {
    let ev = req.body;
    let sqlquery = ev.query;
    let connection = getConnectionString(ev.appname);

    const pool = new sql.ConnectionPool(connection);
    pool.on('error', err=>{
        console.log('sql errors', err)
        logger.log('info',`sql errors:${err}`)
    });
    

    try {
      await pool.connect() ;
      let result = await pool.request().query(sqlquery);
      return{success:result};
    } catch(err){
        return{err:err};
    }finally{
        pool.close();
    }
}


app.get('/api/hello', function(req,res){

    res.send({"greetings":"hi"});
})

app.get('/api/name', function(req,res){

   res.send({"name":"Uriel"});
})

app.get('/api/f', function(req,res){

    res.send('F for respect');
})

app.post("/api/confirm", async (req, res) => {
    const user = req.body.user
    const hash = req.body.hash
    if (!user || !hash) {
        return res.sendStatus(400)
    }
    const result = await bcrypt.compare(user, hash)
    logger.log("info", "User compared hash.")
    res.json({ result })
})

app.listen(port, function(){
    console.log(`Restful api listening to port ${port}`);
    logger.log('info', 'RESTFUL API EXECUTED');
})