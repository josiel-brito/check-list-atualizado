document.addEventListener('deviceready', function() {
    console.log('Device is ready');  // Log de depuração

    // Exibe os pontos de carregamento após 1 segundo
    setTimeout(function() {
        console.log('Showing loader');  // Log de depuração
        document.getElementById('loader').style.opacity = 1;
    }, 1000);

    // Oculta a splash screen personalizada após 4 segundos
    setTimeout(function() {
        console.log('Hiding splash screen');  // Log de depuração
        document.getElementById('custom-splash').style.opacity = 0;

        // Remova a splash screen do DOM após a transição
        setTimeout(function() {
            document.getElementById('custom-splash').style.display = 'none';
        }, 1000); // Correspondente ao tempo da transição de opacidade
    }, 6000);
});

// Para desenvolvimento em navegador, simulando o evento deviceready
if (!window.cordova) {
    window.onload = function() {
        console.log('Simulating deviceready event');  // Log de depuração
        document.dispatchEvent(new Event('deviceready'));
    };
}

// Simulating a database of users and historical data
const validUsers = [
    { name: "Josiel", matricula: "1234" },
    { name: "Gustavo", matricula: "2026437" },
    { name: "Kene", matricula: "2524730" },
    { name: "Lucas", matricula: "2055604" },
    { name: "Clayton", matricula: "3000496" },
    { name: "Gabriel", matricula: "3000000" },
    { name: "Userteste", matricula: "0000" }
];

const adminUsers = ["Josiel", "Userteste"]; // Users with permission to delete history

const questions = {
    "Exaustor 1": [
        "Foi verificado se está tendo vibração?",
        "Mancais estão normais e sem aquecimento?",
        "O motor apresenta vibração?",
        "Parafusos da base do motor estão apertados?",
        "Condições do damper estão normais?"
    ],
    "Exaustor 2": [
        "Foi verificado se está tendo vibração?",
        "Mancais estão normais e sem aquecimento?",
        "O motor apresenta vibração?",
        "Parafusos da base do motor estão apertados?",
        "Condições do damper estão normais?"
    ],
    "Espagidor": [
        "Foi verificado se está tendo vibração?",
        "O motor apresenta vibração?",
        "Parafusos da base do motor estão apertados?",
        "Condições do damper das bandeijas estão normais?",
        "Condições das cruzetas e parafusos estão normais?"
    ],
    "ventilador primário": [
        "Foi verificado se está tendo vibração?",
        "Mancais estão normais e sem aquecimento?",
        "O motor apresenta vibração?",
        "Parafusos da base do motor estão apertados?",
        "Condições do damper estão normais?",
        "Correia está esticada?",
        "Está limpa a entrada de ar?"
    ],
    "ventilador secundário ": [
        "Foi verificado se está tendo vibração?",
        "Mancais estão normais e sem aquecimento?",
        "O motor apresenta vibração?",
        "Parafusos da base do motor estão apertados?",
        "Condições do damper estão normais?",
        "Está limpa a entrada de ar?"
    ],
    "Esteira de sobra": [
        "Foi realizado a limpeza com o soprador e ar comprimido o excesso de bagaço?",
        "leito da borracha esta em boas condições?",
        "Raspadores estão em boas condições?",
        "Roletes travados ou danificados?",
        "Mancais de acionamento da esteira estão em boas condições?",
        "Raspas lateiras estão em boas condições?",
        "Parafusos da base do motor estão apertados?",
        "Correias do motor estão em boas condições?",
        "Ventição do motor está ok?",
        "Ruidos anormais?"
    ]
};

let currentUser = null;
let currentTurno = null;
let currentSerial = null;
let currentResponses = [];
let historico = JSON.parse(localStorage.getItem('historico')) || [];
let sessionResponses = [];
let editIndex = -1;

// Função para mostrar o ícone de carregamento
function showLoading() {
    document.getElementById('loadingIcon').style.display = 'block';
}

// Função para esconder o ícone de carregamento
function hideLoading() {
    document.getElementById('loadingIcon').style.display = 'none';
}

// Função para alternar telas com transição
function toggleContainer(hideId, showId) {
    const hideContainer = document.getElementById(hideId);
    const showContainer = document.getElementById(showId);

    hideContainer.classList.remove('active');
    setTimeout(() => {
        hideContainer.style.display = 'none';
        showContainer.style.display = 'block';
        setTimeout(() => {
            showContainer.classList.add('active');
        }, 10);
    }, 500);
}

