/*
	ALERT FOR ALL BUTTONS
*/

//delete buttons
document.querySelectorAll(".deleteButton").forEach((element)=>{
	element.addEventListener("click", (event)=>{
		console.log(event)
		let sender = event.target
		console.log("Supression de",sender.id)
		if (confirm("Êtes vous sur de vouloir suprimmer le sondage \""+sender.name+"\"?\nToutes les données serons perdues et il n'est pas possible de revenir en arrière."))
		{
			console.log(sender.id)
			var id = sender.id.split(".")[1]
			var token = sender.id.split(".")[2]
			window.location = String(window.location.origin)+"/gestion/delete/"+id+"?token="+token

		}
	})
})

//generate Link Button
document.querySelectorAll(".generateLinkButton").forEach((element)=>{
	element.addEventListener("click",(event)=>{
		let sender = event.target
		var id = sender.id.split(".")[1]
		window.location = String(window.location.origin)+"/sondage/generateLink/"+id
	})
})


//edit buttons
document.querySelectorAll(".editButton").forEach((element)=>{
	element.addEventListener("click",(event)=>{
		let sender = event.target
		var id = sender.id.split(".")[1]
		window.location = String(window.location.origin)+"/gestion/edit/"+id
	})
})

//publish buttons
document.querySelectorAll(".publishButton").forEach((element)=>{
	element.addEventListener("click",(event)=>{
		let sender = event.target
		var id = sender.id.split(".")[1]
		var token = sender.id.split(".")[2]
		if (confirm("Attention, la publication d'un sondage le rend impossible a modifier.\nÊtes vous sur de vouloir continuer ?\nCette action est irréversible."))
			window.location = String(window.location.origin)+"/gestion/publish/"+id+"?token="+token
	})
})