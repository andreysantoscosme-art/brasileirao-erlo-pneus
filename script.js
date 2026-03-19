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

let players=[]
let pontos={}

function normalizarNome(name){
  if(name.includes("Athletico")) return "Athletico-PR"
  if(name.includes("Atlético Mineiro")) return "Atlético-MG"
  if(name.includes("Vasco")) return "Vasco"
  if(name.includes("Bragantino")) return "Red Bull Bragantino"
  return name
}

// LOGIN
function login(){
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
}

auth.onAuthStateChanged(async user=>{
  if(user){
    let doc = await db.collection("bolao").doc(user.uid).get();
    if(doc.exists){
      players = doc.data().players || [];
    }
    updateTable()
  }else{
    login()
  }
})

function addPlayer(){
let nome=document.getElementById("nome").value
let t1=select1.value
let t2=select2.value

players.push({nome,t1,t2})
salvar()
}

async function salvar(){
let user = auth.currentUser
await db.collection("bolao").doc(user.uid).set({players})
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
<img class="logo" src="${LOGOS[p.t1]}"> ${p.t1}<br>
<img class="logo" src="${LOGOS[p.t2]}"> ${p.t2}
</td>
<td>${p.pts}</td>
`
tb.appendChild(tr)
})
}

async function updateTable(){
let res=await fetch("https://site.api.espn.com/apis/v2/sports/soccer/bra.1/standings")
let data=await res.json()

data.children[0].standings.entries.forEach(t=>{
let name=normalizarNome(t.team.displayName)
let pts=t.stats.find(s=>s.name==="points").value
pontos[name]=pts
})

render()
}

setInterval(updateTable,300000)
