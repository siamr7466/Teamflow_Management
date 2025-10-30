import React, { useState, useMemo } from 'react';
import { Task, User, Role, TaskStatus } from '../types';
import { getAIProgressReport } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SparklesIcon } from './Icons';

interface StatsProps {
    tasks: Task[];
    users: User[];
    currentUser: User;
}

const SimpleMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const htmlContent = useMemo(() => {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^- (.*$)/g, '<li class="ml-4 list-disc">$1</li>')
            .replace(/(?:\r\n|\r|\n){2,}/g, '<br/><br/>'); // Preserve paragraphs
    }, [content]);

    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="prose prose-sm dark:prose-invert max-w-none"/>;
};


const Stats: React.FC<StatsProps> = ({ tasks, users, currentUser }) => {
    const [aiReport, setAIReport] = useState<string>('');
    const [isLoadingReport, setIsLoadingReport] = useState(false);

    const userTasks = useMemo(() => {
        if (currentUser.role === Role.ADMIN) return tasks;
        return tasks.filter(task => task.assigneeId === currentUser.id);
    }, [tasks, currentUser]);

    const members = users.filter(u => u.role === Role.MEMBER);

    const tasksByStatus = useMemo(() => {
        const counts = { [TaskStatus.TO_DO]: 0, [TaskStatus.IN_PROGRESS]: 0, [TaskStatus.DONE]: 0 };
        userTasks.forEach(task => {
            counts[task.status]++;
        });
        return [
            { name: 'To Do', value: counts[TaskStatus.TO_DO] },
            { name: 'In Progress', value: counts[TaskStatus.IN_PROGRESS] },
            { name: 'Done', value: counts[TaskStatus.DONE] },
        ];
    }, [userTasks]);

    const tasksByMember = useMemo(() => {
        return members.map(member => {
            const memberTasks = tasks.filter(t => t.assigneeId === member.id);
            return {
                name: member.name,
                'To Do': memberTasks.filter(t => t.status === TaskStatus.TO_DO).length,
                'In Progress': memberTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
                'Done': memberTasks.filter(t => t.status === TaskStatus.DONE).length,
            };
        });
    }, [tasks, members]);
    
    const totalTasks = userTasks.length;
    const completedTasks = userTasks.filter(t => t.status === TaskStatus.DONE).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const COLORS = ['#EF4444', '#F59E0B', '#10B981'];

    const handleGetReport = async () => {
        setIsLoadingReport(true);
        setAIReport('');
        try {
            const report = await getAIProgressReport(tasks, users);
            setAIReport(report);
        } catch (error) {
            console.error("Error fetching AI report:", error);
            setAIReport("Sorry, I couldn't generate a report at this time.");
        } finally {
            setIsLoadingReport(false);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Work Progress Stats</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
                    <p className="text-lg text-gray-500 dark:text-gray-400">Total Tasks</p>
                    <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">{totalTasks}</p>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
                    <p className="text-lg text-gray-500 dark:text-gray-400">Completed</p>
                    <p className="text-5xl font-bold text-green-500">{completedTasks}</p>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
                    <p className="text-lg text-gray-500 dark:text-gray-400">Completion Rate</p>
                    <p className="text-5xl font-bold text-yellow-500">{completionRate}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="font-bold text-xl mb-4 text-gray-700 dark:text-gray-200">Tasks by Member</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={tasksByMember}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)"/>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem' }} />
                            <Legend />
                            <Bar dataKey="To Do" stackId="a" fill="#EF4444" />
                            <Bar dataKey="In Progress" stackId="a" fill="#F59E0B" />
                            <Bar dataKey="Done" stackId="a" fill="#10B981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                     <h3 className="font-bold text-xl mb-4 text-gray-700 dark:text-gray-200">Tasks by Status</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={tasksByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {tasksByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem' }}/>
                             <Legend />
                        </PieChart>
                     </ResponsiveContainer>
                </div>
            </div>
             {currentUser.role === Role.ADMIN && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-xl text-gray-700 dark:text-gray-200">AI-Powered Progress Report</h3>
                        <button onClick={handleGetReport} disabled={isLoadingReport} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-transform transform hover:scale-105">
                            <SparklesIcon className="w-5 h-5"/>
                            {isLoadingReport ? 'Generating...' : 'Generate Report'}
                        </button>
                    </div>
                    {isLoadingReport && <p className="text-center text-gray-500 dark:text-gray-400">Generating your project report...</p>}
                    {aiReport && <div className="p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg whitespace-pre-wrap"><SimpleMarkdownRenderer content={aiReport} /></div>}
                </div>
            )}
        </div>
    );
};

export default Stats;