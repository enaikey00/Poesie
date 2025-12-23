'use client'

import { useAuth } from './AuthContext'
import { useTheme } from './ThemeContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import CupIcon from './components/CupIcon'
import BookIcon from './components/BookIcon'
import MagicIcon from './components/MagicIcon'
import CalendarIcon from './components/CalendarIcon'
import EyeIcon from './components/EyeIcon'
import LockIcon from './components/LockIcon'
import KeyIcon from './components/KeyIcon'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const { theme } = useTheme()
  const [poesie, setPoesie] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    fetchUltimePoesie()
  }, [])

  const fetchUltimePoesie = async () => {
    try {
      const { data, error } = await supabase
        .from('poesie')
        .select('*')
        .order('data_poesia', { ascending: false })
        .limit(5)

      if (error) throw error
      setPoesie(data || [])
    } catch (error) {
      console.error('Errore nel caricamento delle poesie:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return <div>Caricamento...</div>
  }

  const containerClass = theme === 'dark' 
    ? 'nes-container is-rounded is-dark' 
    : 'nes-container is-rounded'
  
  const textColor = theme === 'dark' ? '#fff' : '#212529'

  return (
    <main>
      <h1 style={{ color: textColor, textAlign: 'center'}}>Poesie in condivisione <CupIcon size={20} /></h1>
      
      {/* Container di benvenuto */}
      <div className={containerClass}       
      style={{
        marginTop: '2rem', marginBottom: '3.5rem',
        borderColor: theme === 'dark' ? '#2d3339' : 'whitesmoke',
        }}>
        <p>Benvenuto nel sito delle poesie in condivisione.</p>
        <p style={{marginTop: '1rem'}}>
          {user 
            ? 'Qui potrai leggere e condividere le tue poesie.' 
            : 'Qui puoi leggere le anteprime delle ultime poesie e fare il login per iniziare a condividere le tue.'
          }
        </p>
        
        {!user && (
          <div style={{marginTop: '2rem'}}>
            <Link href="/login" className="nes-btn is-primary">
              Inizia ora!
            </Link>
          </div>
        )}
        
        {user && (
          <div style={{marginTop: '2rem'}}>
            <Link href="/nuova" className="nes-btn is-success">
              <MagicIcon size={20} />
              Scrivi una poesia
            </Link>
            <Link href="/poesie" className="nes-btn" style={{marginLeft: '1rem'}}>
              <BookIcon size={20} />
              Vedi tutte le poesie
            </Link>
          </div>
        )}
      </div>

      {/* Sezione ultime poesie */}
      <div style={{marginTop: '3rem'}}>
        <h2 style={{ color: textColor, marginBottom: '1.5rem'}}>
          ✨ Ultime Poesie Pubblicate
        </h2>

        {loading ? (
          <div className={containerClass} style={{textAlign: 'center'}}>
            <p>Caricamento poesie...</p>
          </div>
        ) : poesie.length === 0 ? (
          <div className={containerClass} style={{textAlign: 'center'}}>
            <p>Nessuna poesia ancora pubblicata.</p>
            {user && (
              <Link href="/nuova" className="nes-btn is-success" style={{marginTop: '1rem'}}>
                <MagicIcon size={20} />
                Sii il primo a pubblicare!
              </Link>
            )}
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {poesie.map((poesia) => {
                const CardContent = (
                  <div 
                    className={`${containerClass} poesia-card theme-${theme}`}
                    style={{
                      height: '100%',
                      cursor: user ? 'pointer' : 'not-allowed',
                      opacity: user ? 1 : 0.8,
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
                      lineHeight: '1.4',
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
                      <span><CalendarIcon size={20} /> {poesia.data_poesia ? new Date(poesia.data_poesia).toLocaleDateString('it-IT') : '---'}</span>
                      <span>{user ? <><EyeIcon size={20} /> Leggi tutto</> : <><LockIcon size={20} /> Login richiesto</>}</span>
                    </div>
                  </div>
                )

                return user ? (
                  <Link 
                    key={poesia.id} 
                    href={`/poesie/${poesia.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    {CardContent}
                  </Link>
                ) : (
                  <div key={poesia.id}>
                    {CardContent}
                  </div>
                )
              })}
            </div>

            {/* Messaggio e bottone */}
            <div style={{marginTop: '2rem', textAlign: 'center'}}>
              

              <div>
                {user ? (
                  <Link href="/poesie" className="nes-btn is-primary">
                    <BookIcon size={20} />
                    Vedi tutte le poesie
                  </Link>
                ) : (
                  <div style={{position: 'relative', display: 'inline-block'}}>
                    <div
                      className="nes-btn"
                      style={{cursor: 'not-allowed', opacity: 0.5, display: 'inline-block'}}
                      onMouseEnter={() => {
                        console.log('Mouse ENTRA - showTooltip diventa TRUE')
                        setShowTooltip(true)
                      }}
                      onMouseLeave={() => {
                        console.log('Mouse ESCE - showTooltip diventa FALSE')
                        setShowTooltip(false)
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        console.log('CLICK - showTooltip diventa TRUE per 3 secondi')
                        setShowTooltip(true)
                        setTimeout(() => {
                          console.log('TIMEOUT - showTooltip diventa FALSE')
                          setShowTooltip(false)
                        }, 3000)
                      }}
                      title="Devi fare login!"
                    >
                      <BookIcon size={20} />
                      Vedi tutte le poesie
                    </div>
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: '110%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: theme === 'dark' ? '#212529' : '#fff',
                        color: theme === 'dark' ? '#fff' : '#212529',
                        border: '4px solid',
                        borderColor: theme === 'dark' ? '#fff' : '#212529',
                        padding: '0.5rem 1rem',
                        whiteSpace: 'nowrap',
                        fontSize: '0.8rem',
                        zIndex: 1000,
                        pointerEvents: 'none',
                        opacity: showTooltip ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out',
                        visibility: showTooltip ? 'visible' : 'hidden',
                      }}
                    >
                      <KeyIcon size={20} />
                      Devi fare login!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}