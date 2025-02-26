import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const NotificationContainer = ({ notifications, removeNotification }) => {
    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="space-y-2">
                {notifications.map((notification) => (
                    <CustomNotification 
                        key={notification.id}
                        {...notification}
                        onClose={() => removeNotification(notification.id)}
                    />
                ))}
            </div>
        </div>
    );
};

const CustomNotification = ({ type, message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    // เพิ่ม min-width ให้ notification มีขนาดที่เหมาะสม
    const baseStyles = "p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out min-w-[300px]";
    
    const typeStyles = {
        success: "bg-green-100 border-l-4 border-green-500 text-green-700",
        error: "bg-red-100 border-l-4 border-red-500 text-red-700",
        warning: "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700"
    };

    const icons = {
        success: (
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        warning: (
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        )
    };

    return (
        <div className={`${baseStyles} ${typeStyles[type]}` }>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {icons[type]}
                    <p className="font-medium">{message}</p>
                </div>
                <button 
                    onClick={onClose}
                    className="ml-4 text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

// Create a notification manager
const useNotification = () => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (type, message) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, message }]);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const showSuccess = (message) => addNotification('success', message);
    const showError = (message) => addNotification('error', message);
    const showWarning = (message) => addNotification('warning', message);

    return {
        notifications,
        removeNotification,
        showSuccess,
        showError,
        showWarning
    };
};

export { useNotification, NotificationContainer };