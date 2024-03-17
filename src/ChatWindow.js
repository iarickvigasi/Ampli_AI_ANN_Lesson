import React, { useEffect, useState } from 'react';

const ChatWindow = ({ selectedText, onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'system', content: `Користувач це підліток 12 років, який читає наш початковий урок про штучні нейрони та вступ до нейронних мереж. Будь йому корисним. Ось він відилив текст, і попросив пояснити: "${selectedText}"` },
    ]);
    const [inputMessage, setInputMessage] = useState('');

    const apiKey = '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';
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    useEffect(() => {
        // Function to send the initial selectedText as a question automatically
        const sendInitialQuestion = async () => {
            const newMessage = { role: 'user', content: selectedText };
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            try {
                const requestBody = {
                    model: 'gpt-4-turbo-preview',
                    messages: messages.concat(newMessage), // Use concat to avoid mutating the original state
                    temperature: 0.7,
                };

                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify(requestBody),
                };

                const response = await fetch(apiUrl, requestOptions);
                const data = await response.json();

                if (response.ok) {
                    const assistantMessage = { role: 'assistant', content: data.choices[0].message.content };
                    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
                } else {
                    console.error('Error:', data);
                    // Handle API error
                }
            } catch (error) {
                console.error('Error:', error);
                // Handle fetch error
            }
        };

        // Call sendInitialQuestion only once when the component mounts
        sendInitialQuestion();
    }, [selectedText]); // This effect depends on selectedText, so it will run every time selectedText changes

    const handleSendMessage = async () => {
        const newMessage = { role: 'user', content: inputMessage };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputMessage('');

        try {
            const requestBody = {
                model: 'gpt-4-turbo-preview',
                messages: [...messages, newMessage],
                temperature: 0.7,
            };

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify(requestBody),
            };

            const response = await fetch(apiUrl, requestOptions);
            const data = await response.json();

            if (response.ok) {
                const assistantMessage = data.choices[0].message;
                setMessages((prevMessages) => [...prevMessages, assistantMessage]);
            } else {
                console.error('Error:', data);
                // Handle API error
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle fetch error
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-96 overflow-y-auto">
                <div className="mb-4">
                    {messages.slice(1).map((message, index) => (
                        <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : ''}`}>
              <span className={`inline-block p-2 rounded ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {message.content}
              </span>
                        </div>
                    ))}
                </div>
                <div className="flex">
                    <input
                        type="text"
                        className="flex-grow border border-gray-300 rounded p-2 mr-2"
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>
                <button
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
