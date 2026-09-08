import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Upload() {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState('idle')
  const [pdfText, setPdfText] = useState('')
  const [pdfInfo, setPdfInfo] = useState(null)
  const [generating, setGenerating] = useState(null)
  const navigate = useNavigate()

  // Restore last uploaded PDF when returning to this page
  useEffect(() => {
    const savedText = localStorage.getItem('lwt_pdf_text')
    const savedInfo = localStorage.getItem('lwt_pdf_info')
    if (savedText && savedInfo) {
      setPdfText(savedText)
      setPdfInfo(JSON.parse(savedInfo))
      setStatus('done')
    }
  }, [])

  const handleFile = async (selectedFile) => {
    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      alert('Please upload a PDF file.')
      return
    }

    setFile(selectedFile)
    setStatus('processing')

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const res = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      setPdfText(data.text)
      setPdfInfo(data)
      setStatus('done')

      localStorage.setItem('lwt_pdf_text', data.text)
      localStorage.setItem('lwt_pdf_info', JSON.stringify(data))
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const generate = async (type) => {
    setGenerating(type)
    try {
      const res = await fetch(`http://127.0.0.1:8000/generate/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pdfText }),
      })
      const data = await res.json()

      if (type === 'quiz') {
        localStorage.setItem('lwt_last_quiz', JSON.stringify(data))
        navigate('/quiz')
      } else if (type === 'flashcards') {
        localStorage.setItem('lwt_last_flashcards', JSON.stringify(data))
        navigate('/flashcards')
      } else if (type === 'summary') {
        localStorage.setItem('lwt_last_summary', JSON.stringify(data))
        navigate('/study-guide')
      } else if (type === 'course') {
        localStorage.setItem('lwt_last_course', JSON.stringify(data))
        navigate('/course/generated')
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong generating content.')
    } finally {
      setGenerating(null)
    }
  }

  const clearFile = () => {
    localStorage.removeItem('lwt_pdf_text')
    localStorage.removeItem('lwt_pdf_info')
    setPdfText('')
    setPdfInfo(null)
    setStatus('idle')
    setFile(null)
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }} className="min-h-screen flex items-center justify-center p-6">
      <div style={{ background: 'var(--card-bg)' }} className="w-full max-w-2xl rounded-3xl shadow-xl p-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 text-3xl mb-4">
          📚
        </div>
        <h1 className="text-3xl font-bold">Upload your textbook or PDF</h1>
        <p className="mt-2" style={{ color: 'var(--text-muted)' }}>We'll turn it into a structured course automatically.</p>

        {status !== 'done' && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
            className={
              'mt-8 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-colors ' +
              (isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:bg-gray-100')
            }
          >
            <input
              id="fileInput"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div className="text-4xl mb-2">📄</div>
            <p className="font-medium">Drag & drop your PDF here</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>or click to browse</p>
          </div>
        )}

        {status === 'processing' && (
          <div className="mt-6 flex items-center justify-center gap-2 text-indigo-600 font-medium bg-indigo-50 rounded-full py-3">
            <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            Reading "{file?.name}"...
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 bg-red-50 text-red-700 rounded-2xl p-4">
            ❌ Something went wrong. Is the backend running?
          </div>
        )}

        {status === 'done' && pdfInfo && (
          <>
            <div className="mt-6 flex items-center justify-between text-left bg-green-50 text-green-800 rounded-2xl p-4">
              <span>✅ Active file: {pdfInfo.filename} ({pdfInfo.pages} pages)</span>
              <button onClick={clearFile} className="text-sm underline text-green-700">
                Upload different file
              </button>
            </div>

            <p className="mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
              Choose what to generate from this file:
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                onClick={() => generate('course')}
                disabled={generating}
                className="px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium disabled:opacity-50"
              >
                {generating === 'course' ? 'Generating...' : '📘 Generate Course'}
              </button>
              <button
                onClick={() => generate('quiz')}
                disabled={generating}
                className="px-4 py-3 rounded-xl bg-orange-500 text-white font-medium disabled:opacity-50"
              >
                {generating === 'quiz' ? 'Generating...' : '📝 Generate Quiz'}
              </button>
              <button
                onClick={() => generate('flashcards')}
                disabled={generating}
                className="px-4 py-3 rounded-xl bg-teal-500 text-white font-medium disabled:opacity-50"
              >
                {generating === 'flashcards' ? 'Generating...' : '🗂️ Generate Flashcards'}
              </button>
              <button
                onClick={() => generate('summary')}
                disabled={generating}
                className="px-4 py-3 rounded-xl bg-pink-500 text-white font-medium disabled:opacity-50"
              >
                {generating === 'summary' ? 'Generating...' : '📄 Study Guide'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Upload