const express = require("express")
const router = express.Router()

const bcrypt = require('bcrypt')
const saltRound = 10

const passwordValidator = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.\?\/\~_\+\-=\|]).{8,}$/

var idPatern = /[0-9]{1,}/

var escape = require('escape-html');

module.exports = (db) =>{


	titleExist = (title, callback) =>{//verify if title exist
		let sqlQuerry = "SELECT * FROM sondages WHERE title=?"

		db.get(sqlQuerry,[title],(err,row)=>{
			if (err)
				throw err
			callback(Boolean(row))
		})
	}

	isOwner = (userId,sondageId,callback) =>{ //verify if user is the owner of a sondage
		let sqlQuerry = "SELECT *,strftime('Créé le %d/%m/%Y à %H:%M:%S', creationDate) AS creationDate FROM sondages WHERE id=? AND userId=?"
		db.get(sqlQuerry,[sondageId,userId],(err,row)=>{
			if (err)
				throw err
			callback(Boolean(row),row)
		})
	}


	randomString = () => { //generate random string
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}

	router.get("/",(req,res)=>{
		if (req.session.connected){
			req.session.tempToken = randomString() //generate random token to verify the user's identity
			let query = "SELECT id, title, responses, strftime('Le %d/%m/%Y à %H:%M:%S', creationDate) AS creationDate, passwordNeeded FROM sondages WHERE userId =?"
			db.all(query,req.session.userId,(err,row) => {
				if (err)
					throw err
				//console.log(row)
				res.render("gestion.ejs",{connected:req.session.connected || false,row:row,token:req.session.tempToken})
			})
		} else {
			res.redirect("/users/logIn")
		}
	})

	router.get("/create",(req,res)=>{
		if (req.session.connected){
			res.render("createSondage.ejs",{connected:req.session.connected || false})
		} else {
			res.redirect("/users/logIn")
		}
	})

	router.post("/create",(req,res)=>{
		if (req.session.connected){
			//verify title
			var body = req.body
			body.description = escape(body.description) || "Aucune description"

			if (body.title.length < 4 || body.title.length > 30){
				res.render("createSondage.ejs",
						{connected:req.session.connected || false,
							title:body.title,description:body.description,
							error:"Le titre ne fait pas la bonne longueur."})
			}
			else{
				titleExist(body.title,(exist)=>{
					if (exist){
						res.render("createSondage.ejs",
							{connected:req.session.connected || false,
								title:body.title,description:body.description,
								error:"Le titre que vous avez saisis n'est pas disponble."})
					} else {
						if (body.passwordCheckBox){
							let query = "INSERT INTO sondages (userId,title,description,passwordNeeded,password) VALUES (?,?,?,1,?)"
							if (body.password.match(passwordValidator)){
								//the password is not hash because this is not important
								db.run(query,[req.session.userId,body.title,body.description,hash],(err)=>{
									if (err)
										throw err
									res.redirect("/gestion")
								})
							} else {
								res.render("createSondage.ejs",
										{connected:req.session.connected || false,
											title:body.title,description:body.description,
											error:"Le mot de passe ne correspond pas au directives de sécurités."})
							}
						} else {
							let query = "INSERT INTO sondages (userId,title,description) VALUES (?,?,?)"
							db.run(query,[req.session.userId,body.title,body.description],(err)=>{
								if (err)
									throw err
								res.redirect("/gestion")
							})
						}
					}
				})
			}
		} else {
			res.redirect("/users/logIn")
		}
	})


	router.get("/edit/:idSondage",(req,res)=>{
		if (req.session.connected){
			isOwner(req.session.userId,req.params.idSondage,(owner,row)=>{
				if (owner){
					let query = ""
					req.session.tempToken = randomString()
					res.render("editSondage.ejs",{
						connected:req.session.connected || false,
						data:row,
						token:req.session.tempToken
					})
				} else {
					res.redirect("/gestion/")
				}
			})
		} else {
			res.redirect("/users/logIn")
		}
	})

	router.post("/edit/description/:id",(req,res)=>{
		if (req.session.connected){
			if (req.session.tempToken == req.query.token){
				if (req.params.id.match(idPatern)){
					let query = "UPDATE sondages SET description=? WHERE id=? AND userId=?"
					db.run(query,[escape(req.body.description),req.params.id,req.session.userId],(err)=>{
						if (err)
							throw err
						res.redirect("/gestion/edit/"+req.params.id)
					})
				} else {
					res.redirect("/gestion/")
				}
				
			} else {
				res.redirect("/gestion/")
			}
		} else {
			res.redirect("/users/logIn")
		}
	})

	router.post("/edit/password/:id",(req,res)=>{
		if (req.session.connected){
			if (req.session.tempToken == req.query.token){
				if (req.params.id.match(idPatern)){
					if (req.body.password.match(passwordValidator)){
						let query = "UPDATE sondages SET password=? WHERE id=? AND userId=?"
						db.run(query,[req.body.password,req.params.id,req.session.userId],(err)=>{
							if (err)
								throw err
							res.redirect("/gestion/edit/"+req.params.id)
						})
					} else {
						isOwner(req.session.userId,req.params.id,(owner,row)=>{
							if (owner)
								res.render("editSondage.ejs",{
									connected:req.session.connected || false,
									data:row,
									token:req.session.tempToken,
									error:"Le mot de passe ne correspond pas a la politique de sécurité des Sondages de MattMatt."
								})
							else
								res.redirect("/users/logIn")
						})
					}
				} else {
					res.redirect("/gestion/")
				}
				
			} else {
				res.redirect("/gestion/")
			}
		} else {
			res.redirect("/users/logIn")
		}
	})
	

	router.get("/delete/:id",(req,res)=>{
		if (req.session.connected){
			if (req.session.tempToken == req.query.token){
				let query = "DELETE FROM sondages WHERE id=? AND userId=?"
				
				if (req.params.id.match(idPatern)){
					db.run(query,[req.params.id, req.session.userId],(err)=>{
						if (err)
							throw err
						res.redirect("/gestion/")
					})
				} else {
					res.redirect("/gestion/")
				}
			} else {
				res.redirect("/gestion/")
			}
		} else {
			res.redirect("/users/logIn")
		}
	})

	router.get("/exist/",(req,res)=>{
		console.log("Title exist request:",req.query.title)
		//this path verify if user exist and then, send a response
		titleExist(req.query.title,(exist)=>{
			res.send(exist)
		})
	})
	return router
}