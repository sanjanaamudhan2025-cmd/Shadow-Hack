import { Link } from 'react-router-dom'

const courses = [
  { id: 'machine-learning', name: 'Machine Learning', chapters: '10 Chapters', gradient: 'from-indigo-500 to-purple-600', icon: '🤖' },
  { id: 'data-structures', name: 'Data Structures', chapters: '8 Chapters', gradient: 'from-orange-400 to-pink-500', icon: '📊' },
  { id: 'chemistry-basics', name: 'Chemistry Basics', chapters: '12 Chapters', gradient: 'from-teal-400 to-blue-500', icon: '⚗️' },
  { id: 'world-history', name: 'World History', chapters: '6 Chapters', gradient: 'from-pink-500 to-rose-500', icon: '🌍' },
]

const progressTags = ['65%', '80%', '45%', '90%']

const activity = [
  { name: 'Priya', time: '12:35', msg: 'Just finished the ML midterm!' },
  { name: 'Raj', time: '12:33', msg: 'Anyone free to study Chemistry tonight?' },
  { name: 'Amara', time: '11:21', msg: 'World History notes are up in the group.' },
]

function Dashboard() {
  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }} className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* LEFT PANEL */}
        <div className="lg:w-64 flex-shrink-0 flex flex-col gap-5">
          <div
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
            className="rounded-2xl p-5 border shadow-md"
          >
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Weekly Progress</p>
            <p className="text-3xl font-bold mt-1" style={{ color: 'var(--accent)' }}>72%</p>
            <div className="mt-4 h-16 flex items-end gap-1">
              {[40, 55, 35, 70, 60, 80, 72].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-indigo-500 to-purple-400" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {progressTags.map((tag, i) => (
              <div
                key={i}
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                className="rounded-xl border px-3 py-2 text-center text-sm font-semibold"
              >
                {tag}
              </div>
            ))}
          </div>

          <div
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
            className="rounded-2xl p-4 border shadow-md"
          >
            <p className="text-sm font-semibold">Last completed</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Data Structures — Module 3</p>
            <Link
              to="/course/data-structures"
              className="mt-3 inline-block text-sm font-medium px-4 py-2 rounded-full text-white bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              Continue
            </Link>
          </div>
        </div>

        {/* CENTER */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="rounded-3xl p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white flex items-center justify-between shadow-lg shadow-purple-500/20">
            <div>
              <p className="text-indigo-100">Good Morning!</p>
              <h1 className="text-3xl font-bold mt-1">Welcome back 👋</h1>
              <p className="text-indigo-100 mt-2">You've completed 3 courses this month. Keep going!</p>
            </div>
            <div className="text-6xl">🎓</div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Your Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {courses.map((course) => (
                <Link
                  to={`/course/${course.id}`}
                  key={course.id}
                  className={`rounded-2xl p-5 bg-gradient-to-br ${course.gradient} text-white shadow-lg hover:scale-[1.02] transition-transform block`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
                    {course.icon}
                  </div>
                  <h3 className="font-semibold mt-4">{course.name}</h3>
                  <p className="text-sm mt-1 text-white/80">{course.chapters}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:w-72 flex-shrink-0 flex flex-col gap-4">
          <div
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
            className="rounded-2xl p-4 border shadow-md"
          >
            <p className="font-semibold mb-3">Study Group Activity</p>
            <div className="flex flex-col gap-4">
              {activity.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {a.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {a.name} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>{a.time}</span>
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{a.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard