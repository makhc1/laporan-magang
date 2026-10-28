import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  Presentation, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FolderGit2, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  Download, 
  Upload, 
  Sparkles, 
  Building2, 
  UserPlus,
  X,
  Search,
  Crosshair,
  Shield,
  Zap,
  Award,
  UserCheck,
  Box,
  RotateCw,
  Play,
  Activity
} from 'lucide-react';

// ==========================================
// FIREBASE INITIALIZATION
// ==========================================
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-pkl-app';

// ==========================================
// INITIAL SEED DATA (5 SQUAD CONTESTANTS)
// ==========================================
const INITIAL_MEMBERS = [
  {
    id: 'member-ahmad',
    name: 'Ahmad',
    role: 'FULL-STACK & IT SUPPORT',
    division: 'Subbag TU / Datin',
    buildType: 'MEDIUM BUILD',
    bio: 'Spesialis pengembang web aplikasi arsip, automasi sistem broadcasting, konfigurasi server & hardware troubleshooting.',
    tintColor: '#facc15'
  },
  {
    id: 'member-abimanyu',
    name: 'Abimanyu',
    role: 'SYSTEM & NETWORK BUILD',
    division: 'Teknisi & Infrastruktur',
    buildType: 'HEAVY BUILD',
    bio: 'Fokus pada manajemen infrastruktur jaringan LAN, pemeliharaan perangkat keras, dan dukungan teknis operasional harian.',
    tintColor: '#ef4444'
  },
  {
    id: 'member-rafly',
    name: 'Rafly',
    role: 'FRONTEND & UI/UX BUILD',
    division: 'Pengembangan Sistem & Media',
    buildType: 'LIGHT BUILD',
    bio: 'Merancang antarmuka pengguna yang interaktif, dokumentasi visual kegiatan, serta pengelolaan aset digital instansi.',
    tintColor: '#38bdf8'
  },
  {
    id: 'member-fero',
    name: 'Fero',
    role: 'DATA & ARCHIVE OPS',
    division: 'Bagian Umum & Kearsipan',
    buildType: 'MEDIUM BUILD',
    bio: 'Mengelola rekapitulasi data, digitalisasi dokumen arsip tahunan, serta validasi administrasi sistem informasi.',
    tintColor: '#10b981'
  },
  {
    id: 'member-alfi',
    name: 'Alfi',
    role: 'TECHNICAL & MEDIA SUPPORT',
    division: 'Operasional & Dokumentasi',
    buildType: 'LIGHT-MEDIUM BUILD',
    bio: 'Menangani operasional teknis lapangan, dokumentasi kegiatan instansi, serta pemeliharaan perangkat kerja pegawai.',
    tintColor: '#a855f7'
  }
];

const INITIAL_LOGS = [
  {
    id: 'log-1',
    memberId: 'member-ahmad',
    date: '2026-02-14',
    month: 'Bulan 1',
    title: 'Analisis Kebutuhan & Desain Database Aplikasi SIARSIP',
    description: 'Melakukan wawancara singkat dengan staf arsip terkait alur surat masuk dan surat keluar. Merancang skema tabel database MySQL dan membuat mockup antarmuka pengarsipan digital.',
    category: 'Web Dev',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-2',
    memberId: 'member-ahmad',
    date: '2026-03-04',
    month: 'Bulan 2',
    title: 'Pengembangan Fitur Upload & Pencarian Cepat SIARSIP',
    description: 'Mengimplementasikan fitur upload dokumen PDF surat masuk beserta filter pencarian instan berdasarkan nomor surat, tanggal, dan perihal agar pencarian arsip lebih efisien.',
    category: 'Web Dev',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-3',
    memberId: 'member-ahmad',
    date: '2026-04-10',
    month: 'Bulan 3',
    title: 'Setup Web Controller OBS & Layar Digital Signage',
    description: 'Mengonfigurasi sistem kontrol tampilan informasi kegiatan kantor secara remote melalui jaringan lokal untuk ditampilkan pada layar monitor lobi utama.',
    category: 'IT Support',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-4',
    memberId: 'member-abimanyu',
    date: '2026-02-18',
    month: 'Bulan 1',
    title: 'Troubleshooting Jaringan LAN & Crimping Kabel UTP Cat6',
    description: 'Mengecek titik jaringan yang terputus di ruang rapat lantai 2, melakukan crimping ulang konektor RJ45 pada kabel UTP Cat6, serta mengetes koneksi dengan LAN Tester.',
    category: 'Jaringan',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-5',
    memberId: 'member-abimanyu',
    date: '2026-03-15',
    month: 'Bulan 2',
    title: 'Konfigurasi Access Point & Manajemen Bandwidth Ruangan',
    description: 'Melakukan setting ulang SSID dan keamanan perangkat Wi-Fi ruangan serta memastikan pembagian IP Address berjalan stabil tanpa konflik IP.',
    category: 'Jaringan',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-6',
    memberId: 'member-rafly',
    date: '2026-02-20',
    month: 'Bulan 1',
    title: 'Perancangan UI/UX Dashboard Laporan & Portal Internal',
    description: 'Membuat wireframe dan prototipe antarmuka halaman dashboard monitoring menggunakan komponen modern agar mudah digunakan oleh pegawai.',
    category: 'Web Dev',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-7',
    memberId: 'member-rafly',
    date: '2026-03-22',
    month: 'Bulan 2',
    title: 'Slicing Komponen Responsif & Optimasi Tampilan Web',
    description: 'Mengonversi desain UI ke dalam kode React dan Tailwind CSS serta memastikan tampilan tabel dan form berjalan responsif di berbagai ukuran layar.',
    category: 'Web Dev',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-8',
    memberId: 'member-fero',
    date: '2026-02-16',
    month: 'Bulan 1',
    title: 'Penyortiran & Katalogisasi Surat Masuk Triwulan I',
    description: 'Mengelompokkan dokumen fisik surat masuk berdasarkan kode klasifikasi instansi dan mengurutkannya secara kronologis sebelum masuk tahap pemindaian (scanning).',
    category: 'Arsip',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-9',
    memberId: 'member-fero',
    date: '2026-03-12',
    month: 'Bulan 2',
    title: 'Digitalisasi 250+ Dokumen Arsip & Input Metadata Sistem',
    description: 'Melakukan scanning dokumen fisik menjadi format PDF terstandarisasi dan menginput metadata dokumen ke dalam aplikasi pengarsipan serta spreadsheet rekapitulasi.',
    category: 'Administrasi',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-10',
    memberId: 'member-alfi',
    date: '2026-02-25',
    month: 'Bulan 1',
    title: 'Maintenance Berkala PC Staf & Instalasi Perangkat Printer',
    description: 'Membersihkan hardware PC staf dari debu, mengecek kesehatan penyimpanan SSD, serta menginstal driver printer sharing untuk kebutuhan cetak dokumen.',
    category: 'Hardware',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'log-11',
    memberId: 'member-alfi',
    date: '2026-03-28',
    month: 'Bulan 2',
    title: 'Persiapan Perangkat Multimedia Ruang Rapat & Dokumentasi',
    description: 'Menyiapkan proyektor, sistem audio, dan koneksi konferensi video untuk kegiatan rapat koordinasi serta mendokumentasikan jalannya kegiatan.',
    category: 'IT Support',
    status: 'Selesai',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
  }
];

