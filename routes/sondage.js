const express = require("express")
const token = require("jsonwebtoken")

const router = express.Router()

var idPatern = /[0-9]{1,}/

var timePatern = /[0-9]{1,2}/

var tokenSecret = "LeSondagesDeMattMattSignatureSecrète274684568412é787\"45\"@çè-t"

if (tokenSecret == "LeSondagesDeMattMattSignatureSecrète274684568412é787\"45\"@çè-t"){
	console.log("")
	console.warn("\x1b[31m")
	console.warn("/****************************************************************************\\")
	console.warn("Le secret du token doit être changé pour des raisons évidentes de sécurités")
	console.warn("/****************************************************************************\\")
	console.log("\x1b[0m","\n")
}


module.exports = (db) =>{

	isOwner = (userId,sondageId,callback) =>{ //verify if user is the owner of a sondage
		let sqlQuerry = "SELECT *,strftime('Créé le %d/%m/%Y à %H:%M:%S', creationDate) AS creationDate FROM sondages WHERE id=? AND userId=?"
		db.get(sqlQuerry,[sondageId,userId],(err,row)=>{
			if (err)
				throw err
			callback(Boolean(row),row)
		})
	}

	router.get("/generateLink/:idSondage",(req,res)=>{
		if (req.session.connected)
			if (req.params.idSondage.match(idPatern))
				isOwner(req.session.userId,req.params.idSondage,(owner,row)=>{
					if (owner){
						if (row.published){
							res.render("generateLink.ejs",{connected:req.session.connected || false,data:row})
						} else {
							res.redirect("/gestion/?error="+encodeURI("Le sondage n'a pas encore été publié. \\nVeuillez publier le sondage avant de créer le lien."))
						}
					} else {
						res.redirect("/gestion/")
					}
				})
			else
				res.redirect("/gestion/")
		else
			res.redirect("/users/logIn")
	})

	router.post("/generateLink/:idSondage",(req,res)=>{
		var body = req.body
		if (req.session.connected)
			if (req.params.idSondage.match(idPatern))
				isOwner(req.session.userId,req.params.idSondage,(owner,row)=>{
					if (owner){
						//console.log(req.body)
						if (body.forever == "true"){
							var expiresIn = 154000000000 //10 000 years
						} else {
							var expiresIn = 0
							if (body.day.match(idPatern)){
								expiresIn += Number(body.day) * 86400
							}
							//console.log(Number(body.day) * 86400)
							if (body.hours.match(timePatern)){
								expiresIn += Number(body.hours) * 3600
							}
							//console.log(Number(body.hours) * 3600)
							if (body.minutes.match(timePatern)){
								expiresIn += Number(body.minutes) * 60
							}
						}
						console.log(expiresIn)
						var sondageToken = token.sign({
							sondageId:row.id,
							title:row.title,
							password:row.passwordNeeded,
							exp: Math.floor(Date.now() / 1000) + expiresIn
						},tokenSecret)

						res.send(req.body.location+"/sondage/"+sondageToken)
					} else {
						res.status(403).send("This is not your sondage")
					}
				})
			else
				res.status(400).send("The id has not the right format")
		else
			res.status(401).send("You are not connected")
	})


	router.get("/:token",(req,res)=>{
		token.verify(req.params.token,tokenSecret,(err,decoded)=>{
			
			if (err)
			{
				console.log('err')
				res.redirect("../../../?error="+encodeURI("Le lien est invalide"))
			} else {
				let query = "SELECT *,strftime('Créé le %d/%m/%Y à %H:%M:%S', creationDate) AS creationDate FROM sondages WHERE id=?"

				db.get(query,[decoded.sondageId],(err,row)=>{
					if (err)
						throw err
					if (row){
						if (row.passwordNeeded){
							if (req.session.sondageAccess){
								if (req.session.sondageAccess.includes(decoded.sondageId)){
									let query = "SELECT * FROM questions WHERE idSondage=?"
									db.all(query,[row.id],(err,questions)=>{
										res.render("sondage.ejs",{connected:req.session.connected || false,data:row,questions:questions,token:req.params.token})
									})
								} else {
									res.render("passwordSondage.ejs",{connected:req.session.connected || false,error:req.query.error})
								}
							} else {
								res.render("passwordSondage.ejs",{connected:req.session.connected || false,error:req.query.error})								
							}
						} else {
							let query = "SELECT * FROM questions WHERE idSondage=?"
							db.all(query,[row.id],(err,questions)=>{
								res.render("sondage.ejs",{connected:req.session.connected || false,data:row,questions:questions,token:req.params.token})
							})
						}
					} else {
						res.redirect("../../../?error="+encodeURI("Le sondage n'existe pas"))
					}
				})
			}
		})
	})

	router.post("/:token",(req,res)=>{
		token.verify(req.params.token,tokenSecret,(err,decoded)=>{
			if (err)
			{
				console.log('err')
				res.redirect("../../../?error="+encodeURI("Le lien est invalide"))
			} else {
				let query = "SELECT passwordNeeded, password FROM sondages WHERE id=?"

				db.get(query,[decoded.sondageId],(err,row)=>{
					if (err)
						throw err
					if (row){
						console.log(row)
						if (row.passwordNeeded){
							if (row.password == req.body.password){
								if(req.session.sondageAccess){
									if (!req.session.sondageAccess.includes(decoded.sondageId))
										req.session.sondageAccess.push(decoded.sondageId)
								} else {
									req.session.sondageAccess = [decoded.sondageId]
								}
								res.redirect("/sondage/"+req.params.token)
							} else {
								res.redirect("/sondage/"+req.params.token+"?error="+encodeURI("Le mo de passe est incorect"))
							}
						} else {
							res.redirect("/sondage/"+req.params.token)
						}
					} else {
						res.redirect("../../../?error="+encodeURI("Le sondage n'existe pas"))
					}
				})
			}
		})
	})

	var keyValidator = /responseFor.([0-9]{1,}).([0-9]{1,})/

	isEmpty = (obj) => {
	    return Object.keys(obj).length === 0;
	}

	router.post("/response/:token",(req,res)=>{
		token.verify(req.params.token,tokenSecret,(err,decoded)=>{//verify if token is valid token
			
			if (err)
			{
				console.log('err')
				res.redirect("../../../?error="+encodeURI("Le lien est invalide"))
			} else {
				db.serialize(()=>{
					let query = "SELECT *,strftime('Créé le %d/%m/%Y à %H:%M:%S', creationDate) AS creationDate FROM sondages WHERE id=?"

					db.get(query,[decoded.sondageId],(err,sondageRow)=>{ //get sondageData
						if (err)
							throw err
						if (row){ //if sondage exist
							
							try {// try to update all
								db.run("BEGIN TRANSACTION")
								//update response number
								db.run("UPDATE sondages SET responses = responses + 1 WHERE id=?",[decoded.sondageId],(err)=>{
									if (err)
										throw err
								})

								//update responses
								let getResponsses = "SELECT * FROM responsses WHERE sondageId = ?"
								for (let [key, value] of Object.entries(req.body)) {
									let values = key.match(keyValidator)

									if (values){
										if (values[1] == decoded.sondageId){

											let query = "SELECT * FROM questions WHERE id=?"
											db.get(query,[values[2]],(err,questionRow)=>{
												if (err)
													throw err
												if (row)
													db.get(getResponsses,[decoded.sondageId],(err,responsseRow)=>{
														if (row){
															let data = JSON.parse(row.data)

															let query = "UPDATE responsses SET data = ? WHERE sondageId = ?"
														} else {
															let query = "INSERT INTO responsses(sondageId,data) VALUES (?,?)"
															db.run(query,[decoded.sondageId,""],(err)=>{
																if (err)
																	throw err
															})
														}
													})
											})
										}
									}
									//console.log(values)
									console.log(`${key}: ${value} ${value.constructor == Array}`);
								}
								//throw e //generate error for test
								// if (typeof value == "string" && row.type == "single"){

								// } else if (value.constructor == Array && row.type = "multiple"){

								// }
								//db.run("COMMIT")
							} catch(e) {
								console.log(e);
								db.run("ROLLBACK")
							}
							
							req.body.row = row
							res.send(req.body)
						} else {
							res.redirect("../../../?error="+encodeURI("Le sondage n'existe pas"))
						}
					})
				})
			}
		})
	})
	return router
}
