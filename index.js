const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = 8080

app.use(express.static(__dirname+"/public"))

//setup sqllite database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname+"/sondages.db");
db.serialize();



db.close()


server.listen(port,()=>{
	console.log("le serveur écoute sur",port)
})