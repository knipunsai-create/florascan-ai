
import { useEffect, useState } from 'react'
import './App.css'
import Login from './Login'
import { auth, onAuthStateChanged, signOut } from './firebase'

const API_URL = 'https://florascan-ai-api.onrender.com/predict'

const diseaseGuides = {
  'Pepper__bell___Bacterial_spot': {
    title: 'Pepper Bacterial Spot',
    symptoms: 'Small dark or water-soaked spots that may develop yellow edges.',
    treatment: 'Remove badly affected leaves when practical. Ask a local agricultural expert about suitable, approved bacterial-spot treatments.',
    prevention: 'Avoid overhead watering, disinfect tools, and avoid handling wet plants.',
    recovery: 'Monitor new growth, maintain good airflow, and check nearby pepper plants.',
  },
  'Pepper__bell___healthy': {
    title: 'Healthy Pepper Leaf',
    symptoms: 'Leaves generally have an even green colour without obvious disease spots.',
    treatment: 'No disease treatment is indicated by this prediction. Continue normal plant care.',
    prevention: 'Provide suitable sunlight, watering, nutrition, and airflow.',
    recovery: 'Continue monitoring new leaves for unusual spots or discolouration.',
  },
  'Potato__Early_blight': {
    title: 'Potato Early Blight',
    symptoms: 'Brown spots, sometimes with concentric rings, often on older leaves.',
    treatment: 'Remove severely affected foliage when appropriate. Confirm the diagnosis before using a locally approved fungicide.',
    prevention: 'Rotate crops, avoid wetting foliage, and remove infected plant debris.',
    recovery: 'Monitor new growth and check whether spots continue to spread.',
  },
  'Potato__Late_blight': {
    title: 'Potato Late Blight',
    symptoms: 'Dark, spreading patches that may look water-soaked; white growth can appear in humid conditions.',
    treatment: 'Act promptly. Isolate affected plants where practical and seek local agricultural advice to confirm the disease and appropriate control.',
    prevention: 'Avoid prolonged leaf wetness and inspect nearby potato and tomato plants.',
    recovery: 'Check plants frequently for rapidly expanding lesions. Do not eat diseased plant parts.',
  },
  'Potato__healthy': {
    title: 'Healthy Potato Leaf',
    symptoms: 'No obvious disease pattern is indicated by the model.',
    treatment: 'No disease treatment is indicated by this prediction.',
    prevention: 'Use healthy planting material, rotate crops, and water appropriately.',
    recovery: 'Continue routine monitoring for new spots or yellowing.',
  },
  'Tomato_Bacterial_spot': {
    title: 'Tomato Bacterial Spot',
    symptoms: 'Small dark leaf spots that can develop yellow margins; fruit may also show spots.',
    treatment: 'Remove badly affected foliage when practical and consult a local agricultural expert about approved control options.',
    prevention: 'Avoid overhead watering, clean tools, and avoid working with wet plants.',
    recovery: 'Monitor new leaves and nearby plants for spreading symptoms.',
  },
  'Tomato_Early_blight': {
    title: 'Tomato Early Blight',
    symptoms: 'Brown leaf spots that may develop concentric rings, often beginning on older leaves.',
    treatment: 'Remove severely affected lower leaves where practical. Confirm the diagnosis before applying an approved fungicide.',
    prevention: 'Mulch around plants, rotate crops, and keep foliage dry when possible.',
    recovery: 'Check whether new leaves remain healthy and whether spots continue spreading.',
  },
  'Tomato_Late_blight': {
    title: 'Tomato Late Blight',
    symptoms: 'Dark, rapidly expanding patches that may look water-soaked, especially in humid weather.',
    treatment: 'Seek prompt local agricultural advice because this disease can spread quickly. Confirm before selecting a treatment.',
    prevention: 'Avoid prolonged leaf wetness and inspect nearby tomato and potato plants.',
    recovery: 'Inspect plants frequently and remove affected material according to local guidance.',
  },
  'Tomato_Leaf_Mold': {
    title: 'Tomato Leaf Mold',
    symptoms: 'Yellowish patches on upper leaf surfaces and olive or greyish growth underneath in humid conditions.',
    treatment: 'Improve ventilation and remove severely affected leaves where practical. Confirm the diagnosis before treatment.',
    prevention: 'Reduce humidity around foliage, space plants appropriately, and avoid overhead watering.',
    recovery: 'Monitor new leaves and maintain better airflow.',
  },
  'Tomato_Septoria_leaf_spot': {
    title: 'Tomato Septoria Leaf Spot',
    symptoms: 'Numerous small round spots with pale centres and darker edges, often on lower leaves.',
    treatment: 'Remove badly affected lower leaves when practical. Seek advice before using an approved fungicide.',
    prevention: 'Mulch to reduce soil splash, rotate crops, and keep foliage dry.',
    recovery: 'Monitor new growth and remove fallen infected leaves.',
  },
  'Tomato_Spider_mites_Two_spotted_spider_mite': {
    title: 'Tomato Spider Mites',
    symptoms: 'Fine pale stippling, yellowing, and sometimes delicate webbing on leaves.',
    treatment: 'Inspect the undersides of leaves. If mites are confirmed, ask a local expert about suitable controls and protect beneficial insects.',
    prevention: 'Monitor plants regularly and avoid conditions that encourage mite outbreaks.',
    recovery: 'Recheck leaf undersides and new growth for continuing mite activity.',
  },
  'Tomato__Target_Spot': {
    title: 'Tomato Target Spot',
    symptoms: 'Brown circular spots that may develop target-like rings.',
    treatment: 'Remove severely affected foliage when practical and confirm the diagnosis before applying any approved fungicide.',
    prevention: 'Improve airflow, avoid overhead watering, and remove infected plant debris.',
    recovery: 'Monitor new growth for fresh lesions.',
  },
  'Tomato__Tomato_YellowLeaf__Curl_Virus': {
    title: 'Tomato Yellow Leaf Curl Virus',
    symptoms: 'Yellowing, upward curling leaves, and stunted growth may occur.',
    treatment: 'There is no direct cure for an infected plant. Seek local advice on managing infected plants and whitefly vectors.',
    prevention: 'Use healthy seedlings, manage whiteflies appropriately, and control weeds that may host pests.',
    recovery: 'Monitor new growth and nearby plants; confirm the diagnosis with an expert.',
  },
  'Tomato__Tomato_mosaic_virus': {
    title: 'Tomato Mosaic Virus',
    symptoms: 'Mottled light and dark green areas, leaf distortion, or stunted growth.',
    treatment: 'There is no direct cure for an infected plant. Seek local advice about removing confirmed infected plants.',
    prevention: 'Wash hands, disinfect tools, and avoid handling plants after touching potentially infected material.',
    recovery: 'Monitor neighbouring plants and maintain strict tool hygiene.',
  },
  'Tomato_healthy': {
    title: 'Healthy Tomato Leaf',
    symptoms: 'No obvious disease pattern is indicated by the model.',
    treatment: 'No disease treatment is indicated by this prediction.',
    prevention: 'Provide suitable sunlight, consistent watering, nutrients, and airflow.',
    recovery: 'Continue monitoring for spots, unusual yellowing, or leaf curling.',
  },
}

