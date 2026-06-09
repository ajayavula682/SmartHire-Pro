import { useMemo, useState } from 'react'
import './App.css'

type AuthResponse = {
    token: string
    tokenType: string
    email: string
    name: string
    role: string
}

type ApiResponse<T> = {
    success: boolean
    message: string
    data: T | null
}

const API_BASE =
    (import.meta as { env: Record<string, string | undefined> }).env
        .VITE_API_BASE ?? 'http://localhost:8080/api'

function App() {
    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [token, setToken] = useState<string | null>(null)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('RECRUITER')

    const payload = useMemo(() => {
        if (mode === 'login') {
            return { email, password }
        }

        return { name, email, password, role }
    }, [email, mode, name, password, role])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const response = await fetch(`${API_BASE}/auth/${mode}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const data = (await response.json()) as ApiResponse<AuthResponse | string>

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Request failed')
            }

            if (mode === 'login' && data.data && typeof data.data === 'object') {
                const auth = data.data as AuthResponse
                localStorage.setItem('smarthire_token', auth.token)
                setToken(auth.token)
                setSuccess(`Welcome back, ${auth.name}. You are signed in as ${auth.role}.`)
            } else {
                setSuccess('Registration completed. You can now sign in.')
                setMode('login')
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unexpected error'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="landing-page" aria-label="Smart Hire Pro landing page">
            <section className="auth-shell">
                <p className="eyebrow">Smart Hire Pro</p>
                <h1>Sign in to continue</h1>

                <div className="tabs" role="tablist" aria-label="Authentication mode">
                    <button
                        type="button"
                        className={mode === 'login' ? 'tab active' : 'tab'}
                        onClick={() => setMode('login')}
                        role="tab"
                        aria-selected={mode === 'login'}
                    >
                        Sign in
                    </button>
                    <button
                        type="button"
                        className={mode === 'register' ? 'tab active' : 'tab'}
                        onClick={() => setMode('register')}
                        role="tab"
                        aria-selected={mode === 'register'}
                    >
                        Sign up
                    </button>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <label className="field">
                            Full name
                            <input
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Your name"
                                required
                            />
                        </label>
                    )}

                    <label className="field">
                        Email address
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@smarthire.io"
                            required
                        />
                    </label>

                    <label className="field">
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Minimum 8 characters"
                            minLength={8}
                            required
                        />
                    </label>

                    {mode === 'register' && (
                        <label className="field">
                            Role
                            <select value={role} onChange={(event) => setRole(event.target.value)}>
                                <option value="RECRUITER">Recruiter</option>
                                <option value="ADMIN">Admin</option>
                                <option value="HR_MANAGER">HR Manager</option>
                                <option value="INTERVIEWER">Interviewer</option>
                            </select>
                        </label>
                    )}

                    <button type="submit" className="primary" disabled={loading}>
                        {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Sign up'}
                    </button>

                    {error && <p className="alert error">{error}</p>}
                    {success && <p className="alert success">{success}</p>}
                    {token && (
                        <p className="token">
                            Session token stored locally: <span>{token.slice(0, 24)}…</span>
                        </p>
                    )}
                </form>
            </section>
        </main>
    )
}

export default App
