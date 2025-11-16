// Carregar CSV externo automaticamente
fetch('relatorio.csv')
    .then(response => response.text())
    .then(csvText => processCSV(csvText))
    .catch(err => console.error("Erro ao carregar relatorio.csv:", err));


function processCSV(csvText) {
    const rows = csvText.trim().split("\n").map(r => r.split(","));

    // remove header
    rows.shift();

    const filaCount = {};
    const statusCount = {};
    const atendenteCount = {};
    const tempoCount = { 
        "Até 5 dias": 0, 
        "6 a 15 dias": 0, 
        "Acima de 16 dias": 0 
    };

    console.log(row);
    rows.forEach(row => {
        const fila = row[3];
        const status = row[4];
        const atendente = row[5];
        const tempo = parseInt(row[6]);

        filaCount[fila] = (filaCount[fila] || 0) + 1;
        statusCount[status] = (statusCount[status] || 0) + 1;
        atendenteCount[atendente] = (atendenteCount[atendente] || 0) + 1;

        if (tempo <= 5) tempoCount["Até 5 dias"]++;
        else if (tempo <= 15) tempoCount["6 a 15 dias"]++;
        else tempoCount["Acima de 16 dias"]++;
    });

    createChart("chartFila", "Chamados por Fila", filaCount);
    createChart("chartStatus", "Chamados por Status", statusCount);
    createChart("chartAtendente", "Chamados por Atendente", atendenteCount);
    createChart("chartTempo", "Chamados por Tempo (dias)", tempoCount);
}




function createChart(elementId, label, dataObj) {

    const ctx = document.getElementById(elementId).getContext("2d");
    const listDiv = document.getElementById("list" + elementId.replace("chart", ""));

    // gera a lista de valores abaixo do gráfico
    let htmlList = "";
    for (const [key, value] of Object.entries(dataObj)) {
        htmlList += `<p><strong>${key}:</strong> ${value}</p>`;
    }
    listDiv.innerHTML = htmlList;

    new Chart(ctx, {
        type: "pie",  // ou bar, line, doughnut...
        data: {
            labels: Object.keys(dataObj),
            datasets: [{
                label,
                data: Object.values(dataObj)
            }]
        },
        options: {
            responsive: true
        }
    });
}