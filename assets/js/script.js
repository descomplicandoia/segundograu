// Função para toggle dos acordeões
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.accordion-icon');
    
    // Remove active de todos os outros acordeões (opcional - para ter apenas um aberto)
    // document.querySelectorAll('.accordion-header').forEach(h => {
    //     if (h !== header) {
    //         h.classList.remove('active');
    //         h.nextElementSibling.classList.remove('active');
    //     }
    // });
    
    // Toggle do acordeão atual
    header.classList.toggle('active');
    content.classList.toggle('active');
}

// Função para copiar texto para clipboard
async function copyToClipboard(button) {
    const targetId = button.getAttribute('data-target');
    const codeBlock = document.getElementById(targetId);
    const text = codeBlock.textContent;
    
    try {
        // Tenta usar a API moderna de clipboard
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback para dispositivos mais antigos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }
        
        // Feedback visual
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        button.classList.add('copied');
        
        // Mostra toast notification
        showToast('Prompt copiado com sucesso!');
        
        // Restaura o botão após 2 segundos
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
        
    } catch (err) {
        console.error('Erro ao copiar:', err);
        showToast('Erro ao copiar. Tente selecionar e copiar manualmente.', 'error');
    }
}

// Função para mostrar toast notifications
function showToast(message, type = 'success') {
    // Remove toast existente se houver
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Cria novo toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    if (type === 'error') {
        toast.style.background = '#e74c3c';
    }
    
    document.body.appendChild(toast);
    
    // Mostra o toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Remove o toast após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona suporte a teclado para acordeões
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.setAttribute('tabindex', '0');
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleAccordion(this);
            }
        });
    });
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Função para adicionar mais prompts dinamicamente
function addPrompt(category, title, description, code) {
    const categoryElement = document.querySelector(`[data-category="${category}"]`);
    if (!categoryElement) return;
    
    const promptId = `prompt-${Date.now()}`;
    
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';
    accordionItem.innerHTML = `
        <div class="accordion-header" onclick="toggleAccordion(this)">
            <h4>${title}</h4>
            <span class="accordion-description">${description}</span>
            <i class="fas fa-chevron-down accordion-icon"></i>
        </div>
        <div class="accordion-content">
            <div class="code-container">
                <div class="code-header">
                    <span>${title}</span>
                    <button class="copy-btn" onclick="copyToClipboard(this)" data-target="${promptId}">
                        <i class="fas fa-copy"></i> Copiar
                    </button>
                </div>
                <pre class="code-block" id="${promptId}">${code}</pre>
            </div>
        </div>
    `;
    
    categoryElement.appendChild(accordionItem);
}
