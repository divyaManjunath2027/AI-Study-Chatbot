

import '@fontsource/google-sans-flex/400.css'
import '@fontsource/google-sans-flex/500.css'
import '@fontsource/google-sans-flex/600.css'
import '@fontsource/google-sans-flex/700.css'
import '@fontsource/google-sans-flex/800.css'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'
import './Auth.css'

type Message = {
  role: 'user' | 'assistant'
  content: string
  followUps?: string[]
}

type ChatResponse = {
  reply?: string
  response?: string
  answer?: string
  follow_up_questions?: string[]
  followUps?: string[]
}

type AuthUser = {
  id: number
  full_name: string
  email: string
  created_at?: string
}

type AuthResponse = {
  user: AuthUser
}

type AuthMode = 'login' | 'register'
type Page = 'home' | 'chat' | 'auth'

const API_BASE = ''
const API_URL = `${API_BASE}/chat`

const features = [
  {
    number: '01',
    icon: '✦',
    title: 'AI Personal Tutor',
    description: 'Understand difficult concepts through simple explanations and step-by-step guidance.',
    prompt: 'Explain a difficult academic topic to me in simple words with examples.',
  },
  {
    number: '02',
    icon: '▤',
    title: 'Smart Study Notes',
    description: 'Turn complex subjects into organised, easy-to-revise study notes.',
    prompt: 'Help me understand how to organise effective study notes.',
  },
  {
    number: '03',
    icon: '✓',
    title: 'AI Quiz Generator',
    description: 'Practise what you have learned with questions and helpful explanations.',
    prompt: 'Help me practise with a five-question multiple-choice quiz.',
  },
]

const defaultFollowUps = [
  'Can you explain this with an example?',
  'Can you make this easier to understand?',
  'Can you test my understanding?',
]

function AuthScreen({
  onSuccess,
  onGuest,
  onHome,
}: {
  onSuccess: (data: AuthResponse) => void
  onGuest: () => void
  onHome: () => void
}) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (mode === 'register') {
      if (fullName.trim().length < 2) {
        setError('Please enter your full name.')
        return
      }

      if (password !== confirmPassword) {
        setError('Your passwords do not match.')
        return
      }

      if (password.length < 8) {
        setError('Your password must contain at least 8 characters.')
        return
      }
    }

    setLoading(true)

    try {
      const endpoint =
        mode === 'register'
          ? `${API_BASE}/auth/register`
          : `${API_BASE}/auth/login`

      const payload =
        mode === 'register'
          ? {
              full_name: fullName.trim(),
              email: email.trim(),
              password,
            }
          : {
              email: email.trim(),
              password,
            }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        const detail = data.detail
        throw new Error(
          typeof detail === 'string'
            ? detail
            : 'Unable to complete your request. Please check your details.',
        )
      }

      if (!data.user) {
        throw new Error('The server returned an incomplete login response.')
      }

      onSuccess(data as AuthResponse)
    } catch (err) {
      if (err instanceof TypeError) {
        setError('Cannot connect to StudyAI. Please check that the backend is running.')
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="logo-symbol">S</span>
          <span>
            study<span className="logo-highlight">ai</span>
          </span>
        </div>

        <h1 className="auth-heading">
          {mode === 'login' ? 'Welcome back!' : 'Create your account'}
        </h1>

        <p className="auth-description">
          {mode === 'login'
            ? 'Sign in and continue your learning journey with StudyAI.'
            : 'Join StudyAI and make every learning session count.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full name</label>
              <input
                id="auth-name"
                className="auth-input"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                minLength={2}
                maxLength={80}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              className="auth-input"
              type="password"
              placeholder="Enter your password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={mode === 'register' ? 8 : undefined}
              maxLength={128}
              required
            />
          </div>

          {mode === 'register' && (
            <div className="auth-field">
              <label htmlFor="auth-confirm-password">Confirm password</label>
              <input
                id="auth-confirm-password"
                className="auth-input"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                maxLength={128}
                required
              />
            </div>
          )}

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError('')
            }}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>

        <div className="auth-divider">OR</div>

        <button className="auth-guest" type="button" onClick={onGuest}>
          Continue as a guest
        </button>

        <button className="auth-back" type="button" onClick={onHome}>
          ← Back to homepage
        </button>
      </div>
    </section>
  )
}

