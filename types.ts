export enum Role {
    ADMIN = 'admin',
    MEMBER = 'member',
}

export enum TaskStatus {
    TO_DO = 'To Do',
    IN_PROGRESS = 'In Progress',
    DONE = 'Done',
}

export enum View {
    DASHBOARD = 'dashboard',
    MESSAGES = 'messages',
    STATS = 'stats',
    AI_ASSISTANT = 'ai_assistant',
}

export interface User {
    id: string;
    name: string;
    role: Role;
    avatar: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    assigneeId: string;
    status: TaskStatus;
    dueDate: string;
}

export interface Message {
    id: string;
    userId: string;
    text: string;
    timestamp: string;
    file: {
        name: string;
        type: 'image' | 'file';
        url: string;
    } | null;
    isTyping?: boolean;
}