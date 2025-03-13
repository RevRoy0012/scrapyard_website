import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Global_progress_bar_component = () => {
    const [progress, setProgress] = useState(0);
    const [show, setShow] = useState(false);
    const location = useLocation();

    useEffect(() => {
        let timer;

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
            setTimeout(() => setShow(false), 300);
        };

        startProgress();

        return () => {
            clearInterval(timer);
            completeProgress();
        };
    }, [location]);

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