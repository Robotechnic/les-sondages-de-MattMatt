var questionsContener = document.querySelector(".form-contener__form")


/*
	ADD SONDAGE
*/

document.getElementById("addQuestion").addEventListener("click",(event)=>{
	document.getElementById("newQuestion").style.display = "block"
	event.target.style.display = "none";
})

document.getElementById("cancel").addEventListener("click",(event)=>{
	document.getElementById("newQuestion").style.display = ""
	document.getElementById("addQuestion").style.display = "";
})

document.getElementById("newQuestion").addEventListener("submit", (event)=>{
	var title = event.target.title.value
	console.log(title)
	if (title.length < 4 || title.length > 51)
	{
		alert("Le titre ne fait pas la bonne longueur.")
		event.preventDefault();
	}
})

var titleInput           = document.getElementById("title")
var titleLengthValidator = document.getElementById("titleLengthValidator")

titleInput.addEventListener("input", ()=>{
	//send a request to the server
	var title = titleInput.value

	if (title.length > 3 && title.length < 51){
		titleLengthValidator.classList.add('valide')
	}
	else{
		titleLengthValidator.classList.remove('valide')
	}
})


buttonToolBarEvent = (event) =>{
	var sender     = event.target

	if(sender.nodeName == "IMG") //the button contain an image so,
	// if this is the image wich send the event, we take his parent (the button)
		sender = sender.parentNode

	//console.log(sender)
	var actionId   = sender.id.split("_")[1]
	var action     = sender.id.split("_")[0]
	
	var questionId = actionId.split(".")[0]
	var index      = actionId.split(".")[1]
	var token      = actionId.split(".")[2]
	//console.log(questionId,index,token)

	//console.log("list."+questionId)
	var buttonsList = document.getElementById("list."+questionId)
	//console.log(buttonsList)

	var choix = document.getElementById("choix."+questionId+"."+index)

	console.log(choix)

	if (action == "delete"){
		buttonsList.removeChild(choix)
		document.getElementById("question."+questionId).classList.add("unsaved")
	} else if (action == "down"){
		console.log("down")
		console.log(choix,buttonsList.lastChild)
		var downElement = choix.nextElementSibling
		//if element is the last child
		if (downElement == undefined || typeof(downElement) == null){
			var downElement = buttonsList.firstElementChild
			console.log('lastChild',downElement)
			buttonsList.insertBefore(choix, downElement)
		} else
			buttonsList.insertBefore(downElement, choix)
		document.getElementById("question."+questionId).classList.add("unsaved")

	} else if (action == "up") {
		var upElement = choix.previousElementSibling
		if (upElement == undefined || typeof(upElement) == null){
			var upElement = buttonsList.lastElementChild
			console.log('lastChild',downElement)
			buttonsList.insertBefore(choix, upElement)
			buttonsList.insertBefore(upElement, choix)
		} else
			buttonsList.insertBefore(choix, upElement)
		document.getElementById("question."+questionId).classList.add("unsaved")
	}
}



addToolBarInput = () =>{
	//console.log('add button for input')
	document.querySelectorAll(".presentationComponent__content__list__question-element__contener").forEach((element)=>{
		var id    = element.id
		var idNav = "toolbar."+element.id.split(".")[0]+"."+element.id.split(".")[1]
			//console.log(id)

		var toolBoxElement = document.getElementById(idNav)
		if (toolBoxElement == undefined || typeof(toolBoxElement) == null){ //if the element haven't delete button
			var toolbar = document.createElement("nav")
			toolbar.setAttribute("id",idNav)
			toolbar.className = "presentationComponent__content__list__question-element__contener__toolbar"
			
			//deleteButton
			var deleteButton             = document.createElement("button")
			deleteButton.setAttribute("id","delete_"+id)
			deleteButton.className       = "deleteButton"
			
            //upButton
			var upButton                 = document.createElement("button")
			upButton.setAttribute("id","up_"+id)
			upButton.className           = "upButton"
			
            //downButton
			var downButton               = document.createElement("button")
			downButton.setAttribute("id","down_"+id)
			downButton.className         = "downButton"
			
            //add Event listener to buttons
			deleteButton.addEventListener("click",buttonToolBarEvent)
			downButton.addEventListener("click",buttonToolBarEvent)
			upButton.addEventListener("click",buttonToolBarEvent)
			
			var deleteImg                = document.createElement("img")
			deleteImg.setAttribute("src","/images/trash.png")
			var upImg                    = document.createElement("img")
			upImg.setAttribute("src","/images/arrowUp.png")
			var downImg                  = document.createElement("img")
			downImg.setAttribute("src","/images/arrowDown.png")
			
			deleteButton.appendChild(deleteImg)
			downButton.appendChild(downImg)
			upButton.appendChild(upImg)
			
			toolbar.appendChild(upButton)
			toolbar.appendChild(downButton)
			toolbar.appendChild(deleteButton)
			element.appendChild(toolbar)
		}
	})
}

addToolBarInput()


/*
	CHOICE SETUP
*/
var saveCHoices = new XMLHttpRequest()


//add choices

//setup an index for every questions
indexMap = {}
document.querySelectorAll(".presentationComponent__content__list").forEach((element)=>{
	indexMap[element.id] = element.childElementCount
})

