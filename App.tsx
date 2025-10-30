import React, { useState, useEffect, useCallback } from 'react';
import { User, Task, Message, Role, TaskStatus, View } from './types';
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Messages from './components/Messages';
import Stats from './components/Stats';
import CallReminderModal from './components/CallReminderModal';
import ImageViewer from './components/ImageViewer';
import AIAssistant from './components/AIAssistant';
import { getAIChatResponse } from './services/geminiService';

// Mock Data
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', role: Role.ADMIN, avatar: 'https://i.pravatar.cc/150?u=u1' },
  { id: 'u2', name: 'Alice', role: Role.MEMBER, avatar: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u3', name: 'Bob', role: Role.MEMBER, avatar: 'https://i.pravatar.cc/150?u=u3' },
  { id: 'u4', name: 'Charlie', role: Role.MEMBER, avatar: 'https://i.pravatar.cc/150?u=u4' },
  { id: 'ai', name: 'AI Assistant', role: Role.MEMBER, avatar: 'https://robohash.org/ai-assistant.png?bgset=bg2' },
];

const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Design new landing page', description: 'Create a modern design for the new landing page.', assigneeId: 'u2', status: TaskStatus.IN_PROGRESS, dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 't2', title: 'Develop user authentication', description: 'Implement JWT-based authentication.', assigneeId: 'u3', status: TaskStatus.TO_DO, dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 't3', title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for automated deployment.', assigneeId: 'u3', status: TaskStatus.TO_DO, dueDate: new Date(Date.now() + 80000).toISOString() },
  { id: 't4', title: 'Write API documentation', description: 'Use Swagger to document all endpoints.', assigneeId: 'u4', status: TaskStatus.DONE, dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 't5', title: 'Test payment gateway integration', description: 'Perform end-to-end testing for Stripe.', assigneeId: 'u2', status: TaskStatus.IN_PROGRESS, dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 't6', title: 'Refactor old codebase', description: 'Improve performance and readability of legacy code.', assigneeId: 'u4', status: TaskStatus.TO_DO, dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
];

const MOCK_MESSAGES: Message[] = [
    { id: 'm1', userId: 'u2', text: 'Hey team, I\'ve started on the landing page design. I\'ll share mockups by EOD.', timestamp: new Date(Date.now() - 3600000).toISOString(), file: null },
    { id: 'm2', userId: 'u1', text: 'Great, Alice! Looking forward to it.', timestamp: new Date(Date.now() - 3500000).toISOString(), file: null },
    { id: 'm3', userId: 'u3', text: 'I have a question about the auth flow, I\'ll post it in the relevant task.', timestamp: new Date(Date.now() - 3400000).toISOString(), file: null },
];


const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
    
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);

    const [taskForReminder, setTaskForReminder] = useState<Task | null>(null);
    const [viewingImageUrl, setViewingImageUrl] = useState<string | null>(null);

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedTheme = window.localStorage.getItem('theme');
            if (storedTheme) return storedTheme;
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setActiveView(View.DASHBOARD);
    };
    
    const handleAddTask = (task: Omit<Task, 'id'>) => {
        const newTask: Task = {
            ...task,
            id: `t${Date.now()}`
        };
        setTasks(prevTasks => [newTask, ...prevTasks]);
        console.log(`Email alert: New task "${task.title}" assigned to user ID ${task.assigneeId}`);
        alert(`Mock Notification: Email sent to the assignee for the new task "${task.title}".`);
    };

    const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
        setTasks(prevTasks => prevTasks.map(task => 
            task.id === taskId ? { ...task, status } : task
        ));
    };

    const handleSendMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
        const newMessage: Message = {
            ...message,
            id: `m${Date.now()}`,
            timestamp: new Date().toISOString()
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);

        if (message.text && message.text.toLowerCase().includes('@ai')) {
            const aiTypingId = `m${Date.now()}-typing`;
            const aiTypingMessage: Message = {
                id: aiTypingId,
                userId: 'ai',
                text: '',
                isTyping: true,
                timestamp: new Date().toISOString(),
                file: null
            };
            setMessages(prev => [...prev, aiTypingMessage]);

            try {
                const aiResponseText = await getAIChatResponse(message.text, tasks, users);
                const aiResponseMessage: Message = {
                    id: `m${Date.now()}-ai`,
                    userId: 'ai',
                    text: aiResponseText,
                    timestamp: new Date().toISOString(),
                    file: null
                };
                 setMessages(prev => [...prev.filter(m => m.id !== aiTypingId), aiResponseMessage]);
            } catch(error) {
                console.error("AI chat response error:", error);
                 const aiErrorMessage: Message = {
                    id: `m${Date.now()}-ai-error`,
                    userId: 'ai',
                    text: "Sorry, I'm having trouble connecting right now.",
                    timestamp: new Date().toISOString(),
                    file: null
                };
                setMessages(prev => [...prev.filter(m => m.id !== aiTypingId), aiErrorMessage]);
            }
        }
    };

    const checkReminders = useCallback(() => {
        if (!currentUser || currentUser.role === Role.ADMIN) return;
        const now = new Date();
        const reminderWindow = 2 * 60 * 1000; // 2 minutes
        
        const upcomingTask = tasks.find(task => {
            const dueDate = new Date(task.dueDate);
            const diff = dueDate.getTime() - now.getTime();
            return task.assigneeId === currentUser.id && task.status !== TaskStatus.DONE && diff > 0 && diff < reminderWindow;
        });

        if (upcomingTask && !taskForReminder) {
            setTaskForReminder(upcomingTask);
        }
    }, [tasks, currentUser, taskForReminder]);


    useEffect(() => {
        const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, [checkReminders]);


    if (!currentUser) {
        return <Login users={users.filter(u => u.id !== 'ai')} onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    currentUser={currentUser} 
                    onLogout={handleLogout}
                    theme={theme}
                    setTheme={setTheme}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-800/50 p-4 md:p-8">
                    {activeView === View.DASHBOARD && <Dashboard tasks={tasks} users={users} currentUser={currentUser} onUpdateTaskStatus={handleUpdateTaskStatus} onAddTask={handleAddTask} />}
                    {activeView === View.MESSAGES && <Messages messages={messages} users={users} currentUser={currentUser} onSendMessage={handleSendMessage} onImageView={setViewingImageUrl}/>}
                    {activeView === View.STATS && <Stats tasks={tasks} users={users} currentUser={currentUser} />}
                    {activeView === View.AI_ASSISTANT && <AIAssistant tasks={tasks} users={users} currentUser={currentUser} />}
                </main>
            </div>
            {taskForReminder && (
                <CallReminderModal task={taskForReminder} onClose={() => setTaskForReminder(null)} />
            )}
            {viewingImageUrl && (
                <ImageViewer imageUrl={viewingImageUrl} onClose={() => setViewingImageUrl(null)} />
            )}
        </div>
    );
};

export default App;