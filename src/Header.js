import React from 'react';

const Header = ({ currentBlock, totalBlocks }) => {
    const progress = ((currentBlock + 1) / totalBlocks) * 100;

    return (
        <header className="bg-white shadow-md py-8 mb-8">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="h-2 bg-gray-300 rounded-full">
                        <div
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
