import React, { useState, useRef, useEffect } from 'react';
import { Message, User } from '../types';
import { SendIcon, PaperclipIcon } from './Icons';

interface MessagesProps {
    messages: Message[];
    users: User[];
    currentUser: User;
    onSendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
    onImageView: (url: string) => void;
}

const TypingIndicator = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
)

const Messages: React.FC<MessagesProps> = ({ messages, users, currentUser, onSendMessage, onImageView }) => {
    const [newMessage, setNewMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        onSendMessage({
            userId: currentUser.id,
            text: newMessage,
            file: null,
        });
        setNewMessage('');
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const isImage = file.type.startsWith('image/');
            const reader = new FileReader();
            reader.onload = (e) => {
                onSendMessage({
                    userId: currentUser.id,
                    text: '',
                    file: {
                        name: file.name,
                        type: isImage ? 'image' : 'file',
                        url: e.target?.result as string,
                    },
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const getUser = (userId: string) => users.find(u => u.id === userId);

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Team Chat</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-6">
                {messages.map(msg => {
                    const user = getUser(msg.userId);
                    const isCurrentUser = msg.userId === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex items-start gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                           {!isCurrentUser && user && <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />}
                            <div className={`max-w-md p-3 rounded-xl ${isCurrentUser ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                {!isCurrentUser && <p className="font-bold text-sm mb-1">{user?.name || 'Unknown User'}</p>}
                                {msg.isTyping && <TypingIndicator />}
                                {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
                                {msg.file && (
                                    <div className="mt-2">
                                        {msg.file.type === 'image' ? (
                                            <img 
                                                src={msg.file.url} 
                                                alt={msg.file.name} 
                                                className="max-w-xs rounded-lg cursor-pointer transition-transform hover:scale-105"
                                                onClick={() => onImageView(msg.file.url)}
                                            />
                                        ) : (
                                            <a href={msg.file.url} download={msg.file.name} className="flex items-center gap-2 p-2 bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">
                                                <PaperclipIcon className="w-5 h-5" />
                                                <span className="text-sm font-medium">{msg.file.name}</span>
                                            </a>
                                        )}
                                    </div>
                                )}
                                <p className={`text-xs mt-2 opacity-70 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                            </div>
                            {isCurrentUser && user && <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                        <PaperclipIcon className="w-6 h-6" />
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message... or mention @AI for help!"
                        className="flex-1 bg-transparent focus:outline-none px-2 text-gray-800 dark:text-gray-200"
                    />
                    <button onClick={handleSendMessage} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                        <SendIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Messages;