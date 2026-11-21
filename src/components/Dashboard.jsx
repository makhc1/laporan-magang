import { useEffect, useMemo, useRef, useState } from 'react'
import { BUILD, monthOf } from '../data/seed'
import { byDate, fmtDate, pad, STATUS_COLORS } from '../lib/utils'
import Tri from './Tri'
import Mockup from './Mockup'
import Photo from './Photo'

const HAIR = ['buzz', 'spike', 'side', 'curly', 'cap']
const SKIN = ['#d9a07a', '#c68b64', '#e3b48f', '#b9805b', '#e0ac86']

const JOURNAL_DEFAULTS = {
  date: '2026-08-03',
  category: 'Pengembangan',
  title: '',
  desc: '',
  photo: 'none',
  status: 'Selesai',
}

const PROJECT_DEFAULTS = {
  title: '',
  metric: '',
  mock: 'web',
  desc: '',
  tags: '',
}

function JournalForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(() =>
    editing
      ? {
          date: editing.date,
          category: editing.category,
          title: editing.title,
          desc: editing.desc,
          photo: editing.photo || 'none',
          status: editing.status,
        }
      : JOURNAL_DEFAULTS,
  )

  useEffect(() => {
    if (editing) {
      setForm({
        date: editing.date,
        category: editing.category,
        title: editing.title,
        desc: editing.desc,
        photo: editing.photo || 'none',
        status: editing.status,
      })
    }
  }, [editing])

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }))

  return (
    <form
      id="journal-form"
      className={`panel transition-all ${
        editing ? 'border-2 border-brand bg-[#1c1b12]' : 'border-t-4 border-t-brand'
      }`}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(form)
      }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div>
          <h3 className="disp flex items-center gap-2 text-[22px] text-white">
            <span
              className={`h-2.5 w-2.5 ${editing ? 'bg-brand' : 'bg-crimson'}`}
              aria-hidden="true"
            />
            {editing ? 'Ganti / Edit Isi Kegiatan' : 'Tambah Kegiatan Magang Baru'}
          </h3>
          <p className="font-mono text-xs text-muted">
            {editing
              ? `Mengubah detail kegiatan: "${editing.title}"`
              : 'Catat aktivitas, progress, atau pencapaian magang harian'}
          </p>
        </div>
        {editing ? (
          <button className="btn btn-g text-xs" type="button" onClick={onCancel}>
            Batal Ubah
          </button>
        ) : null}
      </div>

      <div className="grid gap-3.5 min-[760px]:grid-cols-2">
        <label className="field">
          Tanggal Kegiatan
          <input className="input" type="date" required value={form.date} onChange={set('date')} />
        </label>
        <label className="field">
          Kategori Kegiatan
          <input
            className="input"
            list="cats"
            required
            placeholder="contoh: Pengembangan"
            value={form.category}
            onChange={set('category')}
          />
          <datalist id="cats">
            <option>Orientasi</option>
            <option>Analisis</option>
            <option>Perancangan</option>
            <option>Pengembangan</option>
            <option>Pengujian</option>
            <option>Deployment</option>
            <option>Dokumentasi</option>
            <option>Survei</option>
            <option>Konfigurasi</option>
          </datalist>
        </label>
        <label className="field min-[760px]:col-span-2">
          Judul Kegiatan Magang
          <input
            className="input"
            required
            placeholder="contoh: Membangun backend autentikasi dan validasi formulir"
            value={form.title}
            onChange={set('title')}
          />
        </label>
        <label className="field min-[760px]:col-span-2">
          Deskripsi Isi Kegiatan
          <textarea
            className="input min-h-[110px] resize-y"
            required
            placeholder="Jelaskan apa yang dikerjakan, kendala yang dihadapi, dan hasil pekerjaan..."
            value={form.desc}
            onChange={set('desc')}
          />
        </label>
        <label className="field">
          Dokumentasi Visual / Foto
          <select className="input" value={form.photo} onChange={set('photo')}>
            <option value="none">Tanpa foto</option>
            <option value="coding">Sesi pengembangan / coding</option>
            <option value="server">Ruang server &amp; jaringan</option>
            <option value="meeting">Rapat &amp; diskusi tim</option>
            <option value="survey">Survei lapangan</option>
          </select>
        </label>
        <label className="field">
          Status Kegiatan
          <select className="input" value={form.status} onChange={set('status')}>
            <option>Selesai</option>
            <option>Berjalan</option>
            <option>Revisi</option>
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <button className="btn btn-y" type="submit">
          {editing ? 'Simpan Perubahan Kegiatan' : '+ Tambah ke Jurnal Kegiatan'}
        </button>
        {editing ? (
          <button className="btn btn-g" type="button" onClick={onCancel}>
            Batal
          </button>
        ) : null}
      </div>
    </form>
  )
}

function ProjectForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(() =>
    editing
      ? {
          title: editing.title,
          metric: editing.metric,
          mock: editing.mock || 'web',
          desc: editing.desc,
          tags: (editing.tags || []).join(', '),
        }
      : PROJECT_DEFAULTS,
  )

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        metric: editing.metric,
        mock: editing.mock || 'web',
        desc: editing.desc,
        tags: (editing.tags || []).join(', '),
      })
    }
  }, [editing])

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }))

  return (
    <form
      id="project-form"
      className={`panel transition-all ${
        editing ? 'border-2 border-brand bg-[#1c1b12]' : 'border-t-4 border-t-brand'
      }`}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(form)
      }}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div>
          <h3 className="disp flex items-center gap-2 text-[22px] text-white">
            <span
              className={`h-2.5 w-2.5 ${editing ? 'bg-brand' : 'bg-crimson'}`}
              aria-hidden="true"
            />
            {editing ? 'Ganti / Edit Isi Project' : 'Tambah Featured Project Baru'}
          </h3>
          <p className="font-mono text-xs text-muted">
            {editing
              ? `Mengubah project: "${editing.title}"`
              : 'Tambahkan project utama atau portofolio output magang'}
          </p>
        </div>
        {editing ? (
          <button className="btn btn-g text-xs" type="button" onClick={onCancel}>
            Batal Ubah
          </button>
        ) : null}
      </div>

      <div className="grid gap-3.5 min-[760px]:grid-cols-2">
        <label className="field min-[760px]:col-span-2">
          Judul Project
          <input
            className="input"
            required
            placeholder="contoh: Portal Layanan Publik Online"
            value={form.title}
            onChange={set('title')}
          />
        </label>
        <label className="field">
          Badge Metric / Hasil
          <input
            className="input"
            required
            placeholder="contoh: 12 Halaman / 100% Selesai"
            value={form.metric}
            onChange={set('metric')}
          />
        </label>
        <label className="field">
          Tipe Visual Mockup
          <select className="input" value={form.mock} onChange={set('mock')}>
            <option value="web">Browser web</option>
            <option value="lan">Topologi LAN</option>
            <option value="archive">Database e-arsip</option>
            <option value="dashboard">Dashboard sistem</option>
          </select>
        </label>
        <label className="field min-[760px]:col-span-2">
          Deskripsi Project
          <textarea
            className="input min-h-[110px] resize-y"
            required
            placeholder="Jelaskan fitur, tujuan, dan kontribusi project ini..."
            value={form.desc}
            onChange={set('desc')}
          />
        </label>
        <label className="field min-[760px]:col-span-2">
          Tech Stack / Alat yang Digunakan (pisahkan dengan koma)
          <input
            className="input"
            placeholder="contoh: React, Tailwind CSS, PostgreSQL, Vite"
            value={form.tags}
            onChange={set('tags')}
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <button className="btn btn-y" type="submit">
          {editing ? 'Simpan Perubahan Project' : '+ Tambah Project Magang'}
        </button>
        {editing ? (
          <button className="btn btn-g" type="button" onClick={onCancel}>
            Batal
          </button>
        ) : null}
      </div>
    </form>
  )
}

