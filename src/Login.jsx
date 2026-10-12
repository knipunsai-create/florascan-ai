import { useState } from 'react'
import {
  sendEmailVerification,
} from 'firebase/auth'
import {
  auth,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
} from './firebase'
import './Login.css'

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setNotice('')
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

        await sendEmailVerification(credential.user)
        await signOut(auth)

        setIsSignup(false)
        setPassword('')
        setNotice(
          'Account created! Check your email and click the verification link before signing in. Check your spam folder too.'
        )
      } else {
        const credential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        )

        if (!credential.user.emailVerified) {
          await signOut(auth)
          setError(
            'Please verify your email before signing in. Open the verification link sent to your inbox.'
          )
        }
      }
    } catch (err) {
      setError(
        err.code === 'auth/email-already-in-use'
          ? 'This email already has an account. Please sign in.'
          : err.code === 'auth/invalid-credential'
            ? 'Email or password is incorrect.'
            : err.code === 'auth/weak-password'
              ? 'Your password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.'
              : err.code === 'auth/invalid-email'
                ? 'Please enter a valid email address.'
                : err.code === 'auth/too-many-requests'
                  ? 'Too many attempts. Please wait and try again later.'
                  : 'Authentication failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError('')
    setNotice('')
    setLoading(true)

    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      setError(
        err.code === 'auth/popup-closed-by-user'
          ? 'Google sign-in was cancelled.'
          : 'Google sign-in failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    setError('')
    setNotice('')

    if (!email.trim()) {
      setError('Enter your email first, then click Forgot password.')
      return
    }

    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email.trim())
      setNotice(
        'If an account exists for that email, a password reset message will be sent. Check your inbox and spam folder.'
      )
    } catch (err) {
      setError(
        err.code === 'auth/invalid-email'
          ? 'Please enter a valid email address.'
          : 'Could not send the reset email. Please try again later.'
      )
    } finally {
      setLoading(false)
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
                maxLength={80}
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
              maxLength={254}
              required
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={
                isSignup
                  ? '8+ characters with mixed character types'
                  : 'Enter your password'
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength={isSignup ? 8 : 1}
              pattern={
                isSignup
                  ? '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}'
                  : undefined
              }
              title={
                isSignup
                  ? 'Use at least 8 characters with uppercase, lowercase, a number, and a special character.'
                  : undefined
              }
              required
            />
          </label>

          <button
            type="button"
            className="forgot-password"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide password' : 'Show password'}
          </button>

          {!isSignup && (
            <button
              type="button"
              className="forgot-password"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              Forgot password?
            </button>
          )}

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          {notice && (
            <p className="login-notice" role="status">
              {notice}
            </p>
          )}

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
          {isSignup
            ? 'Already have an account?'
            : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignup((current) => !current)
              setError('')
              setNotice('')
              setPassword('')
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
