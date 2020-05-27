/*
	PSEUDO VERIFICATION
*/

var pseudoInput           = document.getElementById("pseudo")
var pseudoValidator       = document.getElementById("pseudoValidator")
var pseudoLengthValidator = document.getElementById("pseudoLengthValidator")

var pseudoHttpRequest = new XMLHttpRequest()

pseudoHttpRequest.addEventListener('load', () => {
	if (pseudoHttpRequest.status == 200){
		response = JSON.parse(pseudoHttpRequest.responseText)//get response of the server
    	console.log("Le pseudo est disponible:",!response)

    	//set the class of the validator
    	/*
		 *	valide
		 *	loading
    	 */
    	 if (response){
    	 	pseudoValidator.classList.remove("loading")
    	 	pseudoValidator.classList.remove("valide")
    	 } else {
    	 	pseudoValidator.classList.remove("loading")
    	 	pseudoValidator.classList.add("valide")
    	 }
	}
	else{
		console.log("erreur, impossible de vérifier le pseudo")
	}
	
})

/*
	PSEUDO VALIDATOR
*/

pseudoInput.addEventListener("input", ()=>{
	//send a request to the server
	var pseudo = pseudoInput.value
	var encodedPseudo = encodeURIComponent(pseudo)
	console.log("get user at",window.origin+"/users/exist/?user="+encodedPseudo)

	pseudoHttpRequest.open('GET',window.origin+"/users/exist/?user="+encodedPseudo)
	pseudoValidator.classList.remove("valide")
	pseudoValidator.classList.add("loading")
	pseudoHttpRequest.send(null)

	if (pseudo.length > 4 && pseudo.length < 16){
		pseudoLengthValidator.classList.add('valide')
	}
	else{
		pseudoLengthValidator.classList.remove('valide')
	}
})

/*
	PASSWORD VALIDATOR
*/
var passwordInput            = document.getElementById("password")
var passwordVerif            = document.getElementById("passwordRepeat")
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

passwordInput.addEventListener("input", ()=>{
	var password = passwordInput.value
	var passwordRepeat = passwordVerif.value

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
	if (passwordRepeat == password && passwordRepeat.length > 0){
		matchPasswordValidator.classList.add("valide")
	} else {
		matchPasswordValidator.classList.remove("valide")
	}
})

/*
	PASSWORD VERIFICATION
*/

passwordVerif.addEventListener("input", ()=>{
	var passwordRepeat = passwordVerif.value
	var password = passwordInput.value

	//if password match
	if (passwordRepeat == password && passwordRepeat.length > 0){
		matchPasswordValidator.classList.add("valide")
	} else {
		matchPasswordValidator.classList.remove("valide")
	}
})