const express = require("express")
const router = express.Router()

module.exports = (db) =>{
	router.get("/",(req,res)=>{
		if (req.session.connected){
			let query = "SELECT id, name, responses, creationDate FROM sondages WHERE userId =?"
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
		
	})

	router.get("/edit",(req,res)=>{

	})
	
	router.get("/delete",(req,res)=>{
		
	})
	return router
}