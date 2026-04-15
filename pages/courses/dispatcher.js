import { useEffect, useState } from 'react'
import { callAPI } from '../../lib/api'

const modules = [
  { id: 1, title: 'Broker Dealing Basics', description: 'How to negotiate rates', completed: false },
  { id: 2, title: 'Driver Management', description: 'Scheduling and compliance', completed: false },
  { id: 3, title: 'Load Negotiation', description: 'Getting top $/mile', completed: false },
  { id: 4, title: 'Claims & Disputes', description: 'Protect your revenue', completed: false },
  { id: 5, title: 'Documentation Masterclass', description: 'Paperwork perfection', completed: false }
]

export default function DispatcherCourse() {
  const [token, setToken] = useState('')
  const [progress, setProgress] = useState({})
  const [currentLesson, setCurrentLesson] = useState(0)
  const [hasSub, setHasSub] = useState(true)

  useEffect(() => {
    const initCourse = async () => {
      const savedToken = localStorage.getItem('token')
      if (!savedToken) window.location.href = '/'
      setToken(savedToken)

      const checkResult = await callAPI('/api/courses/check')
      if (checkResult.error || !checkResult.hasSub) {
        window.location.href = '/billing'
        return
      }
      setHasSub(true)
      fetchProgress()
    }
    initCourse()
  }, [])

  const fetchProgress = async () => {
    const result = await callAPI('/api/courses/progress')
    const data = Array.isArray(result) ? result : []
    const prog = data.find(p => p.course === 'dispatcher') || {}
    setProgress(prog)
    if (prog.lesson) setCurrentLesson(prog.lesson)
  }

  const completeLesson = async (lessonId) => {
    const result = await callAPI('/api/courses/progress', {
      method: 'POST',
      body: JSON.stringify({ course: 'dispatcher', lesson: lessonId })
    })
    if (!result.error) fetchProgress()
  }

  if (!hasSub) return <div className="min-h-screen bg-gradient-to-br from-orange-900 to-black p-8 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Subscription Required</h1>
          <p className="mb-8">Upgrade to access Dispatcher Course</p>
          <a href="/billing" className="bg-orange-500 hover:bg-orange-400 px-8 py-4 rounded-xl font-bold text-lg">Upgrade Now</a>
        </div>
      </div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 to-black p-8 text-white">

      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center">🎓 Dispatcher Course ($50 Lifetime)</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8">Progress</h2>
            <div className="space-y-4">
              {modules.map(module => (
                <div key={module.id} className={`p-6 rounded-2xl transition-all ${
                  module.id <= (progress.lesson || 0) + 1
                    ? 'bg-green-600/50 border-green-500 border-2'
                    : 'bg-gray-800/50 border-gray-600 border-2'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">{module.title}</span>
                    <span className={module.completed ? 'text-green-400' : 'text-gray-500'}>
                      {module.completed ? '✅ Done' : '🔒 Locked'}
                    </span>
                  </div>
                  <p className="opacity-75">{module.description}</p>
                  {module.id === currentLesson + 1 && (
                    <button
                      onClick={() => completeLesson(module.id)}
                      className="mt-4 w-full bg-green-500 hover:bg-green-400 p-3 rounded-xl font-bold"
                    >
                      Mark Complete → Next
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8">Current Lesson {currentLesson + 1}/5</h2>
            <div className="h-96 bg-black/30 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 animate-spin"></div>
                <p>Video lesson player here</p>
                <p className="text-sm opacity-75 mt-2">Quiz → Certificate on completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

