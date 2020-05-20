const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = 8080

app.use(express.static(__dirname+"/public"))

//setup sqllite database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname+"/sondages.db");

//setup routes
const admin = require("./routes/adminPanel")(db)
const sondage = require("./routes/sondage")(db)
const users = require("./routes/login")(db)

app.get("",(req,res)=>{
	res.render("index.ejs",{host:req.headers.host})
})

app.use("/admin",admin)
app.use("/sondage",sondage)
app.use("/users",users)

//404
app.use((app,res,next)=>{
	res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
})
server.listen(port,()=>{
	console.log("le serveur écoute sur",port)
})