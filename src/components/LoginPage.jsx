import { useState } from 'react'
import Tri from './Tri'
import { login } from '../lib/auth'

export default function LoginPage({ members = [], onSuccess, onCancel }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const handleQuickSelect = (accountUsername, defaultPassword = 'magang2026') => {
    setUsername(accountUsername)
    setPassword(defaultPassword)
    setError('')
  }

  const submit = (event) => {
    event.preventDefault()
    const result = login(username, password, members)
    if (result.success) {
      setError('')
      onSuccess(result.session)
      return
    }
    setError(result.error || 'Username atau password salah.')
    setPassword('')
  }

  return (
    <section
      className="hero fixed inset-0 z-[100] overflow-auto bg-canvas"
      aria-label="Login anggota magang dan admin"
    >
      <div className="hero-lines pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-full w-full max-w-[1280px] flex-col px-5 py-6">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="wide flex items-center gap-2.5 text-[19px]">
            <span className="grid h-[34px] w-[34px] shrink-0 place-items-center bg-brand">
              <Tri />
            </span>
            <span className="hidden min-[560px]:inline">THE FINALS // PKL SQUAD</span>
          </div>
          <button className="btn btn-g" type="button" onClick={onCancel}>
            ← Kembali ke arena
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="my-auto grid items-center gap-10 py-12 lg:grid-cols-12">
          {/* Left Column: Info & Quick Demo Select */}
          <div className="lg:col-span-7">
            <div className="mb-5 inline-flex items-center gap-2.5 border border-brand/40 bg-brand/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.04em] text-brand">
              <Tri size={14} />
              Portal Kegiatan // Anggota Magang &amp; Admin
            </div>
            <h1 className="disp text-[clamp(44px,7vw,88px)]">
              Portal
              <span className="block text-brand">magang.</span>
            </h1>
            <p className="mt-4 max-w-[54ch] text-[17px] text-zinc-300">
              Setiap anggota magang dapat masuk untuk mengelola, menambah, dan mengubah
              isi dari kegiatan magang harian serta featured project mereka.
            </p>

            {/* Quick Demo Login selector */}
            <div className="mt-8">
              <div className="mb-3 font-mono text-xs uppercase tracking-[0.05em] text-muted">
                ⚡ Pilih Cepat Akun (Demo Login):
              </div>
              <div className="flex flex-wrap gap-2">
                {members.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleQuickSelect(m.id, 'magang2026')}
                    className="inline-flex items-center gap-2 border border-line bg-panel px-3 py-2 text-left font-mono text-xs transition-colors hover:border-brand hover:bg-[#1a1c23]"
                    style={{ borderLeftColor: m.aura, borderLeftWidth: 3 }}
                  >
                    <span className="font-semibold text-white">{m.name}</span>
                    <span className="text-[11px] text-muted">({m.role})</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleQuickSelect('admin', 'pkl2026')}
                  className="inline-flex items-center gap-2 border border-brand/60 bg-brand/10 px-3 py-2 text-left font-mono text-xs text-brand transition-colors hover:bg-brand/20"
                >
                  <span className="font-semibold">Super Admin</span>
                  <span className="text-[11px] text-zinc-400">(Semua Anggota)</span>
                </button>
              </div>
            </div>

            {/* Credentials Info Badges */}
            <div className="mt-7 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.04em] text-muted">
              <span className="border border-line bg-panel px-2.5 py-1.5">
                Pass default anggota // <strong className="text-zinc-200">magang2026</strong>
              </span>
              <span className="border border-line bg-panel px-2.5 py-1.5">
                Pass admin // <strong className="text-zinc-200">pkl2026</strong>
              </span>
              <span className="border border-line bg-panel px-2.5 py-1.5">
                Data // localStorage
              </span>
            </div>
          </div>

          {/* Right Column: Login Form */}
          <div className="lg:col-span-5">
            <form className="panel border-t-4 border-t-brand" onSubmit={submit}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="disp text-[30px] text-white">Login akun</h2>
                  <p className="font-mono text-xs text-muted">
                    Masuk ke dashboard kegiatan magang
                  </p>
                </div>
                <span className="dot" aria-hidden="true" />
              </div>

              <label className="field">
                Username / Nama Anggota
                <input
                  className="input"
                  autoComplete="username"
                  autoCapitalize="none"
                  autoFocus
                  required
                  placeholder="contoh: ahmad, abimanyu, atau admin"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value)
                    setError('')
                  }}
                />
              </label>

              <label className="field mt-3.5">
                Password
                <span className="relative block">
                  <input
                    className="input pr-16"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setError('')
                    }}
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.04em] text-muted transition-colors hover:text-brand"
                    type="button"
                    onClick={() => setShowPass((value) => !value)}
                    aria-label={showPass ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showPass ? 'Sembunyikan' : 'Lihat'}
                  </button>
                </span>
              </label>

              <div className="mt-3 min-h-4 font-mono text-xs text-alert" role="alert">
                {error}
              </div>

              <button className="btn btn-y mt-2 w-full" type="submit">
                Masuk ke Dashboard Kegiatan →
              </button>

              <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted">
                Anggota magang dapat mengedit profil, mengganti password, serta menambah
                dan memperbarui seluruh kegiatan magang di dalam dashboard.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
