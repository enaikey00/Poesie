'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../AuthContext'
import { useTheme } from '../../ThemeContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DettaglioPoesia() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { theme } = useTheme()
  
  const [poesia, setPoesia] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  
  // Stati per la modifica
  const [editTitolo, setEditTitolo] = useState('')
  const [editContenuto, setEditContenuto] = useState('')
  const [editDataPoesia, setEditDataPoesia] = useState('')

  // Protezione: reindirizza al login se non autenticato
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    if (user && params.id) {
      fetchPoesia()
    }
  }, [params.id, user])

  // Non mostrare niente mentre controlla l'autenticazione
  if (!user) { return <div>Reindirizzamento al login... </div> }

  const fetchPoesia = async () => {
    try {
      const { data, error } = await supabase
        .from('poesie')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setPoesia(data)
      setEditTitolo(data.titolo)
      setEditContenuto(data.contenuto)
      setEditDataPoesia(data.data_poesia)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('poesie')
        .update({
          titolo: editTitolo,
          contenuto: editContenuto,
          data_poesia: editDataPoesia,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)

      if (error) throw error

      alert('Poesia aggiornata con successo! ✨')
      setIsEditing(false)
      fetchPoesia()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Sei sicuro di voler cancellare questa poesia? ⚠️')) {
      return
    }

    try {
      const { error } = await supabase
        .from('poesie')
        .delete()
        .eq('id', params.id)

      if (error) throw error

      alert('Poesia cancellata 🗑️')
      router.push('/poesie')
    } catch (error) {
      setError(error.message)
    }
  }

  const textColor = theme === 'dark' ? '#fff' : '#212529'
  const containerClass = theme === 'dark' 
    ? 'nes-container is-rounded is-dark' 
    : 'nes-container is-rounded'

  if (loading) {
    return (
      <main>
        <h1 style={{ color: textColor }}>Caricamento...</h1>
      </main>
    )
  }

  if (error || !poesia) {
    return (
      <main>
        <h1 style={{ color: textColor }}>Errore</h1>
        <div className="nes-container is-rounded is-error" style={{marginTop: '2rem'}}>
          <p>{error || 'Poesia non trovata'}</p>
          <Link href="/poesie" className="nes-btn" style={{marginTop: '1rem'}}>
            ← Torna alle poesie
          </Link>
        </div>
      </main>
    )
  }

  const isAuthor = user && user.id === poesia.user_id

  return (
    <main>
      {!isEditing ? (
        // MODALITÀ VISUALIZZAZIONE
        <>
          <div style={{marginBottom: '1rem'}}>
            <Link href="/poesie" className="nes-btn">
              ← Tutte le poesie
            </Link>
          </div>

          <h1 style={{ color: textColor }}>{poesia.titolo}</h1>
          
          <div className={containerClass} style={{marginTop: '2rem'}}>
            <div style={{marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '2px solid', borderColor: theme === 'dark' ? '#fff' : '#212529'}}>
              <p style={{fontSize: '0.8rem'}}>
                📝 <strong>Autore:</strong> {poesia.autore}
              </p>
              <p style={{fontSize: '0.8rem', marginTop: '0.5rem'}}>
                📅 <strong>Data:</strong> {new Date(poesia.data_poesia).toLocaleDateString('it-IT', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <p style={{fontSize: '0.7rem', marginTop: '0.5rem', opacity: 0.6}}>
                Pubblicato il {new Date(poesia.created_at).toLocaleDateString('it-IT')}
              </p>
            </div>

            <div style={{
              whiteSpace: 'pre-wrap',
              lineHeight: '1.8',
              fontSize: '0.9rem',
              padding: '1rem 0'
            }}>
              {poesia.contenuto}
            </div>
          </div>

          {isAuthor && (
            <div style={{marginTop: '2rem', display: 'flex', gap: '1rem'}}>
              <button 
                onClick={() => setIsEditing(true)}
                className="nes-btn is-warning"
              >
                ✏️ Modifica
              </button>
              <button 
                onClick={handleDelete}
                className="nes-btn is-error"
              >
                🗑️ Cancella
              </button>
            </div>
          )}
        </>
      ) : (
        // MODALITÀ MODIFICA
        <>
          <h1 style={{ color: textColor }}>✏️ Modifica Poesia</h1>
          
          <div className={containerClass} style={{marginTop: '2rem', maxWidth: '800px'}}>
            <form onSubmit={handleUpdate}>
              
              <div className="nes-field" style={{marginBottom: '2rem'}}>
                <label htmlFor="titolo" style={{marginBottom: '0.5rem', display: 'block'}}>
                  Titolo:
                </label>
                <input
                  type="text"
                  id="titolo"
                  className={theme === 'dark' ? 'nes-input is-dark' : 'nes-input'}
                  value={editTitolo}
                  onChange={(e) => setEditTitolo(e.target.value)}
                  required
                />
              </div>

              <div className="nes-field" style={{marginBottom: '2rem'}}>
                <label htmlFor="data_poesia" style={{marginBottom: '0.5rem', display: 'block'}}>
                  Data della poesia:
                </label>
                <input
                  type="date"
                  id="data_poesia"
                  className={theme === 'dark' ? 'nes-input is-dark' : 'nes-input'}
                  value={editDataPoesia}
                  onChange={(e) => setEditDataPoesia(e.target.value)}
                  required
                />
              </div>

              <div className="nes-field" style={{marginBottom: '2rem'}}>
                <label htmlFor="contenuto" style={{marginBottom: '0.5rem', display: 'block'}}>
                  Contenuto:
                </label>
                <textarea
                  id="contenuto"
                  className={theme === 'dark' ? 'nes-textarea is-dark' : 'nes-textarea'}
                  value={editContenuto}
                  onChange={(e) => setEditContenuto(e.target.value)}
                  rows="10"
                  required
                  style={{minHeight: '300px'}}
                />
              </div>

              <div style={{display: 'flex', gap: '1rem'}}>
                <button 
                  type="submit" 
                  className="nes-btn is-success"
                  disabled={loading}
                >
                  {loading ? 'Salvataggio...' : '💾 Salva'}
                </button>

                <button 
                  type="button"
                  className="nes-btn"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  ❌ Annulla
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </main>
  )
}