// Show matricula password toggle
    const botvisib = document.getElementById('showMatricula');
    const matriculaInput = document.getElementById('matricula');

  botvisib.addEventListener('click', () => {
    if (matriculaInput.type === 'password') {
        matriculaInput.type = 'text';
        botvisib.querySelector('.bi').classList.remove('bi-eye');
        botvisib.querySelector('.bi').classList.add('bi-eye-slash');
    }
    else {
        matriculaInput.type = 'password';
        botvisib.querySelector('.bi').classList.remove('bi-eye-slash');
        botvisib.querySelector('.bi').classList.add('bi-eye');
    }
});

// ocultar icones da tela de login ao clicar no campo input
const inputname = document.getElementById('name');
const User = document.getElementById('user');

inputname.addEventListener('input', () => {
  if (inputname.value.length > 0) {
    User.classList.add('hidden');
  }
  else {
    User.classList.remove('hidden');
  } 
});

const inputmat = document.getElementById('matricula');
const Lock = document.getElementById('lock');

inputmat.addEventListener('input', () => {
    if (inputmat.value.length > 0) {
      Lock.classList.add('hidden');
    }
    else {
      Lock.classList.remove('hidden');
    } 
  });

// Handle login form submission
document.getElementById('botlog').addEventListener('click', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const matricula = document.getElementById('matricula').value;
    const user = validUsers.find(user => user.name === name && user.matricula === matricula);

    if (user) {
        showLoading();
        setTimeout(() => {
            hideLoading();
        currentUser = user;
        document.getElementById('userGreeting').textContent = `Olá, ${user.name}`;
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('turnoSeriesContainer').style.display = 'block';
 
 toggleContainer('loginContainer', 'turnoSeriesContainer');
}, 1000);
    }
    else {
        alert('Nome ou matrícula inválidos.');
    }
});

// Handle turno and series form submission
document.getElementById('turnoSeriesForm').addEventListener('submit', function(event) {
    event.preventDefault();
    currentTurno = document.getElementById('turno').value;
    currentSerial = document.getElementById('series').value;

    if (questions[currentSerial]) {
        displayQuestionario(currentSerial);
    } 
    else {
        alert('Número de série inválido.');
    }
});

document.getElementById('openScannerBtn').addEventListener('click', function() {
    document.getElementById('barcodeScanner').style.display = 'block';
    document.getElementById('closeScannerBtn').style.display = 'block';
    document.getElementById('new').style.display = 'none';
    document.getElementById('new1').style.display = 'none';
    startBarcodeScanner();
});

document.getElementById('closeScannerBtn').addEventListener('click', function() {
    stopBarcodeScanner();
    document.getElementById('barcodeScanner').style.display = 'none';
    document.getElementById('closeScannerBtn').style.display = 'none';
    document.getElementById('new').style.display = 'block';
    document.getElementById('new1').style.display = 'block';
});

const scannerContainer = document.getElementById('barcodeScanner');
let barcodeDetector;
let videoStream;

async function startBarcodeScanner() {
    if (!('BarcodeDetector' in window)) {
        console.error('Barcode Detector is not supported by this browser.');
        return;
    }

    barcodeDetector = new BarcodeDetector({ formats: ['qr_code', 'code_128', 'code_39', 'ean_13'] });

    try {
        scannerContainer.style.display = 'flex';
        videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        const video = document.getElementById('barcodeVideo');
        video.srcObject = videoStream;
        video.play();

        scanBarcode(video);
    } catch (err) {
        console.error('Error accessing the camera: ', err);
    }
    requestAnimationFrame(scanBarcode);
}

function scanBarcode(video) {
    const checkForBarcode = async () => {
        if (!barcodeDetector) return;

        try {
            const barcodes = await barcodeDetector.detect(video);
            if (barcodes.length > 0) {
                document.getElementById('series').value = barcodes[0].rawValue;
                stopBarcodeScanner();
                document.getElementById('barcodeScanner').style.display = 'none';
                document.getElementById('closeScannerBtn').style.display = 'none';
                document.getElementById('new').style.display = 'block';
                document.getElementById('new1').style.display = 'block';
            }
            else{
                requestAnimationFrame(checkForBarcode);
            }
        } catch (err) {
            console.error('Barcode detection failed: ', err);
            requestAnimationFrame(checkForBarcode);
        }

    };

    checkForBarcode();
}

function stopBarcodeScanner() {
    if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach(track => track.stop());
        videoStream = null;
    }

    barcodeDetector = null;
}

