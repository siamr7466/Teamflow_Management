import React from 'react';
import { CloseIcon } from './Icons';

interface ImageViewerProps {
    imageUrl: string;
    onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition"
                aria-label="Close image view"
            >
                <CloseIcon className="w-6 h-6" />
            </button>
            <img
                src={imageUrl}
                alt="Full screen view"
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking the image
            />
        </div>
    );
};

export default ImageViewer;

// Add this to your tailwind.config if you were using a file, or just know it's being used.
// For this setup, it will be injected by the runtime.
const animationStyles = `
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = animationStyles;
document.head.appendChild(styleSheet);
