import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const allCourses = {
  'machine-learning': {
    title: 'Machine Learning',
    modules: [
      { id: 1, title: 'What is Machine Learning?', summary: 'Covers the basic definition, types of ML, and real-world applications.' },
      { id: 2, title: 'Supervised Learning', summary: 'Explains labeled data, regression, classification, and common algorithms.' },
      { id: 3, title: 'Unsupervised Learning', summary: 'Covers clustering, dimensionality reduction, and pattern discovery.' },
      { id: 4, title: 'Model Evaluation', summary: 'Accuracy, precision, recall, and how to test model performance.' },
    ],
  },
  'data-structures': {
    title: 'Data Structures',
    modules: [
      { id: 1, title: 'Arrays & Strings', summary: 'How data is stored in contiguous memory and common string operations.' },
      { id: 2, title: 'Linked Lists', summary: 'Singly and doubly linked lists, traversal, insertion, and deletion.' },
      { id: 3, title: 'Stacks & Queues', summary: 'LIFO and FIFO structures and where they are used in real systems.' },
      { id: 4, title: 'Trees & Graphs', summary: 'Binary trees, traversal methods, and an intro to graph structures.' },
    ],
  },
  'chemistry-basics': {
    title: 'Chemistry Basics',
    modules: [
      { id: 1, title: 'Atomic Structure', summary: 'Protons, neutrons, electrons, and how atoms are organized.' },
      { id: 2, title: 'The Periodic Table', summary: 'How elements are grouped by properties and atomic number.' },
      { id: 3, title: 'Chemical Bonding', summary: 'Ionic, covalent, and metallic bonds and how molecules form.' },
      { id: 4, title: 'Reactions & Equations', summary: 'Balancing equations and understanding reaction types.' },
    ],
  },
  'world-history': {
    title: 'World History',
    modules: [
      { id: 1, title: 'Ancient Civilizations', summary: 'Mesopotamia, Egypt, and the origins of early societies.' },
      { id: 2, title: 'Empires & Expansion', summary: 'Rise and fall of major empires across continents.' },
      { id: 3, title: 'Revolutions', summary: 'Political and industrial revolutions that reshaped the modern world.' },
      { id: 4, title: 'The 20th Century', summary: 'World wars, decolonization, and the shaping of the modern world order.' },
    ],
  },
}

function CourseViewer() {
  const { courseId } = useParams()
  const course = allCourses[courseId] || allCourses['machine-learning']
  const [openModule, setOpenModule] = useState(null)

  const toggleModule = (id) => {
    setOpenModule(openModule === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-2xl mx-auto py-10">
        <Link to="/" className="text-indigo-600 text-sm font-medium">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-3">{course.title}</h1>
        <p className="text-gray-500 mt-1">{course.modules.length} modules generated</p>

        <div className="mt-8 flex flex-col gap-4">
          {course.modules.map((module) => (
            <div key={module.id} className="bg-white rounded-2xl shadow-md overflow-hidden transition-shadow hover:shadow-lg">
              <div
                onClick={() => toggleModule(module.id)}
                className="flex items-center justify-between px-6 py-5 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold bg-indigo-100 text-indigo-600">
                    {module.id}
                  </div>
                  <span className="font-semibold text-gray-800">{module.title}</span>
                </div>
                <span className={`text-gray-400 transition-transform ${openModule === module.id ? 'rotate-180' : ''}`}>▼</span>
              </div>

              {openModule === module.id && (
                <div className="px-6 pb-6 pl-20 text-gray-600 -mt-2">{module.summary}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CourseViewer