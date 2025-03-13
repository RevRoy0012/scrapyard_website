import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Global_notification_component from '../components/Global_notification_component.jsx';
import Global_throbber_component from '../components/Global_throbber_component.jsx';

const Bug_report_page = () => {
    const navigate = useNavigate();
    const [briefDescription, setBriefDescription] = useState('');
    const [stepsToReproduce, setStepsToReproduce] = useState('');
    const [expectedBehavior, setExpectedBehavior] = useState('');
    const [actualBehavior, setActualBehavior] = useState('');
    const [deviceInfo, setDeviceInfo] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!briefDescription || !stepsToReproduce || !expectedBehavior || !actualBehavior || !deviceInfo) {
            setNotification({ message: 'Please fill out all required fields.', type: 'error' });
            return;
        }

        setIsLoading(true);
        setNotification({ message: 'Submitting bug report...', type: 'info' });

        const ticketText = `
${briefDescription.trim()}

Steps to Reproduce:
${stepsToReproduce.trim()}

Expected Behavior:
${expectedBehavior.trim()}

Actual Behavior:
${actualBehavior.trim()}

Device:
${deviceInfo.trim()}

Additional Notes:
${additionalNotes.trim()}
    `.trim();

        try {
            const response = await fetch('https://2ta5nfjxzb.execute-api.us-east-2.amazonaws.com/prod/web/auth/creat-bug-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketText }),
            });
            const result = await response.json();
            if (response.ok) {
                setNotification({ message: 'Bug report submitted successfully!', type: 'success' });
                setBriefDescription('');
                setStepsToReproduce('');
                setExpectedBehavior('');
                setActualBehavior('');
                setDeviceInfo('');
                setAdditionalNotes('');
                setTimeout(() => {
                    navigate('/profile');
                }, 1500);
            } else {
                setNotification({ message: result.message || 'Failed to submit bug report.', type: 'error' });
            }
        } catch (error) {
            console.error('Error submitting bug report:', error);
            setNotification({ message: 'An error occurred while submitting your bug report.', type: 'error' });
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
            {isLoading && <Global_throbber_component />}
            <div className="w-full max-w-2xl bg-gray-800 p-8 rounded shadow">
                <h2 className="text-3xl font-bold mb-6 text-center">Submit a Bug Report</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-1">Brief Description *</label>
                        <input
                            type="text"
                            value={briefDescription}
                            onChange={(e) => setBriefDescription(e.target.value)}
                            placeholder="A short description of the bug"
                            className="w-full p-3 rounded bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Steps to Reproduce *</label>
                        <textarea
                            value={stepsToReproduce}
                            onChange={(e) => setStepsToReproduce(e.target.value)}
                            placeholder="e.g., Go to the login page, click on 'Sign In', observe the bug"
                            className="w-full p-3 rounded bg-gray-700 text-white h-24"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Expected Behavior *</label>
                        <textarea
                            value={expectedBehavior}
                            onChange={(e) => setExpectedBehavior(e.target.value)}
                            placeholder="Describe what should happen"
                            className="w-full p-3 rounded bg-gray-700 text-white h-20"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Actual Behavior *</label>
                        <textarea
                            value={actualBehavior}
                            onChange={(e) => setActualBehavior(e.target.value)}
                            placeholder="Describe what actually happens"
                            className="w-full p-3 rounded bg-gray-700 text-white h-20"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Device / OS *</label>
                        <input
                            type="text"
                            value={deviceInfo}
                            onChange={(e) => setDeviceInfo(e.target.value)}
                            placeholder="e.g., Windows 10 / Chrome 95"
                            className="w-full p-3 rounded bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Additional Notes</label>
                        <textarea
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                            placeholder="Any other details..."
                            className="w-full p-3 rounded bg-gray-700 text-white h-16"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-500 hover:bg-red-600 p-3 rounded font-bold"
                    >
                        Submit Bug Report
                    </button>
                </form>
            </div>
            <Global_notification_component message={notification.message} type={notification.type} />
        </div>
    );
};

export default Bug_report_page;