document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chatContainer');
    const finalScreen = document.getElementById('finalScreen');
    const progressBar = document.getElementById('progressBar');
    const finalNome = document.getElementById('finalNome');
    const whatsappFinalBtn = document.getElementById('whatsappFinalBtn');

    if (!chatContainer) return;

    const leadData = {};
    let currentStep = 0;
    let isTyping = false;

    const steps = [
        {
            key: null,
            type: 'bot',
            text: 'Olá! Bem-vindo à <strong>Forje Prime</strong>. 🔥<br><br>Vou te pedir alguns dados rápidos para entender se seu negócio tem perfil para nossa estrutura.',
            delay: 500
        },
        {
            key: 'nome',
            type: 'input',
            text: 'Qual é o seu nome?',
            placeholder: 'Digite seu nome completo',
            validate: v => v.length >= 2,
            error: 'Por favor, digite um nome válido.',
            delay: 300
        },
        {
            key: 'empresa',
            type: 'input',
            text: 'Qual é o nome da sua empresa?',
            placeholder: 'Nome da empresa ou marca',
            validate: v => v.length >= 2,
            error: 'Digite o nome da empresa.',
            delay: 300
        },
        {
            key: 'telefone',
            type: 'input',
            text: 'Qual é o seu telefone com DDD?',
            placeholder: 'Ex: (22) 98823-1811',
            validate: v => v.replace(/\D/g, '').length >= 10,
            error: 'Digite um telefone válido com DDD.',
            delay: 300
        },
        {
            key: 'email',
            type: 'input',
            text: 'Qual é o seu e-mail?',
            placeholder: 'exemplo@email.com',
            validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            error: 'Digite um e-mail válido.',
            delay: 300
        },
        {
            key: 'faturamento',
            type: 'options',
            text: 'Qual seu faturamento mensal aproximado hoje?',
            options: [
                'Até R$ 10.000',
                'R$ 10.000 a R$ 30.000',
                'R$ 30.000 a R$ 100.000',
                'Acima de R$ 100.000'
            ],
            delay: 400
        },
        {
            key: 'investimento',
            type: 'options',
            text: 'Quanto você consegue investir mensalmente em aquisição de clientes?',
            options: [
                'Até R$ 2.000',
                'R$ 2.000 a R$ 5.000',
                'R$ 5.000 a R$ 10.000',
                'Acima de R$ 10.000'
            ],
            delay: 400
        },
        {
            key: null,
            type: 'bot',
            text: 'Perfeito! Recebi todas as informações. Direcionando você para nosso time...',
            delay: 600
        }
    ];

    function updateProgress() {
        const total = steps.filter(s => s.key !== null).length;
        const answered = Object.keys(leadData).length;
        const pct = Math.min((answered / total) * 100, 100);
        progressBar.style.width = pct + '%';
    }

    function createMessageBubble(text, isBot) {
        const msg = document.createElement('div');
        msg.className = 'message ' + (isBot ? 'bot' : 'user');
        msg.style.opacity = '0';
        msg.style.transform = 'translateY(20px)';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = isBot
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = text;

        msg.appendChild(avatar);
        msg.appendChild(bubble);
        return msg;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'message bot';
        typing.id = 'typingIndicator';
        typing.style.opacity = '1';
        typing.style.transform = 'translateY(0)';

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';

        typing.appendChild(avatar);
        typing.appendChild(bubble);
        chatContainer.appendChild(typing);
        scrollToBottom();
    }

    function removeTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    function scrollToBottom() {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
    }

    function addBotMessage(text, delay = 400) {
        return new Promise(resolve => {
            showTyping();
            isTyping = true;
            setTimeout(() => {
                removeTyping();
                const msg = createMessageBubble(text, true);
                chatContainer.appendChild(msg);
                requestAnimationFrame(() => {
                    msg.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    msg.style.opacity = '1';
                    msg.style.transform = 'translateY(0)';
                });
                isTyping = false;
                scrollToBottom();
                resolve();
            }, delay);
        });
    }

    function addUserMessage(text) {
        const msg = createMessageBubble(text, false);
        chatContainer.appendChild(msg);
        requestAnimationFrame(() => {
            msg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            msg.style.opacity = '1';
            msg.style.transform = 'translateY(0)';
        });
        scrollToBottom();
    }

    function showError(text) {
        const err = document.createElement('div');
        err.className = 'message error';
        err.innerHTML = '<div class="message-bubble">' + text + '</div>';
        chatContainer.appendChild(err);
        scrollToBottom();
        setTimeout(() => err.remove(), 3000);
    }

    function createOptions(options, onSelect) {
        const container = document.createElement('div');
        container.className = 'options-container';
        container.style.opacity = '0';

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => {
                container.remove();
                onSelect(opt);
            });
            container.appendChild(btn);
        });

        chatContainer.appendChild(container);
        requestAnimationFrame(() => {
            container.style.transition = 'opacity 0.3s ease';
            container.style.opacity = '1';
        });
        scrollToBottom();
    }

    function createInput(placeholder, onSubmit) {
        const container = document.createElement('div');
        container.className = 'input-container';
        container.style.display = 'flex';
        container.style.opacity = '0';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'input-field';
        input.placeholder = placeholder;
        input.autocomplete = 'off';

        const btn = document.createElement('button');
        btn.className = 'send-btn';
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';

        function submit() {
            const val = input.value.trim();
            if (!val) return;
            container.remove();
            onSubmit(val);
        }

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') submit();
        });
        btn.addEventListener('click', submit);

        container.appendChild(input);
        container.appendChild(btn);
        chatContainer.appendChild(container);

        requestAnimationFrame(() => {
            container.style.transition = 'opacity 0.3s ease';
            container.style.opacity = '1';
            input.focus();
        });
        scrollToBottom();
    }

    async function runStep(index) {
        if (index >= steps.length) {
            finishFlow();
            return;
        }

        const step = steps[index];
        currentStep = index;

        if (step.type === 'bot') {
            await addBotMessage(step.text, step.delay || 400);
            runStep(index + 1);
        } else if (step.type === 'input') {
            await addBotMessage(step.text, step.delay || 400);
            createInput(step.placeholder, value => {
                if (step.validate && !step.validate(value)) {
                    addUserMessage(value);
                    showError(step.error);
                    setTimeout(() => {
                        addBotMessage(step.text, 200);
                        createInput(step.placeholder, arguments.callee);
                    }, 1200);
                    return;
                }
                addUserMessage(value);
                if (step.key) leadData[step.key] = value;
                updateProgress();
                runStep(index + 1);
            });
        } else if (step.type === 'options') {
            await addBotMessage(step.text, step.delay || 400);
            createOptions(step.options, value => {
                addUserMessage(value);
                if (step.key) leadData[step.key] = value;
                updateProgress();
                runStep(index + 1);
            });
        }
    }

    function finishFlow() {
        updateProgress();
        setTimeout(() => {
            chatContainer.style.display = 'none';
            finalScreen.style.display = 'flex';
            finalNome.textContent = leadData.nome || 'empresário';

            const msg = encodeURIComponent(
                `Olá! Sou ${leadData.nome || ''} da ${leadData.empresa || ''}.\n\n` +
                `Completei a pré-qualificação no site e gostaria de agendar minha análise gratuita.\n\n` +
                `*Dados cadastrados:*\n` +
                `• Nome: ${leadData.nome || ''}\n` +
                `• Empresa: ${leadData.empresa || ''}\n` +
                `• Telefone: ${leadData.telefone || ''}\n` +
                `• E-mail: ${leadData.email || ''}\n` +
                `• Faturamento: ${leadData.faturamento || ''}\n` +
                `• Investimento mensal: ${leadData.investimento || ''}`
            );

            whatsappFinalBtn.href = `https://wa.me/5522988231811?text=${msg}`;
        }, 600);
    }

    setTimeout(() => runStep(0), 400);
});