function App() {
  const [page, setPage] = useState<Page>('home')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Restore the user's session using the HttpOnly cookie.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          method: 'GET',
          credentials: 'include',
        })

        if (!response.ok) {
          setAuthUser(null)
          return
        }

        const data = await response.json()

        if (data.user) {
          setAuthUser(data.user as AuthUser)
        } else {
          setAuthUser(null)
        }
      } catch (error) {
        console.error('Could not restore StudyAI session:', error)
        setAuthUser(null)
      } finally {
        setAuthChecked(true)
      }
    }

    void restoreSession()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages, isLoading])

  useEffect(() => {
    if (page === 'chat') {
      inputRef.current?.focus()
    }
  }, [page])

  const handleAuthSuccess = (data: AuthResponse) => {
    setAuthUser(data.user)
    setPage('chat')
  }

  // Log out on the backend and clear the local interface.
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Could not contact the logout endpoint:', error)
    } finally {
      setAuthUser(null)
      setMessages([])
      setInput('')
      setPage('home')
    }
  }

  const sendMessage = async (text: string) => {
    const message = text.trim()

    if (!message || isLoading) return

    const updatedMessages: Message[] = [
      ...messages,
      { role: 'user', content: message },
    ]

    setPage('chat')
    setInput('')
    setMessages(updatedMessages)
    setIsLoading(true)

    try {
      const history = updatedMessages.slice(0, -1).map((item) => ({
        sender: item.role,
        text: item.content,
      }))

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message, history }),
      })

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`)
      }

      const data: ChatResponse = await response.json()
      const reply = data.reply || data.response || data.answer

      if (!reply || typeof reply !== 'string') {
        throw new Error('The backend returned an empty response.')
      }

      const followUps =
        Array.isArray(data.follow_up_questions)
          ? data.follow_up_questions
          : Array.isArray(data.followUps)
            ? data.followUps
            : []

      const assistantMessage: Message = {
        role: 'assistant',
        content: reply,
        followUps: followUps
          .filter(
            (question): question is string =>
              typeof question === 'string' && question.trim().length > 0,
          )
          .slice(0, 3),
      }

      setMessages((previous) => [...previous, assistantMessage])
    } catch (error) {
      console.error('StudyAI error:', error)

      let errorMessage =
        'I could not connect to StudyAI. Please check your backend and try again.'

      if (error instanceof TypeError) {
        errorMessage =
          'Unable to reach the StudyAI server. Make sure FastAPI is running at http://127.0.0.1:8000.'
      } else if (error instanceof Error && error.message.includes('Backend error')) {
        errorMessage =
          'The StudyAI server returned an error. Please check the backend terminal.'
      }

      setMessages((previous) => [
        ...previous,
        { role: 'assistant', content: errorMessage },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage(input)
  }

  const startNewConversation = () => {
    setMessages([])
    setInput('')
    inputRef.current?.focus()
  }

  const goHome = () => {
    setPage('home')
    setInput('')
  }

  if (!authChecked) {
    return (
      <main className="studyai-app">
        <div className="auth-page">
          <p>Preparing your StudyAI workspace...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="studyai-app">
      <header className="site-header">
        <button className="logo" onClick={goHome} aria-label="StudyAI home">
          <span className="logo-symbol">S</span>
          <span>
            study<span className="logo-highlight">ai</span>
          </span>
        </button>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#home" onClick={goHome}>Home</a>
          <a href="#features" onClick={goHome}>Features</a>
          <a href="#how-it-works" onClick={goHome}>How it works</a>
        </nav>

        <div className="header-actions">
          {authUser ? (
            <>
              <span className="header-text-button">
                Hi, {authUser.full_name.split(' ')[0]}
              </span>
              <button className="header-cta" onClick={() => void logout()}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="header-text-button"
                onClick={() => setPage('auth')}
              >
                Log in
              </button>
              <button
                className="header-cta"
                onClick={() => setPage('auth')}
              >
                Get started <span>↗</span>
              </button>
            </>
          )}
        </div>
      </header>

      {page === 'auth' ? (
        <AuthScreen
          onSuccess={handleAuthSuccess}
          onGuest={() => setPage('chat')}
          onHome={goHome}
        />
      ) : page === 'home' ? (
        <>
          <section className="hero-section" id="home">
            <div className="hero-grid">
              <div className="hero-copy">
                <div className="hero-eyebrow">
                  <span className="eyebrow-star">✦</span>
                  THE SMARTER WAY TO STUDY
                </div>

                <h1>
                  Make learning
                  <br />
                  <span>your superpower.</span>
                </h1>

                <p className="hero-description">
                  Meet your personal AI study companion. Understand complex
                  concepts, create better notes and prepare for exams with
                  confidence.
                </p>

                <div className="hero-buttons">
                  <button
                    className="primary-cta"
                    onClick={() => setPage('chat')}
                  >
                    Start learning <span>↗</span>
                  </button>
                  <a className="secondary-cta" href="#features">
                    Explore features <span>↓</span>
                  </a>
                </div>

                <div className="hero-note">
                  <span className="note-check">✓</span>
                  <span>Learn at your own pace. Ask, explore and understand.</span>
                </div>
              </div>

              <div className="hero-visual">
                <div className="visual-glow" />

                <div className="floating-label floating-label-top">
                  <span className="floating-label-icon purple">✦</span>
                  <span>
                    <strong>Personalised learning</strong>
                    <small>Made around your needs</small>
                  </span>
                </div>

                <div className="assistant-window">
                  <div className="window-header">
                    <div className="window-brand">
                      <span className="mini-logo">S</span>
                      <span>
                        <strong>StudyAI Assistant</strong>
                        <small>Your learning companion</small>
                      </span>
                    </div>
                    <span className="online-status"><i /> Online</span>
                  </div>

                  <div className="window-body">
                    <div className="assistant-welcome">
                      <span className="welcome-icon">✦</span>
                      <div>
                        <strong>Hello, learner!</strong>
                        <p>What would you like to understand today?</p>
                      </div>
                    </div>

                    <div className="sample-user-message">
                      Explain machine learning in simple words.
                    </div>

                    <div className="sample-ai-answer">
                      <div className="sample-answer-heading">
                        <span className="answer-logo">S</span>
                        <strong>StudyAI</strong>
                        <span>JUST NOW</span>
                      </div>
                      <p>
                        Machine learning helps computers learn patterns
                        from data and make predictions.
                      </p>
                      <div className="example-box">
                        <span>LET'S TAKE AN EXAMPLE</span>
                        Your email learns to recognise spam messages by
                        studying examples of unwanted emails.
                      </div>
                    </div>

                    <div className="sample-input">
                      <span>Ask a follow-up question...</span>
                      <span className="sample-send">↑</span>
                    </div>
                  </div>
                </div>

                <div className="floating-label floating-label-bottom">
                  <span className="floating-label-icon green">✓</span>
                  <span>
                    <strong>Understand with clarity</strong>
                    <small>One concept at a time</small>
                  </span>
                </div>
              </div>
            </div>

            <div className="hero-bottom-line">
              <span>BUILT FOR CURIOUS MINDS</span>
              <span className="bottom-line-decoration" />
              <span>LEARN SOMETHING NEW TODAY</span>
            </div>
          </section>

          <section className="features-section" id="features">
            <div className="section-intro">
              <span className="section-kicker">A BETTER WAY TO LEARN</span>
              <h2>
                Everything you need to
                <br />
                <span>learn with confidence.</span>
              </h2>
              <p>
                One learning space. Powerful AI tools. A simpler way to
                understand what matters.
              </p>
            </div>

            <div className="features-grid">
              {features.map((feature) => (
                <button
                  className="feature-card"
                  key={feature.number}
                  onClick={() => void sendMessage(feature.prompt)}
                >
                  <div className="feature-card-top">
                    <span className="feature-icon">{feature.icon}</span>
                    <span className="feature-number">{feature.number}</span>
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <span className="feature-link">
                    Try it now <span>↗</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="how-section" id="how-it-works">
            <div className="how-heading">
              <span className="section-kicker">GETTING STARTED IS EASY</span>
              <h2>
                Three steps. <span>Better learning.</span>
              </h2>
              <p>
                No complicated process. Just open StudyAI and start exploring.
              </p>
            </div>

            <div className="steps-grid">
              <div className="step-card">
                <span className="step-number">01</span>
                <span className="step-icon">✎</span>
                <h3>Ask your question</h3>
                <p>Choose a subject or ask about a topic you want to understand.</p>
              </div>
              <div className="step-card">
                <span className="step-number">02</span>
                <span className="step-icon">✦</span>
                <h3>Learn with AI</h3>
                <p>Get explanations, examples and guidance that make learning clearer.</p>
              </div>
              <div className="step-card">
                <span className="step-number">03</span>
                <span className="step-icon">↗</span>
                <h3>Grow your knowledge</h3>
                <p>Practise what you learn and build confidence one topic at a time.</p>
              </div>
            </div>
          </section>

          <section className="final-cta">
            <div className="final-cta-content">
              <span className="section-kicker light-kicker">
                YOUR NEXT CHAPTER STARTS HERE
              </span>
              <h2>Ready to make learning easier?</h2>
              <p>Bring your questions. We'll help you learn step by step.</p>
              <button
                className="final-cta-button"
                onClick={() => setPage('chat')}
              >
                Start learning with StudyAI <span>↗</span>
              </button>
            </div>
            <div className="cta-decoration decoration-one">✦</div>
            <div className="cta-decoration decoration-two">✧</div>
          </section>

          <footer className="site-footer">
            <button className="footer-logo" onClick={goHome}>
              <span className="logo-symbol">S</span>
              <span>
                study<span className="logo-highlight">ai</span>
              </span>
            </button>
            <span className="footer-message">
              A smarter space for curious minds.
            </span>
            <span className="footer-copyright">
              © 2026 StudyAI. Learn at your pace.
            </span>
          </footer>
        </>
      ) : (
        <section className="chat-page">
          <aside className="chat-sidebar">
            <button
              className="sidebar-new"
              onClick={startNewConversation}
              disabled={isLoading}
            >
              ＋ <span>New conversation</span>
            </button>

            <span className="sidebar-label">WORKSPACE</span>
            <div className="sidebar-current">
              <span>◈</span> Current conversation
            </div>

            {authUser && (
              <div className="sidebar-tip">
                <span>◉</span>
                <strong>{authUser.full_name}</strong>
                <p>{authUser.email}</p>
              </div>
            )}

            <div className="sidebar-tip">
              <span>✦</span>
              <strong>Keep exploring.</strong>
              <p>Every question is a chance to learn something new.</p>
            </div>

            <div className="sidebar-tip">
              <span>🔒</span>
              <strong>Learn safely.</strong>
              <p>
                Avoid sharing your name, phone number, passwords or private
                information.
              </p>
            </div>
          </aside>

          <div className="chat-main">
            <div className="chat-top">
              <div>
                <h2>AI Tutor</h2>
                <p>Your personal learning assistant</p>
              </div>
              <button className="back-home" onClick={goHome}>
                ← Home
              </button>
            </div>

            <div className="messages-area">
              {messages.length === 0 && (
                <div className="chat-empty">
                  <span className="empty-logo">S</span>
                  <h2>What are we learning today?</h2>
                  <p>
                    Ask an academic question. I'll guide you through it
                    step by step.
                  </p>

                  <div className="chat-quick-prompts">
                    {features.map((feature) => (
                      <button
                        key={feature.number}
                        onClick={() => void sendMessage(feature.prompt)}
                      >
                        <span>{feature.icon}</span>
                        {feature.title}
                        <b>↗</b>
                      </button>
                    ))}
                  </div>

                  <div className="studyai-safety-notice">
                    <span>ⓘ</span>
                    <p>
                      StudyAI is designed for education and study-related
                      questions only. It does not provide guidance about
                      drugs, weapons or harmful activities.
                    </p>
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  className={`message-row ${message.role}`}
                  key={`${message.role}-${index}`}
                >
                  {message.role === 'assistant' && (
                    <div className="message-mark">S</div>
                  )}

                  <div className="message-content">
                    {message.role === 'assistant' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      message.content
                    )}

                    {message.role === 'assistant' &&
                      index === messages.length - 1 && (
                        <div className="follow-up-area">
                          <p>Continue learning</p>
                          {(message.followUps?.length
                            ? message.followUps
                            : defaultFollowUps
                          ).map((question, questionIndex) => (
                            <button
                              className="follow-up-button"
                              key={questionIndex}
                              disabled={isLoading}
                              onClick={() => void sendMessage(question)}
                            >
                              {question} <span>↗</span>
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="message-row assistant">
                  <div className="message-mark">S</div>
                  <div className="typing-indicator">
                    <i />
                    <i />
                    <i />
                    <span>StudyAI is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="chat-composer-area">
              <form className="chat-composer" onSubmit={handleSubmit}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask an academic question..."
                  rows={1}
                  aria-label="Write your question"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      void sendMessage(input)
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                >
                  ↑
                </button>
              </form>
              <p>
                StudyAI is an educational tutor. Don't share private
                information. Verify important facts with your textbook.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
