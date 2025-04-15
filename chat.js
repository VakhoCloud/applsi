class ChatSupport {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.chatHistory = [];
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.minimizeBtn = document.getElementById('minimizeBtn');
        this.chatContainer = document.getElementById('chatContainer');
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        this.minimizeBtn.addEventListener('click', () => this.toggleChat());
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.userInput.value = '';

        try {
            const response = await this.getGeminiResponse(message);
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('Sorry, I encountered an error. Please try again later.', 'bot');
        }
    }

    async getGeminiResponse(message) {
        const systemPrompt = `You are a helpful and friendly customer support agent for VideoShare, a video sharing platform. Your role is to assist users with their questions and concerns. Follow these guidelines:

1. Be professional, polite, and empathetic
2. Keep responses concise and clear
3. Focus on providing accurate information about:
   - Video uploading process
   - Account management
   - Video playback issues
   - Subscription and channel features
   - Content guidelines and policies
4. If you don't know the answer, be honest and suggest contacting support
5. Use a friendly and conversational tone
6. Break down complex instructions into simple steps
7. Always maintain a helpful attitude

Current user message: ${message}`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=AIzaSyBf6ICQAxR9eA1idY3jr2lrRIBJHc76Q8Y`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: systemPrompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    },
                    safetySettings: [{
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            
            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
                throw new Error('Invalid response format from API');
            }

            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    toggleChat() {
        this.chatContainer.style.display = this.chatContainer.style.display === 'none' ? 'flex' : 'none';
    }
}

// Initialize chat support when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const chatSupport = new ChatSupport('AIzaSyBf6ICQAxR9eA1idY3jr2lrRIBJHc76Q8Y'); // Replace with your actual API key
}); 