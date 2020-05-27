const express = require("express")
const router = express.Router()

const bcrypt = require('bcrypt')
const saltRound = 10

const passwordValidator = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.\?\/\~_\+\-=\|]).{8,}$/

module.exports = (db) =>{

	userExist = (user, callback) =>{
		let sqlQuerry = "SELECT * FROM users WHERE pseudo=?"

		db.get(sqlQuerry,[user],(err,row)=>{
			if (err)
				throw err
			callback(Boolean(row))
		})
	}

	router.get("/login",(req,res)=>{
		res.render("logIn.ejs",{connected:req.session.connected || false})
	})

	router.post("/login",(req,res)=>{
		var body = req.body
		//console.log(body)
		let query = "SELECT pseudo, password, isAdmin FROM users WHERE pseudo = ?"
		db.get(query,[body.pseudo],(err,row)=>{
			if (err)
				throw err
			//verify if user exist
			//console.log(row)
			if (row){
				bcrypt.compare(body.password,row.password, (err,result)=>{
					if (result){
						req.session.connected = true
						req.session.pseudo = row.pseudo
						//if is admin, verify in bdd else don't verify
						req.session.isAdmin = row.isAdmin
						//console.log(row)
						res.redirect("../../")
					}
					else{
						res.render("logIn.ejs",{connected:req.session.connected || false,pseudo:body.pseudo,error:"Le mot de passe est incorect"})
					}
				})

			} else {
				res.render("logIn.ejs",{connected:req.session.connected || false,pseudo:body.pseudo,error:"Le pseudo n'existe pas"})
			}
		})
	})

	router.get("/signIn",(req,res)=>{
		res.render("signIn.ejs",{connected:req.session.connected || false})
	})
	router.post("/signIn",(req,res)=>{
		var body = req.body
		body.pseudo = escape(body.pseudo)
		//console.log(body)
		//first, verify if the pseudo exist
		userExist(req.query.user,(exist)=>{
			if (exist)
				res.render("signIn.ejs",{connected:req.session.connected || false,pseudo:body.pseudo,error:"Le pseudo existe déjà."})
			
			else {
				if (body.pseudo.length < 4 || body.pseudo.lenght > 15){
					res.render("signIn.ejs",{connected:req.session.connected || false,pseudo:body.pseudo,error:"Le pseudo ne fait pas la bonne longueur."})
				}
				else {
			
					//verify if passwords match
					if (body.password != body.passwordRepeat)
						res.render("signIn.ejs",{connected:req.session.connected || false,pseudo:body.pseudo,error:"Les mots de passes ne correspondent pas."})
					
					else {
				
						//veridy if password match with regex
						if (body.password.match(passwordValidator)){
							let query = "INSERT INTO users (pseudo,password) VALUES (?,?)"

							//hash password
							bcrypt.hash(body.password,saltRound,(err,hash)=>{
								if (err)
									throw err
								db.run(query,[body.pseudo,hash],(err) =>{
									if (err)
										throw err
									console.log("New user has been create:",body.pseudo)
									res.redirect("../../")
								})
							})
						}	
						else{
							res.render("signIn.ejs",{connected:req.session.connected || false,pseudo:body.pseudo,error:"Le mot de passe est incorect"})
						}
					}
				}
			}
			
		})
	})


	router.get("/configuration",(req,res)=>{
		if (req.session.connected){
			var pseudo = session.pseudo
			res.render("userConfiguration.ejs",{connected:req.session.connected || false,pseudo:body.pseudo})
		}
		else{
			res.redirect("../../")
		}
	})

	router.post("/passwordChange",(req,res)=>{
		
	})

	router.post("/pseudoChange",(req,res)=>{
		
	})

	router.get("/exist/",(req,res)=>{
		console.log("New user exist request:",req.query.user)
		//this path verify if user exist and then, send a response
		userExist(req.query.user,(exist)=>{
			res.send(exist)
		})
	})

	router.get("/disconnect",(req,res)=>{
		req.session.destroy((err) => {
		  if (err)
		  	throw err
		  res.redirect("../../")
		})
	})
	return router
}