const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    memberId: 'member-ahmad',
    title: 'Aplikasi SIARSIP Digital',
    description: 'Sistem Informasi Pengarsipan Surat Masuk & Keluar berbasis web untuk mempercepat pencarian dokumen hingga 80% dibanding pencatatan manual.',
    tags: ['React', 'Tailwind CSS', 'Database', 'Web App'],
    metric: '100% Digital',
    previewType: 'web'
  },
  {
    id: 'proj-2',
    memberId: 'member-ahmad',
    title: 'Web Controller Digital Signage',
    description: 'Panel kendali terpusat untuk mengatur konten video dan pengumuman pada layar monitor informasi gedung secara real-time.',
    tags: ['OBS WebSocket', 'JavaScript', 'Automation'],
    metric: 'Real-time Sync',
    previewType: 'dashboard'
  },
  {
    id: 'proj-3',
    memberId: 'member-abimanyu',
    title: 'Revitalisasi Jalur Jaringan LAN',
    description: 'Penataan ulang manajemen kabel (cable management) pada rack switch dan perbaikan 15 titik node jaringan LAN di area kerja staf.',
    tags: ['Networking', 'MikroTik', 'UTP Cat6', 'Switch'],
    metric: '15 Titik Aktif',
    previewType: 'network'
  },
  {
    id: 'proj-4',
    memberId: 'member-rafly',
    title: 'Desain Sistem UI Web Presentasi & Portal',
    description: 'Perancangan antarmuka modern dan komponen interaktif untuk kebutuhan sistem informasi internal dan web pelaporan kegiatan.',
    tags: ['UI/UX Design', 'Frontend', 'Tailwind CSS', 'Figma'],
    metric: 'Modern UI',
    previewType: 'web'
  },
  {
    id: 'proj-5',
    memberId: 'member-fero',
    title: 'Digitalisasi 500+ Arsip Tahunan',
    description: 'Alih media dokumen fisik ke format digital PDF terindeks lengkap dengan sistem penamaan file baku untuk mempermudah audit arsip.',
    tags: ['E-Filing', 'Ms. Excel', 'Kearsipan', 'PDF Indexing'],
    metric: '500+ Dokumen',
    previewType: 'archive'
  },
  {
    id: 'proj-6',
    memberId: 'member-alfi',
    title: 'Optimalisasi 20+ Unit PC & Multimedia',
    description: 'Perawatan hardware komputer operasional pegawai, konfigurasi printer sharing, serta kesiapan perangkat ruang rapat.',
    tags: ['Hardware', 'Troubleshooting', 'Windows OS', 'Multimedia'],
    metric: '20+ Unit PC',
    previewType: 'dashboard'
  }
];

const PRESET_IMAGES = [
  { label: 'Ngoding / Web Dev', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Arsip / Dokumen', url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80' },
  { label: 'Jaringan / Server', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Rakit / Servis PC', url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80' }
];

