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
        <div className="page">
            <header className="topbar">
                <div className="brand">
                    <span className="brand-dot" aria-hidden="true" />
                    SmartHire Pro
                </div>
                <span className="topbar-note">Local dev starter · {API_BASE}</span>
            </header>

            <main className="layout">
                <section className="panel panel-left">
                    <p className="eyebrow">AI Recruitment Platform</p>
                    <h1>Hire faster with structured pipelines and secure access.</h1>
                    <p className="lead">
                        This frontend is wired to the backend auth endpoints. Register a new
                        recruiter or sign in to begin. Tokens are stored locally for later
                        API calls.
                    </p>
                    <div className="feature-grid">
                        <div>
                            <h3>Role-aware access</h3>
                            <p>ADMIN, HR, and RECRUITER permissions enforced by the API.</p>
                        </div>
                        <div>
                            <h3>JWT secured</h3>
                            <p>Tokens are returned on login and saved in local storage.</p>
                        </div>
                        <div>
                            <h3>API ready</h3>
                            <p>Use the stored token to call /candidates, /jobs, and more.</p>
                        </div>
                    </div>
                </section>

                <section className="panel panel-right">
                    <div className="card">
                        <div className="tabs" role="tablist" aria-label="Auth tabs">
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
                                Create account
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
                                        placeholder="Avery Singh"
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
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="HR">HR</option>
                                        <option value="RECRUITER">RECRUITER</option>
                                    </select>
                                </label>
                            )}

                            {error && <p className="alert error">{error}</p>}
                            {success && <p className="alert success">{success}</p>}
                            {token && (
                                <p className="token">
                                    Token saved to localStorage as{' '}
                                    <span>smarthire_token</span>.
                                </p>
                            )}

                            <button className="primary" type="submit" disabled={loading}>
                                {loading ? 'Working...' : mode === 'login' ? 'Sign in' : 'Register'}
                            </button>
                        </form>
                    </div>

                    <div className="helper">
                        <h4>Next API calls</h4>
                        <p>
                            Attach the token as{' '}
                            <code>Authorization: Bearer &lt;token&gt;</code> to reach protected
                            routes like <code>/candidates</code> or <code>/jobs</code>.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default App
