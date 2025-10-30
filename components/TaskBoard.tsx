
import React from 'react';
import { Task, User, TaskStatus, Role } from '../types';
import TaskCard from './TaskCard';

interface TaskBoardProps {
    tasks: Task[];
    users: User[];
    currentUser: User;
    onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, users, currentUser, onUpdateTaskStatus }) => {
    const columns = [
        { status: TaskStatus.TO_DO, title: 'To Do', color: 'bg-red-500' },
        { status: TaskStatus.IN_PROGRESS, title: 'In Progress', color: 'bg-yellow-500' },
        { status: TaskStatus.DONE, title: 'Done', color: 'bg-green-500' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(column => (
                <div key={column.status} className="bg-gray-200/50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`w-3 h-3 rounded-full ${column.color}`}></span>
                        <h3 className="font-bold text-lg text-gray-700 dark:text-gray-200">{column.title}</h3>
                        <span className="text-sm font-semibold bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-0.5">
                            {tasks.filter(t => t.status === column.status).length}
                        </span>
                    </div>
                    <div className="space-y-4 h-[calc(100vh-20rem)] overflow-y-auto pr-2">
                        {tasks
                            .filter(t => t.status === column.status)
                            .map(task => (
                                <TaskCard 
                                    key={task.id} 
                                    task={task} 
                                    assignee={users.find(u => u.id === task.assigneeId)} 
                                    currentUser={currentUser}
                                    onUpdateStatus={onUpdateTaskStatus} 
                                />
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskBoard;
