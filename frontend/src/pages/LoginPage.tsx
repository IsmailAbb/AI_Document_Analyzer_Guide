import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api/auth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      const fn = isRegister ? register : login
      const res = await fn(email, password)
      localStorage.setItem('token', res.data.token)
      toast.success(isRegister ? 'Account created!' : 'Welcome back!')
      navigate('/dashboard')
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Something went wrong'
        toast.error(message)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24 }}>
      <h1>AI Document Analyzer</h1>
      <h2>{isRegister ? 'Create Account' : 'Login'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }}
      />
      <button onClick={handleSubmit} style={{ width: '100%', padding: 10 }}>
        {isRegister ? 'Register' : 'Login'}
      </button>
      <p style={{ marginTop: 12, textAlign: 'center' }}>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span
          onClick={() => setIsRegister(!isRegister)}
          style={{ color: 'blue', cursor: 'pointer' }}
        >
          {isRegister ? 'Login' : 'Register'}
        </span>
      </p>
    </div>
  )
}