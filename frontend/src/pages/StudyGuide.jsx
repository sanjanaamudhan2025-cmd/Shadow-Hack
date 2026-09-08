function StudyGuide() {
  const stored = localStorage.getItem('lwt_last_summary')
  const data = stored ? JSON.parse(stored) : null

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }} className="min-h-screen p-6">
      <div style={{ background: 'var(--card-bg)' }} className="max-w-2xl mx-auto rounded-3xl shadow-xl p-10">
        <h1 className="text-3xl font-bold">Study Guide</h1>
        {data ? (
          <div className="mt-6 text-left whitespace-pre-wrap">{data.summary}</div>
        ) : (
          <p className="mt-6" style={{ color: 'var(--text-muted)' }}>
            No study guide yet — go to Upload, add a PDF, and click "Study Guide" first.
          </p>
        )}
      </div>
    </div>
  )
}

export default StudyGuide