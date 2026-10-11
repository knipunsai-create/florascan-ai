
import { useState } from 'react'
import {
  auth,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from './firebase'
import './Login.css'

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignup) {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        )

        if (name.trim()) {
          await updateProfile(credential.user, {
            displayName: name.trim(),
          })
        }
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password)
      }
    } catch (err) {
      setError(
        err.code === 'auth/email-already-in-use'
          ? 'This email already has an account. Please sign in.'
          : err.code === 'auth/invalid-credential'
            ? 'Email or password is incorrect.'
            : err.code === 'auth/weak-password'
              ? 'Choose a password with at least 6 characters.'
              : err.code === 'auth/invalid-email'
                ? 'Please enter a valid email address.'
                : err.message || 'Authentication failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError('')
    setLoading(true)

    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      setError(err.message || 'Google sign-in failed.')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError('Enter your email first, then click Forgot password.')
      return
    }

    setError('')

    try {
      await sendPasswordResetEmail(auth, email.trim())
      setError('Password reset email sent. Check your inbox.')
    } catch (err) {
      setError(err.message || 'Could not send password reset email.')
    }
  }

  return (
    <main className="login-page">
      <div className="botanical-glow glow-one" />
      <div className="botanical-glow glow-two" />

      <div className="floating-leaf leaf-one">🌿</div>
      <div className="floating-leaf leaf-two">🍃</div>
      <div className="floating-leaf leaf-three">🌱</div>
      <div className="floating-leaf leaf-four">🍃</div>

      <section className="login-card">
        <div className="login-brand">
          <span className="brand-icon">🌿</span>
          <span>FloraScan AI</span>
        </div>

        <p className="login-eyebrow">SMART PLANT CARE</p>

        <h1>{isSignup ? 'Join the garden.' : 'Welcome '}</h1>

        <p className="login-subtitle">
          {isSignup
            ? 'Create an account and keep your plants thriving.'
            : 'Your plants deserve a healthier tomorrow.'}
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          {isSignup && (
            <label className="login-field">
              <span>Your name</span>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </label>
          )}

          <label className="login-field">
            <span>Email address</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength={6}
              required
            />
          </label>

          {!isSignup && (
            <button
              type="button"
              className="forgot-password"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          )}

          {error && <p className="login-error" role="alert">{error}</p>}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isSignup
                ? 'CREATE ACCOUNT'
                : 'SIGN IN'}
          </button>
        </form>

        <div className="login-divider">
          <span>or continue with</span>
        </div>

        <button
          type="button"
          className="google-login"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <span className="google-letter">G</span>
          Continue with Google
        </button>

        <p className="login-switch">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup)
              setError('')
            }}
          >
            {isSignup ? 'Sign in' : 'Create account'}
          </button>
        </p>

        <p className="login-disclaimer">
          🌱 Growing healthier plants, one scan at a time.
        </p>
      </section>
    </main>
  )
}
