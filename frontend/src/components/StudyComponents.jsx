import { useState } from 'react'

export function FlashcardGrid({ cards }) {
  const [flipped, setFlipped] = useState({})

  const toggle = (i) => {
    setFlipped((prev) => ({ ...prev, [i]: !prev[i] }))
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 text-left">
      {cards.map((f, i) => (
        <div
          key={i}
          onClick={() => toggle(i)}
          className="relative h-40 cursor-pointer"
          style={{ perspective: '1000px' }}
        >
          <div
            className="relative w-full h-full transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped[i] ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            <div
              className="absolute w-full h-full rounded-xl p-4 flex items-center justify-center text-center shadow-md"
              style={{
                backfaceVisibility: 'hidden',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
              }}
            >
              <p className="font-semibold">{f.front}</p>
            </div>

            <div
              className="absolute w-full h-full rounded-xl p-4 flex items-center justify-center text-center shadow-md"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: 'var(--card-bg)',
                border: '1px solid var(--border)',
              }}
            >
              <p className="text-sm">{f.back}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function InteractiveQuiz({ questions, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

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
    const percent = Math.round((score / questions.length) * 100)
    if (onComplete) onComplete(percent)
  }

  return (
    <div className="mt-6 text-left">
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
                  className={`text-left px-4 py-2 rounded-xl border ${style} transition-colors`}
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
          disabled={Object.keys(answers).length !== questions.length}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium disabled:opacity-40"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-4 p-4 rounded-xl bg-indigo-50 text-indigo-700 font-semibold text-center">
          You scored {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
        </div>
      )}
    </div>
  )
}