// Display questionario
function displayQuestionario(serial) {
    showLoading();
    setTimeout(() => {
        hideLoading();
        toggleContainer('turnoSeriesContainer', 'questionarioContainer');
    }, 1000);
    const container = document.getElementById('questionarioContainer');
    container.innerHTML = `<h2>Questionário para ${serial}</h2>`;

    questions[serial].forEach((question, index) => {
        container.innerHTML += `
            <div>
                <p>${question}</p>
                <select id="response${index}" class="industrial-select">
                    <option value="Normal">Normal</option>
                    <option value="Alerta">Alerta</option>
                    <option value="Crítico">Crítico</option>
                </select>
                <div id="problem${index}" style="display:none;">
                    <label for="problemDescription${index}">Descreva o Problema:</label>
                    <textarea id="problemDescription${index}" class="industrial-textarea"></textarea>
                </div>
            </div>
        `;
    });

    container.innerHTML += `
        <div class="actions">
            <button id="saveQuestionarioBtn" class="industrial-button">Salvar Questionário</button>
        </div>
    `;

    document.getElementById('questionarioContainer').style.display = 'block';
    document.getElementById('turnoSeriesContainer').style.display = 'none';

    // Add event listeners to response selects
    questions[serial].forEach((_, index) => {
        document.getElementById(`response${index}`).addEventListener('change', function() {
            const value = this.value;
            const problemDiv = document.getElementById(`problem${index}`);
            if (value === 'Alerta' || value === 'Crítico') {
                problemDiv.style.display = 'block';
            } else {
                problemDiv.style.display = 'none';
            }
        });
    });

    document.getElementById('saveQuestionarioBtn').addEventListener('click', saveQuestionario);
}

function saveQuestionario() {
    let responses = [];
    questions[currentSerial].forEach((_, index) => {
        const response = document.getElementById(`response${index}`).value;
        const problemDescription = document.getElementById(`problemDescription${index}`).value;
        responses.push({ question: questions[currentSerial][index], response, problemDescription });
    });

    if (editIndex !== -1) {
        sessionResponses[editIndex] = {
            serial: currentSerial,
            responses: responses,
            user: currentUser.name,
            turno: currentTurno,
            timestamp: new Date().toLocaleString()
        };
        editIndex = -1;  
    }
     else {
    sessionResponses.push({
        serial: currentSerial,
        responses: responses,
        user: currentUser.name,
        turno: currentTurno,
        timestamp: new Date().toLocaleString()
    });
}

showLoading();
    setTimeout(() => {
        hideLoading();
        toggleContainer('questionarioContainer', 'turnoSeriesContainer');
    }, 1000);
  
updateSeriesRespondidos();

    // Reset the questionario and series input field
    document.getElementById('turnoSeriesContainer').style.display = 'block';
    document.getElementById('questionarioContainer').style.display = 'none';
    document.getElementById('turnoSeriesForm').reset();
}

