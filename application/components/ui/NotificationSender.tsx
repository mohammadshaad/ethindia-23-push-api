// @ts-nocheck
import React, { useState } from 'react';

const NotificationSender = ({ onNotificationSent }) => {
    const [notificationBody, setNotificationBody] = useState('');

    const handleInputChange = (e) => {
        setNotificationBody(e.target.value);
    };

    const handleSendNotification = async () => {
        try {
            // Assuming userAlice.channel.send is an asynchronous function
            const sendNotifRes = await /.channel.send(["*"], {
                notification: { title: "test", body: notificationBody },
            });

            // Call the parent component callback to notify that a notification is sent
            onNotificationSent(sendNotifRes);

            // Clear the input after sending the notification
            setNotificationBody('');
        } catch (error) {
            // Handle errors here
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <label className="mb-2" htmlFor="notificationBody">
                Notification Body:
            </label>
            <textarea
                id="notificationBody"
                value={notificationBody}
                onChange={handleInputChange}
                className="border p-2 mb-4"
            />

            <button
                onClick={handleSendNotification}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
            >
                Send Notification
            </button>
        </div>
    );
};

export default NotificationSender;
