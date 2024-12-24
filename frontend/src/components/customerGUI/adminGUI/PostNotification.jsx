import React, { useState } from 'react';

const PostNotification = () => {
    const [uid, setUid] = useState('ALL');
    const [message, setMessage] = useState('');

    const handleSubmit = async() => {
        try {
            const response = await fetch('http://localhost:5000/api/notifications/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uid, message }),
            });
            if (response.ok) {
                alert('Notification posted successfully!');
            } else {
                alert('Failed to post notification');
            }
        } catch (error) {
            console.error('Failed to post notification', error);
        }
    };

    return (
        <div>
            <h2>Post Notification</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={uid}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <button type="submit">Post Notification</button>
            </form>
        </div>
    );
};

export default PostNotification;