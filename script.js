
const codes={
"ERLO1":"Jogador1",
"ERLO2":"Jogador2",
"ERLO3":"Jogador3",
"ERLO4":"Jogador4",
"ERLO5":"Jogador5",
"ERLO6":"Jogador6",
"ERLO7":"Jogador7",
"ERLO8":"Jogador8",
"ERLO9":"Jogador9",
"ERLO10":"Jogador10"
}

let currentUser=null
let players=JSON.parse(localStorage.getItem("players")||"{}")
let teamsPoints=JSON.parse(localStorage.getItem("teamsPoints")||"{}")
let apiKey=localStorage.getItem("apikey")||""

function login(){
let code=document.getElementById("code").value
if(codes[code]){
currentUser=codes[code]
document.getElementById("loginScreen").style.display="none"
document.getElementById("app").style.display="block"
render()
}else{
alert("Código inválido")
}
}

function save(){
localStorage.setItem("players",JSON.stringify(players))
localStorage.setItem("teamsPoints",JSON.stringify(teamsPoints))
render()
}

function saveTeams(){
let t1=document.getElementById("team1").value
let t2=document.getElementById("team2").value

players[currentUser]={team1:t1,team2:t2}
save()
}

function updateTeam(){
let t=document.getElementById("team").value
let p=parseInt(document.getElementById("points").value)
teamsPoints[t]=p
save()
}

function calc(p){
return (teamsPoints[p.team1]||0)+(teamsPoints[p.team2]||0)
}

function render(){

let ranking=[]

for(let name in players){
ranking.push({name:name,points:calc(players[name])})
}

ranking.sort((a,b)=>b.points-a.points)

let tbody=document.querySelector("#ranking tbody")
tbody.innerHTML=""

ranking.forEach((r,i)=>{
let tr=document.createElement("tr")
tr.innerHTML=`<td>${i+1}</td><td>${r.name}</td><td>${r.points}</td>`
tbody.appendChild(tr)
})

renderChart(ranking)
}

let chart

function renderChart(data){

let labels=data.map(d=>d.name)
let values=data.map(d=>d.points)

if(chart) chart.destroy()

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
alert("Adicione API key")
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
