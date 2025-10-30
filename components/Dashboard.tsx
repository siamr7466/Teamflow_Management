
import React, { useState } from 'react';
import { Task, User, Role, TaskStatus } from '../types';
import TaskBoard from './TaskBoard';
import NewTaskModal from './NewTaskModal';
import { PlusIcon } from './Icons';

interface DashboardProps {
    tasks: Task[];
    users: User[];
    currentUser: User;
    onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
    onAddTask: (task: Omit<Task, 'id'>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, users, currentUser, onUpdateTaskStatus, onAddTask }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const assignedTasks = currentUser.role === Role.ADMIN 
        ? tasks 
        : tasks.filter(task => task.assigneeId === currentUser.id);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Task Dashboard</h2>
                {currentUser.role === Role.ADMIN && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105"
                    >
                        <PlusIcon className="w-5 h-5" />
                        New Task
                    </button>
                )}
            </div>

            <TaskBoard 
                tasks={assignedTasks} 
                users={users}
                currentUser={currentUser}
                onUpdateTaskStatus={onUpdateTaskStatus}
            />

            {isModalOpen && (
                <NewTaskModal
                    onClose={() => setIsModalOpen(false)}
                    onAddTask={onAddTask}
                    users={users.filter(u => u.role === Role.MEMBER)}
                />
            )}
        </div>
    );
};

export default Dashboard;