document.querySelectorAll(".presentationComponent__content-extended__addChoiceButton").forEach( (element) => {
	element.addEventListener("click",(event)=>{

		var sender     = event.target

		if(sender.nodeName == "IMG")
			sender = sender.parentNode

		//console.log(sender)

		var id         = sender.name.split(".")[0]
		var questionId = sender.name.split(".")[1]
		var token      = sender.name.split(".")[2]

		//console.log("list."+questionId)

		var buttonsList = document.getElementById("list."+questionId)
		document.getElementById("question."+questionId).classList.add("unsaved")
		var lastIndex   =  indexMap[buttonsList.id]
		indexMap[buttonsList.id] += 1

		//console.log(lastIndex)

		//create new line
		var listElement       = document.createElement("li")
		listElement.className = "presentationComponent__content__list__question-element"
		listElement.setAttribute("id","choix."+questionId+"."+String(lastIndex))
		var contener          = document.createElement("div")
		contener.className    = "presentationComponent__content__list__question-element__contener"
		contener.setAttribute("id",questionId+"."+String(lastIndex)+"."+token)
		var label             = document.createElement("label")
		var textInput         = document.createElement("input")
		textInput.className = "choicesTextInput"
		textInput.setAttribute("type","text")
		textInput.setAttribute("name","textValue."+questionId+"."+String(lastIndex))

		label.appendChild(textInput)
		contener.appendChild(label)
		listElement.appendChild(contener)
		buttonsList.appendChild(listElement)

		addToolBarInput()

		/*
		<li class="presentationComponent__content__list__question-element" id="choix.<%=question.id%>.<%=indexChoix%>">
			<div 
			class="presentationComponent__content__list__question-element__contener"
			id="<%=question.id%>.<%=indexChoix%>.<%=token%>">
				<label For="">
				<input 
					type="text" 
					name="textValue.<%=question.id%>.<%=indexChoix%>"
					value="<%=choix%>">
				</label>
			</div>
		</li>*/
	})
})


//save button

saveCHoices.addEventListener("readystatechange",(event)=>{
	if (saveCHoices.readyState == XMLHttpRequest.DONE){
		if (saveCHoices.status == 404){
			alert("Erreur:\nCode 404,\nMessage: page introuvable,\nVeullez contacter l'administrateur pour plus d'informations.")
			return
		}
		var response = JSON.parse(saveCHoices.responseText)
		console.log(response)
		if (saveCHoices.status == 200){
			if (response[0] == true){
				document.getElementById("question."+response[2]).classList.remove("unsaved")
			} else {
				alert("Erreur:\nMessage:"+response[1])
			}
			
		} else {
			alert("Erreur:\nCode "+String(saveCHoices.status)+",\nMessage:"+response[1]+",\nVeullez contacter l'administrateur pour plus d'informations.")
		}
	}
})

saveQuestion = (id,questionId,token) =>{
	var buttonsList = document.getElementById("list."+questionId)
		
	var choices = []
	Array.from(buttonsList.getElementsByClassName("choicesTextInput")).forEach( (element, index) => {
		choices.push(element.value)
	})

	var typeChoice = document.getElementById("typeChoice."+questionId+".multiple")


	//console.log(JSON.stringify(choices))

	//create url
	saveCHoices.open("POST","/gestion/edit/"+id+"/"+questionId+"/updateChoixList?token="+token)
	saveCHoices.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	saveCHoices.send("choices="+JSON.stringify(choices)+"&multiple="+String(typeChoice.checked))
}


document.querySelectorAll(".choicesTextInput").forEach( (element, index) => {
	element.addEventListener("input",(event)=>{
		console.log('change')
		var questionId = event.target.name.split(".")[1]
		document.getElementById("question."+questionId).classList.add("unsaved")
	})	
})

document.querySelectorAll(".saveButton").forEach((element)=>{
	element.addEventListener("click",(event)=>{
		var sender     = event.target

		if(sender.nodeName == "IMG")
			sender = sender.parentNode

		var id         = sender.id.split(".")[1]
		var questionId = sender.id.split(".")[2]
		var token      = sender.id.split(".")[3]
		console.log(id,questionId,token)
		

		//save
		saveQuestion(id,questionId,token)
	})
})


var idIntervalMap = {}


document.querySelectorAll(".presentationComponent").forEach( (element, index) => {
	//console.log(element)
	element.addEventListener("input",(event)=>{
		var sender = event.target

		//get original sender
		while (! sender.classList.contains("presentationComponent")) {
			sender = sender.parentNode
			//console.log(sender)
		}

		var questionId = sender.id.split(".")[1]
		var buttonsList = document.getElementById("list."+questionId)
		var name = sender.getAttribute("name").split(".")
		//console.log(name)
		var id = name[0]
		var token = name[1]

		var intervalId = idIntervalMap[sender.id]
		if (intervalId == -1 || intervalId == undefined ){
			console.log('new interval')
			idIntervalMap[sender.id] = setTimeout(()=>{
				saveQuestion(id,questionId,token)
				idIntervalMap[sender.id] = -1
			}, 5000);
		}
	})
	element.addEventListener("click",(event)=>{
		var sender = event.target

		//get original sender
		while (! sender.classList.contains("presentationComponent")) {
			sender = sender.parentNode
			//console.log(sender)
		}

		var questionId = sender.id.split(".")[1]
		var buttonsList = document.getElementById("list."+questionId)
		var name = sender.getAttribute("name").split(".")
		//console.log(name)
		var id = name[0]
		var token = name[1]

		var intervalId = idIntervalMap[sender.id]
		if (intervalId == -1 || intervalId == undefined ){
			console.log('new interval')
			idIntervalMap[sender.id] = setTimeout(()=>{
				saveQuestion(id,questionId,token)
				idIntervalMap[sender.id] = -1
			}, 5000);
		}
	})
})