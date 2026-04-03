document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.exercise-checkbox');
    const totalExercisesEl = document.getElementById('total-exercises');
    const completedExercisesEl = document.getElementById('completed-exercises');
    const completionRateEl = document.getElementById('completion-rate');
    const resetButton = document.getElementById('reset-button');
    const weightProgressEl = document.getElementById('weight-progress');
    
    // Configuração inicial do progresso de peso
    const currentWeight = 73;
    const targetWeight = 70;
    const weightLoss = currentWeight - targetWeight;
    const progressPercentage = ((currentWeight - 70) / 3) * 100;
    
    // Atualizar barra de progresso do peso
    setTimeout(() => {
        weightProgressEl.style.width = `${Math.min(100, progressPercentage)}%`;
    }, 500);
    
    // Contar exercícios totais
    const totalExercises = checkboxes.length;
    totalExercisesEl.textContent = totalExercises;
    
    // Carregar progresso salvo do localStorage
    loadProgress();
    
    // Atualizar estatísticas
    updateStats();
    
    // Adicionar evento de mudança a cada checkbox
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const exerciseId = this.closest('.exercise').getAttribute('data-id');
            
            // Salvar estado no localStorage
            if (this.checked) {
                localStorage.setItem(`exercise-${exerciseId}`, 'completed');
            } else {
                localStorage.removeItem(`exercise-${exerciseId}`);
            }
            
            updateStats();
            
            // Efeito visual
            if (this.checked) {
                const exercise = this.closest('.exercise');
                exercise.style.backgroundColor = '#e8f5e9';
                setTimeout(() => {
                    exercise.style.backgroundColor = '';
                }, 500);
            }
        });
    });
    
    // Configurar botão de reset
    resetButton.addEventListener('click', function() {
        if (confirm("Tem certeza que deseja reiniciar todo o progresso da semana? Todos os exercícios marcados serão desmarcados.")) {
            // Desmarcar todos os checkboxes
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Limpar localStorage
            localStorage.clear();
            
            updateStats();
            
            // Feedback visual
            resetButton.textContent = "✅ Progresso Reiniciado!";
            setTimeout(() => {
                resetButton.textContent = "↻ Reiniciar Progresso da Semana";
            }, 2000);
        }
    });
    
    function loadProgress() {
        checkboxes.forEach(checkbox => {
            const exerciseId = checkbox.closest('.exercise').getAttribute('data-id');
            
            // Verificar se o exercício foi marcado como concluído
            if (localStorage.getItem(`exercise-${exerciseId}`) === 'completed') {
                checkbox.checked = true;
            }
        });
    }
    
    function updateStats() {
        // Contar exercícios concluídos
        const completedExercises = document.querySelectorAll('.exercise-checkbox:checked').length;
        completedExercisesEl.textContent = completedExercises;
        
        // Calcular taxa de conclusão
        const completionRate = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
        completionRateEl.textContent = `${completionRate}%`;
    }
    
    // Animar elementos ao carregar
    setTimeout(() => {
        document.querySelector('.stats-bar').style.transform = 'translateY(0)';
        document.querySelector('.stats-bar').style.opacity = '1';
        
        // Animar cards dos dias
        const dayCards = document.querySelectorAll('.day-card');
        dayCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
});

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Carregar tema salvo
if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// Timer Functionality
const timerBtn = document.getElementById('timer-btn');
const timerModal = document.getElementById('timer-modal');
const closeTimer = document.getElementById('close-timer');
const timerDisplay = document.getElementById('timer-display');
const startTimerBtn = document.getElementById('start-timer');
const resetTimerBtn = document.getElementById('reset-timer');

let timerInterval;
let timeLeft = 90;
let isRunning = false;

timerBtn.addEventListener('click', () => {
    timerModal.style.display = 'flex';
});

closeTimer.addEventListener('click', () => {
    timerModal.style.display = 'none';
    clearInterval(timerInterval);
    isRunning = false;
    startTimerBtn.textContent = 'Iniciar';
});

startTimerBtn.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startTimerBtn.textContent = 'Continuar';
    } else {
        isRunning = true;
        startTimerBtn.textContent = 'Pausar';
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            
            if (timeLeft <= 10) {
                timerDisplay.style.color = '#e74c3c';
            } else {
                timerDisplay.style.color = '';
            }
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                timerDisplay.textContent = '0';
                startTimerBtn.textContent = 'Iniciar';
                
                // Tocar som de alerta (se suportado)
                try {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    oscillator.connect(audioContext.destination);
                    oscillator.frequency.value = 800;
                    oscillator.start();
                    setTimeout(() => oscillator.stop(), 200);
                } catch (e) {
                    console.log('Audio not supported');
                }
                
                alert('⏰ Tempo de descanso terminado!');
            }
        }, 1000);
    }
});

resetTimerBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 90;
    timerDisplay.textContent = timeLeft;
    timerDisplay.style.color = '';
    startTimerBtn.textContent = 'Iniciar';
});

// Fechar modais ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === timerModal) {
        timerModal.style.display = 'none';
        clearInterval(timerInterval);
        isRunning = false;
    }
    if (e.target === historyModal) {
        historyModal.style.display = 'none';
    }
});

