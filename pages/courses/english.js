import { useEffect, useState } from 'react'
import io from 'socket.io-client' // For AI chat later

const levels = ['Beginner', 'Intermediate', 'Advanced']
const lessons = [
  { id: 1, title: 'Basic Vocabulary', type: 'vocab' },
  { id: 2, title: 'Grammar Essentials', type: 'grammar' },
  { id: 3, title: 'Speaking Practice', type: 'speaking' },
  { id: 4, title: 'Writing Emails', type: 'writing' },
  { id: 5, title: 'Business English', type: 'business' }
]

export default function EnglishCourse() {
  const [token, setToken] = useState('')
  const [progress, setProgress] = useState({})
  const [currentLesson, setCurrentLesson] = useState(0)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (!savedToken) window.location.href = '/'
    setToken(savedToken)
    fetchProgress(savedToken)
  }, [])

  const fetchProgress = async (token) => {
    const res = await fetch('/api/courses/progress', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    const prog = data.find(p => p.course === 'english') || {}
    setProgress(prog)
    if (prog.lesson) setCurrentLesson(prog.lesson)
  }

  const completeLesson = async (lessonId) => {
    await fetch('/api/courses/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ course: 'english', lesson: lessonId })
    })
    fetchProgress(token)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-black p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center">🌍 English Mastery ($30 Lifetime)</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8">Lessons</h2>
            <div className="space-y-4">
              {lessons.map(lesson => (
                <div key={lesson.id} className={`p-6 rounded-2xl transition-all ${
                  lesson.id <= (progress.lesson || 0) + 1 ? 'bg-blue-600/50 border-blue-500 border-2' : 'bg-gray-800/50 border-gray-600 border-2'
                }`}>
                  <div className="flex justify-between">
                    <span className="font-bold">{lesson.title}</span>
                    {lesson.id <= progress.lesson && <span>✅</span>}
                  </div>
                  {lesson.id === (progress.lesson || 0) + 1 && (
                    <button
                      onClick={() => completeLesson(lesson.id)}
                      className="mt-4 w-full bg-blue-500 hover:bg-blue-400 p-3 rounded-xl"
                    >
                      Start Lesson
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8">AI Practice Chat</h2>
            <div className="h-96 bg-black/30 rounded-2xl p-6 flex flex-col">
              <div className="flex-1 mb-4">
                <p className="opacity-75">Live AI conversation practice coming soon...</p>
              </div>
              <textarea placeholder="Practice English here..." className="w-full p-4 bg-gray-800 rounded-xl h-24" />
              <button className="mt-2 bg-blue-500 hover:bg-blue-400 p-3 rounded-xl">Send to AI</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

