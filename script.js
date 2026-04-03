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
    
    // ==========================================
    // NOVAS FUNCIONALIDADES IMPLEMENTADAS
    // ==========================================
    
    // 1. GRÁFICOS DE EVOLUÇÃO COM CHART.JS
    const chartsSection = document.getElementById('charts-section');
    let weightChartInstance = null;
    let performanceChartInstance = null;
    
    function initCharts() {
        if (!chartsSection) return;
        
        chartsSection.style.display = 'grid';
        
        // Gráfico de Peso
        const weightCtx = document.getElementById('weight-chart');
        if (weightCtx && !weightChartInstance) {
            const weightData = getWeightHistory();
            weightChartInstance = new Chart(weightCtx, {
                type: 'line',
                data: {
                    labels: weightData.labels,
                    datasets: [{
                        label: 'Peso (kg)',
                        data: weightData.values,
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
                            text: '📈 Evolução do Peso'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 65,
                            max: 75
                        }
                    }
                }
            });
        }
        
        // Gráfico de Performance
        const perfCtx = document.getElementById('performance-chart');
        if (perfCtx && !performanceChartInstance) {
            const perfData = getPerformanceHistory();
            performanceChartInstance = new Chart(perfCtx, {
                type: 'bar',
                data: {
                    labels: perfData.labels,
                    datasets: [{
                        label: 'Exercícios Concluídos',
                        data: perfData.values,
                        backgroundColor: 'rgba(46, 204, 113, 0.7)',
                        borderColor: '#27ae60',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: '💪 Performance por Treino'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 36
                        }
                    }
                }
            });
        }
    }
    
    function getWeightHistory() {
        const history = JSON.parse(localStorage.getItem('weightHistory') || '[]');
        const defaultData = [
            { date: new Date().toISOString(), weight: 73 },
            { date: new Date(Date.now() - 7*24*60*60*1000).toISOString(), weight: 72 },
            { date: new Date(Date.now() - 14*24*60*60*1000).toISOString(), weight: 71.5 }
        ];
        const data = history.length > 0 ? history : defaultData;
        
        return {
            labels: data.map(d => new Date(d.date).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})),
            values: data.map(d => d.weight)
        };
    }
    
    function getPerformanceHistory() {
        const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
        const last7 = history.slice(-7);
        
        return {
            labels: last7.map(d => new Date(d.date).toLocaleDateString('pt-BR', {weekday: 'short', day: '2-digit'})),
            values: last7.map(d => d.completed)
        };
    }
    
    // Botão para registrar peso
    const registerWeightBtn = document.createElement('button');
    registerWeightBtn.className = 'action-btn';
    registerWeightBtn.id = 'register-weight-btn';
    registerWeightBtn.innerHTML = '<i class="fas fa-weight"></i> Registrar Peso';
    registerWeightBtn.addEventListener('click', () => {
        const currentWeight = prompt('Digite seu peso atual (kg):', '73');
        if (currentWeight && !isNaN(parseFloat(currentWeight))) {
            const weightHistory = JSON.parse(localStorage.getItem('weightHistory') || '[]');
            weightHistory.push({
                date: new Date().toISOString(),
                weight: parseFloat(currentWeight)
            });
            localStorage.setItem('weightHistory', JSON.stringify(weightHistory));
            
            // Atualizar gráfico
            if (weightChartInstance) {
                weightChartInstance.destroy();
                weightChartInstance = null;
                initCharts();
            }
            
            alert(`✅ Peso registrado: ${currentWeight}kg`);
        }
    });
    
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        actionButtons.appendChild(registerWeightBtn);
    }
    
    // Inicializar gráficos ao carregar
    setTimeout(initCharts, 1000);
    
    // 2. CALCULADORA DE 1RM
    const calc1RMBtn = document.createElement('button');
    calc1RMBtn.className = 'action-btn';
    calc1RMBtn.id = 'calc-1rm-btn';
    calc1RMBtn.innerHTML = '<i class="fas fa-calculator"></i> Calc 1RM';
    calc1RMBtn.addEventListener('click', () => {
        const weight = prompt('Peso levantado (kg):', '18');
        const reps = prompt('Repetições realizadas:', '10');
        
        if (weight && reps && !isNaN(parseFloat(weight)) && !isNaN(parseInt(reps))) {
            const w = parseFloat(weight);
            const r = parseInt(reps);
            
            // Fórmula de Epley
            const oneRM = Math.round(w * (1 + r / 30) * 10) / 10;
            
            // Sugestões de carga
            const loads = {
                'Força Máxima (1-3 reps)': `${Math.round(oneRM * 0.9)}-${oneRM}kg`,
                'Hipertrofia (6-12 reps)': `${Math.round(oneRM * 0.75)}-${Math.round(oneRM * 0.85)}kg`,
                'Resistência (15+ reps)': `${Math.round(oneRM * 0.6)}-${Math.round(oneRM * 0.7)}kg`
            };
            
            let message = `🏋️ Seu 1RM estimado: ${oneRM}kg\n\n`;
            message += '📊 Sugestões de carga:\n';
            for (const [type, load] of Object.entries(loads)) {
                message += `\n${type}: ${load}`;
            }
            
            alert(message);
        }
    });
    
    if (actionButtons) {
        actionButtons.appendChild(calc1RMBtn);
    }
    
    // 3. TEMPORIZADOR INTELIGENTE COM ALERTA SONORO
    let restTimerInterval;
    let restTimeLeft = 90;
    let isRestRunning = false;
    let audioContext = null;
    
    function playBeep() {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 880;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
    
    function startSmartTimer(seconds = 90) {
        clearInterval(restTimerInterval);
        restTimeLeft = seconds;
        isRestRunning = true;
        
        const timerDisplay = document.getElementById('timer-display');
        const startTimerBtn = document.getElementById('start-timer');
        
        if (timerDisplay) timerDisplay.textContent = restTimeLeft;
        if (startTimerBtn) startTimerBtn.textContent = 'Pausar';
        
        restTimerInterval = setInterval(() => {
            restTimeLeft--;
            
            if (timerDisplay) {
                timerDisplay.textContent = restTimeLeft;
                
                // Mudar cor nos últimos 10 segundos
                if (restTimeLeft <= 10) {
                    timerDisplay.style.color = '#e74c3c';
                    timerDisplay.style.animation = 'pulse 0.5s infinite';
                } else {
                    timerDisplay.style.color = '';
                    timerDisplay.style.animation = '';
                }
            }
            
            // Alerta sonoro nos últimos 3 segundos
            if (restTimeLeft <= 3 && restTimeLeft > 0) {
                playBeep();
            }
            
            if (restTimeLeft <= 0) {
                clearInterval(restTimerInterval);
                isRestRunning = false;
                
                if (timerDisplay) {
                    timerDisplay.textContent = '0';
                    timerDisplay.style.color = '#27ae60';
                }
                if (startTimerBtn) startTimerBtn.textContent = 'Iniciar';
                
                // Tocar 3 beeps
                playBeep();
                setTimeout(playBeep, 300);
                setTimeout(playBeep, 600);
                
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('⏰ Descanso Terminado!', {
                        body: 'Hora de continuar o treino!',
                        icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965315.png'
                    });
                } else {
                    alert('⏰ Tempo de descanso terminado!');
                }
            }
        }, 1000);
    }
    
    // Solicitar permissão para notificações
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // 4. EXPORTAR DADOS EM JSON/CSV
    const exportJSONBtn = document.createElement('button');
    exportJSONBtn.className = 'action-btn';
    exportJSONBtn.id = 'export-json-btn';
    exportJSONBtn.innerHTML = '<i class="fas fa-file-export"></i> Exportar Dados';
    exportJSONBtn.addEventListener('click', () => {
        const exportType = confirm('OK para exportar em JSON\nCancelar para exportar em CSV');
        
        if (exportType) {
            // Exportar JSON
            const data = {
                workoutHistory: JSON.parse(localStorage.getItem('workoutHistory') || '[]'),
                weightHistory: JSON.parse(localStorage.getItem('weightHistory') || '[]'),
                darkMode: localStorage.getItem('darkMode'),
                exercises: {}
            };
            
            document.querySelectorAll('.exercise-checkbox').forEach(cb => {
                const exerciseId = cb.closest('.exercise').getAttribute('data-id');
                const exerciseName = cb.closest('.exercise').querySelector('.exercise-name').textContent;
                data.exercises[exerciseId] = {
                    name: exerciseName,
                    completed: cb.checked
                };
            });
            
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `treino-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            // Exportar CSV
            const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
            let csv = 'Data,Exercícios Concluídos,Total,Percentual\n';
            
            history.forEach(h => {
                const date = new Date(h.date).toLocaleDateString('pt-BR');
                csv += `${date},${h.completed},${h.total},${h.percentage}%\n`;
            });
            
            const blob = new Blob([csv], {type: 'text/csv'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `treino-historico-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        }
        
        alert('✅ Dados exportados com sucesso!');
    });
    
    if (actionButtons) {
        actionButtons.appendChild(exportJSONBtn);
    }
    
    // 5. SERVICE WORKER PARA PWA
    if ('serviceWorker' in navigator) {
        // Registrar service worker (inline para simplicidade)
        const swCode = `
            const CACHE_NAME = 'treino-v1';
            const urlsToCache = ['/', '/index.html', '/styles.css', '/script.js'];
            
            self.addEventListener('install', event => {
                event.waitUntil(
                    caches.open(CACHE_NAME)
                        .then(cache => cache.addAll(urlsToCache))
                );
            });
            
            self.addEventListener('fetch', event => {
                event.respondWith(
                    caches.match(event.request)
                        .then(response => response || fetch(event.request))
                );
            });
            
            self.addEventListener('activate', event => {
                event.waitUntil(
                    caches.keys().then(cacheNames => {
                        return Promise.all(
                            cacheNames.filter(name => name !== CACHE_NAME)
                                        .map(name => caches.delete(name))
                        );
                    })
                );
            });
        `;
        
        // Criar blob do service worker
        const blob = new Blob([swCode], {type: 'application/javascript'});
        const swUrl = URL.createObjectURL(blob);
        
        navigator.serviceWorker.register(swUrl)
            .then(registration => {
                console.log('Service Worker registrado:', registration.scope);
            })
            .catch(error => {
                console.log('Erro ao registrar Service Worker:', error);
            });
    }
    
    // Manifesto PWA (inline)
    const manifest = {
        name: 'Plano de Treino Personalizado',
        short_name: 'Treino',
        description: 'App de treino personalizado para homem 43 anos',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3498db',
        icons: [
            {
                src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💪</text></svg>',
                sizes: '192x192',
                type: 'image/svg+xml'
            }
        ]
    };
    
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = 'data:application/manifest+json,' + encodeURIComponent(JSON.stringify(manifest));
    document.head.appendChild(manifestLink);
    
    console.log('✅ Todas as novas funcionalidades foram carregadas!');
    
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