// History Functionality
const historyBtn = document.getElementById('history-btn');
const historyModal = document.getElementById('history-modal');
const closeHistory = document.getElementById('close-history');
const historyList = document.getElementById('history-list');

historyBtn.addEventListener('click', showHistory);
closeHistory.addEventListener('click', () => {
    historyModal.style.display = 'none';
});

function showHistory() {
    historyModal.style.display = 'flex';
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #666;">Nenhum histórico registrado ainda.</p>';
        return;
    }
    
    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-date">${new Date(item.date).toLocaleDateString('pt-BR')}</div>
            <div class="history-stats">
                <span>✅ ${item.completed}/${item.total} exercícios</span>
                <span>📊 ${item.percentage}% concluído</span>
            </div>
        </div>
    `).reverse().join('');
}

// Salvar histórico automaticamente
function saveHistory() {
    const completed = document.querySelectorAll('.exercise-checkbox:checked').length;
    const total = document.querySelectorAll('.exercise-checkbox').length;
    const percentage = Math.round((completed / total) * 100);
    
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    // Verificar se já existe registro hoje
    const existingIndex = history.findIndex(h => h.date.startsWith(today));
    
    if (existingIndex >= 0) {
        history[existingIndex] = { date: new Date().toISOString(), completed, total, percentage };
    } else {
        history.push({ date: new Date().toISOString(), completed, total, percentage });
    }
    
    // Manter apenas últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filteredHistory = history.filter(h => new Date(h.date) > thirtyDaysAgo);
    
    localStorage.setItem('workoutHistory', JSON.stringify(filteredHistory));
}

// Atualizar função updateStats para salvar histórico
const originalUpdateStats = updateStats;
updateStats = function() {
    originalUpdateStats();
    saveHistory();
};

// Export to PDF
const exportPdfBtn = document.getElementById('export-pdf-btn');

exportPdfBtn.addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const completed = document.querySelectorAll('.exercise-checkbox:checked').length;
    const total = document.querySelectorAll('.exercise-checkbox').length;
    const percentage = Math.round((completed / total) * 100);
    
    // Título
    doc.setFontSize(20);
    doc.text('Plano de Treino Personalizado', 20, 20);
    
    // Data
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30);
    
    // Estatísticas
    doc.setFontSize(14);
    doc.text(`Progresso: ${completed}/${total} exercícios (${percentage}%)`, 20, 45);
    
    // Lista de exercícios
    doc.setFontSize(12);
    let yPosition = 60;
    
    document.querySelectorAll('.exercise').forEach((exercise, index) => {
        const checkbox = exercise.querySelector('.exercise-checkbox');
        const name = exercise.querySelector('.exercise-name').textContent;
        const details = exercise.querySelector('.exercise-details').textContent.trim();
        const status = checkbox.checked ? '✅' : '⬜';
        
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        
        doc.text(`${status} ${name}`, 20, yPosition);
        yPosition += 8;
        
        if (checkbox.checked) {
            doc.setTextColor(0, 150, 0);
            doc.text('(Concluído)', 20, yPosition);
            doc.setTextColor(0, 0, 0);
            yPosition += 8;
        }
    });
    
    // Salvar PDF
    doc.save(`treino-${new Date().toISOString().split('T')[0]}.pdf`);
});

// Charts Functionality
const toggleChartsBtn = document.getElementById('toggle-charts');
const chartsSection = document.getElementById('charts-section');
let weightChart = null;
let performanceChart = null;

toggleChartsBtn.addEventListener('click', () => {
    if (chartsSection.style.display === 'none') {
        chartsSection.style.display = 'grid';
        initCharts();
        toggleChartsBtn.textContent = '🔙 Ocultar Gráficos';
    } else {
        chartsSection.style.display = 'none';
        toggleChartsBtn.textContent = '📊 Ver Gráficos de Evolução';
    }
});

function initCharts() {
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    
    // Weight Chart (simulated data based on progress)
    const weightCtx = document.getElementById('weight-chart').getContext('2d');
    
    if (weightChart) {
        weightChart.destroy();
    }
    
    // Generate weight progression data (simulated)
    const labels = [];
    const weights = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        labels.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
        
        // Simulate gradual weight loss from 73kg towards 70kg
        const progress = i / 30;
        const simulatedWeight = 73 - (progress * 3 * 0.3); // Gradual loss
        weights.push(simulatedWeight.toFixed(1));
    }
    
    weightChart = new Chart(weightCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Peso (kg)',
                data: weights,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Evolução do Peso (Simulado)'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 69,
                    max: 74
                }
            }
        }
    });
    
    // Performance Chart
    const perfCtx = document.getElementById('performance-chart').getContext('2d');
    
    if (performanceChart) {
        performanceChart.destroy();
    }
    
    const perfLabels = history.slice(-14).map(h => 
        new Date(h.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    );
    const perfData = history.slice(-14).map(h => h.percentage);
    
    performanceChart = new Chart(perfCtx, {
        type: 'bar',
        data: {
            labels: perfLabels,
            datasets: [{
                label: 'Taxa de Conclusão (%)',
                data: perfData,
                backgroundColor: 'rgba(46, 204, 113, 0.7)',
                borderColor: '#2ecc71',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Desempenho nos Últimos Treinos'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Auto-save history periodically
setInterval(saveHistory, 30000);

console.log('💪 App de Treino carregado com sucesso!');