function ProfileForm({ member, onSave, onChangePassword, onRemove, removeArmed, isAdmin }) {
  const [form, setForm] = useState({
    name: member.name,
    role: member.role,
    division: member.division,
    build: member.build,
    aura: member.aura,
    bio: member.bio,
  })

  const [newPassword, setNewPassword] = useState('')
  const [passMsg, setPassMsg] = useState('')

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }))

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (!newPassword.trim()) return
    onChangePassword(newPassword.trim())
    setNewPassword('')
    setPassMsg('Password login berhasil diperbarui!')
    setTimeout(() => setPassMsg(''), 4000)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <form
        className="panel lg:col-span-8"
        onSubmit={(event) => {
          event.preventDefault()
          onSave(form)
        }}
      >
        <h3 className="disp mb-4 text-[22px] text-white">Profil Anggota Magang</h3>

        <div className="grid gap-3.5 min-[760px]:grid-cols-2">
          <label className="field">
            Nama Anggota
            <input className="input" required value={form.name} onChange={set('name')} />
          </label>
          <label className="field">
            Role / Peran
            <input className="input" required value={form.role} onChange={set('role')} />
          </label>
          <label className="field">
            Divisi Kerja
            <input className="input" required value={form.division} onChange={set('division')} />
          </label>
          <label className="field">
            Tipe Postur Karakter
            <select className="input" value={form.build} onChange={set('build')}>
              <option value="LIGHT">LIGHT (Ramping / Gesit)</option>
              <option value="MEDIUM">MEDIUM (Sedang)</option>
              <option value="HEAVY">HEAVY (Tinggi / Kokoh)</option>
            </select>
          </label>
          <label className="field">
            Warna Aura Spotlight
            <div className="flex items-center gap-2">
              <input
                className="input h-11 w-16 p-1"
                type="color"
                value={form.aura}
                onChange={set('aura')}
              />
              <span className="font-mono text-xs text-muted">{form.aura}</span>
            </div>
          </label>
          <label className="field min-[760px]:col-span-2">
            Bio / Ringkasan Tugas
            <textarea
              className="input min-h-[110px] resize-y"
              required
              value={form.bio}
              onChange={set('bio')}
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button className="btn btn-y" type="submit">
            Simpan Perubahan Profil
          </button>
          {isAdmin ? (
            <button className="btn btn-g" type="button" onClick={onRemove}>
              {removeArmed ? 'Yakin hapus contestant ini?' : 'Hapus contestant'}
            </button>
          ) : null}
        </div>
      </form>

      {/* Password Management */}
      <div className="panel lg:col-span-4">
        <h3 className="disp mb-2 text-[22px] text-white">Keamanan Akun</h3>
        <p className="mb-4 text-xs text-muted">
          Ganti password yang dipakai anggota ini untuk login di halaman login.
        </p>

        <form onSubmit={handlePasswordSubmit}>
          <label className="field">
            Password Baru
            <input
              className="input"
              type="password"
              required
              placeholder="Masukkan password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>

          {passMsg ? (
            <div className="mt-2 font-mono text-xs text-brand" role="status">
              {passMsg}
            </div>
          ) : null}

          <button className="btn btn-y mt-4 w-full" type="submit">
            Perbarui Password
          </button>
        </form>

        <div className="mt-6 border-t border-line pt-4 font-mono text-[11px] leading-relaxed text-muted">
          Default password akun jika belum diubah: <code className="text-brand">magang2026</code>
        </div>
      </div>
    </div>
  )
}

function AddForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    role: '',
    division: '',
    build: 'LIGHT',
    aura: '#facc15',
    bio: '',
  })

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }))

  return (
    <form
      className="panel"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(form)
      }}
    >
      <h3 className="disp mb-4 text-[22px] text-white">Tambah Anggota Magang Baru</h3>
      <div className="grid gap-3.5 min-[760px]:grid-cols-2">
        <label className="field">
          Nama Lengkap
          <input className="input" required value={form.name} onChange={set('name')} />
        </label>
        <label className="field">
          Role / Posisi
          <input className="input" required value={form.role} onChange={set('role')} />
        </label>
        <label className="field">
          Divisi
          <input className="input" required value={form.division} onChange={set('division')} />
        </label>
        <label className="field">
          Tipe Postur Karakter
          <select className="input" value={form.build} onChange={set('build')}>
            <option value="LIGHT">LIGHT</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HEAVY">HEAVY</option>
          </select>
        </label>
        <label className="field">
          Warna Aura Spotlight
          <input
            className="input h-11 p-[3px]"
            type="color"
            value={form.aura}
            onChange={set('aura')}
          />
        </label>
        <label className="field min-[760px]:col-span-2">
          Bio &amp; Ringkasan Tugas
          <textarea
            className="input min-h-[110px] resize-y"
            required
            value={form.bio}
            onChange={set('bio')}
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <button className="btn btn-y" type="submit">
          + Tambah ke Squad Arena
        </button>
      </div>
    </form>
  )
}

