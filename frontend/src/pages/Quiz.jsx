import { InteractiveQuiz } from '../components/StudyComponents'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

function Quiz() {
  const { user } = useAuth()

  const pdfText = localStorage.getItem('lwt_pdf_text')
  const pdfInfo = JSON.parse(localStorage.getItem('lwt_pdf_info') || 'null')
  const baseName = pdfInfo?.filename ? pdfInfo.filename.replace(/\.pdf$/i, '') : 'Untitled'
  const quizName = `${baseName} Quiz`

  const resultsKey = `lwt_results_${user?.id || 'guest'}`
  const [results, setResults] = useState(() =>
    JSON.parse(localStorage.getItem(resultsKey) || '[]')
  )

  const [numQuestions, setNumQuestions] = useState(5)
  const [durationMinutes, setDurationMinutes] = useState(10)
  const [durationSeconds, setDurationSeconds] = useState(10)
  const [quizData, setQuizData] = useState(null)
  const [started, setStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const totalSeconds = durationMinutes * 60 + durationSeconds

  const generateAndStart = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/generate/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pdfText, num_questions: numQuestions }),
      })
      const data = await res.json()
      localStorage.setItem('lwt_last_quiz', JSON.stringify(data))
      setQuizData(data)
      setStarted(true)
    } catch (err) {
      console.error(err)
      setError('Something went wrong generating the quiz.')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = (percent) => {
    const updated = [
      ...JSON.parse(localStorage.getItem(resultsKey) || '[]'),
      {
        quiz_name: quizName,
        date: new Date().toLocaleDateString(),
        score: percent,
        status: percent >= 60 ? 'Passed' : 'Failed',
      },
    ]

    localStorage.setItem(resultsKey, JSON.stringify(updated))
    setResults(updated)
  }

  const recentResults = results.slice(-5).reverse()

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }} className="min-h-screen p-6">
      <div style={{ background: 'var(--card-bg)' }} className="max-w-2xl mx-auto rounded-3xl shadow-xl p-10">
        <h1 className="text-3xl font-bold">Quiz</h1>

        {!pdfText && (
          <p className="mt-6" style={{ color: 'var(--text-muted)' }}>
            No PDF uploaded yet — go to Upload first.
          </p>
        )}

        {pdfText && !started && (
          <div className="mt-6">
            <p style={{ color: 'var(--text-muted)' }}>
              Choose how many questions you want and how much time to complete the quiz in.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Questions:</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
                  className="w-16 px-3 py-2 rounded-lg border text-center"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Minutes:</label>
                <input
                  type="number"
                  min="0"
                  max="180"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Math.max(0, Number(e.target.value) || 0))}
                  className="w-16 px-3 py-2 rounded-lg border text-center"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Seconds:</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(Math.min(59, Math.max(0, Number(e.target.value) || 0)))}
                  className="w-16 px-3 py-2 rounded-lg border text-center"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 text-red-700 rounded-xl p-3 text-sm">{error}</div>
            )}

            <button
              onClick={generateAndStart}
              disabled={totalSeconds <= 0 || loading}
              className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium disabled:opacity-40"
            >
              {loading ? 'Generating...' : 'Generate & Start Quiz'}
            </button>
          </div>
        )}

        {started && quizData && (
          <InteractiveQuiz
            questions={quizData.questions}
            onComplete={handleComplete}
            durationSeconds={totalSeconds}
          />
        )}

        {recentResults.length > 0 && (
          <div className="mt-10 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <h2 className="text-lg font-bold mb-3">Recent Scores</h2>
            <div className="flex flex-col gap-2">
              {recentResults.map((r, i) => (
                <div
                  key={i}
                  style={{ borderColor: 'var(--border)' }}
                  className="flex justify-between items-center px-4 py-3 rounded-xl border"
                >
                  <div>
                    <p className="text-sm font-semibold">{r.quiz_name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold" style={{ color: 'var(--accent)' }}>{r.score}%</span>
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
        )}
      </div>
    </div>
  )
}

export default Quiz