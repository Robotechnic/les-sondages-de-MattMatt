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
			window.location = String(window.location.origin)+"/gestion/delete?id="+id

		}
	})
})