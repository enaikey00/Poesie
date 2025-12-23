'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '../ThemeContext'
import { useAuth } from '../AuthContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Icons
import CalendarIcon from '../components/CalendarIcon'
import EyeIcon from '../components/EyeIcon'
import BookIcon from '../components/BookIcon'
import MagicIcon from '../components/MagicIcon'
import { CgArrowUpR, CgArrowDownR } from "react-icons/cg"

export default function Poesie() {
  const { theme } = useTheme()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [poesie, setPoesie] = useState([])
  const [poesieFiltrate, setPoesieFiltrate] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Stati per i filtri
  const [autori, setAutori] = useState([])
  const [autoreSelezionato, setAutoreSelezionato] = useState('')
  const [ordinamentoData, setOrdinamentoData] = useState('desc') // desc = recente, asc = vecchia

  // Protezione: reindirizza al login se non autenticato
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchPoesie()
    }
  }, [user])

  // Applica filtri quando cambiano
  useEffect(() => {
    applicaFiltri()
  }, [poesie, autoreSelezionato, ordinamentoData])

  const fetchPoesie = async () => {
    try {
      const { data, error } = await supabase
        .from('poesie')
        .select('*')

      if (error) throw error
      setPoesie(data || [])
      
      // Estrai lista autori unici
      const autoriUnici = [...new Set(data.map(p => p.autore))].sort()
      setAutori(autoriUnici)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const applicaFiltri = () => {
    let risultato = [...poesie]

    // Filtro per autore
    if (autoreSelezionato) {
      risultato = risultato.filter(p => p.autore === autoreSelezionato)
    }

    // Ordinamento per data
    risultato.sort((a, b) => {
      // Poesie senza data vanno sempre in fondo
      if (!a.data_poesia) return 1
      if (!b.data_poesia) return -1
      
      const dateA = new Date(a.data_poesia)
      const dateB = new Date(b.data_poesia)
      
      return ordinamentoData === 'desc' 
        ? dateB - dateA  // Più recente prima
        : dateA - dateB  // Più vecchia prima
    })

    setPoesieFiltrate(risultato)
  }

  const toggleOrdinamentoData = () => {
    setOrdinamentoData(prev => prev === 'desc' ? 'asc' : 'desc')
  }

  // Non mostrare niente mentre controlla l'autenticazione
  if (authLoading || !user) {
    return <div>Caricamento...</div>
  }

  const textColor = theme === 'dark' ? '#fff' : '#212529'
  const containerClass = theme === 'dark' 
    ? 'nes-container is-rounded is-dark' 
    : 'nes-container is-rounded'

  if (loading) {
    return (
      <main>
        <h1 style={{ color: textColor, textAlign: 'center' }}>  
          <BookIcon size={45} style={{ verticalAlign: 'top', marginRight: '1rem' }} /> 
          Tutte le Poesie
        </h1>        
        <div className={containerClass} style={{marginTop: '2rem', textAlign: 'center'}}>
          <p>Caricamento poesie...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <h1 style={{ color: textColor, textAlign: 'center' }}>  
          <BookIcon size={45} style={{ verticalAlign: 'top', marginRight: '1rem' }} /> 
          Tutte le Poesie
        </h1>        
        <div className="nes-container is-rounded is-error" style={{marginTop: '2rem'}}>
          <p>Errore: {error}</p>
        </div>
      </main>
    )
  }

  return (
    <main>
      <h1 style={{ color: textColor, textAlign: 'center' }}>
        <BookIcon size={45} style={{ verticalAlign: 'middle', marginRight: '1rem', marginBottom: '1rem'}} /> 
        Tutte le Poesie
      </h1>
      
      {poesie.length === 0 ? (
        <div className={containerClass} style={{marginTop: '2rem', textAlign: 'center'}}>
          <p>Nessuna poesia ancora pubblicata.</p>
          <p style={{marginTop: '1rem'}}>Sii il primo a condividere!</p>
          <Link href="/nuova" className="nes-btn is-success" style={{marginTop: '1rem'}}>
            <MagicIcon size={20} style={{ marginRight: '0.5rem' }}/>
            Scrivi la prima poesia
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
          
          {/* Sidebar autori - Desktop/Tablet */}
          <aside className="autori-sidebar" style={{
            minWidth: '200px',
            maxWidth: '250px',
          }}>
            <div className={containerClass} style={{borderColor: theme === 'dark' ? '#2d3339' : 'whitesmoke'}}>
              <h3 style={{ margin: '0.2rem 0.2rem 0.5rem 0', fontSize: '0.9rem', fontFamily:'Borel'}}>Autori</h3>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                margin: 0,
              }}>
                <li 
                  onClick={() => setAutoreSelezionato('')}
                  style={{
                    padding: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: !autoreSelezionato 
                      ? (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
                      : 'transparent',
                    marginBottom: '0.3rem',
                    fontSize: '0.8rem',
                    borderLeft: !autoreSelezionato ? '3px solid' : '3px solid transparent',
                    borderColor: !autoreSelezionato ? (theme === 'dark' ? '#fff' : '#212529') : 'transparent',
                  }}
                >
                  Tutti gli autori
                </li>
                {autori.map(autore => (
                  <li
                    key={autore}
                    onClick={() => setAutoreSelezionato(autore)}
                    style={{
                      padding: '0.5rem',
                      cursor: 'pointer',
                      backgroundColor: autoreSelezionato === autore 
                        ? (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
                        : 'transparent',
                      marginBottom: '0.3rem',
                      fontSize: '0.8rem',
                      borderLeft: autoreSelezionato === autore ? '3px solid' : '3px solid transparent',
                      borderColor: autoreSelezionato === autore ? (theme === 'dark' ? '#fff' : '#212529') : 'transparent',
                      transition: 'all 0.2s',
                      fontFamily: 'Borel',
                    }}
                    onMouseEnter={(e) => {
                      if (autoreSelezionato !== autore) {
                        e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (autoreSelezionato !== autore) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }
                    }}
                  >
                    {autore}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Contenuto principale */}
          <div style={{ flex: 1 }}>
            
            {/* Filtro autori - Mobile (dropdown) */}
            <div className="autori-mobile" style={{ marginBottom: '1rem' }}>
              <div className="nes-field">
                <label htmlFor="autore-mobile" style={{fontSize: '0.8rem', marginBottom: '0.5rem', display: 'block'}}>
                  👥 Autore:
                </label>
                <div className="nes-select" style={theme === 'dark' ? {backgroundColor: '#212529'} : {}}>
                  <select
                    id="autore-mobile"
                    value={autoreSelezionato}
                    onChange={(e) => setAutoreSelezionato(e.target.value)}
                    style={{color: textColor}}
                  >
                    <option value="">Tutti gli autori</option>
                    {autori.map(autore => (
                      <option key={autore} value={autore}>{autore}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Header con conteggio e ordinamento */}
            {poesieFiltrate.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <p style={{ color: textColor, margin: 0 }}>
                  {poesieFiltrate.length} {poesieFiltrate.length === 1 ? 'poesia trovata' : 'poesie trovate'}
                </p>
                
                <button 
                  onClick={toggleOrdinamentoData}
                  className="nes-btn is-primary"
                  style={{ fontSize: '1.2rem', marginRight: '0.7rem', fontWeight: 'bold' }}
                >
                  Data {ordinamentoData === 'desc' ? <CgArrowDownR/> : <CgArrowUpR/>}
                </button>
              </div>
            )}

            {/* Risultati */}
            {poesieFiltrate.length === 0 ? (
              <div className={containerClass} style={{textAlign: 'center', borderColor: theme === 'dark' ? '#2d3339' : 'whitesmoke'}}>
                <p>Nessuna poesia trovata{autoreSelezionato ? ` di ${autoreSelezionato}` : ''}.</p>
                {autoreSelezionato && (
                  <button 
                    onClick={() => setAutoreSelezionato('')}
                    className="nes-btn is-primary"
                    style={{marginTop: '1rem', fontSize: '0.8rem'}}
                  >
                    Mostra tutti
                  </button>
                )}
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {poesieFiltrate.map((poesia) => (
                  <Link 
                    key={poesia.id} 
                    href={`/poesie/${poesia.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div 
                      className={`${containerClass} poesia-card theme-${theme}`}
                      style={{
                        height: '100%',
                        cursor: 'pointer',
                        borderColor: theme === 'dark' ? '#2d3339' : 'whitesmoke',
                      }}
                    >
                      <h3 style={{marginBottom: '0.5rem'}}>
                        {poesia.titolo || ''}
                      </h3>
                      
                      <p style={{fontSize: '1rem', opacity: 0.7, marginBottom: '1rem'}}>
                        di <span style={{fontFamily: 'Borel'}} >{poesia.autore}</span>
                      </p>
                      
                      <p style={{
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        marginBottom: '1rem',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        {poesia.contenuto}
                      </p>
                      
                      <div className="poesia-card-footer">
                        <span><CalendarIcon size={20} />  {poesia.data_poesia ? new Date(poesia.data_poesia).toLocaleDateString('it-IT') : '---'}</span>
                        <span><EyeIcon size={20} /> Leggi tutto</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}