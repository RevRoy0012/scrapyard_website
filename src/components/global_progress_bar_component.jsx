import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Global_progress_bar_component = () => {
    const [progress, setProgress] = useState(0);
    const [show, setShow] = useState(false);
    const location = useLocation();

    useEffect(() => {
        let timer;
        let completionTimer;

        const startProgress = () => {
            setShow(true);
            setProgress(0);
            timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 95) {
                        clearInterval(timer);
                        return 95;
                    }
                    return prev + 5;
                });
            }, 50);
        };

        const completeProgress = () => {
            clearInterval(timer);
            setProgress(100);
            completionTimer = setTimeout(() => setShow(false), 300);
        };

        // Start progress on location change
        startProgress();

        // Complete progress when page finishes loading
        window.addEventListener('load', completeProgress);

        // Fallback completion in case load event doesn't fire
        const safetyTimer = setTimeout(completeProgress, 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(completionTimer);
            clearTimeout(safetyTimer);
            window.removeEventListener('load', completeProgress);
        };
    }, [location]);

    // Auto-complete if we reach 95% without navigation
    useEffect(() => {
        if (progress >= 95) {
            const timeout = setTimeout(() => {
                setProgress(100);
                setTimeout(() => setShow(false), 300);
            }, 500);

            return () => clearTimeout(timeout);
        }
    }, [progress]);

    if (!show) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[1000]">
            <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-200 ease-linear"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default Global_progress_bar_component;