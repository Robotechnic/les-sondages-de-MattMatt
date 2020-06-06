var linkGetter    = new XMLHttpRequest()

var timeForm      = document.getElementById("timeForm")
var wait          = document.getElementById("wait")
var displayLink   = document.getElementById("displayLink")
var generatedLink = document.getElementById("generatedLink")


linkGetter.addEventListener("readystatechange",(event)=>{
	if (linkGetter.readyState == XMLHttpRequest.DONE){
		if (linkGetter.status == 200){
			generatedLink.value = linkGetter.responseText
			timeForm.style.display = 'none'
			wait.style.display = ''
			displayLink.style.display = 'flex'
		} else {
			alert("Erreur:\nCode "+String(linkGetter.status)+",\nMessage:"+linkGetter.responseText+",\nVeullez contacter l'administrateur pour plus d'informations.")
		}
	}
})
linkGetter.addEventListener("abort",(event)=>{
	console.log('request canceled')
})

timeForm.addEventListener("submit", (event)=>{
	var sender = event.target
	linkGetter.open("POST","/sondage/generateLink/"+sender.idSondage.value)
	console.log(sender.day.value)
	linkGetter.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	linkGetter.send("forever="+String(sender.forever.checked)+
					"&day="+sender.day.value+
					"&hours="+sender.hours.value+
					"&minutes="+sender.minutes.value+
					"&location="+window.location.origin
					)
	console.log('request has been send')
	timeForm.style.display = 'none'
	wait.style.display = 'flex'
	displayLink.style.display = ''
	event.preventDefault()
})

var timeContener = document.getElementById("timeContener")

document.getElementById("forever").addEventListener("input",(event)=>{
	if (event.target.checked){
		var nodes = timeContener.getElementsByTagName('*');
		for(var i = 0; i < nodes.length; i++){
		     nodes[i].disabled = true;
		}
	} else {
		var nodes = timeContener.getElementsByTagName('*');
		for(var i = 0; i < nodes.length; i++){
		     nodes[i].disabled = false;
		}
	}
})

document.getElementById("cancelButton").addEventListener("click",(event)=>{
	linkGetter.abort()
	timeForm.style.display = ''
	wait.style.display = ''
	displayLink.style.display = ''
})

document.getElementById("rewind").addEventListener("click",(event)=>{
	linkGetter.abort()
	timeForm.style.display = ''
	wait.style.display = ''
	displayLink.style.display = ''
})