/*
	PASSWORD VALIDATOR
*/
var passwordInput            = document.getElementById("password")
var passwordNumberValidator  = document.getElementById("passwordNumberValidator")
var passwordMajValidator     = document.getElementById("passwordMajValidator")
var passwordMinValidator     = document.getElementById("passwordMinValidator")
var passwordSpetialValidator = document.getElementById("passwordSpetialValidator")
var passwordLengthValidator  = document.getElementById("passwordLengthValidator")
var matchPasswordValidator   = document.getElementById("matchPasswordValidator")

var numberRegex  = /[0-9]{1,}/
var majRegex     = /[A-Z]{1,}/
var minRegex     = /[a-z]{1,}/
var spetialRegex = /[*.!@$%^&(){}\[\]:;<>,.\?\/\~_\+\-=\|]{1,}/

verif = () => {
	var password = passwordInput.value

	//verify if passwors contains least one number
	if (password.match(numberRegex)){
		passwordNumberValidator.classList.add("valide")
	}
	else{
		passwordNumberValidator.classList.remove("valide")
	}

	//verify if passwors contains least one capital letter
	if (password.match(majRegex)){
		passwordMajValidator.classList.add("valide")
	}
	else{
		passwordMajValidator.classList.remove("valide")
	}

	//verify if passwors contains least one letter
	if (password.match(minRegex)){
		passwordMinValidator.classList.add("valide")
	}
	else{
		passwordMinValidator.classList.remove("valide")
	}

	//verify if passwors contains least one spetial caracter
	if (password.match(spetialRegex)){
		passwordSpetialValidator.classList.add("valide")
	}
	else{
		passwordSpetialValidator.classList.remove("valide")
	}

	//verify if passwors contains least one spetial caracter
	if (password.length > 8){
		passwordLengthValidator.classList.add("valide")
	}
	else{
		passwordLengthValidator.classList.remove("valide")
	}
}

passwordInput.addEventListener("input",verif)
verif()

var questionsContener = document.querySelector(".form-contener__form")

createNewQuestion = (questionId,questionTitle,responses,type="single") =>{
	var contener        = document.createElement("div")
	contener.className  = "presentationComponent"
	
	var title           = document.createElement("h3")
	title.className     = "presentationComponent__title"
	console.log(document.createTextNode(title))
	title.appendChild(document.createTextNode(questionTitle))
	contener.appendChild(title)

	var content         = document.createElement("nav")
	content.className   = "presentationComponent__content-extended"

	var questions       = document.createElement("ol")
	questions.className = "presentationComponent__content__list"
	
	content.appendChild(questions)
	contener.appendChild(content)

	responses.forEach( (element, index) => {
		let listElement = document.createElement("li")
		let input = document.createElement("input")
		let label = document.createElement("label")
		switch (type) {
			case "multiple":
				input.setAttribute("type", "checkbox")
				input.className = "normal"
				break
			case "single":
				input.setAttribute("type", "radio")
				input.setAttribute("required","")
				break
			default:
				console.error("Le type spétifié n'existe pas")
				return
				break
		}
		input.setAttribute("name","responseFor"+String(questionId))
		input.setAttribute("id","responseFor"+String(questionId)+"_"+String(index))

		label.appendChild(document.createTextNode(element))
		label.setAttribute("For","responseFor"+String(questionId)+"_"+String(index))

		listElement.appendChild(input)
		listElement.appendChild(label)

		//console.log(listElement)

		questions.appendChild(listElement)
	})

	questionsContener.appendChild(contener)
}

