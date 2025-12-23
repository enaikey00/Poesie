'use client'

import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { useTheme } from '../ThemeContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import MagicIcon from '../components/MagicIcon.js'
import RocketIcon from '../components/RocketIcon.js'

export default function NuovaPoesia() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()
  
  const [titolo, setTitolo] = useState('')
  const [contenuto, setContenuto] = useState('')
  //const [dataPoesia, setDataPoesia] = useState(new Date().toISOString().split('T')[0]) // Data di oggi come default
  const [dataPoesia, setDataPoesia] = useState('')
  const [usaData, setUsaData] = useState(false) // date checkbox
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Se non è loggato, reindirizza al login
  if (!user) {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('poesie')
        .insert([
          {
            titolo: titolo.trim() || null,  // Se vuoto, salva null
            contenuto: contenuto,
            autore: user.user_metadata?.nome || user.email,
            user_id: user.id,
            data_poesia: dataPoesia || null
          }
        ])
        .select()

      if (error) throw error

      // Successo! Reindirizza alla lista poesie
      alert('Poesia pubblicata con successo! 🎉')
      router.push('/poesie')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const textColor = theme === 'dark' ? '#fff' : '#212529'
  const containerClass = theme === 'dark' 
    ? 'nes-container is-rounded is-dark' 
    : 'nes-container is-rounded'

  return (
    <main>
      <h1 style={{ color: textColor }}>
        <MagicIcon size={45} style={{verticalAlign: 'middle'}}/> 
        Scrivi una nuova poesia
      </h1>
      
      <div className={containerClass} style={{marginTop: '2rem', maxWidth: '800px'}}>
        <form onSubmit={handleSubmit}>
          
          <div className="nes-field" style={{marginBottom: '2rem'}}>
            <label htmlFor="titolo" style={{marginBottom: '0.5rem', display: 'block'}}>
              Titolo:
            </label>
            <input
              type="text"
              id="titolo"
              className={theme === 'dark' ? 'nes-input is-dark' : 'nes-input'}
              value={titolo}
              onChange={(e) => setTitolo(e.target.value)}
              placeholder="Opzionale"
            />
          </div>

          <div className={'nes-field'} 
          style={{marginBottom: '2rem'}}>
            <label>
              <input 
                type="checkbox" 
                className={theme === 'light' ? 'nes-checkbox' : 'nes-checkbox is-dark'}
                checked={usaData}
                onChange={(e) => {
                  setUsaData(e.target.checked)
                  if (!e.target.checked) {
                    setDataPoesia('') // Resetta la data se deseleziona
                  }
                }}
              />
              <span>Vuoi specificare la data della poesia?</span>
            </label>
            
            {usaData && (
              <div style={{marginTop: '1rem'}}>
                <label htmlFor="data_poesia" style={{marginBottom: '0.5rem', display: 'block'}}>
                  Data della poesia:
                </label>
                <input
                  type="date"
                  id="data_poesia"
                  className={theme === 'dark' ? 'nes-input is-dark' : 'nes-input'}
                  value={dataPoesia}
                  onChange={(e) => setDataPoesia(e.target.value)}
                />
                <p style={{fontSize: '1rem', marginTop: '0.5rem', opacity: 0.7}}>
                  (La data in cui hai scritto la poesia)
                </p>
              </div>
            )}
          </div>

          <div className="nes-field" style={{marginBottom: '2rem'}}>
            <label htmlFor="contenuto" style={{marginBottom: '0.5rem', display: 'block'}}>
              Contenuto:
            </label>
            <textarea
              id="contenuto"
              className={theme === 'dark' ? 'nes-textarea is-dark' : 'nes-textarea'}
              value={contenuto}
              onChange={(e) => setContenuto(e.target.value)}
              placeholder="Scrivi qui la tua poesia..."
              rows="10"
              required
              style={{minHeight: '300px', fontSize: '1.2rem'}}
            />
          </div>

          {error && (
            <div className="nes-text is-error" style={{marginBottom: '1rem'}}>
              Errore: {error}
            </div>
          )}

          <div style={{display: 'flex', gap: '1rem'}}>
            <button 
              type="submit" 
              className="nes-btn is-success"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RocketIcon size={25} style={{ marginRight: '0.3rem' }} />
                  Pubblicazione...
                </>
              ) : (
                <>
                  <RocketIcon size={25} style={{ marginRight: '0.3rem' }} />
                  Pubblica
                </>
              )}
            </button>

            <button 
              type="button"
              className="nes-btn"
              onClick={() => router.push('/')}
              disabled={loading}
            >
              ❌ Annulla
            </button>
          </div>
        </form>
      </div>

      <div className={containerClass} style={{marginTop: '2rem', maxWidth: '800px'}}>
        <h3 style={{marginBottom: '1rem'}}>💡 Suggerimenti:</h3>
        <ul style={{lineHeight: '1.5', marginLeft: '1rem'}}>
          <li>Scrivi con il cuore</li>
          <li>Non ci sono regole nella poesia!</li>
          <li>Puoi modificare o cancellare le tue poesie dopo averle pubblicate</li>
        </ul>
      </div>
    </main>
  )
}