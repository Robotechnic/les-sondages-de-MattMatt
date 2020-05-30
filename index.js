const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 8080

//configure helmet
var helmet = require('helmet');
app.use(helmet());

app.use(express.static(__dirname+"/public"))

//setup sqllite database
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname+"/sondages.db",sqlite3.OPEN_READWRITE, (err)=>{
	if (err)
		throw err
	console.log("db connected with success")

})

//setup body-parser
const bodyParser = require ("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//setup session
const session = require("express-session")
const sessionSecret = "aRandomSecretThatMustBeChanged3141592"

//setup session storage
const SQLiteStore = require('connect-sqlite3')(session)

app.use(session({
	store: new SQLiteStore({
		db:"sondages.db",
		dir:__dirname,
		concurrentDB:true
	}),
	name:"userID",
	resave:false,
	saveUninitialized:false,
	secret:sessionSecret,
	cookie:{
		//secure:true,
		httpOnly:true,
		maxAge:604800000 //one week
	}
}))

if (sessionSecret == "aRandomSecretThatMustBeChanged3141592"){
	console.log("")
	console.warn("\x1b[31m")
	console.warn("/****************************************************************************\\")
	console.warn("Le secret de session doit être changé pour des raisons évidentes de sécurités")
	console.warn("/****************************************************************************\\")
	console.log("\x1b[0m","\n")
}

//setup routes
const admin = require("./routes/gestion")(db)
const sondage = require("./routes/sondage")(db)
const users = require("./routes/users")(db)

app.get("",(req,res)=>{
	console.log(req.headers.host)//,req.session)
	res.render("index.ejs",{connected:req.session.connected || false})
})

app.use("/gestion",admin)
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