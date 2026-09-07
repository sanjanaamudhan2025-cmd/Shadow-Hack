import { Link } from 'react-router-dom'

const courses = [
  { id: 'machine-learning', name: 'Machine Learning', chapters: '10 Chapters', color: 'bg-indigo-100', icon: '🤖', accent: 'text-indigo-600' },
  { id: 'data-structures', name: 'Data Structures', chapters: '8 Chapters', color: 'bg-orange-100', icon: '📊', accent: 'text-orange-600' },
  { id: 'chemistry-basics', name: 'Chemistry Basics', chapters: '12 Chapters', color: 'bg-teal-100', icon: '⚗️', accent: 'text-teal-600' },
  { id: 'world-history', name: 'World History', chapters: '6 Chapters', color: 'bg-pink-100', icon: '🌍', accent: 'text-pink-600' },
]

const results = [
  { title: 'ML Midterm', date: '15 Sep 2026', score: '85', status: 'Passed', statusColor: 'text-green-600 bg-green-50' },
  { title: 'Chemistry Quiz 2', date: '18 Sep 2026', score: '56', status: 'Pending', statusColor: 'text-orange-600 bg-orange-50' },
]

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-indigo-600 rounded-3xl p-8 text-white flex items-center justify-between overflow-hidden relative">
          <div>
            <p className="text-indigo-200">Good Morning!</p>
            <h1 className="text-3xl font-bold mt-1">Welcome back 👋</h1>
            <p className="text-indigo-100 mt-2">You've completed 3 courses this month. Keep going!</p>
          </div>
          <div className="text-6xl">🎓</div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mt-10 mb-4">Your Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {courses.map((course) => (
            <Link
              to={`/course/${course.id}`}
              key={course.id}
              className="bg-white rounded-2xl shadow-md p-5 block hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${course.color}`}>
                {course.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mt-4">{course.name}</h3>
              <p className={`text-sm mt-1 ${course.accent}`}>{course.chapters}</p>
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-800 mt-10 mb-4">My Results</h2>
        <div className="bg-white rounded-2xl shadow-md p-6">
          {results.map((r, i) => (
            <div
              key={r.title}
              className={`flex items-center justify-between py-4 ${i !== results.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div>
                <p className="font-semibold text-gray-800">{r.title}</p>
                <p className="text-sm text-gray-400">{r.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-gray-700">{r.score}</p>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${r.statusColor}`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard