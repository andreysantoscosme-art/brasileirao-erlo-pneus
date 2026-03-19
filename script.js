let jogadores = [];
let tabela = {};

async function carregarTimes(){
  const res = await fetch("https://site.api.espn.com/apis/v2/sports/soccer/bra.1/standings");
  const data = await res.json();

  const times = data.children[0].standings.entries.map(e=>e.team.displayName);

  const select1 = document.getElementById("time1");
  const select2 = document.getElementById("time2");

  times.forEach(t=>{
    const o1 = new Option(t,t);
    const o2 = new Option(t,t);
    select1.add(o1);
    select2.add(o2);
  });
}

async function atualizar(){
  const res = await fetch("https://site.api.espn.com/apis/v2/sports/soccer/bra.1/standings");
  const data = await res.json();

  tabela = {};

  data.children[0].standings.entries.forEach(e=>{
    tabela[e.team.displayName] = e.stats.find(s=>s.name==="points").value;
  });

  jogadores.forEach(j=>{
    j.pontos = (tabela[j.t1]||0)+(tabela[j.t2]||0);
  });

  render();
}

function adicionar(){
  const nome = document.getElementById("nome").value;
  const t1 = document.getElementById("time1").value;
  const t2 = document.getElementById("time2").value;

  if(!nome){alert("Digite nome");return;}

  jogadores.push({nome,t1,t2,pontos:0});
  render();
}

function render(){
  const ul = document.getElementById("ranking");
  ul.innerHTML="";

  jogadores.sort((a,b)=>b.pontos-a.pontos);

  jogadores.forEach(j=>{
    const li=document.createElement("li");
    li.innerText = j.nome+" - "+j.pontos+" pts";
    ul.appendChild(li);
  });
}

carregarTimes();
