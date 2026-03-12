
let players=JSON.parse(localStorage.getItem("players")||"[]")
let teamsPoints=JSON.parse(localStorage.getItem("teamsPoints")||"{}")
let apiKey=localStorage.getItem("apikey")||""

function save(){
localStorage.setItem("players",JSON.stringify(players))
localStorage.setItem("teamsPoints",JSON.stringify(teamsPoints))
render()
}

function teamUsed(team){
for(let p of players){
if(p.time1===team||p.time2===team)return true
}
return false
}

function addPlayer(){

if(players.length>=10){
alert("Máximo 10 jogadores")
return
}

let nome=document.getElementById("nome").value
let t1=document.getElementById("time1").value
let t2=document.getElementById("time2").value

if(!nome||!t1||!t2){
alert("Preencha tudo")
return
}

if(t1===t2){
alert("Escolha dois times diferentes")
return
}

if(teamUsed(t1)||teamUsed(t2)){
alert("Esse time já foi escolhido")
return
}

players.push({nome:nome,time1:t1,time2:t2})
save()
}

function calc(p){
return (teamsPoints[p.time1]||0)+(teamsPoints[p.time2]||0)
}

function render(){

let ranking=players.map(p=>({
nome:p.nome,
times:p.time1+" + "+p.time2,
pontos:calc(p)
}))

ranking.sort((a,b)=>b.pontos-a.pontos)

let tbody=document.querySelector("#ranking tbody")
tbody.innerHTML=""

ranking.forEach((r,i)=>{

let tr=document.createElement("tr")
tr.innerHTML=`<td>${i+1}</td><td>${r.nome}</td><td>${r.times}</td><td>${r.pontos}</td>`
tbody.appendChild(tr)

})

drawChart(ranking)

}

let chart

function drawChart(data){

let labels=data.map(d=>d.nome)
let values=data.map(d=>d.pontos)

if(chart)chart.destroy()

chart=new Chart(document.getElementById("chart"),{
type:"line",
data:{
labels:labels,
datasets:[{label:"Pontos",data:values}]
}
})

}

function saveKey(){
apiKey=document.getElementById("apikey").value
localStorage.setItem("apikey",apiKey)
}

async function updateFromAPI(){

if(!apiKey){
alert("Coloque API key")
return
}

let res=await fetch("https://api.football-data.org/v4/competitions/BSA/standings",{
headers:{"X-Auth-Token":apiKey}
})

let data=await res.json()

data.standings[0].table.forEach(t=>{
teamsPoints[t.team.name]=t.points
})

save()

}

setInterval(updateFromAPI,3600000)

render()
