import React from 'react';

const RefreshButton = ({ onRefresh }) => {
    return (
        <button className="refresh-button" onClick={onRefresh}>
            Clear Conversation 🧹
        </button>
    );
};

export {RefreshButton};
