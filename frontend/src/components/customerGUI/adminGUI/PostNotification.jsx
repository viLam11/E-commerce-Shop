import axios from 'axios';
import React, { useState } from 'react';
import Header from '../Header';
import Footer from '../../Footer';
const PostNotification = () => {
    const [uid, setUid] = useState('ALL');
    const [message, setMessage] = useState('');

    const handleSubmit = async() => {
        try {
            const response = await axios.post(`http://localhost:8000/api/notification/create?id=${uid}`, {
                content: message
            });
            if (response.data.status === 200) {
                alert('Notification posted successfully!');
            } else {
                alert('Failed to post notification');
            }
        } catch (error) {
            console.error('Failed to post notification', error);
        }
    };

    return (
        <>
        <Header />
        <style>
                {
                    `
                    /* PostNotification.css */

                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        margin: 0;
                        padding: 0;
                    }

                    h2 {
                        text-align: center;
                        color: #333;
                        margin-bottom: 20px;
                    }

                    .container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding-top: 100px;
                    }

                    form {
                        background: #fff;
                        padding: 20px 30px;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        max-width: 400px;
                        width: 100%;
                    }

                    label {
                        font-size: 16px;
                        font-weight: bold;
                        color: #555;
                        display: block;
                        margin-bottom: 8px;
                    }

                    textarea {
                        width: 100%;
                        height: 100px;
                        padding: 10px;
                        font-size: 14px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        resize: none;
                        margin-bottom: 20px;
                        outline: none;
                        transition: border-color 0.3s;
                    }

                    textarea:focus {
                        border-color: #007bff;
                    }

                    button {
                        background-color: #007bff;
                        color: white;
                        font-size: 16px;
                        font-weight: bold;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                        width: 100%;
                    }

                    button:hover {
                        background-color: #0056b3;
                    }

                    button:active {
                        background-color: #004494;
                    }
                    `
                }
            </style>
            <div className="container">
            <form onSubmit={handleSubmit}>
                <h2>Post Notification</h2>
                <div>
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="user">Gửi đến người dùng:</label>
                    <textarea
                        id="user"
                        value={uid}
                        onChange={(e) => setUid(e.target.value)}
                    />
                </div>
                <button type="submit">Gửi thông báo</button>
            </form>
        </div>
        <Footer />
        </>
    );
};

export default PostNotification;