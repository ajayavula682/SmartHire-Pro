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

const operationalMetrics = [
    { label: 'Active pipelines', value: '18', detail: '+4 this week' },
    { label: 'Avg time to shortlist', value: '3.8 days', detail: '-0.9 day trend' },
    { label: 'Security score', value: '97%', detail: 'Policy aligned' },
]

const platformModules = [
    'Identity and access control',
    'Candidate pipeline orchestration',
    'Interview scheduling and feedback',
    'Onboarding tracking and reporting',
]

const serviceChecks = [
    { name: 'API gateway', status: 'Healthy' },
    { name: 'Auth service', status: 'Ready' },
    { name: 'Database sync', status: 'Connected' },
]

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
            <div className="shell-glow shell-glow-left" aria-hidden="true" />
            <div className="shell-glow shell-glow-right" aria-hidden="true" />

            <header className="topbar">
                <div className="brand-block">
                    <div className="brand-mark" aria-hidden="true">
                        SH
                    </div>
                    <div>
                        <div className="brand">SmartHire Pro</div>
                        <div className="brand-subtitle">Enterprise recruitment operations</div>
                    </div>
                </div>

                <div className="topbar-meta">
                    <span className="status-pill status-pill-live">Platform online</span>
                    <span className="status-pill">API base: {API_BASE}</span>
                </div>
            </header>

            <main className="layout">
                <aside className="sidebar-card">
                    <p className="eyebrow">Command center</p>
                    <h2>Hiring operations at enterprise scale.</h2>
                    <p className="lead">
                        Structured access, audit-friendly workflows, and a single control surface for
                        recruiters, HR, and administrators.
                    </p>

                    <div className="metrics-grid">
                        {operationalMetrics.map((metric) => (
                            <article className="metric-card" key={metric.label}>
                                <span className="metric-label">{metric.label}</span>
                                <strong>{metric.value}</strong>
                                <span>{metric.detail}</span>
                            </article>
                        ))}
                    </div>

                    <div className="module-card">
                        <h3>Platform modules</h3>
                        <ul>
                            {platformModules.map((module) => (
                                <li key={module}>{module}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="checks-card">
                        <h3>Live service status</h3>
                        <div className="checks-list">
                            {serviceChecks.map((check) => (
                                <div className="check-row" key={check.name}>
                                    <span>{check.name}</span>
                                    <strong>{check.status}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <section className="content-grid">
                    <section className="hero-panel">
                        <div className="hero-copy">
                            <p className="eyebrow">AI Recruitment Platform</p>
                            <h1>Manage hiring with the discipline of an internal enterprise product.</h1>
                            <p className="lead">
                                This interface is designed to feel like an operations dashboard: clear
                                hierarchy, dense information, strong contrast, and quick access to the
                                authentication flow powering the backend.
                            </p>

                            <div className="feature-strip">
                                <div>
                                    <span>Security</span>
                                    <strong>JWT and role-based access</strong>
                                </div>
                                <div>
                                    <span>Reliability</span>
                                    <strong>Backend-ready API controls</strong>
                                </div>
                                <div>
                                    <span>Workflow</span>
                                    <strong>Register or sign in instantly</strong>
                                </div>
                            </div>
                        </div>

                        <div className="activity-panel">
                            <div className="activity-header">
                                <div>
                                    <span className="activity-label">Operational feed</span>
                                    <h3>Recent system signals</h3>
                                </div>
                                <span className="activity-badge">Real time</span>
                            </div>

                            <div className="activity-list">
                                <div className="activity-row">
                                    <span>Authentication gateway</span>
                                    <strong>Healthy</strong>
                                </div>
                                <div className="activity-row">
                                    <span>Candidate intake</span>
                                    <strong>Ready</strong>
                                </div>
                                <div className="activity-row">
                                    <span>Interview workflow</span>
                                    <strong>Pending auth</strong>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="auth-panel">
                        <div className="auth-card">
                            <div className="auth-header">
                                <div>
                                    <p className="eyebrow">Identity access</p>
                                    <h3>{mode === 'login' ? 'Sign in to continue' : 'Create an account'}</h3>
                                </div>
                                <div className="auth-scope">Protected workspace</div>
                            </div>

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
                                        Token saved to localStorage as <span>smarthire_token</span>.
                                    </p>
                                )}

                                <button className="primary" type="submit" disabled={loading}>
                                    {loading ? 'Working...' : mode === 'login' ? 'Sign in' : 'Register'}
                                </button>
                            </form>
                        </div>

                        <div className="helper enterprise-note">
                            <h4>Next API calls</h4>
                            <p>
                                Attach the token as <code>Authorization: Bearer &lt;token&gt;</code> to
                                reach protected routes like <code>/candidates</code> or <code>/jobs</code>.
                            </p>
                        </div>
                    </section>
                </section>
            </main>
        </div>
    )
}

export default App