function updateSeriesRespondidos() {
    const container = document.getElementById('seriesRespondidosContainer');
    const list = document.getElementById('seriesRespondidosList');
    list.innerHTML = '';

    sessionResponses.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.serial} <button class="industrial-button edit-button" data-index="${index}">Editar</button>`;
        list.appendChild(li);
    });

    container.style.display = 'block';

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function() {
            editQuestionario(this.getAttribute('data-index'));
        });
    });
}

function editQuestionario(index) {
    editIndex = index;
    const item = sessionResponses[index];
    currentSerial = item.serial;
    currentResponses = item.responses;
    displayQuestionario(currentSerial);

    currentResponses.forEach((response, idx) => {
        document.getElementById(`response${idx}`).value = response.response;
        if (response.response === 'Alerta' || response.response === 'Crítico') {
            document.getElementById(`problem${idx}`).style.display = 'block';
            document.getElementById(`problemDescription${idx}`).value = response.problemDescription;
        }
    });
}

// Handle finalizar button
document.getElementById('finalizarBtn').addEventListener('click', function() {
    historico.push({
        user: currentUser.name,
        turno: currentTurno,
        timestamp: new Date().toLocaleString(),
        responses: sessionResponses
    });

    localStorage.setItem('historico', JSON.stringify(historico));
    displayResultados();
});

function displayResultados() {
    const container = document.getElementById('resultadosContainer');
    const list = document.getElementById('resultadosList');
    list.innerHTML = '';

    sessionResponses.forEach(item => {
        item.responses.forEach(response => {
            if (response.response === 'Alerta' || response.response === 'Crítico') {
                list.innerHTML += `
                    <div>
                        <p><strong>${item.serial}</strong> - ${response.question}</p>
                        <p>Resposta: ${response.response}</p>
                        <p>Descrição do Problema: ${response.problemDescription}</p>
                    </div>
                `;
            }
        });
    });

    showLoading();
    setTimeout(() => {
        hideLoading();
        toggleContainer('turnoSeriesContainer', 'resultadosContainer');
    }, 1000);

    document.getElementById('turnoSeriesContainer').style.display = 'none';
    document.getElementById('questionarioContainer').style.display = 'none';
    container.style.display = 'block';
}

// Handle display of historical data
document.getElementById('exibirHistoricosBtn').addEventListener('click', function() {
    showLoading();
    setTimeout(() => {
        hideLoading();
        toggleContainer('turnoSeriesContainer', 'historicoContainer');
    }, 1000);
    const historicoList = document.getElementById('historicoList');
    historicoList.innerHTML = '';

    historico.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox" class="historico-checkbox" data-index="${index}"> ${item.user} - ${item.turno} - ${item.timestamp}`;
        
        // Add event listener to the entire list item
        li.addEventListener('click', (event) => {
            if (!event.target.matches('.historico-checkbox')) {
                viewHistoricoDetail(index);
            }
        });

        // Prevent the list item click event when clicking on the checkbox
        li.querySelector('.historico-checkbox').addEventListener('click', (event) => {
            event.stopPropagation();
        });

        historicoList.appendChild(li);
    });

    document.getElementById('turnoSeriesContainer').style.display = 'none';
    document.getElementById('historicoContainer').style.display = 'block';

    if (adminUsers.includes(currentUser.name)) {
        document.getElementById('apagarSelecionadosBtn').style.display = 'inline-block';
        document.getElementById('apagarHistoricoBtn').style.display = 'inline-block';
    } else {
        document.getElementById('apagarSelecionadosBtn').style.display = 'none';
        document.getElementById('apagarHistoricoBtn').style.display = 'none';
    }
});
 

function viewHistoricoDetail(index) {
    const item = historico[index];
    const detailContainer = document.getElementById('historicoDetailContainer');
    const detailContent = document.getElementById('historicoDetailContent');
    showLoading();
    setTimeout(() => {
        hideLoading();
        toggleContainer('historicoContainer', 'historicoDetailContainer');
    }, 1000);

    detailContent.innerHTML = `
        <p class="font-white">Usuário: ${item.user}</p>
        <p class="font-white">Turno: ${item.turno}</p>
        <p class="font-white">Data e Hora: ${item.timestamp}</p>
        <h3 class="font-white">Resultados</h3>
    `;

    item.responses.forEach(serial => {
        detailContent.innerHTML += `<p class="serial-number"><strong>${serial.serial}</strong></p>`;
        serial.responses.forEach(response => {
            detailContent.innerHTML += `
                <div class="response-row">
                    <div class="response-question">${response.question}</div>
                    <div class="response-good" style="background-color: ${response.response === 'Normal' ? '#00FF7F' : '#4b4949'}">${response.response === 'Normal' ? '✓' : ''}</div>
                    <div class="response-alert" style="background-color: ${response.response === 'Alerta' ? '#FFFF00' : '#4b4949'}">${response.response === 'Alerta' ? '✓' : ''}</div>
                    <div class="response-critical" style="background-color: ${response.response === 'Crítico' ? '#FF0000' : '#4b4949'}">${response.response === 'Crítico' ? '✓' : ''}</div>
                </div>
                ${response.problemDescription ? `<p class="response-problem">Descrição do Problema: ${response.problemDescription}</p>` : ''}
            `;
        });
    });

    document.getElementById('historicoContainer').style.display = 'none';
    detailContainer.style.display = 'block';
}

document.getElementById('backToTurnoBtn').addEventListener('click', function() {
    toggleContainer('resultadosContainer', 'turnoSeriesContainer');
    document.getElementById('resultadosContainer').style.display = 'none';
    document.getElementById('turnoSeriesContainer').style.display = 'block';
});

document.getElementById('backToTurnoBtn2').addEventListener('click', function() {
    toggleContainer('historicoContainer', 'turnoSeriesContainer');
    document.getElementById('historicoContainer').style.display = 'none';
    document.getElementById('turnoSeriesContainer').style.display = 'block';
});

