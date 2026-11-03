
import { useState } from 'react'
import './App.css'

function App() {
const [message, setMessage] = useState('')
const [loading, setLoading] = useState(false)

const [messages, setMessages] = useState<
{ text: string; sender: string }[]

> ([])

const sendMessage = async () => {
if (!message.trim() || loading) return


const userMessage = message

setMessages((previousMessages) => [
  ...previousMessages,
  { text: userMessage, sender: 'user' },
])

setMessage('')
setLoading(true)

try {
  const response = await fetch('http://127.0.0.1:8000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: userMessage,
    }),
  })

  if (!response.ok) {
    throw new Error('Backend connection failed')
  }

  const data = await response.json()

  setMessages((previousMessages) => [
    ...previousMessages,
    { text: data.reply, sender: 'ai' },
  ])
} catch (error) {
  console.error('Error:', error)

  setMessages((previousMessages) => [
    ...previousMessages,
    {
      text: 'Sorry! Unable to connect to StudyAI. Please check your backend.',
      sender: 'ai',
    },
  ])
} finally {
  setLoading(false)
}


}

return ( <div className="app-container"> <aside className="sidebar"> <h2>🎓 StudyAI</h2>


    <button className="new-chat" onClick={() => setMessages([])}>
      + New Chat
    </button>

    <div className="sidebar-menu">
      <p>📚 Subjects</p>
      <p>📝 My Notes</p>
      <p>🧠 Generate Quiz</p>
      <p>📄 Upload PDF</p>
      <p>🕘 Chat History</p>
    </div>

    <div className="sidebar-bottom">
      <p>⚙️ Settings</p>
      <p>👤 My Profile</p>
    </div>
  </aside>

  <main className="main-content">
    <header className="topbar">
      <h3>AI Study Assistant</h3>
      <span>🟢 Online</span>
    </header>

    <section className="chat-area">
      {messages.length === 0 ? (
        <div className="welcome">
          <h1>Welcome to StudyAI 👋</h1>
          <h2>Your personal AI learning assistant.</h2>
          <p>What would you like to learn today?</p>

          <div className="suggestions">
            <button onClick={() => setMessage('Explain Python basics')}>
              💻 Learn Python
            </button>

            <button onClick={() => setMessage('Generate study notes')}>
              📝 Generate Notes
            </button>

            <button onClick={() => setMessage('Create a quiz for me')}>
              🧠 Generate Quiz
            </button>

            <button onClick={() => setMessage('Explain cloud computing')}>
              ☁️ Cloud Computing
            </button>
          </div>
        </div>
      ) : (
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={'message ' + msg.sender}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="message ai">
              StudyAI is thinking...
            </div>
          )}
        </div>
      )}
    </section>

    <div className="input-container">
      <input
        type="text"
        placeholder="Ask anything about your studies..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            sendMessage()
          }
        }}
      />

      <button onClick={sendMessage} disabled={loading}>
        ➤
      </button>
    </div>

    <footer>
      StudyAI • Your smart learning companion
    </footer>
  </main>
</div>


)
}

export default App
