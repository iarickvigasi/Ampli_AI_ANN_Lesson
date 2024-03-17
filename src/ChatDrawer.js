import React, { useEffect, useState, useRef } from 'react';
import './ChatDrawer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faTowerBroadcast, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import GPT4TurboService from './GPT4Service';

const ChatDrawer = ({ isOpen, title, onClose, selectedText }) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const apiKey = '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'; // Use your actual API key here
    const gpt4TurboService = new GPT4TurboService(apiKey);
    const [isStreaming, setIsStreaming] = useState(false);

    useEffect(() => {
        if (isOpen && !isStreaming && selectedText !== '') {
            handleSend(`Поясни: ${selectedText}`, true);
        }
    }, [isOpen, selectedText, isStreaming]);

    const handleClose = () => {
        onClose();
        setMessages([]);
    };

    const handleSend = async (text, isStreaming = false) => {
        console.log('handle send', text, isStreaming)
        setIsStreaming(true);
        try {
            const userMessage = { type: 'user', text: text };
            setMessages([...messages, userMessage]);

            if (!isStreaming) {
                const responseText = await gpt4TurboService.analyzeText([{ role: "user", content: text }]);
                const aiMessage = { type: 'ai', text: responseText };
                setMessages(messages => [...messages, aiMessage]);
            } else {
                setMessages(messages => [...messages, { type: 'ai', text: '> ' }]);
                const response = await gpt4TurboService.analyzeTextStreaming([{ role: "user", content: text }]);

                let fullText = '';
                for await (const message of response) {
                    if (message.choices) {
                        const data = message.choices[0].delta.content || '';
                        fullText += data;

                        setMessages((prevMessages) => {
                            const updatedMessages = [...prevMessages];
                            const lastAiMessage = updatedMessages[updatedMessages.length - 1];
                            lastAiMessage.text = fullText;
                            updatedMessages[updatedMessages.length - 1] = lastAiMessage;

                            return updatedMessages;
                        });
                    }
                }
                setIsStreaming(false);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleInputChange = (e) => setInputValue(e.target.value);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            handleSend(inputValue);
            setInputValue('');
        }
    };

    return (
        <>
            <div className={`backdrop ${isOpen ? 'open' : ''}`}></div>
            <div className={`chat-drawer ${isOpen ? 'open' : ''}`}>
                <div className="chat-window">
                    <div className="chat-header">
                        <span className="chat-title">{title}</span>
                        <button className="close-icon" onClick={handleClose}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </div>
                    <div className="chat-body">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.type}-message message-anim`}>
                                <span className="message-text">{message.text}</span>
                            </div>
                        ))}
                    </div>
                    <div className="chat-footer">
                        <div className="input-container">
                            <input type="text" className="chat-input" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown} />
                            <button className="chat-send-button" onClick={() => inputValue.trim() !== '' && handleSend(inputValue)}>
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatDrawer;
