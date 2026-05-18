(function() {
    // 1. Inject the CSS styles for the widget
    const style = document.createElement('style');
    style.innerHTML = `
        #voyago-chat-widget {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            pointer-events: none;
        }

        #voyago-chat-fab {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: none;
            outline: none;
            pointer-events: auto;
        }

        #voyago-chat-fab:hover {
            transform: scale(1.1);
        }

        /* Chat Panel */
        #voyago-chat-panel {
            width: 360px;
            height: 550px;
            max-height: 80vh;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            margin-bottom: 16px;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
            transform-origin: bottom right;
            border: 1px solid #F1F5F9;
        }

        #voyago-chat-panel.active {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: all;
        }

        /* Header */
        .v-chat-header {
            padding: 16px 20px;
            background: white;
            border-bottom: 1px solid #F1F5F9;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
        }

        .v-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .v-bot-avatar {
            width: 36px;
            height: 36px;
            background: #3B82F6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }

        .v-bot-title {
            font-size: 16px;
            font-weight: 700;
            color: #0F172A;
            margin: 0;
        }

        .v-header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #3B82F6;
        }

        .v-header-btn {
            background: none;
            border: none;
            cursor: pointer;
            color: #64748B;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s, background 0.2s;
        }

        .v-header-btn:hover {
            background: #F1F5F9;
            color: #3B82F6;
        }

        /* Message Area */
        .v-chat-messages {
            flex-grow: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: #FAFAFA;
        }

        .v-chat-messages::-webkit-scrollbar { width: 6px; }
        .v-chat-messages::-webkit-scrollbar-track { background: transparent; }
        .v-chat-messages::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }

        /* Bubbles */
        .v-msg-row {
            display: flex;
            width: 100%;
        }
        
        .v-msg-row.bot { justify-content: flex-start; }
        .v-msg-row.user { justify-content: flex-end; }

        .v-msg-bubble {
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.5;
            box-shadow: 0 2px 5px rgba(0,0,0,0.02);
            word-wrap: break-word;
        }

        .bot .v-msg-bubble {
            background: #F1F5F9;
            color: #334155;
            border-top-left-radius: 4px;
        }

        .user .v-msg-bubble {
            background: #3B82F6;
            color: white;
            border-top-right-radius: 4px;
        }

        /* Quick Replies */
        .v-quick-replies {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
        }

        .v-quick-reply-btn {
            background: white;
            border: 1px solid #3B82F6;
            color: #3B82F6;
            padding: 8px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .v-quick-reply-btn:hover {
            background: #EFF6FF;
        }

        /* Package Card */
        .v-package-card {
            background: white;
            border: 1px solid #E2E8F0;
            border-radius: 12px;
            overflow: hidden;
            margin-top: 12px;
        }
        .v-package-info { padding: 12px; }
        .v-package-title { font-weight: 700; font-size: 14px; color: #0F172A; margin: 0 0 4px 0; }
        .v-package-reason { font-size: 12px; color: #64748B; background: #F8FAFC; padding: 8px; border-radius: 6px; margin-bottom: 10px; }
        .v-package-btn { 
            display: block; 
            text-align: center; 
            background: #0F172A; 
            color: white; 
            text-decoration: none; 
            padding: 8px; 
            border-radius: 6px; 
            font-size: 13px; 
            font-weight: 500;
        }
        .v-package-btn:hover { background: #1E293B; }

        /* Input Area */
        .v-chat-input-area {
            padding: 16px;
            background: white;
            border-top: 1px solid #F1F5F9;
            flex-shrink: 0;
            position: relative;
        }

        .v-input-wrapper {
            display: flex;
            align-items: center;
            background: #F1F5F9;
            border-radius: 24px;
            padding: 4px 4px 4px 16px;
        }

        .v-chat-input {
            flex-grow: 1;
            border: none;
            background: transparent;
            outline: none;
            font-size: 14px;
            color: #334155;
            padding: 8px 0;
        }

        .v-send-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #F97316;
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.2s;
            flex-shrink: 0;
        }

        .v-send-btn:hover { background: #EA580C; }
        .v-send-btn:disabled { background: #CBD5E1; cursor: not-allowed; }

        /* Typing Indicator */
        .v-typing { display: flex; gap: 4px; padding: 4px 0; }
        .v-typing span {
            width: 6px; height: 6px; background: #94A3B8; border-radius: 50%;
            animation: v-bounce 1.4s infinite ease-in-out both;
        }
        .v-typing span:nth-child(1) { animation-delay: -0.32s; }
        .v-typing span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes v-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

        /* Require Auth Overlay */
        .v-auth-overlay {
            position: absolute; inset: 0; background: rgba(255,255,255,0.95);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 10; text-align: center; padding: 20px;
        }
        .v-auth-overlay.hidden { display: none; }
        .v-auth-btn { background: #3B82F6; color: white; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-weight: 500; margin-top: 12px; }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML Structure
    const widgetHTML = `
        <div id="voyago-chat-widget">
            <div id="voyago-chat-panel">
                <div class="v-chat-header">
                    <div class="v-header-left">
                        <div class="v-bot-avatar">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 1 1 12 2Z"/></svg>
                        </div>
                        <h3 class="v-bot-title">Voyago Assistant</h3>
                    </div>
                    <div class="v-header-actions">
                        <button class="v-header-btn" id="v-refresh-btn" title="Refresh Chat">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        </button>
                        <button class="v-header-btn" id="v-close-btn" title="Close">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>

                <div class="v-chat-messages" id="v-chat-messages">
                    <!-- Initial Welcome Message -->
                    <div class="v-msg-row bot">
                        <div class="v-msg-bubble">
                            Hi! I'm your Voyago AI travel assistant. How can I help you today?
                            <div class="v-quick-replies" id="v-quick-replies">
                                <button class="v-quick-reply-btn">What services do you offer?</button>
                                <button class="v-quick-reply-btn">Recommend a beach trip</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="v-chat-input-area">
                    <form id="v-chat-form" class="v-input-wrapper">
                        <input type="text" id="v-chat-input" class="v-chat-input" placeholder="Ask a question..." autocomplete="off">
                        <button type="submit" id="v-send-btn" class="v-send-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:-2px"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </form>
                    <div style="text-align:center; margin-top:8px">
                        <span style="font-size:10px; color:#94A3B8">Powered by Google Gemini</span>
                    </div>
                </div>
            </div>

            <button id="voyago-chat-fab">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </button>
        </div>
    `;
    
    // Append to body securely
    const wrapper = document.createElement('div');
    wrapper.innerHTML = widgetHTML;
    document.body.appendChild(wrapper.firstElementChild);

    // 3. Logic Setup
    const fab = document.getElementById('voyago-chat-fab');
    const panel = document.getElementById('voyago-chat-panel');
    const closeBtn = document.getElementById('v-close-btn');
    const refreshBtn = document.getElementById('v-refresh-btn');
    const messagesContainer = document.getElementById('v-chat-messages');
    const chatForm = document.getElementById('v-chat-form');
    const chatInput = document.getElementById('v-chat-input');
    const sendBtn = document.getElementById('v-send-btn');
    
    let conversationHistory = [];

    // Toggle UI
    const toggleChat = () => {
        panel.classList.toggle('active');
        if (panel.classList.contains('active')) {
            chatInput.focus();
        }
    };

    fab.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    const scrollToBottom = () => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // Chat Functions
    const appendUserMessage = (text) => {
        const row = document.createElement('div');
        row.className = 'v-msg-row user';
        row.innerHTML = `<div class="v-msg-bubble">${text}</div>`;
        messagesContainer.appendChild(row);
        scrollToBottom();
    };

    const appendBotMessage = (htmlContent) => {
        const row = document.createElement('div');
        row.className = 'v-msg-row bot';
        row.innerHTML = `<div class="v-msg-bubble">${htmlContent}</div>`;
        messagesContainer.appendChild(row);
        scrollToBottom();
    };

    const showTyping = () => {
        const id = 'typing-' + Date.now();
        const row = document.createElement('div');
        row.className = 'v-msg-row bot';
        row.id = id;
        row.innerHTML = `
            <div class="v-msg-bubble" style="padding:16px">
                <div class="v-typing"><span></span><span></span><span></span></div>
            </div>`;
        messagesContainer.appendChild(row);
        scrollToBottom();
        return id;
    };

    const hideTyping = (id) => {
        const el = document.getElementById(id);
        if (el) el.remove();
    };

    // Quick Replies Listener
    document.getElementById('v-quick-replies').addEventListener('click', (e) => {
        if (e.target.classList.contains('v-quick-reply-btn')) {
            const text = e.target.textContent;
            e.target.parentElement.style.display = 'none'; // hide replies
            chatInput.value = text;
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    // Reset Chat
    refreshBtn.addEventListener('click', () => {
        conversationHistory = [];
        messagesContainer.innerHTML = `
            <div class="v-msg-row bot">
                <div class="v-msg-bubble">
                    Hi! I'm your Voyago AI travel assistant. How can I help you today?
                    <div class="v-quick-replies" id="v-quick-replies">
                        <button class="v-quick-reply-btn">What services do you offer?</button>
                        <button class="v-quick-reply-btn">Recommend a beach trip</button>
                    </div>
                </div>
            </div>
        `;
        // Re-attach quick reply listener
        document.getElementById('v-quick-replies').addEventListener('click', (e) => {
            if (e.target.classList.contains('v-quick-reply-btn')) {
                const text = e.target.textContent;
                e.target.parentElement.style.display = 'none';
                chatInput.value = text;
                chatForm.dispatchEvent(new Event('submit'));
            }
        });
    });

    // Send Message
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        const token = localStorage.getItem('token');

        // Clean up UI
        const qr = document.getElementById('v-quick-replies');
        if (qr) qr.style.display = 'none';

        chatInput.value = '';
        chatInput.disabled = true;
        sendBtn.disabled = true;
        
        appendUserMessage(text);
        const typingId = showTyping();

        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch('/api/trip-planner', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    userMessage: text,
                    conversationHistory: conversationHistory
                })
            });

            hideTyping(typingId);

            if (!res.ok) {
                throw new Error('API Error');
            }

            const data = await res.json();
            
            conversationHistory.push({ role: 'user', content: text });
            conversationHistory.push({ role: 'assistant', content: JSON.stringify(data) });

            let responseHtml = `<p style="margin:0; white-space:pre-wrap">${data.message}</p>`;
            
            if (data.recommendations && data.recommendations.length > 0) {
                data.recommendations.forEach(rec => {
                    responseHtml += `
                        <div class="v-package-card">
                            <div class="v-package-info">
                                <h4 class="v-package-title">${rec.name}</h4>
                                <div class="v-package-reason">${rec.reason}</div>
                                <a href="package-details.html?id=${rec.packageId}" class="v-package-btn">View Package</a>
                            </div>
                        </div>
                    `;
                });
            }

            appendBotMessage(responseHtml);

        } catch (error) {
            hideTyping(typingId);
            appendBotMessage('<p style="margin:0; color:#DC2626">Sorry, I encountered a network error. Please try again.</p>');
        } finally {
            chatInput.disabled = false;
            sendBtn.disabled = false;
            chatInput.focus();
        }
    });
})();
