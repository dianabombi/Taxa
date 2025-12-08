'use client';

import { API_BASE_URL } from '@/lib/api';

export default function ApiTestPage() {
    const testConnection = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/docs`);
            alert(`API connection successful! Status: ${response.status}`);
        } catch (err) {
            alert(`API connection failed: ${err}`);
        }
    };

    return (
        <div className="min-h-screen bg-bg-main p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">API Connection Test</h1>
                
                <div className="bg-bg-card p-6 rounded-xl mb-6">
                    <h2 className="text-xl font-semibold mb-4">Current Configuration:</h2>
                    <p className="mb-2"><strong>API Base URL:</strong></p>
                    <code className="bg-gray-800 text-green-400 px-4 py-2 rounded block">
                        {API_BASE_URL}
                    </code>
                </div>

                <button 
                    onClick={testConnection}
                    className="bg-accent text-white px-6 py-3 rounded-xl hover:opacity-80"
                >
                    Test Connection
                </button>

                <div className="mt-8 bg-yellow-100 border-l-4 border-yellow-500 p-4">
                    <p className="font-semibold">Expected Values:</p>
                    <ul className="mt-2 space-y-1">
                        <li>✅ Production: https://your-railway-url.railway.app</li>
                        <li>❌ Wrong: http://localhost:8001</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
