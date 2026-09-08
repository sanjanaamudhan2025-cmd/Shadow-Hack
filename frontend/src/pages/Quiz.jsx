import { InteractiveQuiz } from '../components/StudyComponents'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

function Quiz() {
  const { user } = useAuth()
  const stored = localStorage.getItem('lwt_last_quiz')
  const data = stored ? JSON.parse(stored) : null

  const pdfInfo = JSON.parse(localStorage.getItem('lwt_pdf_info') || 'null')
  const baseName = pdfInfo?.filename
    ? pdfInfo.filename.replace(/\.pdf$/i, '')
    : (data?.title || 'Untitled')
  const quizName = `${baseName} Quiz`

  const resultsKey = `lwt_results_${user?.id || 'guest'}`
  const [results, setResults] = useState(() =>
    JSON.parse(localStorage.getItem(resultsKey) || '[]')
  )

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
        {data ? (
          <InteractiveQuiz questions={data.questions} onComplete={handleComplete} />
        ) : (
          <p className="mt-6" style={{ color: 'var(--text-muted)' }}>
            No quiz yet — go to Upload, add a PDF, and click "Generate Quiz" first.
          </p>
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