import { useState, useEffect, useCallback } from 'react'

export function FlashcardGrid({ cards }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [studyMode, setStudyMode] = useState('term') // 'term' = front shown first, 'definition' = back shown first

  const changeMode = (mode) => {
    setStudyMode(mode)
    setFlipped(false)
  }

  const goNext = useCallback(() => {
    setFlipped(false)
    setIndex((i) => (i + 1) % cards.length)
  }, [cards.length])

  const goPrev = useCallback(() => {
    setFlipped(false)
    setIndex((i) => (i - 1 + cards.length) % cards.length)
  }, [cards.length])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === ' ') {
        e.preventDefault()
        setFlipped((f) => !f)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  if (!cards || cards.length === 0) return null

  const card = cards[index]
  const frontText = studyMode === 'term' ? card.front : card.back
  const backText = studyMode === 'term' ? card.back : card.front

  return (
    <div>
      <div className="mt-6 flex items-center justify-center gap-2">
        <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          Show first:
        </span>
        <div className="inline-flex rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => changeMode('term')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              studyMode === 'term' ? 'bg-indigo-600 text-white' : ''
            }`}
            style={studyMode !== 'term' ? { color: 'var(--text)' } : undefined}
          >
            Term
          </button>
          <button
            onClick={() => changeMode('definition')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              studyMode === 'definition' ? 'bg-indigo-600 text-white' : ''
            }`}
            style={studyMode !== 'definition' ? { color: 'var(--text)' } : undefined}
          >
            Definition
          </button>
        </div>
      </div>

      <div className="mt-6 mx-auto max-w-3xl" style={{ perspective: '1500px' }}>
        <div
          onClick={() => setFlipped((f) => !f)}
          className="relative w-full h-96 cursor-pointer rounded-2xl"
        >
          <div
            className="relative w-full h-full transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            <div
              className="absolute w-full h-full rounded-2xl p-8 flex items-center justify-center text-center shadow-xl"
              style={{
                backfaceVisibility: 'hidden',
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
              }}
            >
              <p className="text-3xl font-semibold">{frontText}</p>
            </div>

            <div
              className="absolute w-full h-full rounded-2xl p-8 flex items-center justify-center text-center shadow-xl"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
              }}
            >
              <p className="text-xl">{backText}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <button
          onClick={goPrev}
          className="w-11 h-11 flex items-center justify-center rounded-full border transition-colors hover:bg-black/5"
          style={{ borderColor: 'var(--border)' }}
          aria-label="Previous card"
        >
          ←
        </button>

        <span className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-muted)' }}>
          {index + 1} / {cards.length}
        </span>

        <button
          onClick={goNext}
          className="w-11 h-11 flex items-center justify-center rounded-full border transition-colors hover:bg-black/5"
          style={{ borderColor: 'var(--border)' }}
          aria-label="Next card"
        >
          →
        </button>
      </div>

      <p className="mt-3 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        Click the card to flip · Use ← → arrow keys or spacebar
      </p>
    </div>
  )
}

export function InteractiveQuiz({ questions, onComplete, durationSeconds = 610 }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(durationSeconds)
  const [paused, setPaused] = useState(false)
  const [confirmingEnd, setConfirmingEnd] = useState(false)
  const [confirmingRestart, setConfirmingRestart] = useState(false)

  useEffect(() => {
    if (submitted || paused) return
    if (timeLeft <= 0) {
      handleSubmit()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, submitted, paused])

  const selectAnswer = (qIndex, optIndex) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))
  }

  const score = questions.reduce(
    (total, q, i) => total + (answers[i] === q.correct_index ? 1 : 0),
    0
  )

  const handleSubmit = () => {
    setSubmitted(true)
    setPaused(false)
    setConfirmingEnd(false)
    const percent = Math.round((score / questions.length) * 100)
    if (onComplete) onComplete(percent)
  }

  const togglePause = () => {
    setPaused((p) => !p)
  }

  const restartQuiz = () => {
    setAnswers({})
    setSubmitted(false)
    setPaused(false)
    setConfirmingEnd(false)
    setConfirmingRestart(false)
    setTimeLeft(durationSeconds)
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const isLowTime = timeLeft <= 60 && !submitted

  return (
    <div className="mt-6 text-left">
      {!submitted && (
        <div className="mb-6 sticky top-0 z-10 flex flex-wrap items-center justify-center gap-3">
          <div
            className={`rounded-xl px-4 py-2 text-center font-bold text-lg ${
              paused
                ? 'bg-gray-500/15 text-gray-500'
                : isLowTime
                ? 'bg-red-500/15 text-red-500'
                : 'bg-indigo-500/15 text-indigo-500'
            }`}
          >
            ⏱ {formatTime(timeLeft)} {paused && '(paused)'}
          </div>

          <button
            onClick={togglePause}
            className="px-4 py-2 rounded-xl border text-sm font-medium"
            style={{ borderColor: 'var(--border)' }}
          >
            {paused ? '▶ Resume' : '⏸ Pause'}
          </button>

          {!confirmingRestart ? (
            <button
              onClick={() => setConfirmingRestart(true)}
              className="px-4 py-2 rounded-xl border text-sm font-medium"
              style={{ borderColor: 'var(--border)' }}
            >
              🔄 Restart
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Restart from scratch?</span>
              <button
                onClick={restartQuiz}
                className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium"
              >
                Yes, restart
              </button>
              <button
                onClick={() => setConfirmingRestart(false)}
                className="px-3 py-2 rounded-xl border text-sm font-medium"
                style={{ borderColor: 'var(--border)' }}
              >
                Cancel
              </button>
            </div>
          )}

          {!confirmingEnd ? (
            <button
              onClick={() => setConfirmingEnd(true)}
              className="px-4 py-2 rounded-xl border text-sm font-medium text-red-500"
              style={{ borderColor: 'var(--border)' }}
            >
              ⏹ End Quiz
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>End now?</span>
              <button
                onClick={handleSubmit}
                className="px-3 py-2 rounded-xl bg-red-500 text-white text-sm font-medium"
              >
                Yes, end it
              </button>
              <button
                onClick={() => setConfirmingEnd(false)}
                className="px-3 py-2 rounded-xl border text-sm font-medium"
                style={{ borderColor: 'var(--border)' }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {questions.map((q, i) => (
        <div key={i} className="mb-6">
          <p className="font-semibold mb-2">{i + 1}. {q.question}</p>
          <div className="flex flex-col gap-2">
            {q.options.map((opt, j) => {
              const isSelected = answers[i] === j
              const isCorrect = j === q.correct_index
              let style = 'border-gray-300'
              if (submitted) {
                if (isCorrect) style = 'border-green-500 bg-green-50 text-green-700'
                else if (isSelected && !isCorrect) style = 'border-red-500 bg-red-50 text-red-700'
              } else if (isSelected) {
                style = 'border-indigo-500 bg-indigo-50'
              }
              return (
                <button
                  key={j}
                  onClick={() => selectAnswer(i, j)}
                  disabled={paused}
                  className={`text-left px-4 py-2 rounded-xl border ${style} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== questions.length || paused}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium disabled:opacity-40"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-4 p-4 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-center">
          <p>
            You scored {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
          </p>
          {timeLeft <= 0 && <p className="text-sm font-normal mt-1">Time ran out — auto-submitted.</p>}
          <button
            onClick={restartQuiz}
            className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm"
          >
            🔄 Restart Quiz
          </button>
        </div>
      )}
    </div>
  )
}