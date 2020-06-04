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
	if (title.length < 4 || title.length > 30)
	{
		alert("Le titre ne fait pas la bonne longueur.")
		event.preventDefault();
	}
})

addToolBarInput = () =>{
	console.log('add button for input')
	document.querySelectorAll(".presentationComponent__content__list__question-element__contener").forEach((element)=>{
		var id="delete."+element.id
		var idNav="toolbar."+element.id.split(".")[0]+"."+element.id.split(".")[1]
			//console.log(id)

		var toolBoxElement = document.getElementById(idNav)
		if (toolBoxElement == undefined || typeof(toolBoxElement) == null){
			var toolbar = document.createElement("nav")
			toolbar.setAttribute("id",idNav)
			toolbar.className = "presentationComponent__content__list__question-element__contener__toolbar"
			var button  = document.createElement("button")
			button.setAttribute("id",id)
			button.className = "deleteButton"
			var img     = document.createElement("img")
			img.setAttribute("src","/images/trash.png")

			button.appendChild(img)
			toolbar.appendChild(button)
			element.appendChild(toolbar)
		}
	})
}

// addToolBarQuestion = () =>{
// 	console.log('add button for questions')
// 	document.querySelectorAll(".presentationComponent").forEach( (element, index) => {
// 		var questionIndex = element.id.split('.')[1]
// 		var idNav         = "toolbar."+questionIndex
// 		var id            = element.id.split('.')[2]
// 		var token         = element.id.split(".")[3]

// 		var toolBoxElement = document.getElementById(idNav)
// 		//console.log("toolBar",toolBoxElement)
// 		if (toolBoxElement == undefined || typeof(toolBoxElement) == null){
// 			console.log('addNav')

// 			var toolbar = document.createElement("nav")
// 			toolbar.setAttribute("id",idNav)
// 			toolbar.className = "presentationComponent__toolBar"

// 			var typeChoice = document.createElement("input")
// 			typeChoice.setAttribute("id","typeChoice."+id+".multiple")
// 			typeChoice.setAttribute("name","typeChoice."+id)
// 			typeChoice.setAttribute("type","checkbox")
// 			toolbar.appendChild(typeChoice)

// 			var labelTypeCHoice = document.createElement("label")
// 			labelTypeCHoice.setAttribute("For","typeChoice."+id+".multiple")
// 			labelTypeCHoice.appendChild(document.createTextNode("Réponses multiples"))
// 			toolbar.appendChild(labelTypeCHoice)



// 			var saveButton  = document.createElement("button")
// 			saveButton.setAttribute("id","saveQuestion."+id+"."+token)
// 			saveButton.className = "saveButton"
// 			var img     = document.createElement("img")
// 			img.setAttribute("src","/images/save.png")

// 			saveButton.appendChild(img)
// 			toolbar.appendChild(saveButton)

// 			var deleteButton  = document.createElement("button")
// 			deleteButton.setAttribute("id","deleteQuestion."+id+"."+token)
// 			deleteButton.className = "deleteButton"
// 			var img     = document.createElement("img")
// 			img.setAttribute("src","/images/trash.png")

// 			deleteButton.appendChild(img)
// 			toolbar.appendChild(deleteButton)

// 			element.prepend(toolbar)
// 		}	
// 	})
// }

addToolBarInput()


/*
	ADD choice setup
*/
var choiceGestion = new XMLHttpRequest()

