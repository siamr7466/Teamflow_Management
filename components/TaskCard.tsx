import React from 'react';
import { Task, User, TaskStatus, Role } from '../types';
import { CalendarIcon } from './Icons';

interface TaskCardProps {
    task: Task;
    assignee?: User;
    currentUser: User;
    onUpdateStatus: (taskId: string, status: TaskStatus) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, assignee, currentUser, onUpdateStatus }) => {
    const isMember = currentUser.role === Role.MEMBER;
    
    const statusOptions = isMember
        ? [task.status, TaskStatus.DONE]
        : Object.values(TaskStatus);

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onUpdateStatus(task.id, e.target.value as TaskStatus);
    };
    
    const dueDate = new Date(task.dueDate);
    const isOverdue = dueDate < new Date() && task.status !== TaskStatus.DONE;

    return (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md border-l-4 border-indigo-500 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-800 dark:text-white">{task.title}</h4>
                {assignee && (
                    <img src={assignee.avatar} alt={assignee.name} title={assignee.name} className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-900" />
                )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{task.description}</p>
            <div className="flex justify-between items-center mt-4">
                 <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                    <CalendarIcon className="w-4 h-4" />
                    <span>{dueDate.toLocaleDateString()}</span>
                </div>
                <select 
                    value={task.status} 
                    onChange={handleStatusChange}
                    className="text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {Array.from(new Set(statusOptions)).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default TaskCard;