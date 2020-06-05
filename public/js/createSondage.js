var titleInput           = document.getElementById("title")
var titleValidator       = document.getElementById("titleValidator")
var titleLengthValidator = document.getElementById("titleLengthValidator")

var titleHttpRequest = new XMLHttpRequest()

titleHttpRequest.addEventListener('load', () => {
	if (titleHttpRequest.status == 200){
		response = JSON.parse(titleHttpRequest.responseText)//get response of the server
    	console.log("Le titre est disponible:",!response)

    	//set the class of the validator
    	/*
		 *	valide
		 *	loading
    	 */
    	 if (response){
    	 	titleValidator.classList.remove("loading")
    	 	titleValidator.classList.remove("valide")
    	 } else {
    	 	titleValidator.classList.remove("loading")
    	 	titleValidator.classList.add("valide")
    	 }
	}
	else{
		console.log("erreur, impossible de vérifier le titre")
	}
	
})

/*
	TITLE VALIDATOR
*/

titleInput.addEventListener("input", ()=>{
	//send a request to the server
	var title = titleInput.value
	var baseTitle = baseTitle || "";

	if (baseTitle == title){
		titleValidator.classList.add("valide")
	} else {
		var encodedtitle = encodeURIComponent(title)
		console.log("get user at",window.origin+"/gestion/exist?title="+encodedtitle)

		titleHttpRequest.open('GET',window.origin+"/gestion/exist?title="+encodedtitle)
		titleValidator.classList.remove("valide")
		titleValidator.classList.add("loading")
		titleHttpRequest.send(null)
	}
	if (title.length > 3 && title.length < 51){
		titleLengthValidator.classList.add('valide')
	}
	else{
		titleLengthValidator.classList.remove('valide')
	}
})




/*
	PASSWORD VERIFICATION
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