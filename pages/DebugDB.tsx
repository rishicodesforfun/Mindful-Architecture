import React, { useEffect, useState } from 'react';
import { dbService, STORES } from '../src/services/db';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { userStateToProgress, progressToUserState } from '../src/services/progressService';

const DebugPage: React.FC = () => {
    const navigate = useNavigate();
    const { session } = useAuth();
    const { user, setName } = useUser();
    const [users, setUsers] = useState<any[]>([]);
    const [progressRecords, setProgressRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const db = await dbService.getDB();

            const usersData = await db.getAll(STORES.USERS);
            setUsers(usersData);

            const progressData = await db.getAll(STORES.PROGRESS);
            setProgressRecords(progressData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const restoreProgress = async (progressToRestore: any) => {
        if (!confirm(`Are you sure you want to overwrite your current progress with data for "${progressToRestore.name}" (Day ${progressToRestore.currentDay})?`)) {
            return;
        }

        try {
            // 1. Update DB with this data keyed to the CURRENT session ID
            if (session?.userId) {
                const db = await dbService.getDB();

                // Construct the new record using current user ID but old data
                const newUserProgress = {
                    ...progressToRestore,
                    userKey: session.userId, // KEY: Re-bind to current ID
                    lastUpdated: new Date().toISOString()
                };

                await db.put(STORES.PROGRESS, newUserProgress);

                // 2. Force reload page to pick it up
                window.location.reload();
            } else {
                alert("You must be logged in to restore.");
            }
        } catch (e) {
            alert("Failed to restore: " + e);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'monospace' }}>
            <h1>🛠️ Debug Dashboard</h1>
            <button onClick={() => navigate('/')} style={{ marginBottom: '1rem' }}>← Back to App</button>
            <button onClick={loadData} style={{ marginLeft: '1rem', marginBottom: '1rem' }}>Refresh Data</button>

            <div style={{ background: '#f5f5f5', padding: '1rem', marginBottom: '2rem', borderRadius: '8px' }}>
                <h3>Current Session Status</h3>
                <p><strong>Session User ID:</strong> {session?.userId || 'Not Logged In'}</p>
                <p><strong>Current App State Name:</strong> {user.name}</p>
                <p><strong>Current App State Day:</strong> {user.currentDay}</p>
            </div>

            {/* NEW: Progress Repair Tool */}
            <div style={{ background: '#e3f2fd', padding: '1rem', marginBottom: '2rem', borderRadius: '8px', border: '1px solid #90caf9' }}>
                <h3>🩺 Progress Diagnosis</h3>
                <p>
                    <strong>Sessions Completed:</strong> {user.sessionCompletions.length} <br />
                    <strong>Current Day (State):</strong> {user.currentDay} <br />
                    <strong>Calculated Day (from History):</strong> {user.sessionCompletions.length + 1}
                </p>

                {user.sessionCompletions.length >= user.currentDay ? (
                    <div style={{ marginTop: '1rem' }}>
                        <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>⚠️ Discrepancy Detected!</p>
                        <p>It looks like your "Current Day" ({user.currentDay}) is behind your actual completed sessions ({user.sessionCompletions.length}). This can happen if the day didn't auto-advance.</p>
                        <button
                            onClick={async () => {
                                if (!session?.userId) return;
                                try {
                                    const db = await dbService.getDB();
                                    // 1. Get current stored progress
                                    const currentProgress = await db.get(STORES.PROGRESS, session.userId);
                                    if (currentProgress) {
                                        // 2. Patch it
                                        const fixedProgress = {
                                            ...currentProgress,
                                            currentDay: user.sessionCompletions.length + 1,
                                            streak: user.sessionCompletions.length, // Rough estimate
                                            lastUpdated: new Date().toISOString()
                                        };
                                        // 3. Save
                                        await db.put(STORES.PROGRESS, fixedProgress);
                                        // 4. Reload
                                        alert("Progress repaired! Reloading...");
                                        window.location.reload();
                                    }
                                } catch (e) {
                                    alert("Error fixing: " + e);
                                }
                            }}
                            style={{
                                background: '#d32f2f',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                marginTop: '0.5rem'
                            }}
                        >
                            🛠️ Fix My Progress (Set Day to {user.sessionCompletions.length + 1})
                        </button>
                    </div>
                ) : (
                    <p style={{ color: 'green' }}>✅ Your progress state looks consistent.</p>
                )}
            </div>

            <h2>📂 Stored Progress Records ({progressRecords.length})</h2>
            <p>These are all the progress snapshots found in your browser's database. If you see your lost progress here, click "Restore" to link it to your current account.</p>

            {progressRecords.length === 0 ? <p>No progress records found.</p> : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {progressRecords.map((rec) => (
                        <div key={rec.userKey} style={{
                            border: '1px solid #ccc',
                            padding: '1rem',
                            borderRadius: '8px',
                            background: rec.userKey === session?.userId ? '#e6fffa' : 'white'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>Name:</strong> {rec.name || 'Unnamed'} <br />
                                    <strong>Day:</strong> {rec.currentDay} <br />
                                    <strong>Last Updated:</strong> {new Date(rec.lastUpdated).toLocaleString()} <br />
                                    <small style={{ color: '#666' }}>ID: {rec.userKey}</small>
                                </div>
                                <div>
                                    {rec.userKey === session?.userId ? (
                                        <span style={{ color: 'green', fontWeight: 'bold' }}>✅ Current Active</span>
                                    ) : (
                                        <button
                                            onClick={() => restoreProgress(rec)}
                                            style={{
                                                background: '#2b6cb0',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Restore This
                                        </button>
                                    )}
                                </div>
                            </div>
                            <details style={{ marginTop: '0.5rem' }}>
                                <summary style={{ cursor: 'pointer', color: '#666' }}>View Raw Data</summary>
                                <pre style={{ fontSize: '10px', overflowX: 'auto' }}>
                                    {JSON.stringify(rec, null, 2)}
                                </pre>
                            </details>
                        </div>
                    ))}
                </div>
            )}

            <h2 style={{ marginTop: '2rem' }}>busts Stored Users (Auth) ({users.length})</h2>
            <ul style={{ maxHeight: '200px', overflowY: 'auto', background: '#eee', padding: '1rem' }}>
                {users.map(u => (
                    <li key={u.id}>
                        <strong>{u.username}</strong> (ID: {u.id})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DebugPage;
