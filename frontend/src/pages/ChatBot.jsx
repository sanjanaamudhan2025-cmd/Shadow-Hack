import { useState, useRef, useEffect } from 'react'

function ChatBot() {
  const pdfText = localStorage.getItem('lwt_pdf_text')
  const pdfInfo = JSON.parse(localStorage.getItem('lwt_pdf_info') || 'null')

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('lwt_chat_history')
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('lwt_chat_history', JSON.stringify(messages))
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const question = input.trim()
    if (!question || loading) return

    const userMsg = { role: 'user', content: question }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: pdfText,
          question,
          history: updatedMessages,
        }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }])
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem('lwt_chat_history')
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }} className="min-h-screen p-6 flex flex-col">
      <div style={{ background: 'var(--card-bg)' }} className="max-w-3xl w-full mx-auto rounded-3xl shadow-xl p-8 flex flex-col flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">💬 Chatbot Tutor</h1>
            {pdfInfo && (
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Chatting about: {pdfInfo.filename}
              </p>
            )}
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-sm underline"
              style={{ color: 'var(--text-muted)' }}
            >
              Clear chat
            </button>
          )}
        </div>

        {!pdfText && (
          <p className="mt-6" style={{ color: 'var(--text-muted)' }}>
            No PDF uploaded yet — go to Upload first, then come back here to ask questions about it.
          </p>
        )}

        {pdfText && (
          <>
            <div className="mt-6 flex-1 overflow-y-auto flex flex-col gap-4 pr-1" style={{ maxHeight: '55vh' }}>
              {messages.length === 0 && (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Ask anything about your uploaded document — I'll answer based on its content.
                </p>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.role === 'user' ? 'self-end bg-indigo-600 text-white' : 'self-start'
                  }`}
                  style={
                    m.role === 'assistant'
                      ? { background: 'var(--bg)', border: '1px solid var(--border)' }
                      : undefined
                  }
                >
                  {m.content}
                </div>
              ))}

              {loading && (
                <div
                  className="self-start max-w-[80%] px-4 py-3 rounded-2xl text-sm"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                >
                  Thinking...
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {error && (
              <div className="mt-3 bg-red-50 text-red-700 rounded-xl p-3 text-sm">{error}</div>
            )}

            <div className="mt-4 flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about your document..."
                rows={2}
                className="flex-1 px-4 py-3 rounded-xl border resize-none"
                style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ChatBot