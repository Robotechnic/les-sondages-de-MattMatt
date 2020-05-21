const express = require("express")
const router = express.Router()

module.exports = (db) =>{
	router.get("/login",(req,res)=>{
		res.render("logIn.ejs")
	})
	router.get("/signIn",(req,res)=>{
		res.render("signIn.ejs")
	})
	return router
}