const express = require("express")
const router = express.Router()

const bcrypt = require('bcrypt')

const regexVlidator = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.\?\/\~_\+-=\|\]).{8,}$/

module.exports = (db) =>{
	router.get("/login",(req,res)=>{
		res.render("logIn.ejs",{error:[]})
	})
	router.post("/login",(req,res)=>{
		console.log(req.body)
	})
	router.get("/signIn",(req,res)=>{
		res.render("signIn.ejs")
	})
	router.post("/signIn",(req,res)=>{
		console.log(req.body)
	})

	router.get("/exist/",(req,res)=>{
		console.log("New user exist request:",req.query.user)
		//this path verify if user exist and then, send a response
		let sqlQuerry = "SELECT * FROM users WHERE pseudo=?"

		db.get(sqlQuerry,[req.query.user],(err,row)=>{
			if (err)
				throw err
			res.send(Boolean(row))
		})
		
	})
	return router
}