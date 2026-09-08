import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function getWeekDays() {
  const today = new Date()
  const sunday = new Date(today)
  sunday.setDate(today.getDate() - today.getDay())

  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday)
    d.setDate(sunday.getDate() + i)
    days.push(d)
  }
  return days
}

function Dashboard() {
  const { user } = useAuth()
  const resultsKey = `lwt_results_${user?.id || 'guest'}`
  const results = JSON.parse(localStorage.getItem(resultsKey) || '[]')

  const pdfInfo = JSON.parse(localStorage.getItem('lwt_pdf_info') || 'null')
  const lastQuiz = JSON.parse(localStorage.getItem('lwt_last_quiz') || 'null')
  const lastFlashcards = JSON.parse(localStorage.getItem('lwt_last_flashcards') || 'null')
  const lastSummary = JSON.parse(localStorage.getItem('lwt_last_summary') || 'null')
  const lastCourse = JSON.parse(localStorage.getItem('lwt_last_course') || 'null')

  const weekDays = getWeekDays()
  const dayLabels = weekDays.map((d) => d.toLocaleDateString(undefined, { weekday: 'short' }))
  const dayScores = weekDays.map((day) => {
    const dayStr = day.toLocaleDateString()
    const dayResults = results.filter((r) => r.date === dayStr)
    if (dayResults.length === 0) return 0
    return Math.round(dayResults.reduce((sum, r) => sum + r.score, 0) / dayResults.length)
  })

  const resultsThisWeek = results.filter((r) =>
    weekDays.some((d) => d.toLocaleDateString() === r.date)
  )
  const weeklyAvg = resultsThisWeek.length
    ? Math.round(resultsThisWeek.reduce((sum, r) => sum + r.score, 0) / resultsThisWeek.length)
    : 0

  const lastResult = results[results.length - 1]

  const baseName = pdfInfo?.filename ? pdfInfo.filename.replace(/\.pdf$/i, '') : null

  const generatedCards = []
  if (lastQuiz) {
    generatedCards.push({
      id: 'quiz',
      name: baseName ? `${baseName} Quiz` : 'Quiz',
      detail: `${lastQuiz.questions?.length || 0} Questions`,
      gradient: 'from-indigo-500 to-purple-600',
      icon: '📝',
      to: '/quiz',
    })
  }
  if (lastFlashcards) {
    generatedCards.push({
      id: 'flashcards',
      name: baseName ? `${baseName} Flashcards` : 'Flashcards',
      detail: `${lastFlashcards.cards?.length || 0} Cards`,
      gradient: 'from-orange-400 to-pink-500',
      icon: '🗂️',
      to: '/flashcards',
    })
  }
  if (lastSummary) {
    generatedCards.push({
      id: 'study-guide',
      name: baseName ? `${baseName} Study Guide` : 'Study Guide',
      detail: 'Summary',
      gradient: 'from-teal-400 to-blue-500',
      icon: '📄',
      to: '/study-guide',
    })
  }
  if (lastCourse) {
    generatedCards.push({
      id: 'course',
      name: baseName ? `${baseName} Course` : 'Course',
      detail: 'Generated Course',
      gradient: 'from-pink-500 to-rose-500',
      icon: '📘',
      to: '/course/generated',
    })
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }} className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">

        {/* LEFT PANEL */}
        <div className="lg:w-64 flex-shrink-0 flex flex-col gap-5">
          <div
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
            className="rounded-2xl p-5 border shadow-md"
          >
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Weekly Progress</p>
            <p className="text-3xl font-bold mt-1" style={{ color: 'var(--accent)' }}>{weeklyAvg}%</p>
            <div className="mt-4 h-16 flex items-end gap-1">
              {dayScores.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-indigo-500 to-purple-400"
                  style={{ height: `${h || 4}%` }}
                />
              ))}
            </div>
            <div className="mt-1 flex gap-1">
              {dayLabels.map((label, i) => (
                <p
                  key={i}
                  className="flex-1 text-center text-[10px] font-medium"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {label}
                </p>
              ))}
            </div>
          </div>

          <div
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
            className="rounded-2xl p-4 border shadow-md"
          >
            <p className="text-sm font-semibold">Last completed</p>
            {lastResult ? (
              <>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{lastResult.quiz_name}</p>
                <Link
                  to="/quiz"
                  className="mt-3 inline-block text-sm font-medium px-4 py-2 rounded-full text-white bg-gradient-to-r from-indigo-500 to-purple-600"
                >
                  Retake
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Nothing yet</p>
                <Link
                  to="/upload"
                  className="mt-3 inline-block text-sm font-medium px-4 py-2 rounded-full text-white bg-gradient-to-r from-indigo-500 to-purple-600"
                >
                  Upload a PDF
                </Link>
              </>
            )}
          </div>
        </div>

        {/* CENTER */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="rounded-3xl p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white flex items-center justify-between shadow-lg shadow-purple-500/20">
            <div>
              <p className="text-indigo-100">Good to see you!</p>
              <h1 className="text-3xl font-bold mt-1">Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
              <p className="text-indigo-100 mt-2">
                {results.length > 0
                  ? `You've taken ${results.length} quiz${results.length === 1 ? '' : 'es'} so far. Keep going!`
                  : 'Upload a PDF to generate your first quiz, flashcards, or study guide.'}
              </p>
            </div>
            <div className="text-6xl">🎓</div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Your Generated Content</h2>
            {generatedCards.length === 0 ? (
              <div
                style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
                className="rounded-2xl border p-8 text-center"
              >
                <p style={{ color: 'var(--text-muted)' }}>
                  Nothing generated yet — head to Upload to create your first quiz, flashcards, or study guide.
                </p>
                <Link
                  to="/upload"
                  className="mt-4 inline-block text-sm font-medium px-5 py-2 rounded-full text-white bg-gradient-to-r from-indigo-500 to-purple-600"
                >
                  Go to Upload
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {generatedCards.map((course) => (
                  <Link
                    to={course.to}
                    key={course.id}
                    className={`rounded-2xl p-5 bg-gradient-to-br ${course.gradient} text-white shadow-lg hover:scale-[1.02] transition-transform block`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl">
                      {course.icon}
                    </div>
                    <h3 className="font-semibold mt-4">{course.name}</h3>
                    <p className="text-sm mt-1 text-white/80">{course.detail}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard