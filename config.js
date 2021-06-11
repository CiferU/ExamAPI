require("dotenv").config();
module.exports ={

    "databases":[
        {
            "name":"MYREMOREDB",
            "server":process.env.MYREMOTEDB_SERVER,
            "port": parseInt(process.env.MYREMOTEDB_PORT),
            "databases":process.env.MYREMOTEDB_DATABASE,
            "user":process.env.MYREMOTEDB_USER,
            "PASSWORD":process.env.MYREMOTEDB_PASSWORD
        }
    ]
}