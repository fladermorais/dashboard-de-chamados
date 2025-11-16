// carregamento do arquivo csv
fetch('relatorio.csv')
.then(response => response.text())
.then(text => processCSV(text));

;

function processCSV(csvText) {
    const rows = csvText.trim().split("\n").map(r => r.split(","));
    
    // remove header
    rows.shift();
    
    // definindo variáveis
    const filaCount = {};
    const statusCount = {};
    const atendenteCount = {};
    const tempoCount = { "Até 5 dias": 0, "6 a 14 dias": 0, "15 a 21 dias": 0,"Acima de 21 dias": 0 };
    
    // Loop para concatenar as informações
    rows.forEach(row => {
        const clienteBruto = row[2];        // exemplo: "Cliente X::Atend I::Sustentação"
        const fila = clienteBruto.split("::")[0]; 
        const status = row[3];
        const atendente = row[4];
        // ---- CÁLCULO DE DIAS A PARTIR DA DATA DO CSV ----
        const dataString = row[6].trim();
        
        // tenta converter datas nos formatos mais comuns
        const dataCampo = new Date(dataString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$2-$1-$3"));
        
        const hoje = new Date();
        const diffTime = hoje - dataCampo;
        const tempo = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // dias inteiros
        
        filaCount[fila] = (filaCount[fila] || 0) + 1;
        statusCount[status] = (statusCount[status] || 0) + 1;
        atendenteCount[atendente] = (atendenteCount[atendente] || 0) + 1;
        
        if (tempo <= 5) tempoCount["Até 5 dias"]++;
        else if (tempo <= 14) tempoCount["6 a 14 dias"]++;
        else if (tempo <= 21) tempoCount["15 a 21 dias"]++;
        else tempoCount["Acima de 21 dias"]++;
    });
    
    // Gerando gráfico e tabela para cada tipo
    createChart("chartFila", "Chamados por Fila", filaCount);
    createTable("tableFila", filaCount);
    createChart("chartStatus", "Chamados por Status", statusCount);
    createTable("tableStatus", statusCount);
    createChart("chartAtendente", "Chamados por Atendente", atendenteCount);
    createTable("tableAtendente", atendenteCount);
    createChart("chartTempo", "Chamados por Tempo (dias)", tempoCount);
    createTable("tableTempo", tempoCount);
    
    // Adicionando a data atual no gráfico
    const dia = document.getElementById('dataAtual');
    dia.textContent = new Date().toLocaleDateString('pt-BR');
}

function createTable(elementId, dataObj) {
    const tableDiv = document.getElementById(elementId);
    
    let html = `
        <table border="1" cellpadding="6" cellspacing="0">
            <thead>
                <tr>
                    <th>Categoria</th>
                    <th>Quantidade</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (const [key, value] of Object.entries(dataObj)) {
        html += `
            <tr>
                <td>${key}</td>
                <td>${value}</td>
            </tr>
        `;
    }
    
    html += `
            </tbody>
        </table>
    `;
    
    tableDiv.innerHTML = html;
}

function createChart(elementId, label, dataObj) {
    const ctx = document.getElementById(elementId).getContext("2d");
    new Chart(ctx, {
        type: "doughnut", // pie
        data: {
            labels: Object.keys(dataObj),
            datasets: [{ label, data: Object.values(dataObj) }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } }
        }
    });
}