import { useState } from 'react'

function Upload() {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState('idle') // idle | processing | done

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setStatus('processing')
      setTimeout(() => {
        setStatus('done')
      }, 2500)
    } else {
      alert('Please upload a PDF file.')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 text-2xl mb-4">
          📚
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Upload your textbook or PDF</h1>
        <p className="text-gray-500 mt-2">We'll turn it into a structured course automatically.</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
          className={`mt-8 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-colors ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <input
            id="fileInput"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <p className="text-gray-500 font-medium">
            📄 Drag & drop your PDF here, or click to browse
          </p>
        </div>

        {status === 'processing' && (
          <div className="mt-6 flex items-center justify-center gap-2 text-indigo-600 font-medium">
            <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            Processing "{file?.name}"... generating your course
          </div>
        )}

        {status === 'done' && (
          <div className="mt-6 inline-flex items-center gap-2 bg-green-50 text-green-700 font-medium px-4 py-2 rounded-full">
            ✅ Done! "{file?.name}" has been converted into a course.
          </div>
        )}
      </div>
    </div>
  )
}

export default Upload