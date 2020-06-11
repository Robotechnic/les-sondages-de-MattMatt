const socket = io.connect(window.origin)

socket.on("connect",(data)=>{
	console.log('Conecté !')
})

socket.on("disconnect",(data)=>{
	console.log('déconecté !')
})

socket.on("newResponse",(data)=>{
	//console.log("new response",data)
	var total = data.total
	var data = data.responses
	//console.log(total)
	//console.log(data)
	data.forEach((element)=>{
		let newData = JSON.parse(element.data)
		let idQuestion = element.questionId
		for (let [key, value] of Object.entries(newData)) {
			let progress = document.getElementById("progress."+String(element.questionId)+"."+String(key))
			let text = document.getElementById("text."+String(element.questionId)+"."+String(key))
			let percent = (value/total*100) || 0
			//console.log(key,total,value,percent)
			progress.value = percent

			text.innerText = `${percent.toFixed(3)}% (${value}/${total})`
			//console.log(key,value)
		}
		//console.log(idQuestion,newData)
	})
})
