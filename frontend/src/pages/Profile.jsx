import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, logout } = useAuth();
  const key = `lwt_results_${user?.id || 'guest'}`;
  const results = JSON.parse(localStorage.getItem(key) || '[]');
  const chartData = results.map((r, i) => ({ name: `#${i + 1}`, score: r.score }));

  const avgScore = results.length
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0;
  const passedCount = results.filter((r) => r.status === 'Passed').length;

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }} className="min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto pb-12">

        {/* Cover banner */}
        <div className="h-40 rounded-b-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 relative">
          <div className="absolute -bottom-10 left-8 w-24 h-24 rounded-full bg-white p-1 shadow-lg">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.[0]?.toUpperCase() || 'G'}
            </div>
          </div>
        </div>

        {/* Name + logout */}
        <div className="flex items-center justify-between px-8 pt-14">
          <div>
            <h2 className="text-2xl font-bold">{user?.name || 'Guest'}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{user?.email || 'Not logged in'}</p>
          </div>
          {user && (
            <button
              onClick={logout}
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              className="px-4 py-2 rounded-full border text-sm font-medium hover:opacity-80"
            >
              Log Out
            </button>
          )}
        </div>

        {/* Stat counters */}
        <div className="grid grid-cols-3 gap-4 px-8 mt-6">
          <div style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }} className="rounded-2xl border p-4 text-center shadow-sm">
            <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{results.length}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Quizzes Taken</p>
          </div>
          <div style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }} className="rounded-2xl border p-4 text-center shadow-sm">
            <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{passedCount}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Passed</p>
          </div>
          <div style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }} className="rounded-2xl border p-4 text-center shadow-sm">
            <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{avgScore}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Avg Score</p>
          </div>
        </div>

        {/* Score chart */}
        <div className="px-8 mt-10">
          <h3 className="font-bold mb-3">Score History</h3>
          {chartData.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No quiz attempts yet — take a quiz to see your progress here.</p>
          ) : (
            <div style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }} className="border rounded-2xl p-5 shadow-sm">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent results */}
        <div className="px-8 mt-10">
          <h3 className="font-bold mb-3">Recent Results</h3>
          <div style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }} className="border rounded-2xl shadow-sm overflow-hidden">
            {results.length === 0 && (
              <p className="p-5" style={{ color: 'var(--text-muted)' }}>Nothing here yet.</p>
            )}
            {results.slice().reverse().map((r, i) => (
              <div
                key={i}
                style={{ borderColor: 'var(--border)' }}
                className="flex justify-between items-center px-5 py-4 border-b last:border-b-0"
              >
                <div>
                  <p className="font-semibold">{r.quiz_name}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{r.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{r.score}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      r.status === 'Passed' ? 'bg-green-500/15 text-green-500' : 'bg-orange-500/15 text-orange-500'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
}