function BackupPanel({ data, onImport, onReset, setMsg, isSupabaseConfigured, syncStatus, onSyncSupabase }) {
  const [text, setText] = useState(() => JSON.stringify(data, null, 2))
  const [armed, setArmed] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    setText(JSON.stringify(data, null, 2))
  }, [data])

  const copy = () => {
    navigator.clipboard?.writeText(text).then(
      () => setMsg('JSON disalin ke clipboard.'),
      () => setMsg('Gagal menyalin otomatis. Tekan Ctrl+C pada teks.'),
    )
  }

  const readFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onImport(String(reader.result))
    reader.readAsText(file)
    event.target.value = ''
  }

  return (
    <div className="panel">
      <h3 className="disp mb-2 text-[22px] text-white">Backup &amp; Import Data JSON</h3>
      <p className="mb-3.5 text-sm text-muted">
        Salin data JSON di bawah untuk memindahkan data kegiatan magang ke perangkat lain, atau
        unggah berkas JSON untuk memulihkan data.
      </p>
      <label className="field">
        Data JSON
        <textarea
          className="input min-h-[260px] font-mono text-xs"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-2.5">
        <button className="btn btn-y" onClick={copy}>
          Salin JSON
        </button>
        <button className="btn btn-r" onClick={() => onImport(text)}>
          Impor dari Teks di Atas
        </button>
        <button className="btn btn-g" onClick={() => fileRef.current?.click()}>
          Unggah Berkas .json
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          hidden
          onChange={readFile}
        />
        <button
          className="btn btn-g"
          onClick={() => {
            if (!armed) {
              setArmed(true)
              setMsg('Klik sekali lagi untuk mengembalikan semua data contoh awal.')
              return
            }
            setArmed(false)
            onReset()
          }}
        >
          {armed ? 'Yakin kembalikan data contoh?' : 'Kembalikan Data Contoh'}
        </button>
      </div>

      {/* Supabase Cloud Database Info & Sync */}
      <div className="mt-8 border-t border-line pt-6">
        <h4 className="disp text-[19px] text-white">Database Cloud (Supabase)</h4>
        {isSupabaseConfigured ? (
          <div className="mt-2">
            <p className="mb-3 text-xs text-muted">
              Supabase aktif dan terhubung ({syncStatus}). Seluruh perubahan jurnal dan project tersimpan secara online ke Supabase secara real-time.
            </p>
            <button className="btn btn-y" onClick={onSyncSupabase}>
              ☁️ Unggah Semua Data Saat Ini ke Supabase
            </button>
          </div>
        ) : (
          <div className="mt-3 border border-brand/30 bg-brand/5 p-4 font-mono text-xs text-zinc-300">
            <p className="mb-2 font-semibold text-brand">💡 Ingin Mengaktifkan Supabase Database (Multi-Device)?</p>
            <ol className="list-inside list-decimal space-y-1.5 text-[11px] text-muted">
              <li>Buat project baru di <strong className="text-white">supabase.com</strong>.</li>
              <li>Buka <strong className="text-white">SQL Editor</strong> di Supabase, lalu jalankan skrip di file <strong className="text-brand">supabase/schema.sql</strong>.</li>
              <li>Buat file <strong className="text-white">.env.local</strong> (bisa salin dari <strong className="text-white">.env.example</strong>).</li>
              <li>Isi <strong className="text-white">VITE_SUPABASE_URL</strong> dan <strong className="text-white">VITE_SUPABASE_ANON_KEY</strong> dari Project Settings &rarr; API.</li>
              <li>Restart dev server (<code className="text-brand">npm run dev</code>). Database otomatis tersinkronisasi online!</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Dashboard({
  session,
  data,
  api,
  memberId,
  syncStatus,
  isSupabaseConfigured,
  onMemberChange,
  onClose,
  onLogout,
}) {
  const isAdmin = session?.role === 'admin'
  const isMember = session?.role === 'member'

  // Jika login sebagai member, batasi memberId ke akunnya sendiri
  const effectiveMemberId = isMember
    ? session.memberId
    : data.members.some((m) => m.id === memberId)
    ? memberId
    : data.members[0]?.id

  const member = data.members.find((m) => m.id === effectiveMemberId) ?? data.members[0]

  const [tab, setTab] = useState('journal')
  const [editJ, setEditJ] = useState(null)
  const [editP, setEditP] = useState(null)
  const [arm, setArm] = useState(null)
  const [msg, setMsg] = useState('')

  // Filter & search untuk jurnal
  const [jMonth, setJMonth] = useState(0)
  const [jStatus, setJStatus] = useState('')
  const [jSearch, setJSearch] = useState('')

  const journals = useMemo(
    () => data.journals.filter((j) => j.memberId === effectiveMemberId).sort(byDate),
    [data.journals, effectiveMemberId],
  )

  const projects = useMemo(
    () => data.projects.filter((p) => p.memberId === effectiveMemberId),
    [data.projects, effectiveMemberId],
  )

  // Filtered journals for view
  const filteredJournals = useMemo(() => {
    return journals.filter((j) => {
      if (jMonth && j.month !== jMonth) return false
      if (jStatus && j.status !== jStatus) return false
      if (jSearch) {
        const q = jSearch.toLowerCase()
        return (
          j.title.toLowerCase().includes(q) ||
          j.desc.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [journals, jMonth, jStatus, jSearch])

  const stats = useMemo(() => {
    const total = journals.length
    const selesai = journals.filter((j) => j.status === 'Selesai').length
    const proses = journals.filter((j) => j.status !== 'Selesai').length
    const totalProj = projects.length
    return { total, selesai, proses, totalProj }
  }, [journals, projects])

  const editingJournal = editJ ? journals.find((j) => j.id === editJ) : null
  const editingProject = editP ? projects.find((p) => p.id === editP) : null

  const changeMember = (id) => {
    onMemberChange(id)
    setEditJ(null)
    setEditP(null)
    setArm(null)
    setMsg('')
  }

  const changeTab = (next) => {
    setTab(next)
    setEditJ(null)
    setEditP(null)
    setArm(null)
    setMsg('')
  }

  const startEditJournal = (id) => {
    setEditJ(id)
    setMsg('')
    setTimeout(() => {
      document.getElementById('journal-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const startEditProject = (id) => {
    setEditP(id)
    setMsg('')
    setTimeout(() => {
      document.getElementById('project-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const saveJournal = (form) => {
    const id = editJ || `j${Date.now()}`
    api.saveJournal(
      {
        id,
        memberId: effectiveMemberId,
        date: form.date,
        month: monthOf(form.date),
        category: form.category.trim(),
        title: form.title.trim(),
        desc: form.desc.trim(),
        photo: form.photo,
        status: form.status,
      },
      editJ,
    )
    setMsg(editJ ? 'Isi kegiatan berhasil diperbarui!' : 'Kegiatan baru berhasil ditambahkan!')
    setEditJ(null)
    setTimeout(() => setMsg(''), 4000)
  }

  const saveProject = (form) => {
    const id = editP || `p${Date.now()}`
    api.saveProject(
      {
        id,
        memberId: effectiveMemberId,
        title: form.title.trim(),
        metric: form.metric.trim(),
        desc: form.desc.trim(),
        mock: form.mock,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      },
      editP,
    )
    setMsg(editP ? 'Isi project berhasil diperbarui!' : 'Project baru berhasil ditambahkan!')
    setEditP(null)
    setTimeout(() => setMsg(''), 4000)
  }

  const saveProfile = (form) => {
    api.saveProfile(effectiveMemberId, form)
    setMsg('Profil berhasil disimpan!')
    setTimeout(() => setMsg(''), 4000)
  }

  const changePassword = (pass) => {
    api.changePassword(effectiveMemberId, pass)
    setMsg('Password login berhasil diperbarui!')
    setTimeout(() => setMsg(''), 4000)
  }

  const addMember = (form) => {
    const index = data.members.length
    const next = {
      id: `m${Date.now()}`,
      ...form,
      sx: BUILD[form.build].sx,
      sy: BUILD[form.build].sy,
      skin: SKIN[index % SKIN.length],
      hair: HAIR[index % HAIR.length],
      hairColor: '#1a1410',
    }
    api.addMember(next)
    onMemberChange(next.id)
    setTab('profile')
    setMsg('Contestant baru ditambahkan ke panggung arena!')
    setTimeout(() => setMsg(''), 4000)
  }

  const removeMember = () => {
    if (data.members.length <= 1) {
      setMsg('Minimal satu contestant harus tersisa.')
      return
    }
    if (arm !== `m:${effectiveMemberId}`) {
      setArm(`m:${effectiveMemberId}`)
      return
    }
    const fallback = data.members.find((m) => m.id !== effectiveMemberId)
    api.removeMember(effectiveMemberId)
    onMemberChange(fallback?.id ?? null)
    setEditJ(null)
    setEditP(null)
    setArm(null)
    setMsg('Contestant dihapus.')
  }

  const removeJournal = (id) => {
    if (arm !== id) {
      setArm(id)
      return
    }
    api.deleteJournal(id)
    setArm(null)
    if (editJ === id) setEditJ(null)
    setMsg('Kegiatan magang berhasil dihapus.')
    setTimeout(() => setMsg(''), 4000)
  }

  const removeProject = (id) => {
    if (arm !== id) {
      setArm(id)
      return
    }
    api.deleteProject(id)
    setArm(null)
    if (editP === id) setEditP(null)
    setMsg('Project berhasil dihapus.')
    setTimeout(() => setMsg(''), 4000)
  }

  const importJson = (raw) => {
    try {
      const parsed = JSON.parse(raw)
      if (
        !parsed ||
        !Array.isArray(parsed.members) ||
        !parsed.members.length ||
        !Array.isArray(parsed.journals) ||
        !Array.isArray(parsed.projects)
      ) {
        throw new Error('invalid')
      }
      api.importData(parsed)
      onMemberChange(parsed.members[0].id)
      setEditJ(null)
      setEditP(null)
      setArm(null)
      setMsg(
        `Impor berhasil: ${parsed.members.length} contestant, ${parsed.journals.length} jurnal, ${parsed.projects.length} project.`,
      )
    } catch {
      setMsg('Impor gagal. Pastikan format JSON memuat members, journals, dan projects.')
    }
  }

  const resetData = () => {
    api.reset()
    setEditJ(null)
    setEditP(null)
    setArm(null)
    setMsg('Data contoh awal berhasil dipulihkan.')
  }

  const handleSyncSupabase = async () => {
    setMsg('Sedang menyinkronkan data ke Supabase...')
    const res = await api.syncLocalToSupabase()
    if (res.success) {
      setMsg('Seluruh data berhasil disinkronkan ke Supabase!')
    } else {
      setMsg(`Gagal sinkronisasi: ${res.error}`)
    }
    setTimeout(() => setMsg(''), 5000)
  }

  const tabs = useMemo(() => {
    const list = [
      ['journal', '📝 Jurnal Kegiatan'],
      ['project', '🚀 Featured Project'],
      ['profile', '👤 Profil & Akun'],
    ]
    if (isAdmin) {
      list.push(['add', '➕ Tambah Contestant'])
      list.push(['backup', '💾 Backup & Cloud'])
    }
    return list
  }, [isAdmin])

  return (
    <section
      className="fixed inset-0 z-[90] overflow-auto bg-canvas pb-16 pt-5"
      aria-label="Dashboard kegiatan magang"
    >
      <div className="mx-auto w-full max-w-[1280px] px-5">
        {/* Top Navbar in Dashboard */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="wide flex items-center gap-2 text-[19px]">
              <span className="grid h-[32px] w-[32px] shrink-0 place-items-center bg-brand">
                <Tri size={16} />
              </span>
              <span>DASHBOARD MAGANG</span>
            </div>
            <span
              className="inline-flex items-center gap-1.5 border border-line bg-panel px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.04em]"
              style={{ color: member.aura }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: member.aura }}
                aria-hidden="true"
              />
              {isAdmin ? 'Mode: Super Admin' : `Anggota: ${member.name}`}
            </span>

            {/* Status Koneksi Supabase */}
            <div className="inline-flex items-center gap-1.5 border border-line bg-panel px-2.5 py-1 font-mono text-[11px]">
              <span
                className={`h-2 w-2 rounded-full ${
                  isSupabaseConfigured
                    ? syncStatus === 'connected'
                      ? 'bg-emerald-400'
                      : syncStatus === 'syncing'
                      ? 'bg-brand animate-pulse'
                      : 'bg-alert'
                    : 'bg-zinc-500'
                }`}
                aria-hidden="true"
              />
              <span className="text-zinc-300">
                {isSupabaseConfigured
                  ? syncStatus === 'connected'
                    ? 'Cloud: Supabase (Realtime)'
                    : syncStatus === 'syncing'
                    ? 'Supabase: Menyinkronkan...'
                    : 'Supabase: Offline'
                  : 'Storage: Mode Lokal'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isAdmin && (
              <label className="field flex-row items-center gap-2 font-mono text-xs text-muted">
                Pilih Anggota:
                <select
                  className="input py-1.5 font-mono text-xs"
                  value={effectiveMemberId}
                  onChange={(e) => changeMember(e.target.value)}
                >
                  {data.members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </label>
            )}

            <button className="btn btn-g" onClick={onClose} title="Lihat di arena">
              👁 Lihat di Arena
            </button>
            <button className="btn btn-r" onClick={onLogout} title="Keluar dari akun">
              Keluar
            </button>
          </div>
        </div>

        {/* Member Header & Summary Card */}
        <div className="panel mb-6 border-l-4" style={{ borderLeftColor: member.aura }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.05em] text-muted">
                {member.division} // {member.build} BUILD
              </div>
              <h1 className="disp text-[clamp(28px,4vw,44px)] text-white">
                Dashboard Kegiatan:{' '}
                <span style={{ color: member.aura }}>{member.name}</span>
              </h1>
              <p className="mt-1 font-mono text-sm text-zinc-300">
                {member.role} — Tambah &amp; ganti isi jurnal dan featured project magang
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 min-[640px]:grid-cols-4">
              <div className="border border-line bg-sub px-3 py-2 text-center">
                <span className="disp block text-2xl text-white">{stats.total}</span>
                <span className="font-mono text-[10px] uppercase text-muted">Total Kegiatan</span>
              </div>
              <div className="border border-line bg-sub px-3 py-2 text-center">
                <span className="disp block text-2xl text-emerald-400">{stats.selesai}</span>
                <span className="font-mono text-[10px] uppercase text-muted">Selesai</span>
              </div>
              <div className="border border-line bg-sub px-3 py-2 text-center">
                <span className="disp block text-2xl text-brand">{stats.proses}</span>
                <span className="font-mono text-[10px] uppercase text-muted">Dalam Proses</span>
              </div>
              <div className="border border-line bg-sub px-3 py-2 text-center">
                <span className="disp block text-2xl text-sky-400">{stats.totalProj}</span>
                <span className="font-mono text-[10px] uppercase text-muted">Project Output</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-line pb-3">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              className={`chip ${tab === key ? 'chip-on' : ''}`}
              onClick={() => changeTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Feedback / Alert Message */}
        {msg ? (
          <div
            className="mb-4 border border-brand/40 bg-brand/10 px-4 py-2.5 font-mono text-xs text-brand"
            role="status"
          >
            ✓ {msg}
          </div>
        ) : null}

        {/* Tab Content: Jurnal Kegiatan */}
        {tab === 'journal' ? (
          <div>
            <JournalForm
              key={`${effectiveMemberId}-${editJ ?? 'new'}`}
              editing={editingJournal}
              onSubmit={saveJournal}
              onCancel={() => setEditJ(null)}
            />

            {/* List & Filter Section */}
            <div className="panel mt-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                <div>
                  <h3 className="disp text-[22px] text-white">
                    Daftar Jurnal Kegiatan ({filteredJournals.length} dari {journals.length})
                  </h3>
                  <p className="font-mono text-xs text-muted">
                    Klik tombol &quot;Ganti / Edit Isi&quot; pada salah satu kegiatan untuk mengubahnya.
                  </p>
                </div>
                {!editingJournal && (
                  <button
                    className="btn btn-y text-xs"
                    type="button"
                    onClick={() => {
                      setEditJ(null)
                      document.getElementById('journal-form')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    + Tambah Kegiatan Baru
                  </button>
                )}
              </div>

              {/* Filter and Search Bar */}
              <div className="mb-4 grid gap-2.5 min-[760px]:grid-cols-12">
                <div className="min-[760px]:col-span-6">
                  <input
                    className="input font-mono text-xs"
                    type="search"
                    placeholder="Cari kegiatan (judul, kategori, deskripsi)..."
                    value={jSearch}
                    onChange={(e) => setJSearch(e.target.value)}
                  />
                </div>
                <div className="min-[760px]:col-span-3">
                  <select
                    className="input font-mono text-xs"
                    value={jMonth}
                    onChange={(e) => setJMonth(Number(e.target.value))}
                  >
                    <option value={0}>Semua Periode Bulan</option>
                    <option value={1}>Bulan 1 (Agustus 2026)</option>
                    <option value={2}>Bulan 2 (September 2026)</option>
                    <option value={3}>Bulan 3 (Oktober 2026)</option>
                  </select>
                </div>
                <div className="min-[760px]:col-span-3">
                  <select
                    className="input font-mono text-xs"
                    value={jStatus}
                    onChange={(e) => setJStatus(e.target.value)}
                  >
                    <option value="">Semua Status</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Berjalan">Berjalan</option>
                    <option value="Revisi">Revisi</option>
                  </select>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {filteredJournals.map((journal) => (
                  <div
                    key={journal.id}
                    className={`border p-4 transition-colors ${
                      editJ === journal.id
                        ? 'border-brand bg-[#1c1b12]'
                        : 'border-line bg-sub hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-brand">
                            {fmtDate(journal.date)}
                          </span>
                          <span className="tag">
                            {journal.month ? `Bulan ${journal.month}` : 'Kegiatan'}
                          </span>
                          <span className="tag">{journal.category}</span>
                          <span
                            className="inline-flex items-center gap-1 font-mono text-[11px]"
                            style={{ color: STATUS_COLORS[journal.status] || '#a1a1aa' }}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: STATUS_COLORS[journal.status] || '#a1a1aa' }}
                            />
                            {journal.status}
                          </span>
                        </div>

                        <h4 className="disp mt-1 text-[20px] text-white">{journal.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-zinc-300">{journal.desc}</p>

                        {journal.photo && journal.photo !== 'none' && (
                          <div className="mt-2.5 max-w-[260px] border border-line">
                            <Photo kind={journal.photo} />
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        <button
                          className="btn btn-y px-3 py-1.5 text-xs"
                          onClick={() => startEditJournal(journal.id)}
                        >
                          ✏️ Ganti / Edit Isi
                        </button>
                        <button
                          className={`btn ${
                            arm === journal.id ? 'btn-r' : 'btn-g'
                          } px-3 py-1.5 text-xs`}
                          onClick={() => removeJournal(journal.id)}
                        >
                          {arm === journal.id ? 'Yakin Hapus?' : 'Hapus'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!filteredJournals.length && (
                  <div className="border border-dashed border-line p-8 text-center font-mono text-sm text-muted">
                    Tidak ada kegiatan magang yang cocok dengan filter.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* Tab Content: Featured Project */}
        {tab === 'project' ? (
          <div>
            <ProjectForm
              key={`${effectiveMemberId}-${editP ?? 'new'}`}
              editing={editingProject}
              onSubmit={saveProject}
              onCancel={() => setEditP(null)}
            />

            <div className="panel mt-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                <div>
                  <h3 className="disp text-[22px] text-white">
                    Featured Project Milik {member.name} ({projects.length})
                  </h3>
                  <p className="font-mono text-xs text-muted">
                    Output utama, hasil kerja, dan portofolio kegiatan magang.
                  </p>
                </div>
                {!editingProject && (
                  <button
                    className="btn btn-y text-xs"
                    type="button"
                    onClick={() => {
                      setEditP(null)
                      document.getElementById('project-form')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    + Tambah Project Baru
                  </button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`border p-4 transition-colors ${
                      editP === project.id
                        ? 'border-brand bg-[#1c1b12]'
                        : 'border-line bg-sub hover:border-zinc-700'
                    }`}
                  >
                    <div className="mb-3 overflow-hidden border border-line bg-[#0c0e14]">
                      <Mockup kind={project.mock} />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-block bg-brand px-2 py-0.5 font-mono text-xs font-semibold text-black">
                        {project.metric}
                      </span>
                      <span className="font-mono text-[10px] uppercase text-muted">
                        Visual: {project.mock}
                      </span>
                    </div>

                    <h4 className="disp mb-1.5 mt-2 text-[22px] text-white">{project.title}</h4>
                    <p className="text-sm leading-relaxed text-zinc-300">{project.desc}</p>

                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {(project.tags || []).map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex gap-2 border-t border-line pt-3">
                      <button
                        className="btn btn-y px-3 py-1.5 text-xs"
                        onClick={() => startEditProject(project.id)}
                      >
                        ✏️ Ganti / Edit Isi
                      </button>
                      <button
                        className={`btn ${
                          arm === project.id ? 'btn-r' : 'btn-g'
                        } px-3 py-1.5 text-xs`}
                        onClick={() => removeProject(project.id)}
                      >
                        {arm === project.id ? 'Yakin Hapus?' : 'Hapus'}
                      </button>
                    </div>
                  </div>
                ))}

                {!projects.length && (
                  <div className="col-span-2 border border-dashed border-line p-8 text-center font-mono text-sm text-muted">
                    Belum ada featured project untuk anggota ini.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* Tab Content: Profil & Akun */}
        {tab === 'profile' ? (
          <ProfileForm
            key={member.id}
            member={member}
            onSave={saveProfile}
            onChangePassword={changePassword}
            onRemove={removeMember}
            removeArmed={arm === `m:${effectiveMemberId}`}
            isAdmin={isAdmin}
          />
        ) : null}

        {/* Tab Content: Tambah Contestant (Admin Only) */}
        {tab === 'add' && isAdmin ? <AddForm key="add" onSubmit={addMember} /> : null}

        {/* Tab Content: Backup JSON & Cloud (Admin Only) */}
        {tab === 'backup' && isAdmin ? (
          <BackupPanel
            data={data}
            onImport={importJson}
            onReset={resetData}
            setMsg={setMsg}
            isSupabaseConfigured={isSupabaseConfigured}
            syncStatus={syncStatus}
            onSyncSupabase={handleSyncSupabase}
          />
        ) : null}

        <div className="mt-8 border-t border-line pt-4 font-mono text-[11px] text-muted">
          THE FINALS // PKL SQUAD · {pad(data.members.length)} Contestant ·{' '}
          {data.journals.length} Jurnal Tercatat · {data.projects.length} Project Output
        </div>
      </div>
    </section>
  )
}
