import { FlashcardGrid } from '../components/StudyComponents'

function Flashcards() {
  const stored = localStorage.getItem('lwt_last_flashcards')
  const data = stored ? JSON.parse(stored) : null

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }} className="min-h-screen p-6">
      <div style={{ background: 'var(--card-bg)' }} className="max-w-2xl mx-auto rounded-3xl shadow-xl p-10">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        {data ? (
          <FlashcardGrid cards={data.flashcards} />
        ) : (
          <p className="mt-6" style={{ color: 'var(--text-muted)' }}>
            No flashcards yet — go to Upload, add a PDF, and click "Generate Flashcards" first.
          </p>
        )}
      </div>
    </div>
  )
}

export default Flashcards