'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Noto_Sans_Arabic, IBM_Plex_Sans_Arabic } from 'next/font/google'
import {
  CalendarDays,
  BarChart2,
  CheckCircle2,
  Circle,
  Edit,
  List,
  Plus,
  Save,
  Trash2,
  UserCog,
  ExternalLink,
  Sun,
  Moon,
  Cloud,
  Star,
  Rainbow,
  Sunrise,
  ChevronDown,
  Link2,
  Sunset,
  TrendingUp,
  Mic,
} from 'lucide-react'

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'],
})

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['700'],
})

const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
const dayIcons = [Sunrise, Sun, Moon, Star, Rainbow, Cloud, Sunset]

const taskColors = [
  { light: 'bg-blue-100', dark: 'bg-blue-300' },
  { light: 'bg-green-100', dark: 'bg-green-300' },
  { light: 'bg-yellow-100', dark: 'bg-yellow-300' },
  { light: 'bg-purple-100', dark: 'bg-purple-300' },
  { light: 'bg-pink-100', dark: 'bg-pink-300' },
  { light: 'bg-indigo-100', dark: 'bg-indigo-300' },
  { light: 'bg-red-100', dark: 'bg-red-300' },
]

const statisticsColors = [
  'bg-blue-50',
  'bg-green-50',
  'bg-yellow-50',
  'bg-purple-50',
  'bg-pink-50',
  'bg-indigo-50',
  'bg-red-50'
]

const taskIcons = {
  'قراءة': () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  ),
  'استماع': () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
    </svg>
  ),
  'كتابة': () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
      <path d="m15 5 4 4" />
    </svg>
  ),
  'محادثة': () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  'مشاهدة': () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"></polygon>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
    </svg>
  ),
  'لعبة': () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="11" x2="10" y2="11"></line>
      <line x1="8" y1="9" x2="8" y2="13"></line>
      <line x1="15" y1="12" x2="15.01" y2="12"></line>
      <line x1="18" y1="10" x2="18.01" y2="10"></line>
      <path d="M17.32 5H6.68a4 4 0 00-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 003 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 019.828 16h4.344a2 2 0 011.414.586L17 18c.5.5 1 1 2 1a3 3 0 003-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0017.32 5z"></path>
    </svg>
  ),
  'اختبار': () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
  'تحدث': () => <Mic size={24} />,
  'مهمة جديدة': () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  )
}

type Task = {
  id: string;
  category: string;
  text: string;
  completed: boolean;
}

type DayData = {
  tasks: Task[];
  link: string;
}

type TasksData = Record<string, DayData>

const TypewriterEffect: React.FC<{ text: string; speed?: number }> = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return <span>{displayedText}</span>
}

