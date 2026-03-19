const select1=document.getElementById("time1")
const select2=document.getElementById("time2")

TIMES.forEach(t=>{
let o1=document.createElement("option")
o1.value=t
o1.text=t
select1.appendChild(o1)

let o2=document.createElement("option")
o2.value=t
o2.text=t
select2.appendChild(o2)
})

let players = JSON.parse(localStorage.getItem("players")) || []
let pontos={}

function teamUsed(t){
return players.some(p=>p.t1===t||p.t2===t)
}

function addPlayer(){

if(players.length>=10){
alert("Máximo 10 jogadores")
return
}

let nome=document.getElementById("nome").value
let t1=select1.value
let t2=select2.value

if(!nome){alert("Digite o nome");return}
if(t1===t2){alert("Escolha times diferentes");return}
if(teamUsed(t1)||teamUsed(t2)){alert("Esse time já foi escolhido");return}

players.push({nome:nome,t1:t1,t2:t2})
localStorage.setItem("players", JSON.stringify(players))

render()
}

function removePlayer(i){
players.splice(i,1)
localStorage.setItem("players", JSON.stringify(players))
render()
}

function calc(p){
return (pontos[p.t1]||0)+(pontos[p.t2]||0)
}

function render(){

let ranking=[...players].map(p=>({
nome:p.nome,
t1:p.t1,
t2:p.t2,
pts:calc(p)
}))

ranking.sort((a,b)=>b.pts-a.pts)

let tb=document.getElementById("ranking")
tb.innerHTML=""

ranking.forEach((p,i)=>{

let tr=document.createElement("tr")

tr.innerHTML=`
<td>${i+1}</td>
<td>${p.nome}</td>
<td>
<img class="logo" src="${LOGOS[p.t1]}"> ${p.t1} +
<img class="logo" src="${LOGOS[p.t2]}"> ${p.t2}
</td>
<td>${p.pts}</td>
<td><button onclick="removePlayer(${i})">Excluir</button></td>
`

tb.appendChild(tr)

})
}

async function updateTable(){

try{

let res=await fetch("https://site.api.espn.com/apis/v2/sports/soccer/bra.1/standings")
let data=await res.json()

data.children[0].standings.entries.forEach(t=>{

let name=t.team.displayName
let pts=t.stats.find(s=>s.name==="points").value

if(name.includes("Bragantino")) name="Red Bull Bragantino"
if(name.includes("Atlético Mineiro")) name="Atlético-MG"
if(name.includes("Vasco")) name="Vasco"
if(name.includes("Athletico")) name="Athletico-PR"

pontos[name]=pts

})

render()

}catch(e){}

}

setInterval(updateTable,300000)
updateTable()

render()