document.getElementById('backToHistoricoBtn').addEventListener('click', function() {
    toggleContainer('historicoDetailContainer', 'historicoContainer');
    document.getElementById('historicoDetailContainer').style.display = 'none';
    document.getElementById('historicoContainer').style.display = 'block';
});

// Handle deleting selected historical data
document.getElementById('apagarSelecionadosBtn').addEventListener('click', function() {
    const checkboxes = document.querySelectorAll('.historico-checkbox:checked');
    if (checkboxes.length > 0) {
        if (confirm('Tem certeza que deseja apagar os históricos selecionados?')) {
            const progressBarContainer = document.getElementById('progressBarContainer');
            const progressBar = document.getElementById('progressBar');
            const notification = document.getElementById('notification');
            progressBarContainer.style.display = 'block';
            progressBar.style.width = '0%'; // Reset progress bar

            const baseDuration = 2000; // Base time for the progress bar
            const extraTimePerItem = 500; // Extra time per item
            const totalDuration = baseDuration + (extraTimePerItem * checkboxes.length); // Total duration
            const intervalTime = 50; // Interval time in milliseconds for updating the progress bar
            const steps = totalDuration / intervalTime; // Number of steps
            let progress = 0;

            const updateProgress = () => {
                progress += 100 / steps;
                progressBar.style.width = `${progress}%`;

                if (progress >= 100) {
                    clearInterval(progressInterval);

                    // Removing items from historico array and localStorage
                    checkboxes.forEach(checkbox => {
                        const index = checkbox.getAttribute('data-index');
                        historico.splice(index, 1);
                    });
                    localStorage.setItem('historico', JSON.stringify(historico));

                    progressBarContainer.style.display = 'none';
                    notification.style.display = 'block';
                    document.getElementById('exibirHistoricosBtn').click(); // Refresh the list
                    setTimeout(() => {
                        notification.style.display = 'none';
                    }, 3000); // Hide notification after 3 seconds
                }
            };

            const progressInterval = setInterval(updateProgress, intervalTime);
        }
    } else {
        alert('Nenhum histórico selecionado.');
    }
});

// Handle deleting all historical data
document.getElementById('apagarHistoricoBtn').addEventListener('click', function() {
    if (confirm('Tem certeza que deseja apagar todo o histórico?')) {
        const progressBarContainer = document.getElementById('progressBarContainer');
        const progressBar = document.getElementById('progressBar');
        const notification = document.getElementById('notification');
        progressBarContainer.style.display = 'block';
        progressBar.style.width = '0%'; // Reset progress bar

        const baseDuration = 2000; // Base time for the progress bar
        const intervalTime = 50; // Interval time in milliseconds for updating the progress bar
        const steps = baseDuration / intervalTime; // Number of steps
        let progress = 0;

        const updateProgress = () => {
            progress += 100 / steps;
            progressBar.style.width = `${progress}%`;

            if (progress >= 100) {
                clearInterval(progressInterval);

                // Clearing historico array and localStorage
                historico = [];
                localStorage.setItem('historico', JSON.stringify(historico));

                progressBarContainer.style.display = 'none';
                notification.style.display = 'block';
                document.getElementById('historicoList').innerHTML = ''; // Clear the list
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 3000); // Hide notification after 3 seconds
            }
        };

        const progressInterval = setInterval(updateProgress, intervalTime);
    }
});


document.getElementById('sendResultsBtn').addEventListener('click', function() {
    sendResultsByEmail();
});

function sendResultsByEmail() {
    const recipients = 'example1@gmail.com,example2@gmail.com';
    const subject = 'Relatório diário do check-list';

    // Adicionar informações do usuário, hora e turno
    const currentUserInfo = sessionResponses.length > 0 ? sessionResponses[0] : {};
    const user = currentUserInfo.user || currentUser.name;
    const timestamp = new Date().toLocaleString();
    const turno = currentUserInfo.turno || 'Turno não especificado';

    let body = `Usuário: ${user}\nHora do Envio: ${timestamp}\nTurno: ${turno}\n\nAqui estão os resultados finais:\n\n`;

    sessionResponses.forEach(item => {
        item.responses.forEach(response => {
            if (response.response === 'Alerta' || response.response === 'Crítico') {
                body += `Equipamento: ${item.serial}\nPergunta: ${response.question}\nResposta: ${response.response}\nDescrição do Problema: ${response.problemDescription}\n\n`;
            }
        });
    });

    const mailtoLink = `mailto:${recipients}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}
