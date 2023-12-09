import React, { useState } from 'react';

const NotificationDisplay = ({ notification }) => {
    const [shownNotification, setShownNotification] = useState(notification);

    // useEffect to update shownNotification whenever a new notification is received
    useEffect(() => {
        setShownNotification(notification);
    }, [notification]);

    return (
        <div className="border p-4 mb-4">
            <h3 className="mb-2">Received Notification:</h3>
            <p>{shownNotification?.body || 'No notification received yet.'}</p>
        </div>
    );
};

export default NotificationDisplay;
