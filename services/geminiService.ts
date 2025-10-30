import { GoogleGenAI } from "@google/genai";
import { Task, User, Role } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const generateContentWithGuard = async (prompt: string): Promise<string> => {
    if (!API_KEY) {
        return "AI functionality is disabled because the API key is not configured.";
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate content from AI.");
    }
};

const formatTaskDataForPrompt = (tasks: Task[], users: User[]): string => {
    let taskDetails = 'Current project status:\n';
    const members = users.filter(u => u.role === Role.MEMBER);

    members.forEach(member => {
        const memberTasks = tasks.filter(t => t.assigneeId === member.id);
        if (memberTasks.length > 0) {
            taskDetails += `\nTeam Member: ${member.name}\n`;
            memberTasks.forEach(task => {
                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';
                taskDetails += `- Task: "${task.title}", Status: ${task.status}, Due: ${new Date(task.dueDate).toLocaleDateString()}${isOverdue ? ' (OVERDUE)' : ''}\n`;
            });
        }
    });
    return taskDetails;
};

export const getAIProgressReport = async (tasks: Task[], users: User[]): Promise<string> => {
    const taskData = formatTaskDataForPrompt(tasks, users);
    const prompt = `
        You are an executive business analyst AI. Your goal is to provide a sharp, actionable intelligence report based on the project data. Use Markdown for formatting. 
        Your report should be structured with the following sections:
        1.  **Overall Progress:** A brief, high-level overview of project velocity and completion rate.
        2.  **Key Wins:** Highlight recently completed tasks and praise high-performing team members.
        3.  **Potential Risks & Bottlenecks:** Identify any overdue tasks, or members with a heavy 'To Do' load.
        4.  **Strategic Recommendations:** Suggest actionable steps to mitigate risks and improve performance. Think about how to 'boost sales' or improve efficiency.

        Here is the data:
        ${taskData}
    `;
    return generateContentWithGuard(prompt);
};

export const getAIChatResponse = async (userMessage: string, tasks: Task[], users: User[]): Promise<string> => {
    const taskData = formatTaskDataForPrompt(tasks, users);
    const prompt = `
        You are a friendly and helpful AI team member integrated into a project management chat. Your name is 'AI Assistant'. 
        A user has mentioned you by typing '@AI'. Analyze their message in the context of the provided project data and provide a concise, helpful response.
        
        **Project Data:**
        ${taskData}

        **User Message:**
        "${userMessage}"

        Your response should be conversational and directly address the user's query. If they ask a general question, provide a general answer. If they ask about the project, use the data to inform your response.
    `;
    return generateContentWithGuard(prompt);
};

export const getAIAlerts = async (tasks: Task[], users: User[]): Promise<string> => {
    const taskData = formatTaskDataForPrompt(tasks, users);
    const prompt = `
        You are a proactive AI project monitor. Analyze the provided task data and generate 2-3 brief, insightful alerts or suggestions for the project manager. 
        Format each alert as a single, actionable sentence. Prefix each with "Insight:" or "Alert:".
        
        Example:
        - Alert: Charlie has 3 high-priority tasks due this week. Suggest checking in on their workload.
        - Insight: The design phase is ahead of schedule. This could be an opportunity to start user testing earlier.

        Here is the data:
        ${taskData}
    `;
    return generateContentWithGuard(prompt);
};