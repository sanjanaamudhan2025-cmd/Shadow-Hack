import { InteractiveQuiz } from '../components/StudyComponents'
import { useAuth } from '../context/AuthContext'

function Quiz() {
  const { user } = useAuth()
  const stored = localStorage.getItem('lwt_last_quiz')
  const data = stored ? JSON.parse(stored) : null

  const pdfInfo = JSON.parse(localStorage.getItem('lwt_pdf_info') || 'null')
  const baseName = pdfInfo?.filename
    ? pdfInfo.filename.replace(/\.pdf$/i, '')
    : (data?.title || 'Untitled')
  const quizName = `${baseName} Quiz`

  const handleComplete = (percent) => {
    const key = `lwt_results_${user?.id || 'guest'}`
    const results = JSON.parse(localStorage.getItem(key) || '[]')

    results.push({
      quiz_name: quizName,
      date: new Date().toLocaleDateString(),
      score: percent,
      status: percent >= 60 ? 'Passed' : 'Failed',
    })

    localStorage.setItem(key, JSON.stringify(results))
  }

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
      </div>
    </div>
  )
}

export default Quiz