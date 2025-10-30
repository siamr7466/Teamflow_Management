import React, { useState, useEffect, useRef } from 'react';
import { Task, User, Message } from '../types';
import { getAIAlerts, getAIChatResponse } from '../services/geminiService';
import { BotIcon, SendIcon, SparklesIcon } from './Icons';

interface AIAssistantProps {
    tasks: Task[];
    users: User[];
    currentUser: User;
}

const TypingIndicator = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
)

const AIAssistant: React.FC<AIAssistantProps> = ({ tasks, users, currentUser }) => {
    const [conversation, setConversation] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [conversation]);

    useEffect(() => {
        const fetchInitialAlerts = async () => {
            setIsLoading(true);
            try {
                const alerts = await getAIAlerts(tasks, users);
                const welcomeMessage: Message = {
                    id: 'ai-welcome',
                    userId: 'ai',
                    text: `Hello ${currentUser.name}! I'm your AI assistant. I can help with project analysis, suggestions, and more. Here's what I'm seeing right now:\n\n${alerts}`,
                    timestamp: new Date().toISOString(),
                    file: null
                };
                setConversation([welcomeMessage]);
            } catch (error) {
                console.error("Failed to fetch AI alerts:", error);
                 const errorMessage: Message = {
                    id: 'ai-welcome-error',
                    userId: 'ai',
                    text: `Hello ${currentUser.name}! I'm having trouble analyzing the project data at the moment, but I'm still here to help with any questions you have.`,
                    timestamp: new Date().toISOString(),
                    file: null
                };
                setConversation([errorMessage]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialAlerts();
    }, [tasks, users, currentUser]);

    const handleSendMessage = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            userId: currentUser.id,
            text: input,
            timestamp: new Date().toISOString(),
            file: null
        };

        setConversation(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await getAIChatResponse(input, tasks, users);
            const aiMessage: Message = {
                id: `ai-${Date.now()}`,
                userId: 'ai',
                text: aiResponseText,
                timestamp: new Date().toISOString(),
                file: null
            };
            setConversation(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: `ai-err-${Date.now()}`,
                userId: 'ai',
                text: "I seem to be having some trouble connecting. Please try again in a moment.",
                timestamp: new Date().toISOString(),
                file: null
            };
            setConversation(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const getUser = (userId: string) => users.find(u => u.id === userId) || currentUser;


    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <SparklesIcon className="w-6 h-6 text-indigo-500" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI Assistant</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-6">
                 {conversation.map(msg => {
                    const user = getUser(msg.userId);
                    const isCurrentUser = msg.userId === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex items-start gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                           {!isCurrentUser && user && <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />}
                            <div className={`max-w-xl p-3 rounded-xl ${isCurrentUser ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                <p className={`text-xs mt-2 opacity-70 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                            </div>
                            {isCurrentUser && user && <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />}
                        </div>
                    );
                })}
                {isLoading && (
                     <div className="flex items-start gap-3 justify-start">
                        <img src={users.find(u => u.id === 'ai')?.avatar} alt="AI" className="w-10 h-10 rounded-full" />
                         <div className="max-w-md p-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none">
                            <TypingIndicator />
                         </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
             <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask your AI assistant anything..."
                        className="flex-1 bg-transparent focus:outline-none px-2 text-gray-800 dark:text-gray-200"
                        disabled={isLoading}
                    />
                    <button onClick={handleSendMessage} disabled={isLoading} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition">
                        <SendIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;