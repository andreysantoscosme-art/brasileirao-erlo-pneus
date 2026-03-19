let jogadores = [];

// TABELA (VOCÊ ATUALIZA COM ESPN)
const tabela = {
  "Flamengo": 50,
  "Palmeiras": 48,
  "Atlético-MG": 45,
  "Botafogo": 44,
  "São Paulo": 42,
  "Fluminense": 40,
  "Grêmio": 38,
  "Internacional": 36,
  "Athletico-PR": 35,
  "RB Bragantino": 34,
  "Cruzeiro": 33,
  "Vasco da Gama": 30,
  "Bahia": 29,
  "Fortaleza": 28,
  "Santos": 27,
  "Corinthians": 26,
  "Goiás": 25,
  "Coritiba": 22,
  "América-MG": 20,
  "Ceará": 18
};

function adicionar(){
  const nome = document.getElementById("nome").value;
  const t1 = document.getElementById("time1").value;
  const t2 = document.getElementById("time2").value;

  if(!nome){
    alert("Digite o nome");
    return;
  }

  jogadores.push({nome, t1, t2, pontos:0});
  render();
}

function calcular(){
  jogadores.forEach(j=>{
    j.pontos = (tabela[j.t1] || 0) + (tabela[j.t2] || 0);
  });
  render();
}

function render(){
  const ul = document.getElementById("ranking");
  ul.innerHTML="";

  jogadores.sort((a,b)=>b.pontos-a.pontos);

  jogadores.forEach(j=>{
    const li = document.createElement("li");
    li.innerText = j.nome + " - " + j.pontos + " pts";
    ul.appendChild(li);
  });
}