export default function Component() {
  const [tasksData, setTasksData] = useState<TasksData>({})
  const [activeDay, setActiveDay] = useState(days[0])
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [tempLink, setTempLink] = useState('')
  const [editingTask, setEditingTask] = useState<{ day: string; index: number; field: 'text' | 'category' } | null>(null)
  const [showStatistics, setShowStatistics] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [, setCalendarTaps] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTasks = () => {
      try {
        const savedTasks = localStorage.getItem('englishLearningTasks')
        if (savedTasks) {
          setTasksData(JSON.parse(savedTasks))
        } else {
          initializeDefaultTasks()
        }
      } catch (error) {
        console.error('Error loading tasks:', error)
        setError('Failed to load tasks. Please try refreshing the page.')
        initializeDefaultTasks()
      }
    }

    loadTasks()
  }, [])

  const initializeDefaultTasks = useCallback(() => {
    const initialData: TasksData = {}
    days.forEach((day) => {
      initialData[day] = {
        tasks: [
          { id: `task-${day}-0`, category: 'مهمة جديدة', text: 'أضف مهمة جديدة', completed: false }
        ],
        link: '',
      }
    })
    setTasksData(initialData)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('englishLearningTasks', JSON.stringify(tasksData))
    } catch (error) {
      console.error('Error saving tasks:', error)
      setError('Failed to save tasks. Please check your browser settings.')
    }
  }, [tasksData])

  const calculateDailyProgress = useCallback((day: string) => {
    const tasks = tasksData[day]?.tasks || []
    const completedTasks = tasks.filter((task: Task) => task.completed).length
    return tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0
  }, [tasksData])

  const calculateWeeklyProgress = useMemo(() => {
    let totalTasks = 0
    let completedTasks = 0
    Object.values(tasksData).forEach(dayData => {
      totalTasks += dayData.tasks.length
      completedTasks += dayData.tasks.filter(task => task.completed).length
    })
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  }, [tasksData])

  const toggleTask = useCallback((day: string, index: number) => {
    setTasksData(prev => {
      const newData = { ...prev }
      if (newData[day] && newData[day].tasks[index]) {
        newData[day].tasks[index].completed = !newData[day].tasks[index].completed
        if (newData[day].tasks[index].completed) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          })
        }
      }
      return newData
    })
  }, [])

  const editTask = useCallback((day: string, index: number, field: 'text' | 'category', value: string) => {
    if (!isAdmin) return
    setTasksData(prev => {
      const newData = { ...prev }
      if (newData[day] && newData[day].tasks[index]) {
        newData[day].tasks[index][field] = value
      }
      return newData
    })
  }, [isAdmin])

  const saveLink = useCallback(() => {
    if (!isAdmin) return
    if (tempLink) {
      setTasksData(prev => ({
        ...prev,
        [activeDay]: {
          ...prev[activeDay],
          link: tempLink
        }
      }))
      setShowLinkInput(false)
      setTempLink('')
    }
  }, [isAdmin, activeDay, tempLink])

  const deleteLink = useCallback(() => {
    if (!isAdmin) return
    setTasksData(prev => ({
      ...prev,
      [activeDay]: {
        ...prev[activeDay],
        link: ''
      }
    }))
  }, [isAdmin, activeDay])

  const addTask = useCallback(() => {
    if (!isAdmin) return
    setTasksData(prev => {
      const newData = { ...prev }
      const newTaskId = `task-${activeDay}-${newData[activeDay].tasks.length}`
      newData[activeDay].tasks.push({
        id: newTaskId,
        category: 'مهمة جديدة',
        text: 'أضف مهمة جديدة',
        completed: false
      })
      return newData
    })
  }, [isAdmin, activeDay])

  const deleteTask = useCallback((day: string, index: number) => {
    if (!isAdmin) return
    setTasksData(prev => {
      const newData = { ...prev }
      if (newData[day] && newData[day].tasks[index]) {
        newData[day].tasks.splice(index, 1)
      }
      return newData
    })
  }, [isAdmin])

  const toggleAdminMode = useCallback(() => {
    setIsAdmin(prev => !prev)
  }, [])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'a') {
      event.preventDefault()
      setIsAdmin(true)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const handleCalendarTap = useCallback(() => {
    setCalendarTaps(prevTaps => {
      if (prevTaps === 4) {
        setIsAdmin(true)
        return 0
      }
      setTimeout(() => setCalendarTaps(0), 1500)
      return prevTaps + 1
    })
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`container mx-auto p-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen ${notoSansArabic.className}`} dir="rtl">
      <motion.h1 
        className="text-lg font-bold text-center mb-4 text-blue-900 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <TypewriterEffect text="جدول المهام الأسبوعي لتعلم اللغة الإنجليزية" speed={20} />
        <CalendarDays 
          className="inline-block mr-2 text-blue-900 cursor-pointer" 
          onClick={handleCalendarTap}
        />
      </motion.h1>
      
      <div className="flex justify-between items-center mb-4">
        <AnimatePresence>
          {isAdmin && (
            <motion.button
              className="px-4 py-2 rounded-full text-sm font-bold focus:outline-none transition-colors duration-300 bg-blue-500 text-white"
              onClick={toggleAdminMode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              مشرف
              <UserCog className="inline-block mr-2" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        className="flex mb-4 overflow-x-auto pb-2 scrollbar-hide"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {days.map((day, index) => {
          const DayIcon = dayIcons[index]
          return (
            <motion.button
              key={day}
              className={`flex-shrink-0 px-4 py-2 rounded-full mr-2 text-sm font-bold focus:outline-none transition-colors duration-300 ${
                activeDay === day ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100'
              } ${ibmPlexSansArabic.className}`}
              onClick={() => setActiveDay(day)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {day} <DayIcon className="inline-block ml-1" size={16} />
            </motion.button>
          )
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeDay}
          className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <h2 className="text-xl font-bold mb-4 text-blue-800">
            <TypewriterEffect text={activeDay} speed={50} />
          </h2>
          
          <motion.div 
            className="bg-blue-50 rounded-xl p-3 mb-4 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
          >
            <h3 className="text-lg font-bold mb-2 text-blue-800 flex items-center">
              <TypewriterEffect text="تقدم اليوم" speed={50} />
              <TrendingUp className="mr-2 text-blue-600" />
            </h3>
            <div className="relative pt-1">
              <div className="overflow-hidden h-4 mb-2 text-xs flex rounded-full bg-green-100">
                <motion.div 
                  style={{ width: `${calculateDailyProgress(activeDay)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-600 to-green-300"
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateDailyProgress(activeDay)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="text-center">
                <span className="text-sm font-bold text-green-800">
                  <span className="mr-1">{calculateDailyProgress(activeDay)}%</span>
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-purple-50 rounded-xl p-3 mb-4  shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
          >
            <h3  className="text-lg font-bold mb-2 text-purple-800 flex  items-center">
              <TypewriterEffect text="المهام" speed={50} />
              <List className="mr-2 text-purple-600" />
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              
              <AnimatePresence>
                
                {tasksData[activeDay]?.tasks.map((task: Task, index: number) => {
                  const TaskIcon = taskIcons[task.category as keyof typeof taskIcons] || (() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>)
                  return (
                    <motion.div
                      key={task.id}
                      className={`p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${task.completed ? taskColors[index % taskColors.length].dark : taskColors[index % taskColors.length].light}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      layout
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex items-start mb-1 justify-between">
                          <div className="flex-grow ml-2">
                            {isAdmin && editingTask?.day === activeDay && editingTask?.index === index && editingTask?.field === 'category' ? (
                              <input
                                type="text"
                                value={task.category}
                                onChange={(e) => editTask(activeDay, index, 'category', e.target.value)}
                                onBlur={() => setEditingTask(null)}
                                autoFocus
                                className="w-full p-1 text-sm rounded bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-purple-800"
                              />
                            ) : (
                              <span 
                                className={`font-bold text-sm text-purple-800 ${isAdmin ? 'cursor-pointer' : ''} truncate block`}
                                onClick={() => isAdmin && setEditingTask({ day: activeDay, index, field: 'category' })}
                              >
                                {task.category}
                              </span>
                            )}
                          </div>
                          <motion.div
                            initial={{ rotate: 0, scale: 1, opacity: 0.5 }}
                            animate={{ 
                              rotate: [0, 15, -15, 0],
                              scale: [1, 1.3, 1],
                              opacity: 1
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              times: [0, 0.2, 0.8, 1]
                            }}
                            style={{
                              transformOrigin: "center"
                            }}
                          >
                            <TaskIcon />
                          </motion.div>
                        </div>
                        {isAdmin && editingTask?.day === activeDay && editingTask?.index === index && editingTask?.field === 'text' ? (
                          <input
                            type="text"
                            value={task.text}
                            onChange={(e) => editTask(activeDay, index, 'text', e.target.value)}
                            onBlur={() => setEditingTask(null)}
                            autoFocus
                            className="w-full p-1 text-sm rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-800"
                          />
                        ) : (
                          <div
                            className={`w-full p-1 text-sm rounded bg-white bg-opacity-50 text-blue-800 ${isAdmin ? 'cursor-pointer' : ''} truncate flex-grow`}
                            onClick={() => isAdmin && setEditingTask({ day: activeDay, index, field: 'text' })}
                          >
                            {task.text}
                          </div>
                        )}
                        <div className="flex items-center mt-1 justify-between">
                          <span className="text-sm text-gray-600">
                            {task.completed ? 'مكتملة' : 'غير مكتملة'}
                          </span>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <motion.div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'} cursor-pointer`}
                              onClick={() => toggleTask(activeDay, index)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              animate={{ backgroundColor: task.completed ? '#10B981' : '#FFFFFF' }}
                              transition={{ duration: 0.2 }}
                            >
                              {task.completed ? (
                                <CheckCircle2 className="text-white" size={16} />
                              ) : (
                                <Circle className="text-gray-400" size={16} />
                              )}
                            </motion.div>
                            {isAdmin && (
                              <motion.button
                                className="w-5 h-5 rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors duration-200 flex items-center justify-center"
                                onClick={() => deleteTask(activeDay, index)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 size={12} />
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
            {isAdmin && (
              <motion.button
                className="mt-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1 rounded-full text-sm hover:from-purple-500 hover:to-pink-600 transition-all duration-300"
                onClick={addTask}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                إضافة مهمة جديدة
                <Plus className="inline-block mr-1" size={16} />
              </motion.button>
            )}
          </motion.div>

          <motion.div 
            className="bg-pink-50 rounded-xl p-3 mb-4 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
          >
            <h3 className="text-lg font-bold mb-2 text-pink-800 flex items-center">
              <TypewriterEffect text="الروابط" speed={50} />
              <Link2 className="mr-2 text-pink-600" />
            </h3>
            {isAdmin && !showLinkInput && !tasksData[activeDay]?.link && (
              <motion.button
                className="bg-gradient-to-r from-pink-400 to-red-500 text-white px-3 py-1 rounded-full text-sm hover:from-pink-500 hover:to-red-600 transition-all duration-300"
                onClick={() => setShowLinkInput(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                إضافة رابط
                <Plus className="inline-block mr-1" size={16} />
              </motion.button>
            )}
            <AnimatePresence>
              {showLinkInput && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                  className="flex flex-col sm:flex-row items-center mt-2"
                >
                  <input
                    type="text"
                    value={tempLink}
                    onChange={(e) => setTempLink(e.target.value)}
                    placeholder="أدخل الرابط هنا..."
                    className="flex-grow p-2 text-sm rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 w-full sm:w-auto mb-2 sm:mb-0"
                  />
                  <motion.button
                    className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-lg text-sm hover:from-pink-600 hover:to-red-600 transition-all duration-300 sm:mr-2 w-full sm:w-auto"
                    onClick={saveLink}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    حفظ
                    <Save className="inline-block mr-1" size={16} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
            {tasksData[activeDay]?.link && (
              <div className="flex flex-wrap items-center mt-2 space-y-2 sm:space-y-0 sm:space-x-2 rtl:space-x-reverse">
                <motion.a 
                  href={tasksData[activeDay].link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gradient-to-r from-blue-400 to-blue-600 text-white px-2 py-1 rounded-full text-sm hover:from-blue-500 hover:to-blue-700 transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  فتح الرابط
                  <ExternalLink className="inline-block mr-1" size={16} />
                </motion.a>
                {isAdmin && (
                  <>
                    <motion.button
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-sm hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 w-full sm:w-auto"
                      onClick={() => setShowLinkInput(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      تغيير
                      <Edit className="inline-block mr-1" size={16} />
                    </motion.button>
                    <motion.button
                      className="bg-gradient-to-r from-red-400 to-red-600 text-white px-2 py-1 rounded-full text-sm hover:from-red-500 hover:to-red-700 transition-all duration-300 w-full sm:w-auto"
                      onClick={deleteLink}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      حذف
                      <Trash2 className="inline-block mr-1" size={16} />
                    </motion.button>
                  </>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
          >
            <motion.h2
              className="text-lg font-bold mb-2 text-blue-800 cursor-pointer flex items-center"
              onClick={() => setShowStatistics(!showStatistics)}
              whileHover={{ scale: 1.05 }}
            >
              <TypewriterEffect text="الإحصائيات" speed={50} />
              <BarChart2 className="inline-block mr-2" size={20} />
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: showStatistics ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="mr-2"
              >
                <ChevronDown size={20} />
              </motion.div>
            </motion.h2>
            <AnimatePresence>
              {showStatistics && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-3">
                    <h3 className={`text-md font-bold mb-1 text-blue-700 ${ibmPlexSansArabic.className}`}>
                      <TypewriterEffect text="التقدم الأسبوعي" speed={50} />
                    </h3>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-4 mb-2 text-xs flex rounded-full bg-blue-200">
                        <motion.div 
                          style={{ width: `${calculateWeeklyProgress}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${calculateWeeklyProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-bold text-blue-800">
                          {calculateWeeklyProgress}% مكتمل
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {days.map((day, index) => {
                      const DayIcon = dayIcons[index]
                      return (
                        <motion.div
                          key={day}
                          className={`p-2 rounded-lg shadow-sm ${statisticsColors[index]}`}
                          whileHover={{ scale: 1.05, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                        >
                          <h4 className={`text-sm font-bold mb-1 text-blue-700 flex items-center ${ibmPlexSansArabic.className}`}>
                            <TypewriterEffect text={day} speed={50} />
                            <DayIcon className="inline-block ml-1" size={16} />
                          </h4>
                          <div className="relative pt-1">
                            <div className="overflow-hidden h-3 mb-1 text-xs flex rounded-full bg-blue-200">
                              <motion.div 
                                style={{ width: `${calculateDailyProgress(day)}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-400 to-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${calculateDailyProgress(day)}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                            <div className="text-center">
                              <span className="text-xs font-bold text-blue-800">
                                {calculateDailyProgress(day)}% مكتمل
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}