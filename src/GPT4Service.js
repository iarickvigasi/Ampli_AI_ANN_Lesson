import OpenAI from 'openai';


export default class GPT4TurboService {
    apiKey;
    openai;

    constructor(apiKey) {
        this.apiKey = apiKey;
        this.openai = new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: true
        });
    }

    async analyzeText(messages){
        const payload = {
            model: "gpt-4-turbo-preview",
            messages: messages
        };

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        };

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', options);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            throw error;
        }
    }

    async analyzeTextStreaming(messages){
        try {
            return await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    { role: 'system', content: 'You are a helpfull assistant. Reply in clean and valid Ukrainian language without errors. Твій співрозмовник це підліток 12 років, який вивчає нейронні мережі. Тож будь дуже корисним, пояснюй просто і з прикладами.'},
                    ...messages
                ],
                stream: true,
            });
        } catch (error) {
            throw error;
        }
    }
}
