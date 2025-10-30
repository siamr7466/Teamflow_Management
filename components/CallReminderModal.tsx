
import React, { useEffect, useRef } from 'react';
import { Task } from '../types';
import { PhoneIcon, CloseIcon } from './Icons';

interface CallReminderModalProps {
    task: Task;
    onClose: () => void;
}

const CallReminderModal: React.FC<CallReminderModalProps> = ({ task, onClose }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        // Simple ringing sound data URI
        const ringingSound = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
        const audio = new Audio(ringingSound);
        audio.loop = true;
        audioRef.current = audio;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Audio playback failed:", error);
            });
        }

        return () => {
            audio.pause();
        };
    }, []);

    const handleClose = () => {
        if(audioRef.current) {
            audioRef.current.pause();
        }
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 animate-pulse">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center transform scale-100">
                <div className="animate-bounce mb-4">
                    <PhoneIcon className="w-16 h-16 text-green-500 mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Task Reminder</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Incoming Call</p>
                <div className="my-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="font-semibold text-gray-800 dark:text-white">"{task.title}"</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">is due soon!</p>
                </div>
                <button
                    onClick={handleClose}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    <CloseIcon className="w-5 h-5" />
                    Dismiss
                </button>
            </div>
        </div>
    );
};

export default CallReminderModal;
