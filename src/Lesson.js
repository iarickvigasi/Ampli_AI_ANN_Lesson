import React, { useEffect, useState } from 'react';
import Header from './Header';
import InteractiveNeuronChester from './InteractiveNeuron/InteractiveNeuronChester';
import ChatWindow from './ChatWindow';
import { Tooltip } from 'react-tooltip';
import ChatDrawer from './ChatDrawer';

const Lesson = ({ title, blocks }) => {
    const [currentBlock, setCurrentBlock] = useState(0);
    const [selectedText, setSelectedText] = useState('');
    const [showChatWindow, setShowChatWindow] = useState(false);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (selectedText !== '') {
            setTooltipVisible(true);
            // Example to calculate and set the tooltip position here based on the selection
            // This is a placeholder, you'll need to adjust based on actual requirements
            const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
            setTooltipPosition({
                top: rect.top + window.scrollY - 50,
                left: rect.left + window.scrollX + (rect.width / 2),
            });
        } else {
            setTooltipVisible(false);
        }
    }, [selectedText]);

    const handleTextSelection = () => {
        const selection = window.getSelection().toString().trim();
        if (selection !== '') {
            setSelectedText(selection);
        } else {
            setSelectedText('');
        }
    };

    const handleExplainClick = () => {
        setShowChatWindow(true);
        setTooltipVisible(false); // Hide tooltip when chat opens
    };

    const handleCloseChatWindow = () => {
        setShowChatWindow(false);
    };

    const renderBlock = (block, index) => {
        switch (block.type) {
            case 'paragraph':
                return <p key={index} className="mb-8 text-lg" dangerouslySetInnerHTML={{__html: block.content}}></p>;
            case 'quiz':
                return (
                    <div key={index} className="mb-8">
                        <h3 className="mb-4 text-xl font-bold">{block.question}</h3>
                        {/* Render quiz options and handle user selection */}
                    </div>
                );
            case 'image':
                return (
                    <>
                        <img key={index} src={block.src} alt={block.alt} className="mb-8 mx-auto"/>
                        { block.content && <p key={`${index}_p`} className="mb-8 text-lg" dangerouslySetInnerHTML={{__html: block.content}}></p> }
                    </>
                );
            case 'interactive-neuron-chester':
                return <InteractiveNeuronChester key={index} />;
            // Add more cases for other block types
            default:
                return null;
        }
    };

    return (
        <div onMouseUp={handleTextSelection}>
            <div className="mx-auto">
                <Header currentBlock={currentBlock} totalBlocks={blocks.length}/>
                <div className="сontainer max-w-3xl mx-auto py-16 px-8">
                    <h1 className="text-4xl font-bold mb-12">{title}</h1>
                    {blocks.slice(0, currentBlock + 1).map(renderBlock)}
                    {currentBlock < blocks.length - 1 && (
                        <button
                            className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg"
                            onClick={() => setCurrentBlock(currentBlock + 1)}
                        >
                            Зрозумів!
                        </button>
                    )}
                </div>
            </div>
            {tooltipVisible && (
                <div
                    style={{ position: 'absolute', top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` }}
                    className="p-2 bg-white rounded-lg shadow-lg border border-gray-200"
                >
                    <button
                        onClick={handleExplainClick}
                        className="text-md text-blue-500 bg-transparent hover:text-blue-700"
                    >
                        Поясни
                    </button>
                </div>
            )}
            <ChatDrawer isOpen={showChatWindow} onClose={handleCloseChatWindow} title={title} selectedText={selectedText} />
        </div>
    );
};

export default Lesson;
