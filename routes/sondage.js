const express = require("express")
const token = require("jsonwebtoken")

const router = express.Router()

module.exports = (db) =>{

	isOwner = (userId,sondageId,callback) =>{ //verify if user is the owner of a sondage
		let sqlQuerry = "SELECT *,strftime('Créé le %d/%m/%Y à %H:%M:%S', creationDate) AS creationDate FROM sondages WHERE id=? AND userId=?"
		db.get(sqlQuerry,[sondageId,userId],(err,row)=>{
			if (err)
				throw err
			callback(Boolean(row),row)
		})
	}

	router.get("/:token",(req,res)=>{
	
	})
	
	router.get("/generateLink/:idSondage",(req,res)=>{
		if (req.session.connected){
			isOwner(req.session.userId,req.params.idSondage,(owner,row)=>{
				if (owner){
					res.render("generateLink.ejs",{connected:req.session.connected || false,data:row})
				} else {
					res.redirect("/gestion/")
				}
			})
		} else {
			res.redirect("/users/logIn")
		}
	})
	return router
}