function App() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState(undefined)

  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('florascan-history') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return unsubscribe
  }, [])

  async function handleLogout() {
    try {
      await signOut(auth)
      setFile(null)
      setPreview('')
      setResult(null)
      setError('')
    } catch {
      setError('Could not sign out. Please try again.')
    }
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function handleFileChange(event) {
    const selected = event.target.files?.[0]
    event.target.value = ''

    if (!selected) return

    setResult(null)
    setError('')

    if (!selected.type.startsWith('image/')) {
      setFile(null)
      setPreview('')
      setError('Please select a valid image file.')
      return
    }

    if (selected.size > 10 * 1024 * 1024) {
      setFile(null)
      setPreview('')
      setError('Please choose an image smaller than 10 MB.')
      return
    }

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  async function predictDisease() {
    if (!file) {
      setError('Please take a photo or choose a plant leaf image first.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          typeof data.detail === 'string'
            ? data.detail
            : 'Prediction failed. Please try another image.'
        )
      }

      const rawConfidence = Number(data.confidence)
      const confidence = Number.isFinite(rawConfidence)
        ? Math.min(100, Math.max(0, rawConfidence))
        : null

      const newResult = {
        disease: data.predicted_class || 'Unknown condition',
        confidence,
      }

      setResult(newResult)

      const historyItem = {
        id: Date.now(),
        disease: newResult.disease,
        confidence: newResult.confidence,
        date: new Date().toLocaleString(),
      }

      setHistory((previous) => {
        const updated = [historyItem, ...previous].slice(0, 20)

        try {
          localStorage.setItem('florascan-history', JSON.stringify(updated))
        } catch {
          setError('Scan completed, but history could not be saved.')
        }

        return updated
      })
    } catch (err) {
      setError(
        err.message?.includes('Failed to fetch')
          ? 'Could not connect to the prediction server. Wait a minute and try again.'
          : err.message || 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const guide = result
    ? diseaseGuides[result.disease] || {
        title: result.disease.replaceAll('_', ' '),
        symptoms:
          'The model selected this class. Compare the plant with reliable disease references.',
        treatment:
          'Do not apply treatment based on the prediction alone. Confirm the disease with a qualified local agricultural expert.',
        prevention:
          'Use good plant hygiene, appropriate watering, and regular monitoring.',
        recovery:
          'Monitor new growth and seek expert advice if symptoms persist or worsen.',
      }
    : null

  if (user === undefined) {
    return <div className="auth-loading">Loading FloraScan AI...</div>
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#">
          <span className="brand-icon">✿</span>
          <span>
            FloraScan <b>AI</b>
          </span>
        </a>

        <div className="navbar-actions">
          <span className="status">
            <i /> AI Plant Health Assistant
          </span>
          <span className="user-email">{user.email}</span>
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="eyebrow">🌱 SMART PLANT CARE, MADE SIMPLE</div>
          <h1>
            Healthy plants
            <br />
            start with <span>one scan.</span>
          </h1>
          <p>
            Take a photo or upload a leaf image to explore possible plant
            diseases and practical care guidance.
          </p>
        </section>

        <section className="workspace">
          <div className="upload-card">
            <div className="section-heading">
              <span className="step">01</span>
              <div>
                <h2>Scan your plant</h2>
                <p>Use your camera or choose an existing photo.</p>
              </div>
            </div>

            <div className="dropzone">
              {preview ? (
                <img
                  className="preview"
                  src={preview}
                  alt="Selected plant leaf preview"
                />
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">🌿</span>
                  <strong>Your plant photo goes here</strong>
                  <span>Take a clear, well-lit photo of a leaf.</span>
                </div>
              )}

              <div className="camera-actions">
                <label htmlFor="camera-upload" className="camera-button">
                  📷 Open Camera
                </label>
                <input
                  id="camera-upload"
                  className="hidden-file-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                />

                <label htmlFor="gallery-upload" className="gallery-button">
                  🖼️ Choose from Gallery
                </label>
                <input
                  id="gallery-upload"
                  className="hidden-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {file && <p className="filename">Selected: {file.name}</p>}

            <button
              className="scan-button"
              onClick={predictDisease}
              disabled={!file || loading}
            >
              {loading ? 'Analyzing image…' : '✦ Analyze plant'}
            </button>

            <p className="disclaimer">
              Educational guidance only. Results are not a confirmed diagnosis.
            </p>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}
          </div>

          <div className="result-card">
            <div className="section-heading">
              <span className="step">02</span>
              <div>
                <h2>Scan results</h2>
                <p>Your prediction and care guide appear here.</p>
              </div>
            </div>

            {loading ? (
              <div className="empty-state">
                <span className="loader" />
                <p>Analyzing your image…</p>
                <small>The server may take a moment to wake up.</small>
              </div>
            ) : result && guide ? (
              <div className="result-content">
                <div className="result-symbol">🔎</div>
                <span className="result-label">MODEL PREDICTION</span>
                <h3>{guide.title}</h3>

                <p className="confidence">
                  Reported confidence:{' '}
                  {result.confidence === null
                    ? 'Not provided'
                    : `${result.confidence.toFixed(1)}%`}
                </p>

                <div className="care-box">
                  <strong>Possible symptoms</strong>
                  <p>{guide.symptoms}</p>
                </div>

                <div className="care-box">
                  <strong>Suggested treatment / next steps</strong>
                  <p>{guide.treatment}</p>
                </div>

                <div className="care-box">
                  <strong>Prevention</strong>
                  <p>{guide.prevention}</p>
                </div>

                <div className="care-box">
                  <strong>Recovery checklist</strong>
                  <p>{guide.recovery}</p>
                </div>

                <p className="warning">
                  This AI prediction can be incorrect. A high confidence score
                  does not guarantee a correct diagnosis. Confirm serious plant
                  problems with a qualified agricultural expert.
                </p>
              </div>
            ) : (
              <div className="empty-state">
                <div className="leaf-illustration">♧</div>
                <p>Your plant health report awaits</p>
                <small>
                  Take a photo or choose an image, then select Analyze plant.
                </small>
              </div>
            )}
          </div>
        </section>

        <section className="tips">
          <div>
            <span>☀</span>
            <h3>Good lighting</h3>
            <p>Take photos in natural, even light.</p>
          </div>
          <div>
            <span>◉</span>
            <h3>Focus on the leaf</h3>
            <p>Keep the leaf sharp and clearly visible.</p>
          </div>
          <div>
            <span>♧</span>
            <h3>Check carefully</h3>
            <p>Compare the result with real symptoms.</p>
          </div>
        </section>

        <section className="history-section">
          <div className="section-heading">
            <span className="step">03</span>
            <div>
              <h2>Recent scans</h2>
              <p>Your last 20 scans saved in this browser.</p>
            </div>
          </div>

          {history.length === 0 ? (
            <p className="history-empty">Your scan history will appear here.</p>
          ) : (
            <ul className="history-list">
              {history.map((item) => (
                <li key={item.id} className="history-item">
                  <div>
                    <strong>
                      {diseaseGuides[item.disease]?.title ||
                        item.disease.replaceAll('_', ' ')}
                    </strong>
                    <small>{item.date}</small>
                  </div>
                  <span>
                    {item.confidence === null
                      ? 'Confidence unavailable'
                      : `${item.confidence.toFixed(1)}% confidence`}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {history.length > 0 && (
            <button
              type="button"
              className="clear-history-button"
              onClick={() => {
                setHistory([])
                try {
                  localStorage.removeItem('florascan-history')
                } catch {
                  setError('Could not clear saved history.')
                }
              }}
            >
              Clear scan history
            </button>
          )}
        </section>
      </main>

      <footer>
        FloraScan AI · Plant health insights for a greener tomorrow 🌱
      </footer>
    </div>
  )
}

export default App
