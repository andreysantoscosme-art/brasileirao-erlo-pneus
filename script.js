let palpites = [];

// RESULTADOS (edite conforme ESPN)
const resultados = [
  {times:["Corinthians","Palmeiras"], placar:"2x1"},
  {times:["São Paulo","Santos"], placar:"1x1"}
];

function addPalpite(){
  const nome = document.getElementById('nome').value;
  const timeA = document.getElementById('timeA').value;
  const timeB = document.getElementById('timeB').value;
  const placar = document.getElementById('placar').value;

  if(!nome || !placar){
    alert("Preencha tudo");
    return;
  }

  palpites.push({nome, times:[timeA,timeB], placar, pontos:0});
  render();
}

function mesmoJogo(t1, t2){
  return (
    (t1[0] === t2[0] && t1[1] === t2[1]) ||
    (t1[0] === t2[1] && t1[1] === t2[0])
  );
}

function atualizarResultados(){
  palpites.forEach(p => {
    resultados.forEach(r => {
      if(mesmoJogo(p.times, r.times) && p.placar === r.placar){
        p.pontos += 3;
      }
    });
  });
  render();
}

function render(){
  const lista = document.getElementById('ranking');
  lista.innerHTML = "";

  palpites.sort((a,b)=> b.pontos - a.pontos);

  palpites.forEach(p=>{
    const li = document.createElement('li');
    li.innerText = `${p.nome} - ${p.pontos} pts`;
    lista.appendChild(li);
  });
}
