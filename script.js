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
    if (resetButton) {
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
    }
    
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
        
        // Salvar histórico automaticamente
        saveHistory();
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
    
    if (timerBtn) {
        timerBtn.addEventListener('click', () => {
            timerModal.style.display = 'flex';
        });
    }
    
    if (closeTimer) {
        closeTimer.addEventListener('click', () => {
            timerModal.style.display = 'none';
            clearInterval(timerInterval);
            isRunning = false;
            startTimerBtn.textContent = 'Iniciar';
        });
    }
    
    if (startTimerBtn) {
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
    }
    
    if (resetTimerBtn) {
        resetTimerBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            isRunning = false;
            timeLeft = 90;
            timerDisplay.textContent = timeLeft;
            timerDisplay.style.color = '';
            startTimerBtn.textContent = 'Iniciar';
        });
    }
    
    // History Functionality
    const historyBtn = document.getElementById('history-btn');
    const historyModal = document.getElementById('history-modal');
    const closeHistory = document.getElementById('close-history');
    const historyList = document.getElementById('history-list');
    
    if (historyBtn) {
        historyBtn.addEventListener('click', showHistory);
    }
    
    if (closeHistory) {
        closeHistory.addEventListener('click', () => {
            historyModal.style.display = 'none';
        });
    }
    
    function showHistory() {
        historyModal.style.display = 'flex';
        const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
        
        if (history.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Nenhum histórico registrado ainda.</p>';
            return;
        }
        
        historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-date">${new Date(item.date).toLocaleDateString('pt-BR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</div>
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
    
    // Export to PDF
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', async () => {
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                const completed = document.querySelectorAll('.exercise-checkbox:checked').length;
                const total = document.querySelectorAll('.exercise-checkbox').length;
                const percentage = Math.round((completed / total) * 100);
                
                // Título com estilo
                doc.setFillColor(52, 152, 219);
                doc.rect(0, 0, 210, 40, 'F');
                
                doc.setFontSize(22);
                doc.setTextColor(255, 255, 255);
                doc.text('💪 Plano de Treino Personalizado', 105, 20, { align: 'center' });
                
                doc.setFontSize(12);
                doc.text('Homem 43 anos | Meta: 70kg → 67kg', 105, 30, { align: 'center' });
                
                // Data e estatísticas
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(11);
                doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 50);
                doc.text(`Progresso: ${completed}/${total} exercícios (${percentage}%)`, 20, 58);
                
                // Barra de progresso
                doc.setFillColor(46, 204, 113);
                doc.rect(20, 62, (percentage / 100) * 170, 8, 'F');
                doc.setDrawColor(150, 150, 150);
                doc.rect(20, 62, 170, 8);
                
                // Lista de exercícios por grupo muscular
                doc.setFontSize(14);
                doc.setTextColor(52, 152, 219);
                doc.text('Exercícios', 20, 85);
                
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                let yPosition = 95;
                let currentPage = 1;
                
                document.querySelectorAll('.muscle-group').forEach(muscleGroup => {
                    const muscleTitle = muscleGroup.querySelector('.muscle-title');
                    if (muscleTitle) {
                        if (yPosition > 250) {
                            doc.addPage();
                            currentPage++;
                            yPosition = 20;
                        }
                        
                        doc.setFontSize(12);
                        doc.setTextColor(142, 68, 173);
                        const groupName = muscleTitle.textContent.trim();
                        doc.text(groupName, 20, yPosition);
                        yPosition += 8;
                        
                        doc.setFontSize(9);
                        muscleGroup.querySelectorAll('.exercise').forEach(exercise => {
                            if (yPosition > 270) {
                                doc.addPage();
                                currentPage++;
                                yPosition = 20;
                            }
                            
                            const checkbox = exercise.querySelector('.exercise-checkbox');
                            const name = exercise.querySelector('.exercise-name').textContent;
                            const details = Array.from(exercise.querySelectorAll('.detail-item'))
                                .map(d => d.textContent.trim())
                                .join(' | ');
                            const status = checkbox.checked ? '✅' : '⬜';
                            
                            doc.setTextColor(checkbox.checked ? 39, 174, 96 : 0, 0, 0);
                            doc.setFont(undefined, checkbox.checked ? 'bold' : 'normal');
                            doc.text(`${status} ${name}`, 25, yPosition);
                            yPosition += 6;
                            
                            doc.setFont(undefined, 'normal');
                            doc.setTextColor(100, 100, 100);
                            doc.text(details, 30, yPosition);
                            yPosition += 8;
                        });
                        
                        yPosition += 3;
                    }
                });
                
                // Rodapé
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')} - Página ${currentPage}`, 105, 285, { align: 'center' });
                
                // Salvar PDF
                doc.save(`treino-${new Date().toISOString().split('T')[0]}.pdf`);
            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                alert('❌ Erro ao gerar PDF. Verifique se a biblioteca jsPDF está carregada corretamente.');
            }
        });
    }
    
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
    
    // Auto-save history periodically
    setInterval(saveHistory, 30000);
    
    console.log('💪 App de Treino carregado com sucesso!');
});

// Dark Mode Toggle - fora do DOMContentLoaded para acesso global
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Carregar tema salvo
if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

if (themeToggle) {
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
}
