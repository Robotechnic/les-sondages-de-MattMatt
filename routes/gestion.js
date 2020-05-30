const express = require("express")
const router = express.Router()

const bcrypt = require('bcrypt')
const saltRound = 10

const passwordValidator = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.\?\/\~_\+\-=\|]).{8,}$/


module.exports = (db) =>{


	titleExist = (title, callback) =>{
		let sqlQuerry = "SELECT * FROM sondages WHERE title=?"

		db.get(sqlQuerry,[title],(err,row)=>{
			if (err)
				throw err
			callback(Boolean(row))
		})
	}

	router.get("/",(req,res)=>{
		if (req.session.connected){
			let query = "SELECT id, title, responses, strftime('Le %d/%m/%Y à %H:%M:%S', creationDate) AS creationDate, passwordNeeded FROM sondages WHERE userId =?"
			db.all(query,req.session.userId,(err,row) => {
				if (err)
					throw err
				//console.log(row)
				res.render("gestion.ejs",{connected:req.session.connected || false,row:row})
			})
		} else {
			res.redirect("../../users/logIn")
		}
	})

	router.get("/create",(req,res)=>{
		if (req.session.connected){
			res.render("createSondage.ejs",{connected:req.session.connected || false})
		} else {
			res.redirect("../../users/logIn")
		}
	})

	router.post("/create",(req,res)=>{
		if (req.session.connected){
			//verify title
			var body = req.body
			body.description = body.description || "Aucune description"

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

								//hash password
								bcrypt.hash(body.password,saltRound,(err,hash)=>{
									if (err)
										throw err

									db.run(query,[req.session.userId,body.title,body.description,hash],(err)=>{
										if (err)
											throw err
										res.redirect("../../gestion")
									})
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
			res.redirect("../../users/logIn")
		}
	})

	router.get("/edit",(req,res)=>{
		if (req.session.connected){
			
		} else {
			res.redirect("../../users/logIn")
		}
	})
	
	router.get("/delete",(req,res)=>{
		if (req.session.connected){
			let query = "DELETE FROM sondages WHERE id=? AND userId=?"
			let patern = /[0-9]{1,}/
			if (req.query.id.match(patern)){
				db.run(query,[req.query.id, req.session.userId],(err)=>{
					if (err)
						throw err
					res.redirect("/gestion/")
				})
			} else {
				res.redirect("/gestion/")
			}
		} else {
			res.redirect("../../users/logIn")
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