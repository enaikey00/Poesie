'use client'

import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isSignUp) {
      // Registrazione
      const { error } = await signUp(email, password, nome)
      if (error) {
        setError(error.message)
      } else {
        alert('Registrazione completata! Ora puoi fare login.')
        setIsSignUp(false)
      }
    } else {
      // Login
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        router.push('/')
      }
    }
    
    setLoading(false)
  }

  return (
    <main>
      <h1>{isSignUp ? 'Registrati' : 'Login'}</h1>
      
      <div className="nes-container is-rounded is-dark" style={{marginTop: '2rem', maxWidth: '500px'}}>
        <form onSubmit={handleSubmit}>
          
          {isSignUp && (
            <div className="nes-field" style={{marginBottom: '1rem'}}>
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="nome"
                className="nes-input is-dark"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
          )}

          <div className="nes-field" style={{marginBottom: '1rem'}}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className="nes-input is-dark"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="nes-field" style={{marginBottom: '1rem'}}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className="nes-input is-dark"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="nes-text is-error" style={{marginBottom: '1rem'}}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className={`nes-btn ${isSignUp ? 'is-success' : 'is-primary'}`}
            disabled={loading}
          >
            {loading ? 'Caricamento...' : (isSignUp ? 'Registrati' : 'Entra')}
          </button>

          <button 
            type="button"
            className="nes-btn"
            style={{marginLeft: '1rem'}}
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Hai già un account?' : 'Crea account'}
          </button>
        </form>
      </div>
    </main>
  )
}