// ==========================================
// 2D SVG SQUAD CHARACTER ILLUSTRATION COMPONENT
// ==========================================
const SquadSVGAvatar = ({ memberId, tintColor, isSelected }) => {
  const accent = tintColor || '#facc15';

  switch (memberId) {
    case 'member-ahmad': // Medium Build
      return (
        <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="285" rx="65" ry="16" fill={accent} opacity={isSelected ? 0.65 : 0.25} filter="blur(6px)" />
          {/* Torso */}
          <path d="M75 140 L100 115 L140 115 L165 140 L160 215 L80 215 Z" fill="#181c26" stroke={accent} strokeWidth="2.5" />
          <path d="M100 115 L120 175 L140 115 Z" fill={accent} opacity="0.85" />
          {/* Head & Face */}
          <circle cx="120" cy="82" r="32" fill="#d69e72" stroke="#0f1117" strokeWidth="2" />
          <path d="M92 72 Q120 58 148 72 Q135 92 120 92 Q105 92 92 72 Z" fill="#111827" />
          <rect x="104" y="78" width="32" height="10" rx="4" fill="#090b10" stroke={accent} strokeWidth="1.5" />
          <circle cx="113" cy="83" r="2" fill={accent} />
          <circle cx="127" cy="83" r="2" fill={accent} />
          {/* Badge */}
          <circle cx="120" cy="145" r="10" fill={accent} />
          <text x="120" y="148" textAnchor="middle" fill="#000000" fontSize="10" fontWeight="900">&lt;/&gt;</text>
        </svg>
      );
    case 'member-abimanyu': // Heavy Build
      return (
        <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="285" rx="75" ry="18" fill={accent} opacity={isSelected ? 0.65 : 0.25} filter="blur(6px)" />
          {/* Broad Torso */}
          <path d="M65 135 L95 110 L145 110 L175 135 L168 220 L72 220 Z" fill="#0f0507" stroke={accent} strokeWidth="3" />
          <path d="M95 110 L120 180 L145 110 Z" fill={accent} opacity="0.85" />
          {/* Head */}
          <circle cx="120" cy="78" r="35" fill="#c48a5c" stroke="#0f0507" strokeWidth="2" />
          <path d="M90 70 Q120 52 150 70 L145 80 Q120 75 95 80 Z" fill="#181c26" />
          <rect x="102" y="75" width="36" height="12" rx="3" fill="#000000" stroke={accent} strokeWidth="1.5" />
          {/* Tactical Headset */}
          <path d="M90 78 C90 55 150 55 150 78" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'member-rafly': // Light Build
      return (
        <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="285" rx="58" ry="15" fill={accent} opacity={isSelected ? 0.65 : 0.25} filter="blur(6px)" />
          {/* Lean Torso */}
          <path d="M82 142 L105 118 L135 118 L158 142 L152 215 L88 215 Z" fill="#0b1329" stroke={accent} strokeWidth="2.5" />
          <path d="M82 142 L158 142 L135 185 L105 185 Z" fill={accent} opacity="0.75" />
          {/* Head */}
          <circle cx="120" cy="85" r="29" fill="#e0b084" stroke="#0b1329" strokeWidth="2" />
          <path d="M95 76 Q120 62 145 76 Q135 90 120 90 Q105 90 95 76 Z" fill="#1e293b" />
          <rect x="106" y="82" width="28" height="9" rx="3" fill="#000000" stroke={accent} strokeWidth="1.5" />
        </svg>
      );
    case 'member-fero': // Medium Build
      return (
        <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="285" rx="64" ry="16" fill={accent} opacity={isSelected ? 0.65 : 0.25} filter="blur(6px)" />
          {/* Corporate Tactical Torso */}
          <path d="M78 138 L102 114 L138 114 L162 138 L156 215 L84 215 Z" fill="#062318" stroke={accent} strokeWidth="2.5" />
          <path d="M102 114 L120 170 L138 114 Z" fill={accent} opacity="0.8" />
          {/* Head & Glasses */}
          <circle cx="120" cy="82" r="31" fill="#d19c74" stroke="#062318" strokeWidth="2" />
          <path d="M92 72 Q120 58 148 72 L140 85 L100 85 Z" fill="#111827" />
          <rect x="103" y="78" width="34" height="11" rx="2" fill="#000000" stroke={accent} strokeWidth="1.5" />
        </svg>
      );
    case 'member-alfi': // Light-Medium Build
      default:
        return (
          <svg viewBox="0 0 240 320" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="120" cy="285" rx="60" ry="16" fill={accent} opacity={isSelected ? 0.65 : 0.25} filter="blur(6px)" />
            {/* Hoodie Torso */}
            <path d="M80 140 L104 116 L136 116 L160 140 L154 215 L86 215 Z" fill="#1e102d" stroke={accent} strokeWidth="2.5" />
            <path d="M104 116 L120 175 L136 116 Z" fill={accent} opacity="0.8" />
            {/* Head */}
            <circle cx="120" cy="82" r="30" fill="#d99b70" stroke="#1e102d" strokeWidth="2" />
            <path d="M94 72 Q120 60 146 72 L138 84 L102 84 Z" fill="#2e1065" />
            <rect x="105" y="79" width="30" height="10" rx="3" fill="#000000" stroke={accent} strokeWidth="1.5" />
          </svg>
        );
  }
};

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMode, setActiveMode] = useState('presentasi');
  
  const [members, setMembers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedMemberId, setSelectedMemberId] = useState('member-ahmad');
  const [selectedMonth, setSelectedMonth] = useState('Semua Bulan');
  const [expandedLogIds, setExpandedLogIds] = useState(['log-1']);
  const [searchQuery, setSearchQuery] = useState('');
  
  const reportSectionRef = useRef(null);

  const [adminActiveMemberId, setAdminActiveMemberId] = useState('member-ahmad');
  const [adminTab, setAdminTab] = useState('input-log');
  const [notification, setNotification] = useState(null);

  const [editingLogId, setEditingLogId] = useState(null);
  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().split('T')[0],
    month: 'Bulan 1',
    title: '',
    description: '',
    category: 'Web Dev',
    status: 'Selesai',
    imageUrl: ''
  });

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    tagsInput: '',
    metric: 'Selesai 100%',
    previewType: 'web'
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
    role: '',
    buildType: 'MEDIUM BUILD',
    bio: '',
    tintColor: '#facc15'
  });

  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    role: '',
    buildType: 'MEDIUM BUILD',
    bio: ''
  });

  const [jsonInputText, setJsonInputText] = useState('');

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('Auth error:', err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const membersRef = collection(db, 'artifacts', appId, 'public', 'data', 'pkl_members');
    const logsRef = collection(db, 'artifacts', appId, 'public', 'data', 'pkl_logs');
    const projectsRef = collection(db, 'artifacts', appId, 'public', 'data', 'pkl_projects');

    const unsubMembers = onSnapshot(
      membersRef,
      async (snapshot) => {
        const existingIds = snapshot.docs.map((d) => d.id);
        const hasInitialFive = INITIAL_MEMBERS.every((m) => existingIds.includes(m.id));

        if (snapshot.empty || !hasInitialFive) {
          for (const m of INITIAL_MEMBERS) {
            if (!existingIds.includes(m.id)) {
              await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pkl_members', m.id), m);
            }
          }
        }
        
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (list.length > 0) {
          const orderMap = {
            'member-ahmad': 1,
            'member-abimanyu': 2,
            'member-rafly': 3,
            'member-fero': 4,
            'member-alfi': 5
          };
          list.sort((a, b) => (orderMap[a.id] || 99) - (orderMap[b.id] || 99));
          setMembers(list);
        } else {
          setMembers(INITIAL_MEMBERS);
        }
      },
      (err) => console.error('Error fetching members:', err)
    );

    const unsubLogs = onSnapshot(
      logsRef,
      async (snapshot) => {
        if (snapshot.empty) {
          for (const l of INITIAL_LOGS) {
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pkl_logs', l.id), l);
          }
        } else {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          list.sort((a, b) => new Date(b.date) - new Date(a.date));
          setLogs(list);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching logs:', err);
        setIsLoading(false);
      }
    );

    const unsubProjects = onSnapshot(
      projectsRef,
      async (snapshot) => {
        if (snapshot.empty) {
          for (const p of INITIAL_PROJECTS) {
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pkl_projects', p.id), p);
          }
        } else {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          setProjects(list);
        }
      },
      (err) => console.error('Error fetching projects:', err)
    );

    return () => {
      unsubMembers();
      unsubLogs();
      unsubProjects();
    };
  }, [user]);

  const displayMembers = members.length > 0 ? members : INITIAL_MEMBERS;

  const activeMemberIndex = useMemo(() => {
    const idx = displayMembers.findIndex((m) => m.id === selectedMemberId);
    return idx >= 0 ? idx : 0;
  }, [displayMembers, selectedMemberId]);

  const activeMember = useMemo(() => {
    return displayMembers[activeMemberIndex] || INITIAL_MEMBERS[0];
  }, [displayMembers, activeMemberIndex]);

  const adminCurrentMember = useMemo(() => {
    return displayMembers.find((m) => m.id === adminActiveMemberId) || displayMembers[0] || INITIAL_MEMBERS[0];
  }, [displayMembers, adminActiveMemberId]);

  useEffect(() => {
    if (adminCurrentMember) {
      setProfileForm({
        name: adminCurrentMember.name || '',
        role: adminCurrentMember.role || '',
        buildType: adminCurrentMember.buildType || 'MEDIUM BUILD',
        bio: adminCurrentMember.bio || '',
        tintColor: adminCurrentMember.tintColor || '#facc15'
      });
    }
  }, [adminCurrentMember]);

  const handlePrevContestant = () => {
    const prevIdx = (activeMemberIndex - 1 + displayMembers.length) % displayMembers.length;
    setSelectedMemberId(displayMembers[prevIdx].id);
  };

  const handleNextContestant = () => {
    const nextIdx = (activeMemberIndex + 1) % displayMembers.length;
    setSelectedMemberId(displayMembers[nextIdx].id);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeMode !== 'presentasi') return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowLeft') handlePrevContestant();
      if (e.key === 'ArrowRight') handleNextContestant();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleSelectAndScroll = () => {
    if (reportSectionRef.current) {
      reportSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchMember = log.memberId === activeMember?.id;
      const matchMonth = selectedMonth === 'Semua Bulan' || log.month === selectedMonth;
      const matchSearch =
        !searchQuery.trim() ||
        log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMember && matchMonth && matchSearch;
    });
  }, [logs, activeMember, selectedMonth, searchQuery]);

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => proj.memberId === activeMember?.id);
  }, [projects, activeMember]);

  const adminMemberLogs = useMemo(() => {
    return logs.filter((log) => log.memberId === adminCurrentMember?.id);
  }, [logs, adminCurrentMember]);

  const adminMemberProjects = useMemo(() => {
    return projects.filter((proj) => proj.memberId === adminCurrentMember?.id);
  }, [projects, adminCurrentMember]);

  const toggleLogExpand = (id) => {
    setExpandedLogIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveLog = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!logForm.title.trim() || !logForm.description.trim()) {
      showToast('Judul dan deskripsi kegiatan wajib diisi!', 'error');
      return;
    }

    try {
      const payload = {
        memberId: adminCurrentMember.id,
        date: logForm.date,
        month: logForm.month,
        title: logForm.title.trim(),
        description: logForm.description.trim(),
        category: logForm.category,
        status: logForm.status,
        imageUrl: logForm.imageUrl.trim()
      };

      if (editingLogId) {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pkl_logs', editingLogId), payload);
        showToast('Jurnal kegiatan berhasil diperbarui!');
        setEditingLogId(null);
      } else {
        const newId = 'log-' + Date.now();
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pkl_logs', newId), payload);
        showToast(`Kegiatan baru ditambahkan untuk ${adminCurrentMember.name}!`);
      }

      setLogForm({
        date: new Date().toISOString().split('T')[0],
        month: logForm.month,
        title: '',
        description: '',
        category: logForm.category,
        status: 'Selesai',
        imageUrl: ''
      });
    } catch (err) {
      console.error('Error saving log:', err);
      showToast('Gagal menyimpan kegiatan.', 'error');
    }
  };

  const handleEditLogClick = (log) => {
    setEditingLogId(log.id);
    setLogForm({
      date: log.date,
      month: log.month,
      title: log.title,
      description: log.description,
      category: log.category,
      status: log.status || 'Selesai',
      imageUrl: log.imageUrl || ''
    });
    setAdminTab('input-log');
  };

  const handleDeleteLog = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pkl_logs', id));
      showToast('Kegiatan berhasil dihapus.');
    } catch (err) {
      console.error('Delete log error:', err);
      showToast('Gagal menghapus data.', 'error');
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      showToast('Nama project dan deskripsi wajib diisi!', 'error');
      return;
    }

    const parsedTags = projectForm.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const payload = {
        memberId: adminCurrentMember.id,
        title: projectForm.title.trim(),
        description: projectForm.description.trim(),
        tags: parsedTags.length > 0 ? parsedTags : ['Project PKL'],
        metric: projectForm.metric.trim() || 'Selesai',
        previewType: projectForm.previewType
      };

      if (editingProjectId) {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pkl_projects', editingProjectId), payload);
        showToast('Hasil kerja / project berhasil diperbarui!');
        setEditingProjectId(null);
      } else {
        const newId = 'proj-' + Date.now();
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pkl_projects', newId), payload);
        showToast(`Project baru ditambahkan untuk ${adminCurrentMember.name}!`);
      }

      setProjectForm({
        title: '',
        description: '',
        tagsInput: '',
        metric: 'Selesai 100%',
        previewType: 'web'
      });
    } catch (err) {
      console.error('Error saving project:', err);
      showToast('Gagal menyimpan project.', 'error');
    }
  };

  const handleEditProjectClick = (proj) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      title: proj.title,
      description: proj.description,
      tagsInput: (proj.tags || []).join(', '),
      metric: proj.metric || 'Selesai',
      previewType: proj.previewType || 'web'
    });
    setAdminTab('input-project');
  };

  const handleDeleteProject = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pkl_projects', id));
      showToast('Project berhasil dihapus.');
    } catch (err) {
      console.error('Delete project error:', err);
      showToast('Gagal menghapus project.', 'error');
    }
  };

  const handleSaveContestantProfile = async (e) => {
    e.preventDefault();
    if (!user || !adminCurrentMember) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pkl_members', adminCurrentMember.id), {
        name: profileForm.name.trim() || adminCurrentMember.name,
        role: profileForm.role.trim() || adminCurrentMember.role,
        buildType: profileForm.buildType,
        bio: profileForm.bio.trim(),
        tintColor: profileForm.tintColor || '#facc15'
      });
      showToast(`Profil Contestant ${profileForm.name} berhasil diupdate!`);
    } catch (err) {
      console.error('Error updating profile:', err);
      showToast('Gagal menyimpan profil.', 'error');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!newMemberForm.name.trim() || !newMemberForm.role.trim()) {
      showToast('Nama dan role wajib diisi!', 'error');
      return;
    }

    try {
      const newId = 'member-' + Date.now();
      const payload = {
        id: newId,
        name: newMemberForm.name.trim(),
        role: newMemberForm.role.trim().toUpperCase(),
        buildType: newMemberForm.buildType || 'MEDIUM BUILD',
        bio: newMemberForm.bio.trim() || 'Anggota tim Praktik Kerja Lapangan (PKL) dengan kontribusi aktif pada operasional dan proyek instansi.',
        tintColor: '#38bdf8'
      };
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pkl_members', newId), payload);
      setNewMemberForm({ name: '', role: '', buildType: 'MEDIUM BUILD', bio: '' });
      setAdminActiveMemberId(newId);
      setSelectedMemberId(newId);
      showToast(`Contestant baru (${payload.name}) berhasil ditambahkan!`);
    } catch (err) {
      console.error('Error adding member:', err);
      showToast('Gagal menambahkan anggota.', 'error');
    }
  };

  const handleExportJSON = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      members: displayMembers,
      logs,
      projects
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'backup_laporan_pkl_the_finals.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('File JSON berhasil di-download!');
  };

  const handleImportJSON = async () => {
    if (!user || !jsonInputText.trim()) return;
    try {
      const parsed = JSON.parse(jsonInputText);
      if (Array.isArray(parsed.members)) {
        for (const m of parsed.members) {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pkl_members', m.id), m);
        }
      }
      if (Array.isArray(parsed.logs)) {
        for (const l of parsed.logs) {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pkl_logs', l.id), l);
        }
      }
      if (Array.isArray(parsed.projects)) {
        for (const p of parsed.projects) {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'pkl_projects', p.id), p);
        }
      }
      setJsonInputText('');
      showToast('Data JSON berhasil di-import ke Cloud!');
    } catch (err) {
      console.error('Import error:', err);
      showToast('Format JSON tidak valid!', 'error');
    }
  };

  const formatDateIndo = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const renderProjectPreview = (proj) => {
    switch (proj.previewType) {
      case 'web':
        return (
          <div className="h-32 w-full bg-slate-950 rounded-lg border border-slate-800 p-3 flex flex-col justify-between relative overflow-hidden group-hover:border-yellow-400/50 transition-colors">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              <span className="ml-2 text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded">localhost/pkl-system</span>
            </div>
            <div className="grid grid-cols-3 gap-2 my-auto pt-2">
              <div className="col-span-1 bg-slate-900/90 h-14 rounded border border-slate-800 p-1.5 flex flex-col gap-1">
                <div className="h-1.5 w-10 bg-yellow-400/70 rounded"></div>
                <div className="h-1 w-8 bg-slate-700 rounded"></div>
                <div className="h-1 w-12 bg-slate-700 rounded"></div>
              </div>
              <div className="col-span-2 bg-slate-900/60 h-14 rounded border border-slate-800 p-2 flex flex-col justify-between">
                <div className="h-2 w-2/3 bg-slate-700 rounded"></div>
                <div className="flex gap-1">
                  <span className="h-3.5 px-1.5 bg-yellow-400/20 border border-yellow-400/50 rounded text-[8px] text-yellow-300 flex items-center justify-center font-bold">DEPLOYED</span>
                  <span className="h-3.5 w-12 bg-slate-800 rounded"></span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'network':
        return (
          <div className="h-32 w-full bg-slate-950 rounded-lg border border-slate-800 p-3 flex flex-col items-center justify-center relative overflow-hidden group-hover:border-yellow-400/50 transition-colors">
            <div className="flex items-center gap-6">
              <div className="w-9 h-9 rounded-lg bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 text-xs font-mono font-bold">RTR</div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-red-500 to-yellow-400 relative">
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-yellow-950/80 border border-yellow-400/50 flex items-center justify-center text-yellow-400 text-xs font-mono font-bold">SW</div>
            </div>
            <div className="w-0.5 h-4 bg-slate-700"></div>
            <div className="flex gap-3">
              <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[9px] text-slate-300 font-mono">NODE-01</div>
              <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[9px] text-slate-300 font-mono">NODE-02</div>
              <div className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[9px] text-yellow-400 font-mono">LAN OK</div>
            </div>
          </div>
        );
      case 'archive':
      case 'doc':
        return (
          <div className="h-32 w-full bg-slate-950 rounded-lg border border-slate-800 p-3 flex flex-col justify-between relative overflow-hidden group-hover:border-yellow-400/50 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-yellow-400 bg-yellow-950/50 px-2 py-0.5 rounded border border-yellow-500/30 font-bold">E-ARSIP DATABASE</span>
              <span className="text-[10px] text-emerald-400 font-mono">✓ VERIFIED</span>
            </div>
            <div className="space-y-1.5 my-auto">
              <div className="h-4 bg-slate-900 rounded border border-slate-800 px-2 flex items-center justify-between text-[9px] text-slate-300">
                <span>📁 Arsip_Surat_2026.pdf</span>
                <span className="text-yellow-400 font-bold">250 File</span>
              </div>
              <div className="h-4 bg-slate-900 rounded border border-slate-800 px-2 flex items-center justify-between text-[9px] text-slate-300">
                <span>📁 Rekap_Data_PKL.xlsx</span>
                <span className="text-red-400 font-bold">250 File</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-32 w-full bg-slate-950 rounded-lg border border-slate-800 p-3 flex flex-col justify-between relative overflow-hidden group-hover:border-yellow-400/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-yellow-400 font-bold">SYS_OPS // ACTIVE</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="grid grid-cols-3 gap-2 my-auto">
              <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                <div className="text-xs font-bold text-white">99.9%</div>
                <div className="text-[9px] text-slate-500">Ready</div>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                <div className="text-xs font-bold text-yellow-400">FULL</div>
                <div className="text-[9px] text-slate-500">Support</div>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                <div className="text-xs font-bold text-emerald-400">OK</div>
                <div className="text-[9px] text-slate-500">Status</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 font-sans selection:bg-yellow-400 selection:text-black">
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-2xl border backdrop-blur-md transition-all animate-bounce bg-zinc-900/95 border-yellow-400 text-sm">
          {notification.type === 'error' ? (
            <X className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-yellow-400" />
          )}
          <span className="font-bold tracking-wide uppercase text-xs">{notification.message}</span>
        </div>
      )}

      {activeMode === 'presentasi' ? (
        <div>
          {/* ========================================== */}
          {/* THE FINALS 2D SVG CHARACTER STAGE          */}
          {/* ========================================== */}
          <section className="relative w-full min-h-[640px] lg:min-h-[700px] overflow-hidden flex flex-col justify-between select-none border-b-4 border-yellow-400">
            {/* Crimson Red Diagonal Background */}
            <div
              className="absolute inset-0 z-0"
              style={{
                background: 'linear-gradient(180deg, #991b1b 0%, #dc2626 52%, #450a0a 86%, #09090b 100%)'
              }}
            />
            <div
              className="absolute inset-0 z-0 opacity-35 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(-25deg, rgba(0,0,0,0.48) 0px, rgba(0,0,0,0.48) 140px, transparent 140px, transparent 290px)'
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-48 z-10 pointer-events-none"
              style={{
                background: 'linear-gradient(to top, #07080c 10%, rgba(15, 4, 7, 0.78) 55%, transparent 100%)'
              }}
            />

            {/* Top Bar Navigation & Info */}
            <div className="relative z-30 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 40 40" className="w-7 h-7 fill-white">
                    <path d="M20 5 L36 33 L28 33 L20 18 L12 33 L4 33 Z" />
                    <path d="M19 23 L25 33 L15 33 Z" fill="#facc15" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-baseline gap-3">
                    <h1 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                      SELECT CONTESTANT
                    </h1>
                    <span className="text-[11px] sm:text-xs font-extrabold italic uppercase tracking-widest text-yellow-300 hidden md:inline">
                      THE FINALS SQUAD // LAPORAN PKL
                    </span>
                  </div>
                  <p className="text-[11px] text-red-100/90 font-medium tracking-wide uppercase">
                    Pilih Karakter Anggota Kelompok • Gunakan Tombol Panah Kiri/Kanan di Keyboard
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setAdminActiveMemberId(activeMember?.id);
                    setActiveMode('admin');
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-black/85 hover:bg-yellow-400 text-white hover:text-black border border-yellow-400/70 font-black italic uppercase text-xs tracking-wider transition-all shadow-lg"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Input Data & Ganti Profil (Admin)</span>
                </button>
              </div>
            </div>

            {/* SVG Character Display Stage */}
            <div className="relative z-20 max-w-5xl w-full mx-auto px-4 py-4 flex items-center justify-center gap-4 sm:gap-8">
              {displayMembers.map((m, idx) => {
                const isSelected = m.id === activeMember?.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMemberId(m.id)}
                    className={`cursor-pointer transition-all duration-300 flex flex-col items-center group ${
                      isSelected
                        ? 'scale-110 -translate-y-4 z-30 drop-shadow-[0_0_25px_rgba(250,204,21,0.7)]'
                        : 'scale-90 opacity-60 hover:opacity-100 hover:scale-95'
                    }`}
                  >
                    <div className="w-28 sm:w-36 md:w-44 h-40 sm:h-52 md:h-60 relative flex items-end justify-center">
                      <SquadSVGAvatar memberId={m.id} tintColor={m.tintColor} isSelected={isSelected} />
                    </div>
                    <div className={`mt-2 px-3 py-1 rounded text-center transition-all ${
                      isSelected ? 'bg-yellow-400 text-black font-black italic uppercase text-xs shadow-lg' : 'bg-black/60 text-white font-bold text-[11px]'
                    }`}>
                      {m.name}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Contestant Card & Navigation */}
            <div className="relative z-30 w-full max-w-xl mx-auto px-4 pb-6">
              <div className="flex items-stretch bg-black/85 backdrop-blur-md border border-yellow-400/60 shadow-2xl rounded-xl overflow-hidden">
                <button
                  onClick={handlePrevContestant}
                  className="px-4 flex items-center justify-center text-white/70 hover:text-yellow-400 hover:bg-white/5 border-r border-white/10 transition-colors"
                  title="Sebelumnya (ArrowLeft)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex-1 py-3 px-4 text-center space-y-1">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-[10px] font-black italic uppercase tracking-widest px-2 py-0.5 bg-red-600 text-white rounded">
                      {activeMember?.buildType || 'MEDIUM BUILD'}
                    </span>
                    <span className="text-xs font-extrabold italic uppercase tracking-wider text-yellow-400">
                      // {activeMember?.name}
                    </span>
                  </div>

                  <h2 className="text-sm sm:text-base font-black italic uppercase tracking-wider text-white">
                    {activeMember?.role}
                  </h2>

                  <p className="text-[11px] sm:text-xs text-zinc-300 leading-relaxed line-clamp-2 max-w-md mx-auto">
                    {activeMember?.bio || 'Berfokus pada penyelesaian target program kerja PKL, kolaborasi tim, dan dokumentasi kegiatan harian.'}
                  </p>
                </div>

                <button
                  onClick={handleNextContestant}
                  className="px-4 flex items-center justify-center text-white/70 hover:text-yellow-400 hover:bg-white/5 border-l border-white/10 transition-colors"
                  title="Berikutnya (ArrowRight)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <button
                onClick={handleSelectAndScroll}
                className="mt-2.5 w-full py-2.5 bg-[#facc15] hover:bg-[#fde047] active:scale-[0.99] text-black font-black italic uppercase tracking-widest text-sm sm:text-base shadow-[0_6px_25px_rgba(250,204,21,0.4)] transition-all flex items-center justify-center gap-2 rounded-lg"
              >
                <span>SELECT // LIHAT LAPORAN {activeMember?.name}</span>
              </button>
            </div>
          </section>

          {/* ========================================== */}
          {/* LOGBOOK & PROJECTS SECTION                 */}
          {/* ========================================== */}
          <div ref={reportSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-extrabold italic uppercase tracking-widest text-yellow-400">
                  <Crosshair className="w-4 h-4 text-red-500" />
                  <span>DATA LAPORAN CONTESTANT AKTIF</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white">
                  LOGBOOK & PROJECT:{' '}
                  <span className="text-yellow-400 underline decoration-red-600 decoration-4 underline-offset-4">
                    {activeMember?.name}
                  </span>
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {['Semua Bulan', 'Bulan 1', 'Bulan 2', 'Bulan 3'].map((bulan) => (
                  <button
                    key={bulan}
                    onClick={() => setSelectedMonth(bulan)}
                    className={`px-3.5 py-1.5 rounded font-bold uppercase text-xs tracking-wider transition-all ${
                      selectedMonth === bulan
                        ? 'bg-yellow-400 text-black shadow-md'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {bulan}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Logbook Timeline */}
              <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-base font-black italic uppercase tracking-wider text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-yellow-400" />
                      <span>Logbook / Jurnal Harian ({filteredLogs.length})</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Catatan kegiatan harian {activeMember?.name} sesuai buku laporan PKL
                    </p>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari kegiatan..."
                      className="bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400 w-full sm:w-44"
                    />
                  </div>
                </div>

                {filteredLogs.length === 0 ? (
                  <div className="text-center py-12 px-4 border border-dashed border-zinc-800 rounded-xl">
                    <p className="text-zinc-400 text-sm">
                      Belum ada catatan kegiatan untuk <strong className="text-white">{activeMember?.name}</strong> pada filter <strong className="text-yellow-400">{selectedMonth}</strong>.
                    </p>
                    <button
                      onClick={() => {
                        setAdminActiveMemberId(activeMember?.id);
                        setActiveMode('admin');
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded bg-yellow-400 text-black text-xs font-black italic uppercase hover:bg-yellow-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Input Kegiatan {activeMember?.name} Sekarang</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-yellow-400 before:via-red-600 before:to-zinc-800">
                    {filteredLogs.map((log, index) => {
                      const isExpanded = expandedLogIds.includes(log.id) || index === 0;
                      return (
                        <div
                          key={log.id}
                          className={`relative rounded-xl border transition-all ${
                            isExpanded
                              ? 'bg-zinc-900/95 border-yellow-400/50 shadow-lg'
                              : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700'
                          }`}
                        >
                          <span
                            className={`absolute -left-[22px] top-5 w-3.5 h-3.5 rounded-full border-2 ${
                              index === 0
                                ? 'bg-yellow-400 border-black shadow-[0_0_10px_#facc15]'
                                : 'bg-red-600 border-zinc-950'
                            }`}
                          ></span>

                          <button
                            onClick={() => toggleLogExpand(log.id)}
                            className="w-full text-left p-4 flex items-start justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                                <span className="font-mono text-yellow-400 font-bold">
                                  {formatDateIndo(log.date)}
                                </span>
                                <span>•</span>
                                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase">
                                  {log.month}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-red-950/90 border border-red-500/40 text-red-300 text-[10px] font-bold uppercase">
                                  {log.category}
                                </span>
                              </div>
                              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                                {log.title}
                              </h4>
                            </div>

                            <div className="p-1 rounded bg-zinc-800 text-zinc-400 shrink-0 mt-1">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-4 pb-4 pt-1 border-t border-zinc-800/70 space-y-3">
                              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                                {log.description}
                              </p>

                              {log.imageUrl && (
                                <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 max-h-52">
                                  <img
                                    src={log.imageUrl}
                                    alt={log.title}
                                    className="w-full h-44 object-cover opacity-90 hover:opacity-100 transition-opacity"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Status: {log.status || 'Selesai'}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Featured Projects */}
              <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="border-b border-zinc-800 pb-4">
                  <h3 className="text-base font-black italic uppercase tracking-wider text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-yellow-400" />
                    <span>Featured Projects / Hasil Kerja</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Output & kontribusi utama {activeMember?.name} selama PKL
                  </p>
                </div>

                {filteredProjects.length === 0 ? (
                  <div className="text-center py-10 px-4 border border-dashed border-zinc-800 rounded-xl">
                    <p className="text-zinc-400 text-xs">
                      Belum ada Featured Project untuk {activeMember?.name}.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {filteredProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="group bg-zinc-900/95 border border-zinc-800 hover:border-yellow-400/60 rounded-xl p-4 transition-all duration-300 space-y-3 shadow-md"
                      >
                        {renderProjectPreview(proj)}

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors">
                              {proj.title}
                            </h4>
                            {proj.metric && (
                              <span className="shrink-0 px-2 py-0.5 rounded bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 text-[10px] font-black uppercase">
                                {proj.metric}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            {proj.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(proj.tags || []).map((tag, i) => (
                            <span
                              key={i}
                              className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                i % 2 === 0
                                  ? 'bg-zinc-800 text-yellow-300 border-yellow-500/30'
                                  : 'bg-red-950/60 text-red-300 border-red-500/30'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================== */
        /* ADMIN CONTROL PANEL                        */
        /* ========================================== */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="bg-gradient-to-r from-red-950/80 via-zinc-900 to-zinc-900 border border-red-500/40 rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-yellow-400 text-xs font-black italic uppercase tracking-wider">
                <LayoutDashboard className="w-4 h-4" />
                <span>CONTESTANT CONTROL PANEL // INPUT DATA MANDIRI</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black italic uppercase text-white">
                Pilih Namamu & Update Isi Buku Laporan PKL 👇
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300">
                Ahmad, Abimanyu, Rafly, Fero, dan Alfi bisa input kegiatan harian, project, atau ganti profil masing-masing di sini!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-black/80 border border-yellow-400/50 rounded-xl p-2.5 flex items-center gap-2.5">
                <span className="text-xs text-zinc-400 font-bold uppercase">Contestant:</span>
                <select
                  value={adminActiveMemberId}
                  onChange={(e) => {
                    setAdminActiveMemberId(e.target.value);
                    setSelectedMemberId(e.target.value);
                    setEditingLogId(null);
                    setEditingProjectId(null);
                  }}
                  className="bg-zinc-900 text-yellow-400 font-black uppercase text-sm px-3 py-1.5 rounded border border-zinc-700 focus:outline-none focus:border-yellow-400"
                >
                  {displayMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} — {m.role}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setActiveMode('presentasi')}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black italic uppercase text-xs tracking-wider shadow-lg"
              >
                <Presentation className="w-4 h-4" />
                <span>Kembali ke Panggung</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
            <button
              onClick={() => setAdminTab('input-log')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-black italic uppercase transition-all ${
                adminTab === 'input-log'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>1. Jurnal Harian ({adminMemberLogs.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('input-project')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-black italic uppercase transition-all ${
                adminTab === 'input-project'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>2. Featured Project ({adminMemberProjects.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('profil-karakter')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-black italic uppercase transition-all ${
                adminTab === 'profil-karakter'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>3. Kustomisasi Profil ({adminCurrentMember?.name})</span>
            </button>

            <button
              onClick={() => setAdminTab('kelola-anggota')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-black italic uppercase transition-all ${
                adminTab === 'kelola-anggota'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>4. Tambah Contestant</span>
            </button>

            <button
              onClick={() => setAdminTab('backup')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-black italic uppercase transition-all ${
                adminTab === 'backup'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Backup JSON</span>
            </button>
          </div>

          {adminTab === 'input-log' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <form
                onSubmit={handleSaveLog}
                className="lg:col-span-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-base font-black italic uppercase text-white">
                    {editingLogId ? '✏️ Edit Kegiatan' : `➕ Input Jurnal (${adminCurrentMember?.name})`}
                  </h3>
                  {editingLogId && (
                    <button
                      type="button"
                      onClick={() => setEditingLogId(null)}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Tanggal Kegiatan</label>
                    <input
                      type="date"
                      required
                      value={logForm.date}
                      onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Periode Bulan</label>
                    <select
                      value={logForm.month}
                      onChange={(e) => setLogForm({ ...logForm, month: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value="Bulan 1">Bulan 1</option>
                      <option value="Bulan 2">Bulan 2</option>
                      <option value="Bulan 3">Bulan 3</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Judul Kegiatan Hari Ini</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Crimping Kabel LAN / Slicing UI / Rekap Arsip"
                    value={logForm.title}
                    onChange={(e) => setLogForm({ ...logForm, title: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Deskripsi Detail Pekerjaan</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan detail kegiatan seperti di buku jurnal PKL..."
                    value={logForm.description}
                    onChange={(e) => setLogForm({ ...logForm, description: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Kategori</label>
                    <select
                      value={logForm.category}
                      onChange={(e) => setLogForm({ ...logForm, category: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value="Web Dev">Web Dev</option>
                      <option value="IT Support">IT Support</option>
                      <option value="Jaringan">Jaringan</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Arsip">Arsip</option>
                      <option value="Administrasi">Administrasi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Status</label>
                    <select
                      value={logForm.status}
                      onChange={(e) => setLogForm({ ...logForm, status: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value="Selesai">Selesai</option>
                      <option value="Proses">Proses / Berlanjut</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Link Foto Dokumentasi (Opsional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={logForm.imageUrl}
                    onChange={(e) => setLogForm({ ...logForm, imageUrl: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {PRESET_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setLogForm({ ...logForm, imageUrl: img.url })}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-yellow-300 border border-zinc-700"
                      >
                        + {img.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-black italic uppercase text-sm shadow-lg transition-all"
                >
                  {editingLogId ? 'Simpan Perubahan' : `Simpan Jurnal ${adminCurrentMember?.name}`}
                </button>
              </form>

              <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-base font-black italic uppercase text-white border-b border-zinc-800 pb-3">
                  Daftar Jurnal Milik <span className="text-yellow-400">{adminCurrentMember?.name}</span> ({adminMemberLogs.length})
                </h3>

                <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                  {adminMemberLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                          <span className="text-yellow-400 font-mono font-bold">{log.date}</span>
                          <span>•</span>
                          <span>{log.month}</span>
                          <span>•</span>
                          <span className="text-zinc-300 font-semibold">{log.category}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{log.title}</h4>
                        <p className="text-xs text-zinc-400 line-clamp-2">{log.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleEditLogClick(log)}
                          className="p-2 rounded bg-zinc-800 hover:bg-yellow-400 hover:text-black text-zinc-300 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLog(log.id)}
                          className="p-2 rounded bg-zinc-800 hover:bg-rose-500 text-zinc-300 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'input-project' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <form
                onSubmit={handleSaveProject}
                className="lg:col-span-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4"
              >
                <h3 className="text-base font-black italic uppercase text-white border-b border-zinc-800 pb-3">
                  {editingProjectId ? '✏️ Edit Project' : `🚀 Tambah Project (${adminCurrentMember?.name})`}
                </h3>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Nama Project / Hasil Kerja Utama</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Aplikasi SIARSIP / Topologi Jaringan"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Deskripsi Singkat</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Jelaskan hasil kerja ini..."
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Highlight Angka / Metric</label>
                    <input
                      type="text"
                      placeholder="Misal: 500+ Arsip / 100% Digital"
                      value={projectForm.metric}
                      onChange={(e) => setProjectForm({ ...projectForm, metric: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Visual Card</label>
                    <select
                      value={projectForm.previewType}
                      onChange={(e) => setProjectForm({ ...projectForm, previewType: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                    >
                      <option value="web">Mockup Aplikasi Web</option>
                      <option value="archive">Database Arsip & Surat</option>
                      <option value="network">Topologi Jaringan LAN</option>
                      <option value="dashboard">System Monitor / Hardware</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Tech Stack / Tags (Pisahkan koma)</label>
                  <input
                    type="text"
                    placeholder="React, Tailwind, Networking, Excel"
                    value={projectForm.tagsInput}
                    onChange={(e) => setProjectForm({ ...projectForm, tagsInput: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-yellow-400 text-black font-black italic uppercase text-sm"
                >
                  {editingProjectId ? 'Update Project' : 'Simpan Project'}
                </button>
              </form>

              <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-base font-black italic uppercase text-white border-b border-zinc-800 pb-3">
                  Daftar Project <span className="text-yellow-400">{adminCurrentMember?.name}</span>
                </h3>
                <div className="space-y-3">
                  {adminMemberProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                        <p className="text-xs text-zinc-400">{proj.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProjectClick(proj)}
                          className="p-2 rounded bg-zinc-800 hover:bg-yellow-400 hover:text-black text-zinc-300"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-2 rounded bg-zinc-800 hover:bg-rose-500 text-zinc-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'profil-karakter' && (
            <div className="max-w-2xl bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-5">
              <div className="space-y-1">
                <h3 className="text-lg font-black italic uppercase text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-yellow-400" />
                  <span>Kustomisasi Profil & Peran: <span className="text-yellow-400">{adminCurrentMember?.name}</span></span>
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Sesuaikan nama, role, tipe postur tubuh, dan warna aura kontestan sesuai identitas kelompok PKL kamu.
                </p>
              </div>

              <form onSubmit={handleSaveContestantProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Nama Contestant</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Tipe Postur Tubuh (Build)</label>
                    <select
                      value={profileForm.buildType}
                      onChange={(e) => setProfileForm({ ...profileForm, buildType: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      <option value="LIGHT BUILD">LIGHT BUILD</option>
                      <option value="MEDIUM BUILD">MEDIUM BUILD</option>
                      <option value="HEAVY BUILD">HEAVY BUILD</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Role / Spesialisasi Pekerjaan</label>
                    <input
                      type="text"
                      required
                      value={profileForm.role}
                      onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Warna Aura / Spotlight</label>
                    <input
                      type="color"
                      value={profileForm.tintColor}
                      onChange={(e) => setProfileForm({ ...profileForm, tintColor: e.target.value })}
                      className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Deskripsi Singkat Bio</label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-black italic uppercase text-sm shadow-lg"
                >
                  Simpan Perubahan Profil
                </button>
              </form>
            </div>
          )}

          {adminTab === 'kelola-anggota' && (
            <div className="max-w-xl bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-black italic uppercase text-white">Tambah Contestant Baru</h3>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Dimas"
                    value={newMemberForm.name}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Role / Fokus PKL</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: NETWORK & HARDWARE OPS"
                    value={newMemberForm.role}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-yellow-400 text-black font-black italic uppercase text-sm"
                >
                  + Tambahkan ke Panggung
                </button>
              </form>
            </div>
          )}

          {adminTab === 'backup' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-black italic uppercase text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-yellow-400" />
                  <span>Download Backup Data (JSON)</span>
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Unduh seluruh data kegiatan dan project kelima anggota menjadi 1 file `.json`.
                </p>
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2.5 rounded-lg bg-yellow-400 text-black text-xs font-black italic uppercase flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export backup_pkl.json</span>
                </button>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-black italic uppercase text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Restore / Import JSON</span>
                </h3>
                <textarea
                  rows={4}
                  placeholder="Paste isi file backup JSON di sini..."
                  value={jsonInputText}
                  onChange={(e) => setJsonInputText(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-300"
                />
                <button
                  onClick={handleImportJSON}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-black italic uppercase text-xs"
                >
                  Import & Sinkronkan Data
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}