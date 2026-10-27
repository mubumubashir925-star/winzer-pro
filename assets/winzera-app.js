
let deferredPrompt = null;
let installBannerClosed = false;

function closeInstallBanner() {
    installBannerClosed = true;

    var banner = document.getElementById('installBanner');
    if (banner) banner.style.display = 'none';
}

// =============================================
// APP VERSION & CHANGELOG
// =============================================
var APP_VERSION = '2.0.0';   // Must match CACHE_VERSION in sw.js (or keep separate)
var CHANGELOG = [
  { version: '2.0.0', date: '2026-08-18', changes: [
    '<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> <b>Role-Based Access</b> — Admin and Team Manager roles with separate logins. Team Managers see only their team\'s data and have a dedicated dashboard with tailored actions.',
    '<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> <b>Team Manager Dashboard</b> — a tailored home screen for team managers showing their roster, item limits, and quick access to Assign Items, Reports, and Data Sync.',
    '<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg> <b>Multi-Day Festivals</b> — support for events spanning multiple days. Each item can have its own date, and the schedule groups items by day with automatic day-of-week labels.',
    '<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> <b>Stage Management</b> — create, rename, and delete stages (e.g. Main Hall, Seminar Room). Items are assigned to a stage and appear grouped by stage in the Schedule report.',
    '<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5-11 11"/></svg> <b>Poster Design — Rank Badge Style</b> — choose from Classic Ribbon, Minimalist Badge, 3D Shield, or Emoji Medals for your public podium posters. Saved per festival.',
    '<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><path d="M8 12h8"/><path d="M8 16h5"/></svg> <b>Certificate Design — Signatory Management</b> — add up to 3 signatories with names, designations, and transparent PNG signatures. Custom backgrounds and A4 Portrait/Landscape support.',
    '<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M8 14h8"/><path d="M8 18h5"/></svg> <b>Schedule Report</b> — print or view a full timetable of all items, grouped by date and stage, with 12-hour AM/PM times and day-of-week headers.',
    '<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> <b>Custom Bonus Points</b> — award extra points to any team with a reason and amount. Bonus history is tracked and editable. Points appear in Team Points totals with a +bonus breakdown.',
    '<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> <b>Grade & Rank Points Toggles</b> — globally enable or disable Grade Points and Rank Points. Turning either off removes that component from every total — team, individual, section, and champion — instantly recalculated.',
    '<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z"/></svg> <b>Personalize Folder</b> — choose your Accent Color (Violet, Electric Blue, Emerald, Amber, Crimson), set Text Case (UPPER CASE or Title Case), and a global Print Text Size (Normal or Big) for all reports and PDFs.',
    '<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> <b>Sync & Sharing Enhancements</b> — QR‑Based Sync (Master Config & Team Sync), Wi‑Fi Direct (P2P) Sync for device‑to‑device transfer, and File‑Based Config Import/Export. Team Managers can send their entries to Admin; Admin can broadcast the master setup.',
    '<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg> <b>Notable Bug Fixes & Minor Improvements</b> — Android hardware back button now steps back one level at a time (modal → previous page → Dashboard) instead of closing the app. Fixed duplicate item IDs, item code reuse, and dense (non‑skipping) rank ties across all reports and posters.'
  ]}
];

// Improved Toast Function
function toast(message, type = 'success') {
    // Remove any existing toast
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var t = document.createElement('div');
    t.className = 'toast';
    if (type === 'error' || type === 'danger') t.classList.add('error');
    
    t.innerHTML = message;
    document.body.appendChild(t);

    // Auto dismiss after 2.5 seconds
    setTimeout(function() {
        if (t.parentNode) {
            t.style.transition = 'opacity 0.3s ease';
            t.style.opacity = '0';
            setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
        }
    }, 2500);
}
// UI-styled alert dialog (replaces native browser alert()) — floats above any open
// modal without touching modalContent, so it's safe to use mid-modal.
function showUiAlert(message, onOk){
  var existing=document.getElementById('uiAlertOverlay'); if(existing) existing.remove();
  var ov=document.createElement('div');
  ov.id='uiAlertOverlay';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px';
  function dismiss(){ ov.remove(); if(onOk) onOk(); }
  ov.onclick=function(e){ if(e.target===ov) dismiss(); };
  ov.innerHTML='<div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px;max-width:320px;width:100%;box-shadow:var(--shadow)">'
    +'<div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:16px">'
    +'<div style="font-size:1.6rem;line-height:1"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg></div>'
    +'<div><div style="font-size:.74rem;font-weight:800;color:var(--red);margin-bottom:4px;letter-spacing:.3px">CAN\'T ADD THIS</div>'
    +'<div style="font-size:.86rem;color:var(--text);line-height:1.4">'+message+'</div></div>'
    +'</div>'
    +'<button id="uiAlertOkBtn" class="btn btn-primary" style="width:100%">OK</button>'
    +'</div>';
  document.body.appendChild(ov);
  document.getElementById('uiAlertOkBtn').onclick=dismiss;
}
// =============================================
// DATA LAYER — In-memory cache only (Winzera is fully online)
// _mem is populated fresh every launch from Supabase (pullOrgSnapshot for
// admins, teamFetchDashboard for team managers) and kept current by realtime.
// Nothing here is persisted to disk — there is no offline mode, so a device
// with no verified server session always starts from a clean, empty cache
// rather than showing stale/local data.
// =============================================
var _mem = {
  config: null, teams: [], sections: [], items: [],
  participants: [], marks: [], groups: [], bonuses: []
};

var _CFG_DEFAULTS = {festName:'Winzera',tagline:'',institution:'Mubjan World',year:new Date().getFullYear(),maxJudges:3,maxMarks:100,indvAp:10,indvA:8,indvBp:6,indvB:4,indvC:2,grpAp:15,grpA:12,grpBp:9,grpB:6,grpC:3,indvRank1:0,indvRank2:0,indvRank3:0,grpRank1:0,grpRank2:0,grpRank3:0,gradePointsEnabled:true,rankPointsEnabled:true,maxStageEvents:3,maxOffStageEvents:5,maxOpenSection:2,scheduleEnabled:true,durationMode:'single',dateStart:'',dateEnd:'',stages:[{id:'stg_default',name:'Main Stage'}]};

// ── Multi-day date formatting ──
// Single day (or legacy `date` field): returns the date formatted like "2026 August 6".
// Multi-day with consecutive dates in the same month/year: "2026 August 6, 7, 8".
// Multi-day spanning months/years: a readable range.
function _fmtDateParts(d){
  var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
  return {y:d.getFullYear(),m:d.getMonth(),mName:MONTHS[d.getMonth()],day:d.getDate()};
}
function formatFestDate(cfg){
  cfg = cfg || {};
  if(cfg.durationMode==='multi' && cfg.dateStart && cfg.dateEnd){
    var start=new Date(cfg.dateStart+'T00:00:00'), end=new Date(cfg.dateEnd+'T00:00:00');
    if(isNaN(start)||isNaN(end)) return cfg.dateStart||'';
    if(end<start){ var tmp=start; start=end; end=tmp; }
    var days=[];
    var cur=new Date(start);
    while(cur<=end){ days.push(new Date(cur)); cur.setDate(cur.getDate()+1); }
    var sp=_fmtDateParts(start), ep=_fmtDateParts(end);
    if(sp.y===ep.y && sp.m===ep.m){
      var dayNums=days.map(function(d){return d.getDate();}).join(', ');
      return sp.y+' '+sp.mName+' '+dayNums;
    }
    var startStr=sp.y+' '+sp.mName+' '+sp.day;
    var endStr=(sp.y!==ep.y?ep.y+' ':'')+ep.mName+' '+ep.day;
    return startStr+' - '+endStr;
  }
  var raw=cfg.date||cfg.dateStart||'';
  if(!raw) return '';
  var d=new Date(raw+'T00:00:00');
  if(isNaN(d)) return raw;
  var p=_fmtDateParts(d);
  return p.y+' '+p.mName+' '+p.day;
}

// ---- Stage helpers ----
function _getStages(cfg){
  cfg=cfg||DB.config();
  var stages=(cfg.stages||[]).filter(function(s){ return s && s.id && s.name; });
  if(!stages.length) stages=[{id:'stg_default',name:'Main Stage'}];
  return stages;
}
function _getItemStageId(item, cfg){
  cfg=cfg||DB.config();
  var stages=_getStages(cfg);
  if(item && item.stageId){
    var found=stages.find(function(s){ return s.id===item.stageId; });
    if(found) return found.id;
  }
  // Backward compatibility: legacy items only had a numeric stageNo (1-based index)
  var idx=((item&&item.stageNo)||1)-1;
  if(stages[idx]) return stages[idx].id;
  return stages[0].id;
}
function _getStageName(stageId, cfg){
  var stages=_getStages(cfg);
  var s=stages.find(function(x){ return x.id===stageId; });
  return s ? s.name : stages[0].name;
}

// ---- Date & day-name helpers (schedule) ----
var _DAY_NAMES=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function _dayNameFromISO(iso){
  if(!iso) return '';
  var d=new Date(iso+'T00:00:00');
  if(isNaN(d)) return '';
  return _DAY_NAMES[d.getDay()];
}
function _fmtScheduleDate(iso){
  if(!iso) return '';
  var d=new Date(iso+'T00:00:00');
  if(isNaN(d)) return iso;
  var p=_fmtDateParts(d);
  return (p.day<10?'0'+p.day:p.day)+' '+p.mName+' '+p.y;
}
// Returns the item's schedule date (YYYY-MM-DD). Single-day fests: every item
// shares the one fest date. Multi-day fests: each item carries its own date.
function _getItemDate(item, cfg){
  cfg=cfg||DB.config();
  if(cfg.durationMode==='multi') return (item&&item.date) || cfg.dateStart || '';
  return cfg.date || cfg.dateStart || '';
}
// 24h "HH:MM" -> "09:30 AM" / "02:30 PM"
// =============================================
// 12-HOUR (AM/PM) TIME PICKER
// =============================================
function _time12hPickerHTML(hiddenId, val24){
  // Uses the device's native standard time picker (clock/wheel UI), which
  // correctly supports 12-hour AM/PM entry on virtually every phone.
  // We deliberately do NOT rebuild this input's DOM on every change (that
  // was what caused the old bug where picking AM/PM flipped the display
  // back to 24-hour) — we only update a small read-only preview alongside it.
  return '<div id="'+hiddenId+'-picker">'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" type="time" id="'+hiddenId+'" value="'+(val24||'')+'" style="margin-bottom:4px" oninput="_time12hPreview(\''+hiddenId+'\')" onchange="_time12hPreview(\''+hiddenId+'\')">'
    +'<div id="'+hiddenId+'-preview" style="font-size:.75rem;color:var(--accent);font-weight:700;min-height:16px">'+(val24?_fmtTime12h(val24):'')+'</div>'
    +'</div>';
}
function _time12hPreview(hiddenId){
  var input=document.getElementById(hiddenId);
  var preview=document.getElementById(hiddenId+'-preview');
  if(!input||!preview) return;
  preview.textContent = input.value ? _fmtTime12h(input.value) : '';
}
function _fmtTime12h(hhmm){
  if(!hhmm) return '';
  var parts=hhmm.split(':');
  var h=parseInt(parts[0],10), m=parts[1]||'00';
  if(isNaN(h)) return hhmm;
  var ap=h>=12?'PM':'AM';
  var h12=h%12; if(h12===0) h12=12;
  return (h12<10?'0'+h12:h12)+':'+m+' '+ap;
}

var DB = {
  config:      function(){ return _mem.config || Object.assign({},_CFG_DEFAULTS); },
  saveConfig:  function(c){ _mem.config=c; _wzSyncPush('pushConfig', c); },
  teams:       function(){ return _mem.teams||[]; },
  saveTeams:   function(v){ _mem.teams=v; _wzSyncPush('pushTeams', v); },
  sections:    function(){ return _mem.sections||[]; },
  saveSections:function(v){ _mem.sections=v; _wzSyncPush('pushSections', v); },
  items:       function(){ return _mem.items||[]; },
  saveItems:   function(v){ _mem.items=v; _wzSyncPush('pushItems', v); },
  participants:function(){ return _mem.participants||[]; },
  saveParticipants:function(v){ _mem.participants=v; _wzSyncPush('pushParticipants', v); },
  marks:       function(){ return _mem.marks||[]; },
  saveMarks:   function(v){ _mem.marks=v; _wzSyncPush('pushMarks', v); },
  groups:      function(){ return _mem.groups||[]; },
  saveGroups:  function(v){ _mem.groups=v; _wzSyncPush('pushGroups', v); },
  bonuses:     function(){ return _mem.bonuses||[]; },
  saveBonuses: function(v){ _mem.bonuses=v; _wzSyncPush('pushBonuses', v); },
};

// ============================================
// SUPABASE SYNC BOOTSTRAP
// Fire-and-forget push after any local save (admin session only — team
// managers write through their own RPCs, not this generic path). Never
// throws into the caller; sync problems are logged, not surfaced as UI
// errors, so the app stays fully usable offline.
// ============================================
// MARKS SHAPE RECOMPUTE
// Supabase only stores the authoritative raw scores (mark1/mark2/mark3)
// and total. Everything else the UI displays — maximum, pct, grade, point
// — is derived from those plus config (maxJudges/maxMarks/grade
// thresholds), exactly the way saveInlineMarks() computes it locally. So
// rather than trying to sync those derived fields too, just recompute them
// fresh every time marks are pulled — guarantees they can never drift out
// of sync with whatever the config currently says.
// ============================================
function _wzRecomputeMarksShape(marksArray, itemsArray, cfg){
  var numJudges=parseInt(cfg.maxJudges)||3, maxPerJudge=parseInt(cfg.maxMarks)||100;
  var maximum=numJudges*maxPerJudge;
  var itemsById={}; (itemsArray||[]).forEach(function(i){ itemsById[i.id]=i; });
  return (marksArray||[]).map(function(m){
    var pct=maximum>0?Math.min(100,(m.total/maximum)*100):0;
    var grade=calcGrade(pct);
    var item=itemsById[m.itemId];
    var isGroup=!!(item&&item.type==='group');
    var gradePts=(cfg.gradePointsEnabled===false)?0:(isGroup?calcGrpGradePoints(grade,cfg):calcIndvGradePoints(grade,cfg));
    // The marks table has no "point" column — only grade + rank are stored —
    // so point (grade points + rank bonus) has to be rebuilt here on every
    // pull, the same way assignRanks() builds it at declare time. This used
    // to rebuild only the grade-points half and silently drop the rank
    // bonus, so any previously-declared item's shown points fell back to
    // grade-only the moment a refresh, a fresh login, or even the routine
    // background realtime sync re-ran this function.
    var b1,b2,b3;
    if(item&&item.customRankBonus){
      b1=parseInt(item.rankBonus1)||0;
      b2=parseInt(item.rankBonus2)||0;
      b3=parseInt(item.rankBonus3)||0;
    } else {
      b1=parseInt(isGroup?cfg.grpRank1:cfg.indvRank1)||0;
      b2=parseInt(isGroup?cfg.grpRank2:cfg.indvRank2)||0;
      b3=parseInt(isGroup?cfg.grpRank3:cfg.indvRank3)||0;
    }
    var bonus=(cfg.rankPointsEnabled===false)?0:(m.rank===1?b1:m.rank===2?b2:m.rank===3?b3:0);
    var pts=gradePts+bonus;
    return Object.assign({}, m, {maximum:maximum, pct:Math.round(pct*10)/10, grade:grade, point:m.total>0?pts:0});
  });
}

// ============================================
var _wzRealtimeDebounce = null;
// Pushes of the SAME type must complete in the order they were queued, not
// the order their network requests happen to finish in. Without this, two
// quick saves in a row — e.g. a logo upload (large payload, slow) followed
// moments later by the main "Save" (small payload, fast) — can race: the
// slower-but-earlier request can finish AFTER the faster-but-later one,
// silently overwriting the newer save with the older, incomplete data.
var _wzPushQueues={};
var _wzPendingSaves=0;
function _wzSyncPush(fnName, value){
  if(!window.WinzeraSync) return;
  var s=getSession();
  if(!s) return;
  if(s.role==='admin'){
    if(!window.WinzeraSync.getOrgId()) return; // no org context yet — nothing to push to
    _wzPendingSaves++;
    var prevInQueue=_wzPushQueues[fnName]||Promise.resolve();
    _wzPushQueues[fnName]=prevInQueue.then(function(){
      return Promise.resolve(window.WinzeraSync[fnName](value));
    }).catch(function(e){
      console.error('Winzera sync ('+fnName+') failed:', e);
      if(typeof toast==='function') toast('Could not save to the server: '+(e&&e.message?e.message:'unknown error')+'. Your change is only on this device until this is fixed.','error');
    }).then(function(){ _wzPendingSaves--; });
  }else if(s.role==='team' && fnName==='pushParticipants'){
    // Team managers are not Supabase Auth users, so their writes always
    // go through token-checked RPCs, never the direct admin-style table push.
    _wzPendingSaves++;
    var prevTeamInQueue=_wzPushQueues['team:'+fnName]||Promise.resolve();
    _wzPushQueues['team:'+fnName]=prevTeamInQueue.then(function(){
      return Promise.resolve(window.WinzeraSync.pushParticipantsAsTeam(value));
    }).catch(function(e){
      console.error('Winzera team sync failed:', e);
      if(typeof toast==='function') toast('Could not save to the server: '+(e&&e.message?e.message:'unknown error')+'. Your change is only on this device until this is fixed.','error');
    }).then(function(){ _wzPendingSaves--; });
  }
}
// Safety net for the exact scenario reported: a big Bulk Add (or any save)
// still uploading in the background when the tab gets closed. Warns instead
// of silently losing whatever hadn't reached the server yet.
window.addEventListener('beforeunload', function(e){
  if(_wzPendingSaves>0){
    e.preventDefault();
    e.returnValue='Some changes are still saving to the server. Leaving now may lose them.';
    return e.returnValue;
  }
});

/**
 * Pulls the current org's teams/sections/items/participants from Supabase
 * into the local cache, then (re)starts realtime so other devices' changes
 * show up here automatically. Safe to call repeatedly.
 */
async function _wzBootstrapAdminSync(orgId){
  if(!window.WinzeraSync || !orgId) return;
  window.WinzeraSync.setOrgId(orgId);
  function applySnap(snap){
    // First-sync safety: if the org's remote settings are still empty but
    // this device already has real config locally (fest name, judges,
    // etc. set before sync existed), push local up instead of wiping it
    // with the empty remote default.
    var remoteConfigEmpty = !snap.config || Object.keys(snap.config).length===0;
    var localHasConfig = _mem.config && Object.keys(_mem.config).length>0;
    if(remoteConfigEmpty && localHasConfig){
      window.WinzeraSync.pushConfig(_mem.config).catch(function(e){ console.error('Winzera config push failed:', e); });
    }else{
      _mem.config=snap.config||{};
    }
    _mem.teams=snap.teams;
    _mem.sections=snap.sections;
    _mem.items=snap.items;
    _mem.participants=snap.participants;
    _mem.marks=_wzRecomputeMarksShape(snap.marks, snap.items, _mem.config);
    _mem.groups=snap.groups;
    _mem.bonuses=snap.bonuses;
    if(typeof applyAccentColor==='function') applyAccentColor(getAccentColor());
    window.WinzeraSync.rememberSnapshot(snap);
    if(typeof currentPage!=='undefined' && currentPage) render(currentPage, {});
    // render(currentPage,{}) only refreshes the underlying page — an open
    // mark-entry modal is a one-time snapshot taken when it was opened, so a
    // judge's live submission wouldn't otherwise show up until admin closes
    // and reopens it. Re-run the same open call to refresh its content live —
    // but NOT while admin currently has a score field focused/mid-typing:
    // force-rebuilding the modal's DOM out from under an active input can
    // fire a spurious change/blur event on the field losing focus, which
    // was showing up as a false "unsaved changes" warning even though
    // nothing was actually edited. Skip this cycle; the next one will catch
    // it once they've moved on.
    var _activeEl=document.activeElement;
    var _activeInMarkModal=_activeEl && _activeEl.classList && _activeEl.classList.contains('mark-input');
    if(window._activeMarkModalItemId!=null && !_activeInMarkModal && document.getElementById('modalContent') && document.getElementById('modalContent').innerHTML.trim()){
      try{ _openMarkModal(window._activeMarkModalItemId); }catch(e){}
    }
  }
  try{
    if(window.WinzeraBusy)window.WinzeraBusy.show('Loading organization data…');
    var snap = await window.WinzeraSync.pullOrgSnapshot();
    applySnap(snap);
  }catch(e){ console.error('Winzera initial sync failed:', e); }finally{if(window.WinzeraBusy)window.WinzeraBusy.hide();}

  window.WinzeraSync.startRealtime(orgId, function(table, payload){
    clearTimeout(_wzRealtimeDebounce);
    _wzRealtimeDebounce = setTimeout(async function(){
      try{
        // Wait for any of THIS device's own in-flight saves to finish first.
        // Without this, a realtime tick can pull from the server while a
        // just-added item/team/etc. is still mid-save, and overwrite the
        // screen with the slightly-older server state — making a thing you
        // just added seem to vanish, even though the save itself succeeds
        // moments later with nothing left to show it again.
        if(typeof _wzPushQueues!=='undefined'){
          try{ await Promise.all(Object.keys(_wzPushQueues).map(function(k){return _wzPushQueues[k];})); }catch(e){}
        }
        var snap = await window.WinzeraSync.pullOrgSnapshot();
        applySnap(snap);
      }catch(e){ console.error('Winzera realtime refresh failed:', e); }
    }, 400);
  });
}

/**
 * Populates the local cache from a team manager's dashboard RPC result
 * (their own team + org sections/items + their participants + assignments).
 * No realtime yet for team sessions in this stage — reopen the app / pull
 * to refresh. (Admin-side realtime already reflects team managers' writes
 * live, since those RPCs write to the same tables.)
 */
function _wzApplyTeamDashboard(dash){
  if(!dash) return;
  _mem.config = dash.orgSettings || {};
  _mem.teams = dash.team ? [{ id:dash.team.id, name:dash.team.name, shortName:dash.team.short_name,
    chestFrom:dash.team.chest_from||undefined, chestTo:dash.team.chest_to||undefined }] : [];
  _mem.sections = (dash.sections||[]).map(function(s){ return s.name; });
  var sectionIdToName = {}; (dash.sections||[]).forEach(function(s){ sectionIdToName[s.id]=s.name; });
  _mem.items = (dash.items||[]).map(function(i){
    return { id:i.id, name:i.name, section:sectionIdToName[i.section_id]||'General', type:i.type||'individual',
      maxTeam:i.max_participants!=null?i.max_participants:2, code:i.code, time:i.event_time||'',
      declared:!!i.declared, declaredAt:i.declared_at };
  });
  var assignByParticipant={};
  (dash.assignments||[]).forEach(function(a){ (assignByParticipant[a.participant_id]=assignByParticipant[a.participant_id]||[]).push(a.item_id); });
  _mem.participants = (dash.participants||[]).map(function(p){
    return { id:p.id, chestNo:p.chest_no?parseInt(p.chest_no,10):undefined, name:p.name,
      section:sectionIdToName[p.section_id]||'', team:(dash.team?dash.team.name:''),
      items:assignByParticipant[p.id]||[], photo:p.photo||null };
  });
  if(window.WinzeraSync) window.WinzeraSync.primeMapsFromTeamDashboard(dash);
  _wzStartTeamPolling();
}

// True realtime isn't available for team-manager sessions (they're not
// Supabase Auth users, so RLS blocks them from subscribing directly).
// Instead, poll their dashboard periodically so changes made by admin
// (new items, sections, etc.) still show up without a full app reopen.
var _wzTeamPollTimer=null;
function _wzStartTeamPolling(){
  if(_wzTeamPollTimer) return; // already running
  _wzTeamPollTimer=setInterval(async function(){
    var s=getSession();
    if(!s || s.role!=='team' || s.offline || !window.WinzeraSync) return;
    try{
      var dash=await window.WinzeraSync.teamFetchDashboard();
      _wzApplyTeamDashboardQuiet(dash);
    }catch(e){ /* offline or session expired — next successful poll will recover */ }
  }, 45000);
}
// Same as _wzApplyTeamDashboard but skips re-priming the poll timer itself
// and re-renders the current page so admin-side changes appear live-ish.
function _wzApplyTeamDashboardQuiet(dash){
  if(!dash) return;
  _mem.config = dash.orgSettings || {};
  _mem.teams = dash.team ? [{ id:dash.team.id, name:dash.team.name, shortName:dash.team.short_name,
    chestFrom:dash.team.chest_from||undefined, chestTo:dash.team.chest_to||undefined }] : [];
  _mem.sections = (dash.sections||[]).map(function(s){ return s.name; });
  var sectionIdToName = {}; (dash.sections||[]).forEach(function(s){ sectionIdToName[s.id]=s.name; });
  _mem.items = (dash.items||[]).map(function(i){
    return { id:i.id, name:i.name, section:sectionIdToName[i.section_id]||'General', type:i.type||'individual',
      maxTeam:i.max_participants!=null?i.max_participants:2, code:i.code, time:i.event_time||'',
      declared:!!i.declared, declaredAt:i.declared_at };
  });
  var assignByParticipant={};
  (dash.assignments||[]).forEach(function(a){ (assignByParticipant[a.participant_id]=assignByParticipant[a.participant_id]||[]).push(a.item_id); });
  _mem.participants = (dash.participants||[]).map(function(p){
    return { id:p.id, chestNo:p.chest_no?parseInt(p.chest_no,10):undefined, name:p.name,
      section:sectionIdToName[p.section_id]||'', team:(dash.team?dash.team.name:''),
      items:assignByParticipant[p.id]||[], photo:p.photo||null };
  });
  if(window.WinzeraSync) window.WinzeraSync.primeMapsFromTeamDashboard(dash);
  if(typeof currentPage!=='undefined' && currentPage) render(currentPage, {});
}

// Returns `count` numeric ids that are guaranteed not to collide with any id
// already present in `existingArr` (or with each other). Used anywhere new
// records are minted in bulk (bulk item add, bulk participant add, duplicate-id
// repair) instead of Date.now()-based stamps: Date.now() can coincide with an id
// that was itself minted from a future/clock-skewed Date.now() value (or with
// another id created in the same millisecond), while max-existing-id+offset
// can never collide with anything already on record.
function _nextUniqueIds(existingArr, count){
  var maxId=(existingArr||[]).reduce(function(m,it){ return Math.max(m, Number(it&&it.id)||0); }, 0);
  var ids=[];
  for(var i=1;i<=count;i++) ids.push(maxId+i);
  return ids;
}

// =============================================
// AUTH & ROLE SYSTEM
// =============================================
var SESSION_KEY='wz_session';
function getSession(){ try{ return JSON.parse(localStorage.getItem(SESSION_KEY)||'null'); }catch(e){ return null; } }
function setSession(s){ localStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
function clearSession(){ localStorage.removeItem(SESSION_KEY); }
function isAdmin(){ var s=getSession(); return !!(s&&s.role==='admin'); }
function isTeam(){ var s=getSession(); return !!(s&&s.role==='team'); }
function currentTeamName(){ var s=getSession(); return (s&&s.role==='team')?s.teamName:null; }

// ── Login form mount/unmount ──────────────────────────────────────────────
// The username/password inputs are only injected into the DOM while the
// login screen is genuinely being shown, and are torn out completely the
// moment a session starts. Some browsers' credential/autofill heuristics
// (e.g. Chrome's "Use saved password?" one-tap sign-in) scan the whole page
// for login-shaped inputs and can surface prompts on ANY screen if those
// inputs merely sit hidden (display:none) in the DOM — this keeps them out
// of the DOM entirely everywhere except the login page itself.
var _loginFormsMounted=false;
function _loginAdminPaneHTML(){
  return '<div class="form-group"><label class="form-label">Email Address</label><input class="form-input" id="li-admin-email" name="email" type="email" placeholder="admin@institution.com" autocomplete="email"></div>'
    +'<div class="form-group"><label class="form-label">Password</label><div style="position:relative"><input class="form-input" id="li-admin-pass" name="password" type="password" placeholder="Password" autocomplete="current-password" style="padding-right:44px" onkeydown="if(event.key===\'Enter\')doAdminLogin()"><button type="button" onclick="_togglePwVisibility(\'li-admin-pass\',this)" aria-label="Show or hide password" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);cursor:pointer;padding:4px;display:flex"><svg viewBox="0 0 24 24" style="width:1.1em;height:1.1em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></button></div></div>'
    +'<button class="btn btn-primary" style="width:100%" onclick="doAdminLogin()">Sign In</button>'
    +'<div style="text-align:center;margin-top:10px"><a href="https://whatsapp.com/channel/0029VbDMVxS1iUxUqreVs73q" target="_blank" rel="noopener" style="font-size:.78rem;color:var(--accent);font-weight:700;text-decoration:none">Need help? Contact support</a></div>'
    +'<div style="font-size:.68rem;color:var(--text3);text-align:center;margin-top:8px">Sign in with the email and password given to you by Winzera.</div>';
}
function _loginTeamPaneHTML(){
  var savedOrg = (function(){ try{ return localStorage.getItem('wz_team_org_code')||''; }catch(e){ return ''; } })();
  var urlOrg = (function(){ try{ return new URLSearchParams(location.search).get('org')||''; }catch(e){ return ''; } })();
  var orgDefault = urlOrg || savedOrg;
  return '<div class="form-group"><label class="form-label">Organization Code</label><input class="form-input" id="li-team-org" name="org" placeholder="Code your Admin gave you" value="'+orgDefault.replace(/"/g,'&quot;')+'" autocomplete="organization"></div>'
    +'<div class="form-group"><label class="form-label">Team Username</label><input class="form-input" id="li-team-user" name="username" placeholder="Team username" autocomplete="username"></div>'
    +'<div class="form-group"><label class="form-label">Password</label><div style="position:relative"><input class="form-input" id="li-team-pass" name="password" type="password" placeholder="Password" autocomplete="current-password" style="padding-right:44px" onkeydown="if(event.key===\'Enter\')doTeamLogin()"><button type="button" onclick="_togglePwVisibility(\'li-team-pass\',this)" aria-label="Show or hide password" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);cursor:pointer;padding:4px;display:flex"><svg viewBox="0 0 24 24" style="width:1.1em;height:1.1em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></button></div></div>'
    +'<button class="btn btn-primary" id="li-team-submit" style="width:100%" onclick="doTeamLogin()">Sign In as Team Manager</button>'
    +'<div style="font-size:.68rem;color:var(--text3);text-align:center;margin-top:8px">Ask your Admin for your Organization Code if you don\u2019t have it.</div>';
}
function _mountLoginForms(){
  if(_loginFormsMounted) return;
  var ap=document.getElementById('loginAdminPane'), tp=document.getElementById('loginTeamPane');
  if(ap) ap.innerHTML=_loginAdminPaneHTML();
  if(tp) tp.innerHTML=_loginTeamPaneHTML();
  _loginFormsMounted=true;
}
function _unmountLoginForms(){
  var ap=document.getElementById('loginAdminPane'), tp=document.getElementById('loginTeamPane');
  if(ap) ap.innerHTML='';
  if(tp) tp.innerHTML='';
  _loginFormsMounted=false;
}
function setLoginRole(role){
  document.getElementById('loginAdminPane').style.display = role==='admin'?'block':'none';
  document.getElementById('loginTeamPane').style.display   = role==='team'?'block':'none';
  document.getElementById('loginTabAdmin').style.background = role==='admin'?'var(--accent)':'transparent';
  document.getElementById('loginTabAdmin').style.color      = role==='admin'?'#fff':'var(--text2)';
  document.getElementById('loginTabTeam').style.background  = role==='team'?'var(--accent)':'transparent';
  document.getElementById('loginTabTeam').style.color       = role==='team'?'#fff':'var(--text2)';
  document.getElementById('loginError').style.display='none';
}
function _loginErr(msg){
  var el=document.getElementById('loginError');
  el.textContent=msg; el.style.display='block';
}
// Dynamic incorrect-password warning: random message + shake + vibration,
// re-triggerable on every failed attempt via forced reflow.
var WZ_WRONG_PASS_MESSAGES=[
  'Incorrect password. Please try again.',
  "Oops! That's not the right password.",
  'Access denied. Double-check your entry.',
  "That password doesn't match our records.",
  'Wrong password. Give it another shot.',
  "Hmm, that password isn't correct."
];
function _loginShakeAndWarn(customMsg){
  var msg=customMsg||WZ_WRONG_PASS_MESSAGES[Math.floor(Math.random()*WZ_WRONG_PASS_MESSAGES.length)];
  _loginErr(msg);
  var box=document.getElementById('loginCardBox');
  var errEl=document.getElementById('loginError');
  [box,errEl].forEach(function(el,i){
    if(!el) return;
    el.classList.remove('wz-login-shake','wz-err-pop');
    void el.offsetWidth; // force reflow so the animation restarts even mid-animation
    el.classList.add(i===0?'wz-login-shake':'wz-err-pop');
  });
  if(navigator.vibrate){ try{ navigator.vibrate([90,40,90]); }catch(e){} }
}
async function doAdminLogin(){
  var email=v('li-admin-email').trim().toLowerCase(), p=v('li-admin-pass');
  if(!email || !p){ _loginErr('Please enter both email and password'); return; }
  if(!window.WinzeraSync){ _loginErr('Login service failed to load. Check your connection and reload the page.'); return; }
  var btn=document.getElementById('li-admin-email'); // just to scope; real disabling below
  var submitBtn=document.querySelector('#loginAdminPane .btn-primary');
  if(submitBtn){ submitBtn.disabled=true; submitBtn.textContent='Signing in\u2026'; }
  try{
    var result = await window.WinzeraSync.adminLogin(email, p);
    var route=location.pathname.split('/').filter(Boolean);
    if(route[0]==='super-admin' && result.role!=='super_admin'){
      await window.WinzeraSync.adminSignOut();
      throw new Error('Only a Super Admin can access this page.');
    }
    if(route.length>1 && route[1]==='admin' && result.role!=='super_admin' && result.orgCode!==route[0]){
      await window.WinzeraSync.adminSignOut();
      throw new Error('This account does not belong to this institution.');
    }
    setSession({role:'admin', userId:result.userId, orgId:result.orgId, orgName:result.orgName, orgCode:result.orgCode, since:Date.now()});
    if(result.orgId) await _wzBootstrapAdminSync(result.orgId);
    _enterApp();
  }catch(err){
    console.error('Admin login failed:', err);
    var msg = (err && err.message) ? err.message : 'Sign in failed. Please try again.';
    if(/invalid login credentials/i.test(msg)) msg = 'Incorrect email or password.';
    _loginShakeAndWarn(msg);
  }finally{
    if(submitBtn){ submitBtn.disabled=false; submitBtn.textContent='Sign In'; }
  }
}
async function doTeamLogin(){
  var orgCode=v('li-team-org').trim(), u=v('li-team-user').trim(), p=v('li-team-pass');
  if(!orgCode){ _loginErr('Please enter your Organization Code.'); return; }
  if(!u || !p){ _loginErr('Please enter your username and password.'); return; }
  var submitBtn=document.getElementById('li-team-submit');
  if(submitBtn){ submitBtn.disabled=true; submitBtn.textContent='Signing in\u2026'; }
  try{
    if(!window.WinzeraSync) throw new Error('OFFLINE');
    var result = await window.WinzeraSync.teamLogin(orgCode, u, p);
    try{ localStorage.setItem('wz_team_org_code', orgCode); }catch(e){}
    var dash = await window.WinzeraSync.teamFetchDashboard();
    _wzApplyTeamDashboard(dash);
    setSession({role:'team', teamId:result.teamId, teamName:result.teamName, orgId:result.orgId, since:Date.now()});
    _enterApp();
  }catch(err){
    console.error('Team login failed:', err);
    if(err && err.message==='LOCKED'){ _loginErr('This team account has been locked by the Admin.'); return; }
    if(err && err.message==='WRONG_CREDENTIALS'){ _loginShakeAndWarn(); return; }
    if(!navigator.onLine){
      // A previously-successful login on this exact device left a cached
      // dashboard behind (see teamRestoreSession/_launchApp) — but a fresh
      // sign-in always needs the server, since only it holds the password
      // check. There is no local password to fall back to anymore.
      _loginErr('You\u2019re offline. If you\u2019ve signed in on this device before, just reopen the app instead of signing in again \u2014 it will resume your last session automatically once you\u2019re back online.');
      return;
    }
    _loginErr('Could not sign in. Check your Organization Code, username, password, and internet connection.');
  }finally{
    if(submitBtn){ submitBtn.disabled=false; submitBtn.textContent='Sign In as Team Manager'; }
  }
}

// ---- Forgot Email / Password ----
function openForgotPasswordModal(){
  showModal('<div class="modal-handle"></div><div class="modal-title">Forgot Email / Password</div>'
    +'<div style="text-align:center;padding:6px 4px 4px;color:var(--text3);font-size:.85rem">Password recovery is not available here.<br><br>Please contact your Winzera administrator to reset your credentials.</div>'
    +'<button class="btn btn-secondary" style="width:100%;margin-top:16px" onclick="closeModal()">Close</button>', {noDirtyGuard:true});
}
function signOut(){
  showModal('<div style="text-align:center;padding:8px">'
    +'<div style="font-size:2.5rem;margin-bottom:10px;color:var(--accent)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div>'
    +'<div style="font-size:1rem;font-weight:800;margin-bottom:6px">Sign Out?</div>'
    +'<div style="font-size:.82rem;color:var(--text3);margin-bottom:16px">You\u2019ll need your email and password to sign in again.</div>'
    +'<div style="display:flex;gap:8px">'
    +'<button class="btn btn-danger" style="flex:1" onclick="_confirmSignOut()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Sign Out</button>'
    +'<button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>'
    +'</div></div>', {noDirtyGuard:true});
}
async function _confirmSignOut(){
  try{
    var s=getSession();
    if(window.WinzeraSync){
      if(s && s.role==='admin') await window.WinzeraSync.adminSignOut();
      else if(s && s.role==='team') await window.WinzeraSync.teamLogout();
    }
  }catch(e){ console.error('Sign out cleanup failed:', e); }
  clearSession();
  location.reload();
}
function _enterApp(){
  if(typeof _stopQRScan==='function') _stopQRScan(); // safety net: release the camera if any scanner was left open
  document.getElementById('loginScreen').style.display='none';
  _unmountLoginForms(); // remove login inputs from the DOM entirely once signed in
  document.getElementById('app').style.display='flex';
  applyRoleUI();
  navigate(isTeam()?'teamHome':'dashboard', {}, false);
}
// Adjust bottom nav & UI chrome for the signed-in role
function applyRoleUI(){
  var nav=document.querySelector('.bottom-nav'); if(!nav) return;
  if(isTeam()){
    nav.style.display='none'; // Team Managers use the in-page Team Home actions instead
  } else {
    nav.style.display='';
  }
}

function showChangelog(onlyIfNew) {
  // Optionally show only if this version hasn't been seen before
  if (onlyIfNew) {
    var lastSeen = localStorage.getItem('changelog_seen');
    if (lastSeen === APP_VERSION) return; // already seen
  }

  // Build HTML from CHANGELOG array
  var html = '<div class="modal-handle"></div>'
    + '<div class="modal-title"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M6 6l2 2"/><path d="M16 16l2 2"/><path d="M6 18l2-2"/><path d="M16 8l2-2"/></svg> What\'s New</div>'
    + '<div style="font-size:.75rem;color:var(--text3);margin-bottom:16px">Version ' + APP_VERSION + ' · ' + (CHANGELOG[0]?.date || '') + '</div>';

  CHANGELOG.forEach(function(entry) {
    var isCurrent = entry.version === APP_VERSION;
    html += '<div style="margin-bottom:16px;' + (isCurrent ? '' : 'opacity:0.7') + '">'
      + '<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:6px">'
      + '<span style="font-weight:800;color:' + (isCurrent ? 'var(--gold)' : 'var(--text2)') + '">' + entry.version + '</span>'
      + '<span style="font-size:.7rem;color:var(--text3)">' + (entry.date || '') + '</span>'
      + '</div>'
      + '<ul style="padding-left:20px;margin:0;color:var(--text2);font-size:.82rem;line-height:1.5">';
    entry.changes.forEach(function(change) {
      html += '<li>' + change + '</li>';
    });
    html += '</ul></div>';
  });

  html += '<div style="display:flex;gap:8px;margin-top:8px">'
    + '<button class="btn btn-primary" onclick="localStorage.setItem(\'changelog_seen\',APP_VERSION);closeModal()">Got it</button>'
    + '<button class="btn btn-secondary" onclick="closeModal()">Close</button>'
    + '</div>';

  showModal(html);
}

// =============================================
// TUTORIAL VIDEO
// =============================================
var TUTORIAL_VIDEO_URL='https://youtube.com/playlist?list=PLEnGOJY6GA40fyx0fINZxQsjEdqMhmrsm&si=S3ay9zG9ajwPHF_d';
function maybeShowTutorialPopup(){
  if(localStorage.getItem('winzera_tutorial_hide')==='1') return;
  showModal('<div class="modal-handle"></div>'
    +'<button class="modal-close-btn" onclick="closeTutorialPopup(false)">&times;</button>'
    +'<div class="modal-title" style="padding-right:44px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.2 6 3 11l-1-3.5L19.2 2.5Z"/><path d="M2 11h20v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/><path d="m6.2 5.3 3 3.4"/><path d="m11.2 4 3 3.4"/></svg> Watch Tutorial</div>'
    +'<p style="color:var(--text2);font-size:.85rem;margin-bottom:16px">New to Winzera? Watch our quick tutorial playlist on YouTube to get started.</p>'
    +'<button class="btn btn-primary" style="width:100%;margin-bottom:10px" onclick="closeTutorialPopup(true)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v18l16-9Z"/></svg> Watch Tutorial Playlist</button>'
    +'<label style="display:flex;align-items:center;gap:8px;font-size:.78rem;color:var(--text3);margin-bottom:12px;cursor:pointer">'
    +'<input type="checkbox" id="tutorial-dontshow" style="width:16px;height:16px;accent-color:var(--accent)"> Don&rsquo;t show this again'
    +'</label>'
    +'<button class="btn btn-secondary" style="width:100%" onclick="closeTutorialPopup(false)">Close</button>'
  ,{noDirtyGuard:true});
}
function closeTutorialPopup(openVideo){
  var cb=document.getElementById('tutorial-dontshow');
  if(cb&&cb.checked) localStorage.setItem('winzera_tutorial_hide','1');
  closeModal();
  if(openVideo) window.open(TUTORIAL_VIDEO_URL,'_blank');
}
function hasUnseenTutorialBadge(){
  return localStorage.getItem('lastSeenTutorialVersion')!==APP_VERSION;
}
function openTutorialVideo(){
  localStorage.setItem('lastSeenTutorialVersion', APP_VERSION);
  window.open(TUTORIAL_VIDEO_URL,'_blank');
  if(currentPage==='setup') render('setup');
}
// =============================================
// TEXT CASE HELPER
// =============================================
// Small inline SVG status icons used in filter pills (e.g. Codes / Marks / Results
// pages) instead of emoji, which render inconsistently (or as blank boxes) on many
// desktop/PC browsers and operating systems. Always rendered in green (completed)
// or red (pending), regardless of the pill's active/inactive state, so the
// completed/pending distinction stays visible either way.
function _svgCheckIcon(){
  return '<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0;color:var(--green)" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.5 2.5L16 9.5"/></svg>';
}
function _svgWarnIcon(){
  return '<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0;color:var(--red)" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>';
}
function applyTextCase(str){
  if(!str) return str;
  var cfg=DB.config();
  if(cfg.textCase==='sentence'){
    // Title Case: capitalize first letter of every word
    return str.replace(/\S+/g, function(w){
      return w.charAt(0).toUpperCase()+w.slice(1).toLowerCase();
    });
  }
  // Default (including cfg.textCase==='upper' or unset): UPPER CASE.
  // Only two options exist now — Uppercase and Title Case — so anything that
  // isn't explicitly Title Case falls back to Uppercase.
  return str.toUpperCase();
}
function _applyTextCaseCSS(){
  var cfg=DB.config();
  var style=document.getElementById('_tc_style');
  if(!style){ style=document.createElement('style'); style.id='_tc_style'; document.head.appendChild(style); }
  if(cfg.textCase==='sentence'){
    style.textContent='.tc-name{text-transform:capitalize!important}input.tc-input{text-transform:capitalize}';
  } else {
    style.textContent='.tc-name{text-transform:uppercase!important}input.tc-input{text-transform:uppercase}';
  }
}
// Re-applies the current Text Case setting to every Group, Section, Item and
// Participant name already saved in the DB — not just names entered from now on.
// Called whenever the Text Case setting is changed in Setup, so the choice is
// applied dynamically instead of only affecting new entries.
//
// IMPORTANT: Team names and Section names aren't just display labels — every
// participant/group stores its team & section as a plain string (p.team, p.section,
// g.team, g.section, item.section), matched by exact string equality elsewhere in
// the app. If we recase "team a" -> "TEAM A" without updating those references too,
// every participant in that team would silently lose its team/section association
// (filters, chest ranges, and item listings would all stop matching them). So we
// build old-name -> new-name maps for Teams and Sections first, then propagate
// those renames into every record that references them, in the same pass.
function reapplyTextCaseToAllNames(){
  // --- Teams: rename + build a map of every reference that needs updating ---
  var teams=DB.teams();
  var teamMap={};
  var teamsChanged=false;
  teams=teams.map(function(t){
    var newName=applyTextCase(t.name);
    teamMap[t.name]=newName;
    if(newName!==t.name) teamsChanged=true;
    return newName===t.name?t:Object.assign({},t,{name:newName});
  });
  if(teamsChanged) DB.saveTeams(teams);

  // --- Sections: rename + build a map of every reference that needs updating ---
  var sections=DB.sections();
  var sectionMap={};
  var sectionsChanged=false;
  var newSections=sections.map(function(s){
    var newS=applyTextCase(s);
    sectionMap[s]=newS;
    if(newS!==s) sectionsChanged=true;
    return newS;
  });
  if(sectionsChanged) DB.saveSections(newSections);

  // --- Items: rename + propagate the section rename ---
  var items=DB.items();
  var itemsChanged=false;
  items=items.map(function(i){
    var newName=applyTextCase(i.name);
    var newSection=sectionMap.hasOwnProperty(i.section)?sectionMap[i.section]:i.section;
    if(newName!==i.name||newSection!==i.section) itemsChanged=true;
    return (newName===i.name&&newSection===i.section)?i:Object.assign({},i,{name:newName,section:newSection});
  });
  if(itemsChanged) DB.saveItems(items);

  // --- Participants: rename + propagate both team and section renames ---
  var participants=DB.participants();
  var participantsChanged=false;
  participants=participants.map(function(p){
    var newName=applyTextCase(p.name);
    var newTeam=teamMap.hasOwnProperty(p.team)?teamMap[p.team]:p.team;
    var newSection=sectionMap.hasOwnProperty(p.section)?sectionMap[p.section]:p.section;
    if(newName!==p.name||newTeam!==p.team||newSection!==p.section) participantsChanged=true;
    return (newName===p.name&&newTeam===p.team&&newSection===p.section)?p:Object.assign({},p,{name:newName,team:newTeam,section:newSection});
  });
  if(participantsChanged) DB.saveParticipants(participants);

  // --- Groups: rename + propagate both team and section renames ---
  var groups=DB.groups();
  var groupsChanged=false;
  groups=groups.map(function(g){
    var newName=applyTextCase(g.name);
    var newTeam=teamMap.hasOwnProperty(g.team)?teamMap[g.team]:g.team;
    var newSection=sectionMap.hasOwnProperty(g.section)?sectionMap[g.section]:g.section;
    if(newName!==g.name||newTeam!==g.team||newSection!==g.section) groupsChanged=true;
    return (newName===g.name&&newTeam===g.team&&newSection===g.section)?g:Object.assign({},g,{name:newName,team:newTeam,section:newSection});
  });
  if(groupsChanged) DB.saveGroups(groups);

  // If the currently logged-in Team Manager's own team name just changed case,
  // update their cached session too, or every team/section/chest-range lookup that
  // keys off currentTeamName() would silently break until they log out and back in.
  if(isTeam()){
    var s=getSession();
    if(s && s.teamName && teamMap.hasOwnProperty(s.teamName) && teamMap[s.teamName]!==s.teamName){
      s.teamName=teamMap[s.teamName];
      setSession(s);
    }
  }

  return teamsChanged||sectionsChanged||itemsChanged||participantsChanged||groupsChanged;
}

// =============================================
// SCROLL POSITION RESTORE
// =============================================
window._scrollRestoreMap={};
window._expandRestore=null;

function _saveScroll(page){
  var c=document.getElementById('mainContent');
  if(c) window._scrollRestoreMap[page]=c.scrollTop;
}
function _restoreScroll(page){
  var pos=window._scrollRestoreMap[page];
  if(pos===undefined) return;
  var c=document.getElementById('mainContent');
  if(c) requestAnimationFrame(function(){ c.scrollTop=pos; });
}
function _saveExpandedDivIds(prefix){
  var result=[];
  var divs=document.querySelectorAll('[id^="'+prefix+'"]');
  divs.forEach(function(d){ if(d.style.display!=='none') result.push(d.id); });
  return result;
}
function renderKeepScroll(page, data, forceExpandId){
  _saveScroll(page);
  // Save which items are expanded — only for Codes and Results
  var expanded=[];
  if(page==='codes')    expanded=_saveExpandedDivIds('cblock-');
  else if(page==='results') expanded=_saveExpandedDivIds('rb-');
  // If caller explicitly wants one item kept open (e.g. after Save Codes hides it), add it
  if(forceExpandId && expanded.indexOf(forceExpandId)<0) expanded.push(forceExpandId);
  window._expandRestore=expanded.length?expanded:null;
  window._scrollRestore=page;
  render(page, data);
}

// =============================================
// THEME
// =============================================
function toggleTheme(){
  const html=document.documentElement;
  const dark=html.getAttribute('data-theme')==='dark';
  html.setAttribute('data-theme',dark?'light':'dark');
  document.getElementById('themeBtn').innerHTML=dark?'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>':'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/></svg>';
  localStorage.setItem('sav_theme',dark?'light':'dark');
}
function initTheme(){
  const t=localStorage.getItem('sav_theme')||'dark';
  document.documentElement.setAttribute('data-theme',t);
  document.getElementById('themeBtn').innerHTML=t==='dark'?'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>':'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/></svg>';
}

// =============================================
// ACCENT COLOR (Personalize)
// =============================================
var ACCENT_PRESETS={
  violet:  {label:'Violet',       c1:'#8b5cf6', c2:'#6d28d9'},
  blue:    {label:'Electric Blue',c1:'#2563eb', c2:'#1d4ed8'},
  emerald: {label:'Emerald',      c1:'#10b981', c2:'#047857'},
  amber:   {label:'Amber',        c1:'#f0a500', c2:'#e05c00'},
  crimson: {label:'Crimson',      c1:'#e11d48', c2:'#9f1239'}
};
function getAccentColor(){
  // Synced org-wide (organizations.settings) so it carries over between
  // devices, same as fest name/judges/etc. localStorage is only a fast
  // local fallback for before the first config pull ever completes.
  var s=getSession();
  if(s && (s.role==='admin'||s.role==='team')){
    var cfg=DB.config();
    if(cfg && cfg.accentColor) return cfg.accentColor;
  }
  return localStorage.getItem('sav_accent')||'amber';
}
function applyAccentColor(key){
  var p=ACCENT_PRESETS[key]||ACCENT_PRESETS.amber;
  document.documentElement.style.setProperty('--accent', p.c1);
  document.documentElement.style.setProperty('--accent2', p.c2);
}
function setAccentColor(key){
  if(!ACCENT_PRESETS[key]) return;
  localStorage.setItem('sav_accent', key); // instant local fallback
  applyAccentColor(key);
  var s=getSession();
  if(s && s.role==='admin'){
    var cfg=DB.config();
    cfg.accentColor=key;
    DB.saveConfig(cfg); // syncs to Supabase, same path as every other setting
  }
  showSetupFolder('personalize');
}
function initAccentColor(){ applyAccentColor(getAccentColor()); }

// =============================================
// NAVIGATION
// =============================================
var currentPage='dashboard', pageStack=[];
// Track if setup has unsaved changes
window._setupDirty=false;

// =============================================
// ANDROID / HARDWARE BACK BUTTON HANDLING
// =============================================
// One browser history entry is pushed for every level pushed onto pageStack
// (so history depth always mirrors pageStack depth exactly), plus one more
// while the single shared #modalOverlay is open. Hardware back / gesture
// consumes the top entry, and we react by closing the modal or stepping back
// exactly one level through the page hierarchy (Mark Sheet -> Reports ->
// Dashboard, not straight to Dashboard). When our OWN code closes a modal or
// steps back some other way (Cancel button, in-app back arrow, tapping Home,
// etc.), we consume the now-stale history entry ourselves via a single
// history.back() so a later hardware-back press doesn't land on it.
var _wzModalGuard=false;        // true while a history entry exists for "modal open"
var _wzProcessingRealPop=false; // true while reacting to a genuine popstate
var _wzSuppressNextPop=false;   // true while we're consuming a stale entry ourselves

function _wzConsumeGuard(){
  // Removes one stale history entry that our own code (not the back button) is closing.
  _wzSuppressNextPop=true;
  history.back();
}

window.addEventListener('popstate', function(){
  if(_wzSuppressNextPop){ _wzSuppressNextPop=false; return; }
  _wzProcessingRealPop=true;
  try{
    var ov=document.getElementById('modalOverlay');
    var modalOpen = ov && !ov.classList.contains('hidden');
    if(modalOpen){
      _wzModalGuard=false; // the browser just consumed this entry
      closeModal(); // may re-open a fresh confirm dialog if there are unsaved changes
    } else if(pageStack.length>0){
      goBack(); // steps back exactly one level, matching the one entry just consumed
    }
    // else: already at rest (Dashboard, no modal) — nothing to intercept,
    // let the default back action proceed (minimizes/exits the app).
  } finally {
    _wzProcessingRealPop=false;
  }
});

function _judgesChanged(cfg){
  var current=(window._setupJudges||[]).map(function(j){return {id:j.id,name:(j.name||'').trim()};});
  var saved=(cfg.judges||[]).map(function(j){return {id:j.id,name:(j.name||'').trim()};});
  return JSON.stringify(current)!==JSON.stringify(saved);
}
function _checkSetupDirty(){
  // Setup is now a landing page of category cards with no directly-editable
  // fields of its own — each folder is its own modal, guarded independently
  // by the generic modal dirty-check system (see showSetupFolder / showModal).
  return false;
}

function _leavingSetup(onContinue){
  if(!_checkSetupDirty()){ onContinue(); return; }
  showModal('<div style="text-align:center;padding:8px">'
    +'<div style="font-size:2.5rem;margin-bottom:10px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h6"/></svg></div>'
    +'<div style="font-size:1rem;font-weight:800;margin-bottom:8px;color:var(--gold)">Unsaved Changes</div>'
    +'<div style="font-size:.82rem;color:var(--text2);margin-bottom:20px">You have unsaved changes in Setup. What would you like to do?</div>'
    +'<div style="display:flex;flex-direction:column;gap:8px">'
    +'<button class="btn btn-primary" onclick="saveConfig();_closeModalClean();(_leavingSetup_cb&&_leavingSetup_cb())"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h6"/></svg> Save</button>'
    +'<button class="btn btn-danger" onclick="_closeModalClean();(_leavingSetup_cb&&_leavingSetup_cb())"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg> Don\'t Save</button>'
    +'<button class="btn btn-secondary" onclick="closeModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg> Cancel</button>'
    +'</div></div>', {noDirtyGuard: true});
  window._leavingSetup_cb=onContinue;
}

// Page-level unsaved guards (codes & marks)
var _pageUnsaved = false;    // set true when codes/marks changed but not saved
var _pageUnsavedLabel = '';  // human label for the confirm dialog
var _pageSaveCallback = null; // function to call when user chooses "Save"

function _setPageUnsaved(val, label, saveCallback){
  _pageUnsaved = !!val;
  _pageUnsavedLabel = label || 'changes';
  if (saveCallback) {
    _pageSaveCallback = saveCallback;
  } else if (window._tempSaveCB) {
    _pageSaveCallback = window._tempSaveCB;
    window._tempSaveCB = null;
  }
  if (!val) _pageSaveCallback = null;
}

function _showPageUnsavedConfirm(onContinue){
  showModal('<div style="text-align:center;padding:12px 4px">'
    +'<div class="modal-handle"></div>'
    +'<div style="font-size:2.2rem;margin-bottom:10px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>️</div>'
    +'<div style="font-size:1rem;font-weight:800;margin-bottom:6px;color:var(--gold)">Unsaved '+_pageUnsavedLabel+'</div>'
    +'<div style="font-size:.85rem;color:var(--text2);margin-bottom:20px">You have unsaved changes.<br>What would you like to do?</div>'
    +'<div style="display:flex;flex-direction:column;gap:10px">'
    +'<button class="btn btn-primary" onclick="if(window._pageSaveCallback){window._pageSaveCallback();}_closeModalClean();(window._pgUnsavedCb&&window._pgUnsavedCb())"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h6"/></svg> Save & Continue</button>'
    +'<button class="btn btn-danger" onclick="_closeModalClean();(window._pgUnsavedCb&&window._pgUnsavedCb())"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v18"/><path d="M4 21V5a2 2 0 0 1 2-2h8v18H6a2 2 0 0 1-2-2Z"/><path d="M14 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><circle cx="9" cy="12" r="0.5" fill="currentColor"/></svg> Don\'t Save</button>'
    +'<button class="btn btn-secondary" onclick="_closeModalClean()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>️ Cancel</button>'
    +'</div></div>', {noDirtyGuard: true});
  window._pgUnsavedCb = onContinue;
}
function _checkLeavingPage(targetPage, targetData, targetPush, onClear){
  if(_pageUnsaved && (currentPage==='codes'||currentPage==='markEntry'||currentPage==='marks')){
    _showPageUnsavedConfirm(function(){
      _pageUnsaved=false; onClear();
    });
    return true; // blocked
  }
  return false;
}

function navigate(page, data, pushStack){
  if(pushStack===undefined) pushStack=true;
  data=data||{};
  if(_checkLeavingPage(page,data,pushStack,function(){ navigate(page,data,pushStack); })) return;
  if(currentPage==='setup'&&page!=='setup'){
    _leavingSetup(function(){ _doNavigate(page,data,pushStack); });
    return;
  }
  _doNavigate(page,data,pushStack);
}

var _TEAM_ALLOWED_PAGES={teamHome:1, participants:1, reports:1, contactUs:1, teamAssign:1, teamReports:1, teamData:1};
function _doNavigate(page, data, pushStack){
  if(pushStack===undefined) pushStack=true;
  data=data||{};
  if(isTeam() && !_TEAM_ALLOWED_PAGES[page]){
    page='teamHome'; data={};
  }
  _pageUnsaved=false; // clear any page-level dirty flag on successful navigation
  // Section filter selections (Codes/Marks/Results) persist across navigation
  // and tab switches now, so they are intentionally NOT reset here.
  // The Marks status filter (All/Marked/Pending) DOES reset on every
  // navigation/tab switch, so a stale status filter never carries over.
  window._markFlt='all';
  if(pushStack&&currentPage!==page){
    pageStack.push({page:currentPage,data:{}});
    // ── Hardware back-button bookkeeping ── mirror pageStack depth exactly,
    // so a hardware-back press steps back one level, same as the in-app arrow.
    history.pushState({wz:'page'},'');
  }
  currentPage=page;
  document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active');});
  var navEl=document.getElementById('nav-'+page);
  if(!navEl){
    var navMap={teamPoints:'points',sectionPoints:'points',individualPoints:'points',individualDetailed:'points',winnerList:'points',certificates:'points',
      setup:'dashboard',sections:'dashboard',items:'dashboard',teams:'dashboard',participants:'dashboard',reports:'dashboard',contactUs:'dashboard',
      codeDetailed:'codes',schedule:'dashboard',markEntry:'marks',markSheet:'marks'};
    var navId=navMap[page];
    if(navId) navEl=document.getElementById('nav-'+navId);
  }
  if(navEl) navEl.classList.add('active');
  document.getElementById('backBtn').classList.toggle('hidden',pageStack.length===0);
  render(page,data);
}

function goBack(){
  if(pageStack.length>0){
    var prev=pageStack[pageStack.length-1];
    if(_checkLeavingPage(prev.page,prev.data||{},false,function(){ goBack(); })) return;
    if(currentPage==='setup'){
      _leavingSetup(function(){
        pageStack.pop();
        if(_wzProcessingRealPop){ /* browser already consumed the matching entry */ }
        else { _wzConsumeGuard(); }
        _doNavigate(prev.page,prev.data||{},false);
      });
      return;
    }
    pageStack.pop();
    if(_wzProcessingRealPop){ /* browser already consumed the matching entry */ }
    else { _wzConsumeGuard(); }
    _doNavigate(prev.page,prev.data||{},false);
  }
}
function render(page, data){
  data=data||{};
  var content=document.getElementById('mainContent');
  var cfg=DB.config();
  var _fb=document.getElementById('festBadge'); _fb.textContent=cfg.festName||'Winzera'; _fb.title=cfg.tagline||'';
  var titles={
    dashboard:['Dashboard','Competition Manager'],
    setup:['Festival Setup','Configure your event'],
    sections:['Sections','Age/Level categories'],
    items:['Items','Competition items'],
    teams:['Teams','Participating groups'],
    participants:['Participants','Student registrations'],
    marks:['Mark Entry','Judge marks & tabulation'],
    markEntry:['Enter Marks','Tabulation'],
    results:['Results','Declared & live rankings'],
    points:['Points','All points & standings'],
    teamPoints:['Team Points','Overall standings'],
    sectionPoints:['Section-wise Points','Points by section'],
    individualPoints:['Individual Points','Student points'],
    individualDetailed:['Individual Detailed','Detailed point report'],
    winnerList:['Winner List','All event winners'],
    reports:['Reports','Print & Export'],
    contactUs:['Contact Developer','Developer info & feedback'],
    codes:['Code Letters','Green room codes'],
    codeDetailed:['Code List Detailed','Full code details'],
    markSheet:['Mark Sheet','Blank sheets for judges'],
    schedule:['Schedule','Item timetable'],
    certificates:['Certificates','Generate certificates'],
    teamHome:[currentTeamName()||'My Team', cfg.festName||'Team Manager'],
    teamAssign:['Assign Item', currentTeamName()||''],
    teamReports:['Reports', currentTeamName()||''],
    teamData:['Data Management', currentTeamName()||''],
  };
  var t=titles[page]||[page,''];
  document.getElementById('pageTitle').textContent=t[0];
  document.getElementById('pageSubtitle').textContent=t[1];
  var renderers={
    dashboard:renderDashboard, setup:renderSetup, sections:renderSections,
    items:renderItems, teams:renderTeams, participants:renderParticipants,
    marks:renderMarks, markEntry:renderMarkEntry, results:renderResults,
    points:renderPoints,
    teamPoints:renderTeamPoints, sectionPoints:renderSectionPoints,
    individualPoints:renderIndividualPoints, individualDetailed:renderIndividualDetailed,
    winnerList:renderWinnerList, reports:renderReports, contactUs:renderContactUs,
    codes:renderCodes, codeDetailed:renderCodeDetailed,
    schedule:renderSchedule, certificates:renderCertificates,
    markSheet:renderMarkSheetPage, teamHome:renderTeamHome,
    teamAssign:renderTeamAssign, teamReports:renderTeamReports, teamData:renderTeamData,
  };
  function paintReal(){
    // Rendering a page can throw (bad/legacy data, an unhandled edge case in a
    // renderX function, etc.) — without this guard that leaves mainContent
    // half-updated or blank with no way for the user to recover except a
    // manual browser refresh. Catch it, log it for debugging, and show a
    // friendly recovery screen instead of a hard crash.
    var renderedOk=false;
    try {
      if(renderers[page]) content.innerHTML=renderers[page](data);
      else content.innerHTML='<div style="text-align:center;padding:40px;color:var(--text3)">Page not found</div>';
      renderedOk=true;
    } catch(err){
      console.error('[Winzera] Failed to render page "'+page+'":', err);
      content.innerHTML=_renderPageErrorFallback();
    }
    if(!renderedOk) return; // fallback markup is simple static HTML; skip post-render hooks below
    // Post-render hooks (tutorial popup, scroll restore, FAB) touch the DOM
    // the renderer just produced — wrapped separately so a bug in one of
    // these doesn't blank out an otherwise-successfully-rendered page.
    try {
      if(page==='setup') maybeShowTutorialPopup();
      if(window._scrollRestore===page){
        // Re-open expanded items first (they affect page height → scroll position must come after)
        if(window._expandRestore&&window._expandRestore.length){
          window._expandRestore.forEach(function(id){
            var d=document.getElementById(id);
            if(d) d.style.display='block';
          });
          window._expandRestore=null;
        }
        _restoreScroll(page);
        window._scrollRestore=null;
      } else {
        content.scrollTop=0;
        window.scrollTo(0,0);
      }
      _applyTextCaseCSS();
      _updateFab(page,data);
    } catch(err2){
      console.error('[Winzera] Post-render error on page "'+page+'":', err2);
    }
  }
  paintReal();
}
function _renderPageErrorFallback(){
  return '<div style="text-align:center;padding:48px 20px;color:var(--text2)">'
    +'<div style="font-size:2.4rem;margin-bottom:12px">⚠️</div>'
    +'<div style="font-weight:700;font-size:1rem;margin-bottom:6px;color:var(--text)">Something went wrong</div>'
    +'<div style="font-size:.8rem;color:var(--text3);margin-bottom:20px">This page ran into an error and couldn\'t be displayed. Your data is safe.</div>'
    +'<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">'
    +'<button class="btn btn-primary btn-sm" onclick="location.reload()">Reload App</button>'
    +'<button class="btn btn-secondary btn-sm" onclick="navigate(\'dashboard\',{})">Go to Dashboard</button>'
    +'</div></div>';
}

// =============================================
// FLOATING ADD BUTTON (FAB)
// =============================================
function _updateFab(page,data){
  var fab=document.getElementById('globalFab');
  if(!fab) return;
  window._fabPage=page;
  window._fabTab=(page==='participants')?(data&&data.tab||window._lastPartTab||'list'):null;
  var show=['sections','items','teams','participants'].includes(page);
  fab.classList.toggle('hidden',!show);
}
function handleFabClick(){
  var page=window._fabPage;
  if(page==='sections') return showAddSection();
  if(page==='items') return showAddItem();
  if(page==='teams') return showAddTeam();
  if(page==='participants'){
    return (window._fabTab==='groups') ? showAddGroup() : showAddParticipant();
  }
}

// =============================================
// UNIVERSAL SEARCH
// =============================================
var _gsearchOpen=false;
var _gsearchFlat=[]; // flat list of {type,item} matching the currently rendered results, indexed by row
var GS_GROUP_ORDER=['participants','items','declaredItems','participantScores'];
var GS_GROUP_LABELS={participants:'Participants', items:'Items', declaredItems:'Results', participantScores:'Scores'};
// One accent color per group so the dropdown is scannable at a glance —
// each group gets its own dot + left-border + label tint (see .gsearch-group CSS).
var GS_GROUP_COLORS={participants:'var(--blue)', items:'var(--accent)', declaredItems:'var(--gold)', participantScores:'var(--accent2)'};
var GS_MAX_PER_GROUP=7;

function toggleGlobalSearch(){
  if(_gsearchOpen) closeGlobalSearch(); else openGlobalSearch();
}
function openGlobalSearch(){
  _gsearchOpen=true;
  document.getElementById('headerTitleWrap').style.display='none';
  document.getElementById('headerActionsWrap').style.display='none';
  document.getElementById('backBtn').style.display='none';
  var bar=document.getElementById('gsearchBar');
  bar.classList.remove('hidden');
  var inp=document.getElementById('gsearchInput');
  inp.value='';
  setTimeout(function(){ inp.focus(); },0);
  var panel=document.getElementById('gsearchResults');
  panel.classList.add('hidden');
  panel.innerHTML='';
  document.addEventListener('keydown', _gsearchKeyHandler);
  document.addEventListener('mousedown', _gsearchOutsideHandler, true);
}
function closeGlobalSearch(){
  _gsearchOpen=false;
  document.getElementById('headerTitleWrap').style.display='';
  document.getElementById('headerActionsWrap').style.display='';
  document.getElementById('backBtn').style.display='';
  document.getElementById('gsearchBar').classList.add('hidden');
  var panel=document.getElementById('gsearchResults');
  panel.classList.add('hidden');
  panel.innerHTML='';
  document.removeEventListener('keydown', _gsearchKeyHandler);
  document.removeEventListener('mousedown', _gsearchOutsideHandler, true);
}
function _gsearchKeyHandler(e){ if(e.key==='Escape') closeGlobalSearch(); }
function _gsearchOutsideHandler(e){
  var bar=document.getElementById('gsearchBar');
  var panel=document.getElementById('gsearchResults');
  var btn=document.getElementById('gsearchBtn');
  if(bar.contains(e.target)||panel.contains(e.target)||btn.contains(e.target)) return;
  closeGlobalSearch();
}
function _gsearchInput(raw){
  var q=(raw||'').trim();
  var panel=document.getElementById('gsearchResults');
  if(!q){ panel.classList.add('hidden'); panel.innerHTML=''; return; }
  var results=_globalSearch(q.toLowerCase());
  panel.innerHTML=_renderGlobalSearchResults(results,q.toLowerCase());
  panel.classList.remove('hidden');
}
// Team-role users only get participant results scoped to their own team —
// the "items" group stays admin-only since it's really an editing surface,
// but declared results/scores are read-only info team managers should see too.
function _globalSearch(q){
  var teamScoped=isTeam()?currentTeamName():null;
  var marks=DB.marks();
  var allItems=DB.items();
  var allParticipants=DB.participants(), allGroups=DB.groups();
  var declaredItemIds={}; // itemId -> true, for items with >=1 scored mark (data rule for both new groups)
  allItems.forEach(function(i){
    if(i.declared && marks.some(function(m){return m.itemId===i.id && m.total>0;})) declaredItemIds[i.id]=true;
  });
  var participants=allParticipants;
  if(teamScoped) participants=participants.filter(function(p){return p.team===teamScoped;});
  var out={
    participants: participants.filter(function(p){
      return (p.name||'').toLowerCase().includes(q) || String(p.chestNo).includes(q) || (p.team||'').toLowerCase().includes(q);
    })
  };
  var matchedItems=allItems.filter(function(i){
    return (i.name||'').toLowerCase().includes(q) || (i.code||'').toLowerCase().includes(q);
  });
  if(!teamScoped){
    out.items=matchedItems;
  }
  // declaredItems: declared items that actually have a scored mark, matched the
  // same way as the "items" group. Visible to everyone (read-only results),
  // unlike "items" itself which is an admin editing surface.
  out.declaredItems=matchedItems.filter(function(i){ return declaredItemIds[i.id]; }).map(function(i){
    return Object.assign({}, i, {_winnerName:_gsItemWinnerName(i, marks, allParticipants, allGroups)});
  });
  // participantScores: participants with a scored mark in a declared item.
  // Team-scoped like the participants group above, so team managers only ever
  // see their own team's scores here.
  out.participantScores=participants.filter(function(p){
    var matchesQ=(p.name||'').toLowerCase().includes(q) || String(p.chestNo).includes(q) || (p.team||'').toLowerCase().includes(q);
    if(!matchesQ) return false;
    return marks.some(function(m){ return m.chestNo===p.chestNo && m.total>0 && declaredItemIds[m.itemId]; });
  }).map(function(p){
    return Object.assign({}, p, {_scoreTotal:_gsParticipantTotal(p.chestNo, marks, allItems)});
  });
  return out;
}
// Sum of points a participant has earned across their declared, scored marks
// (any item type — group items included, unlike the individual-championship
// calculator which excludes them). Used for the participantScores "Total: X pts" row.
function _gsParticipantTotal(chestNo, marks, items){
  var total=0;
  marks.forEach(function(m){
    if(m.chestNo!==chestNo || !(m.total>0)) return;
    var it=items.find(function(i){return i.id===m.itemId;});
    if(!it || !it.declared) return;
    total+=(m.point||0);
  });
  return total;
}
// Winning mark (rank 1, persisted at declare-time by assignRanks) for a declared item.
function _gsItemWinnerName(item, marks, participants, groups){
  var win=marks.find(function(m){return m.itemId===item.id && m.rank===1;});
  if(!win) return null;
  if(item.type==='group'){
    var g=groups.find(function(gr){return gr.groupChestNo===win.chestNo && _grpHasItem(gr,item);});
    return g?g.name:('#'+win.chestNo);
  }
  var p=participants.find(function(pt){return pt.chestNo===win.chestNo;});
  return p?p.name:('#'+win.chestNo);
}
function _gsearchEsc(s){
  return String(s==null?'':s).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function _gsearchHi(text,q){
  text=String(text==null?'':text);
  var idx=text.toLowerCase().indexOf(q);
  if(idx<0) return _gsearchEsc(text);
  return _gsearchEsc(text.slice(0,idx))+'<mark class="gsearch-hl">'+_gsearchEsc(text.slice(idx,idx+q.length))+'</mark>'+_gsearchEsc(text.slice(idx+q.length));
}
function _renderGlobalSearchResults(results,q){
  _gsearchFlat=[];
  var total=0;
  GS_GROUP_ORDER.forEach(function(k){ if(results[k]) total+=results[k].length; });
  if(!total) return '<div class="gsearch-empty">No matches for "'+_gsearchEsc(q)+'"</div>';
  var html='';
  GS_GROUP_ORDER.forEach(function(key){
    var list=results[key];
    if(!list||!list.length) return;
    var shown=list.slice(0,GS_MAX_PER_GROUP);
    var color=GS_GROUP_COLORS[key]||'';
    html+='<div class="gsearch-group" style="--gs-color:'+color+'"><div class="gsearch-group-label"><span class="gsearch-group-dot"></span>'+GS_GROUP_LABELS[key]+' ('+list.length+')</div>';
    html+=shown.map(function(item){
      var idx=_gsearchFlat.length;
      _gsearchFlat.push({type:key,item:item});
      return _gsearchRow(idx,key,item,q);
    }).join('');
    if(list.length>shown.length) html+='<div class="gsearch-more">+'+(list.length-shown.length)+' more — refine your search</div>';
    html+='</div>';
  });
  return html;
}
function _gsearchRow(idx,type,item,q){
  if(type==='participants'){
    return '<div class="gsearch-row" onclick="_gsearchGo('+idx+')">'
      +'<div class="gsearch-row-title">'+_gsearchHi(item.name,q)+'</div>'
      +'<div class="gsearch-row-sub">#'+item.chestNo+' &middot; '+_gsearchEsc(item.team)+' &middot; '+_gsearchEsc(item.section)+'</div></div>';
  }
  if(type==='items'){
    return '<div class="gsearch-row" onclick="_gsearchGo('+idx+')">'
      +'<div class="gsearch-row-title">'+_gsearchHi(item.name,q)+'</div>'
      +'<div class="gsearch-row-sub">'+(item.code?'Code '+_gsearchEsc(item.code)+' &middot; ':'')+_gsearchEsc(item.section)+'</div></div>';
  }
  if(type==='declaredItems'){
    var winner=item._winnerName?'Winner: '+_gsearchEsc(item._winnerName):'Winner: —';
    return '<div class="gsearch-row" onclick="_gsearchGo('+idx+')">'
      +'<div class="gsearch-row-title">'+_gsearchHi(item.name,q)+'</div>'
      +'<div class="gsearch-row-sub">'+_gsearchEsc(item.section)+' &middot; '+winner+'</div></div>';
  }
  if(type==='participantScores'){
    return '<div class="gsearch-row" onclick="_gsearchGo('+idx+')">'
      +'<div class="gsearch-row-title">'+_gsearchHi(item.name,q)+'</div>'
      +'<div class="gsearch-row-sub">'+_gsearchEsc(item.section)+' &middot; Total: '+(item._scoreTotal||0)+' pts</div></div>';
  }
  return '';
}
function _gsearchGo(idx){
  var entry=_gsearchFlat[idx];
  if(!entry) return;
  var type=entry.type, item=entry.item;
  closeGlobalSearch();
  if(type==='participants'){
    navigate('participants',{tab:'list',section:'All',team:'All',q:item.name});
  } else if(type==='items'){
    navigate('items',{section:'All',q:item.name});
  } else if(type==='declaredItems'){
    _openResultModal(item.id,'All','all');
  } else if(type==='participantScores'){
    _openParticipantScoreModal(item.chestNo);
  }
}

function renderDashboard(){
  const cfg=DB.config(), teams=DB.teams(), participants=DB.participants(), items=DB.items(), marks=DB.marks();
  const declared=items.filter(i=>i.declared).length;
  const svgSetup=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
  const svgTeams=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
  const svgSections=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
  const svgItems=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  const svgParticipants=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  const svgReport=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`;
  const svgImportExport=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/><polyline points="16 7 12 3 8 7"/><line x1="12" y1="3" x2="12" y2="12"/></svg>`;
  return `
  <div class="dash-hero">
    <div class="fest-name">${cfg.festName||'Winzera'}</div>
    ${cfg.tagline?`<div class="fest-tagline">${cfg.tagline}</div>`:''}
    <div class="inst-name">${cfg.institution||'Configure your institution'}</div>
    ${formatFestDate(cfg)?`<div class="inst-name" style="opacity:.8">${formatFestDate(cfg)}${cfg.venue?' · '+cfg.venue:''}</div>`:''}
    <div class="stats-row">
      <div class="stat-box"><div class="num">${teams.length}</div><div class="lbl">Teams</div></div>
      <div class="stat-box"><div class="num">${participants.length}</div><div class="lbl">Students</div></div>
      <div class="stat-box"><div class="num">${declared}/${items.length}</div><div class="lbl">Declared</div></div>
    </div>
  </div>
  <div class="menu-grid">
    <div class="menu-card" onclick="navigate('setup')">
      <div class="mc-icon">${svgSetup}</div>
      <div class="mc-title">Setup</div><div class="mc-sub">Competition config</div>
    </div>
    <div class="menu-card" onclick="navigate('teams')">
      <div class="mc-icon">${svgTeams}</div>
      <div class="mc-title">Teams</div><div class="mc-sub">${teams.length} registered</div>${teams.length?'<div class="mc-badge">'+teams.length+'</div>':''}
    </div>
    <div class="menu-card" onclick="navigate('sections')">
      <div class="mc-icon">${svgSections}</div>
      <div class="mc-title">Sections</div><div class="mc-sub">Age categories</div>
    </div>
    <div class="menu-card" onclick="navigate('items')">
      <div class="mc-icon">${svgItems}</div>
      <div class="mc-title">Items</div><div class="mc-sub">${items.length} items</div>${items.length?'<div class="mc-badge">'+items.length+'</div>':''}
    </div>
    <div class="menu-card" onclick="navigate('participants')">
      <div class="mc-icon">${svgParticipants}</div>
      <div class="mc-title">Participants</div><div class="mc-sub">${participants.length} students</div>${participants.length?'<div class="mc-badge">'+participants.length+'</div>':''}
    </div>
    <div class="menu-card" onclick="navigate('reports')">
      <div class="mc-icon">${svgReport}</div>
      <div class="mc-title">Reports</div><div class="mc-sub">Print &amp; schedule</div>
    </div>
  </div>
  <div class="divider"></div>
  <div style="font-size:.7rem;color:var(--text3);text-align:center;padding:2px 8px 10px;line-height:1.7">Setup &rarr; Sections &rarr; Items &rarr; Teams &rarr; Participants &rarr; Codes &rarr; Marks &rarr; Declare &rarr; Points</div>
  `;
}

// =============================================
// SETUP
// =============================================
function renderSetup(){
  var cfg=DB.config();
  window._setupJudges=(cfg.judges||[]).map(function(j){return {id:j.id,name:j.name};});
  var mc=function(key,iconSvg,title,sub){
    return '<div class="menu-card" onclick="showSetupFolder(\''+key+'\')" style="padding:12px 10px">'
      +'<div class="mc-icon" style="font-size:1.5rem;margin-bottom:4px">'+iconSvg+'</div>'
      +'<div class="mc-title" style="font-size:.78rem">'+title+'</div><div class="mc-sub" style="font-size:.64rem;margin-top:1px">'+sub+'</div></div>';
  };
  return '<div class="menu-grid" style="grid-template-columns:repeat(2,1fr);gap:8px">'
   +mc('festival','<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 3 20h18Z"/><path d="M12 3v17"/><path d="M7.5 20 12 11l4.5 9"/></svg>','Festival Info','Name, logo, venue &amp; date')
   +mc('marking','<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="M5 7 2 14a3 3 0 0 0 6 0Z"/><path d="M19 7l-3 7a3 3 0 0 0 6 0Z"/></svg>','Marking &amp; Points','Judges, grades &amp; rank points')
   +mc('rules','<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V6a2 2 0 0 1 2-2h4l2 3h6a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/></svg>','Rules &amp; Limits','Item limits &amp; schedule')
   +mc('poster','<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5-11 11"/></svg>','Poster &amp; Certificate','Styles, slots &amp; certificates')
   +mc('personalize','<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z"/></svg>','Personalize','Theme, text case &amp; print size')
   +mc('data','<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>','Data Management','Backup, restore &amp; account')
   +'</div>'
   +'<div style="margin-top:10px;font-size:.68rem;color:var(--text3);text-align:center">Winzera '+APP_VERSION+'</div>'
   +'<div style="margin-top:8px;font-size:.64rem;color:var(--text3);text-align:center;text-transform:uppercase;letter-spacing:.06em;font-weight:700">Help &amp; Support</div>'
   +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:6px">'
   +'<div class="menu-card" onclick="navigate(\'contactUs\')" style="display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;padding:8px 6px">'
   +'<svg viewBox="0 0 24 24" style="width:1em;height:1em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>'
   +'<div class="mc-title" style="font-size:.68rem">Contact</div></div>'
   +'<div class="menu-card" onclick="checkForAppUpdate()" style="display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;padding:8px 6px">'
   +'<svg viewBox="0 0 24 24" style="width:1em;height:1em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>'
   +'<div class="mc-title" style="font-size:.68rem">Updates</div></div>'
   +'<div class="menu-card" onclick="openTutorialVideo()" style="display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;padding:8px 6px;position:relative">'
   +(hasUnseenTutorialBadge()?'<span style="position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:var(--red,#e5484d);box-shadow:0 0 0 2px var(--card)"></span>':'')
   +'<svg viewBox="0 0 24 24" style="width:1em;height:1em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7Z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>'
   +'<div class="mc-title" style="font-size:.68rem">Tutorial</div></div>'
   +'</div>';
}

// =============================================
// SETUP FOLDER MODALS (5-category system)
// =============================================
function showSetupFolder(key){
  var cfg=DB.config();
  var builders={
    festival:_setupFolderFestival, marking:_setupFolderMarking,
    rules:_setupFolderRules, poster:_setupFolderPoster, data:_setupFolderData,
    personalize:_setupFolderPersonalize
  };
  var fn=builders[key]; if(!fn) return;
  if(key==='data'){ showModal(fn(cfg), {noSaveBtn:true}); setTimeout(function(){ _setupDataTab('backup'); },0); return; }
  showModal(fn(cfg), {saveCallback:function(){ saveConfig(); render('setup'); showSetupFolder(key); }});
  if(key==='marking') setTimeout(function(){ _setupMarkingTab('judges'); },0);
  if(key==='poster') setTimeout(function(){ _posterCertSetTab(window._posterCertTab||'poster'); },0);
}

function _setupModalShell(iconSvg,title,bodyHtml,opts){
  opts=opts||{};
  var footer=opts.noSaveBtn
    ?'<button class="btn btn-secondary" style="width:100%;margin-top:16px" onclick="_closeModalClean();render(\'setup\')">Close</button>'
    :'<div style="display:flex;gap:8px;margin-top:16px;position:sticky;bottom:0;background:var(--modal-bg);padding-top:10px">'
      +'<button class="btn btn-primary" style="flex:1;white-space:nowrap" onclick="saveConfig();render(\'setup\');_closeModalClean()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h6"/></svg> Save</button>'
      +'<button class="btn btn-secondary" style="flex:1;white-space:nowrap" onclick="closeModal()">Cancel</button>'
      +'</div>';
  return '<div class="modal-handle"></div>'
    +'<div class="modal-title" style="display:flex;align-items:center;gap:8px">'+iconSvg+' '+title+'</div>'
    +bodyHtml
    +footer;
}

// ---- Folder 1: Festival Info ----
function _setupFolderFestival(cfg){
  var logoHtml=cfg.logo
    ?'<img src="'+cfg.logo+'" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid var(--accent);flex-shrink:0" id="cfg-logo-preview">'
    :'<div id="cfg-logo-preview" style="width:72px;height:72px;border-radius:50%;background:var(--bg3);border:2px dashed var(--border);display:flex;align-items:center;justify-content:center;font-size:2rem;flex-shrink:0"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 3 20h18Z"/><path d="M12 3v17"/><path d="M7.5 20 12 11l4.5 9"/></svg></div>';
  var body='<div class="form-group" style="display:flex;align-items:center;gap:14px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px">'
   +logoHtml
   +'<div style="flex:1;min-width:0">'
   +'<div style="font-size:.78rem;font-weight:700;color:var(--text2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Institution Logo</div>'
   +'<label style="cursor:pointer">'
   +'<input type="file" id="cfg-logo-file" accept="image/*" style="display:none" onchange="openLogoCropper(event)">'
   +'<div class="btn btn-secondary btn-sm" style="display:inline-flex;gap:6px;align-items:center;margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></svg> '+(cfg.logo?'Change Logo':'Upload Logo')+'</div></label>'
   +(cfg.logo?'<button class="btn btn-danger btn-xs" style="margin-left:6px" onclick="removeLogo()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg> Remove</button>':'')
   +'<div style="font-size:.68rem;color:var(--text3);margin-top:3px">'+(cfg.logo?'Logo saved &middot; shown on posters &amp; reports':'Upload your institution logo (will be cropped to circle)')+'</div>'
   +'</div></div>'
   +'<div class="form-row">'
   +'<div class="form-group"><label class="form-label">Festival Name</label>'
   +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-festName" value="'+(cfg.festName||'Winzera')+'" placeholder="e.g. Winzera 2026"></div>'
   +'<div class="form-group"><label class="form-label">Institution</label>'
   +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-institution" value="'+(cfg.institution||'Mubjan World')+'"></div>'
   +'</div>'
   +'<div class="form-group"><label class="form-label">Fest Tagline / Slogan</label>'
   +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-tagline" value="'+(cfg.tagline||'')+'" placeholder="e.g. Celebrating Talent, Together" maxlength="80"></div>'
   +'<div class="form-group"><label class="form-label">Edition</label>'
   +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-edition" value="'+(cfg.edition||'')+'"></div>'
   +'<div class="form-group"><label class="form-label">Venue</label>'
   +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-venue" value="'+(cfg.venue||'')+'"></div>'
   +'<div class="form-group"><label class="form-label">Duration</label>'
   +'<div class="tabs" style="margin-bottom:10px">'
   +'<div class="tab'+(cfg.durationMode!=='multi'?' active':'')+'" id="cfg-dur-single" onclick="cfgDurationSelect(\'single\')">Single Day</div>'
   +'<div class="tab'+(cfg.durationMode==='multi'?' active':'')+'" id="cfg-dur-multi" onclick="cfgDurationSelect(\'multi\')">Multi-Day</div>'
   +'</div><input type="hidden" id="cfg-durationMode" value="'+(cfg.durationMode||'single')+'"></div>'
   +'<div id="cfg-date-single-wrap" style="'+(cfg.durationMode==='multi'?'display:none':'')+'">'
   +'<div class="form-group"><label class="form-label">Date</label>'
   +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-date" type="date" value="'+(cfg.date||'')+'" oninput="cfgDatePreviewUpdate()"></div></div>'
   +'<div id="cfg-date-multi-wrap" style="'+(cfg.durationMode==='multi'?'':'display:none')+'">'
   +'<div class="form-row"><div class="form-group"><label class="form-label">Start Date</label>'
   +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-dateStart" type="date" value="'+(cfg.dateStart||'')+'" oninput="cfgDatePreviewUpdate()"></div>'
   +'<div class="form-group"><label class="form-label">End Date</label>'
   +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-dateEnd" type="date" value="'+(cfg.dateEnd||'')+'" oninput="cfgDatePreviewUpdate()"></div></div></div>'
   +'<div id="cfg-date-preview" style="font-size:.74rem;color:var(--text3);margin:-6px 0 10px;padding:8px 10px;background:var(--bg3);border-radius:8px">Display Preview: <span id="cfg-date-preview-text" style="color:var(--accent);font-weight:700">'+(formatFestDate(cfg)||'&mdash;')+'</span></div>';
  return _setupModalShell('<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 3 20h18Z"/><path d="M12 3v17"/><path d="M7.5 20 12 11l4.5 9"/></svg>','Festival Info',body);
}

function cfgDurationSelect(mode){
  var hid=document.getElementById('cfg-durationMode'); if(hid) hid.value=mode;
  var s=document.getElementById('cfg-dur-single'), m=document.getElementById('cfg-dur-multi');
  if(s) s.classList.toggle('active', mode!=='multi');
  if(m) m.classList.toggle('active', mode==='multi');
  var sw=document.getElementById('cfg-date-single-wrap'), mw=document.getElementById('cfg-date-multi-wrap');
  if(sw) sw.style.display=mode==='multi'?'none':'';
  if(mw) mw.style.display=mode==='multi'?'':'none';
  cfgDatePreviewUpdate();
}
function cfgDatePreviewUpdate(){
  var mode=(document.getElementById('cfg-durationMode')||{}).value||'single';
  var preview=document.getElementById('cfg-date-preview-text'); if(!preview) return;
  var fake={durationMode:mode,
    date:(document.getElementById('cfg-date')||{}).value||'',
    dateStart:(document.getElementById('cfg-dateStart')||{}).value||'',
    dateEnd:(document.getElementById('cfg-dateEnd')||{}).value||''};
  var txt=formatFestDate(fake);
  preview.textContent=txt||'—';
}

// ---- Folder 2: Marking & Points System (sub-tabs) ----
function _setupMarkingTab(tab){
  ['judges','grades','rankbonus'].forEach(function(t){
    var pane=document.getElementById('mktab-'+t), btn=document.getElementById('mkbtn-'+t);
    if(pane) pane.style.display=(t===tab?'block':'none');
    if(btn){ btn.style.background=(t===tab?'var(--accent)':'var(--bg3)'); btn.style.color=(t===tab?'#000':'var(--text2)'); }
  });
}
function _setupFolderMarking(cfg){
  var jo=[1,2,3,4].map(function(n){
    return '<option value="'+n+'"'+(cfg.maxJudges==n?' selected':'')+'>'+n+' Judge'+(n>1?'s':'')+'</option>';
  }).join('');
  var tabBtn=function(id,label){ return '<button type="button" id="mkbtn-'+id+'" onclick="_setupMarkingTab(\''+id+'\')" style="flex:1;padding:9px 6px;border-radius:8px;border:none;font-size:.76rem;font-weight:700;cursor:pointer;background:var(--bg3);color:var(--text2)">'+label+'</button>'; };
  var body='<div style="display:flex;gap:6px;background:var(--bg3);padding:4px;border-radius:10px;margin-bottom:14px">'
    +tabBtn('judges','Judge Settings')+tabBtn('grades','Grade Points')+tabBtn('rankbonus','Rank Point')+'</div>'
    +'<div id="mktab-judges">'
    +'<div class="form-row"><div class="form-group"><label class="form-label">No. of Judges</label>'
    +_wzDropdown('cfg-maxJudges',[1,2,3,4].map(function(n){return {value:n,label:n+' Judge'+(n>1?'s':'')};}),cfg.maxJudges||3,{})+'</div>'
    +'<div class="form-group"><label class="form-label">Max Marks / Judge</label>'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-maxMarks" type="number" value="'+(cfg.maxMarks||100)+'"></div></div>'
    +'<div style="font-size:.72rem;color:var(--text3);margin:6px 0 10px">Optional &mdash; name your judges so you can tag who scored each item during mark entry.</div>'
    +'<div id="judgesListWrap">'+renderJudgesRows()+'</div>'
    +'<button type="button" class="btn btn-secondary btn-sm" style="width:100%;margin-top:2px" onclick="addJudgeRow()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg> Add Judge</button>'
    +'</div>'
    +'<div id="mktab-grades" style="display:none">'
    +'<label style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;background:var(--bg3);border-radius:8px;border-left:3px solid var(--accent);margin-bottom:12px;cursor:pointer">'
    +'<span style="font-size:.8rem;font-weight:700">Enable Grade Points <span style="font-weight:400;color:var(--text3)">&mdash; turn off to exclude grade scores from every total (team &amp; individual)</span></span>'
    +'<span class="toggle-switch"><input type="checkbox" id="cfg-gradePointsEnabled" '+(cfg.gradePointsEnabled!==false?'checked':'')+'><span class="toggle-slider"></span></span></label>'
    +'<div style="font-size:.73rem;font-weight:700;color:var(--text2);margin-bottom:2px">Individual Items <span style="font-weight:400;color:var(--text3)">(adds to team &amp; individual champion)</span></div>'
    +'<div style="font-size:.7rem;color:var(--text3);margin-bottom:8px">A+(&ge;90%) A(&ge;80%) B+(&ge;70%) B(&ge;60%) C(&ge;50%)</div>'
    +'<div class="form-row-3"><div class="form-group"><label class="form-label">A+</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-indvAp" type="number" value="'+(cfg.indvAp||10)+'"></div>'
    +'<div class="form-group"><label class="form-label">A</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-indvA" type="number" value="'+(cfg.indvA||8)+'"></div>'
    +'<div class="form-group"><label class="form-label">B+</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-indvBp" type="number" value="'+(cfg.indvBp||6)+'"></div></div>'
    +'<div class="form-row-3"><div class="form-group"><label class="form-label">B</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-indvB" type="number" value="'+(cfg.indvB||4)+'"></div>'
    +'<div class="form-group"><label class="form-label">C</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-indvC" type="number" value="'+(cfg.indvC||2)+'"></div>'
    +'<div class="form-group"></div></div>'
    +'<div style="font-size:.73rem;font-weight:700;color:var(--text2);margin:12px 0 2px">Group Items <span style="font-weight:400;color:var(--text3)">(adds to team total only)</span></div>'
    +'<div style="font-size:.7rem;color:var(--text3);margin-bottom:8px">A+(&ge;90%) A(&ge;80%) B+(&ge;70%) B(&ge;60%) C(&ge;50%)</div>'
    +'<div class="form-row-3"><div class="form-group"><label class="form-label">A+</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-grpAp" type="number" value="'+(cfg.grpAp||15)+'"></div>'
    +'<div class="form-group"><label class="form-label">A</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-grpA" type="number" value="'+(cfg.grpA||12)+'"></div>'
    +'<div class="form-group"><label class="form-label">B+</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-grpBp" type="number" value="'+(cfg.grpBp||9)+'"></div></div>'
    +'<div class="form-row-3"><div class="form-group"><label class="form-label">B</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-grpB" type="number" value="'+(cfg.grpB||6)+'"></div>'
    +'<div class="form-group"><label class="form-label">C</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-grpC" type="number" value="'+(cfg.grpC||3)+'"></div>'
    +'<div class="form-group"></div></div>'
    +'</div>'
    +'<div id="mktab-rankbonus" style="display:none">'
    +'<label style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;background:var(--bg3);border-radius:8px;border-left:3px solid var(--accent);margin-bottom:12px;cursor:pointer">'
    +'<span style="font-size:.8rem;font-weight:700">Enable Rank Points <span style="font-weight:400;color:var(--text3)">&mdash; turn off to exclude rank points from every total (team &amp; individual)</span></span>'
    +'<span class="toggle-switch"><input type="checkbox" id="cfg-rankPointsEnabled" '+(cfg.rankPointsEnabled!==false?'checked':'')+'><span class="toggle-slider"></span></span></label>'
    +'<div style="font-size:.78rem;color:var(--text2);margin-bottom:12px;padding:10px 12px;background:var(--bg3);border-radius:8px;border-left:3px solid var(--accent)">'
    +'Points awarded strictly by Total Marks / Position — not by Grade. Total Points = Grade Points + Rank Points.</div>'
    +'<div style="font-size:.73rem;font-weight:700;color:var(--text2);margin-bottom:6px">Individual Items</div>'
    +'<div class="form-row-3"><div class="form-group"><label class="form-label">1st</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-indvRank1" type="number" value="'+(cfg.indvRank1||0)+'" min="0"></div>'
    +'<div class="form-group"><label class="form-label">2nd</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-indvRank2" type="number" value="'+(cfg.indvRank2||0)+'" min="0"></div>'
    +'<div class="form-group"><label class="form-label">3rd</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-indvRank3" type="number" value="'+(cfg.indvRank3||0)+'" min="0"></div></div>'
    +'<div style="font-size:.73rem;font-weight:700;color:var(--text2);margin:10px 0 6px">Group Items</div>'
    +'<div class="form-row-3"><div class="form-group"><label class="form-label">1st</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-grpRank1" type="number" value="'+(cfg.grpRank1||0)+'" min="0"></div>'
    +'<div class="form-group"><label class="form-label">2nd</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-grpRank2" type="number" value="'+(cfg.grpRank2||0)+'" min="0"></div>'
    +'<div class="form-group"><label class="form-label">3rd</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-grpRank3" type="number" value="'+(cfg.grpRank3||0)+'" min="0"></div></div>'
    +'</div>';
  return _setupModalShell('<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="M5 7 2 14a3 3 0 0 0 6 0Z"/><path d="M19 7l-3 7a3 3 0 0 0 6 0Z"/></svg>','Marking &amp; Points System',body);
}

// ---- Folder 3: Rules & Limits ----
function _setupFolderRules(cfg){
  var body='<div class="form-group" style="background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:.76rem;color:var(--text2)">Maximum items a participant may take. <b>0 = UNLIMITED</b> &mdash; applies to every limit below.</div>'
   +'<div class="form-row"><div class="form-group"><label class="form-label">On-Stage Limit</label>'
   +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-maxStage" type="number" value="'+(cfg.maxStageEvents||3)+'" min="0" max="20"></div>'
   +'<div class="form-group"><label class="form-label">Off-Stage Limit</label>'
   +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-maxOffStage" type="number" value="'+(cfg.maxOffStageEvents||5)+'" min="0" max="20"></div></div>'
   +'<div class="form-group"><label class="form-label">Open Section Limit <span style="font-size:.72rem;color:var(--text3)">(0 = unlimited)</span></label>'
   +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="cfg-maxOpenSection" type="number" value="'+(cfg.maxOpenSection!==undefined?cfg.maxOpenSection:2)+'" min="0" max="20"></div>'
   +'<div style="font-size:.72rem;color:var(--text3);margin-top:-4px;margin-bottom:14px">Max items from Open/Cross-Section a participant can take, counted separately from the limits above.</div>'
   +'<label style="display:flex;align-items:center;justify-content:space-between;gap:12px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 14px;cursor:pointer;margin-bottom:14px">'
   +'<div><div style="font-size:.9rem;font-weight:700">Enable Schedule</div>'
   +'<div style="font-size:.72rem;color:var(--text3)">Show stage &amp; time fields in Add Item</div></div>'
   +'<span class="toggle-switch"><input type="checkbox" id="cfg-scheduleEnabled" onchange="_rulesScheduleToggle(this.checked)"'+(cfg.scheduleEnabled!==false?' checked':'')+'><span class="toggle-slider"></span></span></label>'
   +'<div id="rules-stages-wrap" style="'+(cfg.scheduleEnabled===false?'display:none':'')+'">'
   +'<div style="font-size:.78rem;font-weight:800;color:var(--text2);margin:4px 0 8px">Stages <span style="font-weight:400;color:var(--text3)">(shown on schedule &amp; print)</span></div>'
   +_getStages(cfg).map(function(s){
     if(window._stageEditingId===s.id){
       return '<div style="display:flex;align-items:center;gap:8px;background:var(--bg3);border:1px solid var(--accent);border-radius:10px;padding:9px 12px;margin-bottom:6px">'
         +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" style="margin-bottom:0;flex:1" id="editStageNameInput" value="'+s.name+'" autofocus>'
         +'<button type="button" class="btn btn-primary btn-xs" onclick="_stageEditConfirm(\''+s.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></button>'
         +'<button type="button" class="btn btn-secondary btn-xs" onclick="_stageEditCancel()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
         +'</div>';
     }
     return '<div style="display:flex;align-items:center;gap:10px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:9px 12px;margin-bottom:6px">'
       +'<div style="flex:1;font-size:.85rem;font-weight:700">'+s.name+'</div>'
       +'<button type="button" class="btn btn-secondary btn-xs" onclick="_stageEditOpen(\''+s.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>'
       +'<button type="button" class="btn btn-danger btn-xs" onclick="_stageDelete(\''+s.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>'
       +'</div>';
   }).join('')
   +(window._stageAdding
     ? '<div style="display:flex;gap:8px;margin-bottom:10px"><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" style="margin-bottom:0" id="newStageNameInput" placeholder="e.g. Seminar Hall" autofocus><button type="button" class="btn btn-primary btn-sm" style="flex-shrink:0" onclick="_stageAddConfirm()">Add</button><button type="button" class="btn btn-secondary btn-sm" style="flex-shrink:0" onclick="_stageAddCancel()">Cancel</button></div>'
     : '<button type="button" class="btn btn-secondary btn-sm" style="width:100%;margin-bottom:14px" onclick="_stageAddOpen()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg> Add Stage</button>')
   +'</div>';
  return _setupModalShell('<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V6a2 2 0 0 1 2-2h4l2 3h6a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/></svg>','Rules &amp; Limits',body);
}
function _rulesScheduleToggle(checked){
  var wrap=document.getElementById('rules-stages-wrap');
  if(wrap) wrap.style.display=checked?'':'none';
}
// Captures the live (possibly-unsaved) state of the "Enable Schedule" toggle from the DOM
// and persists it, so that re-rendering the Rules & Limits folder (e.g. when adding/editing/
// deleting a stage) doesn't silently revert it to the last-saved value.
function _persistScheduleToggleFromDOM(){
  var el=document.getElementById('cfg-scheduleEnabled');
  if(!el) return;
  var cfg=DB.config();
  var curSaved=cfg.scheduleEnabled!==false;
  if(curSaved!==el.checked){ cfg.scheduleEnabled=el.checked; DB.saveConfig(cfg); }
}
function _stageAddOpen(){
  _persistScheduleToggleFromDOM();
  window._stageAdding=true;
  showSetupFolder('rules');
  setTimeout(function(){ var el=document.getElementById('newStageNameInput'); if(el) el.focus(); },0);
}
function _stageAddCancel(){
  _persistScheduleToggleFromDOM();
  window._stageAdding=false;
  showSetupFolder('rules');
}
function _stageAddConfirm(){
  var input=document.getElementById('newStageNameInput');
  var name=input?input.value.trim():'';
  if(!name){ toast('Please enter a stage name','error'); return; }
  _persistScheduleToggleFromDOM();
  var cfg=DB.config();
  var stages=_getStages(cfg).slice();
  stages.push({id:'stg_'+Date.now(), name:name});
  cfg.stages=stages;
  DB.saveConfig(cfg);
  window._stageAdding=false;
  toast('Stage added!');
  showSetupFolder('rules');
}
function _stageEditOpen(id){
  _persistScheduleToggleFromDOM();
  window._stageEditingId=id;
  showSetupFolder('rules');
  setTimeout(function(){ var el=document.getElementById('editStageNameInput'); if(el){ el.focus(); el.select(); } },0);
}
function _stageEditCancel(){
  _persistScheduleToggleFromDOM();
  window._stageEditingId=null;
  showSetupFolder('rules');
}
function _stageEditConfirm(id){
  var input=document.getElementById('editStageNameInput');
  var name=input?input.value.trim():'';
  if(!name){ toast('Please enter a stage name','error'); return; }
  _persistScheduleToggleFromDOM();
  var cfg=DB.config();
  var stages=_getStages(cfg).map(function(s){ return s.id===id?Object.assign({},s,{name:name}):s; });
  cfg.stages=stages;
  DB.saveConfig(cfg);
  window._stageEditingId=null;
  toast('Stage updated!');
  showSetupFolder('rules');
}
function _stageDelete(id){
  _persistScheduleToggleFromDOM();
  var cfg=DB.config();
  var stages=_getStages(cfg);
  if(stages.length<=1){ toast('At least one stage is required','error'); return; }
  var items=DB.items();
  var affected=items.filter(function(it){ return _getItemStageId(it,cfg)===id; });
  if(affected.length>0){
    showModal('<div class="modal-handle"></div><div class="modal-title">⚠️ Delete Stage?</div>'
      +'<p style="color:var(--text2);margin-bottom:16px;font-size:.85rem">'+affected.length+' item'+(affected.length===1?' is':'s are')+' currently assigned to this stage. Deleting it will reassign '+(affected.length===1?'that item':'those items')+' to the first remaining stage. This cannot be undone.</p>'
      +'<button class="btn btn-danger" onclick="_stageDeleteConfirm(\''+id+'\')">Yes, Delete Stage</button>'
      +'<button class="btn btn-secondary mt-10" onclick="showSetupFolder(\'rules\')">Cancel</button>');
    return;
  }
  _stageDeleteConfirm(id);
}
function _stageDeleteConfirm(id){
  var cfg=DB.config();
  var stagesBefore=_getStages(cfg);
  var stagesAfter=stagesBefore.filter(function(s){ return s.id!==id; });
  if(!stagesAfter.length) stagesAfter=[{id:'stg_default',name:'Main Stage'}];
  var fallbackId=stagesAfter[0].id;
  var items=DB.items();
  var changed=false;
  items=items.map(function(it){
    var curId=_getItemStageId(it,cfg); // resolved against pre-deletion stage list
    if(curId===id){ changed=true; return Object.assign({},it,{stageId:fallbackId}); }
    return it;
  });
  if(changed) DB.saveItems(items);
  cfg.stages=stagesAfter;
  DB.saveConfig(cfg);
  toast('Stage deleted'+(changed?' — items reassigned':'')+'!');
  showSetupFolder('rules');
}

// ---- Folder 5: Data Management (sub-tabs: Backup & Account) ----
function _setupDataTab(tab){
  ['backup','account'].forEach(function(t){
    var pane=document.getElementById('dmtab-'+t), btn=document.getElementById('dmbtn-'+t);
    if(pane) pane.style.display=(t===tab?'block':'none');
    if(btn){ btn.style.background=(t===tab?'var(--accent)':'var(--bg3)'); btn.style.color=(t===tab?'#000':'var(--text2)'); }
  });
}
function _setupFolderData(cfg){
  var tabBtn=function(id,label){ return '<button type="button" id="dmbtn-'+id+'" onclick="_setupDataTab(\''+id+'\')" style="flex:1;padding:9px 6px;border-radius:8px;border:none;font-size:.76rem;font-weight:700;cursor:pointer;background:var(--bg3);color:var(--text2)">'+label+'</button>'; };
  var body='<div style="display:flex;gap:6px;background:var(--bg3);padding:4px;border-radius:10px;margin-bottom:14px">'
    +tabBtn('backup','Backup &amp; Restore')+tabBtn('account','Account &amp; Security')+'</div>'
    +'<div id="dmtab-backup">'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">'
    +'<button class="btn btn-orange" style="padding:15px 8px;font-size:.93rem;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px" onclick="exportData()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>Export</button>'
    +'<button class="btn btn-primary" style="padding:15px 8px;font-size:.93rem;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px" onclick="shareBackupFile()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>Share</button>'
    +'</div>'
    +'<button class="btn btn-secondary" style="width:100%;margin-bottom:10px;padding:14px 8px;font-size:.93rem;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px" onclick="showImportModal()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="15"/><polyline points="7 10 12 15 17 10"/><line x1="5" y1="20" x2="19" y2="20"/></svg>Import Backup</button>'
    +'<button class="btn btn-danger" style="width:100%;padding:14px 8px;font-size:.93rem;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px" onclick="confirmReset()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>Clear All Data</button>'
    +'<input type="file" id="importFile" accept=".json,.txt" style="display:none" onchange="importData(event)">'
    +'<div style="margin-top:10px;font-size:.7rem;color:var(--text3);text-align:center"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></svg> Participant photos are embedded in exports as JPEG thumbnails</div>'
    +'</div>'
    +'<div id="dmtab-account" style="display:none">'
    +'<div style="font-size:.78rem;color:var(--text3);margin-bottom:14px">Admin sign-in credentials can only be changed by your super admin.</div>'
    +'<button class="btn btn-secondary" style="width:100%" disabled>Change Password (Not Available)</button>'
    +'</div>';
  return _setupModalShell('<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>','Data Management',body,{noSaveBtn:true});
}

// ---- Folder 6: Personalize (Theme, Text Case & Print Size) ----
function _setupFolderPersonalize(cfg){
  var activeAccent=getAccentColor();
  var swatches=Object.keys(ACCENT_PRESETS).map(function(key){
    var p=ACCENT_PRESETS[key];
    var active=key===activeAccent;
    return '<div onclick="setAccentColor(\''+key+'\')" style="cursor:pointer;text-align:center">'
      +'<div style="width:100%;aspect-ratio:1;border-radius:14px;background:linear-gradient(135deg,'+p.c1+','+p.c2+');border:3px solid '+(active?'var(--text1,#fff)':'transparent')+';box-shadow:'+(active?'0 0 0 2px '+p.c1+', 0 4px 14px rgba(0,0,0,.3)':'0 2px 8px rgba(0,0,0,.2)')+';position:relative">'
      +(active?'<svg viewBox="0 0 24 24" style="width:1.3em;height:1.3em;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);filter:drop-shadow(0 1px 2px rgba(0,0,0,.5))" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>':'')
      +'</div><div style="font-size:.68rem;color:var(--text2);margin-top:5px;font-weight:'+(active?'700':'500')+'">'+p.label+'</div></div>';
  }).join('');
  var ps=getPrintSize();
  var body='<div style="font-size:.78rem;font-weight:700;color:var(--text2);margin-bottom:10px">Accent Color</div>'
   +'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:20px">'+swatches+'</div>'
   +'<div style="font-size:.78rem;font-weight:700;color:var(--text2);margin-bottom:8px">Text Case <span style="font-weight:400;color:var(--text3);font-size:.7rem">(default UPPER CASE)</span></div>'
   +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px">'
   +'<label style="display:flex;flex-direction:column;align-items:flex-start;gap:6px;background:var(--bg3);border:2px solid '+(!cfg.textCase||cfg.textCase==='upper'?'var(--accent)':'var(--border)')+';border-radius:10px;padding:12px 10px;cursor:pointer" id="tc-upper-label" onclick="document.getElementById(\'tc-upper-label\').style.borderColor=\'var(--accent)\';document.getElementById(\'tc-sentence-label\').style.borderColor=\'var(--border)\'">'
   +'<input type="radio" name="cfg-textCase" id="cfg-textCase-upper" value="upper"'+(!cfg.textCase||cfg.textCase==='upper'?' checked':'')+' style="width:18px;height:18px;accent-color:var(--accent)">'
   +'<div><div style="font-size:.88rem;font-weight:800;letter-spacing:.5px">UPPER CASE</div><div style="font-size:.72rem;color:var(--text3)">All caps (default)</div></div></label>'
   +'<label style="display:flex;flex-direction:column;align-items:flex-start;gap:6px;background:var(--bg3);border:2px solid '+(cfg.textCase==='sentence'?'var(--accent)':'var(--border)')+';border-radius:10px;padding:12px 10px;cursor:pointer" id="tc-sentence-label" onclick="document.getElementById(\'tc-sentence-label\').style.borderColor=\'var(--accent)\';document.getElementById(\'tc-upper-label\').style.borderColor=\'var(--border)\'">'
   +'<input type="radio" name="cfg-textCase" id="cfg-textCase-sentence" value="sentence"'+(cfg.textCase==='sentence'?' checked':'')+' style="width:18px;height:18px;accent-color:var(--accent)">'
   +'<div><div style="font-size:.88rem;font-weight:700">Title Case</div><div style="font-size:.72rem;color:var(--text3)">Each Word Capitalized</div></div></label>'
   +'</div>'
   +'<div style="font-size:.7rem;color:var(--text3);margin-top:-14px;margin-bottom:20px">Changing this instantly re-formats every Group, Section, Item &amp; Participant name already saved &mdash; not just new ones.</div>'
   +'<div style="font-size:.78rem;font-weight:700;color:var(--text2);margin-bottom:8px">Print Text Size <span style="font-weight:400;color:var(--text3);font-size:.7rem">(default Big)</span></div>'
   +'<div style="display:flex;gap:8px">'
   +'<button type="button" class="btn '+(ps==='normal'?'btn-primary':'btn-secondary')+'" style="flex:1" onclick="setPrintSizePersonalize(\'normal\')">Normal<div style="font-size:.62rem;font-weight:500;opacity:.75;margin-top:1px">Compact &middot; fewer pages</div></button>'
   +'<button type="button" class="btn '+(ps!=='normal'?'btn-primary':'btn-secondary')+'" style="flex:1" onclick="setPrintSizePersonalize(\'big\')">Big<div style="font-size:.62rem;font-weight:500;opacity:.75;margin-top:1px">Larger &middot; easier to read</div></button>'
   +'</div>'
   +'<div style="font-size:.7rem;color:var(--text3);margin-top:10px">Applies to every printed report, result sheet &amp; PDF.</div>';
  return _setupModalShell('<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z"/></svg>','Personalize',body);
}
function setPrintSizePersonalize(v){
  localStorage.setItem('winzera_print_size', v);
  showSetupFolder('personalize');
}

// ---- Folder 4: Poster Design Templates & Preset Slots (Poster Designer Engine) ----
function _posterDesignerInit(){ _posterPreviewRender(); }
function _posterEditorSet(key,val){ window._posterEditor[key]=val; _posterPreviewRender(); }
function _posterEditorSetAndRerender(key,val){ window._posterEditor[key]=val; showSetupFolder('poster'); }
function _posterImageUpload(event){
  var file=event.target.files[0]; if(!file) return;
  var reader=new FileReader();
  reader.onload=function(e2){
    var img=new Image();
    img.onload=function(){
      window._posterEditor.imageObj=img;
      window._posterEditor.imageData=e2.target.result;
      showSetupFolder('poster');
    };
    img.src=e2.target.result;
  };
  reader.readAsDataURL(file);
}
function _posterPreviewRender(){
  var canvas=document.getElementById('posterPreviewCanvas'); if(!canvas) return;
  var ctx=canvas.getContext('2d'), W=canvas.width, H=canvas.height;
  var e=window._posterEditor;
  ctx.clearRect(0,0,W,H);
  if(e.mode==='solid'){
    ctx.fillStyle=e.color1; ctx.fillRect(0,0,W,H);
  } else if(e.mode==='gradient'){
    var g=e.gradientDir==='diagonal'?ctx.createLinearGradient(0,0,W,H):ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,e.color1); g.addColorStop(1,e.color2);
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  } else if(e.mode==='image'&&e.imageObj){
    if(e.blur>0){ ctx.save(); ctx.filter='blur('+e.blur+'px)'; drawImageCover(ctx,e.imageObj,-12,-12,W+24,H+24); ctx.restore(); }
    else drawImageCover(ctx,e.imageObj,0,0,W,H);
  } else {
    ctx.fillStyle='#1a0d30'; ctx.fillRect(0,0,W,H);
  }
  if(e.overlay>0){ ctx.fillStyle='rgba(0,0,0,'+(e.overlay/100)+')'; ctx.fillRect(0,0,W,H); }
  // NOTE: this canvas is exactly what gets saved to a preset slot (toDataURL),
  // so it must contain ONLY the background — no sample text/mockup here.
  // The mockup overlay lives on a separate canvas so it never gets baked in.
  _posterMockupRender();
}
function _posterMockupRender(){
  var canvas=document.getElementById('posterMockupCanvas'); if(!canvas) return;
  var ctx=canvas.getContext('2d'), W=canvas.width, H=canvas.height;
  var e=window._posterEditor;
  var L=e.layout||_DEFAULT_POSTER_LAYOUT;
  var viz=e.viz||Object.assign({festName:true,logo:true,date:true,venue:true,tagline:true}, DB.config().posterViz||{});
  ctx.clearRect(0,0,W,H);
  ctx.save();
  ctx.shadowColor='rgba(0,0,0,0.85)'; ctx.shadowBlur=4; ctx.shadowOffsetY=1;
  var tc=L.textColor||'#ffffff';
  var ts=L.textScale||1, tw=L.textWeight||800;
  ctx.textAlign='center';
  var cy=18;
  var lr=16;
  // Logo — space always reserved; only the glyph itself is skipped when hidden
  if(viz.logo!==false){
    ctx.beginPath(); ctx.arc(W/2,cy+lr,lr,0,Math.PI*2);
    ctx.fillStyle='rgba(255,215,0,0.85)'; ctx.fill();
    ctx.font='bold '+lr+'px serif'; ctx.fillStyle='#000'; ctx.textBaseline='middle';
    ctx.fillText('W',W/2,cy+lr+1);
  }
  cy+=lr*2+6;
  ctx.textBaseline='alphabetic';
  if(viz.festName!==false){
    ctx.font=tw+' '+Math.round(12*ts)+'px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='#ffd700';
    ctx.fillText((DB.config().festName)||'Winzera',W/2,cy+10);
  }
  cy+=18;
  if(DB.config().tagline){
    ctx.font='italic '+Math.min(tw,600)+' '+Math.round(7*ts)+'px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(255,215,0,0.75)';
    ctx.fillText(DB.config().tagline,W/2,cy+7); cy+=11;
  }
  if(viz.date!==false || viz.venue!==false){
    var dvParts=[];
    if(viz.date!==false) dvParts.push('12 Jan');
    if(viz.venue!==false) dvParts.push('Main Hall');
    ctx.font=Math.min(tw,600)+' '+Math.round(7*ts)+'px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(255,255,255,.7)';
    ctx.fillText(dvParts.join(' · '),W/2,cy+7);
  }
  cy+=11;
  ctx.font=Math.min(tw,650)+' '+Math.round(8*ts)+'px "Segoe UI",Arial,sans-serif'; ctx.fillStyle=tc;
  ctx.fillText('JUNIOR',W/2,cy+8); cy+=12;
  cy+=6;
  // Sample row
  var rowY=cy, rowH=44;
  ctx.textAlign='left';
  var pr=13*(L.photoScale||1), pcx=26, pcy=rowY+rowH/2;
  ctx.beginPath(); ctx.arc(pcx,pcy,pr,0,Math.PI*2);
  ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.fill();
  ctx.font='bold '+Math.round(pr)+'px serif'; ctx.fillStyle='#333'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('S',pcx,pcy+1);
  var tx=pcx+pr+12;
  ctx.textAlign='left'; ctx.textBaseline='alphabetic';
  ctx.font=tw+' '+Math.round(13*ts)+'px "Segoe UI",Arial,sans-serif'; ctx.fillStyle=tc;
  ctx.fillText('SALIM',tx,rowY+18);
  ctx.font=Math.min(tw,600)+' '+Math.round(9*ts)+'px "Segoe UI",Arial,sans-serif'; ctx.fillStyle=tc;
  ctx.fillText('RED',tx,rowY+32);
  ctx.restore();
}
var _DEFAULT_POSTER_LAYOUT = {photoScale:1,textScale:1,textColor:'#ffffff',textWeight:800};
function _posterLayoutSet(key,val){
  if(!window._posterEditor.layout) window._posterEditor.layout=Object.assign({},_DEFAULT_POSTER_LAYOUT);
  window._posterEditor.layout[key]=parseFloat(val);
  _posterMockupRender();
}
function _posterLayoutSetColor(key,val){
  if(!window._posterEditor.layout) window._posterEditor.layout=Object.assign({},_DEFAULT_POSTER_LAYOUT);
  window._posterEditor.layout[key]=val;
  _posterMockupRender();
}
function _posterLayoutReset(){
  window._posterEditor.layout=Object.assign({},_DEFAULT_POSTER_LAYOUT);
  showSetupFolder('poster');
}
function _posterVizSet(key,val){
  var cfg=DB.config();
  cfg.posterViz=Object.assign({festName:true,logo:true,date:true,venue:true,tagline:true}, cfg.posterViz||{});
  cfg.posterViz[key]=!!val;
  DB.saveConfig(cfg);
}
// Toggle used by the live-editing checkboxes: persists AND refreshes the mockup demo immediately
function _posterVizToggle(key,val){
  if(!window._posterEditor.viz) window._posterEditor.viz=Object.assign({festName:true,logo:true,date:true,venue:true,tagline:true}, DB.config().posterViz||{});
  window._posterEditor.viz[key]=!!val;
  _posterVizSet(key,val);
  _posterMockupRender();
}
function _posterBadgeStyleSet(val){
  var cfg=DB.config();
  cfg.posterBadgeStyle=val;
  DB.saveConfig(cfg);
  toast('Badge style updated!');
}
function _posterSaveToSlot(idx){
  var canvas=document.getElementById('posterPreviewCanvas'); if(!canvas) return;
  var cfg=DB.config(); var slots=(cfg.posterPresets||[]).slice(); while(slots.length<10) slots.push(null);
  var e=window._posterEditor;
  var doSave=function(){
    slots[idx]={mode:e.mode,color1:e.color1,color2:e.color2,gradientDir:e.gradientDir,blur:e.blur,overlay:e.overlay,bg:canvas.toDataURL('image/jpeg',0.85),label:'Style '+(idx+1),layout:Object.assign({},e.layout),viz:Object.assign({festName:true,logo:true,date:true,venue:true,tagline:true},e.viz||{})};
    cfg.posterPresets=slots; DB.saveConfig(cfg);
    toast('Saved to slot '+(idx+1)+'!');
    showSetupFolder('poster');
  };
  if(slots[idx]){
    _wzConfirm('Slot '+(idx+1)+' already has a saved style. Overwriting will replace it permanently.',
      '_posterSaveToSlot_confirmed('+idx+')',
      {title:'Overwrite Slot '+(idx+1)+'?', confirmLabel:'Overwrite', dangerConfirm:true});
    window._posterSaveToSlot_pending=doSave;
  } else doSave();
}
function _posterSaveToSlot_confirmed(idx){
  if(window._posterSaveToSlot_pending){ window._posterSaveToSlot_pending(); window._posterSaveToSlot_pending=null; }
}
function _posterLoadSlot(idx){
  var cfg=DB.config(); var p=(cfg.posterPresets||[])[idx]; if(!p) return;
  var e=window._posterEditor;
  e.mode=p.mode; e.color1=p.color1||'#1a0d30'; e.color2=p.color2||'#2d1060';
  e.gradientDir=p.gradientDir||'vertical'; e.blur=p.blur||0; e.overlay=p.overlay!=null?p.overlay:40;
  e.layout=Object.assign({},_DEFAULT_POSTER_LAYOUT,p.layout||{});
  e.viz=Object.assign({festName:true,logo:true,date:true,venue:true,tagline:true},p.viz||{});
  cfg.posterViz=Object.assign({},e.viz); DB.saveConfig(cfg);
  e.imageObj=null; e.imageData=null;
  if(p.mode==='image'&&p.bg){
    var img=new Image();
    img.onload=function(){ e.imageObj=img; e.imageData=p.bg; showSetupFolder('poster'); };
    img.src=p.bg;
  } else {
    showSetupFolder('poster');
  }
}
function _posterDeleteSlot(idx,ev){
  if(ev) ev.stopPropagation();
  var cfg=DB.config(); var slots=(cfg.posterPresets||[]).slice();
  slots[idx]=null;
  if(cfg.activePosterPreset===idx) cfg.activePosterPreset=null;
  cfg.posterPresets=slots; DB.saveConfig(cfg);
  toast('Preset deleted');
  showSetupFolder('poster');
}
function _posterSetActive(idx){
  var cfg=DB.config(); cfg.activePosterPreset=idx; DB.saveConfig(cfg);
  toast('Active poster style set!'); showSetupFolder('poster');
}
function _posterClearActive(){
  var cfg=DB.config(); cfg.activePosterPreset=null; DB.saveConfig(cfg);
  toast('Reverted to default random styles'); showSetupFolder('poster');
}
// ---- Poster & Certificate (sub-tabs) ----
function _posterCertSetTab(tab){
  window._posterCertTab=tab;
  ['poster','cert'].forEach(function(t){
    var pane=document.getElementById('pctab-'+t), btn=document.getElementById('pcbtn-'+t);
    if(pane) pane.style.display=(t===tab?'block':'none');
    if(btn){ btn.style.background=(t===tab?'var(--accent)':'var(--bg3)'); btn.style.color=(t===tab?'#000':'var(--text2)'); }
  });
  if(tab==='poster') _posterDesignerInit();
  if(tab==='cert') _certDesignerInit();
}
function _setupFolderPoster(cfg){
  if(!window._posterEditor) window._posterEditor={mode:'gradient',color1:'#1a0d30',color2:'#2d1060',gradientDir:'vertical',blur:6,overlay:40,imageObj:null,imageData:null,layout:Object.assign({},_DEFAULT_POSTER_LAYOUT)};
  if(!window._posterEditor.layout) window._posterEditor.layout=Object.assign({},_DEFAULT_POSTER_LAYOUT);
  if(!window._posterEditor.viz) window._posterEditor.viz=Object.assign({festName:true,logo:true,date:true,venue:true,tagline:true}, cfg.posterViz||{});
  var e=window._posterEditor;
  var slots=cfg.posterPresets||[]; var active=cfg.activePosterPreset;
  var modeBtn=function(m,label){
    return '<button type="button" onclick="_posterEditorSetAndRerender(\'mode\',\''+m+'\')" style="flex:1;padding:9px 6px;border-radius:8px;border:2px solid '+(e.mode===m?'var(--accent)':'var(--border)')+';background:'+(e.mode===m?'var(--accent)':'var(--bg3)')+';color:'+(e.mode===m?'#000':'var(--text2)')+';font-size:.76rem;font-weight:700;cursor:pointer">'+label+'</button>';
  };
  var tabBtn=function(id,label){ return '<button type="button" id="pcbtn-'+id+'" onclick="_posterCertSetTab(\''+id+'\')" style="flex:1;padding:9px 6px;border-radius:8px;border:none;font-size:.76rem;font-weight:700;cursor:pointer;background:var(--bg3);color:var(--text2)">'+label+'</button>'; };
  var body='<div style="display:flex;gap:6px;background:var(--bg3);padding:4px;border-radius:10px;margin-bottom:14px">'
    +tabBtn('poster','Poster Design')+tabBtn('cert','Certificate Design')+'</div>';
  body+='<div id="pctab-poster">';
  body+='<div style="position:relative;margin-bottom:12px">'
    +'<canvas id="posterPreviewCanvas" width="320" height="200" style="width:100%;display:block;border-radius:12px;border:1px solid var(--border);background:#000"></canvas>'
    +'<canvas id="posterMockupCanvas" width="320" height="200" style="width:100%;display:block;position:absolute;top:0;left:0;pointer-events:none"></canvas>'
    +'</div>'
    +'<div style="display:flex;gap:6px;margin-bottom:12px">'+modeBtn('solid','Solid')+modeBtn('gradient','Gradient')+modeBtn('image','Image')+'</div>';
  if(e.mode==='solid'){
    body+='<div class="form-group"><label class="form-label">Color</label><input type="color" value="'+e.color1+'" oninput="_posterEditorSet(\'color1\',this.value)" style="width:100%;height:44px;border-radius:8px;border:1px solid var(--border);background:none;cursor:pointer"></div>';
  } else if(e.mode==='gradient'){
    body+='<div class="form-row"><div class="form-group"><label class="form-label">Top Color</label><input type="color" value="'+e.color1+'" oninput="_posterEditorSet(\'color1\',this.value)" style="width:100%;height:44px;border-radius:8px;border:1px solid var(--border);background:none;cursor:pointer"></div>'
      +'<div class="form-group"><label class="form-label">Bottom Color</label><input type="color" value="'+e.color2+'" oninput="_posterEditorSet(\'color2\',this.value)" style="width:100%;height:44px;border-radius:8px;border:1px solid var(--border);background:none;cursor:pointer"></div></div>'
      +'<div style="display:flex;gap:6px;margin-bottom:12px">'
      +'<button type="button" onclick="_posterEditorSetAndRerender(\'gradientDir\',\'vertical\')" style="flex:1;padding:8px;border-radius:8px;border:2px solid '+(e.gradientDir!=='diagonal'?'var(--accent)':'var(--border)')+';background:var(--bg3);color:var(--text2);font-size:.72rem;font-weight:700;cursor:pointer">Top &rarr; Bottom</button>'
      +'<button type="button" onclick="_posterEditorSetAndRerender(\'gradientDir\',\'diagonal\')" style="flex:1;padding:8px;border-radius:8px;border:2px solid '+(e.gradientDir==='diagonal'?'var(--accent)':'var(--border)')+';background:var(--bg3);color:var(--text2);font-size:.72rem;font-weight:700;cursor:pointer">Diagonal</button>'
      +'</div>';
  } else if(e.mode==='image'){
    body+='<label style="cursor:pointer"><input type="file" accept="image/*" style="display:none" onchange="_posterImageUpload(event)">'
      +'<div class="btn btn-secondary btn-sm" style="display:inline-flex;gap:6px;align-items:center;margin-bottom:12px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></svg> '+(e.imageObj?'Change Image':'Upload Image')+'</div></label>'
      +'<div class="form-group"><label class="form-label">Blur</label><input type="range" min="0" max="20" value="'+e.blur+'" oninput="_posterEditorSet(\'blur\',parseInt(this.value))" style="width:100%"></div>';
  }
  body+='<div class="form-group"><label class="form-label">Dark Overlay Opacity</label><input type="range" min="0" max="80" value="'+e.overlay+'" oninput="_posterEditorSet(\'overlay\',parseInt(this.value))" style="width:100%"></div>';
  // ---- Text & Photo (applies to the Public Podium poster) ----
  var L=e.layout;
  body+='<div style="font-size:.78rem;font-weight:800;color:var(--text2);margin:16px 0 8px;padding-top:12px;border-top:1px solid var(--border)">Photo &amp; Text</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px">'
    +'<div class="form-group"><label class="form-label">Photo Size</label><input type="range" min="60" max="150" value="'+Math.round(L.photoScale*100)+'" oninput="_posterLayoutSet(\'photoScale\',this.value/100)" style="width:100%"></div>'
    +'<div class="form-group"><label class="form-label">Text Size</label><input type="range" min="70" max="150" value="'+Math.round(L.textScale*100)+'" oninput="_posterLayoutSet(\'textScale\',this.value/100)" style="width:100%"></div>'
    +'<div class="form-group"><label class="form-label">Text Weight</label><input type="range" min="400" max="900" step="50" value="'+L.textWeight+'" oninput="_posterLayoutSet(\'textWeight\',parseInt(this.value))" style="width:100%"></div>'
    +'<div class="form-group"><label class="form-label">Text Color</label><input type="color" value="'+(L.textColor||'#ffffff')+'" oninput="_posterLayoutSetColor(\'textColor\',this.value)" style="width:100%;height:38px;border-radius:8px;border:1px solid var(--border);background:none;cursor:pointer"></div>'
    +'</div>'
    +'<button type="button" class="btn btn-secondary btn-sm" style="width:100%;margin:8px 0 6px" onclick="_posterLayoutReset()">Reset to Default</button>';
  // ---- Poster Content visibility (Public Podium poster) — 2x2 grid, live demo ----
  var viz=e.viz;
  var vizCell=function(key,label){
    return '<label style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border:1px solid var(--border);border-radius:8px;cursor:pointer">'
      +'<span style="font-size:.8rem;font-weight:600">'+label+'</span>'
      +'<span class="toggle-switch"><input type="checkbox" '+(viz[key]!==false?'checked':'')+' onchange="_posterVizToggle(\''+key+'\',this.checked)"><span class="toggle-slider"></span></span>'
      +'</label>';
  };
  var vizCellMulti=function(keys,label){
    var allOn=keys.every(function(k){return viz[k]!==false;});
    var onChange=keys.map(function(k){return '_posterVizToggle(\''+k+'\',this.checked)';}).join(';');
    return '<label style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border:1px solid var(--border);border-radius:8px;cursor:pointer">'
      +'<span style="font-size:.8rem;font-weight:600">'+label+'</span>'
      +'<span class="toggle-switch"><input type="checkbox" '+(allOn?'checked':'')+' onchange="'+onChange+'"><span class="toggle-slider"></span></span>'
      +'</label>';
  };
  body+='<div style="font-size:.78rem;font-weight:800;color:var(--text2);margin:16px 0 8px;padding-top:12px;border-top:1px solid var(--border)">Poster Content</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
    +vizCell('festName','Fest Name')+vizCell('logo','Logo')+vizCellMulti(['date','venue'],'Date & Venue')+vizCell('tagline','Tagline')
    +'</div>';
  body+='<div style="font-size:.73rem;font-weight:700;color:var(--text2);margin:14px 0 8px">Save current design to a slot</div>'
    +'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-bottom:16px">';
  for(var i=0;i<10;i++){
    body+='<button type="button" onclick="_posterSaveToSlot('+i+')" style="padding:10px 4px;border-radius:8px;border:1px dashed var(--border);background:var(--bg3);color:var(--text2);font-size:.75rem;font-weight:700;cursor:pointer">'+(i+1)+'</button>';
  }
  body+='</div>';
  body+='<div style="font-size:.73rem;font-weight:700;color:var(--text2);margin-bottom:8px">Your Saved Presets</div>';
  var any=false;
  body+='<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:10px">';
  for(var i=0;i<10;i++){
    var p=slots[i];
    if(!p){ body+='<div style="aspect-ratio:1;border-radius:8px;border:1px dashed var(--border);display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:.7rem">'+(i+1)+'</div>'; continue; }
    any=true;
    body+='<div onclick="_posterLoadSlot('+i+')" style="position:relative;aspect-ratio:1;border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid '+(active===i?'var(--accent)':'var(--border)')+';background-image:url(\''+p.bg+'\');background-size:cover;background-position:center">'
      +(active===i?'<div style="position:absolute;top:2px;left:2px;background:var(--accent);color:#000;font-size:.6rem;font-weight:800;padding:1px 4px;border-radius:4px">ACTIVE</div>':'')
      +'<button type="button" onclick="_posterDeleteSlot('+i+',event)" style="position:absolute;top:2px;right:2px;width:18px;height:18px;border-radius:50%;background:rgba(0,0,0,.6);color:#fff;border:none;font-size:.7rem;cursor:pointer;line-height:1">&times;</button>'
      +'</div>';
  }
  body+='</div>';
  if(any){
    body+='<div style="display:flex;gap:8px;margin-bottom:6px">'
      +'<div style="flex:1">'+_wzDropdown('posterActiveSelect',
          [{value:'',label:'No custom style (use default random)'}].concat(
            slots.map(function(p,i){ return p?{value:i,label:'Slot '+(i+1)}:null; }).filter(Boolean)
          ), (active===undefined||active===null)?'':active, {})+'</div>'
      +'<button type="button" class="btn btn-primary btn-sm" onclick="var s=document.getElementById(\'posterActiveSelect\').value; s===\'\'?_posterClearActive():_posterSetActive(parseInt(s))">Apply</button>'
      +'</div>';
  }
  body+='</div>'; // end pctab-poster

  body+='<div id="pctab-cert" style="display:none">'
    +_certDesignTabContent(cfg)
    +'</div>'; // end pctab-cert

  return _setupModalShell('<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5-11 11"/></svg>','Poster &amp; Certificate',body,{noSaveBtn:true});
}

// =============================================
// CERTIFICATE DESIGN ENGINE (A4 Landscape)
// =============================================
var _CERT_TEMPLATES = [
  {key:'gold',    name:'Classic Gold',   color1:'#1a0d30', color2:'#2d1060', accent:'#f0a500'},
  {key:'navy',    name:'Navy Elegant',   color1:'#0a1a3a', color2:'#132b5e', accent:'#c9a227'},
  {key:'emerald', name:'Emerald Formal', color1:'#0b2e23', color2:'#134438', accent:'#d4af37'},
  {key:'maroon',  name:'Maroon Classic', color1:'#3a0b14', color2:'#5c1220', accent:'#e0b876'},
  {key:'ivory',   name:'Ivory Minimal',  color1:'#f7f3e8', color2:'#efe6d0', accent:'#8b6d1a', dark:false}
];
window._certSigImgCache = window._certSigImgCache || {};

function _certDesignerInit(){
  var cfg=DB.config();
  if(!window._certEditor) window._certEditor={};
  window._certEditor.template = (cfg.certDesign&&cfg.certDesign.template) || window._certEditor.template || 'gold';
  var imgData = (cfg.certDesign&&cfg.certDesign.imageData) || null;
  if(imgData && (!window._certEditor.imageObj || window._certEditor.imageData!==imgData)){
    window._certEditor.imageData=imgData;
    var img=new Image();
    img.onload=function(){ window._certEditor.imageObj=img; _certPreviewRender(); };
    img.src=imgData;
  }
  _certPreviewRender();
}

function _certRebuildSigCache(cfg, cb){
  var sigs=(cfg.certSignatories||[]);
  var pending=0, finished=false;
  var done=function(){ pending--; if(pending<=0 && !finished){ finished=true; if(cb) cb(); } };
  sigs.forEach(function(s){
    if(!s.sig || window._certSigImgCache[s.id]) return;
    pending++;
    var img=new Image();
    img.onload=function(){ window._certSigImgCache[s.id]=img; done(); };
    img.onerror=done;
    img.src=s.sig;
  });
  if(pending===0){ finished=true; if(cb) cb(); }
}

function _certSampleWinner(){
  return {participant:{name:'Participant Name', team:'Team Name'}, item:{name:'Item Name', section:'Section'}, rank:1, marks:{total:95, grade:'A+'}};
}

// ── Certificate design presets — save/load full design (template, custom bg,
// overlay, text size/color, content toggles) to one of 10 slots, same idea as
// the Poster Design presets. Unlike posters (which pick a random style per
// team), certificates only ever have ONE active design at a time, so loading
// a slot simply makes it the current design.
function _certSaveToSlot(idx){
  var canvas=document.getElementById('certPreviewCanvas'); if(!canvas) return;
  var cfg=DB.config(); var slots=(cfg.certPresets||[]).slice(); while(slots.length<10) slots.push(null);
  var cd=cfg.certDesign||{};
  var tpl=(window._certEditor&&window._certEditor.template) || cd.template || 'gold';
  var doSave=function(){
    slots[idx]={
      template:tpl,
      imageData: tpl==='custom' ? (window._certEditor&&window._certEditor.imageData||null) : null,
      orientation: cd.orientation||'landscape',
      overlay: cd.overlay!=null?cd.overlay:null,
      textScale: cd.textScale||1,
      textColor: cd.textColor||'',
      viz: Object.assign({festName:true,logo:true,date:true,venue:true,tagline:true}, cfg.certViz||{}),
      bg: canvas.toDataURL('image/jpeg',0.85),
      label: 'Design '+(idx+1)
    };
    cfg.certPresets=slots; DB.saveConfig(cfg);
    toast('Saved to slot '+(idx+1)+'!');
    showSetupFolder('poster');
  };
  if(slots[idx]){
    _wzConfirm('Slot '+(idx+1)+' already has a saved certificate design. Overwriting will replace it permanently.',
      '_certSaveToSlot_confirmed('+idx+')',
      {title:'Overwrite Slot '+(idx+1)+'?', confirmLabel:'Overwrite', dangerConfirm:true});
    window._certSaveToSlot_pending=doSave;
  } else doSave();
}
function _certSaveToSlot_confirmed(idx){
  if(window._certSaveToSlot_pending){ window._certSaveToSlot_pending(); window._certSaveToSlot_pending=null; }
}
// Applies a saved slot's design into cfg (persisted) and, if it uses a custom
// background, loads that image before calling back — used both by "load slot"
// in the designer and by the pre-print preset picker.
function _certApplyPreset(idx, cb){
  var cfg=DB.config(); var p=(cfg.certPresets||[])[idx];
  if(!p){ if(cb) cb(); return; }
  cfg.certDesign=Object.assign({}, cfg.certDesign, {
    template:p.template, imageData:p.imageData||null, orientation:p.orientation||'landscape',
    overlay:(p.overlay!=null?p.overlay:null), textScale:p.textScale||1, textColor:p.textColor||''
  });
  cfg.certViz=Object.assign({festName:true,logo:true,date:true,venue:true,tagline:true}, p.viz||{});
  DB.saveConfig(cfg);
  if(!window._certEditor) window._certEditor={};
  window._certEditor.template=p.template;
  if(p.template==='custom' && p.imageData){
    var img=new Image();
    img.onload=function(){ window._certEditor.imageObj=img; window._certEditor.imageData=p.imageData; if(cb) cb(); };
    img.onerror=function(){ if(cb) cb(); };
    img.src=p.imageData;
  } else {
    window._certEditor.imageObj=null; window._certEditor.imageData=null;
    if(cb) cb();
  }
}
function _certLoadSlot(idx){
  _certApplyPreset(idx, function(){ toast('Design loaded!'); showSetupFolder('poster'); });
}
function _certDeleteSlot(idx,ev){
  if(ev) ev.stopPropagation();
  var cfg=DB.config(); var slots=(cfg.certPresets||[]).slice();
  slots[idx]=null;
  cfg.certPresets=slots; DB.saveConfig(cfg);
  toast('Design deleted');
  showSetupFolder('poster');
}
// ── Preset picker shown right before printing/exporting, so the admin can
// switch to a different saved design just for this print job (it becomes the
// current design, same as loading it from the designer). Skipped entirely
// when no designs have been saved yet.
function _certOpenPresetPicker(mode, idx){
  var cfg=DB.config();
  var slots=cfg.certPresets||[];
  var options=[{value:'',label:'Use Current Design'}].concat(
    slots.map(function(p,i){ return p?{value:String(i),label:p.label||('Design '+(i+1))}:null; }).filter(Boolean)
  );
  if(options.length<=1){
    if(mode==='single') _certPrintSingle(idx); else _certExportAllPDF();
    return;
  }
  window._certPrintPickerCtx={mode:mode, idx:idx};
  showModal('<div class="modal-handle"></div>'
    +'<div class="modal-title">Choose Certificate Design</div>'
    +'<div style="font-size:.78rem;color:var(--text2);margin-bottom:12px">Pick a saved design to use for this '+(mode==='single'?'certificate':'batch')+', or keep the current one.</div>'
    +'<div class="form-group">'+_wzDropdown('certPrintPresetDD', options, '', {})+'</div>'
    +'<button class="btn btn-primary" style="width:100%;margin-top:6px" onclick="_certPrintPresetConfirm()">Continue</button>'
    +'<button class="btn btn-secondary" style="width:100%;margin-top:8px" onclick="closeModal()">Cancel</button>', {noDirtyGuard:true});
}
function _certPrintPresetConfirm(){
  var ctx=window._certPrintPickerCtx; if(!ctx) return;
  var sel=document.getElementById('certPrintPresetDD');
  var val=sel?sel.value:'';
  closeModal();
  var proceed=function(){ if(ctx.mode==='single') _certPrintSingle(ctx.idx); else _certExportAllPDF(); };
  if(val==='') proceed();
  else _certApplyPreset(parseInt(val,10), proceed);
}

// ── Certificate page orientation (A4 Portrait / Landscape) ──
function _certOrientation(cfg){
  return (cfg.certDesign && cfg.certDesign.orientation==='portrait') ? 'portrait' : 'landscape';
}
// Given base landscape dimensions (w>h), returns {w,h} swapped for portrait if needed
function _certDims(cfg, baseW, baseH){
  return _certOrientation(cfg)==='portrait' ? {w:baseH, h:baseW} : {w:baseW, h:baseH};
}
function _certOrientationSet(val){
  var cfg=DB.config();
  cfg.certDesign=Object.assign({}, cfg.certDesign, {orientation:val});
  DB.saveConfig(cfg);
  showSetupFolder('poster');
}
// ── Dark Overlay / Text Size / Text Color (mirrors the Poster Design controls) ──
function _certOverlaySet(val){
  var cfg=DB.config();
  cfg.certDesign=Object.assign({}, cfg.certDesign, {overlay:parseInt(val,10)});
  DB.saveConfig(cfg);
  _certPreviewRender();
}
function _certTextScaleSet(val){
  var cfg=DB.config();
  cfg.certDesign=Object.assign({}, cfg.certDesign, {textScale:parseFloat(val)});
  DB.saveConfig(cfg);
  _certPreviewRender();
}
function _certTextColorSet(val){
  var cfg=DB.config();
  cfg.certDesign=Object.assign({}, cfg.certDesign, {textColor:val});
  DB.saveConfig(cfg);
  _certPreviewRender();
}
function _certTextColorReset(){
  var cfg=DB.config();
  cfg.certDesign=Object.assign({}, cfg.certDesign, {textColor:''});
  DB.saveConfig(cfg);
  showSetupFolder('poster');
}
// ── Certificate Content visibility toggles (Fest Name / Logo / Date & Venue / Tagline) ──
function _certVizToggle(key,val){
  var cfg=DB.config();
  cfg.certViz=Object.assign({festName:true,logo:true,date:true,venue:true,tagline:true}, cfg.certViz||{});
  cfg.certViz[key]=!!val;
  DB.saveConfig(cfg);
  _certPreviewRender();
}
function _certGetTemplate(cfg){
  var d=(cfg.certDesign)||{};
  var tpl=_CERT_TEMPLATES.find(function(t){ return t.key===d.template; }) || _CERT_TEMPLATES[0];
  return {template:d.template||'gold', tpl:tpl};
}

function _certDrawCanvas(canvas, winner, cfg, sigImgCache){
  var ctx=canvas.getContext('2d');
  var W=canvas.width, H=canvas.height;
  var d=_certGetTemplate(cfg);
  var cd=cfg.certDesign||{};
  var certViz=Object.assign({festName:true,logo:true,date:true,venue:true,tagline:true}, cfg.certViz||{});
  var isCustom = d.template==='custom' && window._certEditor && window._certEditor.imageObj;
  ctx.clearRect(0,0,W,H);
  if(isCustom){
    var img=window._certEditor.imageObj;
    var ir=img.width/img.height, cr=W/H, dw,dh,dx,dy;
    if(ir>cr){ dh=H; dw=H*ir; dx=(W-dw)/2; dy=0; } else { dw=W; dh=W/ir; dx=0; dy=(H-dh)/2; }
    ctx.drawImage(img,dx,dy,dw,dh);
  } else {
    var t=d.tpl;
    var grad=ctx.createLinearGradient(0,0,W,H);
    grad.addColorStop(0,t.color1); grad.addColorStop(1,t.color2);
    ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);
  }
  // Dark overlay — configurable (defaults to a readable 35% only when a
  // custom photo background is used; template gradients don't need it and
  // default to 0 so a light/white custom image doesn't get muddied unless
  // the user actually wants some overlay for text contrast).
  var overlayPct = (cd.overlay!=null) ? cd.overlay : (isCustom ? 35 : 0);
  if(overlayPct>0){ ctx.fillStyle='rgba(0,0,0,'+(overlayPct/100)+')'; ctx.fillRect(0,0,W,H); }

  var dark = !(d.tpl && d.tpl.dark===false);
  var textColorOverride = cd.textColor || '';
  var textMain = textColorOverride || (dark ? '#ffffff' : '#2a2010');
  var textSub = textColorOverride ? _hexAlpha(textColorOverride,0.72) : (dark ? 'rgba(255,255,255,.72)' : 'rgba(40,30,10,.72)');
  var accent = d.tpl.accent;
  var TS = cd.textScale || 1;
  var fs=function(mult){ return Math.round(W*mult*TS); };

  // Custom photo backgrounds bring their own framing — the decorative double
  // border is only drawn over the built-in gradient templates.
  if(!isCustom){
    ctx.strokeStyle=accent; ctx.lineWidth=Math.max(1,Math.round(W*0.006));
    ctx.strokeRect(W*0.025,H*0.035,W*0.95,H*0.93);
    ctx.lineWidth=Math.max(1,Math.round(W*0.0018));
    ctx.strokeRect(W*0.035,H*0.05,W*0.93,H*0.9);
  }

  var logoImg = (certViz.logo!==false) ? window._certLogoImg : null;
  if(logoImg){
    var lr=H*0.045, lcx=W/2, lcy=H*0.035+lr+4;
    ctx.save();
    ctx.beginPath(); ctx.arc(lcx,lcy,lr,0,Math.PI*2); ctx.closePath(); ctx.clip();
    var lir=logoImg.width/logoImg.height, ldw,ldh;
    if(lir>1){ ldh=lr*2; ldw=ldh*lir; } else { ldw=lr*2; ldh=ldw/lir; }
    ctx.drawImage(logoImg, lcx-ldw/2, lcy-ldh/2, ldw, ldh);
    ctx.restore();
    ctx.strokeStyle=accent; ctx.lineWidth=Math.max(1,Math.round(W*0.0022));
    ctx.beginPath(); ctx.arc(lcx,lcy,lr,0,Math.PI*2); ctx.stroke();
  }

  ctx.textAlign='center';
  ctx.fillStyle=accent;
  ctx.font='700 '+fs(0.018)+'px Georgia, serif';
  ctx.fillText('CERTIFICATE OF ACHIEVEMENT', W/2, H*0.15);

  var yy=H*0.26;
  if(certViz.festName!==false){
    ctx.fillStyle=textMain;
    ctx.font='800 '+fs(0.04)+'px Georgia, serif';
    ctx.fillText(cfg.festName||'Winzera', W/2, H*0.225, W*0.8);
  }
  if(certViz.tagline!==false && cfg.tagline){
    ctx.fillStyle=textSub;
    ctx.font='italic '+fs(0.015)+'px Georgia, serif';
    ctx.fillText(cfg.tagline, W/2, yy, W*0.8);
    yy+=H*0.03;
  }
  ctx.fillStyle=textSub;
  ctx.font=fs(0.015)+'px Georgia, serif';
  ctx.fillText(cfg.institution||'', W/2, yy, W*0.8);

  ctx.fillStyle=textMain;
  ctx.font=fs(0.017)+'px Georgia, serif';
  ctx.fillText('This is to certify that', W/2, H*0.4);

  ctx.fillStyle=accent;
  ctx.font='700 '+fs(0.035)+'px Georgia, serif';
  ctx.fillText(winner.participant.name, W/2, H*0.465, W*0.85);
  var nameW=Math.min(ctx.measureText(winner.participant.name).width, W*0.85);
  ctx.strokeStyle=accent; ctx.lineWidth=Math.max(1,Math.round(W*0.0022));
  ctx.beginPath(); ctx.moveTo(W/2-nameW/2-10,H*0.48); ctx.lineTo(W/2+nameW/2+10,H*0.48); ctx.stroke();

  ctx.fillStyle=textMain;
  ctx.font=fs(0.016)+'px Georgia, serif';
  ctx.fillText('representing '+winner.participant.team, W/2, H*0.52, W*0.85);

  var ranks=['First','Second','Third'];
  ctx.fillText('has won '+(ranks[winner.rank-1]||(winner.rank+'th'))+' Place in', W/2, H*0.565);

  ctx.fillStyle=accent;
  ctx.font='700 '+fs(0.023)+'px Georgia, serif';
  ctx.fillText(winner.item.name, W/2, H*0.615, W*0.85);

  ctx.fillStyle=textSub;
  ctx.font=fs(0.013)+'px Georgia, serif';
  ctx.fillText(winner.item.section+' Category  ·  Marks: '+winner.marks.total+'  ·  Grade: '+winner.marks.grade, W/2, H*0.655, W*0.85);

  var _certDateStr = (certViz.date!==false && typeof formatFestDate==='function') ? formatFestDate(cfg) : '';
  var _certVenueStr = (certViz.venue!==false && cfg.venue) ? cfg.venue : '';
  var _dvLine=[_certVenueStr,_certDateStr].filter(Boolean).join(' · ');
  if(_dvLine){
    ctx.font=fs(0.011)+'px Georgia, serif';
    ctx.fillText(_dvLine, W/2, H*0.7);
  }

  var sigs=(cfg.certSignatories||[]).slice(0,3);
  if(sigs.length){
    var n=sigs.length, footY=H*0.87, slotW=(W*0.8)/n, startX=W*0.1;
    for(var i=0;i<n;i++){
      var cx=startX+slotW*i+slotW/2, sObj=sigs[i];
      var img2 = sigImgCache && sigImgCache[sObj.id];
      if(img2){
        // Fit the signature within the slot (contain, not stretch) — derive both
        // dimensions from a single scale factor so the true aspect ratio is always
        // kept, whichever bound (max width or max height) ends up tighter.
        var maxSw=slotW*0.46, maxSh=H*0.08;
        var sigScale=Math.min(maxSw/img2.width, maxSh/img2.height);
        var sw=img2.width*sigScale, sh=img2.height*sigScale;
        ctx.drawImage(img2, cx-sw/2, footY-sh-6, sw, sh);
      }
      ctx.strokeStyle=textSub; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(cx-slotW*0.32,footY); ctx.lineTo(cx+slotW*0.32,footY); ctx.stroke();
      ctx.fillStyle=textMain; ctx.font='700 '+fs(0.012)+'px Georgia, serif';
      ctx.fillText(sObj.name||'', cx, footY+H*0.025, slotW*0.9);
      ctx.fillStyle=textSub; ctx.font=fs(0.01)+'px Georgia, serif';
      ctx.fillText(sObj.designation||'', cx, footY+H*0.043, slotW*0.9);
    }
  }
}

// Loads (and caches) the custom background image and the fest logo image so
// certificates can be drawn correctly from any entry point (preview, single
// print, bulk export) even if the Certificate Design tab was never opened
// this session.
function _certEnsureAssets(cfg, cb){
  var certViz=Object.assign({festName:true,logo:true,date:true,venue:true,tagline:true}, cfg.certViz||{});
  var bgSrc = (cfg.certDesign && cfg.certDesign.template==='custom') ? (cfg.certDesign.imageData||null) : null;
  var bgReady = !bgSrc || (window._certEditor && window._certEditor.imageObj && window._certEditor.imageData===bgSrc);
  var logoSrc = (certViz.logo!==false) ? (cfg.logo||null) : null;
  var logoReady = !logoSrc || (window._certLogoImg && window._certLogoImgSrc===logoSrc);
  if(!logoSrc) window._certLogoImg=null;
  var pending=0, finished=false;
  function finish(){ if(finished) return; finished=true; cb(); }
  function done(){ pending--; if(pending<=0) finish(); }
  if(!bgReady){
    pending++;
    var img=new Image();
    img.onload=function(){ if(!window._certEditor) window._certEditor={}; window._certEditor.imageObj=img; window._certEditor.imageData=bgSrc; done(); };
    img.onerror=done;
    img.src=bgSrc;
  }
  if(!logoReady){
    pending++;
    var img2=new Image();
    img2.onload=function(){ window._certLogoImg=img2; window._certLogoImgSrc=logoSrc; done(); };
    img2.onerror=function(){ window._certLogoImg=null; done(); };
    img2.src=logoSrc;
  }
  if(pending===0) finish();
}
// Combines signature + background + logo asset loading before any certificate draw.
function _certPrepare(cfg, cb){
  _certRebuildSigCache(cfg, function(){ _certEnsureAssets(cfg, cb); });
}

function _certPreviewRender(){
  var canvas=document.getElementById('certPreviewCanvas'); if(!canvas) return;
  var cfg=DB.config();
  _certPrepare(cfg, function(){
    _certDrawCanvas(canvas, _certSampleWinner(), cfg, window._certSigImgCache);
  });
}

function _certTemplateSet(key){
  var cfg=DB.config();
  cfg.certDesign=Object.assign({}, cfg.certDesign, {template:key});
  DB.saveConfig(cfg);
  if(!window._certEditor) window._certEditor={};
  window._certEditor.template=key;
  showSetupFolder('poster');
}

function _certImageUpload(event){
  var file=event.target.files[0]; if(!file) return;
  var reader=new FileReader();
  reader.onload=function(e){
    var cfg=DB.config();
    cfg.certDesign=Object.assign({}, cfg.certDesign, {template:'custom', imageData:e.target.result});
    DB.saveConfig(cfg);
    var img=new Image();
    img.onload=function(){
      if(!window._certEditor) window._certEditor={};
      window._certEditor.template='custom';
      window._certEditor.imageData=e.target.result;
      window._certEditor.imageObj=img;
      showSetupFolder('poster');
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
}

function _certSigStartAdd(){
  window._certSigEditing='new';
  window._certSigDraftImage=null;
  showSetupFolder('poster');
}
function _certSigStartEdit(id){
  var cfg=DB.config();
  var s=(cfg.certSignatories||[]).find(function(x){ return x.id===id; });
  window._certSigEditing=id;
  window._certSigDraftImage = s ? (s.sig||null) : null;
  showSetupFolder('poster');
}
function _certSigCancel(){
  window._certSigEditing=null;
  window._certSigDraftImage=null;
  showSetupFolder('poster');
}
function _certSigImageUpload(event){
  var file=event.target.files[0]; if(!file) return;
  var reader=new FileReader();
  reader.onload=function(e){
    window._certSigDraftImage=e.target.result;
    var prev=document.getElementById('certSigImgPreview');
    if(prev){ prev.src=e.target.result; prev.style.display=''; }
  };
  reader.readAsDataURL(file);
}
function _certSigSave(){
  var nameEl=document.getElementById('certSigName'), desigEl=document.getElementById('certSigDesignation');
  var name=nameEl?nameEl.value.trim():'', designation=desigEl?desigEl.value.trim():'';
  if(!name){ toast('Please enter a signatory name','error'); return; }
  var cfg=DB.config();
  var sigs=(cfg.certSignatories||[]).slice();
  if(window._certSigEditing==='new'){
    if(sigs.length>=3){ toast('Maximum of 3 signatories allowed','error'); return; }
    sigs.push({id:'sig_'+Date.now(), name:name, designation:designation, sig:window._certSigDraftImage||null});
  } else {
    var idx=sigs.findIndex(function(s){ return s.id===window._certSigEditing; });
    if(idx>-1){
      delete window._certSigImgCache[sigs[idx].id];
      sigs[idx]=Object.assign({}, sigs[idx], {name:name, designation:designation, sig:window._certSigDraftImage||null});
    }
  }
  cfg.certSignatories=sigs;
  DB.saveConfig(cfg);
  window._certSigEditing=null;
  window._certSigDraftImage=null;
  toast('Signatory saved!');
  showSetupFolder('poster');
}
function _certSigDelete(id){
  var cfg=DB.config();
  var sig=(cfg.certSignatories||[]).find(function(s){ return s.id===id; });
  var name=sig?sig.name:'this signatory';
  _wzConfirm('This will permanently remove <b>'+name+'</b> from the certificate footer.',
    '_certSigDelete_confirmed(\''+id+'\')',
    {title:'Delete Signatory?', confirmLabel:'Delete', dangerConfirm:true});
}
function _certSigDelete_confirmed(id){
  var cfg=DB.config();
  cfg.certSignatories=(cfg.certSignatories||[]).filter(function(s){ return s.id!==id; });
  DB.saveConfig(cfg);
  delete window._certSigImgCache[id];
  showSetupFolder('poster');
}

function _certDesignTabContent(cfg){
  if(!window._certEditor) window._certEditor={};
  var activeTpl = window._certEditor.template || (cfg.certDesign&&cfg.certDesign.template) || 'gold';
  var _certDim=_certDims(cfg,700,495);
  var body='<div style="font-size:.76rem;color:var(--text2);margin-bottom:10px">Design your A4 certificate &mdash; pick a template or upload a custom background, then add up to 3 signatories. Applies to every certificate you generate or export.</div>';
  body+='<div class="form-group"><label class="form-label">Page Orientation</label>'
    +_wzDropdown('certOrientationDD',[{value:'landscape',label:'A4 Landscape'},{value:'portrait',label:'A4 Portrait'}],_certOrientation(cfg),{onSelect:"_certOrientationSet($val)"})
    +'</div>';
  body+='<div style="border-radius:10px;overflow:hidden;border:1px solid var(--border);margin-bottom:12px">'
    +'<canvas id="certPreviewCanvas" width="'+_certDim.w+'" height="'+_certDim.h+'" style="width:100%;display:block;background:#000"></canvas>'
    +'</div>';
  body+='<div style="font-size:.73rem;font-weight:700;color:var(--text2);margin-bottom:8px">Template</div>'
    +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px">';
  _CERT_TEMPLATES.forEach(function(t){
    var active=activeTpl===t.key;
    body+='<button type="button" onclick="_certTemplateSet(\''+t.key+'\')" style="padding:10px 6px;border-radius:8px;border:2px solid '+(active?'var(--accent)':'var(--border)')+';background:linear-gradient(135deg,'+t.color1+','+t.color2+');color:#fff;font-size:.68rem;font-weight:700;cursor:pointer;text-shadow:0 1px 2px rgba(0,0,0,.5)">'+t.name+'</button>';
  });
  body+='</div>';
  body+='<label style="cursor:pointer"><input type="file" accept="image/*" style="display:none" onchange="_certImageUpload(event)">'
    +'<div class="btn btn-secondary btn-sm" style="display:inline-flex;gap:6px;align-items:center;margin-bottom:16px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></svg> '+(activeTpl==='custom'?'Change Custom Background':'Upload Custom Background')+'</div></label>';

  // ---- Dark Overlay / Text Size / Text Color (mirrors the Poster Design controls) ----
  var cd=cfg.certDesign||{};
  var _certOverlayVal = cd.overlay!=null ? cd.overlay : (activeTpl==='custom'?35:0);
  body+='<div class="form-group"><label class="form-label">Dark Overlay Opacity</label><input type="range" min="0" max="80" value="'+_certOverlayVal+'" oninput="_certOverlaySet(this.value)" style="width:100%"></div>';
  body+='<div class="form-row"><div class="form-group"><label class="form-label">Text Size</label><input type="range" min="70" max="150" value="'+Math.round((cd.textScale||1)*100)+'" oninput="_certTextScaleSet(this.value/100)" style="width:100%"></div>'
    +'<div class="form-group"><label class="form-label">Text Color</label><input type="color" value="'+(cd.textColor||'#ffffff')+'" oninput="_certTextColorSet(this.value)" style="width:100%;height:38px;border-radius:8px;border:1px solid var(--border);background:none;cursor:pointer"></div></div>';
  if(cd.textColor) body+='<button type="button" class="btn btn-secondary btn-sm" style="width:100%;margin-bottom:6px" onclick="_certTextColorReset()">Reset Text Color to Template Default</button>';

  // ---- Certificate Content visibility (same 4 toggles as Poster Content) ----
  var certViz=Object.assign({festName:true,logo:true,date:true,venue:true,tagline:true}, cfg.certViz||{});
  var certVizCell=function(key,label){
    return '<label style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border:1px solid var(--border);border-radius:8px;cursor:pointer">'
      +'<span style="font-size:.8rem;font-weight:600">'+label+'</span>'
      +'<span class="toggle-switch"><input type="checkbox" '+(certViz[key]!==false?'checked':'')+' onchange="_certVizToggle(\''+key+'\',this.checked)"><span class="toggle-slider"></span></span>'
      +'</label>';
  };
  var certVizCellMulti=function(keys,label){
    var allOn=keys.every(function(k){return certViz[k]!==false;});
    var onChange=keys.map(function(k){return '_certVizToggle(\''+k+'\',this.checked)';}).join(';');
    return '<label style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 10px;border:1px solid var(--border);border-radius:8px;cursor:pointer">'
      +'<span style="font-size:.8rem;font-weight:600">'+label+'</span>'
      +'<span class="toggle-switch"><input type="checkbox" '+(allOn?'checked':'')+' onchange="'+onChange+'"><span class="toggle-slider"></span></span>'
      +'</label>';
  };
  body+='<div style="font-size:.78rem;font-weight:800;color:var(--text2);margin:16px 0 8px;padding-top:12px;border-top:1px solid var(--border)">Certificate Content</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'
    +certVizCell('festName','Fest Name')+certVizCell('logo','Logo')+certVizCellMulti(['date','venue'],'Date & Venue')+certVizCell('tagline','Tagline')
    +'</div>';

  body+='<div style="font-size:.78rem;font-weight:800;color:var(--text2);margin:4px 0 8px;padding-top:12px;border-top:1px solid var(--border)">Signatories <span style="font-weight:400;color:var(--text3)">(up to 3, evenly aligned in the footer)</span></div>';
  var sigs=cfg.certSignatories||[];
  if(sigs.length===0){
    body+='<div style="font-size:.72rem;color:var(--text3);margin-bottom:10px">No signatories added yet.</div>';
  } else {
    sigs.forEach(function(s){
      body+='<div style="display:flex;align-items:center;gap:10px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:8px 10px;margin-bottom:6px">'
        +(s.sig?'<img src="'+s.sig+'" style="width:36px;height:36px;object-fit:contain;flex-shrink:0">':'<div style="width:36px;height:36px;flex-shrink:0;border-radius:6px;background:var(--bg2);display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:.6rem">No sig</div>')
        +'<div style="flex:1;min-width:0"><div style="font-size:.78rem;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+s.name+'</div><div style="font-size:.68rem;color:var(--text3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(s.designation||'')+'</div></div>'
        +'<button type="button" class="btn btn-secondary btn-xs" onclick="_certSigStartEdit(\''+s.id+'\')">Edit</button>'
        +'<button type="button" class="btn btn-danger btn-xs" onclick="_certSigDelete(\''+s.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>'
        +'</div>';
    });
  }
  if(sigs.length<3 && window._certSigEditing!=='new'){
    body+='<button type="button" class="btn btn-secondary btn-sm" style="width:100%;margin-bottom:10px" onclick="_certSigStartAdd()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg> Add Signatory</button>';
  }
  if(window._certSigEditing){
    var isNew=window._certSigEditing==='new';
    var draft = isNew ? {name:'',designation:'',sig:null} : (sigs.find(function(s){ return s.id===window._certSigEditing; })||{});
    body+='<div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:12px">'
      +'<div class="form-group"><label class="form-label">Name</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="certSigName" value="'+(draft.name||'').replace(/"/g,'&quot;')+'" placeholder="e.g. Dr. A B Convener"></div>'
      +'<div class="form-group"><label class="form-label">Designation</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="certSigDesignation" value="'+(draft.designation||'').replace(/"/g,'&quot;')+'" placeholder="e.g. Convener"></div>'
      +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">'
      +'<img id="certSigImgPreview" src="'+(draft.sig||'')+'" style="width:48px;height:48px;object-fit:contain;background:var(--bg2);border-radius:6px;border:1px dashed var(--border);'+(draft.sig?'':'display:none')+'">'
      +'<label style="cursor:pointer"><input type="file" accept="image/png" style="display:none" onchange="_certSigImageUpload(event)"><div class="btn btn-secondary btn-sm">Upload Transparent PNG Signature</div></label>'
      +'</div>'
      +'<div style="display:flex;gap:8px"><button type="button" class="btn btn-primary btn-sm" style="flex:1" onclick="_certSigSave()">Save Signatory</button><button type="button" class="btn btn-secondary btn-sm" onclick="_certSigCancel()">Cancel</button></div>'
      +'</div>';
  }

  // ---- Save/load full certificate designs to 10 slots (same idea as Poster presets) ----
  body+='<div style="font-size:.73rem;font-weight:700;color:var(--text2);margin:14px 0 8px;padding-top:12px;border-top:1px solid var(--border)">Save current design to a slot</div>'
    +'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-bottom:16px">';
  for(var ci=0;ci<10;ci++){
    body+='<button type="button" onclick="_certSaveToSlot('+ci+')" style="padding:10px 4px;border-radius:8px;border:1px dashed var(--border);background:var(--bg3);color:var(--text2);font-size:.75rem;font-weight:700;cursor:pointer">'+(ci+1)+'</button>';
  }
  body+='</div>';
  var certSlots=cfg.certPresets||[];
  body+='<div style="font-size:.73rem;font-weight:700;color:var(--text2);margin-bottom:8px">Your Saved Designs</div>'
    +'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:6px">';
  for(var cj=0;cj<10;cj++){
    var cp=certSlots[cj];
    if(!cp){ body+='<div style="aspect-ratio:1;border-radius:8px;border:1px dashed var(--border);display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:.7rem">'+(cj+1)+'</div>'; continue; }
    body+='<div onclick="_certLoadSlot('+cj+')" style="position:relative;aspect-ratio:1;border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid var(--border);background-image:url(\''+cp.bg+'\');background-size:cover;background-position:center">'
      +'<button type="button" onclick="_certDeleteSlot('+cj+',event)" style="position:absolute;top:2px;right:2px;width:18px;height:18px;border-radius:50%;background:rgba(0,0,0,.6);color:#fff;border:none;font-size:.7rem;cursor:pointer;line-height:1">&times;</button>'
      +'</div>';
  }
  body+='</div>'
    +'<div style="font-size:.68rem;color:var(--text3);margin-bottom:6px">Tap a saved design to load it as the current certificate design. You\u2019ll also get a chance to pick one right before printing/exporting.</div>';
  return body;
}

// ---- LOGO CROP SYSTEM ----
var _cropImg=null, _cropOffX=0, _cropOffY=0, _cropScale=1,
    _cropDrag=false, _cropLx=0, _cropLy=0,
    _cropViewSize=0, _cropPinchDist=0;

function openLogoCropper(event){
  var file=event.target.files[0]; if(!file) return;
  window._setupLogoDirty=true;
  var reader=new FileReader();
  reader.onload=function(e){
    _cropImg=new Image();
    _cropImg.onload=function(){
      var DISP=Math.min(window.innerWidth-48,340);
      _cropViewSize=DISP;
      var iw=_cropImg.naturalWidth, ih=_cropImg.naturalHeight;
      // Initial scale: shorter side fills the circle
      _cropScale=DISP/Math.min(iw,ih);
      // Center
      _cropOffX=(DISP-iw*_cropScale)/2;
      _cropOffY=(DISP-ih*_cropScale)/2;
      showModal(_buildCropModal());
      setTimeout(_initCropCanvas,30);
    };
    _cropImg.src=e.target.result;
  };
  reader.readAsDataURL(file);
}

function _buildCropModal(){
  return '<div>'
    +'<div class="modal-handle"></div>'
    +'<div style="font-size:1rem;font-weight:800;margin-bottom:2px">Set Logo</div>'
    +'<div style="font-size:.75rem;color:var(--text3);margin-bottom:10px">Drag to move &middot; Pinch or scroll to zoom</div>'
    +'<canvas id="cropCanvas" style="display:block;border-radius:50%;border:2.5px solid rgba(240,165,0,0.7);touch-action:none;user-select:none;cursor:grab;box-shadow:0 0 0 6px rgba(240,165,0,0.08)"></canvas>'
    +'<div style="display:flex;align-items:center;gap:8px;margin-top:14px">'
    +'<button class="btn btn-secondary" onclick="_cropZoomStep(-0.15)" style="font-size:1.1rem;padding:6px 14px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg></button>'
    +'<div style="flex:1;height:4px;background:var(--border);border-radius:2px;position:relative;cursor:pointer" id="cropZoomBar" onclick="_cropZoomBarClick(event)">'
    +'<div id="cropZoomThumb" style="position:absolute;top:-4px;width:12px;height:12px;background:var(--gold,#f0a500);border-radius:50%;transform:translateX(-50%)"></div>'
    +'</div>'
    +'<button class="btn btn-secondary" onclick="_cropZoomStep(0.15)" style="font-size:1.1rem;padding:6px 14px">+</button>'
    +'</div>'
    +'<div style="display:flex;gap:8px;margin-top:10px">'
    +'<button class="btn btn-primary" style="flex:1" onclick="_applyCrop()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Done</button>'
    +'<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>'
    +'</div></div>';
}

function _cropUpdateZoomBar(){
  var thumb=document.getElementById('cropZoomThumb');
  var bar=document.getElementById('cropZoomBar');
  if(!thumb||!bar||!_cropImg) return;
  var minS=_cropViewSize/Math.min(_cropImg.naturalWidth,_cropImg.naturalHeight);
  var maxS=minS*4;
  var pct=(_cropScale-minS)/(maxS-minS);
  pct=Math.max(0,Math.min(1,pct));
  thumb.style.left=(pct*100)+'%';
}

function _cropZoomStep(delta){
  if(!_cropImg) return;
  var iw=_cropImg.naturalWidth, ih=_cropImg.naturalHeight;
  var minS=_cropViewSize/Math.min(iw,ih), maxS=minS*4;
  var cx=_cropViewSize/2, cy=_cropViewSize/2;
  // Zoom toward center
  var prevS=_cropScale;
  _cropScale=Math.max(minS,Math.min(maxS,_cropScale+delta*prevS));
  _cropOffX=cx-(_cropScale/prevS)*(cx-_cropOffX);
  _cropOffY=cy-(_cropScale/prevS)*(cy-_cropOffY);
  _cropClampOffset(); _cropDraw(); _cropUpdateZoomBar();
}

function _cropZoomBarClick(e){
  var bar=document.getElementById('cropZoomBar'); if(!bar||!_cropImg) return;
  var r=bar.getBoundingClientRect();
  var pct=(e.clientX-r.left)/r.width;
  var iw=_cropImg.naturalWidth, ih=_cropImg.naturalHeight;
  var minS=_cropViewSize/Math.min(iw,ih), maxS=minS*4;
  var prevS=_cropScale;
  _cropScale=minS+pct*(maxS-minS);
  var cx=_cropViewSize/2, cy=_cropViewSize/2;
  _cropOffX=cx-(_cropScale/prevS)*(cx-_cropOffX);
  _cropOffY=cy-(_cropScale/prevS)*(cy-_cropOffY);
  _cropClampOffset(); _cropDraw(); _cropUpdateZoomBar();
}

function _cropClampOffset(){
  if(!_cropImg) return;
  var iw=_cropImg.naturalWidth*_cropScale, ih=_cropImg.naturalHeight*_cropScale;
  var D=_cropViewSize;
  // Keep image covering the circle (don't let circle poke outside image)
  _cropOffX=Math.min(0,Math.max(D-iw,_cropOffX));
  _cropOffY=Math.min(0,Math.max(D-ih,_cropOffY));
}

function _initCropCanvas(){
  var canvas=document.getElementById('cropCanvas'); if(!canvas||!_cropImg) return;
  var D=_cropViewSize;
  canvas.width=D; canvas.height=D;
  canvas.style.width=D+'px'; canvas.style.height=D+'px';
  _cropDraw(); _cropUpdateZoomBar();

  // Mouse drag
  canvas.onmousedown=function(e){_cropDrag=true;_cropLx=e.clientX;_cropLy=e.clientY;canvas.style.cursor='grabbing';e.preventDefault();};
  document.onmousemove=function(e){
    if(!_cropDrag)return;
    _cropOffX+=(e.clientX-_cropLx);_cropOffY+=(e.clientY-_cropLy);
    _cropLx=e.clientX;_cropLy=e.clientY;
    _cropClampOffset();_cropDraw();
  };
  document.onmouseup=function(){_cropDrag=false;if(canvas)canvas.style.cursor='grab';};
  // Mouse wheel zoom
  canvas.onwheel=function(e){e.preventDefault();_cropZoomStep(e.deltaY<0?0.08:-0.08);};

  // Touch drag + pinch zoom
  canvas.ontouchstart=function(e){
    e.preventDefault();
    if(e.touches.length===1){
      _cropDrag=true;_cropLx=e.touches[0].clientX;_cropLy=e.touches[0].clientY;
    } else if(e.touches.length===2){
      _cropDrag=false;
      _cropPinchDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
    }
  };
  canvas.ontouchmove=function(e){
    e.preventDefault();
    if(e.touches.length===1&&_cropDrag){
      _cropOffX+=(e.touches[0].clientX-_cropLx);_cropOffY+=(e.touches[0].clientY-_cropLy);
      _cropLx=e.touches[0].clientX;_cropLy=e.touches[0].clientY;
      _cropClampOffset();_cropDraw();
    } else if(e.touches.length===2){
      var d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
      if(_cropPinchDist){_cropZoomStep((d-_cropPinchDist)/200);}
      _cropPinchDist=d;
    }
  };
  canvas.ontouchend=function(e){if(e.touches.length===0){_cropDrag=false;_cropPinchDist=0;}};
}

function _cropDraw(){
  var canvas=document.getElementById('cropCanvas'); if(!canvas||!_cropImg) return;
  var ctx=canvas.getContext('2d');
  var D=_cropViewSize;
  ctx.clearRect(0,0,D,D);
  ctx.drawImage(_cropImg,_cropOffX,_cropOffY,_cropImg.naturalWidth*_cropScale,_cropImg.naturalHeight*_cropScale);
}

function _applyCrop(){
  if(!_cropImg) return;
  var D=_cropViewSize, OUT=256;
  var offscreen=document.createElement('canvas'); offscreen.width=OUT; offscreen.height=OUT;
  var ctx=offscreen.getContext('2d');
  ctx.beginPath(); ctx.arc(OUT/2,OUT/2,OUT/2,0,Math.PI*2); ctx.clip();
  var sc=OUT/D;
  ctx.drawImage(_cropImg,_cropOffX*sc,_cropOffY*sc,_cropImg.naturalWidth*_cropScale*sc,_cropImg.naturalHeight*_cropScale*sc);
  var logo=offscreen.toDataURL('image/png');
  var cfg=DB.config(); cfg.logo=logo; DB.saveConfig(cfg);
  window._setupLogoDirty=false;
  _closeModalClean(); toast('Logo saved!'); render('setup');
}

function removeLogo(){
  var cfg=DB.config(); cfg.logo=null; DB.saveConfig(cfg);
  window._setupLogoDirty=false;
  toast('Logo removed'); render('setup');
}
// ---- END LOGO CROP SYSTEM ----

// =============================================
// PARTICIPANT PHOTO SYSTEM
// =============================================
var _AVATAR_COLORS=['#7c4dff','#e91e63','#00897b','#f4511e','#1e88e5','#6d4c41','#039be5','#43a047','#8e24aa','#c0ca33','#00acc1','#fb8c00'];
var _partPhotoData=null; // temp store during add/edit
var _participantPhotoChanged = false;   // <-- ADD THIS LINE
var _savedParticipantFormData = null;   // <-- ADD THIS LINE

function _getAvatarColor(chestNo){
  return _AVATAR_COLORS[(parseInt(chestNo)||0) % _AVATAR_COLORS.length];
}
function _getInitials(name){
  if(!name) return '?';
  var parts=(name||'').trim().split(/\s+/);
  if(parts.length===1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0)+parts[parts.length-1].charAt(0)).toUpperCase();
}

// Returns HTML for participant avatar (img or initials circle)
function participantAvatarHTML(p, size){
  size=size||40;
  if(p&&p.photo){
    return '<img src="'+p.photo+'" style="width:'+size+'px;height:'+size+'px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid var(--border)">';
  }
  var col=_getAvatarColor(p&&p.chestNo||0);
  var initials=_getInitials(p&&p.name||'');
  var fs=size<=40?'.75rem':size<=64?'1rem':'1.3rem';
  return '<div style="width:'+size+'px;height:'+size+'px;border-radius:50%;background:'+col+';display:flex;align-items:center;justify-content:center;font-size:'+fs+';font-weight:800;flex-shrink:0;color:#fff;letter-spacing:.5px">'+initials+'</div>';
}

// Group avatar HTML — fixed icon, no photo
function groupAvatarHTML(size){
  size=size||40;
  return '<div class="group-avatar" style="width:'+size+'px;height:'+size+'px;font-size:'+(size*0.4)+'px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>';
}

// Photo UI inside the participant form
function participantPhotoFormHTML(existingPhoto){
  var previewHtml=existingPhoto
    ?'<img id="pp-preview" src="'+existingPhoto+'" class="part-photo-circle">'
    :'<div id="pp-preview-placeholder" class="part-photo-placeholder"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>';
  return '<div class="part-photo-wrap">'
    +previewHtml
    +'<div style="flex:1;min-width:0">'
    +'<div style="font-size:.78rem;font-weight:700;color:var(--text2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px">Participant Photo</div>'
    +'<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px">'
    +'<button class="btn btn-secondary btn-xs" onclick="openCamera()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></svg> Camera</button>'
    +'<label style="cursor:pointer"><input type="file" accept="image/*" style="display:none" onchange="openPartPhotoCropper(event)"><div class="btn btn-secondary btn-xs"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5-11 11"/></svg> Gallery</div></label>'
    +(existingPhoto?'<button class="btn btn-danger btn-xs" onclick="removePartPhoto()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>️</button>':'')
    +'</div>'
    +'<div style="font-size:.65rem;color:var(--text3)">'+(existingPhoto?'Photo saved · tap to change':'Optional · shows on list &amp; posters')+'</div>'
    +'</div></div>';
}
// Camera stream and state
var _camStream = null;
var _camFacingMode = 'user'; // 'user' = front, 'environment' = back

// Open camera modal with live preview and switch button
function openCamera() {
_saveParticipantFormData();   // <-- ADD THIS LINE
  // No preemptive HTTPS check – let the browser decide
  var html = '<div class="modal-handle"></div>'
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">'
    +'<div style="font-size:1rem;font-weight:800"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></svg> Take Photo</div>'
    +'<button class="btn btn-secondary btn-xs" onclick="_switchCamera()" style="width:auto;padding:4px 12px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Switch</button>'
    +'</div>'
    +'<div style="position:relative;width:100%;background:#000;border-radius:12px;overflow:hidden">'
    +'<video id="_cam-video" autoplay playsinline muted style="width:100%;display:block;border-radius:12px"></video>'
    +'<canvas id="_cam-canvas" style="display:none"></canvas>'
    +'</div>'
    +'<div style="display:flex;gap:8px;margin-top:14px">'
    +'<button class="btn btn-primary" style="flex:1;font-size:1.1rem" onclick="_capturePhoto()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></svg> Capture</button>'
    +'<button class="btn btn-secondary" style="flex:1" onclick="_stopCamera();closeModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Cancel</button>'
    +'</div>';
  showModal(html);
  _startCamera(_camFacingMode);
}

function _startCamera(facingMode) {
  _stopCamera();

  // Check if mediaDevices API exists
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    toast('Camera API not supported. Use Gallery instead.', 'error');
    closeModal();
    setTimeout(() => document.querySelector('input[type="file"][accept*="image"]')?.click(), 500);
    return;
  }

  var constraints = {
    video: {
      facingMode: facingMode,
      width: { ideal: 640 },
      height: { ideal: 640 }
    }
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      _camStream = stream;
      var video = document.getElementById('_cam-video');
      if (video) {
        video.srcObject = stream;
        video.play().catch(e => console.warn('Autoplay prevented', e));
      }
    })
    .catch(function(err) {
      console.warn('Camera error:', err.name, err.message);
      var msg = 'Camera not available';
      if (err.name === 'NotAllowedError') msg = 'Camera permission denied';
      else if (err.name === 'NotFoundError') msg = 'No camera found';
      else if (err.name === 'NotReadableError') msg = 'Camera in use';
      else if (err.name === 'SecurityError') msg = 'Camera requires HTTPS or localhost';

      toast(msg, 'error');
      closeModal();

      // Fallback: open gallery picker
      setTimeout(() => {
        var fileInput = document.querySelector('input[type="file"][accept*="image"]');
        if (fileInput) fileInput.click();
      }, 600);
    });
}

// Stop camera stream
function _stopCamera(){
  if(_camStream){
    _camStream.getTracks().forEach(function(t){ t.stop(); });
    _camStream = null;
  }
}

// Switch between front and back camera
function _switchCamera(){
  _camFacingMode = (_camFacingMode === 'user') ? 'environment' : 'user';
  _startCamera(_camFacingMode);
}

// Capture photo from video stream
function _capturePhoto(){
  var video = document.getElementById('_cam-video');
  var canvas = document.getElementById('_cam-canvas');
  if(!video || !canvas) return;
  var size = Math.min(video.videoWidth, video.videoHeight);
  canvas.width = 240; canvas.height = 240;
  var ctx = canvas.getContext('2d');
  ctx.beginPath(); ctx.arc(120,120,120,0,Math.PI*2); ctx.clip();
  var sx = (video.videoWidth - size) / 2;
  var sy = (video.videoHeight - size) / 2;
  ctx.drawImage(video, sx, sy, size, size, 0, 0, 240, 240);
  var dataUrl = canvas.toDataURL('image/jpeg', 0.82);
  _stopCamera();
  closeModal();
  // Open the cropper with the captured image
  setTimeout(function(){ _openPhotoCropper(dataUrl); }, 200);
}

// Helper to open cropper with a data URL (reused from gallery pick)
function _openPhotoCropper(srcDataUrl){
  _cropImg = new Image();
  _cropImg.onload = function(){
    var DISP = Math.min(window.innerWidth-48,300);
    _cropViewSize = DISP;
    var iw = _cropImg.naturalWidth, ih = _cropImg.naturalHeight;
    _cropScale = DISP / Math.min(iw, ih);
    _cropOffX = (DISP - iw * _cropScale) / 2;
    _cropOffY = (DISP - ih * _cropScale) / 2;
    _cropMode = 'participant';
    showModal(_buildPartCropModal());
    setTimeout(_initCropCanvas,30);
  };
  _cropImg.src = srcDataUrl;
}

function removePartPhoto(){
  _partPhotoData=null;
  _participantPhotoChanged = true;
  _modalDirty = true;                // <-- NEW: force dirty
  _modalInputChanged();
  // Update the preview
  var prev=document.getElementById('pp-preview');
  if(prev){ prev.outerHTML='<div id="pp-preview-placeholder" class="part-photo-placeholder"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>'; }
}

// Reuse crop system for participant photo — same vars, different callback
function openPartPhotoCropper(event){
 _saveParticipantFormData();   // <-- ADD THIS LINE
  var file=event.target.files&&event.target.files[0]; if(!file) return;
  var reader=new FileReader();
  reader.onload=function(e){
    _cropImg=new Image();
    _cropImg.onload=function(){
      var DISP=Math.min(window.innerWidth-48,300);
      _cropViewSize=DISP;
      var iw=_cropImg.naturalWidth, ih=_cropImg.naturalHeight;
      _cropScale=DISP/Math.min(iw,ih);
      _cropOffX=(DISP-iw*_cropScale)/2;
      _cropOffY=(DISP-ih*_cropScale)/2;
      _cropMode='participant';
      showModal(_buildPartCropModal());
      setTimeout(_initCropCanvas,30);
    };
    _cropImg.src=e.target.result;
  };
  reader.readAsDataURL(file);
}

function _buildPartCropModal(){
  return '<div>'
    +'<div class="modal-handle"></div>'
    +'<div style="font-size:1rem;font-weight:800;margin-bottom:2px">Crop Photo</div>'
    +'<div style="font-size:.75rem;color:var(--text3);margin-bottom:10px">Drag to move &middot; Pinch or scroll to zoom</div>'
    +'<canvas id="cropCanvas" style="display:block;border-radius:50%;border:2.5px solid rgba(240,165,0,0.7);touch-action:none;user-select:none;cursor:grab;box-shadow:0 0 0 6px rgba(240,165,0,0.08)"></canvas>'
    +'<div style="display:flex;align-items:center;gap:8px;margin-top:14px">'
    +'<button class="btn btn-secondary" onclick="_cropZoomStep(-0.15)" style="font-size:1.1rem;padding:6px 14px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg></button>'
    +'<div style="flex:1;height:4px;background:var(--border);border-radius:2px;position:relative;cursor:pointer" id="cropZoomBar" onclick="_cropZoomBarClick(event)">'
    +'<div id="cropZoomThumb" style="position:absolute;top:-4px;width:12px;height:12px;background:var(--gold,#f0a500);border-radius:50%;transform:translateX(-50%)"></div>'
    +'</div>'
    +'<button class="btn btn-secondary" onclick="_cropZoomStep(0.15)" style="font-size:1.1rem;padding:6px 14px">+</button>'
    +'</div>'
    +'<div style="display:flex;gap:8px;margin-top:10px">'
    +'<button class="btn btn-primary" style="flex:1" onclick="_applyPartCrop()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Done</button>'
    +'<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>'
    +'</div></div>';
}

function _applyPartCrop(){
  if(!_cropImg) return;
  var OUT=128;
  var offscreen=document.createElement('canvas'); offscreen.width=OUT; offscreen.height=OUT;
  var ctx=offscreen.getContext('2d');
  ctx.beginPath(); ctx.arc(OUT/2,OUT/2,OUT/2,0,Math.PI*2); ctx.clip();
  var sc=OUT/_cropViewSize;
  ctx.drawImage(_cropImg,_cropOffX*sc,_cropOffY*sc,_cropImg.naturalWidth*_cropScale*sc,_cropImg.naturalHeight*_cropScale*sc);
    _partPhotoData=offscreen.toDataURL('image/jpeg',0.75);
  window._partCropJustDone=true;
  _participantPhotoChanged = true;
  _modalDirty = true;                // <-- NEW: force dirty
  _closeModalClean();
  setTimeout(function(){
    if(window._partAfterCrop){ var cb=window._partAfterCrop; cb(); }
    toast('Photo saved!');
  },80);
}
// Save current participant form values before opening camera/gallery
function _saveParticipantFormData(){
  _savedParticipantFormData = {
    chest: document.getElementById('np-chest') ? document.getElementById('np-chest').value : '',
    name: document.getElementById('np-name') ? document.getElementById('np-name').value : '',
    section: document.getElementById('np-section') ? document.getElementById('np-section').value : '',
    team: document.getElementById('np-team') ? document.getElementById('np-team').value : '',
    items: getCheckedItems()
  };
}

// Restore saved form values after crop modal closes
function _restoreParticipantFormData(){
  if (!_savedParticipantFormData) return;
  var d = _savedParticipantFormData;
  
  var chestEl = document.getElementById('np-chest');
  var nameEl = document.getElementById('np-name');
  var secQ = document.getElementById('np-section-q');
  var secHid = document.getElementById('np-section');
  var teamQ = document.getElementById('np-team-q');
  var teamHid = document.getElementById('np-team');
  
  if (chestEl) chestEl.value = d.chest;
  if (nameEl) nameEl.value = d.name;
  if (secQ) secQ.value = d.section;
  if (secHid) secHid.value = d.section;
  if (teamQ) teamQ.value = d.team;
  if (teamHid) teamHid.value = d.team;
  
  // Rebuild items list and check previously selected items
  pfSectionChange();
  setTimeout(function(){
    var cbs = document.querySelectorAll('#np-items input.item-cb');
    cbs.forEach(function(cb){
      if (d.items.includes(parseInt(cb.value))) cb.checked = true;
    });
  }, 50);
  
  _savedParticipantFormData = null;
}
// crop mode flag (logo vs participant)
var _cropMode='logo';
// ---- END PARTICIPANT PHOTO SYSTEM ----

function renderJudgesRows(){
  var list=window._setupJudges||[];
  if(!list.length) return '<div style="font-size:.72rem;color:var(--text3);padding:6px 0">No judges added yet.</div>';
  return list.map(function(j,idx){
    return '<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">'
      +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input judge-name-input" data-jid="'+j.id+'" placeholder="Judge '+(idx+1)+' name" value="'+(j.name||'').replace(/"/g,'&quot;')+'"'
      +' oninput="updateJudgeName('+j.id+',this.value)" style="flex:1">'
      +'<button type="button" class="btn btn-danger btn-sm" style="flex-shrink:0" onclick="removeJudgeRow('+j.id+')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button>'
      +'</div>';
  }).join('');
}
function updateJudgeName(id,val){
  var j=(window._setupJudges||[]).find(function(x){return x.id===id;});
  if(j) j.name=val;
}
function _reattachDirtyListenersOnly(){
  var mc=document.getElementById('modalContent'); if(!mc) return;
  mc.querySelectorAll('input,textarea,select').forEach(function(el){
    el.removeEventListener('input',_modalInputChanged);
    el.removeEventListener('change',_modalInputChanged);
    el.addEventListener('input',_modalInputChanged);
    el.addEventListener('change',_modalInputChanged);
  });
}
function addJudgeRow(){
  if(!window._setupJudges) window._setupJudges=[];
  window._setupJudges.push({id:_nextUniqueIds(window._setupJudges,1)[0],name:''});
  var wrap=document.getElementById('judgesListWrap');
  if(wrap) wrap.innerHTML=renderJudgesRows();
  _reattachDirtyListenersOnly();
  _modalDirty=true;
}
function removeJudgeRow(id){
  window._setupJudges=(window._setupJudges||[]).filter(function(j){return j.id!==id;});
  var wrap=document.getElementById('judgesListWrap');
  if(wrap) wrap.innerHTML=renderJudgesRows();
  _reattachDirtyListenersOnly();
  _modalDirty=true;
}
function saveConfig(){
  var cfg=DB.config();
  var has=function(id){ return !!document.getElementById(id); };
  var next=Object.assign({}, cfg);
  if(has('cfg-festName')) next.festName=v('cfg-festName')||'Winzera';
  if(has('cfg-tagline')) next.tagline=v('cfg-tagline');
  if(has('cfg-institution')) next.institution=v('cfg-institution')||'Mubjan World';
  if(has('cfg-edition')) next.edition=v('cfg-edition');
  if(has('cfg-venue')) next.venue=v('cfg-venue');
  if(has('cfg-durationMode')) next.durationMode=v('cfg-durationMode')==='multi'?'multi':'single';
  if(has('cfg-date')) next.date=v('cfg-date');
  if(has('cfg-dateStart')) next.dateStart=v('cfg-dateStart');
  if(has('cfg-dateEnd')) next.dateEnd=v('cfg-dateEnd');
  // Year is derived automatically from the festival date(s) — no separate input anymore
  if(has('cfg-durationMode')){
    var _srcDate = next.durationMode==='multi' ? (next.dateStart||next.dateEnd) : next.date;
    if(_srcDate){
      var _yr = new Date(_srcDate+'T00:00:00').getFullYear();
      if(!isNaN(_yr)) next.year=_yr;
    }
  }
  if(has('cfg-maxJudges')) next.maxJudges=parseInt(v('cfg-maxJudges'))||3;
  if(has('cfg-maxMarks')) next.maxMarks=parseInt(v('cfg-maxMarks'))||100;
  if(has('cfg-indvAp')) next.indvAp=parseInt(v('cfg-indvAp'))||10;
  if(has('cfg-indvA'))  next.indvA=parseInt(v('cfg-indvA'))||8;
  if(has('cfg-indvBp')) next.indvBp=parseInt(v('cfg-indvBp'))||6;
  if(has('cfg-indvB'))  next.indvB=parseInt(v('cfg-indvB'))||4;
  if(has('cfg-indvC'))  next.indvC=parseInt(v('cfg-indvC'))||2;
  if(has('cfg-grpAp'))  next.grpAp=parseInt(v('cfg-grpAp'))||15;
  if(has('cfg-grpA'))   next.grpA=parseInt(v('cfg-grpA'))||12;
  if(has('cfg-grpBp'))  next.grpBp=parseInt(v('cfg-grpBp'))||9;
  if(has('cfg-grpB'))   next.grpB=parseInt(v('cfg-grpB'))||6;
  if(has('cfg-grpC'))   next.grpC=parseInt(v('cfg-grpC'))||3;
  if(has('cfg-indvRank1')) next.indvRank1=parseInt(v('cfg-indvRank1'))||0;
  if(has('cfg-indvRank2')) next.indvRank2=parseInt(v('cfg-indvRank2'))||0;
  if(has('cfg-indvRank3')) next.indvRank3=parseInt(v('cfg-indvRank3'))||0;
  if(has('cfg-grpRank1'))  next.grpRank1=parseInt(v('cfg-grpRank1'))||0;
  if(has('cfg-grpRank2'))  next.grpRank2=parseInt(v('cfg-grpRank2'))||0;
  if(has('cfg-grpRank3'))  next.grpRank3=parseInt(v('cfg-grpRank3'))||0;
  var _prevGradeEnabled=cfg.gradePointsEnabled!==false, _prevRankEnabled=cfg.rankPointsEnabled!==false;
  if(has('cfg-gradePointsEnabled')) next.gradePointsEnabled=document.getElementById('cfg-gradePointsEnabled').checked;
  if(has('cfg-rankPointsEnabled'))  next.rankPointsEnabled=document.getElementById('cfg-rankPointsEnabled').checked;
  if(has('cfg-scheduleEnabled')) next.scheduleEnabled=document.getElementById('cfg-scheduleEnabled').checked;
  if(has('cfg-maxStage'))  next.maxStageEvents=parseInt(v('cfg-maxStage'))||3;
  if(has('cfg-maxOffStage')) next.maxOffStageEvents=parseInt(v('cfg-maxOffStage'))||5;
  if(has('cfg-maxOpenSection')) next.maxOpenSection=parseInt(v('cfg-maxOpenSection'))||0;
  var tc=document.querySelector('input[name="cfg-textCase"]:checked');
  if(tc) next.textCase=tc.value;
  next.logo=cfg.logo||null;
  if(window._setupJudges) next.judges=(window._setupJudges||[]).filter(function(j){return (j.name||'').trim();});
  DB.saveConfig(next);
  window._setupLogoDirty=false;
  var _newGradeEnabled=next.gradePointsEnabled!==false, _newRankEnabled=next.rankPointsEnabled!==false;
  // Always re-run the reformat pass on every save (not just when the radio value
  // itself changes) — it's cheap and self-checks per-record before writing anything,
  // so it's a safe no-op if names already match. This also guarantees existing data
  // gets reformatted the first time a case is explicitly chosen, even if that value
  // happens to match the assumed default (e.g. picking "Uppercase" when textCase was
  // never actually set before, so old data was never actually uppercased yet).
  var _namesReformatted=reapplyTextCaseToAllNames();
  if(_newGradeEnabled!==_prevGradeEnabled || _newRankEnabled!==_prevRankEnabled){
    recomputeAllDeclaredPoints();
    toast('Settings saved — totals recalculated!');
  } else if(_namesReformatted){
    toast('Settings saved — existing names re-formatted!');
  } else {
    toast('Settings saved!');
  }
  _applyTextCaseCSS();
  var b=document.getElementById('festBadge'); if(b){ b.textContent=next.festName||'Winzera'; b.title=next.tagline||''; }
}
// Re-runs point calculation for every already-declared item — used when the
// Grade Points / Rank Points toggles change, so existing results reflect the
// new setting immediately instead of only affecting future declarations.
function recomputeAllDeclaredPoints(){
  var items=DB.items();
  items.forEach(function(item){ if(item.declared) assignRanks(item.id); });
}

function confirmReset(){
  var s=getSession();
  var isOnlineOrg = !!(window.WinzeraSync && window.WinzeraSync.getOrgId());
  showModal(`<div class="modal-handle"></div><div class="modal-title"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>️ Reset All Data</div>
  <p style="color:var(--text2);margin-bottom:10px;font-size:.9rem">This permanently deletes ALL data`+(isOnlineOrg?' — <b>for your whole organization, on every device</b>, including any Team Manager who is currently signed in':'')+`. Cannot be undone!</p>`
  +(isOnlineOrg?'<label style="display:flex;align-items:center;gap:8px;margin-bottom:16px;cursor:pointer;font-size:.82rem;color:var(--text2)"><input type="checkbox" id="reset-all-confirm-cb" style="width:16px;height:16px;accent-color:var(--red)"> I understand this deletes everything from every device, not just this one</label>':'')
  +`<button class="btn btn-danger" onclick="resetAll()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>️ Yes, Delete Everything</button>
  <button class="btn btn-secondary mt-10" onclick="closeModal()">Cancel</button>`);
}
async function resetAll(){
  var isOnlineOrg = !!(window.WinzeraSync && window.WinzeraSync.getOrgId());
  if(isOnlineOrg){
    var cb=document.getElementById('reset-all-confirm-cb');
    if(cb && !cb.checked){ toast('Please check the confirmation box first','error'); return; }
    try{
      toast('Deleting from Supabase for your whole organization\u2026');
      await window.WinzeraSync.wipeOrgData();
    }catch(e){
      console.error('Winzera org wipe failed:', e);
      toast('Could not delete organization data from the server. Nothing was changed \u2014 check your connection and try again.','error');
      return; // don't clear local data if the remote wipe failed — avoids the
              // exact "looks wiped, comes back" confusion this was meant to fix
    }
  }
  // Clear memory cache
  _mem.config=null; _mem.teams=[]; _mem.sections=[]; _mem.items=[];
  _mem.participants=[]; _mem.marks=[]; _mem.groups=[]; _mem.bonuses=[];
  // Reset cached variables (keep your existing ones)
  window._lastPartSection = undefined;
  window._lastPartTeam = undefined;
  window._lastItemSection = undefined;
  window._lastItemType = 'individual';
  window._lastItemStage = false;
  window._lastGrpSection = undefined;
  window._lastGrpTeam = undefined;
  window._codeSearch = '';
  window._codeFlt = 'all';
  window._markFlt = 'all';
  window._markQ = '';
  window._resultsSection = 'All';
  window._cdFlt = 'all';
  window._msFlt = 'all';
  window._rpSec = 'All';
  window._rpTab = 'list';
  window._setupDirty = false;
  window._setupLogoDirty = false;
  window._grpNameManual = false;
  
  _closeModalClean();
  toast('All data reset!');
  _doNavigate('dashboard', {}, false);
}

// =============================================
// SECTIONS
// =============================================
function isOpenSection(name){ return !!(name && (DB.config().openSections||[]).includes(name)); }
// A group can be registered for several items at once (grp.itemIds), but many
// lookups across the app only ever checked the single legacy "primary" grp.itemId —
// so a group registered for 3 items only ever showed up under the first one,
// everywhere (Codes/Marks/Results/Points/Print). This checks the full itemIds
// array instead. `item` may be passed as either the item object or a bare id.
function _grpHasItem(g, item){
  var itemId = (item && typeof item==='object') ? item.id : item;
  var ids = (g.itemIds && g.itemIds.length) ? g.itemIds : (g.itemId!=null ? [g.itemId] : []);
  return ids.indexOf(itemId)!==-1;
}
// ── Single-source-of-truth item/participant/code-letter helpers ───────────
// These replace several near-identical local reimplementations that used to
// live inside individual render functions (renderCodes, renderMarks,
// filterMarkList, renderMarkEntry, renderCodeDetailed, renderMarkSheetPage,
// printMarkSheet, etc). Keeping this logic in one place is what actually
// prevents "present participant is marked absent (?) but list disagrees on
// whether the item counts as fully coded" style bugs from creeping back in.
function _itemHasParticipants(item, participants, groups){
  return item.type==='group'
    ? groups.some(function(g){ return _grpHasItem(g,item); })
    : participants.some(function(p){ return (p.items||[]).includes(item.id); });
}
function _itemParticipantList(item, participants, groups){
  return item.type==='group'
    ? groups.filter(function(g){ return _grpHasItem(g,item); })
    : participants.filter(function(p){ return (p.items||[]).includes(item.id); });
}
function _entryChestNo(item, entry){
  return item.type==='group' ? entry.groupChestNo : entry.chestNo;
}
function _entryCodeLetter(item, entry, itemMarks){
  var cn=_entryChestNo(item, entry);
  var m=itemMarks.find(function(mk){ return mk.chestNo===cn; });
  return m ? m.codeLetter : '';
}
function _isAbsentCode(code){ return code==='?'; }
// Present = registered for the item AND not marked absent ('?'). Absent
// participants are considered "handled" and are excluded from mark entry.
function _itemPresentEntries(item, participants, groups, marks){
  var itemP=_itemParticipantList(item, participants, groups);
  var itemMarks=marks.filter(function(m){ return m.itemId===item.id; });
  return itemP.filter(function(entry){ return !_isAbsentCode(_entryCodeLetter(item, entry, itemMarks)); });
}
// True only when the item has at least one present participant and every
// present participant has been assigned a real (non-absent) code letter.
function _itemAllCodesAssigned(item, participants, groups, marks){
  var presentP=_itemPresentEntries(item, participants, groups, marks);
  if(!presentP.length) return false;
  var itemMarks=marks.filter(function(m){ return m.itemId===item.id; });
  return presentP.every(function(entry){
    var code=_entryCodeLetter(item, entry, itemMarks);
    return !!code && !_isAbsentCode(code);
  });
}
function _itemCountsIndiv(item){ return !(item && isOpenSection(item.section) && item.inclIndiv===false); }
function _itemCountsLimit(item){ return !(item && isOpenSection(item.section) && item.countsToLimit===false); }
function _openSecSuffix(item, personSection){
  return (item && isOpenSection(item.section) && personSection) ? ' ('+getSectionShortName(personSection)+')' : '';
}
// =============================================
// SECTION SHORT NAMES (auto-generated, manually overridable)
// =============================================
function _autoSectionShortName(name){
  if(!name) return '';
  var words=name.trim().split(/\s+/).filter(Boolean);
  if(words.length>1){
    return words.map(function(w){return w.charAt(0).toUpperCase();}).join('').slice(0,4);
  }
  return (words[0]||'').replace(/[^A-Za-z0-9]/g,'').slice(0,3).toUpperCase();
}
function getSectionShortName(name){
  var cfg=DB.config();
  var map=cfg.sectionShortNames||{};
  if(map[name]) return map[name];
  return _autoSectionShortName(name);
}
function setSectionShortName(name, short){
  var cfg=DB.config();
  cfg.sectionShortNames=cfg.sectionShortNames||{};
  short=(short||'').trim().toUpperCase().slice(0,6);
  if(short && short!==_autoSectionShortName(name)){ cfg.sectionShortNames[name]=short; }
  else { delete cfg.sectionShortNames[name]; }
  DB.saveConfig(cfg);
}
function _renameSectionShortName(oldName, newName){
  if(oldName===newName) return;
  var cfg=DB.config();
  var map=cfg.sectionShortNames||{};
  if(map[oldName]!==undefined){ map[newName]=map[oldName]; delete map[oldName]; cfg.sectionShortNames=map; DB.saveConfig(cfg); }
}
function _deleteSectionShortName(name){
  var cfg=DB.config();
  var map=cfg.sectionShortNames||{};
  if(map[name]!==undefined){ delete map[name]; cfg.sectionShortNames=map; DB.saveConfig(cfg); }
}
function renderSections(){
  const sections=DB.sections();
  const defaults=['Sub Junior','Junior','Senior','General','Campus','High School','Higher Secondary'];
  return `
  <div class="card">
    <div class="card-header"><div class="card-title"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h6l2 3h8a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/></svg> Sections (${sections.length})</div></div>
    ${sections.length===0?'<div style="text-align:center;padding:30px;color:var(--text3)">No sections yet</div>':
      sections.map((s,i)=>`
      <div class="list-item">
        <div class="list-avatar" style="background:var(--bg3);font-size:.8rem;color:var(--text2)">${i+1}</div>
        <div class="list-info"><div class="list-title">${s}</div>
        <div class="list-sub">Short: <span style="font-weight:800;color:var(--accent);letter-spacing:.5px">${getSectionShortName(s)}</span></div>
        ${isOpenSection(s)?'<div style="margin-top:4px"><span style="font-size:.62rem;font-weight:800;padding:2px 7px;border-radius:8px;background:rgba(74,158,255,.18);color:var(--blue);white-space:nowrap">OPEN &mdash; Cross-Section</span></div>':''}</div>
        <div class="list-actions">
          <button class="btn btn-secondary btn-sm btn-icon" aria-label="Edit section" onclick="showEditSection(${i})"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>️</button>
          <button class="btn btn-danger btn-sm btn-icon" aria-label="Delete section" onclick="deleteSection(${i})"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button>
        </div>
      </div>`).join('')}
  </div>
  <div class="card" style="background:rgba(74,158,255,.05);border-color:rgba(74,158,255,.2)">
    <div class="card-title mb-10"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4.8a2 2 0 0 0 .6 1.4l1 1A2 2 0 0 1 17 15H7a2 2 0 0 1-.6-2.8l1-1a2 2 0 0 0 .6-1.4Z"/></svg> Quick Add</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      ${defaults.map(s=>`<button class="btn btn-secondary btn-sm" onclick="quickAddSection('${s}')" style="width:auto">${s}</button>`).join('')}
    </div>
  </div>`;
}
function _nsNameInput(name){
  if(window._nsShortManual) return;
  var el=document.getElementById('new-section-short');
  if(el) el.value=_autoSectionShortName(name);
}
function showAddSection(){
  window._nsShortManual=false;
  showModal(`<div class="modal-handle"></div><div class="modal-title">Add Section</div>
  <div class="form-group"><label class="form-label">Section Name</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="new-section" placeholder="e.g. Junior Boys" oninput="_nsNameInput(this.value)"></div>
  <div class="form-group"><label class="form-label">Short Name</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" style="text-transform:uppercase" id="new-section-short" maxlength="6" placeholder="e.g. JB" oninput="window._nsShortManual=true"></div>
  <label style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 14px;cursor:pointer;margin-bottom:14px">
  <div><div style="font-size:.88rem;font-weight:700">Open / Cross-Section</div>
  <div style="font-size:.72rem;color:var(--text3)">Items here accept participants from every other section (e.g. "General", "Open")</div></div>
  <span class="toggle-switch"><input type="checkbox" id="new-section-open"><span class="toggle-slider"></span></span></label>
  <button class="btn btn-primary" onclick="addSection()">Add Section</button>`,
  { saveCallback: addSection }
);
}
function showEditSection(i){
  const s=DB.sections()[i];
  showModal(`<div class="modal-handle"></div><div class="modal-title">Edit Section</div>
  <div class="form-group"><label class="form-label">Section Name</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="edit-section" value="${s}"></div>
  <div class="form-group"><label class="form-label">Short Name</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" style="text-transform:uppercase" id="edit-section-short" maxlength="6" value="${getSectionShortName(s)}" placeholder="${_autoSectionShortName(s)}"></div>
  <label style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 14px;cursor:pointer;margin-bottom:14px">
  <div><div style="font-size:.88rem;font-weight:700">Open / Cross-Section</div>
  <div style="font-size:.72rem;color:var(--text3)">Items here accept participants from every other section (e.g. "General", "Open")</div></div>
  <span class="toggle-switch"><input type="checkbox" id="edit-section-open"${isOpenSection(s)?' checked':''}><span class="toggle-slider"></span></span></label>
  <button class="btn btn-primary" onclick="updateSection(${i})">Save Changes</button>
  <button class="btn btn-secondary mt-10" onclick="closeModal()">Cancel</button>`,
  { saveCallback: function(){ updateSection(i); } }
);
}
function updateSection(i){
  const name=applyTextCase(v('edit-section').trim());
  if(!name) return toast('Enter section name','error');
  const sections=DB.sections();
  const oldName=sections[i];
  sections[i]=name;
  DB.saveSections(sections);
  // Cascade rename to items, participants, groups
  if(oldName&&name!==oldName){
    var items=DB.items().map(function(it){return it.section===oldName?Object.assign({},it,{section:name}):it;});
    var participants=DB.participants().map(function(p){return p.section===oldName?Object.assign({},p,{section:name}):p;});
    var groups=DB.groups().map(function(g){return g.section===oldName?Object.assign({},g,{section:name}):g;});
    DB.saveItems(items); DB.saveParticipants(participants); DB.saveGroups(groups);
  }
  // Update Open Section flag (also handles rename)
  var cfg=DB.config();
  var openSections=(cfg.openSections||[]).filter(function(n){return n!==oldName;});
  var isOpen=document.getElementById('edit-section-open').checked;
  if(isOpen) openSections.push(name);
  cfg.openSections=openSections;
  DB.saveConfig(cfg);
  if(oldName&&name!==oldName) _renameSectionShortName(oldName,name);
  var shortEl=document.getElementById('edit-section-short');
  if(shortEl) setSectionShortName(name, shortEl.value);
  _closeModalClean(); toast('Section updated!'); render('sections');
}
function addSection(){
  const name=applyTextCase(v('new-section').trim()); if(!name) return toast('Enter name','error');
  const s=DB.sections(); if(s.includes(name)) return toast('Already exists','error');
  s.push(name); DB.saveSections(s);
  var shortEl=document.getElementById('new-section-short');
  if(shortEl) setSectionShortName(name, shortEl.value||_autoSectionShortName(name));
  if(document.getElementById('new-section-open').checked){
    var cfg=DB.config();
    cfg.openSections=(cfg.openSections||[]).concat([name]);
    DB.saveConfig(cfg);
  }
  _closeModalClean(); toast('Added!'); render('sections');
}
function quickAddSection(name){ name=applyTextCase(name); const s=DB.sections(); if(s.includes(name)) return toast('Already exists','error'); s.push(name); DB.saveSections(s); toast(name+' added!'); render('sections'); }
function deleteSection(i){
  var sections=DB.sections(), sName=sections[i];
  var items=DB.items(), participants=DB.participants(), groups=DB.groups(), marks=DB.marks();
  var affItems=items.filter(function(it){return it.section===sName;});
  var affItemIds=affItems.map(function(it){return it.id;});
  var affParts=participants.filter(function(p){return p.section===sName;});
  var affGroups=groups.filter(function(g){return g.section===sName;});
  var affMarks=marks.filter(function(m){return affItemIds.includes(m.itemId);});
  var details='';
  if(affItems.length) details+='<div style="margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg> <b>'+affItems.length+'</b> item'+(affItems.length>1?'s':'')+(affItems.length<=3?' ('+affItems.map(function(it){return it.name;}).join(', ')+')':'')+'</div>';
  if(affParts.length) details+='<div style="margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> <b>'+affParts.length+'</b> participant'+(affParts.length>1?'s':'')+'</div>';
  if(affGroups.length) details+='<div style="margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> <b>'+affGroups.length+'</b> group'+(affGroups.length>1?'s':'')+'</div>';
  if(affMarks.length) details+='<div style="margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="M5 7 2 14a3 3 0 0 0 6 0Z"/><path d="M19 7l-3 7a3 3 0 0 0 6 0Z"/></svg> <b>'+affMarks.length+'</b> mark record'+(affMarks.length>1?'s':'')+'</div>';
  showModal('<div style="text-align:center;padding:8px">'
    +'<div style="font-size:2.5rem;margin-bottom:10px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></div>'
    +'<div style="font-size:1rem;font-weight:800;margin-bottom:4px">Delete Section?</div>'
    +'<div style="font-size:.88rem;color:var(--accent);font-weight:700;margin-bottom:12px">"'+sName+'"</div>'
    +(details?'<div style="background:rgba(255,71,87,.08);border:1px solid rgba(255,71,87,.3);border-radius:10px;padding:12px;text-align:left;font-size:.8rem;color:var(--text2);margin-bottom:14px">'
      +'<div style="font-weight:700;color:var(--red);margin-bottom:8px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg> The following will also be deleted:</div>'
      +details+'</div>':
      '<div style="font-size:.82rem;color:var(--text3);margin-bottom:14px">No linked data found.</div>')
    +'<div style="display:flex;gap:8px">'
    +'<button class="btn btn-danger" style="flex:1" onclick="confirmDeleteSection('+i+')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg> Delete All</button>'
    +'<button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>'
    +'</div></div>');
}
function confirmDeleteSection(i){
  var sections=DB.sections(), sName=sections[i];
  var items=DB.items(), participants=DB.participants(), groups=DB.groups(), marks=DB.marks();
  var affItemIds=items.filter(function(it){return it.section===sName;}).map(function(it){return it.id;});
  var newItems=items.filter(function(it){return it.section!==sName;});
  var newParts=participants.filter(function(p){return p.section!==sName;});
  var newGroups=groups.filter(function(g){return g.section!==sName;});
  var newMarks=marks.filter(function(m){return !affItemIds.includes(m.itemId);});
  sections.splice(i,1);
  DB.saveSections(sections); DB.saveItems(newItems); DB.saveParticipants(newParts);
  DB.saveGroups(newGroups); DB.saveMarks(newMarks);
  var cfgD=DB.config();
  if(cfgD.openSections&&cfgD.openSections.includes(sName)){
    cfgD.openSections=cfgD.openSections.filter(function(n){return n!==sName;});
    DB.saveConfig(cfgD);
  }
  _deleteSectionShortName(sName);
  _closeModalClean(); toast('Section & all linked data deleted'); render('sections');
}

// =============================================
// ITEMS / EVENTS
// =============================================
function filterItemList(q, sec){
  var items=DB.items(), sections=DB.sections();
  q=(q||'').toLowerCase();
  var cb=document.getElementById('i-clear-btn'); if(cb) cb.style.display=q?'':'none';
  var filtered=(sec==='All'?items:items.filter(function(i){return i.section===sec;}))
    .filter(function(i){return !q||i.name.toLowerCase().includes(q)||(i.code||'').toLowerCase().includes(q);});
  var el=document.getElementById('i-list');
  if(!el) return;
  el.innerHTML=!filtered.length
    ?'<div style="text-align:center;padding:30px;color:var(--text3)">No items found</div>'
    :filtered.map(function(item){
      var typeBadge=item.type==='group'
        ?'<span style="font-size:.65rem;padding:2px 7px;border-radius:8px;background:rgba(74,158,255,.15);color:#4a9eff;font-weight:700">Group</span>'
        :'<span style="font-size:.65rem;padding:2px 7px;border-radius:8px;background:rgba(155,89,182,.15);color:#9b59b6;font-weight:700">Individual</span>';
      var stageBadge=item.isStage
        ?'<span style="font-size:.65rem;padding:2px 7px;border-radius:8px;background:rgba(240,165,0,.15);color:var(--accent);font-weight:700">On-Stage</span>'
        :'<span style="font-size:.65rem;padding:2px 7px;border-radius:8px;background:rgba(0,200,150,.15);color:var(--green);font-weight:700">Off-Stage</span>';
      return '<div class="list-item">'
        +'<div class="list-avatar" style="background:var(--purple)22;color:var(--purple);font-size:.75rem;font-weight:800">'+(item.code||'?')+'</div>'
        +'<div class="list-info"><div class="list-title">'+item.name+'</div>'
        +'<div class="list-sub" style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;margin-top:4px">'+item.section+' &nbsp;'+typeBadge+stageBadge+'</div></div>'
        +'<div style="display:flex;gap:6px">'
        +'<button class="btn btn-secondary btn-xs" aria-label="Edit item" onclick="showEditItem(\''+item.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>'
        +'<button class="btn btn-danger btn-xs" aria-label="Delete item" onclick="deleteItem(\''+item.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button></div></div>';
    }).join('');
}


function _findDuplicateItemIds(){
  var items=DB.items();
  var seen={};
  var dups=[];
  items.forEach(function(it){
    if(seen[it.id]) dups.push(it); else seen[it.id]=it;
  });
  return dups;
}
// Repairs items that accidentally share one id (a legacy Bulk Add Items collision —
// see commitBulkItems) WITHOUT deleting anything. Each duplicate keeps every existing
// registration: the earliest item with that id keeps the id unchanged; every later
// duplicate gets a fresh unique id, and any participant/group/mark that actually
// belongs to it (matched by section, since a record's section always matches its
// real item's section) is re-pointed to the new id. Records that don't match by
// section are left untouched, so nothing is guessed at blindly.
function repairDuplicateItemIds(){
  var items=DB.items();
  var seen={};
  // Base new ids on the highest id already in use (not Date.now()) so a
  // reassigned id can never collide with any existing item id, even when many
  // duplicates are fixed in one pass.
  var stamp=items.reduce(function(m,it){ return Math.max(m, Number(it.id)||0); }, 0);
  var fixes=[]; // {oldId, newId, section, name}
  items.forEach(function(it){
    if(seen[it.id]){
      stamp++;
      fixes.push({oldId:it.id, newId:stamp, section:it.section, name:it.name});
      it.id=stamp;
    } else {
      seen[it.id]=true;
    }
  });
  if(!fixes.length) return {fixed:0};
  DB.saveItems(items);

  var participants=DB.participants();
  var groups=DB.groups();
  var marks=DB.marks();
  var pChanged=false, gChanged=false, mChanged=false;

  fixes.forEach(function(fx){
    participants.forEach(function(p){
      if(p.section===fx.section && (p.items||[]).indexOf(fx.oldId)!==-1){
        p.items=p.items.map(function(id){return id===fx.oldId?fx.newId:id;});
        pChanged=true;
      }
    });
    groups.forEach(function(g){
      if(g.section!==fx.section) return;
      var ids=(g.itemIds&&g.itemIds.length)?g.itemIds:(g.itemId!=null?[g.itemId]:[]);
      if(ids.indexOf(fx.oldId)===-1) return;
      g.itemIds=ids.map(function(id){return id===fx.oldId?fx.newId:id;});
      if(g.itemId===fx.oldId) g.itemId=fx.newId;
      gChanged=true;
    });
    marks.forEach(function(m){
      if(m.itemId!==fx.oldId) return;
      var p=participants.find(function(pp){return String(pp.chestNo)===String(m.chestNo);});
      var g=groups.find(function(gg){return String(gg.groupChestNo)===String(m.chestNo);});
      var sec=p?p.section:(g?g.section:null);
      if(sec===fx.section){ m.itemId=fx.newId; mChanged=true; }
    });
  });

  if(pChanged) DB.saveParticipants(participants);
  if(gChanged) DB.saveGroups(groups);
  if(mChanged) DB.saveMarks(marks);
  return {fixed:fixes.length, fixes:fixes};
}
function showRepairDuplicateItemIds(){
  var dups=_findDuplicateItemIds();
  if(!dups.length) return toast('No duplicate item IDs found — nothing to fix!');
  showModal('<div class="modal-handle"></div>'
    +'<div class="modal-title" style="color:var(--red)">Duplicate Item IDs Found</div>'
    +'<div style="font-size:.8rem;color:var(--text2);margin-bottom:14px">'+dups.length+' item'+(dups.length>1?'s are':' is')+' sharing an internal ID with another item (usually from adding same-named items to different sections in one Bulk Add) &mdash; this can misattribute registrations to the wrong section in Codes, Marks, Results &amp; Points.</div>'
    +'<div style="background:var(--bg3);border-radius:10px;padding:10px 12px;margin-bottom:14px;font-size:.78rem;color:var(--text2)">'+dups.map(function(d){return '&bull; '+d.name+' ('+d.section+')';}).join('<br>')+'</div>'
    +'<div style="font-size:.75rem;color:var(--text3);margin-bottom:14px">This gives each a unique ID and re-links any participants, groups &amp; marks that belong to it by section &mdash; nothing is deleted.</div>'
    +'<button class="btn btn-primary" onclick="_closeModalClean();var r=repairDuplicateItemIds();toast(r.fixed+\' item ID(s) fixed!\');renderKeepScroll(\'items\');">Fix Now</button>'
    +'<button class="btn btn-secondary mt-10" onclick="closeModal()">Cancel</button>'
  );
}
function renderItems(data){
  data=data||{};
  var items=DB.items(), sections=DB.sections();
  var dupCount=_findDuplicateItemIds().length;
  var sec=data.section||'All', q=(data.q||'').toLowerCase();
  var filtered=(sec==='All'?items:items.filter(function(i){return i.section===sec;}))
    .filter(function(i){return !q||i.name.toLowerCase().includes(q)||(i.code||'').toLowerCase().includes(q);});
  var tabs='<div class="tabs"><div class="tab '+(sec==='All'?'active':'')+'" onclick="render(\'items\',{section:\'All\'})">All ('+items.length+')</div>'
    +sections.map(function(s){var cnt=items.filter(function(i){return i.section===s;}).length;return '<div class="tab '+(sec===s?'active':'')+'" onclick="render(\'items\',{section:\''+s+'\'})">'+getSectionShortName(s)+' ('+cnt+')</div>';}).join('')+'</div>';
  var listHtml=!filtered.length
    ?'<div style="text-align:center;padding:30px;color:var(--text3)">No items found</div>'
    :filtered.map(function(item){
      var typeBadge=item.type==='group'
        ?'<span style="font-size:.65rem;padding:2px 7px;border-radius:8px;background:rgba(74,158,255,.15);color:#4a9eff;font-weight:700">Group</span>'
        :'<span style="font-size:.65rem;padding:2px 7px;border-radius:8px;background:rgba(155,89,182,.15);color:#9b59b6;font-weight:700">Individual</span>';
      var stageBadge=item.isStage
        ?'<span style="font-size:.65rem;padding:2px 7px;border-radius:8px;background:rgba(240,165,0,.15);color:var(--accent);font-weight:700">On-Stage</span>'
        :'<span style="font-size:.65rem;padding:2px 7px;border-radius:8px;background:rgba(0,200,150,.15);color:var(--green);font-weight:700">Off-Stage</span>';
      return '<div class="list-item">'
        +'<div class="list-avatar" style="background:var(--purple)22;color:var(--purple);font-size:.75rem;font-weight:800">'+(item.code||'?')+'</div>'
        +'<div class="list-info"><div class="list-title">'+item.name+'</div>'
        +'<div class="list-sub" style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;margin-top:4px">'+item.section+' &nbsp;'+typeBadge+stageBadge+'</div></div>'
        +'<div style="display:flex;gap:6px">'
        +'<button class="btn btn-secondary btn-xs" aria-label="Edit item" onclick="showEditItem(\''+item.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>'
        +'<button class="btn btn-danger btn-xs" aria-label="Delete item" onclick="deleteItem(\''+item.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button></div></div>';
    }).join('');
  return tabs
    +(dupCount?'<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:rgba(240,80,80,.1);border:1px solid rgba(240,80,80,.3);border-radius:10px;padding:10px 12px;margin-bottom:12px">'
      +'<span style="font-size:.78rem;color:var(--red);font-weight:700">'+dupCount+' item'+(dupCount>1?'s share':' shares')+' a duplicate ID</span>'
      +'<button class="btn btn-danger btn-sm" style="flex-shrink:0" onclick="showRepairDuplicateItemIds()">Fix Now</button>'
      +'</div>':'')
    +'<div style="display:flex;gap:8px;margin-bottom:12px;align-items:center">'
    +'<div style="position:relative;flex:1">'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" style="margin-bottom:0;padding-right:40px" id="i-search" placeholder="Search items or code..." value="'+(data.q||'')+'" oninput="filterItemListInPlace(this.value,\''+sec+'\')">'
    +'<button id="i-clear-btn" onclick="clearItemSearch()" type="button" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px;display:'+(data.q?'':'none')+'"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
    +'</div>'
    +'<button class="btn btn-secondary btn-sm" style="flex-shrink:0;height:48px;padding:0 16px" onclick="showBulkAddItems()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg> Bulk Add</button>'
    +'</div>'
    +'<button class="btn btn-secondary btn-sm" style="width:100%;margin-bottom:12px;height:44px" onclick="showAssignItemsChooser()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg> Assign Items to Participants</button>'
    +'<div id="i-list">'+listHtml+'</div>';
}

function itemFormHTML(item){
  var sections=DB.sections();
  var i=item||{};
  var isEdit=!!(item&&item.id);
  // Section: blank for add, preloaded for edit
  var defSec  = isEdit ? (i.section||'') : (window._lastItemSection||'');
  var defType = isEdit ? (i.type||'individual') : (window._lastItemType || 'individual');
  var defStage= isEdit ? !!i.isStage : (window._lastItemStage || false);
  var isGrp=defType==='group';
  return '<div class="form-group"><label class="form-label">Event Name</label>'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="ni-name" value="'+(i.name||'')+'" placeholder="e.g. Elocution - Malayalam"></div>'
    +'<div class="form-group"><label class="form-label">Section</label>'
    +'<div style="position:relative">'
    +'<input class="form-input" id="ni-section-q" style="margin-bottom:0" autocomplete="off"'
    +' placeholder="Type to search section..." value="'+(defSec||'')+'"'
    +' oninput="niSecSearch(this.value)" onfocus="niSecSearch(this.value)" onblur="niSecBlur()">'
    +'<button type="button" id="ni-sec-clear" onclick="niSecClear()" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px;display:'+(defSec?'':'none')+'"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
    +'<div id="ni-sec-res" style="display:none;position:absolute;z-index:1200;left:0;right:0;top:100%;margin-top:3px;background:var(--card);border:1px solid var(--accent)44;border-radius:10px;max-height:180px;overflow-y:auto;box-shadow:0 6px 20px rgba(0,0,0,.4)"></div>'
    +'</div>'
    +'<input type="hidden" id="ni-section" value="'+(defSec||'')+'"></div>'
    +'<div class="form-group"><label class="form-label">Type</label>'
    +'<div class="tabs tabs-fit" style="margin-bottom:0">'
    +'<div class="tab'+(defType!=='group'?' active':'')+'" id="ni-type-ind" onclick="niTypeSelect(\'individual\')">Individual</div>'
    +'<div class="tab'+(defType==='group'?' active':'')+'" id="ni-type-grp" onclick="niTypeSelect(\'group\')">Group</div>'
    +'</div><input type="hidden" id="ni-type" value="'+defType+'"></div>'
    +'<div class="form-group"><label class="form-label">Stage Type</label>'
    +'<div class="tabs tabs-fit" style="margin-bottom:0">'
    +'<div class="tab'+(defStage?' active':'')+'" id="ni-stage-on" onclick="niStageSelect(true)">On-Stage</div>'
    +'<div class="tab'+(!defStage?' active':'')+'" id="ni-stage-off" onclick="niStageSelect(false)">Off-Stage</div>'
    +'</div><input type="hidden" id="ni-isStage" value="'+(defStage?'1':'0')+'"></div>'
    +(DB.config().scheduleEnabled!==false?'<div id="ni-schedule-wrap">':'<div id="ni-schedule-wrap" style="display:none">')
    +'<div class="form-row">'
    +'<div class="form-group"><label class="form-label">Stage</label>'
    +_wzDropdown('ni-stageId', _getStages(DB.config()).map(function(s){ return {value:s.id, label:s.name}; }), _getItemStageId(i,DB.config()), {placeholder:'Select stage…'})
    +'</div>'
    +'<div class="form-group"><label class="form-label">Scheduled Time</label>'
    +_time12hPickerHTML('ni-time', i.time||'')+'</div>'
    +'</div>'
    +(DB.config().durationMode==='multi'
      ?'<div class="form-group"><label class="form-label">Date</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="ni-date" type="date" value="'+(i.date||DB.config().dateStart||'')+'" min="'+(DB.config().dateStart||'')+'" max="'+(DB.config().dateEnd||'')+'"></div>'
      :'')
    +'</div>'
    +'<div class="form-row">'
    +'<div class="form-group"><label class="form-label">Item Code</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="ni-code" value="'+(i.code||'')+'" placeholder="e.g. A01"></div>'
    +'<div class="form-group"><label class="form-label">Max Participants</label>'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="ni-maxTeam" type="number" min="0" value="'+(i.maxTeam!==undefined?i.maxTeam:2)+'" placeholder="0 = unlimited"></div>'
    +'</div>'
    +'<label style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 14px;cursor:pointer;margin-bottom:10px">'
    +'<div><div style="font-size:.88rem;font-weight:700">Enable Custom Rank Points</div>'
    +'<div style="font-size:.72rem;color:var(--text3)">Override the global Setup rank points for this item only</div></div>'
    +'<span class="toggle-switch"><input type="checkbox" id="ni-customRankBonus" onchange="niToggleRankBonusFields(this.checked)"'+(i.customRankBonus?' checked':'')+'><span class="toggle-slider"></span></span>'
    +'</label>'
    +'<div id="ni-rankbonus-wrap" style="'+(i.customRankBonus?'':'display:none')+'">'
    +'<div class="form-row">'
    +'<div class="form-group"><label class="form-label">1st Point</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="ni-rankBonus1" type="number" min="0" value="'+(i.rankBonus1!==undefined?i.rankBonus1:0)+'"></div>'
    +'<div class="form-group"><label class="form-label">2nd Point</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="ni-rankBonus2" type="number" min="0" value="'+(i.rankBonus2!==undefined?i.rankBonus2:0)+'"></div>'
    +'<div class="form-group"><label class="form-label">3rd Point</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="ni-rankBonus3" type="number" min="0" value="'+(i.rankBonus3!==undefined?i.rankBonus3:0)+'"></div>'
    +'</div></div>'
    +'<div id="ni-openrules-wrap" style="display:'+(isOpenSection(i.section)&&!isGrp?'block':'none')+'">'
    +'<div style="font-size:.7rem;color:var(--blue);font-weight:700;margin:2px 0 8px">OPEN SECTION ITEM &mdash; extra rules</div>'
    +'<label style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 14px;cursor:pointer;margin-bottom:10px">'
    +'<div><div style="font-size:.88rem;font-weight:700">Include in Individual Championship</div>'
    +'<div style="font-size:.72rem;color:var(--text3)">Off: points still count for the Team, but not for Individual Champion</div></div>'
    +'<span class="toggle-switch"><input type="checkbox" id="ni-inclIndiv"'+(i.inclIndiv!==false?' checked':'')+'><span class="toggle-slider"></span></span>'
    +'</label>'
    +'<label style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 14px;cursor:pointer;margin-bottom:14px">'
    +'<div><div style="font-size:.88rem;font-weight:700">Counts Toward Max Item Limit</div>'
    +'<div style="font-size:.72rem;color:var(--text3)">Off: this item doesn\'t use up a participant\'s max item slots</div></div>'
    +'<span class="toggle-switch"><input type="checkbox" id="ni-countsToLimit"'+(i.countsToLimit!==false?' checked':'')+'><span class="toggle-slider"></span></span>'
    +'</label>'
    +'</div>';
}

function niToggleRankBonusFields(checked){
  var wrap=document.getElementById('ni-rankbonus-wrap');
  if(wrap) wrap.style.display=checked?'':'none';
}

// ============================================
// JUDGE MARKING LINKS
// ============================================
async function showJudgeLinksModal(itemId){
  var item=DB.items().find(function(i){return i.id==itemId;});
  if(!item) return;
  if(!window.WinzeraSync || !window.WinzeraSync.getOrgId()){
    toast('Judge links need an online admin session. Please sign in online first.','error');
    return;
  }
  showModal('<div class="modal-handle"></div><div class="modal-title">Judge Links \u2014 '+item.name+'</div>'
    +'<div style="font-size:.75rem;color:var(--text2);margin:-8px 0 12px">'+item.section+(item.code?' &middot; Code '+item.code:'')+'</div>'
    +'<div id="jlinks-body" style="min-height:80px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:.85rem">Loading\u2026</div>'
    +'<button class="btn btn-secondary mt-10" id="jlinks-close-btn" onclick="closeModal()">Close</button>', {noSaveBtn:true});
  await _refreshJudgeLinksModal(itemId);
}
// Generating a link, toggling one, or locking them all all need a network
// round-trip (sometimes two). Previously the buttons stayed live-looking
// the whole time — no feedback that anything was happening, and nothing
// stopped an impatient extra tap from firing off a second request (which
// could create a duplicate link). This shows a spinner in place of the
// list and disables Close for the duration, so there's nothing left to
// tap until the request actually finishes.
var _jlinksBusy=false;
function _jlinksShowBusy(msg){
  var body=document.getElementById('jlinks-body');
  if(body) body.innerHTML='<style>@keyframes jlinksSpin{to{transform:rotate(360deg)}}</style>'
    +'<div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px 0;color:var(--text3);font-size:.82rem">'
    +'<div style="width:26px;height:26px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:jlinksSpin .8s linear infinite"></div>'
    +'<div>'+(msg||'Working\u2026')+'</div></div>';
  var closeBtn=document.getElementById('jlinks-close-btn');
  if(closeBtn){ closeBtn.disabled=true; closeBtn.style.opacity='.5'; closeBtn.style.pointerEvents='none'; }
}
function _jlinksClearBusy(){
  _jlinksBusy=false;
  var closeBtn=document.getElementById('jlinks-close-btn');
  if(closeBtn){ closeBtn.disabled=false; closeBtn.style.opacity=''; closeBtn.style.pointerEvents=''; }
}
async function _refreshJudgeLinksModal(itemId){
  var body=document.getElementById('jlinks-body');
  if(!body) return;
  var item=DB.items().find(function(i){return i.id==itemId;});
  var cfg=DB.config();
  var nj=parseInt(cfg.maxJudges)||3;
  var namedJudges=cfg.judges||[];
  try{
    var allLinks=await window.WinzeraSync.listJudgeLinks();
    var linksForItem=allLinks.filter(function(l){return String(l.item_id)===String(itemId);});
    var activeCount=linksForItem.filter(function(l){return l.is_active;}).length;
    var html='<div style="font-size:.72rem;color:var(--text3);margin-bottom:10px">Share each judge their own link. Locking a link stops further changes \u2014 use it once you\u2019ve collected that judge\u2019s marks.</div>';
    if(activeCount>1){
      html+='<button class="btn btn-danger btn-sm" style="width:100%;margin-bottom:12px;display:flex;align-items:center;justify-content:center;gap:6px" onclick="_lockAllJudgeLinks(\''+itemId+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Lock All ('+activeCount+' active)</button>';
    }
    for(var slot=1; slot<=nj; slot++){
      var existing=linksForItem.filter(function(l){return l.judge_index===slot;}).sort(function(a,b){return new Date(b.created_at)-new Date(a.created_at);})[0];
      var judgeName=(namedJudges[slot-1]&&namedJudges[slot-1].name)?namedJudges[slot-1].name:('Judge '+slot);
      html+='<div id="jlink-slot-'+slot+'">'+_jlinkSlotHTML(itemId, item, slot, existing, judgeName)+'</div>';
    }
    body.innerHTML=html;
  }catch(e){
    console.error('Judge links load failed:', e);
    var detail=(e&&e.message)?e.message:'Unknown error';
    body.innerHTML='<div style="color:var(--red);font-size:.85rem;text-align:center">Could not load judge links.<br><span style="font-size:.72rem;color:var(--text3)">'+detail+'</span></div>';
  }
}
function _jlinkSlotHTML(itemId, item, slot, existing, judgeName){
  var html='<div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:10px">'
    +'<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:'+(existing?'8px':'0')+'">'
    +'<div style="font-weight:700;font-size:.88rem">'+judgeName+'</div>'
    +(existing?('<span class="badge" style="font-size:.65rem;padding:2px 9px;border-radius:20px;'+(existing.is_active?'background:rgba(0,200,150,.15);color:var(--green)':'background:rgba(255,71,87,.15);color:var(--red)')+'">'+(existing.is_active?'Active':'Locked')+'</span>'):'')
    +'</div>';
  if(existing){
    var submittedHtml=existing.submitted_at
      ?'<div style="font-size:.68rem;color:var(--green);margin-top:6px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Submitted '+new Date(existing.submitted_at).toLocaleString()+'</div>'
      :'<div style="font-size:.68rem;color:var(--text3);margin-top:6px">Not submitted yet</div>';
    var shareArgs="'"+existing.link+"','"+item.name.replace(/'/g,"\\'")+"','"+item.section.replace(/'/g,"\\'")+"','"+judgeName.replace(/'/g,"\\'")+"'";
    html+='<div style="display:flex;gap:6px;align-items:center">'
      +'<input readonly class="form-input" style="margin-bottom:0;font-size:.72rem;flex:1" value="'+existing.link+'" onclick="this.select()">'
      +'<button class="btn btn-secondary btn-xs" onclick="_shareJudgeLink('+shareArgs+')">Share</button>'
      +'<button class="btn '+(existing.is_active?'btn-danger':'btn-primary')+' btn-xs" onclick="_toggleJudgeLinkAndRefresh(\''+existing.id+'\','+(!existing.is_active)+',\''+itemId+'\')">'+(existing.is_active?'Lock':'Unlock')+'</button>'
      +'</div>'+submittedHtml;
  }else{
    html+='<button class="btn btn-primary btn-sm" style="width:100%;margin-top:6px" onclick="_generateJudgeLink(\''+itemId+'\','+slot+')">Generate Link</button>';
  }
  html+='</div>';
  return html;
}
function _shareJudgeLink(link, itemName, section, judgeLabel){
  var text='Judge Marking Link\nItem: '+itemName+' ('+section+')\nFor: '+judgeLabel+'\n\n'+link;
  if(navigator.share){
    navigator.share({title:'Judge Link \u2014 '+itemName, text:text}).catch(function(){});
  }else{
    var done=function(){ toast('Link copied with item/section/judge details!'); };
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done).catch(done); }
    else{
      var ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select();
      try{ document.execCommand('copy'); }catch(e){}
      document.body.removeChild(ta); done();
    }
  }
}
async function _generateJudgeLink(itemId, judgeIndex){
  if(_jlinksBusy) return;
  _jlinksBusy=true;
  var cfg=DB.config();
  var namedJudges=cfg.judges||[];
  var label=(namedJudges[judgeIndex-1]&&namedJudges[judgeIndex-1].name)?namedJudges[judgeIndex-1].name:('Judge '+judgeIndex);
  var slotEl=document.getElementById('jlink-slot-'+judgeIndex);
  var closeBtn=document.getElementById('jlinks-close-btn');
  // Only the one slot being generated shows a spinner and only that
  // button is disabled — the other judges' Generate/Share/Lock buttons
  // stay usable, so generating one judge's link doesn't block work on the
  // others. Close is still disabled for the moment so the modal can't be
  // dismissed mid-request and lose track of whether it went through.
  if(slotEl) slotEl.innerHTML='<style>@keyframes jlinksSpin{to{transform:rotate(360deg)}}</style>'
    +'<div style="background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:10px;display:flex;align-items:center;gap:10px;color:var(--text3);font-size:.8rem">'
    +'<div style="width:16px;height:16px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:jlinksSpin .8s linear infinite;flex-shrink:0"></div>Generating link\u2026</div>';
  if(closeBtn){ closeBtn.disabled=true; closeBtn.style.opacity='.5'; closeBtn.style.pointerEvents='none'; }
  try{
    // createJudgeLink already returns everything this slot needs to render
    // — no need for a second round-trip (listJudgeLinks) just to redraw
    // the one slot that changed. That second call used to run every time
    // and was most of what made "Generate Link" feel slow.
    var created=await window.WinzeraSync.createJudgeLink(itemId, judgeIndex, label);
    var item=DB.items().find(function(i){return i.id==itemId;});
    var pseudoExisting={id:created.id, link:created.link, is_active:true, submitted_at:null};
    if(slotEl) slotEl.innerHTML=_jlinkSlotHTML(itemId, item, judgeIndex, pseudoExisting, label);
    toast('Judge link generated!');
  }catch(e){
    console.error('Create judge link failed:', e);
    toast('Could not generate link. Check your connection.','error');
    await _refreshJudgeLinksModal(itemId);
  }finally{
    _jlinksBusy=false;
    if(closeBtn){ closeBtn.disabled=false; closeBtn.style.opacity=''; closeBtn.style.pointerEvents=''; }
  }
}
async function _toggleJudgeLinkAndRefresh(linkId, makeActive, itemId){
  if(_jlinksBusy) return;
  _jlinksBusy=true;
  _jlinksShowBusy(makeActive?'Unlocking link\u2026':'Locking link\u2026');
  try{
    await window.WinzeraSync.toggleJudgeLink(linkId, makeActive);
    await _refreshJudgeLinksModal(itemId);
    toast(makeActive?'Link unlocked':'Link locked \u2014 further changes blocked');
  }catch(e){
    console.error('Toggle judge link failed:', e);
    toast('Could not update link. Check your connection.','error');
    await _refreshJudgeLinksModal(itemId);
  }finally{
    _jlinksClearBusy();
  }
}
async function _lockAllJudgeLinks(itemId){
  if(_jlinksBusy) return;
  _jlinksBusy=true;
  _jlinksShowBusy('Locking all links\u2026');
  try{
    var allLinks=await window.WinzeraSync.listJudgeLinks();
    var toLock=allLinks.filter(function(l){return String(l.item_id)===String(itemId) && l.is_active;});
    if(!toLock.length){ toast('No active links to lock'); await _refreshJudgeLinksModal(itemId); return; }
    for(var i=0;i<toLock.length;i++){
      await window.WinzeraSync.toggleJudgeLink(toLock[i].id, false);
    }
    await _refreshJudgeLinksModal(itemId);
    toast('Locked '+toLock.length+' judge link'+(toLock.length===1?'':'s'));
  }catch(e){
    console.error('Lock all judge links failed:', e);
    toast('Could not lock all links. Check your connection and try again.','error');
    await _refreshJudgeLinksModal(itemId);
  }finally{
    _jlinksClearBusy();
  }
}
function _copyJudgeLink(link){
  var done=function(){ toast('Link copied!'); };
  if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(link).then(done).catch(done); }
  else{
    var ta=document.createElement('textarea'); ta.value=link; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); }catch(e){}
    document.body.removeChild(ta); done();
  }
}

function getNextAvailableItemCode(existingItems){
  var existingIds={};
  (existingItems||[]).forEach(function(it){
    var n=parseInt(it.code,10);
    if(!isNaN(n)) existingIds[n]=true;
  });
  var nextId=1;
  while(existingIds[nextId]) nextId++;
  return String(nextId).padStart(3,'0');
}
function niTypeSelect(type){
  var hid=document.getElementById('ni-type'); if(hid) hid.value=type;
  var ind=document.getElementById('ni-type-ind'), grp=document.getElementById('ni-type-grp');
  if(ind) ind.classList.toggle('active', type!=='group');
  if(grp) grp.classList.toggle('active', type==='group');
  niUpdateOpenRulesVisibility();
}
function niStageSelect(isStage){
  var hid=document.getElementById('ni-isStage'); if(hid) hid.value=isStage?'1':'0';
  var onEl=document.getElementById('ni-stage-on'), offEl=document.getElementById('ni-stage-off');
  if(onEl) onEl.classList.toggle('active', isStage);
  if(offEl) offEl.classList.toggle('active', !isStage);
}
// toggleScheduleFields removed — schedule controlled globally in Setup
function niSecSearch(q){
  var all=DB.sections();
  var res=document.getElementById('ni-sec-res'); if(!res) return;
  q=(q||'').toLowerCase().trim();
  var filtered=q?all.filter(function(s){return s.toLowerCase().indexOf(q)>=0;}):all;
  if(!filtered.length){
    res.innerHTML='<div style="padding:10px 14px;font-size:.82rem;color:var(--text3)">No sections found</div>';
    res.style.display='block'; return;
  }
  var cur=document.getElementById('ni-section').value;
  res.innerHTML=filtered.map(function(s){
    var isSel=s===cur;
    return '<div data-sec="'+s+'" onmousedown="niSecSelect(this)"'
      +' style="padding:9px 14px;cursor:pointer;font-size:.83rem;border-bottom:1px solid var(--border);'
      +(isSel?'background:var(--accent)18;font-weight:700;color:var(--accent)':'')+'">'
      +s+'</div>';
  }).join('');
  var cb=document.getElementById('ni-sec-clear'); if(cb) cb.style.display=q?'':'none';
  res.style.display='block';
}
function niSecBlur(){
  setTimeout(function(){
    var res=document.getElementById('ni-sec-res');
    if(res) res.style.display='none';
    // If input doesn't match a real section, restore last valid value
    var q=document.getElementById('ni-section-q');
    var hid=document.getElementById('ni-section');
    if(q&&hid&&q.value!==hid.value){
      // Check if typed value exactly matches a section
      var match=DB.sections().find(function(s){return s.toLowerCase()===q.value.toLowerCase();});
      if(match){ hid.value=match; q.value=match; }
      else { q.value=hid.value; } // restore
    }
    niUpdateOpenRulesVisibility();
  },200);
}
function niUpdateOpenRulesVisibility(){
  var hid=document.getElementById('ni-section');
  var typeHid=document.getElementById('ni-type');
  var wrap=document.getElementById('ni-openrules-wrap');
  // Extra Rules only apply to Individual items under an Open Section — hidden entirely for Group items.
  var isGrpNow=typeHid&&typeHid.value==='group';
  if(wrap) wrap.style.display=(hid&&isOpenSection(hid.value)&&!isGrpNow)?'block':'none';
}
function niSecClear(){
  var q=document.getElementById('ni-section-q');
  var hid=document.getElementById('ni-section');
  var cb=document.getElementById('ni-sec-clear');
  if(q) q.value='';
  if(hid) hid.value='';
  if(cb) cb.style.display='none';
  var res=document.getElementById('ni-sec-res'); if(res) res.style.display='none';
  niUpdateOpenRulesVisibility();
}
function niSecSelect(el){
  var sec=el.getAttribute('data-sec');
  var q=document.getElementById('ni-section-q');
  var hid=document.getElementById('ni-section');
  if(q) q.value=sec;
  if(hid) hid.value=sec;
  var res=document.getElementById('ni-sec-res');
  if(res) res.style.display='none';
  var cb=document.getElementById('ni-sec-clear'); if(cb) cb.style.display=sec?'':'none';
  niUpdateOpenRulesVisibility();
}
function showAddItem(){
  showModal('<div class="modal-handle"></div>'+
  '<button class="modal-close-btn" onclick="closeModal()" aria-label="Close">&times;</button>'+
  '<div class="modal-title">Add Item</div>'+itemFormHTML()+
  '<button class="btn btn-primary mt-10" onclick="addItem()">Add Item</button>'+
  '<button class="btn btn-secondary mt-6" onclick="closeModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Close</button>',
  { saveCallback: addItem }
);
}
function showEditItem(itemId){
  var items=DB.items();
  var idx=items.findIndex(function(x){return x.id==itemId;});
  var item=items[idx];
  if(!item) return toast('Item not found','error');
  showModal('<div class="modal-handle"></div>'+
  '<button class="modal-close-btn" onclick="closeModal()" aria-label="Close">&times;</button>'+
  '<div class="modal-title">Edit Item</div>'
  +itemFormHTML(item)
  +'<button class="btn btn-primary mt-10" onclick="updateItem(\''+itemId+'\')">Save Changes</button>'
  +'<button class="btn btn-secondary mt-10" onclick="closeModal()">Cancel</button>',
  { saveCallback: function(){ updateItem(itemId); } }
);
}

function addItem(){
  var name=document.getElementById('ni-name').value.trim();
  if(!name) return toast('Enter event name','error');
  var type=document.getElementById('ni-type').value;
  var section=document.getElementById('ni-section').value;
  if(!section) return toast('Please select a section first','error');
  var isStage=document.getElementById('ni-isStage')?document.getElementById('ni-isStage').value==='1':false;
  var maxTeam=parseInt(document.getElementById('ni-maxTeam').value)||0;
  var customRankBonus=document.getElementById('ni-customRankBonus')?document.getElementById('ni-customRankBonus').checked:false;
  var rankBonus1=parseInt(document.getElementById('ni-rankBonus1')&&document.getElementById('ni-rankBonus1').value)||0;
  var rankBonus2=parseInt(document.getElementById('ni-rankBonus2')&&document.getElementById('ni-rankBonus2').value)||0;
  var rankBonus3=parseInt(document.getElementById('ni-rankBonus3')&&document.getElementById('ni-rankBonus3').value)||0;
  var inclIndiv=document.getElementById('ni-inclIndiv')?document.getElementById('ni-inclIndiv').checked:true;
  var countsToLimit=document.getElementById('ni-countsToLimit')?document.getElementById('ni-countsToLimit').checked:true;
  // Remember for next time
  window._lastItemSection=section; window._lastItemType=type; window._lastItemStage=isStage;
  var items=DB.items();
  var cfg=DB.config();
  var schedEnabled=cfg.scheduleEnabled!==false;
  var code=document.getElementById('ni-code').value.trim()||getNextAvailableItemCode(items);
  // ── Duplicate item code check ──
  if(code){
    var dupCode=items.find(function(i){return (i.code||'').toUpperCase()===(code||'').toUpperCase();});
    if(dupCode) return toast('Item code "'+code+'" already used by "'+dupCode.name+'"','error');
  }
  name=applyTextCase(name);
  items.push({id:_nextUniqueIds(items,1)[0],name:name,section:section,
    type:type,isStage:isStage,code:code,
    stageId:schedEnabled?(document.getElementById('ni-stageId')?document.getElementById('ni-stageId').value:_getStages(cfg)[0].id):null,
    date:schedEnabled&&document.getElementById('ni-date')?document.getElementById('ni-date').value:'',
    time:schedEnabled?(document.getElementById('ni-time').value):'',maxTeam:maxTeam,
    customRankBonus:customRankBonus,rankBonus1:rankBonus1,rankBonus2:rankBonus2,rankBonus3:rankBonus3,
    inclIndiv:inclIndiv,countsToLimit:countsToLimit,declared:false});
  DB.saveItems(items); _closeModalClean(); toast('Item added!'); render('items');
}

function updateItem(itemId){
  var type=document.getElementById('ni-type').value;
  var isStage=document.getElementById('ni-isStage')?document.getElementById('ni-isStage').value==='1':false;
  var maxTeam=parseInt(document.getElementById('ni-maxTeam').value)||0;
  var items=DB.items();
  var cfg=DB.config();
  var schedEnabled=cfg.scheduleEnabled!==false;
  var idx=items.findIndex(function(x){return x.id==itemId;});
  if(idx<0) return toast('Item not found','error');
  const oldItem=items[idx];
  const newName=applyTextCase(document.getElementById('ni-name').value.trim());
  const newCode=document.getElementById('ni-code').value.trim();
  // ── Duplicate item code check ──
  if(newCode){
    var dupCode=items.find(function(i){return i.id!=itemId&&(i.code||'').toUpperCase()===(newCode||'').toUpperCase();});
    if(dupCode) return toast('Item code "'+newCode+'" already used by "'+dupCode.name+'"','error');
  }
  items[idx]=Object.assign({},items[idx],{
    name:newName,
    section:document.getElementById('ni-section').value,
    type:type, isStage:isStage,
    code:newCode,
    stageId:schedEnabled?(document.getElementById('ni-stageId')?document.getElementById('ni-stageId').value:_getStages(cfg)[0].id):null,
    date:schedEnabled&&document.getElementById('ni-date')?document.getElementById('ni-date').value:'',
    time:schedEnabled?(document.getElementById('ni-time').value):'',
    maxTeam:maxTeam,
    customRankBonus:document.getElementById('ni-customRankBonus')?document.getElementById('ni-customRankBonus').checked:false,
    rankBonus1:parseInt(document.getElementById('ni-rankBonus1')&&document.getElementById('ni-rankBonus1').value)||0,
    rankBonus2:parseInt(document.getElementById('ni-rankBonus2')&&document.getElementById('ni-rankBonus2').value)||0,
    rankBonus3:parseInt(document.getElementById('ni-rankBonus3')&&document.getElementById('ni-rankBonus3').value)||0,
    inclIndiv:document.getElementById('ni-inclIndiv')?document.getElementById('ni-inclIndiv').checked:true,
    countsToLimit:document.getElementById('ni-countsToLimit')?document.getElementById('ni-countsToLimit').checked:true
  });
  DB.saveItems(items);
  // Cascade item name change to groups
  if(oldItem&&newName&&oldItem.name!==newName){
    var groups=DB.groups().map(function(g){return _grpHasItem(g,itemId)?Object.assign({},g,{itemName:newName}):g;});
    DB.saveGroups(groups);
  }
  _closeModalClean(); toast('Item updated!'); renderKeepScroll('items');
}

// ── Generic UI-based searchable dropdown (used by Bulk Add modals) ──
function _sdSearch(qId,resId,hiddenId,clearId,list,selectFn){
  var res=document.getElementById(resId); if(!res) return;
  var q=(document.getElementById(qId).value||'').toLowerCase().trim();
  var cb=document.getElementById(clearId); if(cb) cb.style.display=q?'':'none';
  var filtered=q?list.filter(function(s){return s.toLowerCase().indexOf(q)>=0;}):list;
  if(!filtered.length){
    res.innerHTML='<div style="padding:10px 14px;font-size:.82rem;color:var(--text3)">No results found</div>';
    res.style.display='block'; return;
  }
  var cur=document.getElementById(hiddenId).value;
  res.innerHTML=filtered.map(function(s){
    var esc=String(s).replace(/"/g,'&quot;');
    return '<div data-val="'+esc+'" onmousedown="'+selectFn+'(this)" style="padding:9px 14px;cursor:pointer;font-size:.83rem;border-bottom:1px solid var(--border);'
      +(s===cur?'background:var(--accent)18;font-weight:700;color:var(--accent)':'')+'">'+s+'</div>';
  }).join('');
  res.style.display='block';
}
function _sdSelectVal(resId,qId,hiddenId,clearId,val){
  var q=document.getElementById(qId), hid=document.getElementById(hiddenId);
  if(q) q.value=val; if(hid) hid.value=val;
  var res=document.getElementById(resId); if(res) res.style.display='none';
  // Defer hiding the clear button itself: if we hide it synchronously while it's
  // still mid-click (this fires from the clear button's own onclick), the browser
  // can retarget the click event to whatever's now underneath — which can be the
  // modal overlay, unintentionally triggering its "click outside to close" handler.
  setTimeout(function(){
    var cb=document.getElementById(clearId); if(cb) cb.style.display=val?'':'none';
  },0);
}
function _sdBlur(qId,resId,hiddenId,list){
  setTimeout(function(){
    var res=document.getElementById(resId); if(res) res.style.display='none';
    var q=document.getElementById(qId), hid=document.getElementById(hiddenId);
    if(q&&hid&&q.value!==hid.value){
      var match=list.find(function(s){return s.toLowerCase()===q.value.toLowerCase();});
      if(match){hid.value=match;q.value=match;} else {q.value=hid.value;}
    }
  },200);
}
// A non-editable stand-in for _sdFieldHTML used when a Team Manager's team is
// locked in — renders the same hidden "_hid" input other code reads from, but
// with a fixed display value instead of a searchable dropdown.
function _lockedFieldHTML(prefix,label,value){
  return '<div class="form-group"><label class="form-label">'+label+'</label>'
    +'<div class="form-input" style="display:flex;align-items:center;color:var(--text2);background:var(--bg3);cursor:default">'+value+'</div>'
    +'<input type="hidden" id="'+prefix+'_hid" value="'+value+'"></div>';
}
// Chest numbers are auto-generated within each team's configured range (set on
// the Team form) so different teams never collide. Falls back to the old
// unrestricted 101+ behavior for teams with no range configured (legacy data).
// strict=true (used for Team Manager entry points) returns null instead of the wide
// fallback when the team has no explicit range set — Team Managers only ever add
// participants to their own team, so silently allowing 101–999999 would mean the
// start/end range Admin intended is never actually enforced for them.
function _teamChestRange(teamName, strict){
  var team=DB.teams().find(function(t){return t.name===teamName;});
  if(team && team.chestFrom && team.chestTo) return {from:parseInt(team.chestFrom), to:parseInt(team.chestTo)};
  if(strict) return null;
  return {from:101, to:999999};
}
function nextChestForTeam(teamName, extraUsed, strict){
  var range=_teamChestRange(teamName, strict);
  if(!range) return null;
  var used={};
  DB.participants().forEach(function(p){ used[String(p.chestNo)]=1; });
  DB.groups().forEach(function(g){ used[String(g.groupChestNo)]=1; });
  if(extraUsed) extraUsed.forEach(function(c){ used[String(c)]=1; });
  var n=range.from;
  while(n<=range.to && used[String(n)]) n++;
  if(n>range.to) return null;
  return n;
}
function _sdFieldHTML(prefix,label,placeholder,value){
  var qId=prefix+'_q', resId=prefix+'_res', hiddenId=prefix+'_hid', clearId=prefix+'_clear';
  return '<div class="form-group"><label class="form-label">'+label+'</label>'
    +'<div style="position:relative">'
    +'<input class="form-input" id="'+qId+'" style="margin-bottom:0;padding-right:36px" autocomplete="off"'
    +' placeholder="'+placeholder+'" value="'+(value||'')+'"'
    +' oninput="'+prefix+'_search(this.value)" onfocus="'+prefix+'_search(this.value)" onblur="'+prefix+'_blur()">'
    +'<button type="button" id="'+clearId+'" onclick="'+prefix+'_clear()" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px;display:'+(value?'':'none')+'"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
    +'<div id="'+resId+'" style="display:none;position:absolute;z-index:1200;left:0;right:0;top:100%;margin-top:3px;background:var(--card);border:1px solid var(--accent)44;border-radius:10px;max-height:180px;overflow-y:auto;box-shadow:0 6px 20px rgba(0,0,0,.4)"></div>'
    +'</div><input type="hidden" id="'+hiddenId+'" value="'+(value||'')+'"></div>';
}
// Bulk Add Participants — Section dropdown
function baPSec_search(q){ _sdSearch('baPSec_q','baPSec_res','baPSec_hid','baPSec_clear',DB.sections().filter(function(s){return !isOpenSection(s);}),'baPSec_select'); }
function baPSec_blur(){ _sdBlur('baPSec_q','baPSec_res','baPSec_hid',DB.sections().filter(function(s){return !isOpenSection(s);})); }
function baPSec_select(el){ _sdSelectVal('baPSec_res','baPSec_q','baPSec_hid','baPSec_clear',el.getAttribute('data-val')); }
function baPSec_clear(){ _sdSelectVal('baPSec_res','baPSec_q','baPSec_hid','baPSec_clear',''); }
// Bulk Add Participants — Team dropdown
function baPTeam_search(q){ _sdSearch('baPTeam_q','baPTeam_res','baPTeam_hid','baPTeam_clear',DB.teams().map(function(t){return t.name;}),'baPTeam_select'); }
function baPTeam_blur(){ _sdBlur('baPTeam_q','baPTeam_res','baPTeam_hid',DB.teams().map(function(t){return t.name;})); }
function baPTeam_select(el){ _sdSelectVal('baPTeam_res','baPTeam_q','baPTeam_hid','baPTeam_clear',el.getAttribute('data-val')); }
function baPTeam_clear(){ _sdSelectVal('baPTeam_res','baPTeam_q','baPTeam_hid','baPTeam_clear',''); }
// Bulk Add Items — Section dropdown
function baISec_search(q){ _sdSearch('baISec_q','baISec_res','baISec_hid','baISec_clear',DB.sections(),'baISec_select'); }
function baISec_blur(){ _sdBlur('baISec_q','baISec_res','baISec_hid',DB.sections()); }
function baISec_select(el){ _sdSelectVal('baISec_res','baISec_q','baISec_hid','baISec_clear',el.getAttribute('data-val')); baiUpdateOpenRulesVisibility(); }
function baISec_clear(){ _sdSelectVal('baISec_res','baISec_q','baISec_hid','baISec_clear',''); baiUpdateOpenRulesVisibility(); }
function baiUpdateOpenRulesVisibility(){
  var hid=document.getElementById('baISec_hid');
  var typeHid=document.getElementById('ba-i-type');
  var wrap=document.getElementById('ba-i-openrules-wrap');
  var isGrpNow=typeHid&&typeHid.value==='group';
  if(wrap) wrap.style.display=(hid&&isOpenSection(hid.value)&&!isGrpNow)?'block':'none';
}
// Bulk Add Items — Type toggle
function baiTypeSelect(type){
  var hid=document.getElementById('ba-i-type'); if(hid) hid.value=type;
  var ind=document.getElementById('ba-i-type-ind'), grp=document.getElementById('ba-i-type-grp');
  if(ind) ind.classList.toggle('active', type!=='group');
  if(grp) grp.classList.toggle('active', type==='group');
  var lbl=document.getElementById('ba-i-stage-lbl');
  if(lbl) lbl.textContent = type==='group' ? 'On-Stage Group Event' : 'On-Stage Event';
  baiUpdateOpenRulesVisibility();
}

// ============================================================
// BULK ADD ITEMS
// ============================================================
function showBulkAddItems(){
  var sections=DB.sections();
  if(!sections.length) return toast('Add a Section first','error');
  showModal('<div class="modal-handle"></div>'+
    '<button class="modal-close-btn" onclick="closeModal()" aria-label="Close">&times;</button>'+
    '<div class="modal-title">Bulk Add Items</div>'+
    '<div style="font-size:.78rem;color:var(--text3);margin-bottom:12px">Choose Section &amp; Type once, then paste or type one item name per line. Item codes are generated automatically.</div>'+
    _sdFieldHTML('baISec','Section','Type to search section...','')+
    '<div class="form-group"><label class="form-label">Type</label>'+
    '<div class="tabs" style="margin-bottom:0">'+
    '<div class="tab active" id="ba-i-type-ind" onclick="baiTypeSelect(\'individual\')">Individual</div>'+
    '<div class="tab" id="ba-i-type-grp" onclick="baiTypeSelect(\'group\')">Group</div>'+
    '</div><input type="hidden" id="ba-i-type" value="individual"></div>'+
    '<label style="display:flex;align-items:center;gap:10px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 14px;cursor:pointer;margin-bottom:14px;margin-top:14px">'+
    '<input type="checkbox" id="ba-i-stage" style="width:18px;height:18px;accent-color:var(--accent)">'+
    '<div><div id="ba-i-stage-lbl" style="font-size:.88rem;font-weight:700">On-Stage Event</div>'+
    '<div style="font-size:.72rem;color:var(--text3)">Applies to every item in this batch</div></div></label>'+
    '<div class="form-group"><label class="form-label">Max Participants per Team <span style="font-size:.72rem;color:var(--text3)">(0 = unlimited)</span></label>'+
    '<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="ba-i-maxTeam" type="number" min="0" value="2" placeholder="2"></div>'+
    '<div id="ba-i-openrules-wrap" style="display:none">'+
    '<div style="font-size:.7rem;color:var(--blue);font-weight:700;margin:2px 0 8px">OPEN SECTION BATCH &mdash; extra rules</div>'+
    '<label style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 14px;cursor:pointer;margin-bottom:10px">'+
    '<div><div style="font-size:.88rem;font-weight:700">Include in Individual Championship</div>'+
    '<div style="font-size:.72rem;color:var(--text3)">Applies to every item in this batch</div></div>'+
    '<span class="toggle-switch"><input type="checkbox" id="ba-i-inclIndiv" checked><span class="toggle-slider"></span></span>'+
    '</label>'+
    '<label style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 14px;cursor:pointer;margin-bottom:14px">'+
    '<div><div style="font-size:.88rem;font-weight:700">Counts Toward Max Item Limit</div>'+
    '<div style="font-size:.72rem;color:var(--text3)">Applies to every item in this batch</div></div>'+
    '<span class="toggle-switch"><input type="checkbox" id="ba-i-countsToLimit" checked><span class="toggle-slider"></span></span>'+
    '</label>'+
    '</div>'+
    '<div class="form-group"><label class="form-label">Item Names <span style="font-size:.72rem;color:var(--text3)">(one per line)</span></label>'+
    '<textarea autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="ba-i-names" rows="8" style="resize:vertical;font-family:inherit" placeholder="e.g.\nElocution - Malayalam\nGroup Song\nQuiz"></textarea></div>'+
    '<div id="ba-i-preview-wrap"></div>'+
    '<button class="btn btn-primary mt-10" id="ba-i-preview-btn" onclick="previewBulkItems()">Preview</button>'+
    '<button class="btn btn-secondary mt-6" onclick="closeModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Close</button>'
  );
}
function _parseBulkLines(raw){
  return (raw||'').split('\n')
    .map(function(l){ return l.replace(/^\s*\d+[\.\)]\s*/,'').replace(/^\s*[-*]\s*/,'').trim(); })
    .filter(function(l){ return l.length>0; });
}
function previewBulkItems(){
  var section=document.getElementById('baISec_hid').value;
  var type=document.getElementById('ba-i-type').value;
  var isStage=document.getElementById('ba-i-stage').checked;
  var maxTeam=parseInt(document.getElementById('ba-i-maxTeam').value)||0;
  var inclIndiv=document.getElementById('ba-i-inclIndiv').checked;
  var countsToLimit=document.getElementById('ba-i-countsToLimit').checked;
  var names=_parseBulkLines(document.getElementById('ba-i-names').value);
  if(!section) return toast('Select a Section first','error');
  if(!names.length) return toast('Enter at least one item name','error');
  var items=DB.items();
  // Find next numeric code, skipping any codes already used (scans from 1 upward to backfill gaps)
  var usedCodes=items.map(function(i){return (i.code||'').toUpperCase();});
  var nextNum=1;
  function genCode(){
    var c=String(nextNum).padStart(3,'0');
    while(usedCodes.includes(c)){ nextNum++; c=String(nextNum).padStart(3,'0'); }
    usedCodes.push(c); nextNum++;
    return c;
  }
  var rows=names.map(function(name){
    return {name:applyTextCase(name), code:genCode(), section:section, type:type, isStage:isStage, maxTeam:maxTeam, inclIndiv:inclIndiv, countsToLimit:countsToLimit};
  });
  window._bulkItemRows=rows;
  _recomputeBulkItemFlags();
  renderBulkItemPreview();
  document.getElementById('ba-i-preview-btn').style.display='none';
}
// Re-checks every row's name/code against the DB and against every other row currently
// in the batch. Called on initial Preview, after Re-Preview, after removing a row, and
// right before committing — so in-place edits are always re-validated before they count.
function _recomputeBulkItemFlags(){
  var rows=window._bulkItemRows||[];
  var items=DB.items();
  var seenNames={}, seenCodes={};
  rows.forEach(function(r){
    var key=(r.name||'').toLowerCase().trim();
    var dupExisting=items.some(function(i){return i.section===r.section && (i.name||'').toLowerCase()===key;});
    var dupBatch=!!seenNames[key] && key!=='';
    seenNames[key]=true;
    r.flagged=(dupExisting||dupBatch);
    var code=(r.code||'').toUpperCase().trim();
    r.code=code;
    var codeErr=null;
    if(!code) codeErr='Enter a valid item code';
    else if(seenCodes[code]) codeErr='Duplicate code in this batch';
    else if(items.some(function(i){return (i.code||'').toUpperCase()===code;})) codeErr='Code '+code+' already in use';
    if(!codeErr) seenCodes[code]=true;
    r.codeErr=codeErr;
  });
}
function renderBulkItemPreview(){
  var rows=window._bulkItemRows||[];
  var flaggedCount=rows.filter(function(r){return r.flagged;}).length;
  var errorCount=rows.filter(function(r){return r.codeErr;}).length;
  var rowsHtml=rows.length?rows.map(function(r,idx){
    var nameEsc=String(r.name||'').replace(/"/g,'&quot;');
    var codeEsc=String(r.code||'').replace(/"/g,'&quot;');
    return '<div class="list-item" style="padding:8px 12px;align-items:center;gap:8px'+((r.flagged||r.codeErr)?';background:rgba(240,165,0,.08)':'')+'">'
      +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="bai-code-'+idx+'" value="'+codeEsc+'" oninput="_baiEditCode('+idx+',this.value)" style="width:64px;flex-shrink:0;margin-bottom:0;padding:6px 4px;font-size:.75rem;text-align:center;text-transform:uppercase">'
      +'<div class="list-info" style="flex:1;min-width:0"><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="bai-name-'+idx+'" value="'+nameEsc+'" oninput="_baiEditName('+idx+',this.value)" style="margin-bottom:0;padding:6px 10px;font-size:.85rem">'
      +(r.codeErr?('<div class="list-sub" style="color:var(--red)">'+r.codeErr+'</div>'):(r.flagged?'<div class="list-sub" style="color:var(--accent)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg> Similar name already exists in this Section</div>':''))
      +'</div>'
      +'<button class="btn btn-danger btn-sm btn-icon" title="Remove row" aria-label="Remove row" onclick="removeBulkItemRow('+idx+')" style="flex-shrink:0"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
      +'</div>';
  }).join(''):'<div style="text-align:center;padding:16px;color:var(--text3);font-size:.82rem">No rows left &mdash; go back and paste some names</div>';
  var confirmHtml='<div style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px">'
    +'<div style="font-size:.8rem;font-weight:700;margin-bottom:4px">Preview &mdash; '+rows.length+' item(s)</div>'
    +'<div style="font-size:.72rem;color:var(--text3);margin-bottom:8px">Edit any name or code directly, then tap Re-Preview to re-check before adding.</div>'
    +rowsHtml
    +(flaggedCount?('<label style="display:flex;align-items:center;gap:8px;margin-top:10px;font-size:.8rem;cursor:pointer"><input type="checkbox" id="ba-i-confirm-dup" style="width:16px;height:16px;accent-color:var(--accent)"> I\'ve reviewed the '+flaggedCount+' flagged duplicate(s) above and want to add them anyway</label>'):'')
    +'<div style="display:flex;gap:8px;margin-top:10px">'
    +'<button class="btn btn-secondary" style="flex:1" onclick="rePreviewBulkItems()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg> Re-Preview</button>'
    +'<button class="btn btn-primary" style="flex:1" onclick="commitBulkItems()"'+(errorCount||!rows.length?' disabled':'')+'>Add All ('+rows.length+')</button>'
    +'</div>'
    +(errorCount?'<div style="font-size:.72rem;color:var(--red);margin-top:6px">Fix '+errorCount+' code issue(s) above, then tap Re-Preview.</div>':'')
    +'</div>';
  document.getElementById('ba-i-preview-wrap').innerHTML=confirmHtml;
}
function _baiEditName(idx,val){ var rows=window._bulkItemRows||[]; if(rows[idx]) rows[idx].name=val; }
function _baiEditCode(idx,val){ var rows=window._bulkItemRows||[]; if(rows[idx]) rows[idx].code=val; }
function removeBulkItemRow(idx){
  var rows=window._bulkItemRows||[];
  rows.splice(idx,1);
  window._bulkItemRows=rows;
  _recomputeBulkItemFlags();
  renderBulkItemPreview();
}
function rePreviewBulkItems(){
  _recomputeBulkItemFlags();
  renderBulkItemPreview();
  toast('Preview refreshed');
}
function commitBulkItems(){
  var rows=window._bulkItemRows||[];
  if(!rows.length) return;
  _recomputeBulkItemFlags(); // re-validate latest in-place edits before writing to DB
  var hasErrors=rows.some(function(r){return r.codeErr;});
  if(hasErrors){ renderBulkItemPreview(); return toast('Fix the code issue(s) before adding','error'); }
  var hasFlagged=rows.some(function(r){return r.flagged;});
  if(hasFlagged){
    var cb=document.getElementById('ba-i-confirm-dup');
    if(cb && !cb.checked){ renderBulkItemPreview(); return toast('Please confirm the flagged duplicates first','error'); }
  }
  var items=DB.items();
  var cfg=DB.config();
  var schedEnabled=cfg.scheduleEnabled!==false;
  // Use max-existing-id + row offset instead of Date.now() + i: an index offset
  // alone still collides if Date.now() ever lands on/under an id that already
  // exists (e.g. an id minted from a future or clock-skewed Date.now() value, or
  // a leftover numeric id from imported/synced data). Basing the offset on the
  // highest id actually on record guarantees every row in this batch gets an id
  // that has never been used before, no matter what the clock says.
  var _batchIds=_nextUniqueIds(items, rows.length);
  rows.forEach(function(r,i){
    items.push({id:_batchIds[i],name:r.name,section:r.section,
      type:r.type,isStage:r.isStage,code:r.code,
      stageId:schedEnabled?_getStages(cfg)[0].id:null,time:'',maxTeam:r.maxTeam,
      inclIndiv:r.inclIndiv,countsToLimit:r.countsToLimit,declared:false});
  });
  DB.saveItems(items);
  window._bulkItemRows=null;
  _closeModalClean(); toast(rows.length+' items added!'); render('items');
}
function quickAddItem(name){
  const sections=DB.sections(), items=DB.items();
  items.push({id:_nextUniqueIds(items,1)[0],name,section:sections[0]||'General',type:'individual',maxParticipants:1,code:getNextAvailableItemCode(items),stage:1,time:'',declared:false});
  DB.saveItems(items); toast(name+' added!'); render('items');
}
function deleteItem(itemId){
  var item=DB.items().find(function(x){return x.id==itemId;});
  var marks=DB.marks().filter(function(m){return m.itemId==itemId&&m.total>0;});
  var participants=DB.participants().filter(function(p){return (p.items||[]).includes(itemId);});
  var groups=DB.groups().filter(function(g){return _grpHasItem(g,itemId);});
  var details='';
  if(participants.length) details+='<div style="margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> <b>'+participants.length+'</b> participant registration'+(participants.length>1?'s':'')+'</div>';
  if(groups.length) details+='<div style="margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> <b>'+groups.length+'</b> group registration'+(groups.length>1?'s':'')+'</div>';
  if(marks.length) details+='<div style="margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="M5 7 2 14a3 3 0 0 0 6 0Z"/><path d="M19 7l-3 7a3 3 0 0 0 6 0Z"/></svg> <b>'+marks.length+'</b> mark record'+(marks.length>1?'s':'')+'</div>';
  showModal('<div style="text-align:center;padding:8px">'
    +'<div style="font-size:2.5rem;margin-bottom:10px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></div>'
    +'<div style="font-size:1rem;font-weight:800;margin-bottom:4px">Delete Item?</div>'
    +(item?'<div style="font-size:.88rem;color:var(--accent);font-weight:700;margin-bottom:12px">"'+item.name+'"</div>':'')
    +(details?'<div style="background:rgba(255,71,87,.08);border:1px solid rgba(255,71,87,.3);border-radius:10px;padding:12px;text-align:left;font-size:.8rem;color:var(--text2);margin-bottom:14px">'
      +'<div style="font-weight:700;color:var(--red);margin-bottom:8px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg> The following will also be deleted:</div>'
      +details+'</div>':
      '<div style="font-size:.82rem;color:var(--text3);margin-bottom:14px">This action cannot be undone.</div>')
    +'<div style="display:flex;gap:8px">'
    +'<button class="btn btn-danger" style="flex:1" onclick="confirmDeleteItem(\''+itemId+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg> Delete</button>'
    +'<button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>'
    +'</div></div>');
}
function confirmDeleteItem(itemId){
  var items=DB.items().filter(function(x){return x.id!=itemId;});
  var marks=DB.marks().filter(function(m){return m.itemId!=itemId;});
  var groups=DB.groups().filter(function(g){return g.itemId!=itemId;});
  // Remove itemId from participants' items arrays
  var participants=DB.participants().map(function(p){
    if(!(p.items||[]).includes(itemId)) return p;
    return Object.assign({},p,{items:(p.items||[]).filter(function(id){return id!==itemId;})});
  });
  DB.saveItems(items); DB.saveMarks(marks); DB.saveGroups(groups); DB.saveParticipants(participants);
  _closeModalClean(); toast('Deleted!'); renderKeepScroll('items');
}

function renderTeams(){
  const teams=DB.teams();
  const colors=['#f0a500','#00c896','#4a9eff','#ff4757','#9b59b6','#e74c3c','#27ae60','#2980b9'];
  return `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px;flex-wrap:wrap">
    <div style="font-size:.85rem;color:var(--text2)">${teams.length} teams</div>
  </div>
  ${_orgCodeBannerHTML()}
  <div style="position:relative;margin-bottom:14px">
  <input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" style="margin-bottom:0;padding-right:36px" placeholder="Search teams..." oninput="filterTeams(this.value)" id="teamSearch">
  <button id="team-clear-btn" onclick="document.getElementById('teamSearch').value='';filterTeams('')" style="display:none;position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
  </div>
  <div id="teamsList">
  ${teams.length===0?'<div style="text-align:center;padding:30px;color:var(--text3)">No teams yet</div>':
    teams.map((t,i)=>{
      const col=colors[i%colors.length];
      const initials=(t.shortName||t.name||'?').replace(/[^A-Za-z0-9]/g,'').slice(0,2).toUpperCase()||'?';
      return `
    <div class="list-item">
      <div class="list-avatar" style="background:${col}22;color:${col};font-weight:900;font-size:.85rem;letter-spacing:-.5px">${initials}</div>
      <div class="list-info"><div class="list-title">${t.name} ${t.locked?'<span style="font-size:.65rem;padding:1px 6px;border-radius:8px;background:rgba(255,71,87,.15);color:var(--red);font-weight:800;vertical-align:middle">LOCKED</span>':''}</div><div class="list-sub">${t.shortName||''} ${t.username?'· login: '+t.username:'· no login set'}</div></div>
      <div class="list-actions">
        <button class="btn ${t.locked?'btn-success':'btn-secondary'} btn-sm btn-icon" title="${t.locked?'Unlock':'Lock'} manager" aria-label="${t.locked?'Unlock':'Lock'} manager" onclick="toggleTeamLock(${i})"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${t.locked?'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>':'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'}</svg></button>
        <button class="btn btn-secondary btn-sm btn-icon" aria-label="Edit team" onclick="showEditTeam(${i})"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>️</button>
        <button class="btn btn-danger btn-sm btn-icon" aria-label="Delete team" onclick="deleteTeam(${i})"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button>
      </div>
    </div>`;}).join('')}
  </div>`;
}
function teamFormHTML(t, idx){
  t=t||null;
  const tm=t||{};
  const teams=DB.teams();
  let sugFrom=tm.chestFrom||'', sugTo=tm.chestTo||'';
  if(!tm.chestFrom){
    const highest=teams.reduce(function(m,x){return Math.max(m, parseInt(x.chestTo)||0);},100);
    sugFrom=highest+1; sugTo=sugFrom+99;
  }
  window._ntEditIndex=(idx===undefined?null:idx);
  window._ntShortManual=!!(tm.shortName);
  return `
  <div class="form-group"><label class="form-label">Full Name</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="nt-name" value="${tm.name||''}" oninput="_ntNameInput(this.value)" placeholder="e.g. Red Bullets"></div>
  <div class="form-row">
    <div class="form-group"><label class="form-label">Short Name</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="nt-short" value="${tm.shortName||''}" oninput="_ntShortManual=true" placeholder="e.g. RB"></div>
    <div class="form-group"><label class="form-label">Team Code</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="nt-code" value="${tm.code||''}" placeholder="e.g. T01"></div>
  </div>
  <div style="border-top:1px solid var(--border);margin:14px 0 10px;padding-top:12px;font-size:.78rem;font-weight:800;color:var(--text2)">Chest Number Range</div>
  <div class="form-row">
    <div class="form-group"><label class="form-label">From</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="nt-chestFrom" type="number" value="${sugFrom}" oninput="_ntCheckRangeLive()" placeholder="e.g. 101"></div>
    <div class="form-group"><label class="form-label">To</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="nt-chestTo" type="number" value="${sugTo}" oninput="_ntCheckRangeLive()" placeholder="e.g. 200"></div>
  </div>
  <div id="nt-chestRangeWarn" style="font-size:.72rem;color:var(--red);margin:-6px 0 8px;display:none"></div>
  <div style="border-top:1px solid var(--border);margin:14px 0 10px;padding-top:12px;font-size:.78rem;font-weight:800;color:var(--text2)">Team Manager Login</div>
  <div class="form-row">
    <div class="form-group"><label class="form-label">Username <span style="color:var(--red)">*</span></label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="nt-user" value="${tm.username||''}" placeholder="e.g. shems" required></div>
    <div class="form-group"><label class="form-label">Password ${t?'':'<span style="color:var(--red)">*</span>'}</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="nt-pass" value="" placeholder="${t?'Leave blank to keep current password':'Set a password'}" ${t?'':'required'}></div>
  </div>
  ${t?'<div style="font-size:.7rem;color:var(--text3);margin:-6px 0 10px">For security, the current password is never shown here \u2014 only type a new one if you want to change it.</div>':''}
  <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer">
    <input type="checkbox" id="nt-locked" ${tm.locked?'checked':''} style="width:16px;height:16px;accent-color:var(--accent)">
    <span style="font-size:.82rem">Lock this Team Manager (prevents login)</span>
  </label>`;
}
// Auto-generates a Short Name from the Team Name's word-initials (e.g. "Red Bullets" -> "RB").
// If that clashes with another team's short name, extends it letter-by-letter (or, for a
// single-word name, grows the prefix) until it's unique; falls back to a numeric suffix.
function _autoShortName(teamName, excludeIdx){
  var words=(teamName||'').trim().split(/\s+/).filter(Boolean);
  if(!words.length) return '';
  var teams=DB.teams();
  function taken(s){ return !!s && teams.some(function(t,i){return i!==excludeIdx && (t.shortName||'').toUpperCase()===s.toUpperCase();}); }
  function initials(){ return words.map(function(w){return w[0];}).join('').toUpperCase(); }
  var candidate=initials();
  if(!taken(candidate)) return candidate;
  if(words.length>1){
    var first=words[0];
    for(var len=2; len<=first.length; len++){
      candidate=(first[0]+first.slice(1,len)+words.slice(1).map(function(w){return w[0];}).join('')).toUpperCase();
      if(!taken(candidate)) return candidate;
    }
  } else {
    for(var l=2;l<=words[0].length;l++){
      candidate=words[0].slice(0,l).toUpperCase();
      if(!taken(candidate)) return candidate;
    }
  }
  var base=initials(), n=2;
  while(taken(base+n)) n++;
  return base+n;
}
function _ntNameInput(name){
  if(window._ntShortManual) return;
  var el=document.getElementById('nt-short');
  if(el) el.value=_autoShortName(name, window._ntEditIndex);
}
function _ntCheckRangeLive(){
  var warnEl=document.getElementById('nt-chestRangeWarn');
  if(!warnEl) return;
  var from=v('nt-chestFrom').trim(), to=v('nt-chestTo').trim();
  var err=_validateChestRange(from, to, window._ntEditIndex===null?undefined:window._ntEditIndex);
  warnEl.textContent=err||'';
  warnEl.style.display=err?'block':'none';
}
// Validates a From/To chest range: well-formed, and (optionally) not overlapping another team's range.
// excludeIdx lets edits ignore the team's own existing range when checking for overlaps.
function _validateChestRange(from, to, excludeIdx){
  from=parseInt(from); to=parseInt(to);
  if(!from || !to || isNaN(from) || isNaN(to)) return 'Enter a valid chest number range';
  if(from>to) return '"From" must not be greater than "To"';
  var teams=DB.teams();
  for(var i=0;i<teams.length;i++){
    if(i===excludeIdx) continue;
    var t=teams[i]; if(!t.chestFrom||!t.chestTo) continue;
    if(from<=parseInt(t.chestTo) && to>=parseInt(t.chestFrom)){
      return 'That range overlaps with '+t.name+'\u2019s range ('+t.chestFrom+'\u2013'+t.chestTo+')';
    }
  }
  return null;
}
function showAddTeam(){ showModal(`<div class="modal-handle"></div><div class="modal-title">Add Group</div>${teamFormHTML()}<button class="btn btn-primary" onclick="addTeam()">Add Group</button>`,
  { saveCallback: addTeam }
); }
function showEditTeam(i){ const t=DB.teams()[i];
showModal(`<div class="modal-handle"></div><div class="modal-title">Edit Team</div>${teamFormHTML(t,i)}<button class="btn btn-primary" onclick="updateTeam(${i})">Save Changes</button><button class="btn btn-secondary mt-10" onclick="closeModal()">Cancel</button>`,
  { saveCallback: function(){ updateTeam(i); } }
); }
function addTeam(){
  const name=applyTextCase(v('nt-name').trim()); if(!name) return toast('Enter team name','error');
  const teams=DB.teams();
  const username=v('nt-user').trim();
  const password=v('nt-pass').trim();
  if(!username) return toast('Username is required','error');
  if(!password) return toast('Password is required','error');
  if(teams.some(function(t){return (t.username||'')===username;})) return toast('That username is already taken','error');
  const chestFrom=v('nt-chestFrom').trim(), chestTo=v('nt-chestTo').trim();
  const rangeErr=_validateChestRange(chestFrom, chestTo);
  if(rangeErr) return toast(rangeErr,'error');
  teams.push({id:_nextUniqueIds(teams,1)[0],name,shortName:v('nt-short').trim(),code:v('nt-code').trim()||'T'+String(teams.length+1).padStart(2,'0'),
    chestFrom:parseInt(chestFrom), chestTo:parseInt(chestTo),
    username:username, password:password, locked:!!document.getElementById('nt-locked').checked});
  DB.saveTeams(teams); _closeModalClean(); toast('Team added!'); render('teams');
}
function updateTeam(i){
  const teams=DB.teams();
  const oldName=teams[i].name;
  const newName=applyTextCase(v('nt-name').trim());
  const username=v('nt-user').trim();
  const password=v('nt-pass').trim();
  if(!username) return toast('Username is required','error');
  if(teams.some(function(t,idx){return idx!==i && (t.username||'')===username;})) return toast('That username is already taken','error');
  const chestFrom=v('nt-chestFrom').trim(), chestTo=v('nt-chestTo').trim();
  const rangeErr=_validateChestRange(chestFrom, chestTo, i);
  if(rangeErr) return toast(rangeErr,'error');
  teams[i]={...teams[i],name:newName,shortName:v('nt-short').trim(),code:v('nt-code').trim(),
    chestFrom:parseInt(chestFrom), chestTo:parseInt(chestTo),
    username:username, locked:!!document.getElementById('nt-locked').checked};
  if(password) teams[i].password=password; // only touch the password if a new one was actually typed
  DB.saveTeams(teams);
  // Cascade rename to participants and groups
  if(oldName&&newName&&oldName!==newName){
    var participants=DB.participants().map(function(p){return p.team===oldName?Object.assign({},p,{team:newName}):p;});
    var groups=DB.groups().map(function(g){return g.team===oldName?Object.assign({},g,{team:newName}):g;});
    DB.saveParticipants(participants); DB.saveGroups(groups);
  }
  _closeModalClean(); toast('Team updated!'); renderKeepScroll('teams');
}
function deleteTeam(i){
  var teams=DB.teams(), team=teams[i];
  var participants=DB.participants(), groups=DB.groups(), marks=DB.marks();
  var affParts=participants.filter(function(p){return p.team===team.name;});
  var affGroups=groups.filter(function(g){return g.team===team.name;});
  var affPartChests=affParts.map(function(p){return p.chestNo;});
  var affGrpChests=affGroups.map(function(g){return g.groupChestNo;});
  var allChests=affPartChests.concat(affGrpChests);
  var affMarks=marks.filter(function(m){return allChests.includes(m.chestNo);});
  var details='';
  if(affParts.length) details+='<div style="margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> <b>'+affParts.length+'</b> participant'+(affParts.length>1?'s':'')+(affParts.length<=3?' ('+affParts.map(function(p){return p.name;}).join(', ')+')':'')+'</div>';
  if(affGroups.length) details+='<div style="margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> <b>'+affGroups.length+'</b> group registration'+(affGroups.length>1?'s':'')+'</div>';
  if(affMarks.length) details+='<div style="margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="M5 7 2 14a3 3 0 0 0 6 0Z"/><path d="M19 7l-3 7a3 3 0 0 0 6 0Z"/></svg> <b>'+affMarks.length+'</b> mark record'+(affMarks.length>1?'s':'')+'</div>';
  showModal('<div style="text-align:center;padding:8px">'
    +'<div style="font-size:2.5rem;margin-bottom:10px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></div>'
    +'<div style="font-size:1rem;font-weight:800;margin-bottom:4px">Delete Team?</div>'
    +'<div style="font-size:.88rem;color:var(--accent);font-weight:700;margin-bottom:12px">"'+team.name+'"</div>'
    +(details?'<div style="background:rgba(255,71,87,.08);border:1px solid rgba(255,71,87,.3);border-radius:10px;padding:12px;text-align:left;font-size:.8rem;color:var(--text2);margin-bottom:14px">'
      +'<div style="font-weight:700;color:var(--red);margin-bottom:8px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg> The following will also be deleted:</div>'
      +details+'</div>':
      '<div style="font-size:.82rem;color:var(--text3);margin-bottom:14px">No linked data found.</div>')
    +'<div style="display:flex;gap:8px">'
    +'<button class="btn btn-danger" style="flex:1" onclick="confirmDeleteTeam('+i+')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg> Delete All</button>'
    +'<button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>'
    +'</div></div>');
}
function confirmDeleteTeam(i){
  var teams=DB.teams(), team=teams[i];
  var participants=DB.participants(), groups=DB.groups(), marks=DB.marks();
  var affParts=participants.filter(function(p){return p.team===team.name;});
  var affGroups=groups.filter(function(g){return g.team===team.name;});
  var affChests=affParts.map(function(p){return p.chestNo;}).concat(affGroups.map(function(g){return g.groupChestNo;}));
  teams.splice(i,1);
  DB.saveTeams(teams);
  DB.saveParticipants(participants.filter(function(p){return p.team!==team.name;}));
  DB.saveGroups(groups.filter(function(g){return g.team!==team.name;}));
  DB.saveMarks(marks.filter(function(m){return !affChests.includes(m.chestNo);}));
  _closeModalClean(); toast('Team & all linked data deleted'); renderKeepScroll('teams');
}
function exportParticipantsPDF(){
  if(!window.jspdf || !window.jspdf.jsPDF){ toast('PDF library not available','error'); return; }
  var team=currentTeamName()||'All Teams';
  var participants=DB.participants().filter(function(p){ return !isTeam() || p.team===team; });
  var { jsPDF } = window.jspdf;
  var doc=new jsPDF({unit:'pt', format:'a4'});
  var pageW=doc.internal.pageSize.getWidth(), margin=40, y=50;
  doc.setFontSize(16); doc.setFont(undefined,'bold');
  doc.text((DB.config().festName||'Winzera')+' — Participants', margin, y); y+=18;
  doc.setFontSize(10); doc.setFont(undefined,'normal');
  doc.text(team, margin, y); y+=20;
  doc.setFontSize(9); doc.setFont(undefined,'bold');
  doc.text('Chest#', margin, y); doc.text('Name', margin+55, y); doc.text('Section', margin+230, y); doc.text('Items', margin+310, y);
  y+=6; doc.setLineWidth(0.5); doc.line(margin, y, pageW-margin, y); y+=14;
  doc.setFont(undefined,'normal');
  var items=DB.items(); var itemMap={}; items.forEach(function(it){ itemMap[it.id]=it.name; });
  participants.sort(function(a,b){ return (parseInt(a.chestNo)||0)-(parseInt(b.chestNo)||0); });
  participants.forEach(function(p){
    if(y>780){ doc.addPage(); y=50; }
    var itemNames=(p.items||[]).map(function(id){return itemMap[id]||'';}).filter(Boolean).join(', ');
    doc.text(String(p.chestNo||''), margin, y);
    doc.text(String(p.name||'').slice(0,32), margin+55, y);
    doc.text(String(p.section||''), margin+230, y);
    var wrapped=doc.splitTextToSize(itemNames, pageW-margin-(margin+310));
    doc.text(wrapped, margin+310, y);
    y+=Math.max(14, wrapped.length*11);
  });
  doc.save((team.replace(/[^A-Za-z0-9]+/g,'_'))+'_participants.pdf');
  toast('PDF downloaded');
}


// =============================================
// PUBLIC VIEWER BROADCAST (Admin → Public Display, live results)
// Same WebRTC/QR handshake pattern as the Wi-Fi P2P sync above, except the
// data channel is kept open afterwards: the Admin pushes a "public-broadcast"
// payload the moment a Public Display connects, then a "public-update" every
// time an item is declared/un-declared, so an offline projector auto-refreshes
// without any manual re-sync. Several Public Displays can connect at once.
// =============================================
// Clamp a numeric field to a non-negative integer, defaulting on invalid
// input. 0 is always a valid, meaningful value here — every broadcast
// interval/count treats 0 as "never show that poster type".
function _bcNum(raw, def){
  var n=parseInt(raw,10);
  return isNaN(n) ? def : Math.max(0, n);
}
// Admin-configurable broadcast behavior, stored on DB.config().broadcast and
// edited via the "Broadcast Management" modal. Falls back to sensible
// defaults if never configured.
function _pubBroadcastSettings(){
  var cfg=DB.config();
  var d={
    recentCount:5,
    fullscreenDuration:8,
    slideshowInterval:3,
    listChartInterval:5,
    championshipRotateInterval:6,
    notificationRotateInterval:4,
    standingsAfter:1,
    championAfter:1,
    showChampionStage:true, showChampionOffStage:true, showChampionOverall:true,
    showMessage:false,
    messages:[],
    pushedMessageId:null,
    pushedAt:0
  };
  return Object.assign({}, d, cfg.broadcast||{});
}
function _savePubBroadcastSettings(patch){
  var cfg=DB.config();
  cfg.broadcast=Object.assign({}, _pubBroadcastSettings(), patch);
  DB.saveConfig(cfg);
  return cfg.broadcast;
}
// On-Stage / Off-Stage / Overall Champions: the individual participant with
// the highest points across declared INDIVIDUAL items only (groups and
// items excluded from the Individual Championship are ignored). "overall"
// sums stage + off-stage together, so it is the actual Overall Individual
// Champion — not the top team. Reuses calcIndvPoints so this always agrees
// with the Individual Points page's own "Overall" ranking.
function _computeChampions(){
  var cfg=DB.config();
  var declaredItems=DB.items().filter(function(i){return i.declared;});
  var marks=DB.marks(), participants=DB.participants();
  var rows=participants.map(function(p){
    var r=calcIndvPoints(p,declaredItems,marks,cfg);
    return {name:p.name, team:p.team, section:p.section, total:r.total, stage:r.stage, offStage:r.offStage};
  });
  // Ranks every participant with points>0 in this category, highest first —
  // the exact same sort the Individual Points page already uses — and returns
  // both the #1 (kept as name/team/total for existing callers) and the full
  // ranked "list" so the broadcast can show the whole championship standings,
  // not just the single winner.
  function topBy(key){
    var ranked=rows.filter(function(r){return r[key]>0;})
      .sort(function(a,b){return b[key]-a[key];})
      .map(function(r){return {name:r.name, team:r.team, section:r.section, total:r[key]};});
    if(!ranked.length) return null;
    return {name:ranked[0].name, team:ranked[0].team, total:ranked[0].total, list:ranked};
  }
  return {stage:topBy('stage'), offstage:topBy('offStage'), overall:topBy('total')};
}
// Builds the live results snapshot sent to Public Display devices — reuses
// the same team-points and winners-feed calculations as the Points/Winner
// List pages. "posters" holds the most recently declared items (podium-style,
// newest first); "fest" carries festival branding (name/logo/date/venue/
// institution) so every broadcast poster can show a consistent header/footer.
function _buildPublicPayload(kind){
  var cfg=DB.config();
  var settings=_pubBroadcastSettings();
  var tp=calcTeamPoints();
  var standings=DB.teams().map(function(t){
    var row=tp[t.name]||{total:0,r1:0,r2:0,r3:0};
    return {name:t.name,total:row.total||0,r1:row.r1||0,r2:row.r2||0,r3:row.r3||0};
  }).sort(function(a,b){return b.total-a.total;});
  var wd=_wlBuildData('All','all');
  var groups=(wd.groups||[]).slice().sort(function(a,b){
    return (b.item.declaredAt||0)-(a.item.declaredAt||0);
  });
  // Result ordinal — same numbering used when sharing an individual result
  // poster: which declared result this is in actual declare order. Sorted by
  // declaredAt (the real order items were declared in), NOT by each item's
  // position in the master items list — those two orders very often differ
  // in practice (items are rarely declared in the same order they're listed),
  // and sorting by list position was producing wrong/inconsistent "Result N"
  // numbers on the broadcast poster and shared result images.
  var declaredItemsOrdered=DB.items().filter(function(i){return i.declared;})
    .sort(function(a,b){return (a.declaredAt||0)-(b.declaredAt||0);});
  function ordinalFor(itemId){
    var idx=declaredItemsOrdered.findIndex(function(i){return i.id==itemId;});
    return idx>=0 ? idx+1 : null;
  }
  var recentCount=_bcNum(settings.recentCount,5);
  var posters=groups.slice(0,recentCount).map(function(g,idx){
    return {item:g.item.name, section:g.item.section, isNew: idx<5, itemType:g.item.type, resultNumber:ordinalFor(g.item.id), rows:g.rows};
  });
  var champs=_computeChampions();
  var viz=Object.assign({festName:true,logo:true,date:true,venue:true,tagline:true}, cfg.posterViz||{});
  var fest={
    festName: cfg.festName||'Winzera',
    logo: cfg.logo||null,
    tagline: cfg.tagline||'',
    date: formatFestDate(cfg)||'',
    venue: cfg.venue||'',
    institution: cfg.institution||'',
    viz: viz,
    badgeStyle: cfg.posterBadgeStyle||'ribbon'
  };
  // Notifications pool, newest-first — the Notifications card rotates through
  // all of these, and a "push" (bumping pushedAt) is what tells a connected
  // Public Display to interrupt with a full-screen highlight (see
  // _pvDetectChanges), independent of just editing/reordering the pool.
  var notifications=(settings.messages||[]).slice()
    .sort(function(a,b){return (b.createdAt||0)-(a.createdAt||0);})
    .map(function(m){return {id:m.id, text:m.text, ts:m.createdAt};});
  return {v:1, kind:kind||'public-update', ts:Date.now(), fest:fest, standings:standings, posters:posters, totalDeclared:declaredItemsOrdered.length, championStage:champs.stage, championOffStage:champs.offstage, championOverall:champs.overall, notifications:notifications, pushedMessageId:settings.pushedMessageId||null, pushedAt:settings.pushedAt||0, settings:settings};
}
// Pushes a fresh live-results snapshot to Supabase for any active broadcast
// link this org has — every connected viewer (index.html opened in
// ?view=broadcast mode) picks it up instantly via realtime. Called on
// declare/un-declare/message-push — safe no-op if no link is active yet.
function broadcastPublicUpdate(){
  if(!window.WinzeraSync || !window.WinzeraSync.getOrgId()) return;
  var payload=_buildPublicPayload('public-update');
  window.WinzeraSync.pushBroadcastPayload(payload).catch(function(e){
    console.error('Winzera broadcast push failed:', e);
  });
}
function openBroadcastPointsModal(){
  if(!isAdmin()) return;
  var s=_pubBroadcastSettings();
  var messages=(s.messages||[]).slice().sort(function(a,b){return (b.createdAt||0)-(a.createdAt||0);});
  var editingId=window._bcEditingMsgId||null;
  var messagesHtml=messages.length ? messages.map(function(m){
    var isPushed=s.pushedMessageId===m.id;
    var isEditing=editingId===m.id;
    if(isEditing){
      return '<div class="list-item" style="align-items:flex-start">'
        +'<div style="flex:1;display:flex;flex-direction:column;gap:6px">'
          +'<textarea class="form-input" id="bc-editMsg-'+m.id+'" rows="2">'+m.text.replace(/</g,'&lt;')+'</textarea>'
          +'<div style="display:flex;gap:8px">'
            +'<button class="btn btn-primary btn-sm" style="flex:1" onclick="_bcEditMessageSave(\''+m.id+'\')">Save</button>'
            +'<button class="btn btn-secondary btn-sm" style="flex:1" onclick="window._bcEditingMsgId=null;openBroadcastPointsModal()">Cancel</button>'
          +'</div>'
        +'</div></div>';
    }
    return '<div class="list-item">'
      +'<div class="list-info" style="min-width:0"><div class="list-title" style="white-space:normal;word-break:break-word">'+m.text.replace(/</g,'&lt;')+'</div>'+(isPushed?'<div class="list-sub" style="color:var(--green)">Live now</div>':'')+'</div>'
      +'<div class="list-actions" style="flex-shrink:0">'
        +'<button class="btn btn-secondary btn-sm btn-icon" aria-label="Push message" title="Push live" onclick="_bcPushMessage(\''+m.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4Z"/></svg></button>'
        +'<button class="btn btn-secondary btn-sm btn-icon" aria-label="Edit message" onclick="window._bcEditingMsgId=\''+m.id+'\';openBroadcastPointsModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>'
        +'<button class="btn btn-danger btn-sm btn-icon" aria-label="Delete message" onclick="_bcDeleteMessage(\''+m.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>'
      +'</div></div>';
  }).join('') : '<div style="color:var(--text3);text-align:center;padding:10px;font-size:.8rem">No messages yet</div>';
  showModal('<div class="modal-handle"></div>'
    +'<div class="modal-title">Broadcast Management</div>'
    +'<div id="bc-linkSection" style="margin-bottom:16px">'+_bcLinkSectionLoadingHtml()+'</div>'
    +'<button class="btn btn-secondary" style="width:100%;margin-bottom:16px;display:flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,rgba(155,89,182,.16),rgba(74,158,255,.16));border:1px solid rgba(155,89,182,.4);color:var(--text)" onclick="previewBroadcast()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/></svg> Preview Broadcast Display</button>'
    +'<div style="font-size:.68rem;color:var(--text3);margin:-10px 0 14px;text-align:center">See exactly how the broadcast will look, full-screen, before sharing the link.</div>'
    +'<div style="font-size:.8rem;font-weight:800;color:var(--text);margin-bottom:8px;border-top:1px solid var(--border);padding-top:12px">Dashboard cards</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
      +'<div class="form-group" style="margin-bottom:0"><label class="form-label" style="font-size:.66rem">Recent results (count)</label><input class="form-input" id="bc-recentCount" type="number" min="0" max="30" value="'+s.recentCount+'"></div>'
      +'<div class="form-group" style="margin-bottom:0"><label class="form-label" style="font-size:.66rem">Slideshow interval (s)</label><input class="form-input" id="bc-slideshowInterval" type="number" min="1" max="30" value="'+s.slideshowInterval+'"></div>'
      +'<div class="form-group" style="margin-bottom:0"><label class="form-label" style="font-size:.66rem">List/chart switch (s)</label><input class="form-input" id="bc-listChartInterval" type="number" min="1" max="30" value="'+s.listChartInterval+'"></div>'
      +'<div class="form-group" style="margin-bottom:0"><label class="form-label" style="font-size:.66rem">Championship rotate (s)</label><input class="form-input" id="bc-championshipRotateInterval" type="number" min="1" max="30" value="'+s.championshipRotateInterval+'"></div>'
      +'<div class="form-group" style="margin-bottom:0"><label class="form-label" style="font-size:.66rem">Notification rotate (s)</label><input class="form-input" id="bc-notificationRotateInterval" type="number" min="1" max="30" value="'+s.notificationRotateInterval+'"></div>'
      +'<div class="form-group" style="margin-bottom:0"><label class="form-label" style="font-size:.66rem">Full-screen duration (s)</label><input class="form-input" id="bc-fullscreenDuration" type="number" min="3" max="60" value="'+s.fullscreenDuration+'"></div>'
      +'<div class="form-group" style="margin-bottom:0"><label class="form-label" style="font-size:.66rem">Show teams standing after</label><input class="form-input" id="bc-standingsAfter" type="number" min="0" max="20" value="'+s.standingsAfter+'"></div>'
      +'<div class="form-group" style="margin-bottom:0"><label class="form-label" style="font-size:.66rem">Individual champion after</label><input class="form-input" id="bc-championAfter" type="number" min="0" max="50" value="'+s.championAfter+'"></div>'
    +'</div>'
    +'<div style="font-size:.68rem;color:var(--text3);margin:6px 0 14px">Full-screen duration is how long a live-change highlight takes over the whole screen before returning to the dashboard.</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 16px">'
      +'<label style="display:flex;align-items:center;justify-content:space-between;gap:8px;cursor:pointer">'
        +'<span class="form-label" style="margin:0;font-size:.78rem">On-Stage Champ</span>'
        +'<span class="toggle-switch"><input type="checkbox" id="bc-showChampionStage" '+(s.showChampionStage!==false?'checked':'')+'><span class="toggle-slider"></span></span>'
      +'</label>'
      +'<label style="display:flex;align-items:center;justify-content:space-between;gap:8px;cursor:pointer">'
        +'<span class="form-label" style="margin:0;font-size:.78rem">Off-Stage Champ</span>'
        +'<span class="toggle-switch"><input type="checkbox" id="bc-showChampionOffStage" '+(s.showChampionOffStage!==false?'checked':'')+'><span class="toggle-slider"></span></span>'
      +'</label>'
      +'<label style="display:flex;align-items:center;justify-content:space-between;gap:8px;cursor:pointer">'
        +'<span class="form-label" style="margin:0;font-size:.78rem">Overall Champ</span>'
        +'<span class="toggle-switch"><input type="checkbox" id="bc-showChampionOverall" '+(s.showChampionOverall!==false?'checked':'')+'><span class="toggle-slider"></span></span>'
      +'</label>'
      +'<label style="display:flex;align-items:center;justify-content:space-between;gap:8px;cursor:pointer">'
        +'<span class="form-label" style="margin:0;font-size:.78rem">Show Message</span>'
        +'<span class="toggle-switch"><input type="checkbox" id="bc-showMessage" '+(s.showMessage?'checked':'')+' onchange="_bcToggleMessageField()"><span class="toggle-slider"></span></span>'
      +'</label>'
    +'</div>'
    +'<div id="bc-messageWrap" style="margin-top:14px;'+(s.showMessage?'':'display:none')+'">'
      +'<label class="form-label">Broadcast messages</label>'
      +'<div id="bc-messagesList" style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px">'+messagesHtml+'</div>'
      +'<div style="display:flex;gap:8px;align-items:stretch">'
        +'<textarea class="form-input" id="bc-newMessage" rows="3" placeholder="e.g. Lunch break 1:00 \u2013 2:00 PM" style="flex:1;min-height:84px;resize:vertical"></textarea>'
        +'<button class="btn btn-secondary btn-icon" style="flex-shrink:0;width:40px;align-self:flex-end" aria-label="Add message" title="Add" onclick="_bcAddMessage()"><svg viewBox="0 0 24 24" style="width:1.2em;height:1.2em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>'
      +'</div>'
    +'</div>'
    +'<div style="display:flex;gap:10px;margin-top:14px;align-items:stretch">'
      +'<button class="btn btn-primary" style="flex:1" onclick="_bcSaveSettings()">Save &amp; Apply</button>'
      +'<button class="btn btn-secondary btn-icon" style="flex-shrink:0;width:44px" aria-label="Close" onclick="window._bcEditingMsgId=null;closeModal()">\u2715</button>'
    +'</div>', {noDirtyGuard:true});
  _bcRefreshLinkSection();
}
function _bcLinkSectionLoadingHtml(){
  return '<div style="text-align:center;color:var(--text3);font-size:.8rem;padding:10px">Loading link\u2026</div>';
}
async function _bcRefreshLinkSection(){
  var el=document.getElementById('bc-linkSection');
  if(!el || !window.WinzeraSync || !window.WinzeraSync.getOrgId()){
    if(el) el.innerHTML='<div style="text-align:center;color:var(--red);font-size:.8rem;padding:10px">Broadcast needs an online admin session.</div>';
    return;
  }
  try{
    var status=await window.WinzeraSync.getBroadcastStatus();
    if(status && status.enabled){
      el.innerHTML='<div style="padding:10px 12px;border-radius:10px;background:rgba(0,200,120,.08);border:1px solid rgba(0,200,120,.3)">'
        +'<div style="font-size:.72rem;color:var(--green);font-weight:700;margin-bottom:6px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 10v6M4.2 4.2l4.2 4.2m7.2 7.2 4.2 4.2M1 12h6m10 0h6M4.2 19.8l4.2-4.2m7.2-7.2 4.2-4.2"/></svg> Broadcast is LIVE \u2014 anyone with this link sees live results</div>'
        +'<div style="display:flex;gap:6px;align-items:center">'
          +'<input readonly class="form-input" style="margin-bottom:0;font-size:.7rem;flex:1" value="'+status.link+'" onclick="this.select()">'
          +'<button class="btn btn-secondary btn-sm" onclick="_bcCopyLink(\''+status.link+'\')">Copy</button>'
        +'</div>'
        +'<div style="font-size:.66rem;color:var(--text3);margin-top:6px">This link is fixed \u2014 it stays the same every time you start broadcasting, so you only need to share it once.</div>'
        +'<button class="btn btn-danger btn-sm" style="width:100%;margin-top:8px" onclick="_bcDeactivateLink()">Stop Broadcasting</button>'
      +'</div>';
    }else{
      el.innerHTML='<button class="btn btn-primary" style="width:100%" onclick="_bcGenerateLink()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Start Broadcasting \u2014 Get Link</button>'
        +(status&&status.link?'<div style="font-size:.66rem;color:var(--text3);margin-top:6px;text-align:center">Your link (starts working once you tap above): '+status.link+'</div>':'');
    }
  }catch(e){
    console.error('Broadcast status load failed:', e);
    el.innerHTML='<div style="text-align:center;color:var(--red);font-size:.8rem;padding:10px">Could not load broadcast status: '+(e.message||'unknown error')+'</div>';
  }
}
async function _bcGenerateLink(){
  try{
    await window.WinzeraSync.startBroadcasting();
    broadcastPublicUpdate(); // seed the payload immediately so the link isn't blank on first open
    toast('Broadcast started!');
    await _bcRefreshLinkSection();
  }catch(e){
    console.error('Start broadcasting failed:', e);
    toast('Could not start broadcasting. Check your connection.','error');
  }
}
async function _bcDeactivateLink(){
  try{
    await window.WinzeraSync.stopBroadcasting();
    toast('Broadcast stopped');
    await _bcRefreshLinkSection();
  }catch(e){
    console.error('Stop broadcasting failed:', e);
    toast('Could not stop broadcasting. Check your connection.','error');
  }
}
function _bcCopyLink(link){
  var done=function(){ toast('Link copied!'); };
  if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(link).then(done).catch(done); }
  else{
    var ta=document.createElement('textarea'); ta.value=link; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); }catch(e){}
    document.body.removeChild(ta); done();
  }
}
function _bcToggleMessageField(){
  var el=document.getElementById('bc-showMessage'); if(!el) return;
  var w=document.getElementById('bc-messageWrap'); if(w) w.style.display=el.checked?'':'none';
}
// ---- Broadcast message CRUD (pool of admin messages for the Notifications
// card + "Push" to trigger an immediate full-screen highlight) ----
function _bcNewMsgId(){ return 'm'+Date.now()+Math.floor(Math.random()*1000); }
function _bcAddMessage(){
  var ta=document.getElementById('bc-newMessage'); if(!ta) return;
  var text=(ta.value||'').trim();
  if(!text){ toast('Enter a message first','error'); return; }
  var s=_pubBroadcastSettings();
  var messages=(s.messages||[]).slice();
  messages.push({id:_bcNewMsgId(), text:text, createdAt:Date.now()});
  _savePubBroadcastSettings({messages:messages, showMessage:true});
  openBroadcastPointsModal();
}
function _bcDeleteMessage(id){
  var s=_pubBroadcastSettings();
  var messages=(s.messages||[]).filter(function(m){return m.id!==id;});
  var patch={messages:messages};
  if(s.pushedMessageId===id) patch.pushedMessageId=null;
  _savePubBroadcastSettings(patch);
  broadcastPublicUpdate();
  openBroadcastPointsModal();
}
function _bcEditMessageSave(id){
  var input=document.getElementById('bc-editMsg-'+id); if(!input) return;
  var text=(input.value||'').trim();
  if(!text){ toast('Message cannot be empty','error'); return; }
  var s=_pubBroadcastSettings();
  var messages=(s.messages||[]).map(function(m){ return m.id===id ? Object.assign({},m,{text:text}) : m; });
  _savePubBroadcastSettings({messages:messages});
  window._bcEditingMsgId=null;
  broadcastPublicUpdate();
  openBroadcastPointsModal();
}
// "Push" sends this message live immediately: bumps pushedAt so every
// connected Public Display detects the change and queues a full-screen
// Notifications highlight (see _pvDetectChanges), independent of the
// "Save & Apply" button below (which only persists cadence/toggle settings).
function _bcPushMessage(id){
  _savePubBroadcastSettings({pushedMessageId:id, pushedAt:Date.now(), showMessage:true});
  broadcastPublicUpdate();
  toast('Message pushed live');
  openBroadcastPointsModal();
}
function _bcSaveSettings(){
  var patch={
    recentCount: _bcNum(document.getElementById('bc-recentCount').value,5),
    fullscreenDuration: Math.max(3,_bcNum(document.getElementById('bc-fullscreenDuration').value,8)),
    slideshowInterval: Math.max(1,_bcNum(document.getElementById('bc-slideshowInterval').value,3)),
    listChartInterval: Math.max(1,_bcNum(document.getElementById('bc-listChartInterval').value,5)),
    championshipRotateInterval: Math.max(1,_bcNum(document.getElementById('bc-championshipRotateInterval').value,6)),
    notificationRotateInterval: Math.max(1,_bcNum(document.getElementById('bc-notificationRotateInterval').value,4)),
    standingsAfter: _bcNum(document.getElementById('bc-standingsAfter').value,1),
    championAfter: _bcNum(document.getElementById('bc-championAfter').value,1),
    showChampionStage: !!document.getElementById('bc-showChampionStage').checked,
    showChampionOffStage: !!document.getElementById('bc-showChampionOffStage').checked,
    showChampionOverall: !!document.getElementById('bc-showChampionOverall').checked,
    showMessage: !!document.getElementById('bc-showMessage').checked
  };
  _savePubBroadcastSettings(patch);
  broadcastPublicUpdate();
  toast('Broadcast settings saved & applied');
  window._bcEditingMsgId=null;
  closeModal();
}
function _teardownPublicView(){
  _pvClearDashTimers();
  _pvClearFsTimers();
  if(window._pvFsEndTimer){ clearTimeout(window._pvFsEndTimer); window._pvFsEndTimer=null; }
  window._pubViewData=null;
  window._pvPrevPayload=null;
  window._pvQueue=[];
  window._pvBusy=false;
  window._pvDashState={};
  window._pvSettings=null;
  window._pvFest=null;
}
function _routeToPublicView(){
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('publicViewScreen').style.display='flex';
  _pvSetState('waiting');
}
// Lets the Display side ask for an immediate fresh snapshot instead of
// waiting for the next live update. Link-mode re-fetches from Supabase
// directly — there's no "reconnect" concept needed now that this is the
// only viewer path (the old WebRTC pairing this replaced needed one).
function _pvRequestRefresh(btn){
  if(window._pvOrgSlug){
    window.WinzeraSync.fetchBroadcastPayload(window._pvOrgSlug).then(function(res){
      if(res.status==='ok'){ window._pvOrgId=res.orgId; window._pubViewData=res.payload; _pvSetState('live'); _pvRender(); }
      else if(res.status==='ended'||res.status==='not_found'){ _pvSetState('ended'); }
    }).catch(function(e){ toast('Could not refresh: '+(e.message||'check your connection'),'error'); });
  }else{
    toast('Not connected — reopen the broadcast link to refresh','error'); return;
  }
  if(btn){
    btn.style.transform='rotate(360deg)';
    btn.style.transition='transform .5s ease';
    setTimeout(function(){ btn.style.transform=''; }, 500);
  }
}
// ---- Link-based viewer boot (replaces the old WebRTC/QR pairing) ----
// Reached via index.html?view=broadcast&org=<short-code> — no login, no app
// shell, straight to the same full-screen viewer the old WebRTC display
// used, just fed from Supabase instead of a peer connection. The org's own
// short code is the link's permanent identity, so it never changes even
// when broadcasting is stopped and restarted later.
async function _bootBroadcastViewer(orgSlug){
  window._pvMode='link';
  window._pvOrgSlug=orgSlug;
  _routeToPublicView();
  if(!window.WinzeraSync){ _pvSetState('ended'); return; }
  try{
    var res=await window.WinzeraSync.fetchBroadcastPayload(orgSlug);
    if(res.status==='ok'){
      window._pvOrgId=res.orgId;
      if(res.payload){ window._pubViewData=res.payload; _pvSetState('live'); _pvRender(); }
      else{ _pvSetState('waiting'); } // broadcasting is on but admin hasn't pushed a snapshot yet
      window.WinzeraSync.subscribeBroadcastPayload(res.orgId, function(status, payload){
        if(status==='ended'){ _pvSetState('ended'); return; }
        window._pubViewData=payload;
        _pvSetState('live');
        _pvRender();
      });
    }else{
      _pvSetState('ended');
    }
  }catch(e){
    console.error('Broadcast viewer initial load failed:', e);
    _pvSetState('ended');
  }
}
// ---- Admin "Preview Broadcast Display" — renders the exact same public
// viewer screen/CSS/animations using the admin's own current data, entirely
// locally (no WebRTC, no device involved), so the admin can see precisely
// how the broadcast will look before connecting a real display. Snapshots
// whatever viewer-side state already existed (there normally isn't any for
// an admin session, but this keeps a real connection from ever being
// clobbered) and restores it on exit.
var _pvPreviewSnapshot=null;
function previewBroadcast(){
  if(!isAdmin()) return;
  closeModal();
  _pvPreviewSnapshot={
    pubViewData: window._pubViewData,
    prevPayload: window._pvPrevPayload,
    settings: window._pvSettings,
    fest: window._pvFest,
    state: window._pvState,
    queue: window._pvQueue,
    busy: window._pvBusy,
    dashState: window._pvDashState
  };
  window._pvPreviewMode=true;
  window._pubViewData=_buildPublicPayload('public-broadcast');
  window._pvPrevPayload=null; // no diff to compare against -> lands straight on the idle dashboard, no highlight pop
  window._pvQueue=[];
  window._pvBusy=false;
  window._pvDashState={};
  window._pvState='live';
  var badge=document.getElementById('pvPreviewBadge'); if(badge) badge.style.display='inline-block';
  var exitBtn=document.getElementById('pvExitBtn'); if(exitBtn) exitBtn.textContent='Exit Preview';
  document.getElementById('publicViewScreen').style.display='flex';
  _pvRender();
}
function _exitPublicView(){
  if(window._pvPreviewMode){
    _pvClearDashTimers();
    _pvClearFsTimers();
    if(window._pvFsEndTimer){ clearTimeout(window._pvFsEndTimer); window._pvFsEndTimer=null; }
    document.getElementById('publicViewScreen').style.display='none';
    var badge=document.getElementById('pvPreviewBadge'); if(badge) badge.style.display='none';
    var exitBtn=document.getElementById('pvExitBtn'); if(exitBtn) exitBtn.textContent='Exit';
    window._pvPreviewMode=false;
    var snap=_pvPreviewSnapshot||{};
    window._pubViewData=snap.pubViewData||null;
    window._pvPrevPayload=snap.prevPayload||null;
    window._pvSettings=snap.settings||null;
    window._pvFest=snap.fest||null;
    window._pvState=snap.state||null;
    window._pvQueue=snap.queue||[];
    window._pvBusy=snap.busy||false;
    window._pvDashState=snap.dashState||{};
    _pvPreviewSnapshot=null;
    // Admin was on the dashboard/app the whole time (this overlay just sat on
    // top of it) — nothing else to restore, just let it show again.
    return;
  }
  _teardownPublicView();
  document.getElementById('publicViewScreen').style.display='none';
  document.getElementById('loginScreen').style.display='block';
}
function _pvSetState(state){
  window._pvState=state;
  if(state==='ended'){ _pvClearDashTimers(); _pvClearFsTimers(); if(window._pvFsEndTimer){clearTimeout(window._pvFsEndTimer);window._pvFsEndTimer=null;} window._pvBusy=false; }
  if(!window._pubViewData||state==='ended') _pvRender();
}
// =============================================
// PUBLIC DISPLAY RENDERING — 4-card live dashboard, with full-screen
// highlight takeovers on live changes.
//
// Default/idle state: _pvRenderDashboard() shows four always-on cards
// (Recent Results, Team Standings, Individual Championship, Notifications),
// each independently rotating/animating on its own configurable cadence.
//
// Whenever a fresh payload differs from the previous one (_pvDetectChanges),
// the relevant change(s) are queued in priority order — new result >
// standings change > championship change > new notification — and
// _pvProcessQueue() takes the whole screen over for `fullscreenDuration`
// seconds per queued item before returning to the dashboard (or moving to
// the next queued item).
// =============================================
// Populates the header strip with the festival's logo, date, and venue (each
// individually respecting the admin's poster-visibility toggles) so a
// projector display always identifies the event it's showing, not just
// "Live Results".
function _pvUpdateFestHeader(fest){
  var viz=fest.viz||{};
  var logoEl=document.getElementById('pubViewLogo');
  if(logoEl){
    if(fest.logo && viz.logo!==false){ logoEl.src=fest.logo; logoEl.style.display=''; }
    else logoEl.style.display='none';
  }
  var metaEl=document.getElementById('pubViewFestMeta');
  if(metaEl){
    var parts=[];
    if(viz.date!==false && fest.date) parts.push(fest.date);
    if(viz.venue!==false && fest.venue) parts.push(fest.venue);
    if(!parts.length && viz.tagline!==false && fest.tagline) parts.push(fest.tagline);
    metaEl.textContent=parts.join('  \u2022  ');
    metaEl.style.display=parts.length?'':'none';
  }
}
function _pvRender(){
  var root=document.getElementById('pubViewBody');
  if(!root) return;
  var data=window._pubViewData;
  var state=window._pvState||'waiting';
  if(!data||state==='ended'){
    _pvClearDashTimers();
    root.innerHTML = state==='ended'
      ? '<div class="pv-status">Broadcast ended.</div>'
      : '<div class="pv-status pv-pulse">Waiting for broadcast\u2026</div>';
    return;
  }
  var festEl=document.getElementById('pubViewFest'); if(festEl) festEl.textContent=(data.fest&&data.fest.festName)||'Live Results';
  _pvUpdateFestHeader(data.fest||{});
  window._pvSettings=data.settings||{};
  window._pvFest=data.fest||{};
  // Diff against the previous payload to find what actually changed live,
  // then queue each change (priority order: result > standings >
  // championship > notification) as a full-screen highlight. The very first
  // payload a display ever receives has no "previous" to diff against, so it
  // never triggers a highlight — it just seeds the dashboard.
  var changes=_pvDetectChanges(window._pvPrevPayload, data);
  window._pvPrevPayload=data;
  var hasNewResult=changes.some(function(c){return c.type==='result';});
  if(changes.length){
    var PRI={result:0, standings:1, championship:2, notification:3};
    if(hasNewResult){
      // Every 'result' change already carries a full, up-to-date recap (the
      // latest N declared results as of THIS payload) — so if results are
      // being declared back-to-back and an older recap is still waiting in
      // line, it's now stale and would otherwise play right before this
      // newer, more-complete one, making an earlier declare appear to show
      // up "on top" of a later one. Drop it in favor of the fresh recap.
      window._pvQueue=(window._pvQueue||[]).filter(function(q){ return q.type!=='result'; });
    }
    window._pvQueue=(window._pvQueue||[]).concat(changes).sort(function(a,b){return PRI[a.type]-PRI[b.type];});
  }
  if(!window._pvBusy){
    if((window._pvQueue||[]).length) _pvProcessQueue();
    else _pvRenderDashboard();
  } else if(hasNewResult && window._pvBusyType==='result'){
    // A result recap is already on screen, but an even newer declare just
    // came in while it was playing. Restart the full-screen takeover right
    // now with the fresh recap instead of finishing out the superseded one
    // first — so the truly latest declared result always appears first.
    if(window._pvFsEndTimer) clearTimeout(window._pvFsEndTimer);
    _pvClearFsTimers();
    _pvProcessQueue();
  }
  // Otherwise a highlight of a different kind is already showing — the
  // dashboard (and any newly queued items) pick up automatically once that
  // highlight's timer ends.
}
// Compares two consecutive payloads and returns the list of live changes to
// highlight full-screen. Only fires on genuine value changes, never on a
// plain heartbeat resend (identical payload) or the very first payload.
function _pvDetectChanges(prev, data){
  var out=[];
  if(!prev) return out;
  var prevTotal=prev.totalDeclared||0, curTotal=data.totalDeclared||0;
  if(curTotal>prevTotal){
    // Recap sequence: always lead with the just-declared latest result, then
    // roll through the previously declared results in the same newest-first
    // order (posters is already sorted newest-first), instead of only
    // flashing the brand-new item(s) and stopping. recentCount matches the
    // dashboard's own Recent Results card so the full-screen recap and the
    // card agree on how far back "recent" reaches.
    var recapCount=_bcNum((data.settings||{}).recentCount,5);
    var items=(data.posters||[]).slice(0, Math.max(1,recapCount));
    if(items.length) out.push({type:'result', items:items});
  }
  function standingsSig(s){ return (s||[]).map(function(t){return t.name+':'+t.total;}).join('|'); }
  if(standingsSig(prev.standings)!==standingsSig(data.standings) && (data.standings||[]).length){
    out.push({type:'standings', standings:data.standings});
  }
  function champKey(c){ return c ? (c.name+':'+c.team+':'+c.total) : ''; }
  if(champKey(prev.championStage)!==champKey(data.championStage)
     || champKey(prev.championOffStage)!==champKey(data.championOffStage)
     || champKey(prev.championOverall)!==champKey(data.championOverall)){
    out.push({type:'championship', data:data});
  }
  if((data.pushedAt||0) > (prev.pushedAt||0)){
    var msg=(data.notifications||[]).filter(function(n){return n.id===data.pushedMessageId;})[0] || (data.notifications||[])[0];
    if(msg) out.push({type:'notification', message:msg});
  }
  return out;
}
// ---- Full-screen highlight queue ----
// Takes the whole screen over for one queued change at a time, for
// `fullscreenDuration` seconds each, then hands back to the dashboard (or
// the next queued item, if more piled up while this one was showing).
function _pvProcessQueue(){
  var item=(window._pvQueue||[]).shift();
  if(!item){ window._pvBusy=false; window._pvBusyType=null; _pvRenderDashboard(); return; }
  window._pvBusy=true;
  window._pvBusyType=item.type;
  _pvClearDashTimers();
  var root=document.getElementById('pubViewBody');
  if(!root) return;
  var fest=window._pvFest||{};
  var secs=Math.max(3, _bcNum((window._pvSettings||{}).fullscreenDuration,8));
  if(item.type==='result'){
    // The result recap can contain several slides (latest + previous
    // results) — make sure the full-screen takeover stays up long enough for
    // all of them to actually cycle through before auto-returning to the
    // dashboard, rather than being cut off by a flat fullscreenDuration.
    var slideInterval=Math.max(1,_bcNum((window._pvSettings||{}).slideshowInterval,3));
    // + the sting's own hold time up front, so it doesn't eat into how long
    // the actual result poster(s) stay on screen afterwards.
    secs=Math.max(secs, item.items.length*slideInterval) + Math.ceil(PV_STING_MS/1000);
    _renderResultsSlideshow(root, item.items, fest);
  }
  else if(item.type==='standings'){
    // Standings alternates a list slide and a chart slide every
    // listChartInterval seconds. If fullscreenDuration is shorter than one
    // full list→chart rotation, the chart slide can get cut short (or never
    // shown at all) before the whole highlight times out — make sure there's
    // always room for at least one complete rotation so the graph actually
    // gets its turn on screen and has time to animate in.
    var lcInterval=Math.max(1,_bcNum((window._pvSettings||{}).listChartInterval,5));
    secs=Math.max(secs, lcInterval*2);
    _renderStandingsFullscreen(root, item.standings, fest);
  }
  else if(item.type==='championship') _renderChampionshipFullscreen(root, item.data, fest);
  else if(item.type==='notification') _renderNotificationFullscreen(root, item.message, fest);
  if(window._pvFsEndTimer) clearTimeout(window._pvFsEndTimer);
  window._pvFsEndTimer=setTimeout(function(){
    _pvClearFsTimers();
    window._pvBusy=false;
    _pvProcessQueue();
  }, secs*1000);
}
function _pvClearFsTimers(){
  if(window._pvFsInnerTimer){ clearInterval(window._pvFsInnerTimer); window._pvFsInnerTimer=null; }
  if(window._pvTypeTimer){ clearInterval(window._pvTypeTimer); window._pvTypeTimer=null; }
  if(window._pvStingTimer){ clearTimeout(window._pvStingTimer); window._pvStingTimer=null; }
  _pvHudTeardown();
}
function _pvClearDashTimers(){
  var t=window._pvDashTimers||{};
  Object.keys(t).forEach(function(k){ clearInterval(t[k]); });
  window._pvDashTimers={};
}
// How long the "New Result Declared" HUD sting holds the screen before
// handing off to the actual result poster/carousel below. The build-up
// (rings → HUD frame → radar → headline → underline) finishes at ~2.9s;
// this then holds the completed headline for a proper beat (~1.4s) before a
// smooth .5s fade-out (see .pvhud-stage's pvhudStageOut, timed to start at
// the same 4.3s mark) — previously this cut off right as the build-up
// finished, so it read as ending abruptly instead of landing.
var PV_STING_MS=4800;
function _renderResultsSlideshow(root, items, fest){
  var badgeStyle=fest.badgeStyle||'ribbon';
  var idx=0;
  function paint(){
    var p=items[idx%items.length];
    root.innerHTML='<div id="pvFsStage" class="pv-poster-stage">'+_pvPosterChrome(_pvResultPosterHtml(p,badgeStyle), fest)+'</div>';
    var st=document.getElementById('pvFsStage');
    if(st){ st.style.animation='none'; void st.offsetHeight; st.style.animation='pvPosterIn .6s ease'; }
  }
  function startCarousel(){
    paint();
    if(items.length>1){
      var interval=Math.max(1,_bcNum((window._pvSettings||{}).slideshowInterval,3));
      window._pvFsInnerTimer=setInterval(function(){ idx=(idx+1)%items.length; paint(); }, interval*1000);
    }
  }
  // Lead with a short "New Result Declared" sting so the audience's eyes
  // snap to the screen before the actual winner/result poster is revealed,
  // instead of the new result just silently appearing.
  _pvPlayDeclareSting(root, items[0], startCarousel);
}
// Full-screen attention-grabber: sci-fi HUD/radar build-up (grid, expanding
// rings, HUD frame, radar sweep) culminating in a glowing "NEW RESULT
// DECLARED" headline with a floating particle field behind it, held for
// PV_STING_MS before calling back to reveal the actual poster. The particle
// canvas runs its own requestAnimationFrame loop for the sting's lifetime
// only — see _pvHudTeardown, which cancels it the moment the sting ends (or
// is interrupted by a new one) so it never keeps rendering in the
// background after the poster takes over.
function _pvHudTeardown(){
  if(window._pvHudRAF){ cancelAnimationFrame(window._pvHudRAF); window._pvHudRAF=null; }
  window._pvHudParticles=null;
}
function _pvPlayDeclareSting(root, poster, onDone){
  if(window._pvStingTimer){ clearTimeout(window._pvStingTimer); window._pvStingTimer=null; }
  _pvHudTeardown();
  root.innerHTML='<div class="pv-poster-stage"><div class="pvhud-stage">'
    +'<div class="pvhud-grid"></div>'
    +'<div class="pvhud-orbit">'
      +'<div class="pvhud-ring pvhud-ring-1"></div>'
      +'<div class="pvhud-ring pvhud-ring-2"></div>'
      +'<div class="pvhud-ring pvhud-ring-center"></div>'
    +'</div>'
    +'<div class="pvhud-radar"></div>'
    +'<div class="pvhud-frame">'
      +'<div class="pvhud-squares">'
        +'<div class="pvhud-square pvhud-active"></div>'
        +'<div class="pvhud-square pvhud-active"></div>'
        +'<div class="pvhud-square"></div>'
        +'<div class="pvhud-square pvhud-active"></div>'
      +'</div>'
    +'</div>'
    +'<div class="pvhud-text">'
      +'<div class="pvhud-title-line">'
        +'<span class="pvhud-word pvhud-word-new">New</span>'
        +'<span class="pvhud-word pvhud-word-result">Result</span>'
        +'<span class="pvhud-word pvhud-word-declared">Declared</span>'
      +'</div>'
      +'<div class="pvhud-underline"></div>'
    +'</div>'
    +'<canvas class="pvhud-canvas"></canvas>'
    +'</div></div>';
  var stageEl=root.querySelector('.pvhud-stage');
  var canvas=root.querySelector('.pvhud-canvas');
  if(stageEl && canvas && canvas.getContext){
    var ctx=canvas.getContext('2d');
    function fit(){ var r=stageEl.getBoundingClientRect(); canvas.width=Math.max(1,r.width); canvas.height=Math.max(1,r.height); }
    fit();
    function mkParticle(){
      return {x:Math.random()*canvas.width, y:canvas.height+Math.random()*50, size:Math.random()*3+1,
        speedY:Math.random()*2+0.8, speedX:(Math.random()-0.5)*0.8, alpha:Math.random()*0.8+0.2};
    }
    var particles=[]; for(var i=0;i<60;i++) particles.push(mkParticle());
    window._pvHudParticles=particles;
    (function loop(){
      // If _pvHudParticles no longer points at this exact array, either
      // teardown happened or a newer sting superseded us — stop quietly.
      if(window._pvHudParticles!==particles) return;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(function(p){
        p.y-=p.speedY; p.x+=p.speedX;
        if(p.y<0){ var fresh=mkParticle(); p.x=fresh.x; p.y=fresh.y; p.size=fresh.size; p.speedY=fresh.speedY; p.speedX=fresh.speedX; p.alpha=fresh.alpha; }
        ctx.save(); ctx.globalAlpha=p.alpha; ctx.fillStyle='#00f2ff'; ctx.shadowBlur=10; ctx.shadowColor='#00f2ff';
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill(); ctx.restore();
      });
      window._pvHudRAF=requestAnimationFrame(loop);
    })();
  }
  window._pvStingTimer=setTimeout(function(){
    window._pvStingTimer=null;
    _pvHudTeardown();
    if(onDone) onDone();
  }, PV_STING_MS);
}
// Standings change → alternates a ranked list slide and a bar-chart slide
// every `listChartInterval` seconds for the duration of the highlight.
function _renderStandingsFullscreen(root, standings, fest){
  var mode='list';
  function paint(){
    var inner = mode==='list' ? _pvStandingsPosterHtml(standings) : _pv2StandingsChartPosterHtml(standings);
    root.innerHTML='<div id="pvFsStage" class="pv-poster-stage">'+_pvPosterChrome(inner, fest)+'</div>';
    var st=document.getElementById('pvFsStage');
    if(st){ st.style.animation='none'; void st.offsetHeight; st.style.animation='pvPosterIn .6s ease'; }
  }
  paint();
  var interval=Math.max(1,_bcNum((window._pvSettings||{}).listChartInterval,5));
  window._pvFsInnerTimer=setInterval(function(){ mode=mode==='list'?'chart':'list'; paint(); }, interval*1000);
}
// Championship change → rotates the enabled Overall/On-Stage/Off-Stage
// champion slides every `championshipRotateInterval` seconds.
function _renderChampionshipFullscreen(root, data, fest){
  var settings=window._pvSettings||{};
  var slides=[];
  if(settings.showChampionOverall!==false && data.championOverall) slides.push({label:'Overall Individual Champion', c:data.championOverall});
  if(settings.showChampionStage!==false && data.championStage) slides.push({label:'On-Stage Champion', c:data.championStage});
  if(settings.showChampionOffStage!==false && data.championOffStage) slides.push({label:'Off-Stage Champion', c:data.championOffStage});
  if(!slides.length) return;
  var idx=0;
  function paint(){
    var s=slides[idx%slides.length];
    root.innerHTML='<div id="pvFsStage" class="pv-poster-stage">'+_pvPosterChrome(_pvChampionPosterHtml(s.label,s.c), fest)+'</div>';
    var st=document.getElementById('pvFsStage');
    if(st){ st.style.animation='none'; void st.offsetHeight; st.style.animation='pvPosterIn .6s ease'; }
  }
  paint();
  if(slides.length>1){
    var interval=Math.max(1,_bcNum(settings.championshipRotateInterval,6));
    window._pvFsInnerTimer=setInterval(function(){ idx=(idx+1)%slides.length; paint(); }, interval*1000);
  }
}
// New/pushed notification → full-screen message with a typewriter reveal.
function _renderNotificationFullscreen(root, message, fest){
  var text=(message&&message.text)||'';
  root.innerHTML='<div id="pvFsStage" class="pv-poster-stage">'+_pvPosterChrome(_pvMessagePosterHtml('', 'pvNotifTypeTarget'), fest)+'</div>';
  var st=document.getElementById('pvFsStage');
  if(st){ st.style.animation='none'; void st.offsetHeight; st.style.animation='pvPosterIn .6s ease'; }
  _pvTypewriter(document.getElementById('pvNotifTypeTarget'), text);
}
function _pvTypewriter(el, text){
  if(!el) return;
  var safe=(text||'').replace(/</g,'&lt;');
  var i=0;
  if(window._pvTypeTimer) clearInterval(window._pvTypeTimer);
  window._pvTypeTimer=setInterval(function(){
    i++;
    el.innerHTML=safe.slice(0,i).replace(/\n/g,'<br>');
    if(i>=safe.length){ clearInterval(window._pvTypeTimer); window._pvTypeTimer=null; }
  }, 32);
}
// ---- Idle/default state: the 4-card split-view dashboard ----
function _pvRenderDashboard(){
  var root=document.getElementById('pubViewBody');
  if(!root) return;
  var icoTrophy='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M5 4H3v2a4 4 0 0 0 4 4"/><path d="M19 4h2v2a4 4 0 0 1-4 4"/></svg>';
  var icoBars='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>';
  var icoMedal='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="6"/><path d="M9 8 6 2M15 8l3-6"/><path d="M9.5 12 11 15l3.5-4"/></svg>';
  var icoBell='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
  root.innerHTML = '<div class="pv2-dashboard">'
    +'<div class="pv2-card pv2-card-results"><div class="pv2-card-badge">1</div><div class="pv2-card-title">'+icoTrophy+'Recent Results<span class="pv2-live-pill">Live</span></div><div class="pv2-card-body" id="pv2Results"></div></div>'
    +'<div class="pv2-card pv2-card-standings"><div class="pv2-card-badge">2</div><div class="pv2-card-title">'+icoBars+'Team Standings</div><div class="pv2-card-body" id="pv2Standings"></div></div>'
    +'<div class="pv2-card pv2-card-champ"><div class="pv2-card-badge">3</div><div class="pv2-card-title">'+icoMedal+'Individual Championship</div><div class="pv2-card-body" id="pv2Champ"></div></div>'
    +'<div class="pv2-card pv2-card-notif"><div class="pv2-card-badge">4</div><div class="pv2-card-title">'+icoBell+'Notifications</div><div class="pv2-card-body" id="pv2Notif"></div></div>'
    +'</div>';
  _pvClearDashTimers();
  window._pvDashState=window._pvDashState||{};
  _pvStartResultsCard();
  _pvStartStandingsCard();
  _pvStartChampionshipCard();
  _pvStartNotificationsCard();
}
function _pvStartResultsCard(){
  function paint(){
    var el=document.getElementById('pv2Results'); if(!el) return;
    var data=window._pubViewData||{};
    var count=_bcNum((window._pvSettings||{}).recentCount,5);
    el.innerHTML=_renderResultsList((data.posters||[]).slice(0,count));
  }
  paint();
  // Recent Results has no configured rotation of its own — it simply
  // reflects the latest snapshot — but re-paint on the same cadence as the
  // heartbeat so rank-change animations (translateY via CSS transition on
  // .pv2-list-row) stay in sync with everything else on screen.
  window._pvDashTimers.results=setInterval(paint, 5000);
}
// posters arrives newest-declared-first (see _buildPublicPayload), so the
// list is already in reverse-chronological order — the latest declared
// result renders as the first row and older results are pushed down the
// list below it. Each row steps down by a fixed amount (rather than being
// normalized across however many rows are showing) so the dimming is evenly
// visible from row to row — a normalized spread made rows 1–3 all look
// almost equally bright (a 100%→70% difference barely reads against a dark
// background) and dumped all the visible fade onto just the last row or two.
function _renderResultsList(posters){
  if(!posters.length) return '<div class="pv2-empty">No results declared yet\u2026</div>';
  var icoMedal='<svg viewBox="0 0 24 24" style="width:.8em;height:.8em" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="6"/><path d="M9 8 6 2M15 8l3-6"/></svg>';
  return posters.map(function(p,i){
    var winner=(p.rows||[])[0];
    var rankCls = i===0 ? 'pv2-rank-1' : i===1 ? 'pv2-rank-2' : i===2 ? 'pv2-rank-3' : '';
    var subParts=[];
    if(p.section) subParts.push(p.section);
    subParts.push(p.item);
    var winnerName = winner ? winner.name : p.item;
    var fadeOpacity = Math.max(0.28, 1 - i*0.16);
    return '<div class="pv2-list-row" style="animation-delay:'+(i*0.05)+'s;opacity:'+fadeOpacity.toFixed(2)+'">'
      +'<div class="pv2-list-rank '+rankCls+'">'+icoMedal+'</div>'
      +'<div style="flex:1;min-width:0"><div class="pv2-list-name">'+winnerName+'</div>'+(subParts.length?'<div class="pv2-list-sub">'+subParts.join(' &middot; ')+'</div>':'')+'</div>'
      +(winner&&winner.team?'<div class="pv2-team-chip">'+winner.team+'</div>':'')
      +'</div>';
  }).join('');
}
function _pvProgressLabel(data){
  var n=data.totalDeclared||0;
  return '<div class="pv2-progress-label">After '+n+' result'+(n===1?'':'s')+' declared</div>';
}
function _pvStartStandingsCard(){
  window._pvDashState.standingsMode=window._pvDashState.standingsMode||'list';
  function paint(){
    var el=document.getElementById('pv2Standings'); if(!el) return;
    var data=window._pubViewData||{};
    var settings=window._pvSettings||{};
    var after=_bcNum(settings.standingsAfter,1);
    var progressLabel=_pvProgressLabel(data);
    if((data.totalDeclared||0)<after){ el.innerHTML=progressLabel+'<div class="pv2-empty">Standings appear after '+after+' result'+(after===1?'':'s')+'\u2026</div>'; return; }
    var standings=data.standings||[];
    el.innerHTML = progressLabel+(window._pvDashState.standingsMode==='list' ? _renderStandingsList(standings) : _renderBarChart(standings));
  }
  paint();
  var interval=Math.max(1,_bcNum((window._pvSettings||{}).listChartInterval,5));
  window._pvDashTimers.standings=setInterval(function(){
    window._pvDashState.standingsMode = window._pvDashState.standingsMode==='list' ? 'chart' : 'list';
    paint();
  }, interval*1000);
}
// Ranked list with a colored medal chip for the top 3 and an up/down delta
// arrow versus the last time this card painted, so a rank swap is visible at
// a glance (paired with the CSS transform transition on .pv2-list-row).
function _renderStandingsList(standings){
  if(!standings.length) return '<div class="pv2-empty">No points yet\u2026</div>';
  var prevRanks=window._pvDashState.prevStandingRanks||{};
  var nextRanks={};
  var html=standings.map(function(t,i){
    var rank=i+1;
    nextRanks[t.name]=rank;
    var rankCls = rank===1?'pv2-rank-1':rank===2?'pv2-rank-2':rank===3?'pv2-rank-3':'';
    var prevRank=prevRanks[t.name];
    var delta='<span class="pv2-delta same">\u2013</span>';
    if(prevRank!=null && prevRank!==rank){
      delta = prevRank>rank ? '<span class="pv2-delta up">\u25B2'+(prevRank-rank)+'</span>' : '<span class="pv2-delta down">\u25BC'+(rank-prevRank)+'</span>';
    }
    return '<div class="pv2-list-row" style="animation-delay:'+(i*0.04)+'s"><div class="pv2-list-rank '+rankCls+'">'+rank+'</div><div class="pv2-list-name">'+t.name+'</div>'+delta+'<div class="pv2-list-pts">'+t.total+' pts</div></div>';
  }).join('');
  window._pvDashState.prevStandingRanks=nextRanks;
  return html;
}
var _PV2_BAR_COLORS=['#ffd700','#c0c0c0','#cd7f32','#4a9eff','#9b59b6','#00c896','#ff4757','#f0a500'];
var _pv2BarChartSeq=0;
// Renders with every bar starting at height:0 and every value starting at 0,
// then (once the zero-state has actually painted) animates each bar up to
// its real height via the CSS transition on .pv2-bar and counts each number
// up to its real total — so every redraw (rotation, or right after a new
// result is declared) visibly "fills up from zero" instead of snapping to
// its final state.
function _renderBarChart(standings){
  if(!standings.length) return '<div class="pv2-empty">No points yet\u2026</div>';
  var max=Math.max.apply(null, standings.map(function(t){return t.total||0;}))||1;
  var id='pv2bc'+(++_pv2BarChartSeq);
  // Hex-alpha gradient stops instead of color-mix(): color-mix() isn't
  // supported by the older WebViews/embedded browsers many cast/projector
  // devices run, and when it's unsupported the whole background declaration
  // is invalid and dropped — silently leaving the bar with no visible fill
  // at all (only the box-shadow glow showed). Hex alpha has been supported
  // everywhere color gradients are, so the fill always renders.
  var html='<div class="pv2-barchart" id="'+id+'">'+standings.map(function(t,i){
    var h=Math.max(4, Math.round((t.total||0)/max*100));
    var color=_PV2_BAR_COLORS[i%_PV2_BAR_COLORS.length];
    return '<div class="pv2-bar-col"><div class="pv2-bar-val" data-val="'+(t.total||0)+'">0</div><div class="pv2-bar" data-h="'+h+'" style="height:0%;background:linear-gradient(180deg,'+color+'ee,'+color+'33);color:'+color+'"></div><div class="pv2-bar-label">'+t.name+'</div></div>';
  }).join('')+'</div>';
  setTimeout(function(){ _pv2AnimateBarChart(id); }, 40);
  return html;
}
// Bars/labels are staggered slightly (by column index) and eased in over a
// longer duration so the chart visibly fills up gradually — rather than
// every bar/number shooting straight up to its final value all at once.
function _pv2AnimateBarChart(id){
  var wrap=document.getElementById(id); if(!wrap) return;
  var bars=wrap.querySelectorAll('.pv2-bar');
  for(var i=0;i<bars.length;i++){
    (function(bar,i){
      bar.style.transitionDelay=(i*90)+'ms';
      bar.style.height=(bar.getAttribute('data-h')||0)+'%';
    })(bars[i], i);
  }
  var vals=wrap.querySelectorAll('.pv2-bar-val');
  var _loop=function(el, startDelay){
    var target=parseInt(el.getAttribute('data-val'),10)||0;
    var duration=1600, startTime=null;
    setTimeout(function(){
      function step(ts){
        if(!startTime) startTime=ts;
        var progress=Math.min(1,(ts-startTime)/duration);
        // ease-in-out cubic — accelerates gently then settles, instead of
        // the old ease-out cubic's fast initial jump.
        var eased = progress<0.5 ? 4*progress*progress*progress : 1-Math.pow(-2*progress+2,3)/2;
        el.textContent=Math.round(target*eased);
        if(progress<1) requestAnimationFrame(step);
        else el.textContent=target;
      }
      requestAnimationFrame(step);
    }, startDelay);
  };
  for(var j=0;j<vals.length;j++){ _loop(vals[j], j*90); }
}
// Full-screen variant of the bar chart (larger, used inside the Team
// Standings full-screen highlight rather than the small dashboard card).
function _pv2StandingsChartPosterHtml(standings){
  return '<div class="pv-poster pv-poster-standings pv-poster-standings-chart">'
    +_pvProgressLabel(window._pubViewData||{})
    +'<div class="pv-poster-section">Team Standings</div>'
    +'<div class="pv-poster-title">Overall Points</div>'
    +'<div class="pv2-standings-chart-wrap">'+_renderBarChart(standings)+'</div>'
    +'</div>';
}
function _pvStartChampionshipCard(){
  window._pvDashState.champIdx=window._pvDashState.champIdx||0;
  function slides(){
    var data=window._pubViewData||{}, settings=window._pvSettings||{};
    var arr=[];
    if(settings.showChampionOverall!==false && data.championOverall) arr.push({label:'Overall', c:data.championOverall});
    if(settings.showChampionStage!==false && data.championStage) arr.push({label:'On-Stage', c:data.championStage});
    if(settings.showChampionOffStage!==false && data.championOffStage) arr.push({label:'Off-Stage', c:data.championOffStage});
    return arr;
  }
  function paint(){
    var el=document.getElementById('pv2Champ'); if(!el) return;
    var data=window._pubViewData||{}, settings=window._pvSettings||{};
    var after=_bcNum(settings.championAfter,1);
    var progressLabel=_pvProgressLabel(data);
    if((data.totalDeclared||0)<after){ el.innerHTML=progressLabel+'<div class="pv2-empty">Championship appears after '+after+' result'+(after===1?'':'s')+'\u2026</div>'; return; }
    var arr=slides();
    if(!arr.length){ el.innerHTML=progressLabel+'<div class="pv2-empty">No champion yet\u2026</div>'; return; }
    var s=arr[window._pvDashState.champIdx % arr.length];
    el.innerHTML=progressLabel+_renderChampionship(s.label, s.c);
  }
  paint();
  var interval=Math.max(1,_bcNum((window._pvSettings||{}).championshipRotateInterval,6));
  window._pvDashTimers.champ=setInterval(function(){
    window._pvDashState.champIdx=(window._pvDashState.champIdx||0)+1;
    paint();
  }, interval*1000);
}
function _renderChampionship(label, c){
  if(!c) return '<div class="pv2-empty">No '+label+' champion yet\u2026</div>';
  // Clean trophy silhouette instead of a medal-ribbon glyph — reads instantly
  // as "champion" at this small size instead of looking like a stray icon.
  var icoTrophy='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M5 4H3v2a4 4 0 0 0 4 4"/><path d="M19 4h2v2a4 4 0 0 1-4 4"/></svg>';
  var top='<div class="pv2-champ"><div class="pv2-champ-ring">'+icoTrophy+'</div><div class="pv2-champ-label">'+label+' Champion</div><div class="pv2-champ-name">'+c.name+'</div>'
    +(c.team?'<div class="pv2-champ-team">'+c.team+'</div>':'')
    +'<div class="pv2-champ-pts">'+c.total+' pts</div></div>';
  // Runner-ups — capped at ranks 2–3 so the card always shows a clean top 3
  // total (not a long scrollable tail), matching the fullscreen poster.
  var rest=(c.list||[]).slice(1,3);
  if(!rest.length) return top;
  var restHtml=rest.map(function(r,i){
    var rank=i+2;
    return '<div class="pv2-list-row" style="animation-delay:'+(i*0.04)+'s"><div class="pv2-list-rank pv2-rank-3">'+rank+'</div><div class="pv2-list-name">'+r.name+'</div><div class="pv2-list-sub">'+(r.team||'')+'</div><div class="pv2-list-pts">'+r.total+' pts</div></div>';
  }).join('');
  return top+'<div style="display:flex;flex-direction:column;gap:6px;margin-top:6px">'+restHtml+'</div>';
}
function _pvStartNotificationsCard(){
  window._pvDashState.notifIdx=window._pvDashState.notifIdx||0;
  function paint(){
    var el=document.getElementById('pv2Notif'); if(!el) return;
    var data=window._pubViewData||{};
    var notifications=data.notifications||[];
    if(!notifications.length){ el.innerHTML='<div class="pv2-empty">No messages\u2026</div>'; return; }
    var n=notifications[window._pvDashState.notifIdx % notifications.length];
    el.innerHTML=_renderNotifications(n);
  }
  paint();
  var interval=Math.max(1,_bcNum((window._pvSettings||{}).notificationRotateInterval,4));
  window._pvDashTimers.notif=setInterval(function(){
    window._pvDashState.notifIdx=(window._pvDashState.notifIdx||0)+1;
    paint();
  }, interval*1000);
}
function _renderNotifications(n){
  if(!n) return '<div class="pv2-empty">No messages\u2026</div>';
  var icoBell='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
  return '<div class="pv2-notif"><div class="pv2-notif-icon">'+icoBell+'</div><div class="pv2-notif-text">'+(n.text||'').replace(/</g,'&lt;').replace(/\n/g,'<br>')+'</div></div>';
}
// Wraps any poster's inner content with the shared festival header (name,
// logo, tagline, date/venue — each individually toggle-able via posterViz,
// same as the downloadable poster generator) and footer (institution on the
// left, product name on the right, always shown).
function _pvPosterChrome(innerHtml, fest){
  var viz=(fest&&fest.viz)||{};
  var showLogo=viz.logo!==false && fest && fest.logo;
  var showFestName=viz.festName!==false;
  var showTagline=viz.tagline!==false && fest && fest.tagline;
  var showDate=viz.date!==false && fest && fest.date;
  var showVenue=viz.venue!==false && fest && fest.venue;
  var showDateLine=showDate||showVenue;
  var anyHeader=showLogo||showFestName||showTagline||showDateLine;
  var headerHtml=anyHeader ? (
    '<div class="pv-poster-header">'
    +(showLogo?'<img class="pv-poster-logo" src="'+fest.logo+'">':'')
    +'<div class="pv-poster-headtext">'
      +(showFestName?'<div class="pv-poster-festname">'+(fest.festName||'Winzera')+'</div>':'')
      +(showTagline?'<div class="pv-poster-tagline">'+fest.tagline+'</div>':'')
      +(showDateLine?'<div class="pv-poster-datevenue">'+[showDate?fest.date:null, showVenue?fest.venue:null].filter(Boolean).join(' &middot; ')+'</div>':'')
    +'</div></div>'
  ) : '';
  var footerHtml='<div class="pv-poster-footer">'
    +'<div class="pv-poster-inst">'+((fest&&fest.institution)||'')+'</div>'
    +'<div class="pv-poster-brand">Winzera &middot; Competition Manager</div>'
    +'</div>';
  return headerHtml+'<div class="pv-poster-body">'+innerHtml+'</div>'+footerHtml;
}
// SVG rank badges (Ribbon / Minimal / Shield) — the HTML/CSS equivalent of
// the canvas-based _drawRankBadge used for downloadable posters, so the
// admin's chosen Poster Design badge style (cfg.posterBadgeStyle) is
// reflected on the broadcast too.
var _PV_BADGE_PAL=[
  {main:'#FFD700', dark:'#B8860B', light:'#FFF6D0', ink:'#3a2a00'},
  {main:'#C7CDD6', dark:'#8A8F98', light:'#F2F4F6', ink:'#2a2c30'},
  {main:'#CD7F32', dark:'#8B5A2B', light:'#EFC79A', ink:'#3a2308'}
];
function _pvBadgeSvg(style, rank, size){
  size=size||26;
  var c=_PV_BADGE_PAL[Math.max(0,Math.min(2,rank-1))];
  if(style==='minimal'){
    return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100">'
      +'<circle cx="50" cy="50" r="46" fill="'+c.main+'" stroke="'+c.dark+'" stroke-width="8"/>'
      +'<text x="50" y="56" font-size="46" font-weight="800" text-anchor="middle" fill="'+c.ink+'" font-family="Segoe UI, Arial, sans-serif">'+rank+'</text>'
      +'</svg>';
  }
  if(style==='shield'){
    return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 120">'
      +'<defs><linearGradient id="pvsh'+rank+'" x1="0" y1="0" x2="1" y2="1">'
      +'<stop offset="0%" stop-color="'+c.light+'"/><stop offset="45%" stop-color="'+c.main+'"/><stop offset="100%" stop-color="'+c.dark+'"/>'
      +'</linearGradient></defs>'
      +'<path d="M10 12 Q10 4 25 4 L75 4 Q90 4 90 12 L90 55 Q90 85 50 116 Q10 85 10 55 Z" fill="url(#pvsh'+rank+')" stroke="'+c.dark+'" stroke-width="5"/>'
      +'<text x="50" y="58" font-size="48" font-weight="800" text-anchor="middle" fill="'+c.ink+'" font-family="Segoe UI, Arial, sans-serif">'+rank+'</text>'
      +'</svg>';
  }
  // default: Classic Ribbon
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 130">'
    +'<rect x="24" y="55" width="18" height="55" fill="'+c.dark+'" transform="rotate(-12 33 55)"/>'
    +'<rect x="58" y="55" width="18" height="55" fill="'+c.dark+'" transform="rotate(12 67 55)"/>'
    +'<circle cx="50" cy="46" r="40" fill="'+c.main+'" stroke="'+c.dark+'" stroke-width="6"/>'
    +'<circle cx="50" cy="46" r="28" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="3"/>'
    +'<text x="50" y="58" font-size="40" font-weight="800" text-anchor="middle" fill="'+c.ink+'" font-family="Georgia, serif">'+rank+'</text>'
    +'</svg>';
}
// Avatar for a podium row: participant photo if present, else initials —
// group items (no individual photo) fall back to a larger badge alone.
function _pvAvatarHtml(r, itemType, badgeStyle){
  if(itemType==='group'){
    return '<div class="pv-avatar pv-avatar-group">'+_pvBadgeSvg(badgeStyle, r.rank, 46)+'</div>';
  }
  var badge=_pvBadgeSvg(badgeStyle, r.rank, 24);
  if(r.photo){
    return '<div class="pv-avatar"><img src="'+r.photo+'" class="pv-avatar-img"><span class="pv-avatar-badge">'+badge+'</span></div>';
  }
  var initials=_getInitials(r.name);
  var col=_AVATAR_COLORS[(r.chestNo||0)%_AVATAR_COLORS.length];
  return '<div class="pv-avatar"><div class="pv-avatar-initials" style="background:'+col+'">'+initials+'</div><span class="pv-avatar-badge">'+badge+'</span></div>';
}
function _pvResultPosterHtml(p, badgeStyle){
  var podiumHtml=(p.rows||[]).map(function(r){
    return '<div class="pv-podium-slot pv-podium-'+r.rank+'">'
      + _pvAvatarHtml(r, p.itemType, badgeStyle)
      +'<div class="pv-podium-card">'
      +'<div class="pv-podium-name">'+r.name+'</div>'
      +'<div class="pv-podium-team">'+r.team+'</div>'
      +'<div class="pv-podium-marks">'+(r.grade?r.grade+' &middot; ':'')+r.point+' pts</div>'
      +'</div></div>';
  }).join('');
  return '<div class="pv-poster">'
    +(p.resultNumber?'<div class="pv-poster-resultnum">Result '+p.resultNumber+'</div>':'')
    +(p.isNew?'<div class="pv-poster-new">NEW</div>':'')
    +'<div class="pv-poster-section">'+(p.section||'')+'</div>'
    +'<div class="pv-poster-title">'+p.item+'</div>'
    +'<div class="pv-podium">'+podiumHtml+'</div>'
    +'</div>';
}
// Scrollable list-view (matching the Dashboard card's .pv2-list-row style)
// used by the full-screen Team Standings poster. Replaces the old
// top3-tiles + compact-row layout, whose fixed-width tiles truncated long
// team names with an ellipsis. Every team is rendered as one row here
// (rather than splitting into a separate "top 3" section) so the list
// scrolls as a single, consistently-styled sequence no matter how many
// teams there are.
function _pvStandingsPosterHtml(standings){
  standings=standings||[];
  var progressLabel=_pvProgressLabel(window._pubViewData||{});
  if(!standings.length){
    return '<div class="pv-poster pv-poster-standings">'
      +progressLabel
      +'<div class="pv-poster-section">Team Standings</div>'
      +'<div class="pv-poster-title">Overall Points</div>'
      +'<div class="pv-status">No points yet\u2026</div>'
      +'</div>';
  }
  var rowsHtml=standings.map(function(t,i){
    var rank=i+1;
    var rankCls = rank===1?'pv2-rank-1':rank===2?'pv2-rank-2':rank===3?'pv2-rank-3':'';
    return '<div class="pv2-list-row" style="animation-delay:'+(Math.min(i,10)*0.04)+'s">'
      +'<div class="pv2-list-rank '+rankCls+'">'+rank+'</div>'
      +'<div class="pv2-list-name">'+t.name+'</div>'
      +'<div class="pv2-list-pts">'+t.total+' pts</div>'
      +'</div>';
  }).join('');
  return '<div class="pv-poster pv-poster-standings">'
    +progressLabel
    +'<div class="pv-poster-section">Team Standings</div>'
    +'<div class="pv-poster-title">Overall Points</div>'
    +'<div class="pv-poster-list">'+rowsHtml+'</div>'
    +'</div>';
}
function _pvChampionPosterHtml(label, champion){
  var progressLabel=_pvProgressLabel(window._pubViewData||{});
  if(!champion) return '<div class="pv-poster pv-poster-champion">'+progressLabel+'<div class="pv-status">No '+label+' yet\u2026</div></div>';
  // Runner-ups render as a scrollable list-view (matching the Dashboard
  // card's .pv2-list-row style) instead of fixed-width tiles, so long
  // participant names wrap instead of being truncated with an ellipsis.
  // Capped at ranks 2–3 (top 3 total) — the champion poster spotlights the
  // podium, not the full standings.
  var list=champion.list||[];
  var rest=list.slice(1,3);
  var restHtml=rest.map(function(t,i){
    var rank=i+2;
    var rankCls = rank===2?'pv2-rank-2':rank===3?'pv2-rank-3':'';
    return '<div class="pv2-list-row" style="animation-delay:'+(Math.min(i,10)*0.04)+'s">'
      +'<div class="pv2-list-rank '+rankCls+'">'+rank+'</div>'
      +'<div class="pv2-list-name">'+t.name+'</div>'
      +(t.team?'<div class="pv2-team-chip">'+t.team+'</div>':'')
      +'<div class="pv2-list-pts">'+t.total+' pts</div>'
      +'</div>';
  }).join('');
  return '<div class="pv-poster pv-poster-champion">'
    +progressLabel
    +'<div class="pv-champ-badge">\uD83C\uDFC6</div>'
    +'<div class="pv-poster-section">'+label+'</div>'
    +'<div class="pv-champ-name">'+champion.name+'</div>'
    +(champion.team?'<div class="pv-champ-team">'+champion.team+'</div>':'')
    +'<div class="pv-champ-pts">'+champion.total+' pts</div>'
    +(rest.length?'<div class="pv-poster-list" style="margin-top:16px">'+restHtml+'</div>':'')
    +'</div>';
}
// If targetId is given, the text node is left empty with that id so a
// typewriter effect (_pvTypewriter) can fill it in afterwards; otherwise the
// text is rendered immediately (fade-in via the poster's own entrance
// animation).
function _pvMessagePosterHtml(text, targetId){
  return '<div class="pv-poster pv-poster-message">'
    +'<div class="pv-message-icon"><svg viewBox="0 0 24 24" style="width:1em;height:1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>'
    +'<div class="pv-message-text"'+(targetId?' id="'+targetId+'"':'')+'>'+(targetId?'':(text||'').replace(/</g,'&lt;').replace(/\n/g,'<br>'))+'</div>'
    +'</div>';
}


function toggleTeamLock(i){
  var teams=DB.teams(); teams[i]={...teams[i],locked:!teams[i].locked}; DB.saveTeams(teams);
  toast(teams[i].locked?'Team manager locked':'Team manager unlocked'); renderKeepScroll('teams');
}
function filterTeams(q){
  const cb=document.getElementById('team-clear-btn'); if(cb) cb.style.display=q?'':'none';
  const teams=DB.teams(), colors=['#f0a500','#00c896','#4a9eff','#ff4757','#9b59b6','#e74c3c','#27ae60','#2980b9'];
  const filtered=teams.filter(t=>t.name.toLowerCase().includes(q.toLowerCase())||(t.shortName||'').toLowerCase().includes(q.toLowerCase()));
  document.getElementById('teamsList').innerHTML=filtered.map((t,i)=>{
    const col=colors[teams.indexOf(t)%colors.length];
    const initials=(t.shortName||t.name||'?').replace(/[^A-Za-z0-9]/g,'').slice(0,2).toUpperCase()||'?';
    return `
    <div class="list-item">
      <div class="list-avatar" style="background:${col}22;color:${col};font-weight:900;font-size:.85rem;letter-spacing:-.5px">${initials}</div>
      <div class="list-info"><div class="list-title">${t.name}</div><div class="list-sub">${t.shortName||''}</div></div>
      <div class="list-actions">
        <button class="btn btn-secondary btn-sm btn-icon" aria-label="Edit team" onclick="showEditTeam(${teams.indexOf(t)})"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>️</button>
        <button class="btn btn-danger btn-sm btn-icon" aria-label="Delete team" onclick="deleteTeam(${teams.indexOf(t)})"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button>
      </div>
    </div>`;}).join('')||'<div style="color:var(--text3);text-align:center;padding:20px">No results</div>';
}

// =============================================
// PARTICIPANTS
// =============================================
// =============================================
// GROUP REGISTRATION
// =============================================
function groupFormHTML(grp){
  grp=grp||{};
  var isEdit=!!(grp&&grp.id);
  var teams=DB.teams(),sections=DB.sections(),items=DB.items(),participants=DB.participants(),groups=DB.groups();
  // Only sections that contain at least one group item
  var sectionsWithGroups=sections.filter(function(s){return items.some(function(i){return i.type==='group'&&i.section===s;});});
  // For edit: use group's own section; for add: use first section that has group items
    // For add mode: use last used section/team if they are still valid
  var defaultSec = (window._lastGrpSection && sectionsWithGroups.includes(window._lastGrpSection))
    ? window._lastGrpSection
    : (sectionsWithGroups[0] || '');
  var defaultTeam = (window._lastGrpTeam && teams.some(function(t){ return t.name === window._lastGrpTeam; }))
    ? window._lastGrpTeam
    : (teams[0] && teams[0].name || '');
  var selSec = isEdit ? grp.section : defaultSec;
  var selTeam = isTeam() ? currentTeamName() : (isEdit ? grp.team : defaultTeam);
  // Items: group items in selected section, plus any Open/Cross-Section group items
  var groupItems=items.filter(function(i){return i.type==='group'&&(i.section===selSec||isOpenSection(i.section));});
  // Next available chest number within the selected team's assigned range
  var nextChest = nextChestForTeam(selTeam, null, isTeam());
  var grpChestRangeNote = '';
  if(nextChest===null){
    var _rg=_teamChestRange(selTeam, isTeam());
    grpChestRangeNote = _rg
      ? '<div style="font-size:.68rem;color:var(--red);margin-top:-6px;margin-bottom:10px">No chest numbers left in '+selTeam+'\u2019s range ('+_rg.from+'\u2013'+_rg.to+') &mdash; ask Admin to widen it.</div>'
      : '<div style="font-size:.68rem;color:var(--red);margin-top:-6px;margin-bottom:10px">Your chest number range hasn\u2019t been set by Admin yet &mdash; contact Admin.</div>';
    nextChest='';
  }
  // Section dropdown: only sections that have group items
  var sectOpts=sectionsWithGroups.map(function(s){return '<option'+(s===selSec?' selected':'')+'>'+s+'</option>';}).join('');
  var teamOpts=teams.map(function(t){return '<option value="'+t.name+'"'+(t.name===selTeam?' selected':'')+'>'+t.name+'</option>';}).join('');
  // Participants filtered by TEAM only on initial load
  var teamParts=selTeam?participants.filter(function(p){return p.team===selTeam;}):participants;
  var capOpts='<option value="">-- Select Captain --</option>'
    +teamParts.map(function(p){var sel=grp.members&&grp.members[0]&&grp.members[0].chestNo===p.chestNo;return '<option value="'+p.chestNo+'"'+(sel?' selected':'')+'>'+p.name+' (#'+p.chestNo+')</option>';}).join('');
  var mem2Val=grp.members&&grp.members[1]?grp.members[1].chestNo:'';
  var mem2DisplayVal=mem2Val?(teamParts.find(function(p){return p.chestNo===grp.members[1].chestNo;})||{name:grp.members[1].name||''}).name+' (#'+grp.members[1].chestNo+')':'';
  // Build item checkboxes (multiple allowed)
  var selectedItemIds=grp.itemIds||(grp.itemId?[grp.itemId]:[]);
  var itemCheckboxes=groupItems.length
    ?groupItems.map(function(i){
        var badge=i.isStage
          ?'<span style="font-size:.65rem;padding:2px 7px;border-radius:8px;background:rgba(240,165,0,.15);color:var(--accent);font-weight:700">On-Stage</span>'
          :'<span style="font-size:.65rem;padding:2px 7px;border-radius:8px;background:rgba(0,200,150,.15);color:var(--green);font-weight:700">Off-Stage</span>';
        var openBadge=(i.section!==selSec&&isOpenSection(i.section))
          ?'<span style="font-size:.65rem;padding:2px 7px;border-radius:8px;background:rgba(74,158,255,.18);color:var(--blue);font-weight:700">'+i.section+'</span>':'';
        return '<label style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer">'
          +'<input type="checkbox" class="grp-item-cb" value="'+i.id+'"'+(selectedItemIds.includes(i.id)?' checked':'')
          +' style="width:16px;height:16px;accent-color:var(--accent)">'
          +'<span style="flex:1;font-size:.83rem">'+i.name+'</span>'+openBadge+badge+'</label>';
      }).join('')
    :'<div style="color:var(--text3);font-size:.8rem;padding:10px">No group items for this section</div>';
  return '<div class="form-group"><label class="form-label">Section <span style="font-size:.7rem;color:var(--text3)">(filters items)</span></label>'
    +'<div style="position:relative">'
    +'<input class="form-input" id="grp-section-q" style="margin-bottom:0;padding-right:36px" autocomplete="off"'
    +' placeholder="Type to search section..." value="'+selSec+'"'
    +' oninput="gfSecSearch(this.value)" onfocus="gfSecSearch(this.value)" onblur="gfSecBlur()">'
    +'<button type="button" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px;display:'+(selSec?'':'none')+'" id="grp-sec-clear" onclick="document.getElementById(\'grp-section-q\').value=\'\';document.getElementById(\'grp-section\').value=\'\';this.style.display=\'none\';gfSectionChange()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
    +'<div id="grp-sec-res" style="display:none;position:absolute;z-index:1200;left:0;right:0;top:100%;margin-top:3px;background:var(--card);border:1px solid var(--accent)44;border-radius:10px;max-height:180px;overflow-y:auto;box-shadow:0 6px 20px rgba(0,0,0,.4)"></div>'
    +'</div>'
    +'<input type="hidden" id="grp-section" value="'+selSec+'"></div>'
    +'<div class="form-group"><label class="form-label">Team <span style="font-size:.7rem;color:var(--text3)">(filters participants)</span></label>'
    +'<div style="position:relative">'
    +'<input class="form-input" id="grp-team-q" style="margin-bottom:0;padding-right:36px" autocomplete="off"'
    +(isTeam()?' readonly':'')
    +' placeholder="Type to search team..." value="'+selTeam+'"'
    +' oninput="gfTeamSearch(this.value)" onfocus="gfTeamSearch(this.value)" onblur="gfTeamBlurInput()">'
    +'<button type="button" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px;display:'+(selTeam&&!isTeam()?'':'none')+'" id="grp-team-clear" onclick="if(!isTeam()){document.getElementById(\'grp-team-q\').value=\'\';document.getElementById(\'grp-team\').value=\'\';this.style.display=\'none\';gfTeamChange();}"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
    +'<div id="grp-team-res" style="display:none;position:absolute;z-index:1200;left:0;right:0;top:100%;margin-top:3px;background:var(--card);border:1px solid var(--accent)44;border-radius:10px;max-height:180px;overflow-y:auto;box-shadow:0 6px 20px rgba(0,0,0,.4)"></div>'
    +'</div>'
    +'<input type="hidden" id="grp-team" value="'+selTeam+'"></div>'
    +'<div class="form-group"><label class="form-label">Item</label>'
    +'<div id="grp-items-list" style="max-height:200px;overflow-y:auto;background:var(--input-bg);border:1px solid var(--border);border-radius:10px;padding:6px 12px">'
    +itemCheckboxes+'</div></div>'
    +'<div style="background:var(--bg3);border-radius:10px;padding:12px;margin-top:4px">'
    +grpChestRangeNote
    +'<div class="form-group" style="margin-bottom:10px"><label class="form-label">Group Chest No.</label>'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="grp-chest" type="number" value="'+(grp.groupChestNo||nextChest)+'" oninput="_grpChestLiveCheck()"></div>'
    +'<div id="grp-chest-warn" style="display:none;font-size:.72rem;color:var(--red);margin-top:-6px;margin-bottom:10px"></div>'
    +'<div class="form-group"><label class="form-label"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M5 4H3v2a4 4 0 0 0 4 4"/><path d="M19 4h2v2a4 4 0 0 1-4 4"/></svg> Captain</label>'
    +'<div style="position:relative">'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="grp-captain-q" style="margin-bottom:0"'
    +' placeholder="Type name or chest no..."'
    +' value="'+(grp.members&&grp.members[0]&&grp.members[0].chestNo ? (teamParts.find(function(p){return p.chestNo===grp.members[0].chestNo;})||{name:grp.members[0].name||''}).name+' (#'+grp.members[0].chestNo+')':'')+'"'
    +' oninput="gfCapSearch(this.value)" onfocus="gfCapSearch(this.value)" onblur="gfCapBlur()">'
    +'<div id="grp-cap-res" style="display:none;position:absolute;z-index:1200;left:0;right:0;bottom:100%;margin-bottom:4px;background:var(--card);border:1px solid var(--accent)44;border-radius:10px;max-height:200px;overflow-y:auto;box-shadow:0 -4px 24px rgba(0,0,0,.55)"></div>'
    +'</div>'
    +'<input type="hidden" id="grp-captain" value="'+(grp.members&&grp.members[0]?grp.members[0].chestNo:'')+'">'
    +'</div>'
    +'<div class="form-group"><label class="form-label">Member 2 <span style="font-size:.7rem;color:var(--text3)">(optional)</span></label>'
    +'<div style="position:relative">'
    +'<input class="form-input" id="grp-mem2-q" style="margin-bottom:0" autocomplete="off"'
    +' placeholder="Type name or chest no..."'
    +' value="'+mem2DisplayVal+'"'
    +' oninput="gfMem2Search(this.value)" onfocus="gfMem2Search(this.value)" onblur="gfMem2Blur()">'
    +'<div id="grp-mem2-res" style="display:none;position:absolute;z-index:1200;left:0;right:0;bottom:100%;margin-bottom:4px;background:var(--card);border:1px solid var(--accent)44;border-radius:10px;max-height:200px;overflow-y:auto;box-shadow:0 -4px 24px rgba(0,0,0,.55)"></div>'
    +'</div>'
    +'<input type="hidden" id="grp-mem2" value="'+mem2Val+'"></div>'
    +'<div class="form-group"><label class="form-label">Group Name</label>'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="grp-name" value="'+(grp.name||'')+'" placeholder="Auto: Captain &amp; Party" oninput="window._grpNameManual=true"></div>'
    +'</div>';
}

function gfSectionChange(){
  var sec=document.getElementById('grp-section').value;
  var items=DB.items().filter(function(i){return i.type==='group'&&(i.section===sec||isOpenSection(i.section));});
  var el=document.getElementById('grp-items-list');
  if(el){
    el.innerHTML=items.length
      ?items.map(function(i){
          var badge=i.isStage
            ?'<span style="font-size:.65rem;padding:2px 7px;border-radius:8px;background:rgba(240,165,0,.15);color:var(--accent);font-weight:700">On-Stage</span>'
            :'<span style="font-size:.65rem;padding:2px 7px;border-radius:8px;background:rgba(0,200,150,.15);color:var(--green);font-weight:700">Off-Stage</span>';
          var openBadge=(i.section!==sec&&isOpenSection(i.section))
            ?'<span style="font-size:.65rem;padding:2px 7px;border-radius:8px;background:rgba(74,158,255,.18);color:var(--blue);font-weight:700">'+i.section+'</span>':'';
          return '<label style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer">'
            +'<input type="checkbox" class="grp-item-cb" value="'+i.id+'"'
            +' style="width:16px;height:16px;accent-color:var(--accent)">'
            +'<span style="flex:1;font-size:.83rem">'+i.name+'</span>'+openBadge+badge+'</label>';
        }).join('')
      :'<div style="color:var(--text3);font-size:.8rem;padding:10px">No group items for this section</div>';
  }
  gfUpdateCaptainList();
}
// ── Group form searchable section ─────────────────────────────────
function gfSecSearch(q){
  var sects=DB.sections().filter(function(s){return DB.items().some(function(i){return i.type==='group'&&i.section===s;});});
  var res=document.getElementById('grp-sec-res'); if(!res) return;
  var cb=document.getElementById('grp-sec-clear'); if(cb) cb.style.display=q?'':'none';
  var fq=(q||'').toLowerCase().trim();
  var filtered=fq?sects.filter(function(s){return s.toLowerCase().indexOf(fq)>=0;}):sects;
  if(!filtered.length){res.innerHTML='<div style="padding:10px 14px;font-size:.82rem;color:var(--text3)">No sections found</div>';res.style.display='block';return;}
  var cur=document.getElementById('grp-section').value;
  res.innerHTML=filtered.map(function(s){return '<div data-val="'+s+'" onmousedown="gfSecSelect(this)" style="padding:9px 14px;cursor:pointer;font-size:.83rem;border-bottom:1px solid var(--border);'+(s===cur?'background:var(--accent)18;font-weight:700;color:var(--accent)':'')+'">'+s+'</div>';}).join('');
  res.style.display='block';
}
function gfSecBlur(){
  setTimeout(function(){
    var res=document.getElementById('grp-sec-res'); if(res) res.style.display='none';
    var q=document.getElementById('grp-section-q'), hid=document.getElementById('grp-section');
    if(q&&hid&&q.value!==hid.value){
      var sects=DB.sections();
      var match=sects.find(function(s){return s.toLowerCase()===q.value.toLowerCase();});
      if(match){hid.value=match;q.value=match;gfSectionChange();} else {q.value=hid.value;}
    }
    var cb=document.getElementById('grp-sec-clear'); if(cb) cb.style.display=(document.getElementById('grp-section-q')||{}).value?'':'none';
  },200);
}
function gfSecSelect(el){
  var val=el.getAttribute('data-val');
  var q=document.getElementById('grp-section-q'), hid=document.getElementById('grp-section');
  if(q) q.value=val; if(hid) hid.value=val;
  var res=document.getElementById('grp-sec-res'); if(res) res.style.display='none';
  var cb=document.getElementById('grp-sec-clear'); if(cb) cb.style.display=val?'':'none';
  gfSectionChange();
}
// ── Group form searchable team ────────────────────────────────────
function gfTeamSearch(q){
  // Team Managers must never be able to register a group under another team —
  // the input is marked readonly for typing, but that alone doesn't stop this
  // dropdown from opening and letting them tap a different team's name.
  if(isTeam()) return;
  var teams=DB.teams();
  var res=document.getElementById('grp-team-res'); if(!res) return;
  var cb=document.getElementById('grp-team-clear'); if(cb) cb.style.display=q?'':'none';
  var fq=(q||'').toLowerCase().trim();
  var filtered=fq?teams.filter(function(t){return t.name.toLowerCase().indexOf(fq)>=0;}):teams;
  if(!filtered.length){res.innerHTML='<div style="padding:10px 14px;font-size:.82rem;color:var(--text3)">No teams found</div>';res.style.display='block';return;}
  var cur=document.getElementById('grp-team').value;
  res.innerHTML=filtered.map(function(t){return '<div data-val="'+t.name+'" onmousedown="gfTeamSelectInput(this)" style="padding:9px 14px;cursor:pointer;font-size:.83rem;border-bottom:1px solid var(--border);'+(t.name===cur?'background:var(--accent)18;font-weight:700;color:var(--accent)':'')+'">'+t.name+'</div>';}).join('');
  res.style.display='block';
}
function gfTeamBlurInput(){
  if(isTeam()) return;
  setTimeout(function(){
    var res=document.getElementById('grp-team-res'); if(res) res.style.display='none';
    var q=document.getElementById('grp-team-q'), hid=document.getElementById('grp-team');
    if(q&&hid&&q.value!==hid.value){
      var match=DB.teams().find(function(t){return t.name.toLowerCase()===q.value.toLowerCase();});
      if(match){hid.value=match.name;q.value=match.name;gfTeamChange();} else {q.value=hid.value;}
    }
    var cb=document.getElementById('grp-team-clear'); if(cb) cb.style.display=(document.getElementById('grp-team-q')||{}).value?'':'none';
  },200);
}
function gfTeamSelectInput(el){
  if(isTeam()) return;
  var val=el.getAttribute('data-val');
  var q=document.getElementById('grp-team-q'), hid=document.getElementById('grp-team');
  if(q) q.value=val; if(hid) hid.value=val;
  var res=document.getElementById('grp-team-res'); if(res) res.style.display='none';
  var cb=document.getElementById('grp-team-clear'); if(cb) cb.style.display=val?'':'none';
  gfTeamChange();
  _grpChestLiveCheck();
}
function _grpChestLiveCheck(){
  var chestEl=document.getElementById('grp-chest');
  var warnEl=document.getElementById('grp-chest-warn');
  var btn=document.getElementById('grp-submit-btn');
  if(!chestEl||!warnEl) return;
  var team=isTeam()?currentTeamName():(document.getElementById('grp-team')?document.getElementById('grp-team').value:'');
  var chest=parseInt(chestEl.value);
  var range=_teamChestRange(team, isTeam());
  if(!range){
    warnEl.textContent='Your chest number range hasn\u2019t been set by Admin yet \u2014 contact Admin.';
    warnEl.style.display=chestEl.value!==''?'block':'none';
    chestEl.style.borderColor=chestEl.value!==''?'var(--red)':'';
    return;
  }
  var outOfRange = chestEl.value!=='' && !isNaN(chest) && (chest<range.from || chest>range.to);
  if(outOfRange){
    warnEl.textContent='Chest #'+chestEl.value+' is outside '+(team||'this team')+'\u2019s assigned range ('+range.from+'\u2013'+range.to+')';
    warnEl.style.display='block';
    chestEl.style.borderColor='var(--red)';
  } else {
    warnEl.style.display='none';
    chestEl.style.borderColor='';
  }
  if(btn){ btn.disabled=outOfRange; btn.style.opacity=outOfRange?'0.5':''; btn.style.cursor=outOfRange?'not-allowed':''; }
}
function gfCapBlur(){
  // Delay so onmousedown on result fires before hiding
  setTimeout(function(){var r=document.getElementById('grp-cap-res');if(r)r.style.display='none';},200);
}
function gfCapSearch(q){
  var team=document.getElementById('grp-team')?document.getElementById('grp-team').value:'';
  var section=document.getElementById('grp-section')?document.getElementById('grp-section').value:'';
  // Team filters which participants show here; Section only filters the Item
  // checklist above — it never restricts who can be picked as Captain/Member,
  // regardless of whether the section is Open or not.
  var parts=DB.participants().filter(function(p){
    return !team || p.team===team;
  });
  var res=document.getElementById('grp-cap-res'); if(!res) return;
  q=(q||'').toLowerCase().trim();
  var filtered=q?parts.filter(function(p){return p.name.toLowerCase().indexOf(q)>=0||String(p.chestNo).indexOf(q)>=0;}):parts;
  // Participants in the group's own section surface first (still sorted by
  // chest number within each group), so the person picking a captain/member
  // doesn't have to hunt through every other section's names first.
  filtered=filtered.slice().sort(function(a,b){
    var aM=a.section===section, bM=b.section===section;
    if(aM&&!bM) return -1;
    if(!aM&&bM) return 1;
    return (parseInt(a.chestNo)||0)-(parseInt(b.chestNo)||0);
  });
  if(!filtered.length){
    res.innerHTML='<div style="padding:10px 14px;font-size:.82rem;color:var(--text3)">No participants found</div>';
    res.style.display='block';
    var inp=document.getElementById('grp-captain-q');
    if(inp) inp.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  res.innerHTML=filtered.map(function(p){
    return '<div data-chest="'+p.chestNo+'" style="padding:9px 14px;cursor:pointer;font-size:.83rem;border-bottom:1px solid var(--border)" onmousedown="gfCapSelectEl(this)">'
      +'<span class="cap-name" style="font-weight:700">'+p.name+'</span>'
      +' <span style="font-size:.72rem;color:var(--text3)">#'+p.chestNo+' &middot; '+p.section+'</span>'
      +'</div>';
  }).join('');
  res.style.display='block';
  var inp=document.getElementById('grp-captain-q');
  if(inp) inp.scrollIntoView({behavior:'smooth',block:'center'});
}
function gfCapSelectEl(el){
  var chestNo=el.getAttribute('data-chest');
  var nameEl=el.querySelector('.cap-name');
  var name=nameEl?nameEl.textContent:'';
  var q=document.getElementById('grp-captain-q');
  var h=document.getElementById('grp-captain');
  var r=document.getElementById('grp-cap-res');
  if(q) q.value=name+' (#'+chestNo+')';
  if(h) h.value=chestNo;
  if(r) r.style.display='none';
  gfUpdateName();
}
function gfTeamChange(){
  var selTeam=document.getElementById('grp-team').value;
  var participants=DB.participants();
  var teamParts=selTeam?participants.filter(function(p){return p.team===selTeam;}):participants;
  // Clear captain and mem2 when team changes
  var cq=document.getElementById('grp-captain-q'); if(cq) cq.value='';
  var ch=document.getElementById('grp-captain');   if(ch) ch.value='';
  var cr=document.getElementById('grp-cap-res');   if(cr) cr.style.display='none';
  var mq=document.getElementById('grp-mem2-q');    if(mq) mq.value='';
  var mh=document.getElementById('grp-mem2');      if(mh) mh.value='';
  var mr=document.getElementById('grp-mem2-res');  if(mr) mr.style.display='none';
  // Refresh Group Chest No. to the next available number within the newly
  // selected team's range, since a chest number that was valid for the old
  // team is very likely outside the new team's assigned range.
  var chestEl=document.getElementById('grp-chest');
  if(chestEl){
    var nextChest=nextChestForTeam(selTeam, null, isTeam());
    chestEl.value=(nextChest!==null)?nextChest:'';
    _grpChestLiveCheck();
  }
  gfUpdateName();
}
function gfMem2Search(q){
  var team=document.getElementById('grp-team')?document.getElementById('grp-team').value:'';
  var section=document.getElementById('grp-section')?document.getElementById('grp-section').value:'';
  // Team filters which participants show here; Section only filters the Item
  // checklist above — it never restricts who can be picked as Captain/Member,
  // regardless of whether the section is Open or not.
  var parts=DB.participants().filter(function(p){
    return !team || p.team===team;
  });
  var res=document.getElementById('grp-mem2-res'); if(!res) return;
  var fq=(q||'').toLowerCase().trim();
  var filtered=fq?parts.filter(function(p){return p.name.toLowerCase().indexOf(fq)>=0||String(p.chestNo).indexOf(fq)>=0;}):parts;
  // Participants in the group's own section surface first (still sorted by
  // chest number within each group), matching the Captain search above.
  filtered=filtered.slice().sort(function(a,b){
    var aM=a.section===section, bM=b.section===section;
    if(aM&&!bM) return -1;
    if(!aM&&bM) return 1;
    return (parseInt(a.chestNo)||0)-(parseInt(b.chestNo)||0);
  });
  if(!filtered.length){
    res.innerHTML='<div style="padding:10px 14px;font-size:.82rem;color:var(--text3)">No participants found</div>';
    res.style.display='block'; return;
  }
  var cur=document.getElementById('grp-mem2').value;
  res.innerHTML=filtered.map(function(p){
    return '<div data-chest="'+p.chestNo+'" style="padding:9px 14px;cursor:pointer;font-size:.83rem;border-bottom:1px solid var(--border);'+(String(p.chestNo)===String(cur)?'background:var(--accent)18;font-weight:700;color:var(--accent)':'')+'" onmousedown="gfMem2SelectEl(this)">'
      +'<span class="mem2-name" style="font-weight:700">'+p.name+'</span>'
      +' <span style="font-size:.72rem;color:var(--text3)">#'+p.chestNo+' &middot; '+p.team+'</span>'
      +'</div>';
  }).join('');
  res.style.display='block';
}
function gfMem2Blur(){
  setTimeout(function(){var r=document.getElementById('grp-mem2-res');if(r)r.style.display='none';},200);
}
function gfMem2SelectEl(el){
  var chestNo=el.getAttribute('data-chest');
  var nameEl=el.querySelector('.mem2-name');
  var name=nameEl?nameEl.textContent:'';
  var q=document.getElementById('grp-mem2-q');
  var h=document.getElementById('grp-mem2');
  var r=document.getElementById('grp-mem2-res');
  if(q) q.value=name+' (#'+chestNo+')';
  if(h) h.value=chestNo;
  if(r) r.style.display='none';
}

function gfUpdateCaptainList(){
  // Captain and mem2 are now search inputs — just clear them when section/team changes
  var cq=document.getElementById('grp-captain-q'); if(cq) cq.value='';
  var ch=document.getElementById('grp-captain');   if(ch) ch.value='';
  var mq=document.getElementById('grp-mem2-q');    if(mq) mq.value='';
  var mh=document.getElementById('grp-mem2');      if(mh) mh.value='';
}
function gfUpdateName(){
  if(window._grpNameManual) return;
  var nameEl=document.getElementById('grp-name');
  if(!nameEl) return;
  var cq=document.getElementById('grp-captain-q');
  if(cq&&cq.value){
    var capName=cq.value.replace(/ \(#\d+\)$/,'').trim();
    if(capName) nameEl.value=capName+' & Party';
  }
}

function showAddGroup(){
  var items=DB.items().filter(function(i){return i.type==='group';});
  if(!items.length) return toast('No group items yet. Add group items first!','error');
  if(!DB.teams().length) return toast('No teams yet. Add teams first!','error');
  showModal('<div class="modal-handle"></div>'+
  '<button class="modal-close-btn" onclick="closeModal()" aria-label="Close">&times;</button>'+
  '<div class="modal-title"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Register Group</div>'
  +groupFormHTML()
  +'<button class="btn btn-primary mt-10" id="grp-submit-btn" onclick="saveGroup(-1)">Register Group</button>'
  +'<button class="btn btn-secondary mt-6" onclick="closeModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Close</button>',
  { saveCallback: function(){ saveGroup(-1); } }
);
setTimeout(_grpChestLiveCheck,60);
}

function showEditGroup(grpId){
  var groups=DB.groups();
  var idx=groups.findIndex(function(g){return g.id==grpId;});
  var grp=groups[idx];
  if(!grp) return toast('Group not found','error');
  showModal('<div class="modal-handle"></div>'+
  '<button class="modal-close-btn" onclick="closeModal()" aria-label="Close">&times;</button>'+
  '<div class="modal-title">Edit Group</div>'
  +groupFormHTML(grp)
  +'<button class="btn btn-primary mt-10" id="grp-submit-btn" onclick="saveGroup(\''+grpId+'\')">Save Changes</button>'
  +'<button class="btn btn-danger mt-6" onclick="deleteGroup(\''+grpId+'\')">Delete</button>'
  +'<button class="btn btn-secondary mt-6" onclick="closeModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Close</button>',
  { saveCallback: function(){ saveGroup(grpId); } }
);
setTimeout(_grpChestLiveCheck,60);
}

function saveGroup(grpId){
  var chest=document.getElementById('grp-chest').value.trim();
  if(!chest) return toast('Enter group chest number','error');
  var checkedCbs=document.querySelectorAll('input.grp-item-cb:checked');
  var itemIds=Array.from(checkedCbs).map(function(cb){return parseInt(cb.value);});
  if(!itemIds.length) return toast('Select at least one group item','error');
  var itemId=itemIds[0]; // primary item for backward compat
  var captainChest=document.getElementById('grp-captain').value;
  if(!captainChest) return toast('Select a captain','error');
  var participants=DB.participants();
  var captain=participants.find(function(p){return p.chestNo==captainChest;});
  if(!captain) return toast('Captain not found','error');
  // ── Duplicate group chest number check ──
  var isEdit=grpId!==-1&&grpId!==undefined&&grpId!==null;
  var allGroups=DB.groups();
  var dupGrp=allGroups.find(function(g){return g.groupChestNo==chest&&(!isEdit||g.id!=grpId);});
  if(dupGrp) return toast('Group chest #'+chest+' already used by "'+dupGrp.name+'"','error');
  var dupPart=participants.find(function(p){return p.chestNo==chest;});
  if(dupPart) return toast('Chest #'+chest+' already used by participant "'+dupPart.name+'"','error');
  var recTeamForRange=isTeam() ? currentTeamName() : document.getElementById('grp-team').value;
  var grpRangeChk=_teamChestRange(recTeamForRange, isTeam());
  if(!grpRangeChk) return toast('Your chest number range hasn\u2019t been set by Admin yet \u2014 contact Admin before adding groups.','error');
  if(parseInt(chest)<grpRangeChk.from || parseInt(chest)>grpRangeChk.to) return toast('Chest #'+chest+' is outside '+recTeamForRange+'\u2019s assigned range ('+grpRangeChk.from+'\u2013'+grpRangeChk.to+')','error');
  var members=[{chestNo:parseInt(captainChest),name:captain.name}];
  var mem2El=document.getElementById('grp-mem2');
  if(mem2El&&mem2El.value){
    var mem2=participants.find(function(p){return p.chestNo==mem2El.value;});
    if(mem2) members.push({chestNo:parseInt(mem2El.value),name:mem2.name});
  }
  var customName=document.getElementById('grp-name').value.trim();
  var finalName=applyTextCase(customName||(captain.name+' & Party'));
  var item=DB.items().find(function(i){return i.id==itemId;});
  // isOnStage is derived from the item definition (set in Add Item), not from group registration
  var isOnStage=item?!!item.isStage:false;
  var groups=DB.groups();
  var existingIdx=isEdit?groups.findIndex(function(g){return g.id==grpId;}):-1;
  var recSec=document.getElementById('grp-section').value;
  var recTeam=isTeam() ? currentTeamName() : document.getElementById('grp-team').value;
  // Remember last used section/team for next add
  if(existingIdx<0){ window._lastGrpSection=recSec; window._lastGrpTeam=recTeam; }
  var rec={
    id:existingIdx>=0?grpId:_nextUniqueIds(groups,1)[0],
    groupChestNo:parseInt(chest),
    name:finalName,
    section:recSec,
    team:recTeam,
    itemId:itemId, itemIds:itemIds, itemName:item?item.name:'',
    captainChestNo:parseInt(captainChest),
    members:members,
    isOnStage:isOnStage
  };
  if(existingIdx>=0) groups[existingIdx]=rec; else groups.push(rec);
  DB.saveGroups(groups);
  window._grpNameManual=false;
  window._lastPartTab='groups';
  _closeModalClean();
  toast(existingIdx>=0?'Group updated!':'Group registered!');
  if(window._aiiGroupReturnItemId){
    var retItemId=window._aiiGroupReturnItemId;
    window._aiiGroupReturnItemId=null;
    _aiiReopenForItem(retItemId);
  } else {
    renderKeepScroll('participants',{tab:'groups'});
  }
}

function deleteGroup(grpId){
  var grp=DB.groups().find(function(g){return g.id==grpId;});
  var marks=DB.marks();
  var grpMarks=grp?marks.filter(function(m){return m.chestNo===grp.groupChestNo&&m.total>0;}):[];
  var details='';
  if(grp&&grp.itemName) details+='<div style="margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg> Item: <b>'+grp.itemName+'</b></div>';
  if(grpMarks.length) details+='<div style="margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="M5 7 2 14a3 3 0 0 0 6 0Z"/><path d="M19 7l-3 7a3 3 0 0 0 6 0Z"/></svg> <b>'+grpMarks.length+'</b> mark record'+(grpMarks.length>1?'s':'')+'</div>';
  showModal('<div style="text-align:center;padding:8px">'
    +'<div style="font-size:2.5rem;margin-bottom:10px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></div>'
    +'<div style="font-size:1rem;font-weight:800;margin-bottom:4px">Delete Group?</div>'
    +(grp?'<div style="font-size:.88rem;color:var(--accent);font-weight:700;margin-bottom:12px">"'+grp.name+'"</div>':'')
    +(details?'<div style="background:rgba(255,71,87,.08);border:1px solid rgba(255,71,87,.3);border-radius:10px;padding:12px;text-align:left;font-size:.8rem;color:var(--text2);margin-bottom:14px">'
      +'<div style="font-weight:700;color:var(--red);margin-bottom:8px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg> The following will also be deleted:</div>'
      +details+'</div>':
      '<div style="font-size:.82rem;color:var(--text3);margin-bottom:14px">This action cannot be undone.</div>')
    +'<div style="display:flex;gap:8px">'
    +'<button class="btn btn-danger" style="flex:1" onclick="confirmDeleteGroup(\''+grpId+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg> Delete</button>'
    +'<button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>'
    +'</div></div>');
}
function confirmDeleteGroup(grpId){
  var grp=DB.groups().find(function(g){return g.id==grpId;});
  var groups=DB.groups().filter(function(g){return g.id!=grpId;});
  var marks=grp?DB.marks().filter(function(m){return m.chestNo!==grp.groupChestNo;}):DB.marks();
  DB.saveGroups(groups);
  DB.saveMarks(marks);
  window._lastPartTab='groups';
  _closeModalClean(); toast('Deleted!'); renderKeepScroll('participants',{tab:'groups'});
}

function filterParticipantList(q, sec){
  var participants=DB.participants(), items=DB.items();
  q=(q||'').toLowerCase();
  var cb=document.getElementById('p-clear-btn'); if(cb) cb.style.display=q?'':'none';
  var filtered=(sec==='All'?participants:participants.filter(function(p){return p.section===sec;}))
    .filter(function(p){return !q||p.name.toLowerCase().includes(q)||String(p.chestNo).includes(q)||p.team.toLowerCase().includes(q);});
  var el=document.getElementById('p-list');
  if(!el) return;
  el.innerHTML=!filtered.length
    ?'<div style="text-align:center;padding:30px;color:var(--text3)">No participants found</div>'
    :filtered.map(function(p){
      var pItems=(p.items||[]).map(function(id){var it=items.find(function(x){return x.id===id;});return it?it.name:'';}).filter(Boolean).join(', ');
      var uid='pc-'+p.chestNo;
      var avatarHtml=participantAvatarHTML(p,40);
      return '<div class="list-item" style="flex-direction:column;align-items:stretch;padding:0;overflow:hidden">'
        +'<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;cursor:pointer" onclick="var d=document.getElementById(\''+uid+'\');d.style.display=d.style.display===\'none\'?\'block\':\'none\'">'
        +avatarHtml
        +'<div class="list-info"><div class="list-title">'+p.name+'</div>'
        +'<div class="list-sub">#'+p.chestNo+' &middot; '+p.team+' &middot; <span style="color:var(--accent)">'+p.section+'</span></div></div>'
        +'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--text3)"><polyline points="6 9 12 15 18 9"/></svg>'
        +'</div>'
        +'<div id="'+uid+'" style="display:none;border-top:1px solid var(--border);padding:10px 14px;background:var(--bg3)">'
        +(pItems?'<div style="font-size:.78rem;color:var(--text3);margin-bottom:8px">Items: <span style="color:var(--text2)">'+pItems+'</span></div>':'')
        +'<div style="display:flex;gap:6px">'
        +'<button class="btn btn-secondary btn-xs" onclick="showEditParticipant('+p.chestNo+');event.stopPropagation()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg> Edit</button>'
        +'<button class="btn btn-danger btn-xs" onclick="deleteParticipant('+p.chestNo+');event.stopPropagation()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg> Delete</button>'
        +'</div></div>'
        +'</div>';
    }).join('');
}


function renderParticipants(data){
  data=data||{};
  var participants=DB.participants(),sections=DB.sections(),items=DB.items(),groups=DB.groups();
  if(isTeam()){
    var _myTeam=currentTeamName();
    participants=participants.filter(function(p){return p.team===_myTeam;});
    groups=groups.filter(function(g){return g.team===_myTeam;});
  }
  // Remember last tab
  if(data.tab) window._lastPartTab=data.tab;
  var sec=data.section||'All', tab=data.tab||(window._lastPartTab||'list'), q=(data.q||'').toLowerCase();
  var tabBar='<div class="tabs tabs-fit" style="margin-bottom:6px">'
    +'<div class="tab '+(tab==='list'?'active':'')+'" onclick="render(\'participants\',{tab:\'list\',section:\''+sec+'\'})"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Individuals</div>'
    +'<div class="tab '+(tab==='groups'?'active':'')+'" onclick="render(\'participants\',{tab:\'groups\',gTeam:\'All\',gq:\'\'})"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Groups</div>'
    +'</div>';
  if(tab==='groups'){
    var gq=(data.gq||'').toLowerCase();
    var gTeam=data.gTeam||'All';
    var gSec=data.gSec||'All';
    var teams=DB.teams();
    var filteredGroups=groups.filter(function(g){
      var teamOk=(gTeam==='All'||g.team===gTeam);
      var secOk=(gSec==='All'||g.section===gSec);
      var qOk=!gq||g.name.toLowerCase().includes(gq)||String(g.groupChestNo).includes(gq)||(g.team||'').toLowerCase().includes(gq)||(g.itemName||'').toLowerCase().includes(gq);
      return teamOk&&secOk&&qOk;
    })
    // Sorted by Section, then Chest Number — same order as the Individuals list
    .sort(function(a,b){
      var secA=a.section||'', secB=b.section||'';
      if(secA!==secB) return secA.localeCompare(secB);
      return (parseInt(a.groupChestNo)||0)-(parseInt(b.groupChestNo)||0);
    });
    var grpTeamFilter='<div style="display:flex;gap:6px;margin-bottom:8px;overflow-x:auto;padding-bottom:4px">'
      +'<button class="btn btn-sm '+(gTeam==='All'?'btn-primary':'btn-secondary')+'" onclick="render(\'participants\',{tab:\'groups\',gTeam:\'All\',gSec:\''+gSec+'\',gq:\''+gq+'\'})">All</button>'
      +teams.map(function(t){var cnt=groups.filter(function(g){return g.team===t.name&&(gSec==='All'||g.section===gSec);}).length;return '<button class="btn btn-sm '+(gTeam===t.name?'btn-primary':'btn-secondary')+'" onclick="render(\'participants\',{tab:\'groups\',gTeam:\''+t.name+'\',gSec:\''+gSec+'\',gq:\''+gq+'\'})">'+(t.shortName||t.name)+' ('+cnt+')</button>';}).join('')
      +'</div>';
    // Section filter uses the same "tabs" component & text size as the Individuals tab
    // (rather than plain pill buttons) so both tabs look and feel identical.
    var grpSecFilter='<div class="tabs">'
      +'<div class="tab '+(gSec==='All'?'active':'')+'" onclick="render(\'participants\',{tab:\'groups\',gTeam:\''+gTeam+'\',gSec:\'All\',gq:\''+gq+'\'})">All ('+groups.filter(function(g){return gTeam==='All'||g.team===gTeam;}).length+')</div>'
      +sections.map(function(s){var cnt=groups.filter(function(g){return g.section===s&&(gTeam==='All'||g.team===gTeam);}).length;return '<div class="tab '+(gSec===s?'active':'')+'" onclick="render(\'participants\',{tab:\'groups\',gTeam:\''+gTeam+'\',gSec:\''+s+'\',gq:\''+gq+'\'})">'+getSectionShortName(s)+' ('+cnt+')</div>';}).join('')
      +'</div>';
    var grpHtml=!filteredGroups.length
      ?'<div style="text-align:center;padding:30px;color:var(--text3)">No groups found</div>'
      :filteredGroups.map(function(g){
        return '<div class="list-item">'
          +groupAvatarHTML(40)
          +'<div class="list-info"><div class="list-title">'+g.name+'</div>'
          +'<div class="list-sub">#'+g.groupChestNo+' &middot; '+g.team+' &middot; '+g.itemName+' &middot; '+g.section+'</div></div>'
          +'<div style="display:flex;gap:6px">'
          +'<button class="btn btn-secondary btn-xs" aria-label="Edit group" onclick="showEditGroup(\''+g.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>'
          +'<button class="btn btn-danger btn-xs" aria-label="Delete group" onclick="deleteGroup(\''+g.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button></div></div>';
      }).join('');
    return tabBar
      +grpTeamFilter
      +grpSecFilter
      +'<div style="display:flex;gap:8px;margin-bottom:10px">'
      +'<div style="position:relative;flex:1">'
      +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" style="margin-bottom:0;padding-right:36px" id="grp-search" placeholder="Search groups..." value="'+(data.gq||'')+'" oninput="filterGroupsList(this.value)">'
      +'<button id="grp-clear-btn" onclick="filterGroupsList(\'\');document.getElementById(\'grp-search\').value=\'\'" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px;display:'+(data.gq?'':'none')+'"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
      +'</div>'
      +'</div>'
      +'<div id="grp-list">'+grpHtml+'</div>';
  }
  var filtered=(sec==='All'?participants:participants.filter(function(p){return p.section===sec;}))
    .filter(function(p){
      var teamOk=!data.team||data.team==='All'||p.team===data.team;
      return teamOk&&(!q||p.name.toLowerCase().includes(q)||String(p.chestNo).includes(q)||(p.team||'').toLowerCase().includes(q));
    })
    // Sorted by Section, then Chest Number
    .sort(function(a,b){
      var secA=a.section||'', secB=b.section||'';
      if(secA!==secB) return secA.localeCompare(secB);
      return (parseInt(a.chestNo)||0)-(parseInt(b.chestNo)||0);
    });
  var teams=DB.teams();
  var teamFlt=data.team||'All';
  var teamFilter='<div style="display:flex;gap:6px;margin-bottom:8px;overflow-x:auto;padding-bottom:4px">'
    +'<button class="btn btn-sm '+(teamFlt==='All'?'btn-primary':'btn-secondary')+'" onclick="render(\'participants\',{section:\''+sec+'\',tab:\'list\',team:\'All\'})">All</button>'
    +teams.map(function(t){var cnt=participants.filter(function(p){return p.team===t.name&&(sec==='All'||p.section===sec);}).length;return '<button class="btn btn-sm '+(teamFlt===t.name?'btn-primary':'btn-secondary')+'" onclick="render(\'participants\',{section:\''+sec+'\',tab:\'list\',team:\''+t.name+'\'})">'+(t.shortName||t.name)+' ('+cnt+')</button>';}).join('')
    +'</div>';
  var secTabs='<div class="tabs"><div class="tab '+(sec==='All'?'active':'')+'" onclick="render(\'participants\',{section:\'All\',tab:\'list\'})">All ('+participants.length+')</div>'
    +sections.map(function(s){var cnt=participants.filter(function(p){return p.section===s;}).length;return '<div class="tab '+(sec===s?'active':'')+'" onclick="render(\'participants\',{section:\''+s+'\',tab:\'list\'})">'+getSectionShortName(s)+' ('+cnt+')</div>';}).join('')+'</div>';
  var listHtml=!filtered.length
    ?'<div style="text-align:center;padding:30px;color:var(--text3)">No participants found</div>'
    :filtered.map(function(p){
      var pItems=(p.items||[]).map(function(id){var it=items.find(function(x){return x.id===id;});return it?it.name:'';}).filter(Boolean).join(', ');
      var uid='pc-'+p.chestNo;
      var avatarHtml=participantAvatarHTML(p,40);
      return '<div class="list-item" style="flex-direction:column;align-items:stretch;padding:0;overflow:hidden">'
        +'<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;cursor:pointer" onclick="var d=document.getElementById(\''+uid+'\');d.style.display=d.style.display===\'none\'?\'block\':\'none\'">'
        +avatarHtml
        +'<div class="list-info"><div class="list-title">'+p.name+'</div>'
        +'<div class="list-sub">#'+p.chestNo+' &middot; '+p.team+' &middot; <span style="color:var(--accent)">'+p.section+'</span></div></div>'
        +'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--text3)"><polyline points="6 9 12 15 18 9"/></svg>'
        +'</div>'
        +'<div id="'+uid+'" style="display:none;border-top:1px solid var(--border);padding:10px 14px;background:var(--bg3)">'
        +(pItems?'<div style="font-size:.78rem;color:var(--text3);margin-bottom:8px">Items: <span style="color:var(--text2)">'+pItems+'</span></div>':'')
        +'<div style="display:flex;gap:6px">'
        +'<button class="btn btn-secondary btn-xs" onclick="showEditParticipant('+p.chestNo+');event.stopPropagation()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg> Edit</button>'
        +'<button class="btn btn-danger btn-xs" onclick="deleteParticipant('+p.chestNo+');event.stopPropagation()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg> Delete</button>'
        +'</div></div>'
        +'</div>';
    }).join('');
  return tabBar+teamFilter+secTabs
    +'<div style="position:relative;margin-bottom:8px">'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" style="margin-bottom:0;padding-right:36px" id="p-search" placeholder="Search..." value="'+(data.q||'')+'" oninput="filterParticipantListInPlace(this.value,\''+sec+'\')">'  
    +'<button id="p-clear-btn" onclick="filterParticipantListInPlace(\'\',\''+sec+'\');document.getElementById(\'p-search\').value=\'\'" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px;display:'+(data.q?'':'none')+'"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
    +'</div>'
    +'<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:4px">'
    +'<button class="btn btn-secondary btn-sm" style="flex-shrink:0" onclick="showBulkAddParticipants()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg> Bulk Add</button>'
    +'</div>'
    +'<div id="p-list">'+listHtml+'</div>';
}

function rpSec(si){ render('participants',{section:si<0?'All':(window._rpSecs||[])[si]||'All',tab:window._rpTab||'individuals'}); }
function filterGroupsList(q){
  q=(q||'').toLowerCase().trim();
  var wrap=document.getElementById('grp-list');
  var cb=document.getElementById('grp-clear-btn');
  if(cb) cb.style.display=q?'':'none';
  if(!wrap) return;
  var cards=wrap.children;
  for(var i=0;i<cards.length;i++){
    var titleEl=cards[i].querySelector('.list-title');
    var subEl=cards[i].querySelector('.list-sub');
    var text = (titleEl?titleEl.textContent:'') + ' ' + (subEl?subEl.textContent:'');
    cards[i].style.display = (!q || text.toLowerCase().includes(q)) ? '' : 'none';
  }
}
function filterItemListInPlace(q,sec){
  var cb=document.getElementById('i-clear-btn');
  if(cb) cb.style.display=q?'':'none';
  filterItemList(q,sec);
}
function clearItemSearch(){
  var input = document.getElementById('i-search');
  if(input) input.value = '';
  // refresh with current tab section
  var sec = 'All';
  var activeTab = document.querySelector('.tab.active');
  if(activeTab && activeTab.textContent.includes('(')) {
    var txt = activeTab.textContent;
    if(txt !== 'All') sec = txt.split(' (')[0];
  }
  filterItemListInPlace('', sec);
}
function filterParticipantListInPlace(q,sec){
  var cb=document.getElementById('p-clear-btn');
  if(cb) cb.style.display=q?'':'none';
  filterParticipantList(q,sec);
}
function rpTab(ti){ render('participants',{section:window._rpSec||'All',tab:ti===0?'individuals':'groups'}); }

function participantFormHTML(p){
  p=p||{};
  // Preserve _partPhotoData if returning from crop session; otherwise init from participant
  if(!window._partCropJustDone){
    _partPhotoData = p.photo || null;
  }
  window._partCropJustDone = false;
  var isEdit=!!(p&&p.chestNo);
  var teams=DB.teams(), sections=DB.sections(), items=DB.items(), participants=DB.participants(), groups=DB.groups();
  // For add mode use remembered values; for edit use participant's own values
  var selectedSection=isEdit ? p.section : (window._lastPartSection !== undefined ? window._lastPartSection : (sections[0]||''));
  var selectedTeam   =isTeam() ? currentTeamName() : (isEdit ? p.team    : (window._lastPartTeam    !== undefined ? window._lastPartTeam    : (teams[0]&&teams[0].name||'')));
  // Calculate next available chest number within the selected team's assigned range
  // (unique across participants AND groups)
  var nextChest = nextChestForTeam(selectedTeam, null, isTeam());
  var chestRangeNote = '';
  if(nextChest===null){
    var _r=_teamChestRange(selectedTeam, isTeam());
    chestRangeNote = _r
      ? '<div style="font-size:.68rem;color:var(--red);margin-top:-8px;margin-bottom:10px">No chest numbers left in '+selectedTeam+'\u2019s range ('+_r.from+'\u2013'+_r.to+') &mdash; ask Admin to widen it.</div>'
      : '<div style="font-size:.68rem;color:var(--red);margin-top:-8px;margin-bottom:10px">Your chest number range hasn\u2019t been set by Admin yet &mdash; contact Admin.</div>';
    nextChest='';
  }
  // Individual items for this section, plus any Open/Cross-Section items (available to all sections)
  var sectionItems=items.filter(function(i){return i.type!=='group' && (i.section===selectedSection || isOpenSection(i.section));});
  var selectedItems=p.items||[];

  // Section & team use searchable dropdown (same pattern as captain chooser)
  var itemList=sectionItems.length
    ?sectionItems.map(function(item){
        var badge=item.isStage
          ?'<span style="font-size:.68rem;padding:1px 6px;border-radius:8px;background:rgba(240,165,0,.15);color:var(--accent)">Stage</span>'
          :'<span style="font-size:.68rem;padding:1px 6px;border-radius:8px;background:rgba(0,200,150,.15);color:var(--green)">Off-Stage</span>';
        var openBadge=(item.section!==selectedSection&&isOpenSection(item.section))
          ?'<span style="font-size:.68rem;padding:1px 6px;border-radius:8px;background:rgba(74,158,255,.18);color:var(--blue)">'+item.section+'</span>':'';
        return '<label style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border);cursor:pointer">'
          +'<input type="checkbox" class="item-cb" value="'+item.id+'"'+(selectedItems.includes(item.id)?' checked':'')
          +' style="width:16px;height:16px;accent-color:var(--accent)">'
          +'<span style="flex:1;font-size:.83rem">'+item.name+'</span>'+openBadge+badge+'</label>';
      }).join('')
    :'<div style="color:var(--text3);font-size:.8rem;padding:10px">No individual items for this section</div>';

  return participantPhotoFormHTML(_partPhotoData)
    +'<div class="form-row">'
    +'<div class="form-group"><label class="form-label">Team</label>'
    +'<div style="position:relative">'
    +'<input class="form-input" id="np-team-q" style="margin-bottom:0;padding-right:36px" autocomplete="off"'
    +(isTeam()?' readonly':'')
    +' placeholder="Search team..." value="'+selectedTeam+'"'
    +' oninput="pfTeamSearch(this.value)" onfocus="pfTeamSearch(this.value)" onblur="pfTeamBlur()">'
    +'<button type="button" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px;display:'+(selectedTeam&&!isTeam()?'':'none')+'" id="np-team-clear" onclick="if(!isTeam()){document.getElementById(\'np-team-q\').value=\'\';document.getElementById(\'np-team\').value=\'\';this.style.display=\'none\';}"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
    +'<div id="np-team-res" style="display:none;position:absolute;z-index:1200;left:0;right:0;top:100%;margin-top:3px;background:var(--card);border:1px solid var(--accent)44;border-radius:10px;max-height:180px;overflow-y:auto;box-shadow:0 6px 20px rgba(0,0,0,.4)"></div>'
    +'</div>'
    +'<input type="hidden" id="np-team" value="'+selectedTeam+'"></div>'
    +'<div class="form-group"><label class="form-label">Section</label>'
    +'<div style="position:relative">'
    +'<input class="form-input" id="np-section-q" style="margin-bottom:0;padding-right:36px" autocomplete="off"'
    +' placeholder="Search section..." value="'+selectedSection+'"'
    +' oninput="pfSecSearch(this.value)" onfocus="pfSecSearch(this.value)" onblur="pfSecBlur()">'
    +'<button type="button" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px;display:'+(selectedSection?'':'none')+'" id="np-sec-clear" onclick="document.getElementById(\'np-section-q\').value=\'\';document.getElementById(\'np-section\').value=\'\';this.style.display=\'none\';pfSectionChange()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
    +'<div id="np-sec-res" style="display:none;position:absolute;z-index:1200;left:0;right:0;top:100%;margin-top:3px;background:var(--card);border:1px solid var(--accent)44;border-radius:10px;max-height:180px;overflow-y:auto;box-shadow:0 6px 20px rgba(0,0,0,.4)"></div>'
    +'</div>'
    +'<input type="hidden" id="np-section" value="'+selectedSection+'"></div>'
    +'</div>'
    +'<div class="form-group"><label class="form-label">Items</label>'
    +'<div id="np-items" style="max-height:220px;overflow-y:auto;background:var(--input-bg);border:1px solid var(--border);border-radius:10px;padding:8px 12px">'
    +itemList+'</div></div>'
    +chestRangeNote
    +'<div class="form-row">'
    +'<div class="form-group"><label class="form-label">Chest No.</label>'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="np-chest" type="number" value="'+(p.chestNo||nextChest)+'" oninput="_npChestLiveCheck()"></div>'
    +'<div class="form-group"><label class="form-label">Name</label>'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="np-name" value="'+(p.name||'')+'" placeholder="Full name"></div>'
    +'</div>'
    +'<div id="np-chest-warn" style="display:none;font-size:.72rem;color:var(--red);margin-top:-8px;margin-bottom:10px"></div>';
}
// ── Participant form searchable section dropdown ─────────────────
function pfSecSearch(q){
  var all=DB.sections().filter(function(s){return !isOpenSection(s);});
  var res=document.getElementById('np-sec-res'); if(!res) return;
  var cb=document.getElementById('np-sec-clear'); if(cb) cb.style.display=q?'':'none';
  q=(q||'').toLowerCase().trim();
  var filtered=q?all.filter(function(s){return s.toLowerCase().indexOf(q)>=0;}):all;
  if(!filtered.length){res.innerHTML='<div style="padding:10px 14px;font-size:.82rem;color:var(--text3)">No sections found</div>';res.style.display='block';return;}
  var cur=document.getElementById('np-section').value;
  res.innerHTML=filtered.map(function(s){return '<div data-val="'+s+'" onmousedown="pfSecSelect(this)" style="padding:9px 14px;cursor:pointer;font-size:.83rem;border-bottom:1px solid var(--border);'+(s===cur?'background:var(--accent)18;font-weight:700;color:var(--accent)':'')+'">'+s+'</div>';}).join('');
  res.style.display='block';
}
function pfSecBlur(){
  setTimeout(function(){
    var res=document.getElementById('np-sec-res'); if(res) res.style.display='none';
    var q=document.getElementById('np-section-q'), hid=document.getElementById('np-section');
    if(q&&hid&&q.value!==hid.value){
      var match=DB.sections().filter(function(s){return !isOpenSection(s);}).find(function(s){return s.toLowerCase()===q.value.toLowerCase();});
      if(match){hid.value=match;q.value=match;pfSectionChange();} else {q.value=hid.value;}
    }
    var cb=document.getElementById('np-sec-clear'); if(cb) cb.style.display=(document.getElementById('np-section-q')||{}).value?'':'none';
  },200);
}
function pfSecSelect(el){
  var val=el.getAttribute('data-val');
  var q=document.getElementById('np-section-q'), hid=document.getElementById('np-section');
  if(q) q.value=val; if(hid) hid.value=val;
  var res=document.getElementById('np-sec-res'); if(res) res.style.display='none';
  var cb=document.getElementById('np-sec-clear'); if(cb) cb.style.display=val?'':'none';
  pfSectionChange();
}
function _npChestLiveCheck(){
  var chestEl=document.getElementById('np-chest');
  var warnEl=document.getElementById('np-chest-warn');
  var btn=document.getElementById('np-submit-btn');
  if(!chestEl||!warnEl) return;
  var team=isTeam()?currentTeamName():(document.getElementById('np-team')?document.getElementById('np-team').value:'');
  var chest=parseInt(chestEl.value);
  var range=_teamChestRange(team, isTeam());
  if(!range){
    var noRange=chestEl.value!=='';
    warnEl.textContent='Your chest number range hasn\u2019t been set by Admin yet \u2014 contact Admin.';
    warnEl.style.display=noRange?'block':'none';
    chestEl.style.borderColor=noRange?'var(--red)':'';
    if(btn){ btn.disabled=noRange; btn.style.opacity=noRange?'0.5':''; btn.style.cursor=noRange?'not-allowed':''; }
    return;
  }
  var outOfRange = chestEl.value!=='' && !isNaN(chest) && (chest<range.from || chest>range.to);
  if(outOfRange){
    warnEl.textContent='Chest #'+chestEl.value+' is outside '+(team||'this team')+'\u2019s assigned range ('+range.from+'\u2013'+range.to+')';
    warnEl.style.display='block';
    chestEl.style.borderColor='var(--red)';
  } else {
    warnEl.style.display='none';
    chestEl.style.borderColor='';
  }
  if(btn){ btn.disabled=outOfRange; btn.style.opacity=outOfRange?'0.5':''; btn.style.cursor=outOfRange?'not-allowed':''; }
}
function pfSectionChange(){
  var sec=document.getElementById('np-section').value;
  // Preserve whatever is already ticked before the list gets rebuilt —
  // previously this rebuilt the checkbox list from scratch with no
  // "checked" attribute at all, silently un-checking any item the admin
  // had just ticked (including ones still valid under the new section,
  // e.g. Open Section items) the moment this ran.
  var previouslyChecked=getCheckedItems();
  var items=DB.items().filter(function(i){return i.type!=='group' && (i.section===sec || isOpenSection(i.section));});
  var itemList=items.length
    ?items.map(function(item){
        var badge=item.isStage
          ?'<span style="font-size:.68rem;padding:1px 6px;border-radius:8px;background:rgba(240,165,0,.15);color:var(--accent)">Stage</span>'
          :'<span style="font-size:.68rem;padding:1px 6px;border-radius:8px;background:rgba(0,200,150,.15);color:var(--green)">Off-Stage</span>';
        var openBadge=(item.section!==sec&&isOpenSection(item.section))
          ?'<span style="font-size:.68rem;padding:1px 6px;border-radius:8px;background:rgba(74,158,255,.18);color:var(--blue)">'+item.section+'</span>':'';
        return '<label style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border);cursor:pointer">'
          +'<input type="checkbox" class="item-cb" value="'+item.id+'"'+(previouslyChecked.includes(item.id)?' checked':'')
          +' style="width:16px;height:16px;accent-color:var(--accent)">'
          +'<span style="flex:1;font-size:.83rem">'+item.name+'</span>'+openBadge+badge+'</label>';
      }).join('')
    :'<div style="color:var(--text3);font-size:.8rem;padding:10px">No individual items for this section</div>';
  document.getElementById('np-items').innerHTML=itemList;
}
// ── Participant form searchable team dropdown ─────────────────────
function pfTeamSearch(q){
  // Team Managers must never be able to register a participant under another
  // team — the input is marked readonly for typing, but that alone doesn't stop
  // this dropdown from opening and letting them tap a different team's name.
  if(isTeam()) return;
  var all=DB.teams();
  var res=document.getElementById('np-team-res'); if(!res) return;
  var cb=document.getElementById('np-team-clear'); if(cb) cb.style.display=q?'':'none';
  q=(q||'').toLowerCase().trim();
  var filtered=q?all.filter(function(t){return t.name.toLowerCase().indexOf(q)>=0;}):all;
  if(!filtered.length){res.innerHTML='<div style="padding:10px 14px;font-size:.82rem;color:var(--text3)">No teams found</div>';res.style.display='block';return;}
  var cur=document.getElementById('np-team').value;
  res.innerHTML=filtered.map(function(t){return '<div data-val="'+t.name+'" onmousedown="pfTeamSelect(this)" style="padding:9px 14px;cursor:pointer;font-size:.83rem;border-bottom:1px solid var(--border);'+(t.name===cur?'background:var(--accent)18;font-weight:700;color:var(--accent)':'')+'">'+t.name+'</div>';}).join('');
  res.style.display='block';
}
function pfTeamBlur(){
  if(isTeam()) return;
  setTimeout(function(){
    var res=document.getElementById('np-team-res'); if(res) res.style.display='none';
    var q=document.getElementById('np-team-q'), hid=document.getElementById('np-team');
    if(q&&hid&&q.value!==hid.value){
      var match=DB.teams().find(function(t){return t.name.toLowerCase()===q.value.toLowerCase();});
      if(match){hid.value=match.name;q.value=match.name;_pfRefreshChestForTeam(match.name);_npChestLiveCheck();} else {q.value=hid.value;}
    }
    var cb=document.getElementById('np-team-clear'); if(cb) cb.style.display=(document.getElementById('np-team-q')||{}).value?'':'none';
  },200);
}
function pfTeamSelect(el){
  if(isTeam()) return;
  var val=el.getAttribute('data-val');
  var q=document.getElementById('np-team-q'), hid=document.getElementById('np-team');
  if(q) q.value=val; if(hid) hid.value=val;
  var res=document.getElementById('np-team-res'); if(res) res.style.display='none';
  var cb=document.getElementById('np-team-clear'); if(cb) cb.style.display=val?'':'none';
  _pfRefreshChestForTeam(val);
  _npChestLiveCheck();
}
// Refreshes Chest No. to the next available number within the newly selected
// team's range, since a chest number valid for the old team is very likely
// outside the new team's assigned range.
function _pfRefreshChestForTeam(teamName){
  var chestEl=document.getElementById('np-chest');
  if(!chestEl) return;
  var nextChest=nextChestForTeam(teamName, null, isTeam());
  chestEl.value=(nextChest!==null)?nextChest:'';
}

function buildItemCheckboxes(sectionItems, selectedIds, groupNames){
  if(!sectionItems.length) return '<div style="color:var(--text3);font-size:.8rem">No items for this section</div>';
  return sectionItems.map(item=>{
    const badge=item.type==='group'
      ?'<span style="font-size:.68rem;padding:2px 7px;border-radius:10px;background:rgba(74,158,255,.15);color:var(--blue)">Group</span>'
      :item.isStage
        ?'<span style="font-size:.68rem;padding:2px 7px;border-radius:10px;background:rgba(240,165,0,.15);color:var(--accent)">On-Stage</span>'
        :'<span style="font-size:.68rem;padding:2px 7px;border-radius:10px;background:rgba(0,200,150,.15);color:var(--green)">Off-Stage</span>';
    return '<div style="padding:7px 0;border-bottom:1px solid rgba(58,31,110,.2)">'
      +'<label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:.82rem">'
      +'<input type="checkbox" class="item-cb" value="'+item.id+'"'+(selectedIds.includes(item.id)?' checked':'')
      +' style="width:16px;height:16px;accent-color:var(--accent)">'
      +'<span style="flex:1">'+item.name+'</span>'+badge
      +'</label></div>';
  }).join('');
}

function toggleGroupName(cb, itemId, isGroup){
  if(!isGroup) return;
  const el=document.getElementById('gname-'+itemId);
  if(el) el.style.display=cb.checked?'block':'none';
}
function updateItemsForSection(selectedIds){
  selectedIds=selectedIds||[];
  const section=v('np-section');
  const items=DB.items().filter(i=>i.section===section||isOpenSection(i.section));
  document.getElementById('np-items').innerHTML=buildItemCheckboxes(items, selectedIds, {});
}
function showAddParticipant(){
  window._partAfterCrop=function(){ showAddParticipant(); };
  showModal('<div class="modal-handle"></div>'+
  '<button class="modal-close-btn" onclick="closeModal()" aria-label="Close">&times;</button>'+
  '<div class="modal-title">Add Participant</div>'+participantFormHTML()+
  '<button class="btn btn-primary mt-10" id="np-submit-btn" onclick="addParticipant()">Add Participant</button>'+
  '<button class="btn btn-secondary mt-6" onclick="closeModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Close</button>',
  { saveCallback: addParticipant }
);

  setTimeout(pfSectionChange,50);
  setTimeout(_npChestLiveCheck,60);
  if (_savedParticipantFormData) { _restoreParticipantFormData(); }   // <-- ADD THIS LINE
}
function showEditParticipant(chestNo){
  var participants=DB.participants();
  var idx=participants.findIndex(function(x){return x.chestNo==chestNo;});
  var p=participants[idx];
  if(!p) return toast('Participant not found','error');
  window._partAfterCrop=function(){ showEditParticipant(chestNo); };
  showModal('<div class="modal-handle"></div>'+
  '<button class="modal-close-btn" onclick="closeModal()" aria-label="Close">&times;</button>'+
  '<div class="modal-title">Edit Participant</div>'
  +participantFormHTML(p)
  +'<button class="btn btn-primary mt-10" id="np-submit-btn" onclick="updateParticipant('+chestNo+')">Save Changes</button>'
  +'<button class="btn btn-secondary mt-10" onclick="closeModal()">Cancel</button>',
  { saveCallback: function(){ updateParticipant(chestNo); } }
);
setTimeout(_npChestLiveCheck,60);
if (_savedParticipantFormData) { _restoreParticipantFormData(); }   // <-- ADD THIS LINE
}

function getCheckedItems(){
  return [...document.querySelectorAll('#np-items input:checked')].map(c=>parseInt(c.value));
}
function validateEventLimits(selectedItems, participantIdx, teamName, participantsOverride){
  if(participantIdx===undefined) participantIdx=-1;
  const cfg=DB.config(), items=DB.items(), participants=participantsOverride||DB.participants();
  const stageItems=selectedItems.filter(id=>{const it=items.find(i=>i.id===id);return it&&it.type!=='group'&&it.isStage&&_itemCountsLimit(it)});
  const offStageItems=selectedItems.filter(id=>{const it=items.find(i=>i.id===id);return it&&it.type!=='group'&&!it.isStage&&_itemCountsLimit(it)});
  const openSecItems=selectedItems.filter(id=>{const it=items.find(i=>i.id===id);return it&&it.type!=='group'&&isOpenSection(it.section)&&_itemCountsLimit(it)});
  if(stageItems.length>(cfg.maxStageEvents||99)) return `Max ${cfg.maxStageEvents||3} on-stage items allowed!`;
  if(offStageItems.length>(cfg.maxOffStageEvents||99)) return `Max ${cfg.maxOffStageEvents||5} off-stage items allowed!`;
  if(cfg.maxOpenSection && openSecItems.length>cfg.maxOpenSection) return `Max ${cfg.maxOpenSection} Open Section items allowed!`;
  // Check per-item team limit (maxTeam)
  if(teamName){
    for(var k=0;k<selectedItems.length;k++){
      var itemId=selectedItems[k];
      var item=items.find(function(i){return i.id==itemId;});
      if(!item||!item.maxTeam||item.maxTeam<=0) continue;
      // Count how many other participants from same team are in this item (excluding current participant being edited)
      var matched=participants.filter(function(p,pi){
        return p.team===teamName && (p.items||[]).includes(itemId) && (participantIdx<0||pi!==participantIdx);
      });
      if(matched.length>=item.maxTeam){
        var names=matched.map(function(p){return '#'+p.chestNo+' '+p.name;}).join(', ');
        return 'Max '+item.maxTeam+' participants from this team allowed in "'+item.name+'"! Already counted: '+names;
      }
    }
  }
  return null;
}
function getGroupNames(){
  const gnames={};
  const items=DB.items();
  items.filter(i=>i.type==='group').forEach(item=>{
    const el=document.getElementById('gn-'+item.id);
    if(el) gnames[item.id]=el.value.trim();
  });
  return gnames;
}
// Returns the display name for a participant in a group item
// = custom group name if set, else first participant's name + " & Party"
function getGroupDisplayName(itemId, participantName){
  const items=DB.items(), participants=DB.participants();
  const item=items.find(i=>i.id==itemId);
  if(!item||item.type!=='group') return participantName;
  // Find first registered participant for this group item
  const first=participants.find(p=>(p.items||[]).includes(itemId));
  if(first){
    // Use custom name if set, else first person + & Party
    const customName=first.groupNames&&first.groupNames[itemId];
    return customName||first.name+' & Party';
  }
  // No one registered yet — use current participant name + & Party
  return participantName+' & Party';
}

function addParticipant(){
  const name=v('np-name').trim(), chest=v('np-chest').trim();
  if(!name) return toast('Enter name','error');
  if(!chest || isNaN(parseInt(chest))) return toast('Enter a valid chest number','error');
  const participants=DB.participants();
  if(participants.find(p=>p.chestNo==chest)) return toast('Chest #'+chest+' already used by a participant!','error');
  // Check against group chest numbers
  const grpDup=DB.groups().find(function(g){return g.groupChestNo==chest;});
  if(grpDup) return toast('Chest #'+chest+' already used by group "'+grpDup.name+'"','error');
  const checkedItems=getCheckedItems();
  const sec=v('np-section'); var team=v('np-team');
  if(isTeam()) team=currentTeamName(); // Team Managers can only register their own team's participants
  var range=_teamChestRange(team, isTeam());
  if(!range) return toast('Your chest number range hasn\u2019t been set by Admin yet \u2014 contact Admin before adding participants.','error');
  if(parseInt(chest)<range.from || parseInt(chest)>range.to) return toast('Chest #'+chest+' is outside '+team+'\u2019s assigned range ('+range.from+'\u2013'+range.to+')','error');
  const err=validateEventLimits(checkedItems, -1, team);
  if(err) return toast(err,'error');
  // Remember for next time
  window._lastPartSection=sec; window._lastPartTeam=team;
  const finalName=applyTextCase(name);
  participants.push({id:_nextUniqueIds(participants,1)[0],chestNo:parseInt(chest),name:finalName,section:sec,team:team,items:checkedItems,photo:_partPhotoData||null});
  _partPhotoData=null;
  DB.saveParticipants(participants); _closeModalClean(); toast('Participant added!'); render('participants');
}

// ── Auto-Data Sync: propagate a participant's name (and chest# if it
// changed) into any Group they belong to — as captain (members[0], which
// drives captainChestNo + the auto-generated group title "<name> & Party")
// or as the 2nd member (members[1]). A custom (manually-typed) group title
// is left untouched; only titles that still match the auto-generated
// "<old name> & Party" pattern are refreshed.
function _syncParticipantToGroups(oldChestNo, newChestNo, oldName, newName){
  if(oldChestNo==newChestNo && oldName===newName) return;
  var groups=DB.groups();
  var changed=false;
  var autoOldTitle=applyTextCase(oldName+' & Party');
  groups=groups.map(function(g){
    var isCaptain=(g.captainChestNo==oldChestNo);
    var memIdx=(g.members||[]).findIndex(function(m){return m.chestNo==oldChestNo;});
    if(!isCaptain && memIdx<0) return g;
    changed=true;
    var ng=Object.assign({},g);
    ng.members=(g.members||[]).map(function(m){
      return m.chestNo==oldChestNo ? Object.assign({},m,{chestNo:parseInt(newChestNo),name:newName}) : m;
    });
    if(isCaptain){
      ng.captainChestNo=parseInt(newChestNo);
      if(g.name===autoOldTitle) ng.name=applyTextCase(newName+' & Party');
    }
    return ng;
  });
  if(changed) DB.saveGroups(groups);
}

function updateParticipant(chestNo){
  var name=document.getElementById('np-name').value.trim();
  var newChest=document.getElementById('np-chest').value.trim();
  if(!name) return toast('Enter name','error');
  // Guard against a blank/non-numeric chest number silently becoming NaN below —
  // addParticipant already had this check but updateParticipant was missing it,
  // which let an edited participant's chestNo become NaN. Once that happens,
  // every downstream comparison against it (range check, duplicate check) is
  // done against NaN and silently evaluates false/no-match, so the save goes
  // through unblocked and the participant keeps all its existing item
  // registrations under a broken chest number — it looks "gone" everywhere
  // that matches by chest number, while still occupying a slot in any item's
  // Code Letters list.
  if(!newChest || isNaN(parseInt(newChest))) return toast('Enter a valid chest number','error');
  var participants=DB.participants();
  var idx=participants.findIndex(function(x){return x.chestNo==chestNo;});
  if(idx<0) return toast('Participant not found','error');
  var dup=participants.find(function(p,i){return p.chestNo==newChest&&i!==idx;});
  if(dup) return toast('Chest #'+newChest+' used by '+dup.name,'error');
  var grpDup=DB.groups().find(function(g){return g.groupChestNo==newChest;});
  if(grpDup) return toast('Chest #'+newChest+' used by group "'+grpDup.name+'"','error');
  var newTeamForRange = isTeam() ? currentTeamName() : document.getElementById('np-team').value;
  var rangeChk=_teamChestRange(newTeamForRange, isTeam());
  if(!rangeChk) return toast('Your chest number range hasn\u2019t been set by Admin yet \u2014 contact Admin before editing participants.','error');
  if(parseInt(newChest)<rangeChk.from || parseInt(newChest)>rangeChk.to) return toast('Chest #'+newChest+' is outside '+newTeamForRange+'\u2019s assigned range ('+rangeChk.from+'\u2013'+rangeChk.to+')','error');
  var checkedItems=getCheckedItems();
  var err=validateEventLimits(checkedItems,idx, isTeam()?currentTeamName():document.getElementById('np-team').value);
  if(err) return toast(err,'error');
  var finalName=applyTextCase(name);

  var oldTeam = participants[idx].team;
  var newTeam = isTeam() ? currentTeamName() : document.getElementById('np-team').value;

  // Prepare updated participant object (not saved yet)
  var updatedParticipant = Object.assign({}, participants[idx], {
    chestNo: parseInt(newChest),
    name: finalName,
    section: document.getElementById('np-section').value,
    team: newTeam,
    items: checkedItems,
    photo: _partPhotoData !== undefined ? _partPhotoData : participants[idx].photo
  });

  // Check if team changed and there are groups to delete
  var groupsToDelete = [];
  if (oldTeam && newTeam && oldTeam !== newTeam) {
    var groups = DB.groups();
    groupsToDelete = groups.filter(function(g){
      return g.captainChestNo == chestNo || (g.members && g.members.some(function(m){ return m.chestNo == chestNo; }));
    });
  }

  // Function to actually perform the save (called after confirmation)
  function doSave() {
    var oldName = participants[idx].name;
    participants[idx] = updatedParticipant;
    _partPhotoData = null;
    DB.saveParticipants(participants);

    if (groupsToDelete.length > 0) {
      var remainingGroups = DB.groups().filter(function(g){
        return !(g.captainChestNo == chestNo || (g.members && g.members.some(function(m){ return m.chestNo == chestNo; })));
      });
      DB.saveGroups(remainingGroups);
      toast('Participant updated! ' + groupsToDelete.length + ' group(s) deleted.');
    } else {
      // Team unchanged — auto-sync this participant's name/chest# into any
      // group where they're registered as captain or 2nd member.
      _syncParticipantToGroups(chestNo, updatedParticipant.chestNo, oldName, updatedParticipant.name);
      toast('Participant updated!');
    }

    _closeModalClean();
    renderKeepScroll('participants',{tab:window._lastPartTab||'list'});
  }

  // If groups will be deleted, show confirmation modal
  if (groupsToDelete.length > 0) {
    var items = DB.items();
    var groupListHtml = groupsToDelete.map(function(g){
      var itemName = g.itemName || (items.find(function(i){return i.id===g.itemId;})||{}).name || 'Unknown item';
      return '<div style="padding:6px 0;border-bottom:1px solid var(--border)">' +
        '<b>' + g.name + '</b><br>' +
        '<span style="font-size:.72rem;color:var(--text3)">' + itemName + ' · ' + g.team + '</span>' +
        '</div>';
    }).join('');

    showModal(
      '<div style="text-align:center;padding:8px">' +
        '<div class="modal-handle"></div>' +
        '<div style="font-size:2.2rem;margin-bottom:6px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>️</div>' +
        '<div style="font-size:1rem;font-weight:800;margin-bottom:4px;color:var(--gold)">Team Changed</div>' +
        '<div style="font-size:.82rem;color:var(--text2);margin-bottom:16px">' +
          'Changing <b>' + (participants[idx].name) + '</b> from <b>' + oldTeam + '</b> to <b>' + newTeam + '</b> will remove the following group registrations:' +
        '</div>' +
        '<div style="max-height:200px;overflow-y:auto;background:var(--bg3);border-radius:8px;padding:8px 12px;margin-bottom:16px;text-align:left">' +
          groupListHtml +
        '</div>' +
        '<div style="display:flex;gap:8px">' +
          '<button class="btn btn-danger" style="flex:1" onclick="closeModal();window._confirmTeamChangeCallback()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>️ Delete & Continue</button>' +
          '<button class="btn btn-secondary" style="flex:1" onclick="closeModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Cancel</button>' +
        '</div>' +
      '</div>',
      { noDirtyGuard: true }
    );

    // Store the save callback to be called when user confirms
    window._confirmTeamChangeCallback = function(){
      doSave();
    };
  } else {
    // No groups to delete, just save normally
    doSave();
  }
}

// ============================================================
// BULK ADD PARTICIPANTS
// ============================================================
function showBulkAddParticipants(){
  var sections=DB.sections(), teams=DB.teams();
  if(!sections.length) return toast('Add a Section first','error');
  if(!teams.length) return toast('Add a Team first','error');
  var teamField = isTeam() ? _lockedFieldHTML('baPTeam','Team',currentTeamName()) : _sdFieldHTML('baPTeam','Team','Type to search team...','');
  showModal('<div class="modal-handle"></div>'+
    '<button class="modal-close-btn" onclick="closeModal()" aria-label="Close">&times;</button>'+
    '<div class="modal-title">Bulk Add Participants</div>'+
    '<div style="font-size:.78rem;color:var(--text3);margin-bottom:12px">Pick the Section &amp; Team once, then paste or type one name per line. Chest numbers are generated automatically &mdash; items can be assigned to each participant afterward.</div>'+
    _sdFieldHTML('baPSec','Section','Type to search section...','')+
    teamField+
    '<div class="form-group"><label class="form-label">Participant Names <span style="font-size:.72rem;color:var(--text3)">(one per line)</span></label>'+
    '<textarea autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="ba-p-names" rows="8" style="resize:vertical;font-family:inherit" placeholder="e.g.\nArjun Menon\nSneha Nair\nRahul Krishnan"></textarea></div>'+
    '<div id="ba-p-preview-wrap"></div>'+
    '<button class="btn btn-primary mt-10" id="ba-p-preview-btn" onclick="previewBulkParticipants()">Preview</button>'+
    '<button class="btn btn-secondary mt-6" onclick="closeModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Close</button>'
  );
}
function previewBulkParticipants(){
  var section=document.getElementById('baPSec_hid').value;
  var team=isTeam() ? currentTeamName() : document.getElementById('baPTeam_hid').value;
  var names=_parseBulkLines(document.getElementById('ba-p-names').value);
  if(!section) return toast('Select a Section first','error');
  if(!team) return toast('Select a Team first','error');
  if(!names.length) return toast('Enter at least one name','error');
  var participants=DB.participants(), groups=DB.groups();
  // Chest numbers: system-generated within the team's assigned range, never
  // colliding with existing participants or groups
  var range=_teamChestRange(team, isTeam());
  if(!range) return toast('Your chest number range hasn\u2019t been set by Admin yet \u2014 contact Admin before adding participants.','error');
  var allChests=participants.map(function(p){return parseInt(p.chestNo)||0;})
    .concat(groups.map(function(g){return parseInt(g.groupChestNo)||0;}));
  var nextChest=range.from;
  var rangeExhausted=false;
  function genChest(){
    while(nextChest<=range.to && allChests.includes(nextChest)) nextChest++;
    if(nextChest>range.to){ rangeExhausted=true; return null; }
    allChests.push(nextChest);
    return nextChest++;
  }
  var rows=names.map(function(name){
    return {name:applyTextCase(name), chestNo:genChest(), section:section, team:team};
  });
  if(rangeExhausted) toast('Ran out of chest numbers in '+team+'\u2019s range ('+range.from+'\u2013'+range.to+') \u2014 some names were skipped. Ask Admin to widen the range.', 'error');
  rows=rows.filter(function(r){return r.chestNo!==null;});
  window._bulkPartRows=rows;
  window._bulkPartRange=range;
  _recomputeBulkPartFlags();
  renderBulkPartPreview();
  document.getElementById('ba-p-preview-btn').style.display='none';
}
// Re-checks every row's name/chest number against the DB and against every other row
// currently in the batch. Called on initial Preview, after Re-Preview, after removing a
// row, and right before committing — so in-place edits are always re-validated first.
function _recomputeBulkPartFlags(){
  var rows=window._bulkPartRows||[];
  var participants=DB.participants(), groups=DB.groups();
  var range=window._bulkPartRange||{from:0,to:999999};
  var seenNames={}, seenChests={};
  rows.forEach(function(r){
    var key=(r.name||'').toLowerCase().trim();
    var dupExisting=participants.some(function(p){return p.section===r.section && p.team===r.team && (p.name||'').toLowerCase()===key;});
    var dupBatch=!!seenNames[key] && key!=='';
    seenNames[key]=true;
    r.flagged=(dupExisting||dupBatch);
    var chest=parseInt(r.chestNo);
    var chestErr=null;
    if(r.chestNo===''||r.chestNo===null||r.chestNo===undefined||isNaN(chest)) chestErr='Enter a valid chest number';
    else if(chest<range.from||chest>range.to) chestErr='Outside '+r.team+'\u2019s range ('+range.from+'\u2013'+range.to+')';
    else if(seenChests[chest]) chestErr='Duplicate chest number in this batch';
    else if(participants.some(function(p){return parseInt(p.chestNo)===chest;})||groups.some(function(g){return parseInt(g.groupChestNo)===chest;})) chestErr='Chest #'+chest+' already in use';
    if(!chestErr) seenChests[chest]=true;
    r.chestErr=chestErr;
  });
}
function renderBulkPartPreview(){
  var rows=window._bulkPartRows||[];
  var flaggedCount=rows.filter(function(r){return r.flagged;}).length;
  var errorCount=rows.filter(function(r){return r.chestErr;}).length;
  var rowsHtml=rows.length?rows.map(function(r,idx){
    var nameEsc=String(r.name||'').replace(/"/g,'&quot;');
    return '<div class="list-item" style="padding:8px 12px;align-items:center;gap:8px'+((r.flagged||r.chestErr)?';background:rgba(240,165,0,.08)':'')+'">'
      +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" type="number" id="bap-chest-'+idx+'" value="'+(r.chestNo!=null&&r.chestNo!==''?r.chestNo:'')+'" oninput="_bapEditChest('+idx+',this.value)" style="width:64px;flex-shrink:0;margin-bottom:0;padding:6px 4px;font-size:.75rem;text-align:center">'
      +'<div class="list-info" style="flex:1;min-width:0"><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="bap-name-'+idx+'" value="'+nameEsc+'" oninput="_bapEditName('+idx+',this.value)" style="margin-bottom:0;padding:6px 10px;font-size:.85rem">'
      +(r.chestErr?('<div class="list-sub" style="color:var(--red)">'+r.chestErr+'</div>'):(r.flagged?'<div class="list-sub" style="color:var(--accent)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg> Same name already exists in this Section &amp; Team</div>':''))
      +'</div>'
      +'<button class="btn btn-danger btn-sm btn-icon" title="Remove row" aria-label="Remove row" onclick="removeBulkPartRow('+idx+')" style="flex-shrink:0"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
      +'</div>';
  }).join(''):'<div style="text-align:center;padding:16px;color:var(--text3);font-size:.82rem">No rows left &mdash; go back and paste some names</div>';
  var confirmHtml='<div style="border-top:1px solid var(--border);margin-top:10px;padding-top:10px">'
    +'<div style="font-size:.8rem;font-weight:700;margin-bottom:4px">Preview &mdash; '+rows.length+' participant(s)</div>'
    +'<div style="font-size:.72rem;color:var(--text3);margin-bottom:8px">Edit any name or chest number directly, then tap Re-Preview to re-check before adding.</div>'
    +rowsHtml
    +(flaggedCount?('<label style="display:flex;align-items:center;gap:8px;margin-top:10px;font-size:.8rem;cursor:pointer"><input type="checkbox" id="ba-p-confirm-dup" style="width:16px;height:16px;accent-color:var(--accent)"> I\'ve reviewed the '+flaggedCount+' flagged duplicate(s) above and want to add them anyway</label>'):'')
    +'<div style="display:flex;gap:8px;margin-top:10px">'
    +'<button class="btn btn-secondary" style="flex:1" onclick="rePreviewBulkParticipants()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg> Re-Preview</button>'
    +'<button class="btn btn-primary" style="flex:1" onclick="commitBulkParticipants()"'+(errorCount||!rows.length?' disabled':'')+'>Add All ('+rows.length+')</button>'
    +'</div>'
    +(errorCount?'<div style="font-size:.72rem;color:var(--red);margin-top:6px">Fix '+errorCount+' chest number issue(s) above, then tap Re-Preview.</div>':'')
    +'</div>';
  document.getElementById('ba-p-preview-wrap').innerHTML=confirmHtml;
}
function _bapEditName(idx,val){ var rows=window._bulkPartRows||[]; if(rows[idx]) rows[idx].name=val; }
function _bapEditChest(idx,val){ var rows=window._bulkPartRows||[]; if(rows[idx]) rows[idx].chestNo=(val===''?'':parseInt(val)); }
function removeBulkPartRow(idx){
  var rows=window._bulkPartRows||[];
  rows.splice(idx,1);
  window._bulkPartRows=rows;
  _recomputeBulkPartFlags();
  renderBulkPartPreview();
}
function rePreviewBulkParticipants(){
  _recomputeBulkPartFlags();
  renderBulkPartPreview();
  toast('Preview refreshed');
}
function commitBulkParticipants(){
  var rows=window._bulkPartRows||[];
  if(!rows.length) return;
  _recomputeBulkPartFlags(); // re-validate latest in-place edits before writing to DB
  var hasErrors=rows.some(function(r){return r.chestErr;});
  if(hasErrors){ renderBulkPartPreview(); return toast('Fix the chest number issue(s) before adding','error'); }
  var hasFlagged=rows.some(function(r){return r.flagged;});
  if(hasFlagged){
    var cb=document.getElementById('ba-p-confirm-dup');
    if(cb && !cb.checked){ renderBulkPartPreview(); return toast('Please confirm the flagged duplicates first','error'); }
  }
  var participants=DB.participants();
  var _batchIds=_nextUniqueIds(participants, rows.length);
  rows.forEach(function(r,i){
    participants.push({id:_batchIds[i],chestNo:r.chestNo,name:r.name,section:r.section,team:r.team,items:[],photo:null});
  });
  DB.saveParticipants(participants);
  window._bulkPartRows=null; window._bulkPartRange=null;
  _closeModalClean(); toast(rows.length+' participants added!'); render('participants');
}

// ============================================================
// ASSIGN ITEMS — chooser + 3 methods
// ============================================================
function showAssignItemsChooser(){
  showModal('<div class="modal-handle"></div>'+
    '<button class="modal-close-btn" onclick="closeModal()" aria-label="Close">&times;</button>'+
    '<div class="modal-title">Assign Items</div>'+
    '<div style="font-size:.78rem;color:var(--text3);margin-bottom:14px">Choose how you\'d like to assign items to participants.</div>'+
    '<div style="display:flex;flex-direction:column;gap:10px">'+
      '<div onclick="closeModal();showAssignByItem()" style="cursor:pointer;background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:14px">'+
        '<div style="font-size:.9rem;font-weight:700;margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg> By Item</div>'+
        '<div style="font-size:.78rem;color:var(--text3)">Pick one Item, then tick every participant entering it &mdash; optionally filtered by Team. Best when one item has many entrants.</div>'+
      '</div>'+
      '<div onclick="closeModal();showAssignGrid()" style="cursor:pointer;background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:14px">'+
        '<div style="font-size:.9rem;font-weight:700;margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg> Grid View</div>'+
        '<div style="font-size:.78rem;color:var(--text3)">Pick a Section &amp; Team, see everyone x every item in a table, tick any cell. Best on a bigger screen.</div>'+
      '</div>'+
      '<div onclick="closeModal();showAssignGroupsGrid()" style="cursor:pointer;background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:14px">'+
        '<div style="font-size:.9rem;font-weight:700;margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Groups Grid</div>'+
        '<div style="font-size:.78rem;color:var(--text3)">For Group Items only &mdash; Groups (like "Salim &amp; Party") x Group Items in a table, tick any cell.</div>'+
      '</div>'+
    '</div>'+
    '<button class="btn btn-secondary mt-10" onclick="closeModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Close</button>',
    {noDirtyGuard:true}
  );
}

// ---------- Method: By Item ----------
function showAssignByItem(){
  var items=DB.items();
  if(!items.length) return toast('Add items first','error');
  var teamField = isTeam()
    ? _lockedFieldHTML('aiiTeam','Team',currentTeamName())
    : _sdFieldHTML('aiiTeam','Team filter (optional)','Type to search team, leave blank for all...','');
  showModal('<div class="modal-handle"></div>'+
    '<button class="modal-close-btn" onclick="closeModal()" aria-label="Close">&times;</button>'+
    '<div class="modal-title">Assign Items &middot; By Item</div>'+
    '<div style="font-size:.78rem;color:var(--text3);margin-bottom:12px">Pick an Item'+(isTeam()?'':', optionally filter by Team,')+' then tick every participant (or Group, for Group Items) entering it.</div>'+
    _sdFieldHTML('aiiItem','Item','Type to search item name or code...','')+
    teamField+
    '<div id="aii-participants-wrap"></div>'+
    '<button class="btn btn-secondary mt-10" onclick="closeModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Done</button>',
    {saveCallback: aiiSaveAndClose}
  );
}
function aiiSaveAndClose(){
  var itemVal=(document.getElementById('aiiItem_hid')||{}).value||'';
  var item=itemVal?DB.items().find(function(i){return _aiiItemLabel(i)===itemVal;}):null;
  if(item){
    if(item.type==='group' && document.getElementById('aii-glist')){ aiiSaveGroups(item.id); }
    else if(document.getElementById('aii-list')){ aiiSave(item.id); }
  }
  _closeModalClean();
}
function _aiiItemLabel(i){ return i.code+' - '+i.name+' ('+i.section+')'+(i.type==='group'?' [Group]':''); }
function aiiItem_search(q){ _sdSearch('aiiItem_q','aiiItem_res','aiiItem_hid','aiiItem_clear',DB.items().map(_aiiItemLabel),'aiiItem_select'); }
function aiiItem_blur(){ _sdBlur('aiiItem_q','aiiItem_res','aiiItem_hid',DB.items().map(_aiiItemLabel)); }
function aiiItem_select(el){ _sdSelectVal('aiiItem_res','aiiItem_q','aiiItem_hid','aiiItem_clear',el.getAttribute('data-val')); aiiLoadParticipants(); }
function aiiItem_clear(){ _sdSelectVal('aiiItem_res','aiiItem_q','aiiItem_hid','aiiItem_clear',''); var w=document.getElementById('aii-participants-wrap'); if(w) w.innerHTML=''; }
function aiiTeam_search(q){ _sdSearch('aiiTeam_q','aiiTeam_res','aiiTeam_hid','aiiTeam_clear',DB.teams().map(function(t){return t.name;}),'aiiTeam_select'); }
function aiiTeam_blur(){ _sdBlur('aiiTeam_q','aiiTeam_res','aiiTeam_hid',DB.teams().map(function(t){return t.name;})); }
function aiiTeam_select(el){ _sdSelectVal('aiiTeam_res','aiiTeam_q','aiiTeam_hid','aiiTeam_clear',el.getAttribute('data-val')); aiiLoadParticipants(); }
function aiiTeam_clear(){ _sdSelectVal('aiiTeam_res','aiiTeam_q','aiiTeam_hid','aiiTeam_clear',''); aiiLoadParticipants(); }
function aiiLoadParticipants(){
  var itemVal=(document.getElementById('aiiItem_hid')||{}).value||'';
  var w=document.getElementById('aii-participants-wrap');
  if(!itemVal||!w){ if(w) w.innerHTML=''; return; }
  var item=DB.items().find(function(i){return _aiiItemLabel(i)===itemVal;});
  if(!item) return;
  if(item.type==='group'){ aiiLoadGroups(item); return; }
  var teamFilter=isTeam() ? currentTeamName() : ((document.getElementById('aiiTeam_hid')||{}).value||'');
  var itemOpen=isOpenSection(item.section);
  var participants=DB.participants().filter(function(p){return (itemOpen||p.section===item.section) && (!teamFilter||p.team===teamFilter);})
    .sort(function(a,b){return a.chestNo-b.chestNo;});
  var rowsHtml=participants.length?participants.map(function(p){
    var checked=(p.items||[]).includes(item.id);
    return '<label id="aii-row-'+p.chestNo+'" style="display:flex;align-items:center;gap:8px;padding:7px 6px;border-radius:8px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .15s">'
      +'<input type="checkbox" id="aii-cb-'+p.chestNo+'" class="aii-cb" data-chest="'+p.chestNo+'" data-orig="'+(checked?'1':'0')+'"'+(checked?' checked':'')
      +' onchange="aiiCheckChange(this,\''+item.id+'\')"'
      +' style="width:16px;height:16px;accent-color:var(--accent)">'
      +'<span style="flex:1;font-size:.83rem">#'+p.chestNo+' '+p.name+(itemOpen?' <span style="color:var(--text3);font-weight:400">('+p.section+')</span>':'')+'</span>'
      +'<span style="font-size:.68rem;padding:1px 6px;border-radius:8px;background:var(--bg3);color:var(--text3)">'+p.team+'</span></label>';
  }).join(''):'<div style="color:var(--text3);font-size:.8rem;padding:10px">No participants found for this filter</div>';
  w.innerHTML='<div style="font-weight:700;font-size:.85rem;margin:10px 0 6px">'+item.name+' &middot; '+item.section+(itemOpen?' <span style="font-size:.62rem;font-weight:800;padding:2px 7px;border-radius:8px;background:rgba(74,158,255,.18);color:var(--blue);vertical-align:middle">OPEN</span>':'')+'</div>'
    +'<div id="aii-list" style="max-height:280px;overflow-y:auto;background:var(--input-bg);border:1px solid var(--border);border-radius:10px;padding:8px 12px">'+rowsHtml+'</div>'
    +(participants.length?'<button class="btn btn-primary mt-10" id="aii-save-btn" onclick="aiiSave(\''+item.id+'\')">Save Assignments</button>':'')
    +'<div id="aii-preview-wrap"></div>';
  _attachDirtyListeners();
}
function aiiLoadGroups(item){
  var w=document.getElementById('aii-participants-wrap');
  if(!w) return;
  var teamFilter=isTeam() ? currentTeamName() : ((document.getElementById('aiiTeam_hid')||{}).value||'');
  var itemOpen=isOpenSection(item.section);
  var groups=DB.groups().filter(function(g){return (itemOpen||g.section===item.section) && (!teamFilter||g.team===teamFilter);})
    .sort(function(a,b){return a.groupChestNo-b.groupChestNo;});
  var rowsHtml=groups.length?groups.map(function(g){
    var checked=(g.itemIds||[]).includes(item.id);
    return '<label id="aii-grow-'+g.id+'" style="display:flex;align-items:center;gap:8px;padding:7px 6px;border-radius:8px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .15s">'
      +'<input type="checkbox" id="aii-gcb-'+g.id+'" class="aii-gcb" data-gid="'+g.id+'" data-orig="'+(checked?'1':'0')+'"'+(checked?' checked':'')
      +' onchange="aiiGroupCheckChange(this)"'
      +' style="width:16px;height:16px;accent-color:var(--accent)">'
      +'<span style="flex:1;font-size:.83rem">#'+g.groupChestNo+' '+g.name+(itemOpen?' <span style="color:var(--text3);font-weight:400">('+g.section+')</span>':'')+'</span>'
      +'<span style="font-size:.68rem;padding:1px 6px;border-radius:8px;background:var(--bg3);color:var(--text3)">'+g.team+'</span></label>';
  }).join(''):'<div style="color:var(--text3);font-size:.8rem;padding:10px">No groups yet for this section'+(teamFilter?' &amp; team':'')+'. Create one below.</div>';
  w.innerHTML='<div style="font-weight:700;font-size:.85rem;margin:10px 0 6px">'+item.name+' &middot; '+item.section+
    (itemOpen?' <span style="font-size:.62rem;font-weight:800;padding:2px 7px;border-radius:8px;background:rgba(74,158,255,.18);color:var(--blue);vertical-align:middle">OPEN</span>':'')+
    ' <span style="font-size:.68rem;padding:2px 7px;border-radius:8px;background:rgba(155,89,182,.18);color:var(--purple)">GROUP ITEM</span></div>'
    +'<button class="btn btn-secondary" style="margin-bottom:8px" onclick="aiiCreateGroupForItem(\''+item.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg> Create New Group</button>'
    +'<div id="aii-glist" style="max-height:280px;overflow-y:auto;background:var(--input-bg);border:1px solid var(--border);border-radius:10px;padding:8px 12px">'+rowsHtml+'</div>'
    +(groups.length?'<button class="btn btn-primary mt-10" id="aii-save-btn" onclick="aiiSaveGroups(\''+item.id+'\')">Save Assignments</button>':'')
    +'<div id="aii-preview-wrap"></div>';
  _attachDirtyListeners();
}
function aiiGroupCheckChange(cb){
  var label=document.getElementById('aii-grow-'+cb.getAttribute('data-gid'));
  if(!label) return;
  var isOrig=cb.getAttribute('data-orig')==='1';
  label.style.background = cb.checked===isOrig ? '' : 'rgba(0,210,140,.32)';
}
function aiiSaveGroups(itemId){
  var checkboxes=[].slice.call(document.querySelectorAll('#aii-glist .aii-gcb'));
  var groups=DB.groups();
  var changed=0;
  checkboxes.forEach(function(cb){
    var gid=parseInt(cb.getAttribute('data-gid'));
    var idx=groups.findIndex(function(g){return g.id===gid;});
    if(idx<0) return;
    var g=groups[idx];
    var has=(g.itemIds||[]).includes(itemId);
    if(cb.checked && !has){
      g.itemIds=(g.itemIds||[]).concat([itemId]);
      if(!g.itemId) g.itemId=itemId;
      changed++;
    } else if(!cb.checked && has){
      g.itemIds=(g.itemIds||[]).filter(function(id){return id!==itemId;});
      if(_grpHasItem(g,itemId)) g.itemId=g.itemIds[0]||null;
      changed++;
    }
  });
  if(!changed) return toast('No changes to save');
  DB.saveGroups(groups);
  toast('Group assignments saved!');
  aiiLoadParticipants();
  _refreshParticipantsPageIfOpen();
}
function aiiCreateGroupForItem(itemId){
  var item=DB.items().find(function(i){return i.id==itemId;});
  if(!item) return;
  if(!DB.teams().length) return toast('No teams yet. Add teams first!','error');
  window._lastGrpSection=item.section;
  window._aiiGroupReturnItemId=itemId;
  showModal('<div class="modal-handle"></div>'+
    '<button class="modal-close-btn" onclick="aiiCancelCreateGroup()">&times;</button>'+
    '<div class="modal-title"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Register Group</div>'
    +groupFormHTML({itemIds:[itemId]})
    +'<button class="btn btn-primary mt-10" onclick="saveGroup(-1)">Register Group</button>'
    +'<button class="btn btn-secondary mt-6" onclick="aiiCancelCreateGroup()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Cancel</button>',
    { saveCallback: function(){ saveGroup(-1); } }
  );
}
function aiiCancelCreateGroup(){
  var itemId=window._aiiGroupReturnItemId;
  window._aiiGroupReturnItemId=null;
  if(itemId){ _aiiReopenForItem(itemId); }
  else closeModal();
}
function _aiiReopenForItem(itemId){
  var item=DB.items().find(function(i){return i.id==itemId;});
  showAssignByItem();
  if(!item) return;
  var val=_aiiItemLabel(item);
  var q=document.getElementById('aiiItem_q'), hid=document.getElementById('aiiItem_hid');
  if(q) q.value=val; if(hid) hid.value=val;
  var cbtn=document.getElementById('aiiItem_clear'); if(cbtn) cbtn.style.display='';
  aiiLoadParticipants();
}
function _aiiVirtualParticipants(itemId){
  var participants=DB.participants().map(function(p){return Object.assign({},p,{items:(p.items||[]).slice()});});
  var cbs=[].slice.call(document.querySelectorAll('#aii-list .aii-cb'));
  var byChest={};
  cbs.forEach(function(c){ byChest[c.getAttribute('data-chest')]=c.checked; });
  participants.forEach(function(p){
    if(byChest[p.chestNo]!==undefined){
      var has=(p.items||[]).includes(itemId);
      if(byChest[p.chestNo] && !has) p.items=(p.items||[]).concat([itemId]);
      else if(!byChest[p.chestNo] && has) p.items=(p.items||[]).filter(function(id){return id!==itemId;});
    }
  });
  return participants;
}
function aiiCheckChange(cb, itemId){
  var chest=cb.getAttribute('data-chest');
  var label=document.getElementById('aii-row-'+chest);
  if(!label) return;
  var isOrig=cb.getAttribute('data-orig')==='1';
  if(cb.checked===isOrig){ label.style.background=''; return; }
  if(!cb.checked){
    label.style.background='rgba(0,210,140,.32)'; // unchecking an assigned item always succeeds
    return;
  }
  var virtualParticipants=_aiiVirtualParticipants(itemId);
  var idx=virtualParticipants.findIndex(function(p){return p.chestNo==chest;});
  if(idx<0) return;
  var p=virtualParticipants[idx];
  var err=validateEventLimits(p.items||[], idx, p.team, virtualParticipants);
  if(err){
    showUiAlert(err, function(){
      cb.checked=false;
      label.style.background='';
    });
    return;
  }
  label.style.background='rgba(0,210,140,.32)';
}
function _refreshParticipantsPageIfOpen(){
  if(currentPage==='participants') renderKeepScroll('participants',{tab:window._lastPartTab||'list'});
}
function aiiSave(itemId){
  var checkboxes=[].slice.call(document.querySelectorAll('#aii-list .aii-cb'));
  var participants=DB.participants();
  var changed=0;
  checkboxes.forEach(function(cb){
    var chest=cb.getAttribute('data-chest');
    var idx=participants.findIndex(function(p){return p.chestNo==chest;});
    if(idx<0) return;
    var p=participants[idx];
    var has=(p.items||[]).includes(itemId);
    if(cb.checked && !has){ p.items=(p.items||[]).concat([itemId]); changed++; }
    else if(!cb.checked && has){ p.items=(p.items||[]).filter(function(id){return id!==itemId;}); changed++; }
  });
  if(!changed) return toast('No changes to save');
  DB.saveParticipants(participants);
  toast('Assignments saved!');
  aiiLoadParticipants();
  _refreshParticipantsPageIfOpen();
}

// ---------- Method: Grid View ----------
function showAssignGrid(){
  var sections=DB.sections();
  if(!sections.length) return toast('Add a Section first','error');
  var teamField = isTeam() ? _lockedFieldHTML('aigTeam','Team',currentTeamName()) : _sdFieldHTML('aigTeam','Team (optional)','Type to search team, leave blank for all...','');
  showModal('<div class="modal-handle"></div>'+
    '<button class="modal-close-btn" onclick="closeModal()" aria-label="Close">&times;</button>'+
    '<div class="modal-title">Assign Items &middot; Grid View</div>'+
    '<div style="font-size:.78rem;color:var(--text3);margin-bottom:12px">Pick a Section'+(isTeam()?'':' &amp; optional Team')+', then tick any cell in the table. Best viewed on a tablet/desktop screen.</div>'+
    _sdFieldHTML('aigSec','Section','Type to search section...','')+
    teamField+
    '<button class="btn btn-primary mt-6" onclick="aigLoadGrid()">Load Grid</button>'+
    '<div id="aig-grid-wrap" style="margin-top:12px"></div>'+
    '<button class="btn btn-secondary mt-10" onclick="closeModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Done</button>',
    {saveCallback: aigSaveAndClose}
  );
}
function aigSaveAndClose(){
  var section=(document.getElementById('aigSec_hid')||{}).value||'';
  if(section && document.querySelector('#aig-grid-wrap .aig-cb')){ aigSaveGrid(); }
  _closeModalClean();
}
function aigSec_search(q){ _sdSearch('aigSec_q','aigSec_res','aigSec_hid','aigSec_clear',DB.sections(),'aigSec_select'); }
function aigSec_blur(){ _sdBlur('aigSec_q','aigSec_res','aigSec_hid',DB.sections()); }
function aigSec_select(el){ _sdSelectVal('aigSec_res','aigSec_q','aigSec_hid','aigSec_clear',el.getAttribute('data-val')); }
function aigSec_clear(){ _sdSelectVal('aigSec_res','aigSec_q','aigSec_hid','aigSec_clear',''); }
function aigTeam_search(q){ _sdSearch('aigTeam_q','aigTeam_res','aigTeam_hid','aigTeam_clear',DB.teams().map(function(t){return t.name;}),'aigTeam_select'); }
function aigTeam_blur(){ _sdBlur('aigTeam_q','aigTeam_res','aigTeam_hid',DB.teams().map(function(t){return t.name;})); }
function aigTeam_select(el){ _sdSelectVal('aigTeam_res','aigTeam_q','aigTeam_hid','aigTeam_clear',el.getAttribute('data-val')); }
function aigTeam_clear(){ _sdSelectVal('aigTeam_res','aigTeam_q','aigTeam_hid','aigTeam_clear',''); }
function aigLoadGrid(){
  var section=(document.getElementById('aigSec_hid')||{}).value||'';
  var team=isTeam() ? currentTeamName() : ((document.getElementById('aigTeam_hid')||{}).value||'');
  var w=document.getElementById('aig-grid-wrap');
  if(!section) return toast('Select a Section first','error');
  var participants=DB.participants().filter(function(p){return p.section===section && (!team||p.team===team);})
    .sort(function(a,b){return a.chestNo-b.chestNo;});
  var items=DB.items().filter(function(i){return i.type!=='group' && (i.section===section || isOpenSection(i.section));});
  if(!participants.length) return toast('No participants found for this filter','error');
  if(!items.length) return toast('No individual items in this section','error');
  var thead='<th style="position:sticky;left:0;background:var(--card);z-index:2;text-align:left;padding:8px;font-size:.72rem;min-width:150px;border-bottom:1px solid var(--border)">Participant</th>'
    +items.map(function(it){var isOpenIt=it.section!==section&&isOpenSection(it.section);var hdrTxt=it.name+(isOpenIt?' ('+getSectionShortName(it.section)+')':'');return '<th title="'+it.name+(isOpenIt?' (Open — '+it.section+')':'')+'" style="padding:8px 4px 10px;font-size:.7rem;font-weight:700;width:34px;min-width:34px;max-width:34px;border-bottom:1px solid var(--border);color:'+(isOpenIt?'var(--blue)':'var(--text2)')+';writing-mode:vertical-rl;transform:rotate(180deg);text-orientation:mixed;white-space:nowrap;text-align:left">'+hdrTxt+'</th>';}).join('');
  var rows=participants.map(function(p){
    var cells=items.map(function(it){
      var checked=(p.items||[]).includes(it.id);
      return '<td id="aig-td-'+p.chestNo+'-'+it.id+'" style="text-align:center;padding:4px;border-bottom:1px solid var(--border);transition:background .15s"><input type="checkbox" id="aig-cb-'+p.chestNo+'-'+it.id+'" class="aig-cb" data-chest="'+p.chestNo+'" data-item="'+it.id+'" data-orig="'+(checked?'1':'0')+'"'+(checked?' checked':'')+' onchange="aigCheckChange(this)" style="width:16px;height:16px;accent-color:var(--accent)"></td>';
    }).join('');
    return '<tr><td style="position:sticky;left:0;background:var(--card);padding:8px;font-size:.76rem;white-space:nowrap;border-bottom:1px solid var(--border)">#'+p.chestNo+' '+p.name+'</td>'+cells+'</tr>';
  }).join('');
  w.innerHTML='<div style="overflow-x:auto;border:1px solid var(--border);border-radius:10px"><table style="border-collapse:collapse;width:max-content"><thead><tr>'+thead+'</tr></thead><tbody>'+rows+'</tbody></table></div>'
    +'<button class="btn btn-primary mt-10" id="aig-save-btn" onclick="aigSaveGrid()">Save All</button>'
    +'<div id="aig-preview-wrap"></div>';
  window._aigItemIds=items.map(function(it){return it.id;});
  _attachDirtyListeners();
}
function _aigVirtualParticipants(){
  var participants=DB.participants().map(function(p){return Object.assign({},p,{items:(p.items||[]).slice()});});
  var gridItemIds=window._aigItemIds||[];
  var cbs=[].slice.call(document.querySelectorAll('#aig-grid-wrap .aig-cb'));
  var byChest={};
  cbs.forEach(function(c){
    var chest=c.getAttribute('data-chest');
    byChest[chest]=byChest[chest]||{};
    byChest[chest][c.getAttribute('data-item')]=c.checked;
  });
  participants.forEach(function(p){
    if(byChest[p.chestNo]!==undefined){
      var kept=(p.items||[]).filter(function(id){return gridItemIds.indexOf(id)<0;});
      var added=gridItemIds.filter(function(id){return byChest[p.chestNo][String(id)];});
      p.items=kept.concat(added);
    }
  });
  return participants;
}
function aigCheckChange(cb){
  var chest=cb.getAttribute('data-chest');
  var isOrig=cb.getAttribute('data-orig')==='1';
  var td=document.getElementById('aig-td-'+chest+'-'+cb.getAttribute('data-item'));
  if(cb.checked===isOrig){ if(td) td.style.background=''; return; }
  if(!cb.checked){ if(td) td.style.background='rgba(0,210,140,.32)'; return; } // unchecking always succeeds
  var virtualParticipants=_aigVirtualParticipants();
  var idx=virtualParticipants.findIndex(function(p){return p.chestNo==chest;});
  if(idx<0) return;
  var p=virtualParticipants[idx];
  var err=validateEventLimits(p.items||[], idx, p.team, virtualParticipants);
  if(err){
    showUiAlert(err, function(){
      cb.checked=false;
      if(td) td.style.background='';
    });
    return;
  }
  if(td) td.style.background='rgba(0,210,140,.32)';
}
function aigSaveGrid(){
  var checkboxes=[].slice.call(document.querySelectorAll('#aig-grid-wrap .aig-cb'));
  var participants=DB.participants();
  var gridItemIds=window._aigItemIds||[];
  var byChest={};
  checkboxes.forEach(function(cb){
    var chest=cb.getAttribute('data-chest');
    byChest[chest]=byChest[chest]||{};
    byChest[chest][cb.getAttribute('data-item')]=cb.checked;
  });
  var changed=0;
  Object.keys(byChest).forEach(function(chest){
    var idx=participants.findIndex(function(p){return p.chestNo==chest;});
    if(idx<0) return;
    var p=participants[idx];
    var current=(p.items||[]).slice();
    var kept=current.filter(function(id){return gridItemIds.indexOf(id)<0;});
    var added=gridItemIds.filter(function(id){return byChest[chest][String(id)];});
    var newItems=kept.concat(added);
    var currentGridSet=current.filter(function(id){return gridItemIds.indexOf(id)>=0;}).sort();
    var addedSorted=added.slice().sort();
    if(JSON.stringify(currentGridSet)===JSON.stringify(addedSorted)) return; // no change for this participant
    p.items=newItems; changed++;
  });
  if(!changed) return toast('No changes to save');
  DB.saveParticipants(participants);
  toast('Grid saved!');
  aigLoadGrid();
  _refreshParticipantsPageIfOpen();
}

// ---------- Method: Groups Grid (for Group Items) ----------
function showAssignGroupsGrid(){
  var groupSections=DB.sections().filter(function(s){return DB.items().some(function(i){return i.type==='group'&&i.section===s;});});
  if(!groupSections.length) return toast('No Group Items yet. Add a Group-type item first!','error');
  var teamField = isTeam() ? _lockedFieldHTML('aggTeam','Team',currentTeamName()) : _sdFieldHTML('aggTeam','Team (optional)','Type to search team, leave blank for all...','');
  showModal('<div class="modal-handle"></div>'+
    '<button class="modal-close-btn" onclick="closeModal()" aria-label="Close">&times;</button>'+
    '<div class="modal-title">Assign Items &middot; Groups Grid</div>'+
    '<div style="font-size:.78rem;color:var(--text3);margin-bottom:12px">Pick a Section'+(isTeam()?'':' &amp; optional Team')+', then tick any cell to register a Group (like "Salim &amp; Party") for a Group Item.</div>'+
    _sdFieldHTML('aggSec','Section','Type to search section...','')+
    teamField+
    '<button class="btn btn-primary mt-6" onclick="aggLoadGrid()">Load Grid</button>'+
    '<div id="agg-grid-wrap" style="margin-top:12px"></div>'+
    '<button class="btn btn-secondary mt-10" onclick="closeModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Done</button>',
    {saveCallback: aggSaveAndClose}
  );
}
function _aggGroupSections(){ return DB.sections().filter(function(s){return DB.items().some(function(i){return i.type==='group'&&i.section===s;});}); }
function aggSaveAndClose(){
  var section=(document.getElementById('aggSec_hid')||{}).value||'';
  if(section && document.querySelector('#agg-grid-wrap .agg-cb')){ aggSaveGrid(); }
  _closeModalClean();
}
function aggSec_search(q){ _sdSearch('aggSec_q','aggSec_res','aggSec_hid','aggSec_clear',_aggGroupSections(),'aggSec_select'); }
function aggSec_blur(){ _sdBlur('aggSec_q','aggSec_res','aggSec_hid',_aggGroupSections()); }
function aggSec_select(el){ _sdSelectVal('aggSec_res','aggSec_q','aggSec_hid','aggSec_clear',el.getAttribute('data-val')); }
function aggSec_clear(){ _sdSelectVal('aggSec_res','aggSec_q','aggSec_hid','aggSec_clear',''); }
function aggTeam_search(q){ _sdSearch('aggTeam_q','aggTeam_res','aggTeam_hid','aggTeam_clear',DB.teams().map(function(t){return t.name;}),'aggTeam_select'); }
function aggTeam_blur(){ _sdBlur('aggTeam_q','aggTeam_res','aggTeam_hid',DB.teams().map(function(t){return t.name;})); }
function aggTeam_select(el){ _sdSelectVal('aggTeam_res','aggTeam_q','aggTeam_hid','aggTeam_clear',el.getAttribute('data-val')); }
function aggTeam_clear(){ _sdSelectVal('aggTeam_res','aggTeam_q','aggTeam_hid','aggTeam_clear',''); }
function aggLoadGrid(){
  var section=(document.getElementById('aggSec_hid')||{}).value||'';
  var team=isTeam() ? currentTeamName() : ((document.getElementById('aggTeam_hid')||{}).value||'');
  var w=document.getElementById('agg-grid-wrap');
  if(!section) return toast('Select a Section first','error');
  var groups=DB.groups().filter(function(g){return g.section===section && (!team||g.team===team);})
    .sort(function(a,b){return a.groupChestNo-b.groupChestNo;});
  var items=DB.items().filter(function(i){return i.type==='group' && (i.section===section || isOpenSection(i.section));});
  if(!items.length) return toast('No group items in this section','error');
  if(!groups.length) return toast('No groups found for this filter. Create one via By Item, or Participants \u2192 Groups tab.','error');
  var thead='<th style="position:sticky;left:0;background:var(--card);z-index:2;text-align:left;padding:8px;font-size:.72rem;min-width:150px;border-bottom:1px solid var(--border)">Group</th>'
    +items.map(function(it){var isOpenIt=it.section!==section&&isOpenSection(it.section);var hdrTxt=it.name+(isOpenIt?' ('+getSectionShortName(it.section)+')':'');return '<th title="'+it.name+(isOpenIt?' (Open — '+it.section+')':'')+'" style="padding:8px 4px 10px;font-size:.7rem;font-weight:700;width:34px;min-width:34px;max-width:34px;border-bottom:1px solid var(--border);color:'+(isOpenIt?'var(--blue)':'var(--text2)')+';writing-mode:vertical-rl;transform:rotate(180deg);text-orientation:mixed;white-space:nowrap;text-align:left">'+hdrTxt+'</th>';}).join('');
  var rows=groups.map(function(g){
    var cells=items.map(function(it){
      var checked=(g.itemIds||[]).includes(it.id);
      return '<td id="agg-td-'+g.id+'-'+it.id+'" style="text-align:center;padding:4px;border-bottom:1px solid var(--border);transition:background .15s"><input type="checkbox" id="agg-cb-'+g.id+'-'+it.id+'" class="agg-cb" data-gid="'+g.id+'" data-item="'+it.id+'" data-orig="'+(checked?'1':'0')+'"'+(checked?' checked':'')+' onchange="aggCheckChange(this)" style="width:16px;height:16px;accent-color:var(--accent)"></td>';
    }).join('');
    return '<tr><td style="position:sticky;left:0;background:var(--card);padding:8px;font-size:.76rem;white-space:nowrap;border-bottom:1px solid var(--border)">#'+g.groupChestNo+' '+g.name+'</td>'+cells+'</tr>';
  }).join('');
  w.innerHTML='<div style="overflow-x:auto;border:1px solid var(--border);border-radius:10px"><table style="border-collapse:collapse;width:max-content"><thead><tr>'+thead+'</tr></thead><tbody>'+rows+'</tbody></table></div>'
    +'<button class="btn btn-primary mt-10" id="agg-save-btn" onclick="aggSaveGrid()">Save All</button>'
    +'<div id="agg-preview-wrap"></div>';
  window._aggItemIds=items.map(function(it){return it.id;});
  _attachDirtyListeners();
}
function aggCheckChange(cb){
  var gid=cb.getAttribute('data-gid'), itemId=cb.getAttribute('data-item');
  var td=document.getElementById('agg-td-'+gid+'-'+itemId);
  var isOrig=cb.getAttribute('data-orig')==='1';
  if(td) td.style.background = cb.checked===isOrig ? '' : 'rgba(0,210,140,.32)';
}
function aggSaveGrid(){
  var checkboxes=[].slice.call(document.querySelectorAll('#agg-grid-wrap .agg-cb'));
  var groups=DB.groups();
  var gridItemIds=window._aggItemIds||[];
  var byGid={};
  checkboxes.forEach(function(cb){
    var gid=cb.getAttribute('data-gid');
    byGid[gid]=byGid[gid]||{};
    byGid[gid][cb.getAttribute('data-item')]=cb.checked;
  });
  var changed=0;
  Object.keys(byGid).forEach(function(gid){
    var idx=groups.findIndex(function(g){return g.id==gid;});
    if(idx<0) return;
    var g=groups[idx];
    var current=(g.itemIds||[]).slice();
    var kept=current.filter(function(id){return gridItemIds.indexOf(id)<0;});
    var added=gridItemIds.filter(function(id){return byGid[gid][String(id)];});
    var newItemIds=kept.concat(added);
    var currentGridSet=current.filter(function(id){return gridItemIds.indexOf(id)>=0;}).sort();
    var addedSorted=added.slice().sort();
    if(JSON.stringify(currentGridSet)===JSON.stringify(addedSorted)) return; // no change for this group
    g.itemIds=newItemIds;
    if(!g.itemId || (gridItemIds.indexOf(g.itemId)>=0 && newItemIds.indexOf(g.itemId)<0)) g.itemId=newItemIds[0]||null;
    changed++;
  });
  if(!changed) return toast('No changes to save');
  DB.saveGroups(groups);
  toast('Groups grid saved!');
  aggLoadGrid();
  _refreshParticipantsPageIfOpen();
}

function deleteParticipant(chestNo){
  var p=DB.participants().find(function(x){return x.chestNo==chestNo;});
  var items=DB.items(), marks=DB.marks();
  var pItems=(p&&p.items||[]).map(function(id){var it=items.find(function(x){return x.id===id;});return it?it.name:'';}).filter(Boolean);
  var pMarks=marks.filter(function(m){return m.chestNo==chestNo&&m.total>0;});
  var details='';
  if(pItems.length) details+='<div style="margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg> <b>'+pItems.length+'</b> item registration'+(pItems.length>1?'s':'')+(pItems.length<=3?' ('+pItems.join(', ')+')':'')+'</div>';
  if(pMarks.length) details+='<div style="margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="M5 7 2 14a3 3 0 0 0 6 0Z"/><path d="M19 7l-3 7a3 3 0 0 0 6 0Z"/></svg> <b>'+pMarks.length+'</b> mark record'+(pMarks.length>1?'s':'')+'</div>';
  showModal('<div style="text-align:center;padding:8px">'
    +'<div style="font-size:2.5rem;margin-bottom:10px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></div>'
    +'<div style="font-size:1rem;font-weight:800;margin-bottom:4px">Delete Participant?</div>'
    +'<div style="font-size:.88rem;color:var(--accent);font-weight:700;margin-bottom:12px">'+(p?p.name:'#'+chestNo)+'</div>'
    +(details?'<div style="background:rgba(255,71,87,.08);border:1px solid rgba(255,71,87,.3);border-radius:10px;padding:12px;text-align:left;font-size:.8rem;color:var(--text2);margin-bottom:14px">'
      +'<div style="font-weight:700;color:var(--red);margin-bottom:8px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg> The following will also be deleted:</div>'
      +details+'</div>':
      '<div style="font-size:.82rem;color:var(--text3);margin-bottom:14px">This action cannot be undone.</div>')
    +'<div style="display:flex;gap:8px">'
    +'<button class="btn btn-danger" style="flex:1" onclick="confirmDeleteParticipant('+chestNo+')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg> Delete</button>'
    +'<button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>'
    +'</div></div>');
}
function confirmDeleteParticipant(chestNo){
  var participants=DB.participants().filter(function(p){return p.chestNo!=chestNo;});
  DB.saveParticipants(participants); _closeModalClean(); toast('Deleted!'); renderKeepScroll('participants',{tab:window._lastPartTab||'list'});
}

function filterParticipants(q,section){
  filterParticipantList(q, section||'All');
}

function renderCodes(data){
  data=data||{};
  var items=DB.items(),participants=DB.participants(),marks=DB.marks(),groups=DB.groups(),sections=DB.sections();
  var q=(data.q||window._codeSearch||'').toLowerCase();
  var flt=data.filter||window._codeFlt||'all';
  var sec=data.section||window._codeSec||'All';
  window._codeFlt=flt;
  window._codeSec=sec;

  function hasParticipants(item){ return _itemHasParticipants(item, participants, groups); }
  function allAssigned(item){ return _itemAllCodesAssigned(item, participants, groups, marks); }

  var allBaseItems=items.filter(hasParticipants);
  var baseItems=allBaseItems.filter(function(i){return sec==='All'||i.section===sec;});
  var assignedCnt=baseItems.filter(allAssigned).length;
  var unassignedCnt=baseItems.filter(function(i){return !allAssigned(i);}).length;

  var itemsWithP=baseItems.filter(function(item){
    if(flt==='assigned') return allAssigned(item);
    if(flt==='unassigned') return !allAssigned(item);
    return true;
  }).filter(function(item){return !q||item.name.toLowerCase().includes(q);});

  var isFiltered=sec!=='All'||flt!=='all'||!!q;
  var fltBtns='<div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:nowrap;align-items:center">'
    +'<button class="btn btn-sm '+(flt==='all'?'btn-primary':'btn-secondary')+'" onclick="render(\'codes\',{filter:\'all\',section:window._codeSec||\'All\'})">All ('+baseItems.length+')</button>'
    +'<button class="btn btn-sm '+(flt==='assigned'?'btn-primary':'btn-secondary')+'" onclick="render(\'codes\',{filter:\'assigned\',section:window._codeSec||\'All\'})">'+_svgCheckIcon()+' ('+assignedCnt+')</button>'
    +'<button class="btn btn-sm '+(flt==='unassigned'?'btn-primary':'btn-secondary')+'" onclick="render(\'codes\',{filter:\'unassigned\',section:window._codeSec||\'All\'})">'+_svgWarnIcon()+' ('+unassignedCnt+')</button>'
    +_clearFilterBtn(isFiltered)
    +'</div>';

  var secDDItems=[{value:'All',label:'All Sections'}].concat(sections.map(function(s){return {value:s,label:getSectionShortName(s)};}));
  var secDD=_wzDropdown('code-sec-dd', secDDItems, sec, {onSelect:"window._codeSec=$val;render('codes',{filter:window._codeFlt||'all',section:$val})", wrapStyle:'flex-shrink:0;width:128px', btnStyle:'padding:0 10px;font-size:.78rem;height:48px'});

  var srch='<div style="display:flex;gap:8px;margin-bottom:12px;align-items:center">'
    +'<div style="position:relative;flex:1">'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="code-search-inp" style="margin-bottom:0;padding-right:36px" placeholder="Search items..." value="'+(data.q||window._codeSearch||'')+'" oninput="window._codeSearch=this.value;filterCodesList(this.value)">'
    +'<button id="code-clear-btn" onclick="clearCodesSearch()" aria-label="Clear search" style="display:'+(data.q||window._codeSearch?'':'none')+';position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
    +'</div>'
    +secDD
    +'</div>';
  if(!itemsWithP.length){
    var emptyHtml=isFiltered
      ?'No results for "'+(q||sec)+'".'
      :'No items found';
    return fltBtns+srch+'<div style="text-align:center;padding:30px;color:var(--text3)">'+emptyHtml+'</div>';
  }
  return fltBtns+srch+'<div id="codes-list">'+itemsWithP.map(function(item){
    var itemP=item.type==='group'
      ?groups.filter(function(g){return _grpHasItem(g,item);}).map(function(g){return {chestNo:g.groupChestNo,name:g.name,team:g.team,section:g.section};})
      :participants.filter(function(p){return (p.items||[]).includes(item.id);});
    var im=marks.filter(function(m){return m.itemId===item.id;});
    var hasMarks=im.some(function(m){return m.total>0;});
    // allOk: true if every participant has a real code OR is marked absent ('?')
    var allOk=itemP.every(function(p){var m=im.find(function(mk){return mk.chestNo===p.chestNo;});return m&&m.codeLetter;});
    var absentCount=itemP.filter(function(p){var m=im.find(function(mk){return mk.chestNo===p.chestNo;});return m&&m.codeLetter==='?';}).length;
    return '<div class="list-item" style="flex-direction:column;align-items:stretch;padding:0;overflow:hidden;margin-bottom:8px">'
      +'<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;cursor:pointer" onclick="_openCodeModal(\''+item.id+'\')">'
      +'<div class="list-avatar" style="background:'+(allOk?'var(--green)':'var(--accent)')+'22;color:'+(allOk?'var(--green)':'var(--accent)')+';font-size:.7rem;font-weight:800;flex-shrink:0">'+(item.code||'?')+'</div>'
      +'<div class="list-info" style="min-width:0"><div class="list-title" style="font-size:.85rem">'+item.name+'</div>'
      +'<div style="font-size:.7rem;color:var(--text3)">'+item.section+' &middot; '+itemP.length+' participants'+(allOk?(absentCount?' &middot; <span style="color:var(--green)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Assigned</span> &middot; <span style="color:#ff7070">'+absentCount+' absent</span>':' &middot; <span style="color:var(--green)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> All assigned</span>'):' &middot; <span style="color:#f0a500"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg> Missing</span>')+'</div></div>'
      +'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--text3)"><polyline points="6 9 12 15 18 9"/></svg>'
      +'</div>'
      +(allOk?('<div style="padding:0 14px 10px"><button class="btn btn-secondary btn-sm" style="width:100%;display:flex;align-items:center;justify-content:center;gap:6px" onclick="showJudgeLinksModal(\''+item.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Judge Links</button></div>'):'')
      +'</div>';
  }).join('')+'</div>';
}

function filterCodesList(q){
  q=(q||'').toLowerCase().trim();
  var cb=document.getElementById('code-clear-btn');
  if(cb) cb.style.display=q?'':'none';
  var el=document.getElementById('codes-list');
  if(!el) return;
  var cards=el.children;
  for(var i=0;i<cards.length;i++){
    var titleEl=cards[i].querySelector('.list-title');
    var text=titleEl?titleEl.textContent.toLowerCase():'';
    cards[i].style.display=(!q||text.includes(q))?'':'none';
  }
}
// Clearing the search must fully restore the list, not just toggle display on
// whatever happens to already be in the DOM: actions elsewhere (e.g. Save
// Codes) re-render this page server-side using the *current* search text, so
// items that didn't match can be pruned out of the DOM entirely — a plain
// filterCodesList('') has nothing left to un-hide. Re-render from scratch
// with an empty query so the full list always comes back.
function clearCodesSearch(){
  window._codeSearch='';
  renderKeepScroll('codes',{filter:window._codeFlt||'all',q:''});
}

// Clears whichever section/filter/search state belongs to the current tab
// (Codes/Marks/Results) and re-renders that tab with everything reset to
// 'All'. Used by the "Clear filter" link shown in the empty-results state.
function clearFilters(){
  if(currentPage==='codes'){
    window._codeSec='All'; window._codeFlt='all'; window._codeSearch='';
  } else if(currentPage==='marks'){
    window._markSec='All'; window._markFlt='all'; window._markQ='';
  } else if(currentPage==='results'){
    window._resultsSection='All'; window._resultsFlt='all';
  }
  navigate(currentPage, {section:'All', filter:'all'});
}
// Small icon-only "X" button shown at the far right of a filter-buttons row
// when a section/status/search filter is active, letting the user reset
// everything back to defaults in one tap without adding extra text/width.
function _clearFilterBtn(isFiltered){
  if(!isFiltered) return '';
  return '<button class="btn btn-sm" aria-label="Clear filter" title="Clear filter" style="margin-left:auto;flex-shrink:0;width:28px;height:28px;padding:0;border-radius:50%;background:transparent;border:1px solid var(--text3);color:var(--text3);display:inline-flex;align-items:center;justify-content:center" onclick="clearFilters()"><svg viewBox="0 0 24 24" style="width:14px;height:14px;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
}

function renderCodeDetailed(data){
  data=data||{};
  var flt=data.flt||window._cdFlt||'all';
  window._cdFlt=flt;
  var items=DB.items(), participants=DB.participants(), marks=DB.marks(), groups=DB.groups();

  function hasParticipants(item){ return _itemHasParticipants(item, participants, groups); }
  var allWithP=items.filter(hasParticipants);
  if(!allWithP.length) return '<div style="text-align:center;padding:30px;color:var(--text3)">No data yet</div>';

  var onStage=allWithP.filter(function(i){return i.type!=='group'&&i.isStage;});
  var offStage=allWithP.filter(function(i){return i.type!=='group'&&!i.isStage;});
  var grpItems=allWithP.filter(function(i){return i.type==='group';});

  var filteredItems=flt==='stage'?onStage:flt==='offstage'?offStage:flt==='group'?grpItems:allWithP;

  var tabs='<div class="tabs" style="margin-bottom:12px">'
    +'<div class="tab '+(flt==='all'?'active':'')+'" onclick="window._cdFlt=\'all\';navigate(\'codeDetailed\')">All ('+allWithP.length+')</div>'
    +'<div class="tab '+(flt==='stage'?'active':'')+'" onclick="window._cdFlt=\'stage\';navigate(\'codeDetailed\')">On-Stage ('+onStage.length+')</div>'
    +'<div class="tab '+(flt==='offstage'?'active':'')+'" onclick="window._cdFlt=\'offstage\';navigate(\'codeDetailed\')">Off-Stage ('+offStage.length+')</div>'
    +(grpItems.length?'<div class="tab '+(flt==='group'?'active':'')+'" onclick="window._cdFlt=\'group\';navigate(\'codeDetailed\')">Group ('+grpItems.length+')</div>':'')
    +'</div>';

  var ps=getPrintSize();
  var toolbar='<div style="display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">'
    +'<button class="btn btn-primary btn-sm" onclick="printCodeDetailedFiltered()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></svg> Print '+(flt==='all'?'All':'Filtered')+'</button>'
    +'</div>';

  if(!filteredItems.length) return tabs+toolbar+'<div style="text-align:center;padding:30px;color:var(--text3)">No items in this category</div>';

  var cards=filteredItems.map(function(item){
    var isGrp=item.type==='group';
    var itemP=isGrp
      ?groups.filter(function(g){return _grpHasItem(g,item);}).map(function(g){return {chestNo:g.groupChestNo,name:g.name,team:g.team,section:g.section};})
      :participants.filter(function(p){return (p.items||[]).includes(item.id);});
    var itemMarks=marks.filter(function(m){return m.itemId===item.id;});
    var sorted=itemP.map(function(p){return {p:p,m:itemMarks.find(function(m){return m.chestNo===p.chestNo;})};})
      .sort(function(a,b){return (a.m&&a.m.codeLetter?a.m.codeLetter:'').localeCompare(b.m&&b.m.codeLetter?b.m.codeLetter:'');});
    var stagePill=isGrp
      ?'<span class="badge badge-blue" style="font-size:.6rem">Group</span>'
      :item.isStage
        ?'<span class="badge badge-orange" style="font-size:.6rem">On-Stage</span>'
        :'<span class="badge badge-green" style="font-size:.6rem">Off-Stage</span>';
    var rows=sorted.map(function(x){
      var p=x.p, m=x.m;
      return '<tr style="height:36px">'
        +'<td><b style="color:var(--accent);font-size:1.1rem">'+(m&&m.codeLetter?m.codeLetter:'?')+'</b></td>'
        +'<td style="font-weight:600">#'+p.chestNo+'</td>'
        +'<td>'+p.name+'</td>'
        +'<td style="font-size:.78rem">'+p.team+'</td>'
        +'<td><div style="border-bottom:1px solid var(--border);height:20px;margin:6px 10px"></div></td>'
        +'</tr>';
    }).join('');
    return '<div class="card">'
      +'<div style="margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;flex-wrap:wrap">'
      +'<div><div style="font-size:.68rem;font-weight:700;letter-spacing:1.5px;color:var(--text3);margin-bottom:3px">'+item.section+'</div>'
      +'<div style="font-weight:800;color:var(--gold);font-size:1rem">'+item.name+'</div></div>'
      +stagePill+'</div>'
      +'<div style="overflow-x:auto"><table class="code-table" style="min-width:420px">'
      +'<tr><th style="width:55px">Code</th><th style="width:85px">Chest No.</th><th>Name</th><th>Group / Team</th><th style="width:110px;text-align:center">Signature</th></tr>'
      +rows
      +'</table></div></div>';
  }).join('');

  return tabs+toolbar+cards;
}

function printCodeDetailedFiltered(){
  var flt=window._cdFlt||'all';
  var items=DB.items(), participants=DB.participants(), marks=DB.marks(), groups=DB.groups(), cfg=DB.config();
  var PS=PSZ();

  function hasParticipants(item){ return _itemHasParticipants(item, participants, groups); }
  var allWithP=items.filter(hasParticipants);
  var onStage=allWithP.filter(function(i){return i.type!=='group'&&i.isStage;});
  var offStage=allWithP.filter(function(i){return i.type!=='group'&&!i.isStage;});
  var grpItems=allWithP.filter(function(i){return i.type==='group';});
  var targetItems=flt==='stage'?onStage:flt==='offstage'?offStage:flt==='group'?grpItems:allWithP;

  var titleMap={stage:'On-Stage Events',offstage:'Off-Stage Events',group:'Group Events',all:'All Events'};
  var html=printHeader(cfg)+'<h2><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg> Code List Detailed &mdash; '+titleMap[flt]+'</h2>';

  targetItems.forEach(function(item){
    var isGrp=item.type==='group';
    var itemP=isGrp
      ?groups.filter(function(g){return _grpHasItem(g,item);}).map(function(g){return {chestNo:g.groupChestNo,name:g.name,team:g.team,section:g.section};})
      :participants.filter(function(p){return (p.items||[]).includes(item.id);});
    var itemMarks=marks.filter(function(m){return m.itemId===item.id;});
    var rows=itemP
      .filter(function(p){var me=itemMarks.find(function(m){return m.chestNo===p.chestNo;});return !(me&&me.codeLetter==='?');})
      .map(function(p){var me=itemMarks.find(function(m){return m.chestNo===p.chestNo;});return {p:p,code:me&&me.codeLetter&&me.codeLetter!=='?'?me.codeLetter:''};})
      .sort(function(a,b){if(a.code&&!b.code)return -1;if(!a.code&&b.code)return 1;return a.code.localeCompare(b.code);});
    if(!rows.length) return;
    html+='<div style="page-break-inside:avoid;margin-bottom:'+PS.blockBottomMargin+'">'
      +'<div style="padding-bottom:7px;border-bottom:'+PS.secBorder+' solid #8a4b00;margin-bottom:'+PS.secBottomMargin+'">'
      +'<div style="font-size:calc('+PS.sectionLbl+' + .15rem);font-weight:900;letter-spacing:1.5px;color:#8a4b00;margin-bottom:2px">'+item.section+'</div>'
      +'<div style="font-size:'+PS.itemNameSm+';font-weight:900;color:#1a0d30">'+item.name+'</div>'
      +'<div style="font-size:'+PS.countLbl+';font-weight:900;color:#222;margin-top:2px">'+rows.length+' participant'+(rows.length!==1?'s':'')+(item.code?' &middot; Code: <b>'+item.code+'</b>':'')+'</div>'
      +'</div>'
      +'<table style="width:100%;border-collapse:collapse;font-size:'+PS.table+'">'
      +'<thead><tr style="background:#1a0d30;color:#fff">'
      +'<th style="padding:'+PS.hdrPad+';width:8%">Code</th>'
      +'<th style="padding:'+PS.hdrPad+';width:12%;text-align:center">Chest No.</th>'
      +'<th style="padding:'+PS.hdrPad+';width:38%">Name</th>'
      +'<th style="padding:'+PS.hdrPad+';width:20%">Team</th>'
      +'<th style="padding:'+PS.hdrPad+';width:22%;text-align:center">Signature</th>'
      +'</tr></thead><tbody>'
      +rows.map(function(r,ri){
        return '<tr style="background:'+(ri%2===0?'#fff':'#f5f3ff')+'">'
          +'<td style="padding:'+PS.cellPad+';font-size:'+PS.codeSm+';font-weight:900;color:#000;height:'+PS.rowH+'">'+r.code+'</td>'
          +'<td style="padding:'+PS.cellPad+';text-align:center;font-weight:900;color:#222">#'+r.p.chestNo+_openSecSuffix(item,r.p.section)+'</td>'
          +'<td style="padding:'+PS.cellPad+';font-weight:900;color:#000">'+r.p.name+'</td>'
          +'<td style="padding:'+PS.cellPad+';font-size:'+PS.countLbl+';font-weight:900;color:#222">'+r.p.team+'</td>'
          +'<td style="padding:'+PS.cellPad+'">&nbsp;</td>'
          +'</tr>';
      }).join('')
      +'</tbody></table></div>';
  });
  openPrint(html);
}
function renderMarkSheetPage(data){
  data=data||{};
  var flt=data.flt||window._msFlt||'all';
  window._msFlt=flt;
  var items=DB.items(), participants=DB.participants(), groups=DB.groups();

  function hasParticipants(item){ return _itemHasParticipants(item, participants, groups); }
  var allWithP=items.filter(hasParticipants);
  if(!allWithP.length) return '<div style="text-align:center;padding:30px;color:var(--text3)">No data yet</div>';

  var onStage=allWithP.filter(function(i){return i.type!=='group'&&i.isStage;});
  var offStage=allWithP.filter(function(i){return i.type!=='group'&&!i.isStage;});
  var grpItems=allWithP.filter(function(i){return i.type==='group';});

  var filteredItems=flt==='stage'?onStage:flt==='offstage'?offStage:flt==='group'?grpItems:allWithP;

  var tabs='<div class="tabs" style="margin-bottom:12px">'
    +'<div class="tab '+(flt==='all'?'active':'')+'" onclick="window._msFlt=\'all\';navigate(\'markSheet\')">All ('+allWithP.length+')</div>'
    +'<div class="tab '+(flt==='stage'?'active':'')+'" onclick="window._msFlt=\'stage\';navigate(\'markSheet\')">On-Stage ('+onStage.length+')</div>'
    +'<div class="tab '+(flt==='offstage'?'active':'')+'" onclick="window._msFlt=\'offstage\';navigate(\'markSheet\')">Off-Stage ('+offStage.length+')</div>'
    +(grpItems.length?'<div class="tab '+(flt==='group'?'active':'')+'" onclick="window._msFlt=\'group\';navigate(\'markSheet\')">Group ('+grpItems.length+')</div>':'')
    +'</div>';

  var ps=getPrintSize();
  var toolbar='<div style="display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">'
    +'<button class="btn btn-primary btn-sm" onclick="printMarkSheet()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></svg> Print '+(flt==='all'?'All':'Filtered')+'</button>'
    +'</div>';

  if(!filteredItems.length) return tabs+toolbar+'<div style="text-align:center;padding:30px;color:var(--text3)">No items in this category</div>';

  var cards=filteredItems.map(function(item){
    var isGrp=item.type==='group';
    var itemP=isGrp
      ?groups.filter(function(g){return _grpHasItem(g,item);})
      :participants.filter(function(p){return (p.items||[]).includes(item.id);});
    var stagePill=isGrp
      ?'<span class="badge badge-blue" style="font-size:.6rem">Group</span>'
      :item.isStage
        ?'<span class="badge badge-orange" style="font-size:.6rem">On-Stage</span>'
        :'<span class="badge badge-green" style="font-size:.6rem">Off-Stage</span>';
    return '<div class="card" style="display:flex;align-items:center;justify-content:space-between;gap:10px">'
      +'<div><div style="font-size:.68rem;font-weight:700;letter-spacing:1.5px;color:var(--text3);margin-bottom:3px">'+item.section+'</div>'
      +'<div style="font-weight:800;color:var(--gold);font-size:1rem">'+item.name+'</div>'
      +'<div style="font-size:.72rem;color:var(--text3);margin-top:2px">'+itemP.length+' participant'+(itemP.length!==1?'s':'')+'</div></div>'
      +stagePill+'</div>';
  }).join('');

  return tabs+toolbar+cards;
}

function printMarkSheet(){
  var flt=window._msFlt||'all';
  var cfg=DB.config(), participants=DB.participants(), items=DB.items(), marks=DB.marks(), groups=DB.groups();
  var nj=parseInt(cfg.maxJudges)||3;
  var PS=PSZ();
  function hasParticipants(item){ return _itemHasParticipants(item, participants, groups); }
  var allWithP=items.filter(hasParticipants);
  var onStage=allWithP.filter(function(i){return i.type!=='group'&&i.isStage;});
  var offStage=allWithP.filter(function(i){return i.type!=='group'&&!i.isStage;});
  var grpItems=allWithP.filter(function(i){return i.type==='group';});
  var targetItems=flt==='stage'?onStage:flt==='offstage'?offStage:flt==='group'?grpItems:allWithP;
  if(!targetItems.length){ toast('No items with participants to print','error'); return; }
  var titleMap={stage:'On-Stage Events',offstage:'Off-Stage Events',group:'Group Events',all:'All Events'};
  var html=printHeader(cfg)+'<h2><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h12l4 4v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M8 10h8"/><path d="M8 14h8"/><path d="M8 18h5"/></svg> Mark Sheet &mdash; '+titleMap[flt]+'</h2>';
  targetItems.forEach(function(item){
    var isGrp=item.type==='group';
    var itemP=isGrp
      ?groups.filter(function(g){return _grpHasItem(g,item);}).map(function(g){return {chestNo:g.groupChestNo};})
      :participants.filter(function(p){return (p.items||[]).includes(item.id);});
    var itemMarks=marks.filter(function(m){return m.itemId===item.id;});
    var rows=itemP
      .filter(function(p){var me=itemMarks.find(function(m){return m.chestNo===p.chestNo;});return !(me&&me.codeLetter==='?');})
      .map(function(p){var me=itemMarks.find(function(m){return m.chestNo===p.chestNo;});return {code:me&&me.codeLetter&&me.codeLetter!=='?'?me.codeLetter:''};})
      .sort(function(a,b){if(a.code&&!b.code)return -1;if(!a.code&&b.code)return 1;return a.code.localeCompare(b.code);});
    if(!rows.length) return;
    var markColWidth=Math.max(10,Math.floor(60/nj));
    var markHead='';
    for(var ji=0;ji<nj;ji++){
      markHead+='<th style="padding:'+PS.hdrPad+';width:'+markColWidth+'%;text-align:center;font-size:'+PS.markHead+'">Mark'+(nj>1?' '+(ji+1):'')+'</th>';
    }
    var judgeSignBlock='';
    for(var jb=0;jb<nj;jb++){
      judgeSignBlock+='<div style="display:flex;gap:24px;margin-top:'+(jb===0?22:16)+'px">'
        +'<div style="flex:1;border-top:'+PS.judgeBorder+' solid #000;padding-top:6px;font-size:'+PS.judgeLbl+';font-weight:900;color:#000">'+(nj>1?'Judge '+(jb+1)+' ':'Judge ')+'Name</div>'
        +'<div style="flex:1;border-top:'+PS.judgeBorder+' solid #000;padding-top:6px;font-size:'+PS.judgeLbl+';font-weight:900;color:#000">Signature</div>'
        +'</div>';
    }
    html+='<div style="page-break-inside:avoid;margin-bottom:'+PS.blockBottomMargin+'">'
      +'<div style="padding-bottom:8px;border-bottom:'+PS.secBorder+' solid #8a4b00;margin-bottom:'+PS.secBottomMargin+'">'
      +'<div style="font-size:'+PS.sectionLbl+';font-weight:900;letter-spacing:1.5px;color:#8a4b00;margin-bottom:2px">'+item.section+'</div>'
      +'<div style="font-size:'+PS.itemNameSm+';font-weight:900;color:#1a0d30">'+item.name+(item.code?' &middot; Code: <b>'+item.code+'</b>':'')+'</div>'
      +'<div style="font-size:'+PS.countLbl+';font-weight:900;color:#222;margin-top:2px">'+rows.length+' participant'+(rows.length!==1?'s':'')+'</div>'
      +'</div>'
      +'<table style="width:100%;border-collapse:collapse;font-size:'+PS.table+'">'
      +'<thead><tr style="background:#1a0d30;color:#fff">'
      +'<th style="padding:'+PS.hdrPad+';width:'+(100-markColWidth*nj)+'%;font-size:'+PS.markHead+'">Code</th>'
      +markHead
      +'</tr></thead><tbody>'
      +rows.map(function(r,ri){
        var jCells='';
        for(var ji=0;ji<nj;ji++){ jCells+='<td style="padding:'+PS.cellPad+';text-align:center;border-left:1px solid #ddd;height:'+PS.rowH+'">&nbsp;</td>'; }
        return '<tr style="background:'+(ri%2===0?'#fff':'#f5f3ff')+'">'
          +'<td style="padding:'+PS.cellPad+';font-size:'+PS.code+';font-weight:900;color:#000">'+(r.code||'&nbsp;')+'</td>'
          +jCells
          +'</tr>';
      }).join('')
      +'</tbody></table>'
      +judgeSignBlock
      +'</div>';
  });
  openPrint(html);
}
function editCodeSafe(itemId, chestNo, hasMarks){
  if(hasMarks){
    showModal('<div style="text-align:center;padding:8px">'
      +'<div style="font-size:2rem;margin-bottom:10px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg></div>'
      +'<div style="font-weight:800;margin-bottom:8px">Marks Already Entered</div>'
      +'<div style="font-size:.82rem;color:var(--text3);margin-bottom:16px">Changing this code letter after marks are entered will cause a mismatch. The judge\'s physical paper and the app will not match.</div>'
      +'<div style="display:flex;gap:8px">'
      +'<button class="btn btn-danger" style="flex:1" onclick="closeModal();editCode(\''+itemId+'\','+chestNo+')">Change Anyway</button>'
      +'<button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>'
      +'</div></div>');
  } else {
    editCode(itemId, chestNo);
  }
}

function assignCodesSafe(itemId, hasMarks){
  if(hasMarks){
    showModal('<div style="text-align:center;padding:8px">'
      +'<div style="font-size:2rem;margin-bottom:10px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg></div>'
      +'<div style="font-weight:800;margin-bottom:8px">Marks Already Entered</div>'
      +'<div style="font-size:.82rem;color:var(--text3);margin-bottom:16px">Re-assigning codes will shuffle them randomly. This will break the match between the judge\'s paper and the app data.</div>'
      +'<div style="display:flex;gap:8px">'
      +'<button class="btn btn-danger" style="flex:1" onclick="_closeModalClean();_openCodeModal(\''+itemId+'\');setTimeout(function(){assignCodes(\''+itemId+'\');},80)">Re-assign Anyway</button>'
      +'<button class="btn btn-secondary" style="flex:1" onclick="_closeModalClean();_openCodeModal(\''+itemId+'\')">Cancel</button>'
      +'</div></div>');
  } else {
    assignCodes(itemId);
  }
}


function editCode(itemId, chestNo){
  const marks=DB.marks();
  const existing=marks.find(m=>m.itemId==itemId&&m.chestNo===chestNo);
  showModal(`<div class="modal-handle"></div><div class="modal-title">Edit Code Letter</div>
  <div class="form-group"><label class="form-label">Code Letter</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="edit-code" value="${(existing&&existing.codeLetter?existing.codeLetter:'')}" placeholder="e.g. A" maxlength="3"></div>
  <button class="btn btn-primary" onclick="saveCodeEdit('${itemId}',${chestNo})">Save</button>`);
}
function saveCodeEdit(itemId,chestNo){
  const code=v('edit-code').trim().toUpperCase();
  if(!code) return toast('Enter code letter','error');
  const marks=DB.marks();
  // Check for duplicate code in same item (different participant)
  const dup=marks.find(function(m){return m.itemId==itemId&&m.chestNo!==chestNo&&m.codeLetter&&m.codeLetter.toUpperCase()===code;});
  if(dup){
    var participants=DB.participants(),groups=DB.groups();
    var dupP=participants.find(function(p){return p.chestNo===dup.chestNo;});
    var dupG=groups.find(function(g){return g.groupChestNo===dup.chestNo;});
    var dupName=dupP?dupP.name:(dupG?dupG.name:'#'+dup.chestNo);
    return toast('Code "'+code+'" already used by '+dupName,'error');
  }
  const idx=marks.findIndex(m=>m.itemId==itemId&&m.chestNo===chestNo);
  if(idx>=0) marks[idx].codeLetter=code;
  else marks.push({id:_nextUniqueIds(marks,1)[0],itemId,chestNo,codeLetter:code,marks:[],total:0,grade:'',rank:0});
  DB.saveMarks(marks);
  // Auto-undeclare if item was declared — code letters changed.
  var dbItems=DB.items();
  var iIdx=dbItems.findIndex(function(i){return i.id==itemId;});
  var msg='Code updated!';
  if(iIdx>=0&&dbItems[iIdx].declared){
    dbItems[iIdx].declared=false;
    DB.saveItems(dbItems);
    msg='Code updated! (Auto-undeclared)';
  }
  closeModal(); toast(msg); renderKeepScroll('codes');
}
function liveCheckCodeDup(inputEl, itemId, chestNo){
  var code=(inputEl.value||'').trim().toUpperCase();
  if(!code){
    inputEl.style.border='2px solid rgba(255,80,80,.4)';
    inputEl.style.color='#ff7070';
    inputEl.style.background='rgba(255,80,80,.08)';
    return;
  }
  // '?' = absent marker — style red, never a real duplicate
  if(code==='?'){
    inputEl.style.border='2px solid rgba(255,80,80,.6)';
    inputEl.style.color='#ff7070';
    inputEl.style.background='rgba(255,80,80,.1)';
    inputEl.title='Marked as absent';
    return;
  }
  var marks=DB.marks();
  // Check dup in saved marks (different participant, same item)
  var dupSaved=marks.find(function(m){return m.itemId==itemId&&m.chestNo!==chestNo&&m.codeLetter&&m.codeLetter.toUpperCase()===code;});
  // Check dup in other currently-open inputs for same item (unsaved)
  var allInputs=document.querySelectorAll('input[id^="cl_'+itemId+'_"]');
  var dupInput=false;
  allInputs.forEach(function(el){
    if(el===inputEl) return;
    if((el.value||'').trim().toUpperCase()===code) dupInput=true;
  });
  if(dupSaved||dupInput){
    inputEl.style.border='2px solid rgba(255,80,80,.7)';
    inputEl.style.color='#ff5050';
    inputEl.style.background='rgba(255,80,80,.12)';
    inputEl.title='Duplicate code!';
  } else {
    inputEl.style.border='2px solid var(--green)';
    inputEl.style.color='var(--green)';
    inputEl.style.background='rgba(0,200,150,0.08)';
    inputEl.title='';
  }
}
function saveItemCodes(itemId, uid, isModal){
  var items=DB.items(), participants=DB.participants(), groups=DB.groups(), marks=DB.marks();
  var item=items.find(function(i){return i.id==itemId;});
  if(!item) return;
  var itemP=item.type==='group'
    ?groups.filter(function(g){return _grpHasItem(g,itemId);}).map(function(g){return {chestNo:g.groupChestNo};})
    :participants.filter(function(p){return (p.items||[]).includes(itemId);});
  var errors=[];
  var updates=[];
  var clears=[]; // chestNos whose code letter was intentionally blanked out
  // Collect all entered codes first for duplicate check
  itemP.forEach(function(p){
    var iid='cl_'+itemId+'_'+p.chestNo;
    var el=document.getElementById(iid);
    if(!el) return;
    var code=(el.value||'').trim().toUpperCase();
    if(!code){
      // Field left blank on purpose — queue this participant's saved code
      // letter to actually be cleared below, instead of silently skipping it:
      // skipping meant the old code letter stayed saved underneath the blank
      // input and would reappear ("roll back") the next time Codes re-rendered.
      var existingBlank=marks.find(function(m){return m.itemId==itemId&&m.chestNo===p.chestNo;});
      if(existingBlank&&existingBlank.codeLetter) clears.push(p.chestNo);
      return;
    }
    // '?' = absent marker — allow duplicates, skip dup check
    if(code==='?'){ updates.push({chestNo:p.chestNo, code:'?', el:el}); return; }
    var dupInUpdate=updates.find(function(u){return u.code===code;});
    if(dupInUpdate){errors.push('Duplicate code "'+code+'"'); return;}
    updates.push({chestNo:p.chestNo, code:code, el:el});
  });
  if(errors.length){toast(errors[0],'error'); return;}
  // Check if any code actually changed (to decide whether to wipe marks) —
  // clearing a previously-assigned code counts as a change too.
  var hasMarks=marks.some(function(m){return m.itemId==itemId&&m.total>0;});
  var codeChanged=clears.length>0||updates.some(function(u){
    var existing=marks.find(function(m){return m.itemId==itemId&&m.chestNo===u.chestNo;});
    return !existing||!existing.codeLetter||(existing.codeLetter.toUpperCase()!==u.code);
  });
  if(hasMarks&&codeChanged){
    // Wipe all mark data for this item (keep codeLetter slot but clear marks)
    marks=marks.map(function(m){
      if(m.itemId!=itemId) return m;
      // Reset to truly blank so mark inputs show empty, not "0"
      return {id:m.id,itemId:m.itemId,chestNo:m.chestNo,codeLetter:m.codeLetter,total:0,grade:'',pct:0,point:0,rank:0};
    });
    // Also undeclare the item
    var dbItems=DB.items();
    var iIdx=dbItems.findIndex(function(i){return i.id==itemId;});
    if(iIdx>=0&&dbItems[iIdx].declared){
      dbItems[iIdx].declared=false;
      DB.saveItems(dbItems);
    }
  }
  // Save all codes
  updates.forEach(function(u){
    var idx=marks.findIndex(function(m){return m.itemId==itemId&&m.chestNo===u.chestNo;});
    if(idx>=0) marks[idx].codeLetter=u.code;
    else marks.push({id:_nextUniqueIds(marks,1)[0],itemId:itemId,chestNo:u.chestNo,codeLetter:u.code,total:0,grade:'',rank:0});
    u.el.style.border='2px solid var(--green)';
    u.el.style.color='var(--green)';
    u.el.style.background='rgba(0,200,150,0.1)';
  });
  // Apply intentionally-blanked fields — actually clear the saved code
  // letter rather than leaving the field's underlying data untouched.
  clears.forEach(function(chestNo){
    var idx=marks.findIndex(function(m){return m.itemId==itemId&&m.chestNo===chestNo;});
    if(idx>=0) marks[idx].codeLetter='';
  });
  DB.saveMarks(marks);
  var msg='Codes saved!';
  if(hasMarks&&codeChanged) msg='Codes saved. Marks cleared & undeclared.';
  toast(msg);
  _setPageUnsaved(false);
  if(isModal){
    _pageUnsaved=false;
    _closeCodeModalClean();
    renderKeepScroll('codes',{filter:window._codeFlt||'all',q:window._codeSearch||''});
  } else {
    renderKeepScroll('codes',{filter:window._codeFlt||'all',q:window._codeSearch||''},uid);
  }
}
function inlineCodeSave(itemId,chestNo,inputEl){
  var code=(inputEl.value||'').trim().toUpperCase();
  var marks=DB.marks();
  if(!code){
    // Field was cleared on purpose. Actually remove the saved code letter
    // instead of silently leaving the old one in place — previously this just
    // returned early, so a cleared field looked blank on screen but the old
    // code letter was still saved underneath, and it would reappear ("roll
    // back") the moment the Codes list re-rendered.
    var idxClr=marks.findIndex(function(m){return m.itemId==itemId&&m.chestNo===chestNo;});
    if(idxClr>=0&&marks[idxClr].codeLetter){
      marks[idxClr].codeLetter='';
      DB.saveMarks(marks);
      var dbItemsClr=DB.items();
      var iIdxClr=dbItemsClr.findIndex(function(i){return i.id==itemId;});
      if(iIdxClr>=0&&dbItemsClr[iIdxClr].declared){
        dbItemsClr[iIdxClr].declared=false;
        DB.saveItems(dbItemsClr);
        toast('Code cleared. (Auto-undeclared)');
      }
    }
    inputEl.style.border='2px solid rgba(255,80,80,.4)';
    inputEl.style.color='#ff7070';
    inputEl.style.background='rgba(255,80,80,.08)';
    return;
  }
  // Duplicate check within same item
  var dup=marks.find(function(m){return m.itemId==itemId&&m.chestNo!==chestNo&&m.codeLetter&&m.codeLetter.toUpperCase()===code;});
  if(dup){
    var participants=DB.participants(),groups=DB.groups();
    var dupP=participants.find(function(p){return p.chestNo===dup.chestNo;});
    var dupG=groups.find(function(g){return g.groupChestNo===dup.chestNo;});
    var dupName=dupP?dupP.name:(dupG?dupG.name:'#'+dup.chestNo);
    toast('Code "'+code+'" already used by '+dupName,'error');
    inputEl.value=''; // clear the bad entry
    inputEl.style.border='2px solid rgba(255,80,80,.7)';
    inputEl.style.color='#ff7070';
    inputEl.focus();
    return;
  }
  var idx=marks.findIndex(function(m){return m.itemId==itemId&&m.chestNo===chestNo;});
  if(idx>=0) marks[idx].codeLetter=code;
  else marks.push({id:_nextUniqueIds(marks,1)[0],itemId,chestNo,codeLetter:code,marks:[],total:0,grade:'',rank:0});
  DB.saveMarks(marks);
  // Auto-undeclare if item was declared — code letters changed.
  var dbItemsIC=DB.items();
  var iIdxIC=dbItemsIC.findIndex(function(i){return i.id==itemId;});
  if(iIdxIC>=0&&dbItemsIC[iIdxIC].declared){
    dbItemsIC[iIdxIC].declared=false;
    DB.saveItems(dbItemsIC);
    toast('Code saved. (Auto-undeclared)');
  }
  // Visual feedback — turn green briefly
  inputEl.style.border='2px solid var(--green)';
  inputEl.style.color='var(--green)';
  inputEl.style.background='rgba(0,200,150,0.1)';
  setTimeout(function(){
    inputEl.style.border='2px solid var(--accent)44';
    inputEl.style.color='var(--accent)';
    inputEl.style.background='var(--accent)11';
  }, 800);
}
function assignCodes(itemId){
  const item=DB.items().find(i=>i.id==itemId);
  const allEntries=item&&item.type==='group'
    ? DB.groups().filter(g=>_grpHasItem(g,itemId)).map(g=>g.groupChestNo)
    : DB.participants().filter(p=>(p.items||[]).includes(itemId)).map(p=>p.chestNo);
  const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  // NEVER auto-assign to participants already marked absent ('?') — skip them
  const savedMarks=DB.marks().filter(m=>m.itemId==itemId);
  const entries=allEntries.filter(chestNo=>{
    const el=document.getElementById('cl_'+itemId+'_'+chestNo);
    // Skip if current input value is '?' (set manually) OR saved mark is '?'
    const inputVal=(el?el.value:'').trim().toUpperCase();
    const savedCode=(savedMarks.find(m=>m.chestNo===chestNo)||{}).codeLetter||'';
    return inputVal!=='?' && savedCode!=='?';
  });
  const shuffled=[...entries].sort(()=>Math.random()-.5);
  // Only fill the input fields — don't save to DB (user must click Save Codes)
  shuffled.forEach((chestNo,idx)=>{
    const code=idx<26?letters[idx]:letters[idx%26]+Math.floor(idx/26);
    const el=document.getElementById('cl_'+itemId+'_'+chestNo);
    if(el){
      el.value=code;
      el.style.border='2px solid var(--accent)44';
      el.style.color='var(--accent)';
      el.style.background='var(--accent)11';
    }
  });
  const skipped=allEntries.length-entries.length;
  var inModal=!!window._activeCodeModalItemId;
  window._tempSaveCB = function(){ saveItemCodes(itemId, inModal?null:'cblock-'+itemId, inModal); };
  _setPageUnsaved(true, 'Code Letters');
  toast('Codes filled!'+(skipped?' ('+skipped+' absent skipped)':'')+' Press Save Codes to confirm.');
}

function liveMarkUpdate(itemId, chestNo, numJudges, maxPerJudge){
  var cfg=DB.config();
  var item=DB.items().find(function(i){return i.id==itemId;});
  var isGrp=item&&item.type==='group';
  var vals=[];
  for(var ji=0;ji<numJudges;ji++){
    var el=document.getElementById('im-'+itemId+'-'+chestNo+'-'+ji);
    var v=el?parseFloat(el.value)||0:0;
    if(v>maxPerJudge){
      if(el){el.value=''; el.style.border='2px solid rgba(255,80,80,.7)'; el.style.color='#ff5050';}
      toast('Max mark is '+maxPerJudge,'error');
      v=0;
    } else if(el&&el.style.border.includes('255,80,80')){
      el.style.border=''; el.style.color='';
    }
    if(v<0){v=0; if(el) el.value=0;}
    vals.push(v);
  }
  var total=vals.reduce(function(a,b){return a+b;},0);
  var maximum=numJudges*maxPerJudge;
  var pct=maximum>0?Math.min(100,(total/maximum)*100):0;
  var grade=calcGrade(pct);
  var pts=(cfg.gradePointsEnabled===false)?0:(isGrp?calcGrpGradePoints(grade,cfg):calcIndvGradePoints(grade,cfg));
  var fb=document.getElementById('imfb-'+itemId+'-'+chestNo);
  if(fb){
    if(total>0){
      fb.style.display='flex';
      fb.innerHTML='<span style="font-size:.82rem;font-weight:800;color:var(--green)">'+grade+'</span>'
        +'<span style="font-size:.75rem;color:var(--text2)">'+Math.round(pct)+'%</span>'
        +'<span style="font-size:.82rem;font-weight:800;color:var(--accent)">'+pts+' pts</span>';
    } else {
      fb.style.display='none';
    }
  }
  // Auto-undeclare if item was declared
  var items=DB.items();
  var iIdx=items.findIndex(function(i){return i.id==itemId;});
  if(iIdx>=0&&items[iIdx].declared){
    items[iIdx].declared=false;
    DB.saveItems(items);
  }
}
function renderInlineMarkEntry(item, im, nj, mj, isModal){
  var participants=DB.participants(), groups=DB.groups(), cfg=DB.config();
  var isGrp=item.type==='group';
  var itemP=isGrp
    ?groups.filter(function(g){return _grpHasItem(g,item);}).map(function(g){return {chestNo:g.groupChestNo,name:g.name,team:g.team,section:g.section};})
    :participants.filter(function(p){return (p.items||[]).includes(item.id);});
  // Exclude absent participants (code='?') from mark entry
  var activeP=itemP.filter(function(p){
    var me=im.find(function(m){return m.chestNo===p.chestNo;});
    return !(me&&me.codeLetter==='?');
  });
  var sortedP=activeP.slice().sort(function(a,b){
    var ma=im.find(function(m){return m.chestNo===a.chestNo;});
    var mb=im.find(function(m){return m.chestNo===b.chestNo;});
    return (ma?ma.codeLetter||'':'').localeCompare(mb?mb.codeLetter||'':'');
  });
  var html=isModal?'':'<div style="padding:8px 12px">';
  if(!isModal) html+='<div style="font-size:.68rem;color:var(--text3);margin-bottom:6px">'+nj+' judge'+(nj>1?'s':'')+' &middot; max '+mj+' each</div>';
  var cfgJudges=cfg.judges||[];
  if(cfgJudges.length){
    var judgeIds=item.judgeIds||[];
    html+='<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:8px;padding:6px 8px;background:var(--bg3);border-radius:8px">'
      +'<span style="font-size:.66rem;color:var(--text3);font-weight:700;text-transform:uppercase;letter-spacing:.4px">Judges:</span>';
    for(var jsi=0;jsi<nj;jsi++){
      var curJid=judgeIds[jsi]||'';
      html+=_judgeDropdownHTML(item.id,jsi,curJid,cfgJudges);
    }
    html+='</div>';
  }
  sortedP.forEach(function(p){
    var me=im.find(function(m){return m.chestNo===p.chestNo;})||{};
    var code=me.codeLetter||'?';
    var hasMark=me.total>0;
    // One compact row per participant
    html+='<div style="display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid var(--border)">';
    // Code badge
    html+='<div style="width:28px;height:28px;border-radius:50%;background:var(--accent)22;color:var(--accent);font-weight:900;display:flex;align-items:center;justify-content:center;font-size:.85rem;flex-shrink:0">'+code+'</div>';
    // Judge inputs inline
    html+='<div style="display:flex;gap:4px;flex:1">';
    for(var ji=0;ji<nj;ji++){
      var val=me['mark'+(ji+1)]; val=(val!==undefined&&val!=='')? val:'';
      html+='<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="mark-input" id="im-'+item.id+'-'+p.chestNo+'-'+ji+'"';
	html+=' type="number" min="0" max="'+mj+'"';
	html+=' value="'+val+'" placeholder="J'+(ji+1)+'"';
	html+=' style="width:46px;padding:4px 3px;font-size:.85rem;text-align:center"';
	html+=' oninput="liveMarkUpdate(\''+item.id+'\','+p.chestNo+','+nj+','+mj+');window._tempSaveCB=function(){saveInlineMarks(\''+item.id+'\','+nj+','+mj+',\'mi-'+item.id+'\');};_setPageUnsaved(true,\'Mark Entry\')"';
	html+='>';
    }
    html+='</div>';
    // Live feedback
    html+='<div id="imfb-'+item.id+'-'+p.chestNo+'" style="'+(hasMark?'display:flex':'display:none')+';gap:5px;align-items:center;flex-shrink:0;min-width:90px">';
    if(hasMark) html+='<span style="font-size:.75rem;font-weight:800;color:var(--green)">'+me.grade+'</span><span style="font-size:.7rem;color:var(--text2)">'+Math.round(me.pct||0)+'%</span><span style="font-size:.75rem;font-weight:800;color:var(--accent)">'+(me.point||0)+'pt</span>';
    html+='</div>';
    html+='</div>';
  });
  var allSaved=sortedP.every(function(p){var me=im.find(function(m){return m.chestNo===p.chestNo;});return me&&me.total>0;})&&sortedP.length>0;
  // Only gate the *Declare* action on every mark being in — Undeclare must
  // always be clickable once an item is declared, otherwise a mark that
  // gets cleared/added afterwards (any of which auto-undeclares elsewhere
  // in the app) can leave item.declared=true with allSaved now false,
  // silently disabling the only button that could fix that state.
  var declareGateOk=item.declared||allSaved;
  if(!isModal){
    html+='<div style="display:flex;gap:8px;margin-top:4px">';
    html+='<button class="btn btn-primary" style="flex:1" id="savebtn-'+item.id+'" onclick="saveInlineMarks(\''+item.id+'\','+nj+','+mj+',&quot;mi-'+item.id+'&quot;,false)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h6"/></svg> Save All</button>';
    var declStyle=declareGateOk?'flex:1':'flex:1;opacity:.45;pointer-events:none';
    var declClick=declareGateOk?'onclick="toggleDeclareInline(\''+item.id+'\',false)"':'';
    html+='<button class="btn '+(item.declared?'btn-warning':'btn-success')+'" style="'+declStyle+'" '+declClick+'>'+(item.declared?'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Undeclare':'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a1 1 0 0 0 1 1h1l3 6h2l-2-6h5l7 4V6l-7 4H4a1 1 0 0 0-1 1Z"/></svg> Declare')+'</button>';
    html+='</div>';
    html+='</div>';
  }
  return html;
  }   // <-- Add this missing brace

// ── Generic Custom UI Dropdown (replaces native <select> app-wide) ──
// Renders a hidden <input autocomplete="off" data-lpignore="true" data-1p-ignore="true" id="ID"> that always holds the current value, so any
// existing code that reads document.getElementById(ID).value keeps working
// unchanged. opts.onSelect is an optional JS snippet (string) run after the
// value changes; use the token $val where the picked value should be inserted.
function _wzDropdown(id, items, curVal, opts){
  opts=opts||{};
  var curItem=items.find(function(it){return String(it.value)===String(curVal);});
  var label=curItem?curItem.label:(opts.placeholder||'Select…');
  var rows=items.map(function(it){
    var escLabel=String(it.label).replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    var onSel="_wzDropdownSelect('"+id+"','"+String(it.value).replace(/'/g,"\\'")+"','"+escLabel.replace(/'/g,"\\'")+"')"
      +(opts.onSelect?';'+opts.onSelect.replace(/\$val/g,"'"+String(it.value).replace(/'/g,"\\'")+"'"):'');
    return '<div data-val="'+it.value+'" onmousedown="'+onSel+'" style="padding:9px 12px;cursor:pointer;font-size:.8rem;border-bottom:1px solid var(--border);white-space:nowrap;'+(String(curVal)===String(it.value)?'background:var(--accent)18;font-weight:700;color:var(--accent)':'')+'">'+it.label+'</div>';
  }).join('');
  return '<div class="wz-dd" id="'+id+'_wrap" style="position:relative;'+(opts.wrapStyle||'')+'">'
    +'<input type="hidden" id="'+id+'" value="'+String(curVal!=null?curVal:'').replace(/"/g,'&quot;')+'">'
    +'<button type="button" id="'+id+'_btn" class="form-select" style="width:100%;text-align:left;display:flex;align-items:center;justify-content:space-between;gap:6px;cursor:pointer;'+(opts.btnStyle||'')+'" onclick="_wzDropdownToggle(\''+id+'\')">'
    +'<span id="'+id+'_label" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+label+'</span>'
    +'<svg viewBox="0 0 24 24" style="width:.9em;height:.9em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></button>'
    +'<div class="wz-dd-menu" id="'+id+'_menu" style="display:none;position:absolute;z-index:1300;top:100%;left:0;right:0;margin-top:3px;background:var(--card);border:1px solid var(--accent)44;border-radius:8px;max-height:220px;overflow-y:auto;box-shadow:0 6px 20px rgba(0,0,0,.4)">'+rows+'</div>'
    +'</div>';
}
function _wzDropdownToggle(id){
  document.querySelectorAll('.wz-dd-menu').forEach(function(m){ if(m.id!==id+'_menu') m.style.display='none'; });
  var m=document.getElementById(id+'_menu');
  if(m) m.style.display=(m.style.display==='block')?'none':'block';
}
document.addEventListener('click', function(e){
  if(e.target.closest && e.target.closest('.wz-dd')) return;
  document.querySelectorAll('.wz-dd-menu').forEach(function(m){ m.style.display='none'; });
});
function _wzDropdownSelect(id, val, label){
  var hid=document.getElementById(id); if(hid) hid.value=val;
  var lb=document.getElementById(id+'_label'); if(lb) lb.textContent=label;
  var m=document.getElementById(id+'_menu');
  if(m){
    m.style.display='none';
    m.querySelectorAll('[data-val]').forEach(function(el){
      var match=el.getAttribute('data-val')===String(val);
      el.style.background=match?'var(--accent)18':'';
      el.style.fontWeight=match?'700':'';
      el.style.color=match?'var(--accent)':'';
    });
  }
  if(hid){ try{ hid.dispatchEvent(new Event('change',{bubbles:true})); }catch(e){} }
}

// ── Generic UI-based confirmation dialog (replaces window.confirm) ──
// Renders a small overlay card on top of whatever is currently open (a
// settings modal, etc.) without disturbing it. onConfirmJS is a JS snippet
// (string) executed if the user taps Confirm.
function _wzConfirm(message, onConfirmJS, opts){
  opts=opts||{};
  var id='_wzConfirmBox';
  var old=document.getElementById(id); if(old) old.remove();
  var box=document.createElement('div');
  box.id=id;
  box.style.cssText='position:fixed;inset:0;z-index:6000;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:20px';
  box.innerHTML='<div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:18px;max-width:320px;width:100%;box-shadow:0 10px 40px rgba(0,0,0,.5)">'
    +(opts.title?'<div style="font-size:.95rem;font-weight:800;margin-bottom:8px">'+opts.title+'</div>':'')
    +'<div style="font-size:.82rem;color:var(--text2);margin-bottom:16px;line-height:1.45">'+message+'</div>'
    +'<div style="display:flex;gap:8px">'
    +'<button type="button" class="btn btn-secondary" style="flex:1" onclick="document.getElementById(\''+id+'\').remove()">Cancel</button>'
    +'<button type="button" class="btn '+(opts.dangerConfirm?'btn-danger':'btn-primary')+'" style="flex:1" onclick="document.getElementById(\''+id+'\').remove();'+onConfirmJS+'">'+(opts.confirmLabel||'Confirm')+'</button>'
    +'</div></div>';
  document.body.appendChild(box);
}

// ── Custom UI Dropdown for judge selection (replaces native <select>) ──
function _judgeDropdownHTML(itemId, jsi, curJid, cfgJudges){
  var uid='jdg_'+itemId+'_'+jsi;
  var cur=cfgJudges.find(function(j){return String(j.id)===String(curJid);});
  var label=cur?cur.name:('J'+(jsi+1)+' \u2013 unnamed');
  var rows='<div data-jid="" onmousedown="selectItemJudge(\''+itemId+'\','+jsi+',\'\',\'J'+(jsi+1)+' \u2013 unnamed\',\''+uid+'\')" style="padding:8px 12px;cursor:pointer;font-size:.74rem;border-bottom:1px solid var(--border);white-space:nowrap;'+(!cur?'background:var(--accent)18;font-weight:700;color:var(--accent)':'')+'">J'+(jsi+1)+' \u2013 unnamed</div>'
    +cfgJudges.map(function(j){
      var esc=String(j.name).replace(/"/g,'&quot;').replace(/'/g,'&#39;');
      return '<div data-jid="'+j.id+'" onmousedown="selectItemJudge(\''+itemId+'\','+jsi+','+j.id+',\''+esc+'\',\''+uid+'\')" style="padding:8px 12px;cursor:pointer;font-size:.74rem;border-bottom:1px solid var(--border);white-space:nowrap;'+(cur&&String(cur.id)===String(j.id)?'background:var(--accent)18;font-weight:700;color:var(--accent)':'')+'">'+j.name+'</div>';
    }).join('');
  return '<div class="wz-jdg-dd" style="position:relative;display:inline-block">'
    +'<button type="button" id="'+uid+'_btn" class="btn btn-secondary btn-sm" style="font-size:.72rem;padding:3px 8px;display:inline-flex;align-items:center;gap:4px" onclick="toggleJudgeDD(\''+uid+'\')">'
    +'<span>'+label+'</span><svg viewBox="0 0 24 24" style="width:.8em;height:.8em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></button>'
    +'<div class="wz-jdg-menu" id="'+uid+'_menu" style="display:none;position:absolute;z-index:1300;top:100%;left:0;margin-top:3px;background:var(--card);border:1px solid var(--accent)44;border-radius:8px;min-width:130px;max-height:180px;overflow-y:auto;box-shadow:0 6px 20px rgba(0,0,0,.4)">'+rows+'</div>'
    +'</div>';
}
function toggleJudgeDD(uid){
  document.querySelectorAll('.wz-jdg-menu').forEach(function(m){ if(m.id!==uid+'_menu') m.style.display='none'; });
  var m=document.getElementById(uid+'_menu');
  if(m) m.style.display=(m.style.display==='block')?'none':'block';
}
document.addEventListener('click', function(e){
  if(e.target.closest && e.target.closest('.wz-jdg-dd')) return;
  document.querySelectorAll('.wz-jdg-menu').forEach(function(m){ m.style.display='none'; });
});
function selectItemJudge(itemId, jsi, judgeId, judgeName, uid){
  setItemJudge(itemId, jsi, judgeId);
  var btn=document.getElementById(uid+'_btn');
  if(btn){ var span=btn.querySelector('span'); if(span) span.textContent=judgeName; }
  var m=document.getElementById(uid+'_menu');
  if(m){
    m.style.display='none';
    m.querySelectorAll('[data-jid]').forEach(function(el){
      var match=el.getAttribute('data-jid')===String(judgeId||'');
      el.style.background=match?'var(--accent)18':'';
      el.style.fontWeight=match?'700':'';
      el.style.color=match?'var(--accent)':'';
    });
  }
}
function setItemJudge(itemId, slotIdx, judgeId){
  var items=DB.items();
  var item=items.find(function(i){return i.id==itemId;});
  if(!item) return;
  if(!item.judgeIds) item.judgeIds=[];
  item.judgeIds[slotIdx]=judgeId||'';
  DB.saveItems(items);
}
function saveInlineMarks(itemId, numJudges, maxPerJudge, uid, isModal){
  var allMarks=DB.marks(), cfg=DB.config();
  var item=DB.items().find(function(i){return i.id==itemId;});
  var isGrp=item&&item.type==='group';
  var groups=DB.groups(), participants=DB.participants();
  var itemP=isGrp
    ?groups.filter(function(g){return _grpHasItem(g,itemId);}).map(function(g){return {chestNo:g.groupChestNo};})
    :participants.filter(function(p){return (p.items||[]).includes(itemId);});
  var saved=0;
  itemP.forEach(function(p){
    var vals=[];
    for(var ji=0;ji<numJudges;ji++){
      var el=document.getElementById('im-'+itemId+'-'+p.chestNo+'-'+ji);
      if(!el||el.value===''){vals.push(0);continue;}
      var v=parseFloat(el.value)||0;
      if(v>maxPerJudge){
        toast('Mark exceeds max ('+maxPerJudge+')','error');
        el.value='';
        return;
      }
      if(v<0) v=0;
      vals.push(v);
    }
    var hasAny=vals.some(function(v){return v>0;});
    if(!hasAny) return;
    var total=vals.reduce(function(a,b){return a+b;},0);
    var maximum=numJudges*maxPerJudge;
    var pct=maximum>0?Math.min(100,(total/maximum)*100):0;
    var grade=calcGrade(pct);
    var pts=(cfg.gradePointsEnabled===false)?0:(isGrp?calcGrpGradePoints(grade,cfg):calcIndvGradePoints(grade,cfg));
    var rec={chestNo:p.chestNo,itemId:itemId,mark1:vals[0]||0,mark2:vals[1]||0,mark3:vals[2]||0,
             total:total,maximum:maximum,pct:Math.round(pct*10)/10,grade:grade,point:pts,rank:0};
    var ex=allMarks.findIndex(function(m){return m.chestNo===p.chestNo&&m.itemId==itemId;});
    if(ex>=0){rec.codeLetter=allMarks[ex].codeLetter||''; allMarks[ex]=Object.assign({},allMarks[ex],rec);}
    else allMarks.push(rec);
    saved++;
  });
  DB.saveMarks(allMarks);
  // Rank Points are decided strictly by Total Marks vs the rest of the item's
  // field, so recompute them the moment marks are saved (not just at Declare)
  // — reuses the same dense-rank + bonus logic assignRanks() uses on declare.
  if(saved>0) assignRanks(itemId);
  _setPageUnsaved(false);
  // Auto-undeclare if item was declared
  if(saved>0){
    var dbItems=DB.items();
    var iIdx=dbItems.findIndex(function(i){return i.id==itemId;});
    if(iIdx>=0&&dbItems[iIdx].declared){
      dbItems[iIdx].declared=false;
      DB.saveItems(dbItems);
      toast('Saved '+saved+' entries! (Auto-undeclared)');
    } else {
      toast('Saved '+saved+' entries!');
    }
  } else {
    toast('No marks entered');
  }
  if(isModal){
    _pageUnsaved=false;
    _closeMarkModalClean();
  } else {
    var d=document.getElementById(uid);
    if(d) d.style.display='none';
  }
  renderKeepScroll('marks',{filter:window._markFlt||'all',q:window._markQ||''});
}

// =============================================
// MARKS
// =============================================
function presentCount(item){
  var marks=DB.marks(),groups=DB.groups(),participants=DB.participants();
  return _itemPresentEntries(item, participants, groups, marks).length;
}
function filterMarkList(q, sec, flt){
  var items=DB.items(),participants=DB.participants(),marks=DB.marks(),groups=DB.groups();
  q=(q||'').toLowerCase(); flt=flt||'all';
  var cb=document.getElementById('m-clear-btn'); if(cb) cb.style.display=q?'':'none';
  var hasP=function(item){ return _itemHasParticipants(item, participants, groups); };
  var allCodes=function(item){ return _itemAllCodesAssigned(item, participants, groups, marks); };
  // Base = only code-assigned items
  var base=(sec==='All'?items:items.filter(function(i){return i.section===sec;})).filter(function(i){return hasP(i)&&allCodes(i);});
  var list=base.filter(function(item){
    var im=marks.filter(function(m){return m.itemId===item.id;});
    var total=presentCount(item);
    var entered=im.filter(function(m){return m.total>0;}).length;
    if(flt==='marked') return entered>0;
    if(flt==='pending') return entered<total;
    return true;
  }).filter(function(item){return !q||item.name.toLowerCase().includes(q);});
  var el=document.getElementById('m-list');
  if(!el) return;
  el.innerHTML=!list.length
    ?'<div style="text-align:center;padding:30px;color:var(--text3)">No items found</div>'
    :list.map(function(item){
      var im=marks.filter(function(m){return m.itemId===item.id;});
      var total=presentCount(item);
      var entered=im.filter(function(m){return m.total>0;}).length;
      var done=entered===total&&total>0;
      var uid='mi-'+item.id;
      var statusBadge=done?'<span class="badge badge-green" style="font-size:.62rem">Done</span>':entered>0?'<span class="badge badge-blue" style="font-size:.62rem">Partial</span>':'<span class="badge badge-red" style="font-size:.62rem">Pending</span>';
      var declBadge=item.declared?'<span class="badge badge-green" style="font-size:.62rem"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Declared</span>':'<span class="badge badge-orange" style="font-size:.62rem">Not Declared</span>';
      return '<div class="list-item" style="flex-direction:column;align-items:stretch;padding:0;overflow:hidden">'
        +'<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;cursor:pointer" onclick="_openMarkModal(\''+item.id+'\')">'
        +'<div class="list-avatar" style="background:'+(done?'var(--green)':'var(--accent)')+'22;color:'+(done?'var(--green)':'var(--accent)')+';font-size:.7rem;font-weight:800;flex-shrink:0">'+(item.code||'?')+'</div>'
        +'<div class="list-info" style="min-width:0"><div class="list-title" style="font-size:.85rem">'+item.name+'</div>'
        +'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:3px">'+statusBadge+declBadge+'</div></div>'
        +'<div style="text-align:right;flex-shrink:0"><div style="font-size:.68rem;color:var(--text3)">'+item.section+'</div><div style="font-size:.65rem;color:var(--text3)">'+entered+'/'+total+'</div></div>'
        +'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--text3)"><polyline points="6 9 12 15 18 9"/></svg>'
        +'</div></div>';
    }).join('');
}


function renderMarks(data){
  data=data||{};
  var items=DB.items(),participants=DB.participants(),marks=DB.marks(),sections=DB.sections(),groups=DB.groups(),cfg=DB.config();
  var nj=parseInt(cfg.maxJudges)||3, mj=parseInt(cfg.maxMarks)||100;
  var sec=data.section||window._markSec||'All', flt=data.filter||'all', q=(data.q||'').toLowerCase();
  window._markFlt=flt; window._markQ=q; window._markSec=sec;

  var hasParticipants=function(item){ return _itemHasParticipants(item, participants, groups); };
  var allCodesAssigned=function(item){ return _itemAllCodesAssigned(item, participants, groups, marks); };

  // Base = only items with ALL codes assigned
  var allBaseItems=items.filter(hasParticipants).filter(allCodesAssigned);
  var base=(sec==='All'?allBaseItems:allBaseItems.filter(function(i){return i.section===sec;}));

  // presentCount is now a global helper (defined above renderMarks)
  var markedCnt=base.filter(function(item){
    var im=marks.filter(function(m){return m.itemId===item.id;});
    return im.filter(function(m){return m.total>0;}).length>0;
  }).length;
  var pendingCnt=base.filter(function(item){
    var im=marks.filter(function(m){return m.itemId===item.id;});
    var total=presentCount(item);
    return im.filter(function(m){return m.total>0;}).length<total;
  }).length;
  var allCnt=base.length;

  var list=base.filter(function(item){
    var im=marks.filter(function(m){return m.itemId===item.id;});
    var total=presentCount(item);
    var entered=im.filter(function(m){return m.total>0;}).length;
    if(flt==='marked') return entered>0;
    if(flt==='pending') return entered<total;
    return true;
  }).filter(function(item){return !q||item.name.toLowerCase().includes(q);});

  var secTabs='';// section tabs removed per request

  var secDDItems=[{value:'All',label:'All Sections'}].concat(sections.map(function(s){return {value:s,label:getSectionShortName(s)};}));
  var secDD=_wzDropdown('marks-sec-dd', secDDItems, sec, {onSelect:"window._markSec=$val;render('marks',{filter:window._markFlt||'all',section:$val})", wrapStyle:'flex-shrink:0;width:128px', btnStyle:'padding:0 10px;font-size:.78rem;height:48px'});

  var _mIsFiltered=sec!=='All'||flt!=='all'||!!q;
  var fltBtns='<div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:nowrap;align-items:center">'
    +'<button class="btn btn-sm '+(flt==='all'?'btn-primary':'btn-secondary')+'" onclick="render(\'marks\',{filter:\'all\',section:window._markSec||\'All\'})">All ('+allCnt+')</button>'
    +'<button class="btn btn-sm '+(flt==='marked'?'btn-primary':'btn-secondary')+'" onclick="render(\'marks\',{filter:\'marked\',section:window._markSec||\'All\'})">'+_svgCheckIcon()+' ('+markedCnt+')</button>'
    +'<button class="btn btn-sm '+(flt==='pending'?'btn-primary':'btn-secondary')+'" onclick="render(\'marks\',{filter:\'pending\',section:window._markSec||\'All\'})">'+_svgWarnIcon()+' ('+pendingCnt+')</button>'
    +_clearFilterBtn(_mIsFiltered)
    +'</div>';

  var listHtml=!list.length
    ?'<div style="text-align:center;padding:30px;color:var(--text3)">'+(base.length===0?'No items with all codes assigned yet. Go to Code Letters to assign codes.':(_mIsFiltered?'No results for "'+(q||sec)+'".':'No items found'))+'</div>'
    :list.map(function(item){
      var im=marks.filter(function(m){return m.itemId===item.id;});
      var total=presentCount(item);
      var entered=im.filter(function(m){return m.total>0;}).length;
      var done=entered===total&&total>0;
      var statusBadge=done?'<span class="badge badge-green" style="font-size:.62rem">Done</span>':entered>0?'<span class="badge badge-blue" style="font-size:.62rem">Partial</span>':'<span class="badge badge-red" style="font-size:.62rem">Pending</span>';
      var declBadge=item.declared?'<span class="badge badge-green" style="font-size:.62rem"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Declared</span>':'<span class="badge badge-orange" style="font-size:.62rem">Not Declared</span>';
      return '<div class="list-item" style="flex-direction:column;align-items:stretch;padding:0;overflow:hidden">'
        +'<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;cursor:pointer" onclick="_openMarkModal(\''+item.id+'\')">'
        +'<div class="list-avatar" style="background:'+(done?'var(--green)':'var(--accent)')+'22;color:'+(done?'var(--green)':'var(--accent)')+';font-size:.7rem;font-weight:800;flex-shrink:0">'+(item.code||'?')+'</div>'
        +'<div class="list-info" style="min-width:0">'
        +'<div class="list-title" style="font-size:.85rem">'+item.name+'</div>'
        +'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:3px">'+statusBadge+declBadge+'</div>'
        +'</div>'
        +'<div style="text-align:right;flex-shrink:0"><div style="font-size:.68rem;color:var(--text3)">'+item.section+'</div>'
        +'<div style="font-size:.65rem;color:var(--text3)">'+entered+'/'+total+'</div></div>'
        +'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--text3)"><polyline points="6 9 12 15 18 9"/></svg>'
        +'</div>'
        +'</div>';
    }).join('');

  return secTabs+fltBtns
    +'<div style="display:flex;gap:8px;margin-bottom:10px;align-items:center">'
    +'<div style="position:relative;flex:1">'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" style="margin-bottom:0;padding-right:36px" id="m-search" placeholder="Search items..." value="'+(data.q||'')+'"'
    +' oninput="filterMarkList(this.value,window._markSec||\'All\',\''+flt+'\')">'
    +'<button id="m-clear-btn" onclick="document.getElementById(\'m-search\').value=\'\';filterMarkList(\'\',window._markSec||\'All\',\''+flt+'\')" aria-label="Clear search" style="display:'+(data.q?'':'none')+';position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
    +'</div>'
    +secDD
    +'</div>'
    +'<div id="m-list">'+listHtml+'</div>';
}

function renderMarkEntry(data){
  data=data||{};
  var itemId=data.itemId;
  var items=DB.items(),participants=DB.participants(),allMarks=DB.marks(),cfg=DB.config(),groups=DB.groups();
  var item=items.find(function(i){return i.id==itemId;});
  if(!item) return '<div style="text-align:center;padding:30px;color:var(--text3)">Item not found</div>';
  var isGrp=item.type==='group';
  var itemP=isGrp
    ?groups.filter(function(g){return _grpHasItem(g,itemId);}).map(function(g){return {chestNo:g.groupChestNo,name:g.name,team:g.team,section:g.section};})
    :participants.filter(function(p){return (p.items||[]).includes(itemId);});
  var itemMarks=allMarks.filter(function(m){return m.itemId==itemId;});
  var nj=parseInt(cfg.maxJudges)||3, mj=parseInt(cfg.maxMarks)||100;

  // Absent ('?') participants are excluded entirely from Mark Entry — they
  // are considered "handled" and never require a real code letter.
  var presentItemP=itemP.filter(function(p){
    var me=itemMarks.find(function(m){return m.chestNo===p.chestNo;});
    return !(me&&me.codeLetter==='?');
  });
  var missingCodes=presentItemP.filter(function(p){
    var me=itemMarks.find(function(m){return m.chestNo===p.chestNo;});
    return !me||!me.codeLetter||me.codeLetter==='?';
  });
  var allCodesOk=missingCodes.length===0&&presentItemP.length>0;
  var noneRegistered=itemP.length===0;
  var allAbsent=itemP.length>0&&presentItemP.length===0;
  // From here on, only present participants are ever rendered as cards.
  itemP=presentItemP;

  var hdr='<div class="card" style="margin-bottom:14px">'
    +'<div style="font-size:1rem;font-weight:800;color:var(--gold)">'+item.name+'</div>'
    +'<div style="font-size:.78rem;color:var(--text2);margin-top:4px">'+item.section
    +' &middot; '+nj+' judge'+(nj>1?'s':'')+' &middot; Max '+(mj*nj)
    +(isGrp?' &middot; <span style="color:#4a9eff">Group</span>':'')+'</div>'
    +(item.declared?'<div style="margin-top:8px;padding:6px 10px;background:rgba(0,200,100,.1);border-radius:8px;font-size:.78rem;color:var(--green)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Results Declared</div>':'')
    +'</div>';

  if(noneRegistered||allAbsent) return hdr
    +'<div style="text-align:center;padding:24px;color:var(--text3)">'+(allAbsent?'All participants are marked absent for this item.':'No participants registered.')+'</div>'
    +'<button class="btn '+(item.declared?'btn-warning':'btn-success')+'" style="width:100%" onclick="toggleDeclare(\''+itemId+'\')">'
    +(item.declared?'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Un-declare':'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a1 1 0 0 0 1 1h1l3 6h2l-2-6h5l7 4V6l-7 4H4a1 1 0 0 0-1 1Z"/></svg> Declare')+'</button>';

  if(!allCodesOk){
    return hdr+'<div style="background:rgba(255,100,0,.1);border:1.5px solid rgba(255,140,0,.4);border-radius:12px;padding:18px;text-align:center">'
      +'<div style="font-size:2rem;margin-bottom:8px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg></div>'
      +'<div style="font-weight:800;color:#f0a500;margin-bottom:6px">Code Letters Required</div>'
      +'<div style="font-size:.82rem;color:var(--text2);margin-bottom:14px">Assign code letters to all participants before entering marks.</div>'
      +'<div style="text-align:left;font-size:.8rem;background:var(--bg3);border-radius:8px;padding:10px;margin-bottom:14px">'
      +'<div style="font-weight:700;color:var(--text3);margin-bottom:4px">Missing ('+missingCodes.length+'):</div>'
      +'<ul style="padding-left:16px;margin:0">'
      +missingCodes.map(function(p){return '<li>'+p.name+'</li>';}).join('')
      +'</ul></div>'
      +'<button class="btn btn-primary" style="width:100%" onclick="navigate(\'codes\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg> Assign Code Letters</button>'
      +'</div>';
  }

  var sortedP=itemP.slice().sort(function(a,b){
    var ma=itemMarks.find(function(m){return m.chestNo===a.chestNo;});
    var mb=itemMarks.find(function(m){return m.chestNo===b.chestNo;});
    return (ma?ma.codeLetter||'?':'?').localeCompare(mb?mb.codeLetter||'?':'?');
  });

  var cards=sortedP.map(function(p){
    var me=itemMarks.find(function(m){return m.chestNo===p.chestNo;})||{};
    var code=me.codeLetter||'?';
    var hasMark=me.total>0;
    var judgeRows='';
    for(var ji=0;ji<nj;ji++){
      var val=me['mark'+(ji+1)]; val=(val!==undefined&&val!=='')? val:'';
      judgeRows+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">'
        +'<div style="width:65px;font-size:.78rem;color:var(--text2);font-weight:600">Judge '+(ji+1)+'</div>'
        +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="mark-input" id="m-'+p.chestNo+'-'+ji+'" type="number" min="0" max="'+mj+'"'
        +' value="'+val+'" placeholder="0-'+mj+'"'
        +' oninput="window._tempSaveCB=function(){saveAllMarks(\''+itemId+'\','+nj+','+mj+');};_setPageUnsaved(true,\'Mark Entry\')"'
        +' onkeydown="if(event.key===\'Enter\'){var nx=document.getElementById(\'m-'+p.chestNo+'-'+(ji+1)+'\');if(nx)nx.focus();else this.blur();}">'
        +'<div style="font-size:.72rem;color:var(--text3)">/ '+mj+'</div></div>';
    }
    var fb='<div id="saved-'+p.chestNo+'" style="'+(hasMark?'display:flex;justify-content:space-between;align-items:center;padding:6px 12px;background:var(--bg3);border-radius:8px;margin-top:8px':'height:28px;margin-top:4px')+'">'
      +(hasMark?'<span style="font-size:.85rem;font-weight:800;color:var(--green)">'+(me.grade||'')+'</span>'
        +'<span style="font-size:.78rem;color:var(--text2)">'+Math.round(me.pct||0)+'%</span>'
        +'<span style="font-size:.85rem;font-weight:800;color:var(--accent)">'+(me.point||0)+' pts</span>':'')+'</div>';
    return '<div class="mark-entry-card card" data-code="'+code.toLowerCase()+'" data-chest="'+p.chestNo+'" data-name="'+(p.name||'').toLowerCase()+'" style="margin-bottom:12px">'
      +'<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">'
      +'<div style="width:52px;height:52px;border-radius:50%;background:var(--accent)22;color:var(--accent);font-weight:900;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0">'+code+'</div>'
      +'<div><div style="font-size:1rem;font-weight:800">Code: <span style="color:var(--accent)">'+code+'</span></div>'
      +(hasMark?'<div style="font-size:.8rem;font-weight:700;color:var(--accent)">'+(me.point||0)+' pts</div>':'<div style="font-size:.75rem;color:var(--text3)">No marks yet</div>')
      +'</div></div>'
      +judgeRows+fb+'</div>';
  }).join('');

  var searchBar='<div style="position:relative;margin-bottom:12px">'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="mark-search" style="margin-bottom:0;padding-right:36px" placeholder="Search by code, chest no or name..." oninput="filterMarkEntryCards(this.value)">'
    +'<button id="mark-clear-btn" onclick="document.getElementById(\'mark-search\').value=\'\';filterMarkEntryCards(\'\')" style="display:none;position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
    +'</div>';

  return hdr+searchBar+'<div id="mark-cards-wrap">'+cards+'</div><div class="divider">'
    +'</div><div style="display:flex;gap:8px">'
    +'<button class="btn btn-primary" style="flex:1" onclick="saveAllMarks(\''+itemId+'\','+nj+','+mj+')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h6"/></svg> Save All</button>'
    +'<button class="btn '+(item.declared?'btn-warning':'btn-success')+'" style="flex:1" onclick="toggleDeclare(\''+itemId+'\')">'
    +(item.declared?'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Un-declare':'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a1 1 0 0 0 1 1h1l3 6h2l-2-6h5l7 4V6l-7 4H4a1 1 0 0 0-1 1Z"/></svg> Declare')+'</button>'
    +'</div>';
}

function filterMarkEntryCards(q){
  q=(q||'').toLowerCase().trim();
  var msCb=document.getElementById('mark-clear-btn');
  if(msCb) msCb.style.display=q?'':'none';
  var wrap=document.getElementById('mark-cards-wrap');
  if(!wrap) return;
  var cards=Array.prototype.slice.call(wrap.querySelectorAll('.mark-entry-card'));
  for(var i=0;i<cards.length;i++){
    var code=cards[i].getAttribute('data-code')||'';
    var chest=cards[i].getAttribute('data-chest')||'';
    var name=cards[i].getAttribute('data-name')||'';
    var match=!q||code.includes(q)||chest.includes(q)||name.includes(q);
    cards[i].style.display=match?'':'none';
  }
}

function calcGrade(pct){
  if(pct>=90) return 'A+';
  if(pct>=80) return 'A';
  if(pct>=70) return 'B+';
  if(pct>=60) return 'B';
  if(pct>=50) return 'C';
  return '';
}
function _hexAlpha(hex,alpha){
  hex=(hex||'#ffffff').replace('#','');
  if(hex.length===3) hex=hex.split('').map(function(c){return c+c;}).join('');
  var r=parseInt(hex.substr(0,2),16)||255, g=parseInt(hex.substr(2,2),16)||255, b=parseInt(hex.substr(4,2),16)||255;
  return 'rgba('+r+','+g+','+b+','+alpha+')';
}
function calcPoints(grade, cfg, isGroup){
  if(isGroup) return calcGrpGradePoints(grade,cfg);
  return calcIndvGradePoints(grade,cfg);
}
// ── Draw an image cropped/scaled to cover a target rect (like CSS background-size:cover) ──
function drawImageCover(ctx,img,x,y,w,h){
  var iw=img.naturalWidth||img.width, ih=img.naturalHeight||img.height;
  if(!iw||!ih) return;
  var ir=iw/ih, tr=w/h, sx,sy,sw,sh;
  if(ir>tr){ sh=ih; sw=ih*tr; sx=(iw-sw)/2; sy=0; }
  else { sw=iw; sh=iw/tr; sx=0; sy=(ih-sh)/2; }
  ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);
}
// ── Returns the currently active Poster Design preset (or null for the default random palettes) ──
function getActivePosterPreset(){
  var cfg=DB.config();
  var idx=cfg.activePosterPreset;
  if(idx===undefined||idx===null) return null;
  var slots=cfg.posterPresets||[];
  var p=slots[idx];
  return (p&&p.bg)?p:null;
}
// ── Dense (non-skipping) rank assignment: ties share a rank, next distinct
// score gets the very next integer (1,1,2,3...) instead of skip-ranking (1,1,3,4...).
// Assumes `im` is already sorted descending by total marks.
function applyDenseRank(im){
  var rank=0, prevTotal=null;
  im.forEach(function(m){
    if(prevTotal===null||m.total!==prevTotal) rank++;
    m._rank=rank;
    prevTotal=m.total;
  });
  return im;
}


function calcPercent(m1,m2,m3,m4,maximum){
  if(maximum<=0) return 0;
  return Math.min(100,((m1+m2+m3)/maximum)*100);
}
function calcIndvGradePoints(grade,cfg){
  if(grade==='A+') return parseInt(cfg.indvAp)||10;
  if(grade==='A')  return parseInt(cfg.indvA)||8;
  if(grade==='B+') return parseInt(cfg.indvBp)||6;
  if(grade==='B')  return parseInt(cfg.indvB)||4;
  if(grade==='C')  return parseInt(cfg.indvC)||2;
  return 0;
}
function calcGrpGradePoints(grade,cfg){
  if(grade==='A+') return parseInt(cfg.grpAp)||15;
  if(grade==='A')  return parseInt(cfg.grpA)||12;
  if(grade==='B+') return parseInt(cfg.grpBp)||9;
  if(grade==='B')  return parseInt(cfg.grpB)||6;
  if(grade==='C')  return parseInt(cfg.grpC)||3;
  return 0;
}

function saveMark(chestNo,itemId,numJudges,maxPerJudge){
  var marks=DB.marks(), cfg=DB.config();
  var m1=parseFloat(document.getElementById('m-j1')?document.getElementById('m-j1').value:0)||0;
  var m2=numJudges>=2?(parseFloat(document.getElementById('m-j2')?document.getElementById('m-j2').value:0)||0):0;
  var m3=numJudges>=3?(parseFloat(document.getElementById('m-j3')?document.getElementById('m-j3').value:0)||0):0;
  var m4=parseFloat(document.getElementById('m-grace')?document.getElementById('m-grace').value:0)||0;
  var maximum=numJudges*maxPerJudge;
  var pct=calcPercent(m1,m2,m3,m4,maximum);
  var grade=calcGrade(pct);
  var item=DB.items().find(function(i){return i.id==itemId;});
  var isGroup=item&&item.type==='group';
  var pts=(cfg.gradePointsEnabled===false)?0:(isGroup?calcGrpGradePoints(grade,cfg):calcIndvGradePoints(grade,cfg));
  var total=m1+m2+m3+m4;
  var existing=marks.findIndex(function(m){return m.chestNo===chestNo&&m.itemId==itemId;});
  var rec={chestNo:chestNo,itemId:itemId,mark1:m1,mark2:m2,mark3:m3,mark4:m4,total:total,maximum:maximum,pct:Math.round(pct*10)/10,grade:grade,point:pts,rank:0};
  if(existing>=0){rec.codeLetter=marks[existing].codeLetter||'';marks[existing]=Object.assign({},marks[existing],rec);}
  else marks.push(rec);
  DB.saveMarks(marks);
  assignRanks(itemId); // recompute Rank Points immediately, not just at Declare
  toast('Saved!');
}
function autoSaveMark(chestNo,itemId,numJudges,maxPerJudge){
  var j1=document.getElementById('m-'+chestNo+'-0');
  var allMarks=DB.marks(), cfg=DB.config();
  var ex=allMarks.findIndex(function(m){return m.chestNo===chestNo&&m.itemId==itemId;});
  // Same reasoning as saveAllMarks: only skip when there's truly nothing
  // saved yet to preserve or clear.
  if((!j1||j1.value==='') && ex<0) return;
  var vals=[];
  for(var ji=0;ji<numJudges;ji++){
    var el=document.getElementById('m-'+chestNo+'-'+ji);
    if(!el||el.value===''){vals.push(0);continue;}
    var v=parseFloat(el.value)||0;
    if(v>maxPerJudge){ v=maxPerJudge; el.value=maxPerJudge; toast('Max mark is '+maxPerJudge,'error'); }
    if(v<0){ v=0; el.value=0; }
    vals.push(v);
  }
  var total=vals.reduce(function(a,b){return a+b;},0);
  var maximum=numJudges*maxPerJudge;
  var pct=maximum>0?Math.min(100,(total/maximum)*100):0;
  var grade=calcGrade(pct);
  var item=DB.items().find(function(i){return i.id==itemId;});
  var isGrp=item&&item.type==='group';
  var pts=(cfg.gradePointsEnabled===false)?0:(isGrp?calcGrpGradePoints(grade,cfg):calcIndvGradePoints(grade,cfg));
  var rec={chestNo:chestNo,itemId:itemId,mark1:vals[0]||0,mark2:vals[1]||0,mark3:vals[2]||0,
           total:total,maximum:maximum,pct:Math.round(pct*10)/10,grade:grade,point:pts,rank:0};
  if(ex>=0){rec.codeLetter=allMarks[ex].codeLetter||''; allMarks[ex]=Object.assign({},allMarks[ex],rec);}
  else allMarks.push(rec);
  DB.saveMarks(allMarks);
  assignRanks(itemId); // recompute Rank Points immediately, not just at Declare
  _setPageUnsaved(false); // auto-saved, clear dirty flag
  var freshMark=DB.marks().find(function(m){return m.chestNo===chestNo&&m.itemId==itemId;});
  var displayPts=freshMark&&freshMark.point!=null?freshMark.point:pts;
  var el2=document.getElementById('saved-'+chestNo);
  if(el2){
    el2.innerHTML='<span style="font-size:.85rem;font-weight:800;color:var(--green)">'+grade+'</span>'
      +'<span style="font-size:.78rem;color:var(--text2)">'+Math.round(pct)+'%</span>'
      +'<span style="font-size:.85rem;font-weight:800;color:var(--accent)">'+displayPts+' pts</span>';
    el2.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:6px 12px;background:var(--bg3);border-radius:8px;margin-top:8px';
  }
}

function saveAllMarks(itemId, numJudges, maxPerJudge){
  var allMarks=DB.marks(), cfg=DB.config();
  var item=DB.items().find(function(i){return i.id==itemId;});
  var isGrp=item&&item.type==='group';
  var groups=DB.groups(), participants=DB.participants();
  var itemP=isGrp
    ?groups.filter(function(g){return _grpHasItem(g,itemId);}).map(function(g){return {chestNo:g.groupChestNo};})
    :participants.filter(function(p){return (p.items||[]).includes(itemId);});
  var saved=0;
  itemP.forEach(function(p){
    var j1=document.getElementById('m-'+p.chestNo+'-0');
    var ex=allMarks.findIndex(function(m){return m.chestNo===p.chestNo&&m.itemId==itemId;});
    // A row with no existing saved marks AND blank fields simply hasn't been
    // touched yet — skip it. But if marks were already saved for this
    // participant (ex>=0) and the fields are now blank, the user cleared
    // them on purpose, and that clear must still be written back — this
    // used to skip the row outright in that case, so "Save All" silently
    // left the old marks in the database and they'd reappear on reopening.
    if((!j1||j1.value==='') && ex<0) return;
    var vals=[];
    for(var ji=0;ji<numJudges;ji++){
      var el=document.getElementById('m-'+p.chestNo+'-'+ji);
      var v=el&&el.value!==''?parseFloat(el.value)||0:0;
      if(v>maxPerJudge) v=maxPerJudge;
      if(v<0) v=0;
      vals.push(v);
    }
    var total=vals.reduce(function(a,b){return a+b;},0);
    var maximum=numJudges*maxPerJudge;
    var pct=maximum>0?Math.min(100,(total/maximum)*100):0;
    var grade=calcGrade(pct);
    var pts=(cfg.gradePointsEnabled===false)?0:(isGrp?calcGrpGradePoints(grade,cfg):calcIndvGradePoints(grade,cfg));
    var rec={chestNo:p.chestNo,itemId:itemId,mark1:vals[0]||0,mark2:vals[1]||0,mark3:vals[2]||0,
             total:total,maximum:maximum,pct:Math.round(pct*10)/10,grade:grade,point:pts,rank:0};
    if(ex>=0){rec.codeLetter=allMarks[ex].codeLetter||''; allMarks[ex]=Object.assign({},allMarks[ex],rec);}
    else allMarks.push(rec);
    saved++;
  });
  DB.saveMarks(allMarks);
  if(saved>0) assignRanks(itemId);
  _setPageUnsaved(false);
  // Auto-undeclare if item was declared — marks changed, so the previously
  // declared result is no longer valid until re-declared.
  if(saved>0){
    var dbItems=DB.items();
    var iIdx=dbItems.findIndex(function(i){return i.id==itemId;});
    if(iIdx>=0&&dbItems[iIdx].declared){
      dbItems[iIdx].declared=false;
      DB.saveItems(dbItems);
      toast('Saved '+saved+' entries! (Auto-undeclared)');
    } else {
      toast('Saved '+saved+' entries!');
    }
  } else {
    toast('No marks entered');
  }
}

function assignRanks(itemId){
  var marks=DB.marks(), cfg=DB.config(), items=DB.items();
  var item=items.find(function(i){return i.id==itemId;});
  var isGroup=!!(item&&item.type==='group');
  var itemMarks=marks.filter(function(m){return m.itemId==itemId&&m.total>0;});
  itemMarks.sort(function(a,b){return b.total-a.total;});
  // Dense (non-skipping) ranking: ties share a rank, next distinct score gets
  // the very next integer. e.g. scores 90,80,80,70 → ranks 1,2,2,3 (not 1,2,2,4).
  applyDenseRank(itemMarks);
  // Total Points = Grade Points + Rank Points (decided strictly by mark-based
  // rank, never by grade — recomputed fresh each declare so it never double-counts).
  itemMarks.forEach(function(m){
    var gradePts=(cfg.gradePointsEnabled===false)?0:(isGroup?calcGrpGradePoints(m.grade,cfg):calcIndvGradePoints(m.grade,cfg));
    var b1,b2,b3;
    if(item&&item.customRankBonus){
      b1=parseInt(item.rankBonus1)||0;
      b2=parseInt(item.rankBonus2)||0;
      b3=parseInt(item.rankBonus3)||0;
    } else {
      b1=parseInt(isGroup?cfg.grpRank1:cfg.indvRank1)||0;
      b2=parseInt(isGroup?cfg.grpRank2:cfg.indvRank2)||0;
      b3=parseInt(isGroup?cfg.grpRank3:cfg.indvRank3)||0;
    }
    var bonus=(cfg.rankPointsEnabled===false)?0:(m._rank===1?b1:m._rank===2?b2:m._rank===3?b3:0);
    m.rank=m._rank;
    m.point=gradePts+bonus;
  });
  itemMarks.forEach(function(ranked){
    var mi=marks.findIndex(function(m){return m.chestNo===ranked.chestNo&&m.itemId===ranked.itemId;});
    if(mi>=0) marks[mi]=Object.assign({},marks[mi],{rank:ranked.rank,point:ranked.point});
  });
  DB.saveMarks(marks);
}

function toggleDeclareInline(itemId, isModal){
  var items=DB.items();
  var idx=items.findIndex(function(i){return i.id==itemId;});
  if(idx<0) return;
  items[idx].declared=!items[idx].declared;
  if(items[idx].declared) items[idx].declaredAt=Date.now();
  DB.saveItems(items);
  if(items[idx].declared) assignRanks(itemId);
  broadcastPublicUpdate();
  toast(items[idx].declared?'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Declared!':'Results Un-declared');
  if(isModal){
    _pageUnsaved=false;
    _closeMarkModalClean();
  } else {
    // Collapse the item block and re-render marks list
    var d=document.getElementById('mi-'+itemId);
    if(d) d.style.display='none';
  }
  renderKeepScroll('marks',{filter:window._markFlt||'all',q:window._markQ||''});
}
function toggleDeclare(itemId){
  const items=DB.items();
  const idx=items.findIndex(i=>i.id==itemId);
  if(idx<0) return;
  items[idx].declared=!items[idx].declared;
  if(items[idx].declared) items[idx].declaredAt=Date.now();
  DB.saveItems(items);
  if(items[idx].declared) assignRanks(itemId);
  broadcastPublicUpdate();
  toast(items[idx].declared?'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Results Declared!':'Results Un-declared');
  // Collapse & stay on marks page
  var d=document.getElementById('mi-'+itemId);
  if(d) d.style.display='none';
  renderKeepScroll('marks',{filter:window._markFlt||'all',q:window._markQ||''});
}

// =============================================
// POINTS CALCULATION (only declared items count)
// =============================================
function calcTeamPoints(){
  var items=DB.items(),pts2=DB.participants(),marks=DB.marks(),teams=DB.teams(),cfg=DB.config(),groups=DB.groups(),bonuses=DB.bonuses();
  var tp={};
  teams.forEach(function(t){ tp[t.name]={total:0,aplus:0,r1:0,r2:0,r3:0,sections:{},bonus:0}; });
  items.filter(function(i){return i.declared;}).forEach(function(item){
    // For this item, find top 3 by total marks (dense/non-skipping rank,
    // decided strictly by Total Marks — never by Grade)
    var itemMarks=marks.filter(function(m){return m.itemId===item.id&&m.total>0;}).sort(function(a,b){return b.total-a.total;});
    applyDenseRank(itemMarks);
    var rankMap={};
    itemMarks.forEach(function(m){ rankMap[m.chestNo]=m._rank; });
    itemMarks.forEach(function(m){
      var tn=null;
      var countsIndiv=true;
      if(item.type==='group'){
        var g=groups.find(function(g){return g.groupChestNo==m.chestNo&&_grpHasItem(g,item);});
        tn=g?g.team:null;
      } else {
        var p=pts2.find(function(p){return p.chestNo===m.chestNo;}); tn=p?p.team:null;
      }
      if(!tn||!tp[tn]) return;
      // Total Points = Grade Points + Rank Points (already computed & persisted on
      // m.point at declare time by assignRanks — falls back to a fresh calc if absent)
      var pts=(m.point!=null)?m.point:(item.type==='group'?calcGrpGradePoints(m.grade,cfg):calcIndvGradePoints(m.grade,cfg));
      tp[tn].total+=pts;
      if(m.grade==='A+') tp[tn].aplus++;
      var rank=rankMap[m.chestNo]||0;
      if(rank===1) tp[tn].r1++; else if(rank===2) tp[tn].r2++; else if(rank===3) tp[tn].r3++;
      if(!tp[tn].sections[item.section]) tp[tn].sections[item.section]={total:0,r1:0,r2:0,r3:0};
      tp[tn].sections[item.section].total+=pts;
      if(rank===1) tp[tn].sections[item.section].r1++; else if(rank===2) tp[tn].sections[item.section].r2++; else if(rank===3) tp[tn].sections[item.section].r3++;
    });
  });
  // Add any manually-added Custom Bonus Points on top of the earned totals
  (bonuses||[]).forEach(function(b){
    var t=teams.find(function(t){return t.id===b.teamId;});
    if(!t||!tp[t.name]) return;
    var pts=parseFloat(b.points)||0;
    tp[t.name].total+=pts;
    tp[t.name].bonus+=pts;
  });
  return tp;
}

function filterResultList(q, sec, flt){
  var items=DB.items(),participants=DB.participants(),marks=DB.marks(),groups=DB.groups();
  q=(q||'').toLowerCase(); flt=flt||'all';
  var cb=document.getElementById('r-clear-btn'); if(cb) cb.style.display=q?'':'none';
  var base=(sec==='All'?items:items.filter(function(i){return i.section===sec;}))
    .filter(function(item){return marks.some(function(m){return m.itemId===item.id&&m.total>0;})&&(!q||item.name.toLowerCase().includes(q));});
  var list=base.filter(function(item){
    if(flt==='declared') return item.declared;
    if(flt==='pending') return !item.declared;
    return true;
  });
  var el=document.getElementById('r-list');
  if(!el) return;
  el.innerHTML=!list.length
    ?'<div style="text-align:center;padding:30px;color:var(--text3)">No results found</div>'
    :list.map(function(item){
      var im=marks.filter(function(m){return m.itemId===item.id&&m.total>0;}).sort(function(a,b){return b.total-a.total;});
      applyDenseRank(im);
      var rows=im.slice(0,5).map(function(m){
        var grp=item.type==='group'?groups.find(function(g){return g.groupChestNo===m.chestNo&&_grpHasItem(g,item);}):null;
        var p=participants.find(function(pt){return pt.chestNo===m.chestNo;});
        var name=grp?grp.name:(p?p.name:'#'+m.chestNo), team=grp?grp.team:(p?p.team:'');
        var rk=m._rank||'-';
        var col=rk===1?'var(--gold)':rk===2?'#c0c0c0':rk===3?'#cd7f32':'var(--text)';
        return '<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border)">'
          +'<div class="rank-badge rank-'+(rk<=3?rk:'other')+'" style="flex-shrink:0">'+rk+'</div>'
          +'<div style="flex:1"><div style="font-size:.85rem;font-weight:700">'+name+'</div>'
          +'<div style="font-size:.7rem;color:var(--text3)">'+team+'</div></div>'
          +'<div style="text-align:right"><div style="font-size:.9rem;font-weight:800;color:'+col+'">'+(m.point||0)+' pts</div>'
          +'<div style="font-size:.7rem;color:var(--text3)">'+m.grade+'</div></div></div>';
      }).join('');
      var uid='rb-'+item.id+'-f';
      return '<div class="list-item" style="flex-direction:column;align-items:stretch;padding:0;overflow:hidden">'
        +'<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;cursor:pointer" onclick="_openResultModal(\''+item.id+'\',\''+sec+'\',\''+flt+'\')">'
        +'<div class="list-avatar" style="background:var(--bg3);font-size:.7rem;font-weight:800;flex-shrink:0;color:var(--accent)">'+(item.code||'?')+'</div>'
        +'<div class="list-info" style="min-width:0"><div class="list-title" style="font-size:.85rem">'+item.name+'</div>'
        +'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:2px">'
        +(item.declared?'<span class="badge badge-green" style="font-size:.6rem"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Declared</span>':'<span class="badge badge-orange" style="font-size:.6rem">Pending</span>')
        +'<span style="font-size:.68rem;color:var(--text3);padding:3px 0">'+item.section+'</span></div></div>'
        +'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--text3)"><polyline points="6 9 12 15 18 9"/></svg>'
        +'</div></div>';
    }).join('');
}


function renderResults(data){
  data=data||{};
  var items=DB.items(),participants=DB.participants(),marks=DB.marks(),sections=DB.sections(),groups=DB.groups();
  var sec=data.section||window._resultsSection||'All', q=(data.q||'').toLowerCase(), flt=data.filter||window._resultsFlt||'all';
  window._resultsSection=sec; window._resultsFlt=flt;
  var base=items
    .filter(function(item){return marks.some(function(m){return m.itemId===item.id&&m.total>0;});})
    .filter(function(item){return !q||item.name.toLowerCase().includes(q);});
  var allBaseItems=base;
  base=base.filter(function(item){return sec==='All'||item.section===sec;});
  var declaredCnt=base.filter(function(i){return i.declared;}).length;
  var pendingCnt=base.filter(function(i){return !i.declared;}).length;
  var filtered=base.filter(function(item){
    if(flt==='declared') return item.declared;
    if(flt==='pending') return !item.declared;
    return true;
  });
  var tabs='';// section tabs removed
  var secDDItems=[{value:'All',label:'All Sections'}].concat(sections.map(function(s){return {value:s,label:getSectionShortName(s)};}));
  var secDD=_wzDropdown('results-sec-dd', secDDItems, sec, {onSelect:"window._resultsSection=$val;render('results',{filter:window._resultsFlt||'all',section:$val})", wrapStyle:'flex-shrink:0;width:128px', btnStyle:'padding:0 10px;font-size:.78rem;height:48px'});
  var _rIsFiltered=sec!=='All'||flt!=='all'||!!q;
  var fltBtns='<div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:nowrap;align-items:center">'
    +'<button class="btn btn-sm '+(flt==='all'?'btn-primary':'btn-secondary')+'" onclick="render(\'results\',{filter:\'all\',section:window._resultsSection||\'All\'})">All ('+base.length+')</button>'
    +'<button class="btn btn-sm '+(flt==='declared'?'btn-primary':'btn-secondary')+'" onclick="render(\'results\',{filter:\'declared\',section:window._resultsSection||\'All\'})">'+_svgCheckIcon()+' ('+declaredCnt+')</button>'
    +'<button class="btn btn-sm '+(flt==='pending'?'btn-primary':'btn-secondary')+'" onclick="render(\'results\',{filter:\'pending\',section:window._resultsSection||\'All\'})">'+_svgWarnIcon()+' ('+pendingCnt+')</button>'
    +_clearFilterBtn(_rIsFiltered)
    +'</div>';
  var resHtml=!filtered.length
    ?(_rIsFiltered
      ?'<div style="text-align:center;padding:30px;color:var(--text3)">No results for "'+(q||sec)+'".</div>'
      :'<div style="text-align:center;padding:30px;color:var(--text3)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M5 4H3v2a4 4 0 0 0 4 4"/><path d="M19 4h2v2a4 4 0 0 1-4 4"/></svg> No results yet</div>')
    :filtered.map(function(item){
      var uid='rb-'+item.id;
      return '<div class="list-item" style="flex-direction:column;align-items:stretch;padding:0;overflow:hidden">'
        +'<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;cursor:pointer" onclick="_openResultModal(\''+item.id+'\',\''+sec+'\',\''+flt+'\')">'
        +'<div class="list-avatar" style="background:var(--bg3);font-size:.7rem;font-weight:800;flex-shrink:0;color:var(--accent)">'+(item.code||'?')+'</div>'
        +'<div class="list-info" style="min-width:0"><div class="list-title" style="font-size:.85rem">'+item.name+'</div>'
        +'<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:2px">'
        +(item.declared?'<span class="badge badge-green" style="font-size:.6rem"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Declared</span>':'<span class="badge badge-orange" style="font-size:.6rem">Pending</span>')
        +'<span style="font-size:.68rem;color:var(--text3);padding:3px 0">'+item.section+'</span>'
        +'</div></div>'
        +'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--text3)"><polyline points="6 9 12 15 18 9"/></svg>'
        +'</div></div>';
    }).join('');
  return tabs+fltBtns
    +'<div style="display:flex;gap:8px;margin-bottom:10px;align-items:center">'
    +'<div style="position:relative;flex:1">'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" style="margin-bottom:0;padding-right:36px" id="r-search" placeholder="Search items..." value="'+(data.q||'')+'"'
    +' oninput="filterResultList(this.value,window._resultsSection||\'All\',\''+flt+'\')">'
    +'<button id="r-clear-btn" onclick="document.getElementById(\'r-search\').value=\'\';filterResultList(\'\',window._resultsSection||\'All\',\''+flt+'\')" aria-label="Clear search" style="display:'+(data.q?'':'none')+';position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
    +'</div>'
    +secDD
    +'</div>'
    +'<div id="r-list">'+resHtml+'</div>';
}

function toggleDeclareFromResults(itemId, sec, flt){
  const items=DB.items(), idx=items.findIndex(i=>i.id==itemId);
  if(idx<0) return;
  items[idx].declared=!items[idx].declared;
  if(items[idx].declared) items[idx].declaredAt=Date.now();
  DB.saveItems(items);
  if(items[idx].declared) assignRanks(itemId);
  broadcastPublicUpdate();
  toast(items[idx].declared?'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Declared! Points updated.':'Un-declared');
  renderKeepScroll('results',{section:sec||window._resultsSection||'All', filter:flt||'all'});
}

// =============================================
// MARKS MODAL
// =============================================
async function _openMarkModal(itemId){
  var item=DB.items().find(function(i){return i.id==itemId;});
  if(!item) return;
  // Always pull fresh from Supabase before showing this screen — marks
  // entered via a judge link come from a completely separate anonymous
  // session, so we can't assume local cache/realtime already has them.
  if(window.WinzeraSync && window.WinzeraSync.getOrgId()){
    showModal('<div class="modal-handle"></div><div style="text-align:center;padding:40px 0;color:var(--text3)">Loading latest marks\u2026</div>', {noSaveBtn:true});
    try{
      var snap=await window.WinzeraSync.pullOrgSnapshot();
      _mem.config=snap.config||_mem.config;
      _mem.teams=snap.teams;
      _mem.sections=snap.sections;
      _mem.items=snap.items;
      _mem.participants=snap.participants;
      _mem.marks=_wzRecomputeMarksShape(snap.marks, snap.items, _mem.config);
      _mem.groups=snap.groups;
      _mem.bonuses=snap.bonuses;
      window.WinzeraSync.rememberSnapshot(snap);
      item=DB.items().find(function(i){return i.id==itemId;});
      if(!item) return;
    }catch(e){
      console.error('Winzera: fresh pull before mark modal failed:', e);
      toast('Could not fetch the latest marks \u2014 showing last known data. Check your connection.','error');
    }
  }
  var marks=DB.marks(), cfg=DB.config();
  var nj=parseInt(cfg.maxJudges)||3, mj=parseInt(cfg.maxMarks)||100;
  var im=marks.filter(function(m){return m.itemId==itemId;});
  console.log('Winzera debug: marks fetched for item', itemId, '=', im.length, 'rows', im);
  var groups=DB.groups(), participants2=DB.participants();
  var itemP2=item.type==='group'
    ?groups.filter(function(g){return _grpHasItem(g,item);})
    :participants2.filter(function(p){return (p.items||[]).includes(item.id);});
  var activeP2=itemP2.filter(function(p){var me=im.find(function(m){return m.chestNo===(item.type==='group'?p.groupChestNo:p.chestNo);});return !(me&&me.codeLetter==='?');});
  var allSaved2=activeP2.length>0&&activeP2.every(function(p){var me=im.find(function(m){return m.chestNo===(item.type==='group'?p.groupChestNo:p.chestNo);});return me&&me.total>0;});
  // Same fix as the inline panel: Undeclare must stay clickable regardless
  // of allSaved2, which only makes sense as a gate on Declare.
  var declareGateOk2=item.declared||allSaved2;
  var declStyle2=declareGateOk2?'flex:1':'flex:1;opacity:.45;pointer-events:none';
  var declClick2=declareGateOk2?'onclick="toggleDeclareInline(\''+item.id+'\',true)"':'';
  var html='<div class="modal-handle"></div>'
    +'<button class="modal-close-btn" onclick="_closeMarkModal()">&times;</button>'
    +'<div class="modal-title" style="padding-right:44px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg> '+item.name+'</div>'
    +'<div style="font-size:.72rem;color:var(--text2);margin-bottom:6px">'+item.section
    +(item.code?'&nbsp;·&nbsp;Code <b style="color:var(--accent)">'+item.code+'</b>':'')+'</div>'
    +'<div style="font-size:.68rem;color:var(--text3);margin-bottom:10px">'+nj+' judge'+(nj>1?'s':'')+' &middot; max '+mj+' each</div>'
    +'<div style="max-height:50vh;overflow-y:auto;padding-right:2px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding-top:4px;margin-bottom:12px">'
    +renderInlineMarkEntry(item, im, nj, mj, true)
    +'</div>'
    +'<div style="display:flex;gap:8px;margin-bottom:10px">'
    +'<button class="btn btn-primary" style="flex:1" id="savebtn-'+item.id+'" onclick="saveInlineMarks(\''+item.id+'\','+nj+','+mj+',null,true)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h6"/></svg> Save All</button>'
    +'<button class="btn '+(item.declared?'btn-warning':'btn-success')+'" style="'+declStyle2+'" '+declClick2+'>'+(item.declared?'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Undeclare':'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a1 1 0 0 0 1 1h1l3 6h2l-2-6h5l7 4V6l-7 4H4a1 1 0 0 0-1 1Z"/></svg> Declare')+'</button>'
    +'</div>'
    +'<button class="btn btn-secondary" style="width:100%" onclick="_closeMarkModal()">Close</button>';
  showModal(html, {noDirtyGuard:true});
  window._activeMarkModalItemId=itemId;
}

function _closeMarkModal(){
  if(_pageUnsaved){
    var itemId=window._activeMarkModalItemId;
    var cfg=DB.config();
    var nj=parseInt(cfg.maxJudges)||3, mj=parseInt(cfg.maxMarks)||100;
    _showInModalUnsavedConfirm(
      function(){ // Save & Continue — inputs still in DOM
        saveInlineMarks(itemId, nj, mj, null, true);
      },
      function(){ // Don't Save
        _pageUnsaved=false;
        _closeMarkModalClean();
      }
    );
    return;
  }
  _closeMarkModalClean();
}

function _closeMarkModalClean(){
  _pageUnsaved=false;
  window._activeMarkModalItemId=null;
  _closeModalClean();
}

// =============================================
// RESULTS MODAL
// =============================================
function _openResultModal(itemId, sec, flt){
  var items=DB.items(), marks=DB.marks(), groups=DB.groups(), participants=DB.participants();
  var item=items.find(function(i){return i.id==itemId;});
  if(!item) return;
  sec=sec||'All'; flt=flt||'all';
  var im=marks.filter(function(m){return m.itemId==itemId&&m.total>0;})
    .sort(function(a,b){return b.total-a.total;});
  applyDenseRank(im);
  var rows=im.map(function(m){
    var grp=item.type==='group'?groups.find(function(g){return g.groupChestNo===m.chestNo&&_grpHasItem(g,itemId);}):null;
    var p=participants.find(function(pt){return pt.chestNo===m.chestNo;});
    var name=grp?grp.name:(p?p.name:'#'+m.chestNo);
    var team=grp?grp.team:(p?p.team:'');
    var rk=m._rank||'-';
    var col=rk===1?'var(--gold)':rk===2?'#c0c0c0':rk===3?'#cd7f32':'var(--text)';
    return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">'
      +'<div class="rank-badge rank-'+(rk<=3?rk:'other')+'" style="flex-shrink:0">'+rk+'</div>'
      +'<div style="flex:1;min-width:0"><div style="font-size:.88rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+name+'</div>'
      +'<div style="font-size:.72rem;color:var(--text3)">'+team+'</div></div>'
      +'<div style="text-align:right;flex-shrink:0"><div style="font-size:.92rem;font-weight:800;color:'+col+'">'+(m.point||0)+' pts</div>'
      +'<div style="font-size:.7rem;color:var(--text3)">'+m.grade+'&nbsp;·&nbsp;'+Math.round(m.pct||0)+'%</div></div></div>';
  }).join('');
  var declBtn=isTeam()?'':'<button class="btn '+(item.declared?'btn-warning':'btn-success')+'" style="flex:1" onclick="_toggleDeclareModal(\''+itemId+'\',\''+sec+'\',\''+flt+'\')">'
    +(item.declared?'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Undeclare':'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a1 1 0 0 0 1 1h1l3 6h2l-2-6h5l7 4V6l-7 4H4a1 1 0 0 0-1 1Z"/></svg> Declare')+'</button>';
  var shareBtn=item.declared
    ?'<button class="btn btn-secondary" style="flex:1" onclick="shareResultImage(\''+itemId+'\')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Share</button>'
    :'';
  var html='<div class="modal-handle"></div>'
    +'<button class="modal-close-btn" onclick="closeModal()" aria-label="Close">&times;</button>'
    +'<div class="modal-title" style="padding-right:44px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M5 4H3v2a4 4 0 0 0 4 4"/><path d="M19 4h2v2a4 4 0 0 1-4 4"/></svg> '+item.name+'</div>'
    +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">'
    +'<span style="font-size:.72rem;color:var(--text2)">'+item.section+(item.code?'&nbsp;·&nbsp;Code <b style="color:var(--accent)">'+item.code+'</b>':'')+'</span>'
    +(item.declared?'<span class="badge badge-green" style="font-size:.62rem"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Declared</span>':'<span class="badge badge-orange" style="font-size:.62rem">Pending</span>')
    +'</div>'
    +(rows?'<div style="max-height:55vh;overflow-y:auto;padding-right:2px">'+rows+'</div>'
      :'<div style="text-align:center;padding:20px;color:var(--text3)">No marks available</div>')
    +'<div style="display:flex;gap:8px;margin-top:14px">'+declBtn+shareBtn+'</div>'
    +'<div class="divider" style="margin:10px 0"></div>'
    +'<button class="btn btn-secondary" style="width:100%" onclick="closeModal()">Close</button>';
  window._resultModalCtx={itemId:itemId, sec:sec, flt:flt};
  showModal(html, {noDirtyGuard:true});
}

function _toggleDeclareModal(itemId, sec, flt){
  var items=DB.items();
  var idx=items.findIndex(function(i){return i.id==itemId;});
  if(idx<0) return;
  items[idx].declared=!items[idx].declared;
  if(items[idx].declared) items[idx].declaredAt=Date.now();
  DB.saveItems(items);
  if(items[idx].declared) assignRanks(itemId);
  broadcastPublicUpdate();
  toast(items[idx].declared?'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Declared! Points updated.':'Un-declared');
  // Refresh modal with updated state
  _openResultModal(itemId, sec, flt);
  // Also refresh the background results list
  renderKeepScroll('results',{filter:flt||'all'});
}

// =============================================
// PARTICIPANT SCORE MODAL (read-only — safe for team-manager access via
// the participantScores search group; no declare/share/edit actions here)
// =============================================
function _openParticipantScoreModal(chestNo){
  var participants=DB.participants(), items=DB.items(), marks=DB.marks();
  var p=participants.find(function(pt){return pt.chestNo===chestNo;});
  if(!p) return;
  var rows=marks.filter(function(m){return m.chestNo===chestNo && m.total>0;})
    .map(function(m){ return {m:m,item:items.find(function(i){return i.id===m.itemId;})}; })
    .filter(function(x){return x.item && x.item.declared;})
    .sort(function(a,b){return (b.m.point||0)-(a.m.point||0);});
  var total=rows.reduce(function(sum,x){return sum+(x.m.point||0);},0);
  var rowsHtml=rows.map(function(x){
    var m=x.m, item=x.item;
    var rk=m.rank||'-';
    var col=rk===1?'var(--gold)':rk===2?'#c0c0c0':rk===3?'#cd7f32':'var(--text)';
    return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">'
      +'<div class="rank-badge rank-'+(rk<=3?rk:'other')+'" style="flex-shrink:0">'+rk+'</div>'
      +'<div style="flex:1;min-width:0"><div style="font-size:.88rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+_gsearchEsc(item.name)+'</div>'
      +'<div style="font-size:.72rem;color:var(--text3)">'+_gsearchEsc(item.section)+'</div></div>'
      +'<div style="text-align:right;flex-shrink:0"><div style="font-size:.92rem;font-weight:800;color:'+col+'">'+(m.point||0)+' pts</div>'
      +'<div style="font-size:.7rem;color:var(--text3)">'+m.grade+'&nbsp;·&nbsp;'+Math.round(m.pct||0)+'%</div></div></div>';
  }).join('');
  var html='<div class="modal-handle"></div>'
    +'<button class="modal-close-btn" onclick="closeModal()" aria-label="Close">&times;</button>'
    +'<div class="modal-title" style="padding-right:44px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> '+_gsearchEsc(p.name)+'</div>'
    +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px">'
    +'<span style="font-size:.72rem;color:var(--text2)">#'+p.chestNo+'&nbsp;&middot;&nbsp;'+_gsearchEsc(p.team)+'&nbsp;&middot;&nbsp;'+_gsearchEsc(p.section)+'</span>'
    +'<span class="badge badge-green" style="font-size:.62rem">Total: '+total+' pts</span>'
    +'</div>'
    +(rowsHtml?'<div style="max-height:55vh;overflow-y:auto;padding-right:2px">'+rowsHtml+'</div>'
      :'<div style="text-align:center;padding:20px;color:var(--text3)">No declared scores yet</div>')
    +'<div class="divider" style="margin:14px 0 10px"></div>'
    +'<button class="btn btn-secondary" style="width:100%" onclick="closeModal()">Close</button>';
  showModal(html, {noDirtyGuard:true});
}

// =============================================
// CODES MODAL
// =============================================
function _openCodeModal(itemId){
  var items=DB.items(), participants=DB.participants(), marks=DB.marks(), groups=DB.groups();
  var item=items.find(function(i){return i.id==itemId;});
  if(!item) return;
  var itemP=item.type==='group'
    ?groups.filter(function(g){return _grpHasItem(g,item);}).map(function(g){return {chestNo:g.groupChestNo,name:g.name,team:g.team,section:g.section};})
    :participants.filter(function(p){return (p.items||[]).includes(item.id);});
  var im=marks.filter(function(m){return m.itemId===item.id;});
  var hasMarks=im.some(function(m){return m.total>0;});
  var rows=itemP.map(function(p){
    var m=im.find(function(mk){return mk.chestNo===p.chestNo;});
    var code=m&&m.codeLetter?m.codeLetter:'';
    var isAbsent=code==='?';
    var miss=!code;
    var iid='cl_'+item.id+'_'+p.chestNo;
    if(isAbsent){
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);opacity:.65">'
        +'<div style="flex:1;min-width:0">'
        +'<div style="font-size:.88rem;font-weight:600;text-decoration:line-through;color:var(--text3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(item.type==='group'?getGroupDisplayName(item.id,p.name):p.name)+'</div>'
        +'<div style="font-size:.72rem;color:var(--text3)">#'+p.chestNo+' · '+p.team+' · <span style="color:#ff7070;font-weight:700">Absent</span></div>'
        +'</div>'
        +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" id="'+iid+'" type="text" maxlength="3" value="?" placeholder="?"'
        +' style="width:58px;text-align:center;font-weight:800;font-size:1rem;border:2px solid rgba(255,80,80,.5);border-radius:8px;background:rgba(255,80,80,.1);color:#ff7070;padding:6px 4px;outline:none;text-transform:uppercase;flex-shrink:0"'
        +' oninput="this.value=this.value.toUpperCase();liveCheckCodeDup(this,\''+item.id+'\','+p.chestNo+');window._tempSaveCB=function(){saveItemCodes(\''+item.id+'\',null,true);};_setPageUnsaved(true,\'Code Letters\')"'
        +'></div>';
    }
    return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">'
      +'<div style="flex:1;min-width:0"><div style="font-size:.88rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(item.type==='group'?getGroupDisplayName(item.id,p.name):p.name)+'</div>'
      +'<div style="font-size:.72rem;color:var(--text3)">#'+p.chestNo+' · '+p.team+'</div></div>'
      +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" id="'+iid+'" type="text" maxlength="3" value="'+code+'" placeholder="—"'
      +' style="width:58px;text-align:center;font-weight:800;font-size:1rem;border:2px solid '+(miss?'rgba(255,80,80,.4)':'var(--accent)44')+';border-radius:8px;background:'+(miss?'rgba(255,80,80,.08)':'var(--accent)11')+';color:'+(miss?'#ff7070':'var(--accent)')+';padding:6px 4px;outline:none;text-transform:uppercase;flex-shrink:0"'
      +' oninput="this.value=this.value.toUpperCase();liveCheckCodeDup(this,\''+item.id+'\','+p.chestNo+');window._tempSaveCB=function(){saveItemCodes(\''+item.id+'\',null,true);};_setPageUnsaved(true,\'Code Letters\')"'
      +'></div>';
  }).join('');
  var html='<div class="modal-handle"></div>'
    +'<button class="modal-close-btn" onclick="_closeCodeModal()">&times;</button>'
    +'<div class="modal-title" style="padding-right:44px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h12l4 4v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M8 10h8"/><path d="M8 14h8"/><path d="M8 18h5"/></svg> '+item.name+'</div>'
    +'<div style="font-size:.72rem;color:var(--text2);margin-bottom:12px">'+item.section
    +(item.code?'&nbsp;·&nbsp;Item Code <b style="color:var(--accent)">'+item.code+'</b>':'')
    +'&nbsp;·&nbsp;'+itemP.length+' participants</div>'
    +(hasMarks?'<div style="font-size:.72rem;color:#f0a500;background:rgba(240,165,0,.08);border:1px solid rgba(240,165,0,.25);border-radius:8px;padding:8px 10px;margin-bottom:10px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg> Marks already entered — changing codes will clear all mark data for this item.</div>':'')
    +'<div style="display:flex;gap:8px;margin-bottom:10px">'
    +(hasMarks
      ?'<button class="btn btn-warning btn-sm" style="flex:1" onclick="assignCodesSafe(\''+item.id+'\',true)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h1.4a3 3 0 0 0 2.5-1.3l5.4-8.4a3 3 0 0 1 2.5-1.3H19"/><path d="M16 3h5v5"/><path d="M2 6h1.4a3 3 0 0 1 2.5 1.3l.5.7"/><path d="M14.5 15l.5.7a3 3 0 0 0 2.5 1.3H19"/><path d="M16 21h5v-5"/></svg> Re-assign Codes</button>'
      :'<button class="btn btn-primary btn-sm" style="flex:1" onclick="assignCodes(\''+item.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h1.4a3 3 0 0 0 2.5-1.3l5.4-8.4a3 3 0 0 1 2.5-1.3H19"/><path d="M16 3h5v5"/><path d="M2 6h1.4a3 3 0 0 1 2.5 1.3l.5.7"/><path d="M14.5 15l.5.7a3 3 0 0 0 2.5 1.3H19"/><path d="M16 21h5v-5"/></svg> Auto Assign</button>')
    +'</div>'
    +'<div style="font-size:.7rem;color:var(--text3);background:var(--bg2);border-radius:6px;padding:6px 10px;margin-bottom:10px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5"/><path d="M12 8h.01"/></svg> Enter <b>?</b> to mark a participant as <b>absent</b> — excluded from mark entry.</div>'
    +'<div style="max-height:48vh;overflow-y:auto;padding-right:2px">'+rows+'</div>'
    +'<div style="display:flex;gap:8px;margin-top:14px">'
    +'<button class="btn btn-success" style="flex:1" onclick="saveItemCodes(\''+item.id+'\',null,true)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h6"/></svg> Save Codes</button>'
    +'<button class="btn btn-secondary" style="flex:1" onclick="_closeCodeModal()">Close</button>'
    +'</div>';
  showModal(html, {noDirtyGuard:true});
  window._activeCodeModalItemId=itemId;
}

function _closeCodeModal(){
  if(_pageUnsaved){
    var itemId=window._activeCodeModalItemId;
    _showInModalUnsavedConfirm(
      function(){ // Save & Continue — inputs still in DOM
        saveItemCodes(itemId, null, true);
      },
      function(){ // Don't Save
        _pageUnsaved=false;
        _closeCodeModalClean();
      }
    );
    return;
  }
  _closeCodeModalClean();
}

function _closeCodeModalClean(){
  _pageUnsaved=false;
  window._activeCodeModalItemId=null;
  _closeModalClean();
}

// =============================================
// IN-MODAL UNSAVED CONFIRM OVERLAY
// Shows a semi-transparent confirm on TOP of existing modal content
// so inputs remain in DOM and can be read by the save callback.
// =============================================
function _showInModalUnsavedConfirm(onSave, onDiscard){
  var mc=document.getElementById('modalContent');
  if(!mc) return;
  // Make sure parent is positioned so absolute overlay works
  mc.style.position='relative';
  var ov=document.createElement('div');
  ov.id='_imcOverlay';
  ov.style.cssText='position:absolute;inset:0;background:rgba(15,15,20,0.93);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:50;border-radius:16px;padding:28px;text-align:center;backdrop-filter:blur(2px)';
  ov.innerHTML='<div style="font-size:2.2rem;margin-bottom:10px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>️</div>'
    +'<div style="font-size:1rem;font-weight:800;margin-bottom:6px;color:var(--gold)">Unsaved Changes</div>'
    +'<div style="font-size:.85rem;color:var(--text2);margin-bottom:22px">You have unsaved changes.<br>What would you like to do?</div>'
    +'<div style="display:flex;flex-direction:column;gap:10px;width:100%">'
    +'<button class="btn btn-primary" id="_imcSaveBtn"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h6"/></svg> Save &amp; Continue</button>'
    +'<button class="btn btn-danger"   id="_imcDiscardBtn"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v18"/><path d="M4 21V5a2 2 0 0 1 2-2h8v18H6a2 2 0 0 1-2-2Z"/><path d="M14 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><circle cx="9" cy="12" r="0.5" fill="currentColor"/></svg> Don\'t Save</button>'
    +'<button class="btn btn-secondary" id="_imcCancelBtn"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg> Cancel</button>'
    +'</div>';
  mc.appendChild(ov);
  document.getElementById('_imcSaveBtn').onclick=function(){
    ov.remove();
    if(onSave) onSave();
  };
  document.getElementById('_imcDiscardBtn').onclick=function(){
    ov.remove();
    if(onDiscard) onDiscard();
  };
  document.getElementById('_imcCancelBtn').onclick=function(){
    ov.remove();
  };
}
// =============================================
function renderTeamPoints(data){
  data=data||{};
  var showRanks=data.showRanks||false;
  var showSection=data.showSection||'';
  const tp=calcTeamPoints();
  const sorted=Object.entries(tp).sort((a,b)=>b[1].total-a[1].total);
  const declared=DB.items().filter(i=>i.declared).length;
  const sections=DB.sections();

  // Section contribution breakdown for a team
  function sectionBreakdown(pts){
    var rows=Object.entries(pts.sections).filter(([s,d])=>d.total>0).sort((a,b)=>b[1].total-a[1].total);
    if(!rows.length) return '<div style="font-size:.75rem;color:var(--text3);padding:8px">No points yet</div>';
    return '<table class="pts-table" style="margin-top:8px"><tr><th>Section</th><th>Pts</th><th><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="M12 12l1.5 3-1.5 1-1.5-1Z"/><path d="M8.5 9 6 3"/><path d="M15.5 9 18 3"/></svg></th><th><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="M12 12l1.5 3-1.5 1-1.5-1Z"/><path d="M8.5 9 6 3"/><path d="M15.5 9 18 3"/></svg></th><th><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="M12 12l1.5 3-1.5 1-1.5-1Z"/><path d="M8.5 9 6 3"/><path d="M15.5 9 18 3"/></svg></th></tr>'
      +rows.map(([sec,d])=>'<tr><td style="font-size:.78rem">'+sec+'</td><td style="font-weight:700;color:var(--accent)">'+d.total+'</td><td style="color:var(--gold)">'+(d.r1||0)+'</td><td style="color:#c0c0c0">'+(d.r2||0)+'</td><td style="color:#cd7f32">'+(d.r3||0)+'</td></tr>').join('')
      +'</table>';
  }

  return `
  <div class="card" style="background:rgba(240,165,0,.05);border-color:rgba(240,165,0,.2);margin-bottom:12px">
    <div style="font-size:.78rem;color:var(--text2)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg> Only <b style="color:var(--accent)">${declared} declared</b> events count towards points.</div>
  </div>
  ${sorted.length>0&&sorted[0][1].total>0?`
  <div class="card" style="background:linear-gradient(135deg,rgba(255,215,0,.12),rgba(240,165,0,.12));border-color:rgba(255,215,0,.4);margin-bottom:12px">
    <div style="text-align:center;padding:8px 0">
      <div style="font-size:2.4rem"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M5 4H3v2a4 4 0 0 0 4 4"/><path d="M19 4h2v2a4 4 0 0 1-4 4"/></svg></div>
      <div style="font-size:.7rem;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:2px;margin-top:4px">Overall Champion</div>
      <div style="font-size:1.5rem;font-weight:900;color:var(--gold);margin-top:6px">${sorted[0][0]}</div>
      <div style="font-size:1.1rem;font-weight:800;color:var(--accent);margin-top:2px">${sorted[0][1].total} Points</div>
      ${sorted[0][1].bonus?`<div style="font-size:.68rem;font-weight:700;color:var(--green);margin-top:2px">(incl. ${sorted[0][1].bonus} bonus)</div>`:''}
    </div>
  </div>`:''}
  <div class="card" style="overflow-x:auto">
    <div class="card-header">
      <div class="card-title"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M5 4H3v2a4 4 0 0 0 4 4"/><path d="M19 4h2v2a4 4 0 0 1-4 4"/></svg> Overall Team Standings</div>
      <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
        <button class="btn btn-sm ${showRanks?'btn-primary':'btn-secondary'}" onclick="render('teamPoints',{showRanks:${!showRanks}})"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="M12 12l1.5 3-1.5 1-1.5-1Z"/><path d="M8.5 9 6 3"/><path d="M15.5 9 18 3"/></svg> ${showRanks?'Hide':'Show'} Ranks</button>
        <button class="btn btn-secondary btn-sm" onclick="shareTeamPointsImage()" title="Share"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></button>
        <button class="btn btn-primary btn-sm" onclick="printTeamPoints()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></svg></button>
      </div>
    </div>
    <table class="pts-table">
      <tr><th>#</th><th>Team</th>${showRanks?'<th><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="M12 12l1.5 3-1.5 1-1.5-1Z"/><path d="M8.5 9 6 3"/><path d="M15.5 9 18 3"/></svg></th><th><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="M12 12l1.5 3-1.5 1-1.5-1Z"/><path d="M8.5 9 6 3"/><path d="M15.5 9 18 3"/></svg></th><th><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="M12 12l1.5 3-1.5 1-1.5-1Z"/><path d="M8.5 9 6 3"/><path d="M15.5 9 18 3"/></svg></th><th>A+</th>':''}<th>Points</th></tr>
      ${sorted.map(([name,pts],idx)=>`
      <tr>
        <td><div class="rank-badge rank-${idx<3?idx+1:'other'}" style="width:24px;height:24px;font-size:.72rem">${idx+1}</div></td>
        <td style="font-weight:700;font-size:.85rem">${name}</td>
        ${showRanks?`<td style="color:var(--gold)">${pts.r1||0}</td><td style="color:#c0c0c0">${pts.r2||0}</td><td style="color:#cd7f32">${pts.r3||0}</td><td style="color:var(--purple)">${pts.aplus||0}</td>`:''}
        <td style="font-weight:800;color:var(--accent);font-size:1rem">${pts.total}${pts.bonus?`<div style="font-size:.6rem;font-weight:700;color:var(--green)">(incl. ${pts.bonus} bonus)</div>`:''}</td>
      </tr>`).join('')}
    </table>
  </div>`;
}

// =============================================
// SECTION-WISE POINTS
// =============================================
function renderSectionPoints(){
  const tp=calcTeamPoints(), sections=DB.sections(), teams=DB.teams();
  const declared=DB.items().filter(i=>i.declared).length;
  return `
  <div class="card" style="background:rgba(240,165,0,.05);border-color:rgba(240,165,0,.2);margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
    <div style="font-size:.78rem;color:var(--text2)">Based on <b style="color:var(--accent)">${declared} declared</b> events</div>
  </div>
  ${sections.map(section=>{
    const sectionData=Object.entries(tp).map(([name,pts])=>({name,pts:pts.sections[section]||{total:0,r1:0,r2:0,r3:0}})).filter(x=>x.pts.total>0||x.pts.r1>0||x.pts.r2>0).sort((a,b)=>b.pts.total-a.pts.total);
    if(sectionData.length===0) return '';
    return `
    <div class="card" style="overflow-x:auto;margin-bottom:12px">
      <div class="card-header"><div class="card-title"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h6l2 3h8a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/></svg> ${section}</div><button class="btn btn-primary btn-sm" onclick="printSectionPoints('${section}')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></svg></button></div>
      <table class="pts-table">
        <tr><th>#</th><th>Team</th><th><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="M12 12l1.5 3-1.5 1-1.5-1Z"/><path d="M8.5 9 6 3"/><path d="M15.5 9 18 3"/></svg></th><th><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="M12 12l1.5 3-1.5 1-1.5-1Z"/><path d="M8.5 9 6 3"/><path d="M15.5 9 18 3"/></svg></th><th><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="M12 12l1.5 3-1.5 1-1.5-1Z"/><path d="M8.5 9 6 3"/><path d="M15.5 9 18 3"/></svg></th><th>Pts</th></tr>
        ${sectionData.map((d,idx)=>`
        <tr>
          <td><div class="rank-badge rank-${idx<3?idx+1:'other'}" style="width:22px;height:22px;font-size:.68rem">${idx+1}</div></td>
          <td style="font-size:.82rem;font-weight:600;max-width:120px;overflow:hidden;text-overflow:ellipsis">${d.name}</td>
          <td style="color:var(--gold)">${d.pts.r1||0}</td><td style="color:#c0c0c0">${d.pts.r2||0}</td><td style="color:#cd7f32">${d.pts.r3||0}</td>
          <td style="font-weight:800;color:var(--accent)">${d.pts.total}</td>
        </tr>`).join('')}
      </table>
    </div>`;
  }).join('')||'<div style="text-align:center;padding:30px;color:var(--text3)">No declared results yet</div>'}`;
}

// =============================================
// POINTS TAB (2-column menu)
// =============================================
// =============================================
// CUSTOM BONUS POINTS MODULE
// =============================================
function showBonusPointsModal(){
  window._bpFormSnapshot=null;
  var body='<div class="modal-handle"></div>'
    +'<div class="modal-title"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg> '+(window._editingBonusId?'Edit Bonus Points':'Add Bonus Points')+'</div>'
    +'<div class="form-group"><label class="form-label">Team</label>'
    +'<div style="position:relative">'
    +'<input class="form-input" id="bp-team-q" style="margin-bottom:0;padding-right:36px" autocomplete="off" placeholder="Search team..." oninput="bonusTeamSearch(this.value)" onfocus="bonusTeamSearch(this.value)" onblur="bonusTeamBlur()">'
    +'<button type="button" id="bp-team-clear" onclick="bonusTeamClear()" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px;display:none"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
    +'<div id="bp-team-res" style="display:none;position:absolute;z-index:1200;left:0;right:0;top:100%;margin-top:3px;background:var(--card);border:1px solid var(--accent)44;border-radius:10px;max-height:180px;overflow-y:auto;box-shadow:0 6px 20px rgba(0,0,0,.4)"></div>'
    +'</div><input type="hidden" id="bp-team-hid" value=""></div>'
    +'<div class="form-group"><label class="form-label">Reason / Description</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="bp-reason" placeholder="e.g. Best Discipline Award"></div>'
    +'<div class="form-group"><label class="form-label">Bonus Points</label><input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="bp-points" type="number" placeholder="e.g. 10"></div>'
    +'<button class="btn btn-primary" style="width:100%;margin-bottom:6px" onclick="addBonusPoints()">'+(window._editingBonusId?'Save Changes':'Add Bonus')+'</button>'
    +(window._editingBonusId?'<button class="btn btn-secondary" style="width:100%;margin-bottom:10px" onclick="window._editingBonusId=null;showBonusPointsModal()">Cancel Edit</button>':'')
    +_bonusHistoryHTML()
    +'<button class="btn btn-secondary" style="width:100%;margin-top:10px" onclick="closeModal()">Close</button>';
  showModal(body, {noDirtyGuard:true});
}
function _bonusHistoryHTML(){
  var bonuses=DB.bonuses().slice().sort(function(a,b){return (b.date||'').localeCompare(a.date||'');});
  var teams=DB.teams();
  var list=!bonuses.length?'<div style="font-size:.78rem;color:var(--text3);text-align:center;padding:14px 0">No bonus points added yet.</div>'
    :'<div style="max-height:220px;overflow-y:auto">'+bonuses.map(function(b){
      var t=teams.find(function(t){return t.id===b.teamId;});
      var tn=t?t.name:'(deleted team)';
      var dateStr=b.date?new Date(b.date).toLocaleDateString():'';
      return '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)">'
        +'<div style="flex:1;min-width:0">'
        +'<div style="font-size:.82rem;font-weight:700">'+tn+' <span style="color:'+(b.points>=0?'var(--green)':'var(--red)')+';font-weight:800">'+(b.points>=0?'+':'')+b.points+'</span></div>'
        +'<div style="font-size:.72rem;color:var(--text3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(b.reason||'')+(dateStr?' &middot; '+dateStr:'')+'</div>'
        +'</div>'
        +'<button type="button" class="btn btn-secondary btn-sm" style="padding:5px 9px" onclick="editBonusPoints(\''+b.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>'
        +'<button type="button" class="btn btn-danger btn-sm" style="padding:5px 9px" onclick="deleteBonusPoints(\''+b.id+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button>'
        +'</div>';
    }).join('')+'</div>';
  return '<div style="font-size:.78rem;font-weight:700;color:var(--text2);margin:16px 0 6px">Bonus History</div>'+list;
}
function bonusTeamSearch(q){
  var list=DB.teams();
  var res=document.getElementById('bp-team-res'); if(!res) return;
  q=(q||'').toLowerCase().trim();
  var cb=document.getElementById('bp-team-clear'); if(cb) cb.style.display=q?'':'none';
  var filtered=q?list.filter(function(t){return t.name.toLowerCase().indexOf(q)>=0;}):list;
  if(!filtered.length){
    res.innerHTML='<div style="padding:10px 14px;font-size:.82rem;color:var(--text3)">No teams found</div>';
    res.style.display='block'; return;
  }
  var curId=document.getElementById('bp-team-hid').value;
  res.innerHTML=filtered.map(function(t){
    var esc=String(t.name).replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    return '<div onmousedown="bonusTeamSelect(\''+t.id+'\',\''+esc+'\')" style="padding:9px 14px;cursor:pointer;font-size:.83rem;border-bottom:1px solid var(--border);'+(String(t.id)===String(curId)?'background:var(--accent)18;font-weight:700;color:var(--accent)':'')+'">'+t.name+'</div>';
  }).join('');
  res.style.display='block';
}
function bonusTeamSelect(id,name){
  var q=document.getElementById('bp-team-q'), hid=document.getElementById('bp-team-hid');
  if(q) q.value=name; if(hid) hid.value=id;
  var res=document.getElementById('bp-team-res'); if(res) res.style.display='none';
  setTimeout(function(){ var cb=document.getElementById('bp-team-clear'); if(cb) cb.style.display=id?'':'none'; },0);
  _modalDirty=true;
}
function bonusTeamClear(){
  var q=document.getElementById('bp-team-q'), hid=document.getElementById('bp-team-hid');
  if(q) q.value=''; if(hid) hid.value='';
  var cb=document.getElementById('bp-team-clear'); if(cb) cb.style.display='none';
  _modalDirty=true;
}
function bonusTeamBlur(){ setTimeout(function(){ var res=document.getElementById('bp-team-res'); if(res) res.style.display='none'; },200); }
function addBonusPoints(){
  var teamId=parseInt(document.getElementById('bp-team-hid').value);
  var reason=(document.getElementById('bp-reason').value||'').trim();
  var pts=parseFloat(document.getElementById('bp-points').value);
  if(!teamId) return toast('Please select a team','error');
  if(!reason) return toast('Enter a reason','error');
  if(isNaN(pts)) return toast('Enter bonus points','error');
  var bonuses=DB.bonuses();
  if(window._editingBonusId){
    var idx=bonuses.findIndex(function(b){return b.id===window._editingBonusId;});
    if(idx>=0) bonuses[idx]=Object.assign({},bonuses[idx],{teamId:teamId,reason:reason,points:pts});
    window._editingBonusId=null;
    toast('Bonus points updated!');
  } else {
    bonuses.push({id:_nextUniqueIds(bonuses,1)[0],teamId:teamId,reason:reason,points:pts,date:new Date().toISOString()});
    toast('Bonus points added!');
  }
  DB.saveBonuses(bonuses);
  _modalDirtyIgnore=true;
  showBonusPointsModal();
}
function editBonusPoints(id){
  var b=DB.bonuses().find(function(x){return x.id==id;});
  if(!b) return;
  window._editingBonusId=id;
  _modalDirtyIgnore=true;
  showBonusPointsModal();
  setTimeout(function(){
    var t=DB.teams().find(function(t){return t.id===b.teamId;});
    if(t) bonusTeamSelect(t.id,t.name);
    var r=document.getElementById('bp-reason'); if(r) r.value=b.reason||'';
    var p=document.getElementById('bp-points'); if(p) p.value=b.points;
    _modalDirty=false;
  },30);
}
function deleteBonusPoints(id){
  _wzConfirm('Are you sure you want to delete this bonus points entry? This action cannot be undone.',
    '_doDeleteBonusPoints(\''+id+'\')',
    {title:'Delete Bonus Entry', confirmLabel:'Delete', dangerConfirm:true});
}
function _doDeleteBonusPoints(id){
  var bonuses=DB.bonuses().filter(function(b){return b.id!=id;});
  DB.saveBonuses(bonuses);
  toast('Bonus entry deleted');
  if(window._editingBonusId===id) window._editingBonusId=null;
  _modalDirtyIgnore=true;
  showBonusPointsModal();
}

function renderPoints(){
  const svgTeamPts=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
  const svgResult=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`;
  const svgWinner=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`;
  const svgCert=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
  const svgIndv=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  const svgDetail=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
  const svgSection=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
  const declared=DB.items().filter(i=>i.declared).length;
  return `
  <button class="btn btn-primary" style="width:100%;margin-bottom:12px;display:flex;align-items:center;justify-content:center;gap:8px" onclick="showBonusPointsModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg> Add Bonus Points</button>
  ${isAdmin()?`<button class="btn btn-secondary" style="width:100%;margin-bottom:12px;display:flex;align-items:center;justify-content:center;gap:8px" onclick="openBroadcastPointsModal()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> Broadcast</button>`:''}
  <div class="card" style="background:rgba(240,165,0,.05);border-color:rgba(240,165,0,.2);margin-bottom:12px">
    <div style="font-size:.78rem;color:var(--text2)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>️ Points are based on <b style="color:var(--accent)">${declared} declared</b> events.</div>
  </div>
  <div class="menu-grid">
    <div class="menu-card" onclick="navigate('teamPoints')">
      <div class="mc-icon">${svgTeamPts}</div>
      <div class="mc-title">Team Points</div><div class="mc-sub">Overall standings</div>
    </div>
    <div class="menu-card" onclick="navigate('winnerList')">
      <div class="mc-icon">${svgWinner}</div>
      <div class="mc-title">Winner List</div><div class="mc-sub">All declared winners</div>
    </div>
    <div class="menu-card" onclick="navigate('certificates')">
      <div class="mc-icon">${svgCert}</div>
      <div class="mc-title">Certificate</div><div class="mc-sub">Generate certs</div>
    </div>
    <div class="menu-card" onclick="navigate('sectionPoints')">
      <div class="mc-icon">${svgSection}</div>
      <div class="mc-title">Section Wise</div><div class="mc-sub">Points by section</div>
    </div>
    <div class="menu-card" onclick="navigate('individualDetailed')">
      <div class="mc-icon">${svgDetail}</div>
      <div class="mc-title">Indv. Detailed</div><div class="mc-sub">Item-wise breakdown</div>
    </div>
    <div class="menu-card" onclick="navigate('individualPoints')">
      <div class="mc-icon">${svgIndv}</div>
      <div class="mc-title">Individual Point</div><div class="mc-sub">Student summary</div>
    </div>
  </div>`;
}


function calcIndvPoints(p,declaredItems,marks,cfg){
  var total=0,stage=0,offStage=0,r1=0,r2=0,r3=0,aplus=0;
  declaredItems.forEach(function(item){
    if(item.type==='group') return; // group items excluded from individual champion
    if(!_itemCountsIndiv(item)) return; // excluded from individual championship (Open Section item setting)
    var m=marks.find(function(mk){return mk.chestNo===p.chestNo&&mk.itemId===item.id&&mk.total>0;});
    if(!m) return;
    var pts=(m.point!=null)?m.point:calcIndvGradePoints(m.grade,cfg);
    if(pts>0){
      total+=pts;
      if(item.isStage) stage+=pts; else offStage+=pts;
    }
    if(m.grade==='A+') aplus++;
    if(m.rank===1) r1++; else if(m.rank===2) r2++; else if(m.rank===3) r3++;
  });
  return {total,stage,offStage,r1,r2,r3,aplus};
}

function renderIndividualPoints(data){
  data=data||{};
  const participants=DB.participants(), marks=DB.marks(), items=DB.items(), cfg=DB.config();
  const sections=DB.sections(), activeSection=data.section||'All';
  const activeTab=data.tab||'overall';
  const declaredItems=items.filter(i=>i.declared);
  const filtered=activeSection==='All'?participants:participants.filter(p=>p.section===activeSection);
  const indvPoints=filtered.map(p=>({p,...calcIndvPoints(p,declaredItems,marks,cfg)})).filter(x=>x.total>0||x.r1>0);
  const sorted={
    overall:[...indvPoints].sort((a,b)=>b.total-a.total),
    stage:[...indvPoints].filter(x=>x.stage>0).sort((a,b)=>b.stage-a.stage),
    offstage:[...indvPoints].filter(x=>x.offStage>0).sort((a,b)=>b.offStage-a.offStage),
  };
  const current=sorted[activeTab]||sorted.overall;
  const ptKey=activeTab==='stage'?'stage':activeTab==='offstage'?'offStage':'total';
  return `
  <div class="tabs">
    <div class="tab ${activeSection==='All'?'active':''}" onclick="render('individualPoints',{section:'All',tab:'${activeTab}'})">All</div>
    ${sections.map(s=>`<div class="tab ${activeSection===s?'active':''}" onclick="render('individualPoints',{section:'${s}',tab:'${activeTab}'})">${s}</div>`).join('')}
  </div>
  <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
    <button class="btn ${activeTab==='overall'?'btn-primary':'btn-secondary'} btn-sm" onclick="render('individualPoints',{section:'${activeSection}',tab:'overall'})"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M5 4H3v2a4 4 0 0 0 4 4"/><path d="M19 4h2v2a4 4 0 0 1-4 4"/></svg> Overall</button>
    <button class="btn ${activeTab==='stage'?'btn-primary':'btn-secondary'} btn-sm" onclick="render('individualPoints',{section:'${activeSection}',tab:'stage'})"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 17v5"/><path d="M8 22h8"/></svg> Stage Champion</button>
    <button class="btn ${activeTab==='offstage'?'btn-primary':'btn-secondary'} btn-sm" onclick="render('individualPoints',{section:'${activeSection}',tab:'offstage'})"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>️ Off-Stage Champion</button>
    <button class="btn btn-secondary btn-sm" style="margin-left:auto" onclick="printIndvPoints('${activeSection}','${activeTab}')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></svg> Print</button>
  </div>
  ${current.length>0&&current[0][ptKey]>0?`
  <div class="card" style="background:linear-gradient(135deg,rgba(255,215,0,.1),rgba(240,165,0,.1));border-color:rgba(255,215,0,.3);margin-bottom:12px">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="font-size:2rem"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M5 4H3v2a4 4 0 0 0 4 4"/><path d="M19 4h2v2a4 4 0 0 1-4 4"/></svg></div>
      <div style="flex:1"><div style="font-size:.68rem;color:var(--text2);text-transform:uppercase;letter-spacing:1px">${activeTab==='stage'?'On-Stage Champion':activeTab==='offstage'?'Off-Stage Champion':'Overall Individual Champion'}</div>
      <div style="font-size:1.1rem;font-weight:800;color:var(--gold)">${current[0].p.name}</div>
      <div style="font-size:.75rem;color:var(--text2)">${current[0].p.team} · ${current[0].p.section} · ${current[0][ptKey]} pts</div></div>
      <button class="btn btn-secondary btn-sm btn-icon" onclick="shareIndvChampionPoster('${activeSection}','${activeTab}')" title="Share Champion Poster" aria-label="Share Champion Poster"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg></button>
    </div>
  </div>`:''}
  ${current.length===0?'<div style="text-align:center;padding:30px;color:var(--text3)">No points yet — declare results first</div>':
    `<div class="card" style="overflow-x:auto">
    <table class="pts-table">
      <tr><th>#</th><th>Name</th><th>Group</th><th><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="M12 12l1.5 3-1.5 1-1.5-1Z"/><path d="M8.5 9 6 3"/><path d="M15.5 9 18 3"/></svg></th><th><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="M12 12l1.5 3-1.5 1-1.5-1Z"/><path d="M8.5 9 6 3"/><path d="M15.5 9 18 3"/></svg></th><th><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="M12 12l1.5 3-1.5 1-1.5-1Z"/><path d="M8.5 9 6 3"/><path d="M15.5 9 18 3"/></svg></th><th>Pts</th></tr>
      ${current.map((x,idx)=>`
      <tr>
        <td><div class="rank-badge rank-${idx<3?idx+1:'other'}" style="width:22px;height:22px;font-size:.68rem">${idx+1}</div></td>
        <td style="font-size:.82rem;font-weight:700">${x.p.name}<div style="font-size:.68rem;color:var(--text3)">#${x.p.chestNo} · ${x.p.section}</div></td>
        <td style="font-size:.75rem">${x.p.team}</td>
        <td style="color:var(--gold)">${x.r1}</td><td style="color:#c0c0c0">${x.r2}</td><td style="color:#cd7f32">${x.r3}</td>
        <td style="font-weight:800;color:var(--accent)">${x[ptKey]}</td>
      </tr>`).join('')}
    </table></div>`}`;
}

// =============================================
// INDIVIDUAL DETAILED POINTS
// =============================================
function renderIndividualDetailed(data){
  data=data||{};
  var cfg=DB.config(),participants=DB.participants(),marks=DB.marks(),items=DB.items(),sections=DB.sections();
  var sec=data.section||'All';
  var sortBy=data.sort||'name'; // 'name' or 'marks'
  var decl=items.filter(function(i){return i.declared&&i.type!=='group';});
  var filtered=sec==='All'?participants:participants.filter(function(p){return p.section===sec;});
  var tabs='<div class="tabs"><div class="tab '+(sec==='All'?'active':'')+'" onclick="render(\'individualDetailed\',{section:\'All\',sort:\''+sortBy+'\'})">All</div>'
    +sections.map(function(s){return '<div class="tab '+(sec===s?'active':'')+'" onclick="render(\'individualDetailed\',{section:\''+s+'\',sort:\''+sortBy+'\'})">'+getSectionShortName(s)+'</div>';}).join('')+'</div>';
  // Build with totals for sorting
  var withTotals=filtered.map(function(p){
    var pItems=decl.filter(function(item){return (p.items||[]).includes(item.id);});
    var total=0;
    pItems.forEach(function(item){
      var m=marks.find(function(mk){return mk.itemId===item.id&&mk.chestNo===p.chestNo;});
      if(m&&m.total>0&&_itemCountsIndiv(item)) total+=((m.point!=null)?m.point:calcIndvGradePoints(m.grade,cfg));
    });
    return {p,pItems,total};
  }).filter(function(x){return x.pItems.length>0;});
  // Always sort by marks (highest first)
  withTotals.sort(function(a,b){return b.total-a.total;});
  var sortBtns='<div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap">'
    +'<div style="position:relative;flex:1;min-width:140px">'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" style="margin-bottom:0;padding-right:36px" id="indv-det-search" placeholder="Search by name or team..." oninput="filterIndvDetailed(this.value)">'
    +'<button id="indv-det-clear" onclick="filterIndvDetailed(\'\');document.getElementById(\'indv-det-search\').value=\'\'" style="display:none;position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text3);font-size:1.1rem;cursor:pointer;padding:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
    +'</div>'
    +'<button class="btn btn-secondary btn-sm" onclick="printIndvDetailed(\''+sec+'\')">'+'<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></svg> Print</button>'
    +'</div>';
  var cards=withTotals.map(function(x){
    var p=x.p, pItems=x.pItems, total=x.total;
    var rows=pItems.map(function(item){
      var m=marks.find(function(mk){return mk.itemId===item.id&&mk.chestNo===p.chestNo;});
      var pts=m&&m.total>0?((m.point!=null)?m.point:calcIndvGradePoints(m.grade,cfg)):0;
      var hasM=m&&m.total>0;
      return '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)">'
        +'<div style="font-size:.82rem">'+item.name+'</div>'
        +'<div style="display:flex;gap:10px;align-items:center">'
        +(hasM?'<span style="font-size:.72rem;color:var(--text3)">'+m.grade+' &middot; '+Math.round(m.pct||0)+'%</span>':'')
        +'<span style="font-weight:800;color:var(--accent)">'+(pts>0?pts+' pts':'-')+'</span>'
        +'</div></div>';
    }).join('');
    if(!rows||total===0) return '';
    return '<div class="card indv-det-card" data-name="'+p.name.toLowerCase()+'" data-team="'+(p.team||'').toLowerCase()+'"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">'
      +'<div><div style="font-weight:700">'+p.name+'</div><div style="font-size:.72rem;color:var(--text3)">#'+p.chestNo+' &middot; '+p.team+'</div></div>'
      +'<div style="font-size:1.1rem;font-weight:900;color:var(--accent)">'+total+' pts</div></div>'+rows+'</div>';
  }).filter(Boolean).join('');
  return tabs+sortBtns+'<div id="indv-det-list">'+(cards||'<div style="text-align:center;padding:30px;color:var(--text3)">No individual points yet</div>')+'</div>';
}

function filterIndvDetailed(q){
  q=(q||'').toLowerCase().trim();
  var cb=document.getElementById('indv-det-clear');
  if(cb) cb.style.display=q?'':'none';
  var wrap=document.getElementById('indv-det-list');
  if(!wrap) return;
  var cards=Array.prototype.slice.call(wrap.querySelectorAll('.indv-det-card'));
  for(var i=0;i<cards.length;i++){
    var name=cards[i].getAttribute('data-name')||'';
    var team=cards[i].getAttribute('data-team')||'';
    cards[i].style.display=(!q||name.includes(q)||team.includes(q))?'':'none';
  }
}

// ── Winner List: shared filter definitions + data builder ──────────────
// One source of truth used by both the on-screen render and the PDF export,
// so the PDF always strictly matches whatever filter is active on screen.
var WL_FILTERS=[
  {value:'all',  label:'All Ranks'},
  {value:'1',    label:'1st Rank Only'},
  {value:'2',    label:'2nd Rank Only'},
  {value:'3',    label:'3rd Rank Only'},
  {value:'none', label:'No Position'}
];
function _wlFilterLabel(mode){
  var f=WL_FILTERS.find(function(x){return x.value===mode;});
  return f?f.label:'All Ranks';
}
// Builds the exact dataset for a given section + filter mode.
//  mode 'all'  → {mode:'all',  groups:[{item, rows:[{rank,name,team,point,grade}]}]}
//  mode '1'/'2'/'3' → {mode:'rank', rank:N, rows:[{name,section,event,team,point,grade}]}
//  mode 'none' → {mode:'none', rows:[{name,section}]}  (unique, no duplicates)
function _wlBuildData(sec, filterMode){
  var items=DB.items(),participants=DB.participants(),marks=DB.marks(),groups=DB.groups();
  var list=(sec==='All'?items:items.filter(function(i){return i.section===sec;}))
    .filter(function(i){return i.declared&&marks.some(function(m){return m.itemId===i.id&&m.total>0;});});

  function rankedMarksFor(item){
    var im=marks.filter(function(m){return m.itemId===item.id&&m.total>0;}).sort(function(a,b){return b.total-a.total;});
    applyDenseRank(im);
    im.forEach(function(m){ m._r=m._rank; });
    return im;
  }
  function nameTeamFor(item, chestNo){
    var grp=item.type==='group'?groups.find(function(g){return g.groupChestNo===chestNo&&_grpHasItem(g,item);}):null;
    var p=participants.find(function(pt){return pt.chestNo===chestNo;});
    return {
      name: grp?grp.name:(p?p.name:'#'+chestNo),
      team: grp?grp.team:(p?p.team:''),
      section: grp?grp.section:(p?p.section:item.section)
    };
  }

  if(filterMode==='1'||filterMode==='2'||filterMode==='3'){
    var rank=parseInt(filterMode,10);
    var rows=[];
    list.forEach(function(item){
      rankedMarksFor(item).filter(function(m){return m._r===rank;}).forEach(function(m){
        var nt=nameTeamFor(item,m.chestNo);
        rows.push({name:nt.name,section:item.section,event:item.name,team:nt.team,point:m.point||0,grade:m.grade});
      });
    });
    return {mode:'rank',rank:rank,rows:rows};
  }

  if(filterMode==='none'){
    var winnerChests={};
    list.forEach(function(item){
      rankedMarksFor(item).forEach(function(m){ if(m._r<=3) winnerChests[m.chestNo]=true; });
    });
    var seen={}, rows2=[];
    list.forEach(function(item){
      marks.filter(function(m){return m.itemId===item.id&&m.total>0;}).forEach(function(m){
        if(winnerChests[m.chestNo]||seen[m.chestNo]) return;
        seen[m.chestNo]=true;
        var nt=nameTeamFor(item,m.chestNo);
        rows2.push({name:nt.name,section:nt.section});
      });
    });
    rows2.sort(function(a,b){return a.name.localeCompare(b.name);});
    return {mode:'none',rows:rows2};
  }

  // default: 'all' — grouped by event, header + 1st/2nd/3rd
  var groupsOut=list.map(function(item){
    var show=rankedMarksFor(item).filter(function(m){return m._r<=3;});
    var rows=show.map(function(m){
      var nt=nameTeamFor(item,m.chestNo);
      var pRow = item.type!=='group' ? participants.find(function(pt){return pt.chestNo===m.chestNo;}) : null;
      return {rank:m._r,name:nt.name,team:nt.team,point:m.point||0,grade:m.grade,chestNo:m.chestNo,photo:pRow?(pRow.photo||null):null};
    });
    return {item:item,rows:rows};
  }).filter(function(g){return g.rows.length;});
  return {mode:'all',groups:groupsOut};
}

function renderWinnerList(data){
  data=data||{};
  var sections=DB.sections();
  var sec=data.section||'All', filterMode=data.filterMode||'all';
  var wd=_wlBuildData(sec, filterMode);

  var tabs='<div class="tabs"><div class="tab '+(sec==='All'?'active':'')+'" onclick="render(\'winnerList\',{section:\'All\',filterMode:\''+filterMode+'\'})">All</div>'
    +sections.map(function(s){return '<div class="tab '+(sec===s?'active':'')+'" onclick="render(\'winnerList\',{section:\''+s+'\',filterMode:\''+filterMode+'\'})">'+getSectionShortName(s)+'</div>';}).join('')+'</div>';

  // Stash current filter context on window so the Print button can call
  // printWinnerList() with the exact same section/filter without fragile
  // nested-quote string building.
  window._wlSec=sec; window._wlFilterMode=filterMode;

  var ddId='wl-filter';
  var ddItems=WL_FILTERS.map(function(f){return {value:f.value,label:f.label};});
  var onSel="render('winnerList',{section:window._wlSec,filterMode:$val})";
  var dd=_wzDropdown(ddId, ddItems, filterMode, {onSelect:onSel, wrapStyle:'min-width:172px', btnStyle:'background:var(--card2);border:1px solid var(--border);color:var(--text);font-size:.78rem;padding:7px 10px;border-radius:8px'});

  var toolbar='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:8px;flex-wrap:wrap">'
    +dd
    +'<button class="btn btn-secondary btn-sm" onclick="printWinnerList(window._wlSec,window._wlFilterMode)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></svg> Print</button></div>';

  var rankLabel={1:'1st',2:'2nd',3:'3rd'};
  var rankCol={1:'var(--gold)',2:'#c0c0c0',3:'#cd7f32'};
  var rankCls={1:'rank-1',2:'rank-2',3:'rank-3'};

  var body='';
  if(wd.mode==='all'){
    if(!wd.groups.length) body='<div style="text-align:center;padding:30px;color:var(--text3)">No declared results yet</div>';
    else body=wd.groups.map(function(g){
      var item=g.item;
      var rows=g.rows.map(function(m,idx){
        var col=rankCol[m.rank]||'var(--text)';
        return '<div style="display:flex;align-items:center;gap:10px;padding:6px 0'+(idx<g.rows.length-1?';border-bottom:1px solid rgba(255,215,0,.1)':'')+'">'
          +'<div class="rank-badge '+(rankCls[m.rank]||'rank-other')+'" style="width:28px;height:28px;font-size:.72rem">'+(rankLabel[m.rank]||m.rank+'th')+'</div>'
          +'<div style="flex:1"><div style="font-size:.88rem;font-weight:700;color:'+col+'">'+m.name+'</div>'
          +'<div style="font-size:.7rem;color:var(--text3)">'+m.team+'</div></div>'
          +'<div style="text-align:right"><div style="font-weight:800;color:'+col+'">'+m.point+' pts</div>'
          +'<div style="font-size:.68rem;color:var(--text3)">'+m.grade+'</div></div></div>';
      }).join('');
      return '<div class="winner-card"><div class="winner-item-title"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8.5" cy="10.5" r="5.5"/><circle cx="15.5" cy="13.5" r="5.5"/><path d="M7 9h.01"/><path d="M10 9h.01"/><path d="M14 13h.01"/><path d="M17 13h.01"/></svg> '+item.name+' <span style="font-size:.72rem;color:var(--text3)">('+item.section+')</span></div>'+rows+'</div>';
    }).join('');
  } else if(wd.mode==='rank'){
    if(!wd.rows.length) body='<div style="text-align:center;padding:30px;color:var(--text3)">No '+_wlFilterLabel(filterMode).toLowerCase()+' results yet</div>';
    else body='<div class="winner-card">'+wd.rows.map(function(r,idx){
      var col=rankCol[wd.rank]||'var(--text)';
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0'+(idx<wd.rows.length-1?';border-bottom:1px solid rgba(255,215,0,.1)':'')+'">'
        +'<div class="rank-badge '+(rankCls[wd.rank]||'rank-other')+'" style="width:28px;height:28px;font-size:.72rem;flex-shrink:0">'+(rankLabel[wd.rank]||wd.rank+'th')+'</div>'
        +'<div style="flex:1"><div style="font-size:.88rem;font-weight:700;color:'+col+'">'+r.name+'</div>'
        +'<div style="font-size:.7rem;color:var(--text3)">'+getSectionShortName(r.section)+' &middot; '+r.event+(r.team?' &middot; '+r.team:'')+'</div></div></div>';
    }).join('')+'</div>';
  } else { // 'none'
    if(!wd.rows.length) body='<div style="text-align:center;padding:30px;color:var(--text3)">No non-winners found</div>';
    else body='<div class="winner-card">'+wd.rows.map(function(r,idx){
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0'+(idx<wd.rows.length-1?';border-bottom:1px solid rgba(255,255,255,.06)':'')+'">'
        +'<div style="flex:1"><div style="font-size:.88rem;font-weight:700;color:var(--text)">'+r.name+'</div>'
        +'<div style="font-size:.7rem;color:var(--text3)">'+getSectionShortName(r.section)+'</div></div></div>';
    }).join('')+'</div>';
  }

  return tabs+toolbar+body;
}

function renderReports(){
  var ri=[
    ['Participants List','All students with chest numbers'],
    ['Code List Detailed','Full details with names & codes'],
    ['Schedule','Item timetable'],
    ['ID Cards','Print CR80 participant ID cards'],   // ← NEW
    ['Mark Sheet','Blank sheets for judges to score on paper'],
  ];
  var icons=['<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>','<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>','<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>','<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>','<svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h12l4 4v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M8 10h8"/><path d="M8 14h8"/><path d="M8 18h5"/></svg>'];   // ← Added printer icon
  var html='<div class="card" style="margin-bottom:14px">'
    +'<div class="card-title mb-10"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg> Print Reports</div>';
  for(var i=0;i<ri.length;i++){
    html+='<div class="list-item" onclick="repAction('+i+')" style="cursor:pointer">'
      +'<div class="list-avatar" style="background:var(--bg3);font-size:1.3rem">'+icons[i]+'</div>'
      +'<div class="list-info"><div class="list-title">'+ri[i][0]+'</div>'
      +'<div class="list-sub">'+ri[i][1]+'</div></div>'
      +'<span style="color:var(--text3)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></span></div>';
  }
  return html;
}

function repAction(i){
  if(i===0) printReport('participants');
  else if(i===1) navigate('codeDetailed');
  else if(i===2) navigate('schedule');
  else if(i===3) printIDCards();   // ← NEW
  else if(i===4) navigate('markSheet');
}
// =============================================
// ID CARD GENERATION — with Page Layout Picker
// =============================================

// Page layout definitions: per size, how many CR80 cards (85.6×54mm) fit
// with a small gap, accounting for browser/PDF margins
var ID_CARD_LAYOUTS = {
  'A4P': { label:'A4 Portrait',   size:'A4 portrait',   cols:2, rows:4, perPage:8,  w:'85.6mm', h:'54mm', gapC:'3mm', gapR:'4mm', marginHmm:10, marginVmm:10 },
  'A4L': { label:'A4 Landscape',  size:'A4 landscape',  cols:4, rows:2, perPage:8,  w:'85.6mm', h:'54mm', gapC:'3mm', gapR:'5mm', marginHmm:10, marginVmm:12 },
  'A5P': { label:'A5 Portrait',   size:'A5 portrait',   cols:1, rows:4, perPage:4,  w:'85.6mm', h:'54mm', gapC:'0',   gapR:'4mm', marginHmm:8,  marginVmm:8  },
  'A5L': { label:'A5 Landscape',  size:'A5 landscape',  cols:2, rows:2, perPage:4,  w:'85.6mm', h:'54mm', gapC:'3mm', gapR:'4mm', marginHmm:8,  marginVmm:8  },
  'LTR': { label:'Letter Portrait',size:'letter portrait',cols:2,rows:4, perPage:8,  w:'85.6mm', h:'54mm', gapC:'5mm', gapR:'4mm', marginHmm:12, marginVmm:10 },
};

function _pickIDLayout(btn){
  var k = btn && btn.getAttribute ? btn.getAttribute('data-lk') : btn;
  printIDCardsWithLayout(k);
}

function printIDCards(){
  var participants = DB.participants();
  var groups = DB.groups();
  var cfg = DB.config();
  if(isTeam()){
    var _t=currentTeamName();
    participants = participants.filter(function(p){return p.team===_t;});
    groups = groups.filter(function(g){return g.team===_t;});
  }

  if(!participants.length && !groups.length){
    toast('No participants or groups to print','error'); return;
  }

  var totalCount = participants.length + groups.length;

  // Show picker modal
  // Build picker buttons safely via DOM-string with layout key encoded
  var opts = Object.keys(ID_CARD_LAYOUTS).map(function(k){
    var L = ID_CARD_LAYOUTS[k];
    var pages = Math.ceil(totalCount / L.perPage);
    var safeK = k.replace(/[^A-Z0-9]/gi,'');
    return '<button class="btn btn-secondary" style="text-align:left;padding:12px 14px;display:flex;align-items:center;gap:12px;margin-bottom:8px" data-lk="'+safeK+'" onclick="_pickIDLayout(this)">'
      +'<div style="font-size:1.4rem"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></svg></div>'
      +'<div><div style="font-weight:700;font-size:.9rem">'+L.label+'</div>'
      +'<div style="font-size:.72rem;color:var(--text3)">'+L.cols+'×'+L.rows+' per page · '+L.perPage+'/page · '+pages+' page'+(pages!==1?'s':'')+'</div>'
      +'</div></button>';
  }).join('');

  showModal('<div>'
    +'<div class="modal-handle"></div>'
    +'<div style="font-size:1rem;font-weight:800;margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 17c.5-1.5 1.8-2.5 3-2.5s2.5 1 3 2.5"/><path d="M14 10h5"/><path d="M14 14h5"/></svg> Print ID Cards</div>'
    +'<div style="font-size:.75rem;color:var(--text3);margin-bottom:14px">'+totalCount+' card'+(totalCount!==1?'s':'')+' · CR80 format (85.6×54mm) · Choose page size:</div>'
    +opts
    +'<button class="btn btn-secondary" style="width:100%;margin-top:4px" onclick="closeModal()">Cancel</button>'
    +'</div>',{noDirtyGuard:true});
}

function printIDCardsWithLayout(layoutKey){
  _closeModalClean();
  var L = ID_CARD_LAYOUTS[layoutKey];
  if(!L) return;
  var participants = DB.participants();
  var groups = DB.groups();
  var items = DB.items();
  var cfg = DB.config();
  if(isTeam()){
    var _t=currentTeamName();
    participants = participants.filter(function(p){return p.team===_t;});
    groups = groups.filter(function(g){return g.team===_t;});
  }

  var festName  = cfg.festName || 'Winzera';
  var festYear  = cfg.year || '';
  var institution = cfg.institution || '';
  var venue = cfg.venue || '';
  var date  = formatFestDate(cfg);

  var logoHtml = cfg.logo
    ? '<img src="'+cfg.logo+'" class="card-logo">'
    : '<div class="card-logo" style="background:rgba(255,215,0,.15);border:0.3mm solid rgba(255,215,0,.4);display:flex;align-items:center;justify-content:center;font-size:7pt"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M5 4H3v2a4 4 0 0 0 4 4"/><path d="M19 4h2v2a4 4 0 0 1-4 4"/></svg></div>';

  function buildCard(bgGrad, chestBadge, avatarInner, name, team, sec, eventLabel, eventsStr, extraRows, footerStr){
    return '<div class="idc" style="background:'+bgGrad+'">'
      // shimmer overlay
      +'<div class="idc-shimmer"></div>'
      // header row
      +'<div class="idc-h">'
      +logoHtml
      +'<div class="idc-ht"><div class="idc-hf">'+festName+'</div>'
      +(institution?'<div class="idc-hi">'+institution+'</div>':'')
      +'</div>'
      +chestBadge
      +'</div>'
      // body
      +'<div class="idc-b">'
      +avatarInner
      +'<div class="idc-bi">'
      +'<div class="idc-bn">'+name+'</div>'
      +'<div class="idc-bt">'+team+'</div>'
      +'<div class="idc-bs">'+sec+'</div>'
      +'<div class="idc-bl">'+eventLabel+'</div>'
      +'<div class="idc-be">'+eventsStr+'</div>'
      +extraRows
      +'</div></div>'
      // footer
      +'<div class="idc-f">'+footerStr+'</div>'
      +'</div>';
  }

  function buildParticipantCard(p){
    var pItems = (p.items||[]).map(function(id){
      var it = items.find(function(x){return x.id===id;}); return it?it.name:'';
    }).filter(Boolean);
    var eventsStr = pItems.join(', ') || '—';
    var footer = venue||date ? (venue+(venue&&date?' · ':'')+date) : festName+' '+festYear;

    // Avatar: photo or initials
    var photoHtml;
    if(p.photo){
      photoHtml = '<img src="'+p.photo+'" class="idc-photo">';
    } else {
      var col = _AVATAR_COLORS[(parseInt(p.chestNo)||0)%_AVATAR_COLORS.length];
      var initials = _getInitials(p.name||'');
      photoHtml = '<div class="idc-photo idc-initials" style="background:'+col+'">'+initials+'</div>';
    }
    var chestBadge = '<div class="idc-hc">#'+p.chestNo+'</div>';
    return buildCard(
      'linear-gradient(150deg,#1a0d30 0%,#2d1060 100%)',
      chestBadge, photoHtml,
      p.name, p.team, p.section,
      'Events', eventsStr, '', footer
    );
  }

  function buildGroupCard(g){
    var gItems = (g.itemIds||(g.itemId?[g.itemId]:[])).map(function(id){
      var it=items.find(function(x){return x.id===id;}); return it?it.name:'';
    }).filter(Boolean);
    var eventsStr = gItems.join(', ')||'—';
    var membersList = g.members&&g.members.length
      ? g.members.map(function(m){return m.name;})
      : (g.captainChestNo ? (function(){
          var c=participants.find(function(p){return p.chestNo===g.captainChestNo;});
          return c?[c.name]:[];
        })() : []);
    var membersStr = membersList.join(', ')||'—';
    var footer = venue||date ? (venue+(venue&&date?' · ':'')+date) : festName+' '+festYear;
    var photoHtml = '<div class="idc-photo" style="background:rgba(74,158,255,.18);display:flex;align-items:center;justify-content:center;font-size:10pt;color:#4a9eff;font-weight:900;border:0.4mm solid rgba(74,158,255,.4)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>';
    var chestBadge = '<div class="idc-hc" style="background:linear-gradient(135deg,#4a9eff,#2a6ecc)">#'+g.groupChestNo+' <span style="font-size:4.5pt;opacity:.8">GRP</span></div>';
    var extra = '<div class="idc-bl" style="margin-top:0.8mm">Members</div><div class="idc-be">'+membersStr+'</div>';
    return buildCard(
      'linear-gradient(150deg,#0e1f38 0%,#1a2f5a 100%)',
      chestBadge, photoHtml,
      g.name, g.team, g.section,
      'Items', eventsStr, extra, footer
    );
  }

  // Build all card HTML strings
  var allCardHtmls = [];
  participants.forEach(function(p){ allCardHtmls.push(buildParticipantCard(p)); });
  groups.forEach(function(g){ allCardHtmls.push(buildGroupCard(g)); });

  // Chunk into pages based on layout
  var perPage = L.perPage;
  var pages = [];
  for(var i=0;i<allCardHtmls.length;i+=perPage){
    pages.push(allCardHtmls.slice(i,i+perPage));
  }

  // Generate page HTML — each page is a flex grid of exactly cols columns
  var pagesHtml = pages.map(function(pageCards, pi){
    // Fill remainder with invisible placeholders so grid stays aligned
    var filled = pageCards.slice();
    while(filled.length % L.cols !== 0) filled.push('<div class="idc idc-ghost"></div>');
    return '<div class="idc-page"'+(pi<pages.length-1?' style="page-break-after:always;break-after:page;"':'')+'>'+filled.join('')+'</div>';
  }).join('');

  // CSS — precise, uses exact mm measurements
  var css = ''
    +'*{box-sizing:border-box;margin:0;padding:0}'
    +'body{background:#f0eef8;font-family:"Segoe UI",Arial,sans-serif}'
    +'@page{size:'+L.size+';margin:'+L.marginVmm+'mm '+L.marginHmm+'mm}'
    +'.idc-page{'
    +'  display:grid;'
    +'  grid-template-columns:repeat('+L.cols+','+L.w+');'
    +'  grid-auto-rows:'+L.h+';'
    +'  gap:'+L.gapR+' '+L.gapC+';'
    +'  width:fit-content;'
    +'  margin:0 auto;'
    +'  page-break-inside:avoid;break-inside:avoid'
    +'}'
    +'.idc{'
    +'  width:'+L.w+';height:'+L.h+';'
    +'  border-radius:2.5mm;overflow:hidden;'
    +'  display:flex;flex-direction:column;'
    +'  position:relative;'
    +'  border:0.5mm solid rgba(255,215,0,0.35);'
    +'  page-break-inside:avoid;break-inside:avoid'
    +'}'
    +'.idc-ghost{border:none!important;background:transparent!important;visibility:hidden}'
    +'.idc-shimmer{'
    +'  position:absolute;inset:0;pointer-events:none;z-index:1;'
    +'  background-image:repeating-linear-gradient(45deg,rgba(255,215,0,.03) 0,rgba(255,215,0,.03) 2px,transparent 2px,transparent 8px)'
    +'}'
    // Header
    +'.idc-h{background:rgba(0,0,0,.4);border-bottom:0.3mm solid rgba(255,215,0,.25);padding:1.5mm 2mm;display:flex;align-items:center;gap:1.5mm;position:relative;z-index:2}'
    +'.card-logo{width:16px;height:16px;border-radius:50%;object-fit:cover;flex-shrink:0}'
    +'.idc-ht{flex:1;min-width:0}'
    +'.idc-hf{font-size:6.5pt;font-weight:800;color:#ffd700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    +'.idc-hi{font-size:4.8pt;color:rgba(255,255,255,.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    +'.idc-hc{background:linear-gradient(135deg,#f0a500,#e05c00);color:#000;font-size:7pt;font-weight:900;padding:0.8mm 2mm;border-radius:1.5mm;white-space:nowrap;flex-shrink:0;letter-spacing:0.2mm;z-index:2}'
    // Body
    +'.idc-b{flex:1;display:flex;gap:2mm;padding:1.8mm 2mm;align-items:flex-start;overflow:hidden;position:relative;z-index:2}'
    +'.idc-photo{width:16mm;height:16mm;border-radius:1.5mm;object-fit:cover;border:0.4mm solid rgba(255,215,0,.5);flex-shrink:0}'
    +'.idc-initials{display:flex;align-items:center;justify-content:center;font-size:12pt;font-weight:800;color:#fff;letter-spacing:.5px}'
    +'.idc-bi{flex:1;min-width:0;display:flex;flex-direction:column;gap:0.5mm}'
    +'.idc-bn{font-size:8.5pt;font-weight:800;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    +'.idc-bt{font-size:6.5pt;font-weight:700;color:#f0a500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    +'.idc-bs{font-size:5.5pt;color:rgba(200,185,255,.8);margin-bottom:0.8mm}'
    +'.idc-bl{font-size:4.8pt;color:rgba(160,140,200,.65);text-transform:uppercase;letter-spacing:.4mm;font-weight:700}'
    +'.idc-be{font-size:5.5pt;color:rgba(255,255,255,.85);line-height:1.45;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical}'
    // Footer
    +'.idc-f{background:rgba(0,0,0,.35);border-top:0.3mm solid rgba(255,255,255,.07);padding:0.8mm 2mm;font-size:4.8pt;color:rgba(255,255,255,.3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;position:relative;z-index:2}'
    // Screen preview helpers
    +'@media screen{'
    +'.idc-page{margin:8mm auto;background:#e0ddef;padding:'+L.marginVmm+'mm '+L.marginHmm+'mm;display:inline-grid}'
    +'body{padding:6mm;display:flex;flex-direction:column;align-items:center}'
    +'}'
    +'@media print{'
    +'.idc{border:0.4mm solid rgba(200,180,255,.4);outline:0.25mm dashed rgba(180,160,220,.3)}'
    +'.idc-page{background:transparent!important;padding:0!important}'
    +'}';

  var header = '<div style="font-family:Arial,sans-serif;margin-bottom:8mm;color:#333;display:none" class="screen-header">'
    +'<b><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 17c.5-1.5 1.8-2.5 3-2.5s2.5 1 3 2.5"/><path d="M14 10h5"/><path d="M14 14h5"/></svg> ID Cards</b> &nbsp;·&nbsp; '+allCardHtmls.length+' card'+(allCardHtmls.length!==1?'s':'')+' &nbsp;·&nbsp; '+L.label
    +' &nbsp;·&nbsp; '+L.perPage+'/page &nbsp;·&nbsp; '+pages.length+' page'+(pages.length!==1?'s':'')
    +'</div>';

  var screenHeaderCss = '@media screen{.screen-header{display:block!important}}';

  openPrint('<style>'+css+screenHeaderCss+'</style>'+header+pagesHtml);
}

function triggerImport(){
  // Try native file picker first; if unavailable (MIT WebView), show paste modal
  var inp=document.getElementById('importFile');
  if(inp && typeof inp.click==='function'){
    try { inp.click(); } catch(e){ showImportModal(); }
  } else { showImportModal(); }
}

function renderSchedule(){
  const cfg=DB.config();
  const items=DB.items();
  const withTime=items.filter(i=>i.time);
  const withoutTime=items.filter(i=>!i.time);
  const isMulti=cfg.durationMode==='multi';
  // Tier 1: group by date
  const byDate={}; const dateOrder=[];
  withTime.forEach(item=>{
    const d=_getItemDate(item,cfg)||'unscheduled';
    if(!byDate[d]){ byDate[d]=[]; dateOrder.push(d); }
    byDate[d].push(item);
  });
  dateOrder.sort((a,b)=>a<b?-1:a>b?1:0);
  const configuredStages=_getStages(cfg);
  let schedHtml='';
  dateOrder.forEach((dateKey,di)=>{
    const dayItems=byDate[dateKey];
    let header=dateKey==='unscheduled' ? 'Date Not Set' : _fmtScheduleDate(dateKey)+' ('+_dayNameFromISO(dateKey)+')';
    if(isMulti && dateKey!=='unscheduled') header='Day '+(di+1)+': '+header;
    schedHtml+=`<div class="card-title mt-16 mb-10">📅 ${header}</div>`;
    const byStage={}; const stageOrder=[];
    dayItems.forEach(item=>{
      const sid=_getItemStageId(item,cfg);
      if(!byStage[sid]){ byStage[sid]=[]; stageOrder.push(sid); }
      byStage[sid].push(item);
    });
    stageOrder.sort((a,b)=>{
      const ia=configuredStages.findIndex(s=>s.id===a), ib=configuredStages.findIndex(s=>s.id===b);
      return (ia<0?999:ia)-(ib<0?999:ib);
    });
    stageOrder.forEach(sid=>{
      const stageItems=byStage[sid].slice().sort((a,b)=>(a.time||'').localeCompare(b.time||''));
      if(stageOrder.length>1) schedHtml+=`<div style="font-size:.7rem;font-weight:800;color:var(--accent);letter-spacing:1px;margin:8px 0 4px">${_getStageName(sid,cfg)}</div>`;
      schedHtml+=stageItems.map(item=>`<div class="schedule-item"><div style="font-size:.72rem;color:var(--accent);font-weight:700">⏰ ${_fmtTime12h(item.time)}</div><div style="font-size:.9rem;font-weight:700;margin-top:2px">${item.name}</div><div style="font-size:.72rem;color:var(--text3)">${item.section}</div></div>`).join('');
    });
  });
  return `
  <div style="display:flex;justify-content:flex-end;margin-bottom:12px">
    <button class="btn btn-primary btn-sm" onclick="printReport('schedule')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></svg> Print</button>
  </div>
  ${withTime.length===0&&withoutTime.length===0?'<div style="text-align:center;padding:30px;color:var(--text3)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg> Add items with times</div>':''}
  ${schedHtml}
  ${withoutTime.length>0?'<div class="card-title mt-16 mb-10"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg> Unscheduled Events</div>':''}
  ${withoutTime.map(item=>`<div class="list-item"><div class="list-avatar" style="background:var(--bg3);font-size:.7rem;color:var(--text3)"><svg viewBox="0 0 24 24" style="width:1.1em;height:1.1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg></div><div class="list-info"><div class="list-title">${item.name}</div><div class="list-sub">${item.section}</div></div></div>`).join('')}`;
}

// =============================================
// CERTIFICATES
// =============================================
function _certCollectWinners(){
  const items=DB.items().filter(i=>i.declared), participants=DB.participants(), marks=DB.marks();
  const winners=[];
  items.forEach(item=>{
    marks.filter(m=>m.itemId===item.id&&m.total>0&&m.rank>=1&&m.rank<=3).sort((a,b)=>a.rank-b.rank).forEach(m=>{
      const p=participants.find(pt=>pt.chestNo===m.chestNo);
      if(p) winners.push({participant:p,item,rank:m.rank,marks:m});
    });
  });
  return winners;
}
function renderCertificates(){
  const winners=_certCollectWinners();
  window._certAllWinners=winners;
  const rankLabel=['','First','Second','Third'];
  const filter=window._certRankFilter||'all';
  const filtered = filter==='all' ? winners : winners.filter(w=>String(w.rank)===filter);
  const filterItems=[{value:'all',label:'All Ranks'}].concat([1,2,3].map(r=>({value:r,label:rankLabel[r]+' Place'})));
  const filterDD=_wzDropdown('certRankFilterDD',filterItems,filter,{wrapStyle:'flex:1',onSelect:"window._certRankFilter=$val;render('certificates')"});
  return `
  <div class="card" style="background:rgba(255,215,0,.05);border-color:rgba(255,215,0,.2);margin-bottom:12px">
    <div style="font-size:.82rem;color:var(--text2)">Certificates are generated for <b>declared</b> event winners. Declare results first.</div>
  </div>
  ${winners.length===0?'':`
  <div style="display:flex;gap:8px;margin-bottom:12px">
    ${filterDD}
    <button type="button" class="btn btn-primary btn-sm" onclick="exportAllCertificatesPDF()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></svg> Export PDF</button>
  </div>`}
  ${filtered.length===0?`<div style="text-align:center;padding:30px;color:var(--text3)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg> ${winners.length===0?'Declare results to generate certificates':'No certificates match this filter'}</div>`:
    filtered.map((w)=>{ const i=winners.indexOf(w); return `
    <div class="list-item" onclick="showCertificate(${i})" style="cursor:pointer">
      <div class="rank-badge rank-${w.rank<=3?w.rank:'other'}">${w.rank}</div>
      <div class="list-info"><div class="list-title">${w.participant.name}</div><div class="list-sub">${w.item.name} · ${w.item.section} · ${w.participant.team}</div></div>
      <span style="color:var(--text3)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></svg></span>
    </div>`;}).join('')}`;
}
function showCertificate(idx){
  const winners=window._certAllWinners||_certCollectWinners();
  const w=winners[idx]; if(!w) return;
  const cfg=DB.config();
  const _vd=_certDims(cfg,1200,849);
  const _orLabel=_certOrientation(cfg)==='portrait'?'A4 Portrait':'A4 Landscape';
  showModal(`<div class="modal-handle"></div><div class="modal-title">Certificate Preview</div>
  <div style="border-radius:10px;overflow:hidden;border:1px solid var(--border);margin-bottom:12px">
    <canvas id="certViewCanvas" width="${_vd.w}" height="${_vd.h}" style="width:100%;display:block;background:#000"></canvas>
  </div>
  <button class="btn btn-primary mt-10" onclick="printCertificate(${idx})"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></svg> Download PDF (${_orLabel})</button>
  <button class="btn btn-secondary mt-10" onclick="closeModal()">Close</button>`);
  setTimeout(function(){
    var canvas=document.getElementById('certViewCanvas'); if(!canvas) return;
    _certPrepare(cfg, function(){ _certDrawCanvas(canvas, w, cfg, window._certSigImgCache); });
  },0);
}
// Entry points from the UI — both open the design picker first (skipped
// automatically when no designs are saved) before actually generating the PDF.
function printCertificate(idx){
  _certOpenPresetPicker('single', idx);
}
function exportAllCertificatesPDF(){
  _certOpenPresetPicker('all', null);
}
function _certPrintSingle(idx){
  const winners=window._certAllWinners||_certCollectWinners();
  const w=winners[idx]; if(!w) return;
  const cfg=DB.config();
  if(!window.jspdf || !window.jspdf.jsPDF){ toast('PDF library not available','error'); return; }
  _certPrepare(cfg, function(){
    var orient=_certOrientation(cfg);
    var cd=_certDims(cfg,1754,1240), pd=_certDims(cfg,297,210);
    var canvas=document.createElement('canvas'); canvas.width=cd.w; canvas.height=cd.h;
    _certDrawCanvas(canvas, w, cfg, window._certSigImgCache);
    var jsPDF = window.jspdf.jsPDF;
    var doc=new jsPDF({unit:'mm', orientation:orient, format:'a4'});
    doc.addImage(canvas.toDataURL('image/jpeg',0.92), 'JPEG', 0, 0, pd.w, pd.h);
    doc.save('Certificate_'+w.participant.name.replace(/[^a-z0-9]+/gi,'_')+'.pdf');
  });
}
function _certExportAllPDF(){
  const winners=window._certAllWinners||_certCollectWinners();
  const filter=window._certRankFilter||'all';
  const list = filter==='all' ? winners : winners.filter(w=>String(w.rank)===filter);
  if(!list.length){ toast('No certificates to export','error'); return; }
  if(!window.jspdf || !window.jspdf.jsPDF){ toast('PDF library not available','error'); return; }
  const cfg=DB.config();
  _certPrepare(cfg, function(){
    var orient=_certOrientation(cfg);
    var cd=_certDims(cfg,1754,1240), pd=_certDims(cfg,297,210);
    var jsPDF = window.jspdf.jsPDF;
    var doc=new jsPDF({unit:'mm', orientation:orient, format:'a4'});
    var canvas=document.createElement('canvas'); canvas.width=cd.w; canvas.height=cd.h;
    list.forEach(function(w,i){
      _certDrawCanvas(canvas, w, cfg, window._certSigImgCache);
      if(i>0) doc.addPage('a4',orient);
      doc.addImage(canvas.toDataURL('image/jpeg',0.92), 'JPEG', 0, 0, pd.w, pd.h);
    });
    doc.save('Certificates_'+(cfg.festName||'Winzera').replace(/[^a-z0-9]+/gi,'_')+'.pdf');
    toast(list.length+' certificate(s) exported!');
  });
}

// =============================================
// PRINT FUNCTIONS
// =============================================
function printHeader(cfg){
  var logoHtml=cfg.logo
    ?'<img src="'+cfg.logo+'" style="width:38px;height:38px;flex-shrink:0;border-radius:50%;object-fit:cover;border:1.5px solid rgba(255,215,0,.5)">'
    :'<div style="width:38px;height:38px;flex-shrink:0;background:rgba(255,215,0,.12);border:1.5px solid rgba(255,215,0,.3);border-radius:50%;display:flex;align-items:center;justify-content:center">'
      +'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>'
      +'</div>';
  return '<div style="background:#1a0d30;color:#fff;border-radius:7px;padding:11px 13px;margin-bottom:14px;display:flex;align-items:center;gap:12px">'
    +logoHtml
    +'<div style="flex:1;min-width:0;overflow:hidden">'
    +'<div style="font-size:.95rem;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(cfg.festName||'Winzera')+'</div>'
    +(cfg.tagline?'<div style="font-size:.66rem;font-style:italic;color:rgba(255,215,0,.75);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+cfg.tagline+'</div>':'')
    +'<div style="font-size:.7rem;color:rgba(255,255,255,.6);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(cfg.institution||'')+'</div>'
    +((cfg.venue||formatFestDate(cfg))?'<div style="font-size:.62rem;color:rgba(255,255,255,.35);margin-top:1px">'+(cfg.venue||'')+(formatFestDate(cfg)?' · '+formatFestDate(cfg):'')+'</div>':'')
    +'</div></div>';
}
function getPrintSize(){ return localStorage.getItem('winzera_print_size')||'big'; }
function setPrintSize(v){
  localStorage.setItem('winzera_print_size', v);
  navigate(currentPage||'reports', {}, false);
}
// Central size tokens used by every print report — switches between the
// compact "Normal" layout (fewer pages) and the larger "Big" layout (easier to read).
function PSZ(){
  var big = getPrintSize()!=='normal';
  return big ? {
    htmlScreen:18, htmlPrint:17,
    h2:'1.3rem', h3:'1.12rem',
    table:'1.15rem', th:'1.05rem', thPad:'10px 12px', tdPad:'10px 12px',
    code:'1.55rem', codeSm:'1.45rem', itemName:'1.4rem', itemNameSm:'1.35rem',
    sectionLbl:'.92rem', countLbl:'.95rem', teamName:'1.35rem',
    judgeLbl:'1.05rem', judgeBorder:'3px', rowH:'38px', rowHSm:'34px',
    cutHere:'.78rem', markHead:'1.15rem', secBorder:'4px', cellPad:'8px 8px', hdrPad:'10px 8px',
    secBottomMargin:'11px', blockBottomMargin:'20px'
  } : {
    htmlScreen:13, htmlPrint:12,
    h2:'.85rem', h3:'.78rem',
    table:'.76rem', th:'.7rem', thPad:'5px 7px', tdPad:'4px 7px',
    code:'.9rem', codeSm:'.85rem', itemName:'.9rem', itemNameSm:'.85rem',
    sectionLbl:'.6rem', countLbl:'.64rem', teamName:'.92rem',
    judgeLbl:'.68rem', judgeBorder:'1px', rowH:'22px', rowHSm:'20px',
    cutHere:'.55rem', markHead:'.72rem', secBorder:'2px', cellPad:'3px 6px', hdrPad:'5px 6px',
    secBottomMargin:'6px', blockBottomMargin:'10px'
  };
}
function openPrint(html){
  var cfg=DB.config();
  var PS=PSZ();
  var prSvg='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>';
  var logoSvg='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>';

  var css=''
    +'@page{size:A4 portrait;margin:10mm}'
    +'*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}'
    +'html{font-size:'+PS.htmlScreen+'px}'
    +'body{font-family:Arial,Helvetica,"Segoe UI",sans-serif;margin:0;padding:0;color:#000;background:#d8d5e4;overflow-x:hidden}'
    +'h2{background:#1a0d30;color:#fff;padding:10px 13px;font-size:'+PS.h2+';border-radius:5px;margin:0 0 12px;font-weight:900}'
    +'h3{background:rgba(26,13,48,.08);color:#1a0d30;padding:8px 12px;font-size:'+PS.h3+';border-radius:4px;margin:12px 0 6px;font-weight:900}'
    /* Natural table — auto layout, columns size to content, text wraps in wide columns */
    +'table{width:100%;border-collapse:collapse;font-size:'+PS.table+'}'
    +'th{background:#1a0d30;color:#fff;padding:'+PS.thPad+';text-align:left;font-weight:900;font-size:'+PS.th+';white-space:nowrap}'
    +'td{padding:'+PS.tdPad+';border-bottom:1px solid #ddd;vertical-align:middle;word-break:break-word;font-weight:900;color:#000}'
    +'tr:nth-child(even) td{background:#f2f0fb}'
    +'tr:last-child td{border-bottom:none}'
    /* Short-value columns stay on one line */
    +'td.col-code,th.col-code{width:9%;white-space:nowrap}'
    +'td.col-chest,th.col-chest{width:14%;white-space:nowrap;text-align:center}'
    +'td.col-grade,th.col-grade{width:12%;white-space:nowrap}'
    +'td.col-pct,th.col-pct{width:10%;white-space:nowrap}'
    +'td.col-pts,th.col-pts{width:12%;white-space:nowrap}'
    +'td.col-sig,th.col-sig{width:18%;}'
    /* Name and team columns share remaining space and wrap */
    +'td.col-name,th.col-name{width:30%}'
    +'td.col-team,th.col-team{width:25%}'
    +'p{margin:4px 0;font-weight:900}'
    /* Toolbar */
    +'.ptbar{position:sticky;top:0;z-index:200;background:#1a0d30;display:flex;align-items:center;padding:0 11px;height:46px;gap:7px;box-shadow:0 2px 10px rgba(0,0,0,.4)}'
    +'.ptbar-ico{width:28px;height:28px;flex-shrink:0;background:rgba(255,215,0,.12);border:1.5px solid rgba(255,215,0,.32);border-radius:6px;display:flex;align-items:center;justify-content:center}'
    +'.ptbar-lbl{flex:1;min-width:0;overflow:hidden}'
    +'.ptbar-lbl em{display:block;font-style:normal;font-size:.58rem;color:rgba(255,255,255,.38);line-height:1.1}'
    +'.ptbar-lbl b{display:block;font-size:.76rem;color:#ffd700;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
    +'.ptbtn{display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border:none;border-radius:6px;font-weight:700;font-size:.76rem;cursor:pointer;flex-shrink:0;white-space:nowrap;font-family:inherit}'
    +'.ptbtn-p{background:#f0a500;color:#1a0d30}'
    +'.ptbtn-c{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.18)}'
    +'.pgwrap{padding:10px 0 20px}'
    +'.pgcard{background:#fff;width:100%;padding:12px 11px}'
    +'@media print{'
    +'.ptbar{display:none!important}'
    +'body{background:#fff!important}'
    +'.pgwrap{padding:0!important}'
    +'.pgcard{padding:0!important}'
    +'html{font-size:'+PS.htmlPrint+'px}'
    +'tr{page-break-inside:avoid}'
    +'}';

  var tbHtml=''
    +'<div class="ptbar">'
    +'<div class="ptbar-ico">'+logoSvg+'</div>'
    +'<div class="ptbar-lbl"><em>Winzera</em><b>'+(cfg.festName||'Winzera')+' '+(cfg.year||'')+'</b></div>'
    +'<button class="ptbtn ptbtn-p" onclick="window.print()">'+prSvg+' Print</button>'
    +'<button class="ptbtn ptbtn-c" onclick="window.close()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Close</button>'
    +'</div>';

  var fullHtml='<!DOCTYPE html><html><head><meta charset="utf-8">'
    +'<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">'
    +'<style>'+css+'</style>'
    +'</head><body>'
    +tbHtml
    +'<div class="pgwrap"><div class="pgcard">'+html+'</div></div>'
    +'</body></html>';

  try{
    var win=window.open('','_blank');
    if(win&&!win.closed){ win.document.write(fullHtml); win.document.close(); return; }
  }catch(e){}

  var prev=document.getElementById('print-overlay'); if(prev) prev.remove();
  var ov=document.createElement('div');
  ov.id='print-overlay';
  ov.style.cssText='position:fixed;inset:0;z-index:9999;overflow:auto;background:#d8d5e4;font-family:"Segoe UI",Arial,sans-serif;color:#111;font-size:12px';
  var st=document.createElement('style'); st.textContent=css; ov.appendChild(st);
  var bar=document.createElement('div'); bar.className='ptbar';
  bar.innerHTML='<div class="ptbar-ico">'+logoSvg+'</div>'
    +'<div class="ptbar-lbl"><em>Winzera</em><b>'+(cfg.festName||'Winzera')+' '+(cfg.year||'')+'</b></div>'
    +'<button class="ptbtn ptbtn-p" id="ov-pr">'+prSvg+' Print</button>'
    +'<button class="ptbtn ptbtn-c" id="ov-cl"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Close</button>';
  ov.appendChild(bar);
  var wrap=document.createElement('div'); wrap.className='pgwrap';
  var card=document.createElement('div'); card.className='pgcard'; card.innerHTML=html;
  wrap.appendChild(card); ov.appendChild(wrap);
  document.body.appendChild(ov);
  document.getElementById('ov-cl').onclick=function(){ ov.remove(); };
  document.getElementById('ov-pr').onclick=function(){ ov.style.display='none'; window.print(); setTimeout(function(){ ov.style.display=''; },400); };
}

function printReport(type){
  var cfg=DB.config(),participants=DB.participants(),items=DB.items(),marks=DB.marks(),groups=DB.groups();
  var PS=PSZ();
  var html=printHeader(cfg);
  if(type==='participants'){
    var teams=DB.teams();
    var ptFirst=true;
    teams.forEach(function(team){
      var tp=participants.filter(function(p){return p.team===team.name;}).sort(function(a,b){
        var secA=a.section||'', secB=b.section||'';
        if(secA!==secB) return secA.localeCompare(secB);
        return (parseInt(a.chestNo)||0)-(parseInt(b.chestNo)||0);
      });
      var tgCount=groups.filter(function(g){return g.team===team.name;}).length;
      var tg=groups.filter(function(g){return g.team===team.name;}).sort(function(a,b){
        var secA=a.section||'', secB=b.section||'';
        if(secA!==secB) return secA.localeCompare(secB);
        return (parseInt(a.groupChestNo)||0)-(parseInt(b.groupChestNo)||0);
      });
      if(!tp.length && !tgCount) return;
      // Each team always starts on its own page
      html+='<div style="'+(ptFirst?'':'page-break-before:always;')+'padding-top:2px">';
      ptFirst=false;
      html+='<div style="display:flex;align-items:center;gap:12px;padding-bottom:10px;border-bottom:'+PS.secBorder+' solid #8a4b00;margin-bottom:14px">'
        // Team initials badge: solid team-color circle + white text, not a
        // colored-text-on-light-tint-of-itself combo — that older approach
        // had virtually no contrast between the letters and their own
        // background (worse still in B&W, where both converted to nearly
        // the same gray and the initials vanished entirely).
        +'<div style="width:38px;height:38px;border-radius:50%;background:' + (function(t){
  var colors = ['#f0a500','#00c896','#4a9eff','#ff4757','#9b59b6','#e74c3c','#27ae60','#2980b9'];
  var idx = DB.teams().findIndex(function(tt){return tt.name===t.name;});
  return colors[idx % colors.length];
})(team) + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:.9rem;font-weight:900;flex-shrink:0;letter-spacing:-.5px">' + (team.shortName||team.name||'?').replace(/[^A-Za-z0-9]/g,'').slice(0,2).toUpperCase() + '</div>'
        +'<div><div style="font-size:'+PS.teamName+';font-weight:900;color:#1a0d30">'+team.name+'</div>'
        +'<div style="font-size:'+PS.countLbl+';font-weight:900;color:#222">'+tp.length+' participant'+(tp.length!==1?'s':'')+(tgCount?', '+tgCount+' group'+(tgCount!==1?'s':''):'')+'</div></div>'
        +'</div>';
      if(tp.length){
        html+='<table style="width:100%;border-collapse:collapse;font-size:'+PS.table+'">'
        +'<thead><tr style="background:#1a0d30;color:#fff">'
        +'<th style="padding:'+PS.hdrPad+';width:48px;text-align:center;white-space:nowrap">#</th>'
        +'<th style="padding:'+PS.hdrPad+';width:95px;text-align:center">Chest No</th>'
        +'<th style="padding:'+PS.hdrPad+'">Name</th>'
        +'<th style="padding:'+PS.hdrPad+';width:110px">Section</th>'
        +'<th style="padding:'+PS.hdrPad+'">Events</th>'
        +'</tr></thead><tbody>'
        +tp.map(function(p,i){
          var pItems=(p.items||[]).map(function(id){var it=items.find(function(x){return x.id===id;});return it?it.name:'';}).filter(Boolean).join(', ');
          return '<tr style="background:'+(i%2===0?'#fff':'#f7f4ff')+'">'
            +'<td style="padding:'+PS.cellPad+';text-align:center;font-weight:900;color:#333;white-space:nowrap">'+(i+1)+'</td>'
            +'<td style="padding:'+PS.cellPad+';text-align:center;font-weight:900;color:#000">#'+p.chestNo+'</td>'
            +'<td style="padding:'+PS.cellPad+';font-weight:900;color:#000">'+p.name+'</td>'
            +'<td style="padding:'+PS.cellPad+';font-size:'+PS.countLbl+';font-weight:900;color:#222">'+p.section+'</td>'
            +'<td style="padding:'+PS.cellPad+';font-size:'+PS.countLbl+';font-weight:900;color:#222">'+pItems+'</td>'
            +'</tr>';
        }).join('')+'</tbody></table>'
        +'<div style="text-align:right;font-size:'+PS.countLbl+';font-weight:900;color:#333;margin-top:6px">'+tp.length+' total</div>';
      }
      // Groups for this team, listed after all its individuals — same layout
      // (Chest No / Name / Section / Events), sorted by section then chest number.
      if(tg.length){
        html+='<div style="margin-top:16px;font-size:'+PS.teamName+';font-weight:900;color:#1a0d30">Groups</div>'
          +'<table style="width:100%;border-collapse:collapse;font-size:'+PS.table+';margin-top:6px">'
          +'<thead><tr style="background:#1a0d30;color:#fff">'
          +'<th style="padding:'+PS.hdrPad+';width:48px;text-align:center;white-space:nowrap">#</th>'
          +'<th style="padding:'+PS.hdrPad+';width:95px;text-align:center">Chest No</th>'
          +'<th style="padding:'+PS.hdrPad+'">Name</th>'
          +'<th style="padding:'+PS.hdrPad+';width:110px">Section</th>'
          +'<th style="padding:'+PS.hdrPad+'">Events</th>'
          +'</tr></thead><tbody>'
          +tg.map(function(g,i){
            var gIds=(g.itemIds&&g.itemIds.length)?g.itemIds:(g.itemId!=null?[g.itemId]:[]);
            var gItems=gIds.map(function(id){var it=items.find(function(x){return x.id===id;});return it?it.name:'';}).filter(Boolean).join(', ');
            return '<tr style="background:'+(i%2===0?'#fff':'#f7f4ff')+'">'
              +'<td style="padding:'+PS.cellPad+';text-align:center;font-weight:900;color:#333;white-space:nowrap">'+(i+1)+'</td>'
              +'<td style="padding:'+PS.cellPad+';text-align:center;font-weight:900;color:#000">#'+g.groupChestNo+'</td>'
              +'<td style="padding:'+PS.cellPad+';font-weight:900;color:#000">'+g.name+'</td>'
              +'<td style="padding:'+PS.cellPad+';font-size:'+PS.countLbl+';font-weight:900;color:#222">'+g.section+'</td>'
              +'<td style="padding:'+PS.cellPad+';font-size:'+PS.countLbl+';font-weight:900;color:#222">'+gItems+'</td>'
              +'</tr>';
          }).join('')+'</tbody></table>'
          +'<div style="text-align:right;font-size:'+PS.countLbl+';font-weight:900;color:#333;margin-top:6px">'+tg.length+' total</div>';
      }
      html+='</div>';
    });
  } else if(type==='codelist'){
    // Show all items that have any participants registered
    var clItems=items.filter(function(item){
      return item.type==='group'
        ?groups.some(function(g){return _grpHasItem(g,item);})
        :participants.some(function(p){return (p.items||[]).includes(item.id);});
    });
    var clFirst=true;
    clItems.forEach(function(item){
      var itemP=item.type==='group'
        ?groups.filter(function(g){return _grpHasItem(g,item);}).map(function(g){return {chestNo:g.groupChestNo,name:g.name,team:g.team,section:g.section};})
        :participants.filter(function(p){return (p.items||[]).includes(item.id);});
      var im=marks.filter(function(m){return m.itemId===item.id;});
      // Exclude absent ('?'), sort real codes first then blank
      var rows=itemP.filter(function(p){
        var me=im.find(function(m){return m.chestNo===p.chestNo;});
        return !(me&&me.codeLetter==='?');
      }).map(function(p){
        var me=im.find(function(m){return m.chestNo===p.chestNo;});
        var code=me&&me.codeLetter&&me.codeLetter!=='?'?me.codeLetter:''; // blank if not yet assigned
        var pName=item.type==='group'?p.name:(participants.find(function(pt){return pt.chestNo===p.chestNo;})||{}).name||'';
        var pTeam=item.type==='group'?p.team:(participants.find(function(pt){return pt.chestNo===p.chestNo;})||{}).team||'';
        return {code:code,name:pName,chestNo:p.chestNo,team:pTeam};
      }).sort(function(a,b){
        if(a.code&&!b.code) return -1; if(!a.code&&b.code) return 1;
        return a.code.localeCompare(b.code);
      });
      if(!rows.length) return;
      html+='<div style="'+(clFirst?'':'page-break-before:always;')+'padding-top:2px">';
      clFirst=false;
      html+='<div style="padding-bottom:11px;border-bottom:'+PS.secBorder+' solid #8a4b00;margin-bottom:'+PS.secBottomMargin+'">'
        +'<div style="font-size:'+PS.sectionLbl+';font-weight:900;letter-spacing:1.5px;color:#8a4b00;margin-bottom:2px">'+item.section+'</div>'
        +'<div style="font-size:'+PS.itemNameSm+';font-weight:900;color:#1a0d30">'+item.name+'</div>'
        +'<div style="font-size:'+PS.countLbl+';font-weight:900;color:#222;margin-top:2px">'+rows.length+' participant'+(rows.length!==1?'s':'')+(item.code?' &middot; Item code: <b>'+item.code+'</b>':'')+'</div>'
        +'</div>'
        +'<table style="width:100%;border-collapse:collapse;font-size:'+PS.table+'">'
        +'<thead><tr style="background:#1a0d30;color:#fff">'
        +'<th style="padding:'+PS.hdrPad+';width:80px">Code</th>'
        +'<th style="padding:'+PS.hdrPad+'">Name</th>'
        +'<th style="padding:'+PS.hdrPad+';width:105px;text-align:center">Chest No</th>'
        +'<th style="padding:'+PS.hdrPad+'">Team</th>'
        +'<th style="padding:'+PS.hdrPad+';width:130px;text-align:center">Signature</th>'
        +'</tr></thead><tbody>'
        +rows.map(function(r,ri){
          return '<tr style="background:'+(ri%2===0?'#fff':'#f7f4ff')+';height:'+PS.rowH+'">'
            +'<td style="padding:'+PS.cellPad+';font-size:'+PS.code+';font-weight:900;color:#000">'+r.code+'</td>'
            +'<td style="padding:'+PS.cellPad+';font-weight:900;color:#000">'+r.name+'</td>'
            +'<td style="padding:'+PS.cellPad+';text-align:center;font-weight:900;color:#222">#'+r.chestNo+'</td>'
            +'<td style="padding:'+PS.cellPad+';font-size:'+PS.countLbl+';font-weight:900;color:#222">'+r.team+'</td>'
            +'<td style="padding:'+PS.cellPad+';border-bottom:1px solid #ddd">&nbsp;</td>'
            +'</tr>';
        }).join('')+'</tbody></table></div>';
    });
  } else if(type==='results'){
    html+='<h2><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M5 4H3v2a4 4 0 0 0 4 4"/><path d="M19 4h2v2a4 4 0 0 1-4 4"/></svg> Results</h2>';
    DB.sections().forEach(function(section){
      var si=items.filter(function(i){return i.section===section&&marks.some(function(m){return m.itemId===i.id&&m.total>0;});});
      if(!si.length) return;
      html+='<h3 style="background:#1a0d30;color:#ffd700;padding:6px 12px;margin-top:16px;border-radius:6px">'+section+'</h3>';
      si.forEach(function(item){
        var im=marks.filter(function(m){return m.itemId===item.id&&m.total>0;}).sort(function(a,b){return b.total-a.total;});
        applyDenseRank(im);
        html+='<p style="font-weight:700;margin-top:10px">'+item.name+(item.declared?' <svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>':'')+'</p>'
          +'<table><tr><th>Rank</th><th>Name</th><th>Team</th><th>Points</th><th>Grade</th></tr>'
          +im.filter(function(m){return m._rank<=3;}).map(function(m){
            var grp=item.type==='group'?groups.find(function(g){return g.groupChestNo===m.chestNo&&_grpHasItem(g,item);}):null;
            var p=participants.find(function(pt){return pt.chestNo===m.chestNo;});
            return '<tr><td>'+m._rank+'</td><td>'+(grp?grp.name:(p?p.name:'?'))+'</td><td>'+(grp?grp.team:(p?p.team:'?'))+'</td><td>'+(m.point||0)+'</td><td>'+m.grade+'</td></tr>';
          }).join('')+'</table>';
      });
    });
  } else if(type==='schedule'){
    var schCfg=cfg;
    var schItems=items.slice();
    var withTime=schItems.filter(function(i){return i.time;});
    var withoutTime=schItems.filter(function(i){return !i.time;});
    html+='<h2><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg> Event Schedule</h2>';
    if(!withTime.length && !withoutTime.length){
      html+='<p style="padding:20px;text-align:center;color:#666">No items added yet.</p>';
    }
    if(withTime.length){
      var isMulti=schCfg.durationMode==='multi';
      // Tier 1: group by date
      var byDate={}, dateOrder=[];
      withTime.forEach(function(item){
        var d=_getItemDate(item,schCfg)||'unscheduled';
        if(!byDate[d]){ byDate[d]=[]; dateOrder.push(d); }
        byDate[d].push(item);
      });
      dateOrder.sort(function(a,b){ return a<b?-1:a>b?1:0; });
      dateOrder.forEach(function(dateKey,di){
        var dayItems=byDate[dateKey];
        var header=dateKey==='unscheduled' ? 'Date Not Set' : _fmtScheduleDate(dateKey)+' ('+_dayNameFromISO(dateKey)+')';
        if(isMulti && dateKey!=='unscheduled') header='Day '+(di+1)+': '+header;
        html+='<div style="'+(di>0?'page-break-before:always;':'')+'page-break-inside:avoid">'
          +'<h3 style="background:#1a0d30;color:#ffd700;padding:8px 12px;margin-top:'+(di===0?'0':'16px')+';border-radius:6px;font-size:'+PS.h3+'">'+header+'</h3>';
        // Tier 2: sub-group by stage
        var byStage={}, stageOrder=[];
        dayItems.forEach(function(item){
          var sid=_getItemStageId(item,schCfg);
          if(!byStage[sid]){ byStage[sid]=[]; stageOrder.push(sid); }
          byStage[sid].push(item);
        });
        // keep stages in the order they're configured
        var configuredStages=_getStages(schCfg);
        stageOrder.sort(function(a,b){
          var ia=configuredStages.findIndex(function(s){return s.id===a;});
          var ib=configuredStages.findIndex(function(s){return s.id===b;});
          return (ia<0?999:ia)-(ib<0?999:ib);
        });
        stageOrder.forEach(function(sid){
          var stageItems=byStage[sid].slice().sort(function(a,b){ return (a.time||'').localeCompare(b.time||''); });
          html+='<div style="page-break-inside:avoid;margin-bottom:10px">'
            +(stageOrder.length>1?'<div style="display:inline-block;background:linear-gradient(135deg,#f0a500,#ffd700);color:#1a0d30;font-weight:900;padding:4px 14px;border-radius:20px;font-size:'+PS.sectionLbl+';letter-spacing:1px;margin:8px 0 6px;box-shadow:0 2px 6px rgba(240,165,0,.35)">'+_getStageName(sid,schCfg)+'</div>':'')
            +'<table style="width:100%;border-collapse:collapse;font-size:'+PS.table+'">'
            +'<thead><tr style="background:#1a0d30;color:#fff">'
            +'<th style="padding:'+PS.hdrPad+';width:100px">Time</th>'
            +'<th style="padding:'+PS.hdrPad+';width:130px">Section</th>'
            +'<th style="padding:'+PS.hdrPad+'">Event</th>'
            +'</tr></thead><tbody>'
            +stageItems.map(function(item,i){
              return '<tr style="background:'+(i%2===0?'#fff':'#f7f4ff')+'">'
                +'<td style="padding:'+PS.cellPad+';font-weight:900;color:#000;white-space:nowrap">'+_fmtTime12h(item.time)+'</td>'
                +'<td style="padding:'+PS.cellPad+';font-size:'+PS.countLbl+';font-weight:900;color:#222">'+item.section+'</td>'
                +'<td style="padding:'+PS.cellPad+';font-weight:900;color:#000">'+item.name+'</td>'
                +'</tr>';
            }).join('')+'</tbody></table></div>';
        });
        html+='</div>';
      });
    }
    if(withoutTime.length){
      html+='<h3 style="background:#1a0d30;color:#ffd700;padding:6px 12px;margin-top:16px;border-radius:6px">Unscheduled Events</h3>'
        +'<table style="width:100%;border-collapse:collapse;font-size:'+PS.table+'">'
        +'<thead><tr style="background:#1a0d30;color:#fff">'
        +'<th style="padding:'+PS.hdrPad+';width:130px">Section</th>'
        +'<th style="padding:'+PS.hdrPad+'">Event</th>'
        +'</tr></thead><tbody>'
        +withoutTime.map(function(item,i){
          return '<tr style="background:'+(i%2===0?'#fff':'#f7f4ff')+'">'
            +'<td style="padding:'+PS.cellPad+';font-size:'+PS.countLbl+';font-weight:900;color:#222">'+item.section+'</td>'
            +'<td style="padding:'+PS.cellPad+';font-weight:900;color:#000">'+item.name+'</td>'
            +'</tr>';
        }).join('')+'</tbody></table>';
    }
  }
  openPrint(html);
}

function printTeamPoints(){
  const cfg=DB.config(), tp=calcTeamPoints(), sorted=Object.entries(tp).sort((a,b)=>b[1].total-a[1].total);
  let html=printHeader(cfg)+`<h2><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg> Team Points - Overall Standings</h2><table><tr><th>Rank</th><th>Team</th><th>1st</th><th>2nd</th><th>3rd</th><th>A+</th><th>Total</th></tr>
  ${sorted.map(([name,pts],i)=>`<tr><td>${i+1}</td><td><b>${name}</b></td><td>${pts.r1}</td><td>${pts.r2}</td><td>${pts.r3}</td><td>${pts.aplus}</td><td><b>${pts.total}</b>${pts.bonus?`<div style="font-size:.7em;font-weight:600;color:#333">(incl. ${pts.bonus} bonus)</div>`:''}</td></tr>`).join('')}</table>`;
  openPrint(html);
}
function printSectionPoints(section){
  const cfg=DB.config(), tp=calcTeamPoints();
  const data=Object.entries(tp).map(([name,pts])=>({name,pts:pts.sections[section]||{total:0,r1:0,r2:0,r3:0}})).sort((a,b)=>b.pts.total-a.pts.total);
  let html=printHeader(cfg)+`<h2><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h6l2 3h8a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/></svg> ${section} - Section Points</h2><table><tr><th>Rank</th><th>Team</th><th>1st</th><th>2nd</th><th>3rd</th><th>Total</th></tr>
  ${data.map((d,i)=>`<tr><td>${i+1}</td><td><b>${d.name}</b></td><td>${d.pts.r1}</td><td>${d.pts.r2}</td><td>${d.pts.r3}</td><td><b>${d.pts.total}</b></td></tr>`).join('')}</table>`;
  openPrint(html);
}
function printIndvPoints(section, tab){
  tab=tab||'overall';
  var cfg=DB.config(),participants=DB.participants(),marks=DB.marks(),items=DB.items();
  var declaredItems=items.filter(function(i){return i.declared;});
  var filtered=section==='All'?participants:participants.filter(function(p){return p.section===section;});
  var ptKey=tab==='stage'?'stage':tab==='offstage'?'offStage':'total';
  var label=tab==='stage'?'On-Stage Champion':tab==='offstage'?'Off-Stage Champion':'Overall Individual Points';
  // Uses the exact same calcIndvPoints the on-screen page uses (same total,
  // same rank counts) so the printout always matches what's on screen instead
  // of recomputing a different A+/A/B+/B/C grade breakdown that doesn't
  // correspond to the 1st/2nd/3rd columns the person is looking at.
  // Include every participant in the filtered section, not just point-scorers
  // — someone with 0 wins should still show up in the list (with 0s across
  // the row) instead of silently vanishing. Previously this filtered out
  // anyone with pts[ptKey]===0, which is why participants with no 1st/2nd/3rd
  // were missing entirely from the printed sheet.
  var data=filtered.map(function(p){return {p:p,pts:calcIndvPoints(p,declaredItems,marks,cfg)};})
    .sort(function(a,b){return (b.pts[ptKey]-a.pts[ptKey]) || a.p.name.localeCompare(b.p.name);});
  var html=printHeader(DB.config())+'<h2><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> '+label+(section!=='All'?' - '+section:'')+'</h2>'
    +'<table><tr><th>Rank</th><th>Name</th><th>Group</th><th>Team</th><th>1st</th><th>2nd</th><th>3rd</th><th>Total</th></tr>'
    +data.map(function(x,i){return '<tr><td>'+(i+1)+'</td><td>'+x.p.name+' <span style="color:#666;font-size:.85em">#'+x.p.chestNo+'</span></td><td>'+x.p.section+'</td><td>'+x.p.team+'</td><td>'+x.pts.r1+'</td><td>'+x.pts.r2+'</td><td>'+x.pts.r3+'</td><td><b>'+x.pts[ptKey]+'</b></td></tr>';}).join('')
    +'</table>';
  openPrint(html);
}

function printIndvDetailed(section){
  var cfg=DB.config(),participants=DB.participants(),marks=DB.marks(),items=DB.items();
  var decl=items.filter(function(i){return i.declared&&i.type!=='group';});
  var filtered=section==='All'?participants:participants.filter(function(p){return p.section===section;});
  var html=printHeader(cfg)+'<h2><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h12l4 4v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M8 10h8"/><path d="M8 14h8"/><path d="M8 18h5"/></svg> Individual Detailed'+(section!=='All'?' - '+section:'')+'</h2>';
  filtered.forEach(function(p){
    var pItems=decl.filter(function(item){return (p.items||[]).includes(item.id);});
    if(!pItems.length) return;
    var total=0;
    var rows=pItems.map(function(item){
      var m=marks.find(function(mk){return mk.itemId===item.id&&mk.chestNo===p.chestNo;});
      var pts=m&&m.total>0?((m.point!=null)?m.point:calcIndvGradePoints(m.grade,cfg)):0; if(_itemCountsIndiv(item)) total+=pts;
      return {item:item,m:m,pts:pts};
    });
    if(rows.every(function(r){return !r.m||r.m.total===0;})) return;
    html+='<p style="font-weight:700;margin-top:14px">'+p.name+' #'+p.chestNo+' &middot; '+p.team+'</p>'
      +'<table><tr><th class="col-name">Item</th><th class="col-grade">Grade</th><th class="col-pct">%</th><th class="col-pts">Points</th></tr>'
      +rows.map(function(r){return '<tr><td>'+r.item.name+'</td><td>'+(r.m?r.m.grade:'-')+'</td><td>'+(r.m?Math.round(r.m.pct||0)+'%':'-')+'</td><td>'+(r.pts||'-')+'</td></tr>';}).join('')
      +'<tr style="font-weight:800"><td colspan="3">Total</td><td>'+total+'</td></tr></table>';
  });
  openPrint(html);
}

function printWinnerList(section, filterMode){
  filterMode=filterMode||'all';
  var cfg=DB.config();
  var wd=_wlBuildData(section, filterMode);
  var title='Winner List'+(section!=='All'?' - '+section:'')+' ('+_wlFilterLabel(filterMode)+')';
  var html=printHeader(cfg)+'<h2><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="15" r="6"/><path d="M12 12l1.5 3-1.5 1-1.5-1Z"/><path d="M8.5 9 6 3"/><path d="M15.5 9 18 3"/></svg> '+title+'</h2>';
  var rankLabel={1:'1st',2:'2nd',3:'3rd'};

  if(wd.mode==='all'){
    wd.groups.forEach(function(g){
      var item=g.item;
      html+='<p style="font-weight:800;margin-top:14px">'+item.name+' <span style="color:#333">('+item.section+')</span></p>'
        +'<table><tr><th style="width:10%">Rank</th><th class="col-name">Name</th><th class="col-team">Team</th><th class="col-pts">Points</th><th class="col-grade">Grade</th></tr>'
        +g.rows.map(function(m){
          return '<tr><td>'+(rankLabel[m.rank]||m.rank+'th')+'</td><td class="col-name">'+m.name+'</td><td class="col-team">'+m.team+'</td><td class="col-pts">'+m.point+'</td><td class="col-grade">'+m.grade+'</td></tr>';
        }).join('')+'</table>';
    });
  } else if(wd.mode==='rank'){
    html+='<table><tr><th class="col-name">Name</th><th class="col-team">Section</th><th class="col-team">Event</th><th class="col-team">Team</th></tr>'
      +wd.rows.map(function(r){
        return '<tr><td class="col-name">'+r.name+'</td><td class="col-team">'+r.section+'</td><td class="col-team">'+r.event+'</td><td class="col-team">'+r.team+'</td></tr>';
      }).join('')+'</table>';
  } else { // 'none'
    html+='<table><tr><th class="col-name">Name</th><th class="col-team">Section</th></tr>'
      +wd.rows.map(function(r){
        return '<tr><td class="col-name">'+r.name+'</td><td class="col-team">'+r.section+'</td></tr>';
      }).join('')+'</table>';
  }
  openPrint(html);
}

function printCodeDetailed(){
  const cfg=DB.config(), items=DB.items(), participants=DB.participants(), marks=DB.marks(), groups=DB.groups();
  var PS=PSZ();
  // All items with any participants (individual or group)
  const codeItems=items.filter(item=>
    item.type==='group'
      ? groups.some(g=>_grpHasItem(g,item))
      : participants.some(p=>(p.items||[]).includes(item.id))
  );

  // Build row data for every item first
  const itemBlocks=[];
  codeItems.forEach(item=>{
    const itemP=item.type==='group'
      ? groups.filter(g=>_grpHasItem(g,item)).map(g=>({chestNo:g.groupChestNo,name:g.name,team:g.team,section:g.section}))
      : participants.filter(p=>(p.items||[]).includes(item.id));
    const itemMarks=marks.filter(m=>m.itemId===item.id);
    const rows=itemP
      .filter(p=>{ const me=itemMarks.find(m=>m.chestNo===p.chestNo); return !(me&&me.codeLetter==='?'); })
      .map(p=>{ const me=itemMarks.find(m=>m.chestNo===p.chestNo); return {p, code:me&&me.codeLetter&&me.codeLetter!=='?'?me.codeLetter:''}; })
      .sort((a,b)=>{ if(a.code&&!b.code)return -1; if(!a.code&&b.code)return 1; return a.code.localeCompare(b.code); });
    if(!rows.length) return;
    itemBlocks.push({item, rows});
  });

  // ── Height estimation (mm at 96dpi, 10mm margins, 11px base font) ──────────
  // A4 usable: 277mm total - 20mm margins = 257mm ≈ 972px
  // Page 1: subtract printHeader (navy badge ~40px + 10px gap) → ~922px
  // Item header (section label + title + count + gold separator + table header): ~58px
  // Each data row: ~30px (height:32px with border-collapse)
  // Cut-line: ~20px
  // Gap between items on same page: ~14px (cut-line acts as visual gap)
  var PX_PAGE    = 972;   // usable px per non-first page
  var PX_PAGE_P1 = 900;   // usable px for first page (header takes ~72px)
  var PX_HEADER  = 58;    // item title block + table th row
  var PX_ROW     = 30;    // per participant row
  var PX_CUTLINE = 22;    // cut-line height between items on same page

  function blockPx(block){ return PX_HEADER + block.rows.length * PX_ROW; }

  // ── Bin-packing with look-ahead fill ────────────────────────────────────
  // Process items in order. When an item doesn't fit on the current page,
  // scan remaining items to find the tallest one that DOES fit (gap fill).
  // This maximises page utilisation without splitting any item.
  var remaining = itemBlocks.slice(); // working copy
  var pages = [];

  while(remaining.length > 0){
    var pageItems = [];
    var pageH = pages.length === 0 ? PX_PAGE_P1 : PX_PAGE;
    var used = 0;

    // Always take the first remaining item (preserves natural order as anchor)
    var first = remaining.shift();
    pageItems.push(first);
    used += blockPx(first);

    // Keep filling with next items that fit; if one doesn't fit, look ahead
    // for a shorter item that does (gap-fill). The skipped large item stays
    // at the front of remaining for the next page.
    var i = 0;
    while(i < remaining.length){
      var gap = used + PX_CUTLINE; // space consumed so far + cut-line for next item
      var needed = blockPx(remaining[i]);
      if(gap + needed <= pageH){
        // Fits in order — take it
        pageItems.push(remaining[i]);
        used = gap + needed;
        remaining.splice(i, 1);
        // Don't advance i — check same position again (new item slid into place)
      } else {
        // Doesn't fit — scan ahead for a shorter item that fills the gap
        var filled = false;
        for(var j = i+1; j < remaining.length; j++){
          if(gap + blockPx(remaining[j]) <= pageH){
            pageItems.push(remaining[j]);
            used = gap + blockPx(remaining[j]);
            remaining.splice(j, 1);
            filled = true;
            break;
          }
        }
        if(!filled) break; // nothing fits the remaining gap — close the page
        // After a gap-fill, try the original position again
      }
    }

    pages.push(pageItems);
  }

  // ── Render one item block ───────────────────────────────────────────────
  // Each item is a natural-height div (NO fixed height, NO overflow:hidden)
  // so the browser never generates phantom overflow pages.
  // Cut-line is a normal flow element between items (not absolute-positioned).
  function renderItemBlock(block){
    var item=block.item, rows=block.rows;
    return '<div style="page-break-inside:avoid;break-inside:avoid">'
      + '<div style="padding-bottom:7px;border-bottom:'+PS.secBorder+' solid #8a4b00;margin-bottom:'+PS.secBottomMargin+'">'
      + '<div style="font-size:calc('+PS.sectionLbl+' + .15rem);font-weight:900;letter-spacing:1.5px;color:#8a4b00;margin-bottom:2px">'+item.section+'</div>'
      + '<div style="font-size:'+PS.itemNameSm+';font-weight:900;color:#1a0d30">'+item.name+'</div>'
      + '<div style="font-size:'+PS.countLbl+';font-weight:900;color:#222;margin-top:2px">'+rows.length+' participant'+(rows.length!==1?'s':'')+(item.code?' &middot; Item code: <b>'+item.code+'</b>':'')+'</div>'
      + '</div>'
      + '<table style="width:100%;border-collapse:collapse;font-size:'+PS.table+';">'
      + '<thead><tr style="background:#1a0d30;color:#fff">'
      + '<th style="padding:'+PS.hdrPad+';width:8%">Code</th>'
      + '<th style="padding:'+PS.hdrPad+';width:12%;text-align:center">Chest No.</th>'
      + '<th style="padding:'+PS.hdrPad+';width:38%">Name</th>'
      + '<th style="padding:'+PS.hdrPad+';width:20%">Team</th>'
      + '<th style="padding:'+PS.hdrPad+';width:22%;text-align:center">Signature</th>'
      + '</tr></thead>'
      + '<tbody>'+rows.map(function(r,ri){
          var p=r.p, code=r.code;
          return '<tr style="background:'+(ri%2===0?'#fff':'#f5f3ff')+'">'
            +'<td style="padding:'+PS.cellPad+';font-size:'+PS.codeSm+';font-weight:900;color:#000;height:'+PS.rowH+'">'+code+'</td>'
            +'<td style="padding:'+PS.cellPad+';text-align:center;font-weight:900;color:#222">#'+p.chestNo+_openSecSuffix(item,p.section)+'</td>'
            +'<td style="padding:'+PS.cellPad+';font-weight:900;color:#000">'+p.name+'</td>'
            +'<td style="padding:'+PS.cellPad+';font-size:'+PS.countLbl+';font-weight:900;color:#222">'+p.team+'</td>'
            +'<td style="padding:'+PS.cellPad+';border-bottom:1px solid #ddd">&nbsp;</td>'
            +'</tr>';
        }).join('')
      + '</tbody></table>'
      + '</div>';
  }

  function renderCutLine(){
    return '<div style="margin:12px 0;display:flex;align-items:center;gap:8px;">'
      +'<div style="flex:1;border-top:1.5px dashed #ccc"></div>'
      +'<div style="font-size:'+PS.cutHere+';font-weight:800;color:#777;letter-spacing:1.2px;white-space:nowrap;padding:0 6px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.1 8.1 20 20"/><path d="M8.1 15.9 20 4"/></svg>&nbsp;CUT HERE</div>'
      +'<div style="flex:1;border-top:1.5px dashed #ccc"></div>'
      +'</div>';
  }

  // ── Build HTML ──────────────────────────────────────────────────────────
  // Each page is a simple div with page-break-before (no height/min-height).
  // Items flow naturally; cut-lines between them are normal-flow elements.
  // No overflow:hidden anywhere → zero blank pages.
  var html=printHeader(cfg);
  pages.forEach(function(pageBlocks, pi){
    var pageStyle=(pi>0?'page-break-before:always;break-before:page;':'')+'padding-top:4px;';
    html+='<div style="'+pageStyle+'">';
    pageBlocks.forEach(function(block, bi){
      html+=renderItemBlock(block);
      if(bi < pageBlocks.length-1) html+=renderCutLine();
    });
    html+='</div>';
  });

  openPrint(html);
}

// =============================================
// CONTACT US
// =============================================
// =============================================
// TEAM MANAGER HOME (Team Manager's landing page)
// =============================================
// =============================================
// TEAM MANAGER PORTAL — 4-tab structure (Participants / Assign Item / Reports / Data)
// Tab 1 "Participants" reuses the existing (team-scoped) participants page directly.
// =============================================
function renderTeamHome(){
  var team=currentTeamName();
  var pCount=DB.participants().filter(function(p){return p.team===team;}).length
            + DB.groups().filter(function(g){return g.team===team;}).length;
  var svgAssign=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`;
  var svgReports=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`;
  var svgData=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`;
  var svgParticipants=`<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  var cfg=DB.config();
  return `
  <div class="dash-hero">
    <div class="fest-name">${team||'My Team'}</div>
    <div class="stats-row">
      <div class="stat-box"><div class="num">${pCount}</div><div class="lbl">Total Participants</div></div>
      <div class="stat-box"><div class="num">${cfg.maxStageEvents||3}</div><div class="lbl">On-Stage Limit</div></div>
      <div class="stat-box"><div class="num">${cfg.maxOffStageEvents||5}</div><div class="lbl">Off-Stage Limit</div></div>
    </div>
  </div>
  <div class="menu-grid">
    <div class="menu-card" onclick="navigate('participants')">
      <div class="mc-icon">${svgParticipants}</div>
      <div class="mc-title">Participants</div><div class="mc-sub">Manage your roster</div>
    </div>
    <div class="menu-card" onclick="navigate('teamAssign')">
      <div class="mc-icon">${svgAssign}</div>
      <div class="mc-title">Assign Item</div><div class="mc-sub">Enter participants into items</div>
    </div>
    <div class="menu-card" onclick="navigate('teamReports')">
      <div class="mc-icon">${svgReports}</div>
      <div class="mc-title">Reports</div><div class="mc-sub">Print &amp; ID cards</div>
    </div>
    <div class="menu-card" onclick="navigate('teamData')">
      <div class="mc-icon">${svgData}</div>
      <div class="mc-title">Data</div><div class="mc-sub">Sync with Admin</div>
    </div>
  </div>
  `;
}

function renderTeamAssign(){
  var team=currentTeamName();
  return '<div style="font-size:.78rem;color:var(--text3);margin-bottom:14px">Choose how you\u2019d like to assign items to '+team+'\u2019s participants.</div>'
   +'<div style="display:flex;flex-direction:column;gap:10px">'
   +'<div onclick="showAssignByItem()" style="cursor:pointer;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px">'
     +'<div style="font-size:.9rem;font-weight:700;margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg> By Item</div>'
     +'<div style="font-size:.78rem;color:var(--text3)">Pick one Item, then tick every participant entering it. Best when one item has many entrants.</div></div>'
   +'<div onclick="showAssignGrid()" style="cursor:pointer;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px">'
     +'<div style="font-size:.9rem;font-weight:700;margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg> Grid View</div>'
     +'<div style="font-size:.78rem;color:var(--text3)">Pick a Section, see everyone x every item in a table, tick any cell. Best on a bigger screen.</div></div>'
   +'<div onclick="showAssignGroupsGrid()" style="cursor:pointer;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px">'
     +'<div style="font-size:.9rem;font-weight:700;margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Groups Grid</div>'
     +'<div style="font-size:.78rem;color:var(--text3)">For Group Items only &mdash; Groups (like "Salim &amp; Party") x Group Items in a table, tick any cell.</div></div>'
   +'</div>';
}
function renderTeamReports(){
  var team=currentTeamName();
  var count=DB.participants().filter(function(p){return p.team===team;}).length + DB.groups().filter(function(g){return g.team===team;}).length;
  return '<div style="font-size:.78rem;color:var(--text3);margin-bottom:14px">Reports for '+team+' &middot; '+count+' entrant'+(count!==1?'s':'')+'</div>'
   +'<button class="btn btn-primary" style="width:100%;margin-bottom:10px" onclick="printIDCards()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 17c.5-1.5 1.8-2.5 3-2.5s2.5 1 3 2.5"/><path d="M14 10h5"/><path d="M14 14h5"/></svg> Generate / Print ID Cards</button>'
   +'<button class="btn btn-secondary" style="width:100%;margin-bottom:10px" onclick="exportParticipantsPDF()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/></svg> Download / Print Participant List (PDF)</button>';
}
function renderTeamData(){
  var team=currentTeamName();
  return '<div style="font-size:.78rem;color:var(--text3);margin-bottom:22px">Everything you add for '+team+' saves straight to the server as you go \u2014 there\u2019s nothing to send or sync manually.</div>'
   +'<div style="font-size:.72rem;font-weight:800;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Account</div>'
   +'<button class="btn btn-danger" style="width:100%" onclick="signOut()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Sign Out</button>';
}

function renderContactUs(){
  return '<div class="card" style="background:linear-gradient(135deg,rgba(0,200,150,.08),rgba(74,158,255,.08));border-color:rgba(0,200,150,.3);text-align:center;padding:24px">'
    +'<div style="margin-bottom:12px">'
+'<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0 auto">'
+'<circle cx="36" cy="36" r="34" fill="url(#devGrad)" stroke="var(--accent)" stroke-width="2"/>'
+'<path d="M28 32L22 36L28 40" stroke="#1a0d30" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
+'<path d="M44 32L50 36L44 40" stroke="#1a0d30" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
+'<path d="M38 28L34 44" stroke="#1a0d30" stroke-width="2.5" stroke-linecap="round"/>'
+'<defs>'
+'<linearGradient id="devGrad" x1="0" y1="0" x2="72" y2="72" gradientUnits="userSpaceOnUse">'
+'<stop stop-color="var(--accent)"/>'
+'<stop offset="1" stop-color="var(--accent2)"/>'
+'</linearGradient>'
+'</defs>'
+'</svg>'
+'</div>'
    +'<div style="font-size:1.15rem;font-weight:900;color:var(--gold)" class="contact-dev-name">Mubashir Rabbani Omanoor</div>'
    +'<div style="font-size:.82rem;color:var(--text2);margin-top:4px">Developer &amp; Designer &middot; Winzera App</div>'
    +'</div>'

    +'</div>'

	+'<div style="margin-bottom:12px">'
	+'<button class="btn btn-secondary" style="width:100%" onclick="showChangelog(false)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg> What\'s New</button>'
	+'</div>'
    +'<div class="card" style="border-color:rgba(240,165,0,.3);background:rgba(240,165,0,.04)">'
    +'<div class="card-header"><div class="card-title"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2"/><path d="M10 2v2"/><path d="M14 2v2"/></svg> Buy Me a Coffee</div></div>'
    +'<div style="font-size:.82rem;color:var(--text2);margin-bottom:14px">If this app helped your event run smoothly, a small coffee would mean a lot! <svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg></div>'
    +'<a href="upi://pay?pa=mubashirakomr1@oksbi&pn=Mubashir+Rabbani&tn=Winzera+App&cu=INR" style="text-decoration:none;display:block;margin-bottom:8px">'
    +'<button class="btn btn-warning" style="width:100%;font-size:.88rem"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2"/><path d="M10 2v2"/><path d="M14 2v2"/></svg> Pay via UPI / Google Pay</button></a>'
    +'<div style="text-align:center;background:var(--bg3);border-radius:10px;padding:12px">'
    +'<div style="font-size:.72rem;color:var(--text3);margin-bottom:4px">UPI ID</div>'
    +'<div style="font-size:1rem;font-weight:800;color:var(--accent);letter-spacing:.5px">mubashirakomr1@oksbi</div>'
    +'<div style="font-size:.72rem;color:var(--text3);margin-top:2px">Phone: +91 9747415247</div>'
    +'<div style="font-size:.72rem;color:var(--text3);margin-top:2px">Mubashir Rabbani &middot; Google Pay / PhonePe / Any UPI</div>'
    +'</div></div>'

    +'<div class="card" style="border-color:rgba(0,200,150,.25);background:linear-gradient(135deg,rgba(0,200,150,.06),rgba(74,158,255,.04));text-align:center">'
    +'<div style="font-size:1.6rem;margin-bottom:8px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z"/></svg></div>'
    +'<div style="font-size:.92rem;font-weight:800;color:var(--text);margin-bottom:6px">Remember Me in Your Dua</div>'
    +'<div style="font-size:.8rem;color:var(--text2);line-height:1.6">If this app made your event easier, a small prayer for me, my family, and all Muslims would mean more than anything else. JazakAllahu Khayran <svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg></div>'
    +'</div>'

    +'<div class="card">'
    +'<div class="card-header"><div class="card-title"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2Z"/></svg> Suggest an Update or Report a Bug</div></div>'
    +'<div style="font-size:.8rem;color:var(--text3);margin-bottom:12px">Your feedback helps make Winzera better for everyone. Please share ideas, issues, or anything you\'d like improved.</div>'
    +'<div class="form-group"><label class="form-label">Your Name</label>'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="fb-name" placeholder="Your name"></div>'
    +'<div class="form-group"><label class="form-label">Type</label>'
    +_wzDropdown('fb-type',[
      {value:'suggestion',label:'Feature Suggestion'},
      {value:'bug',label:'Bug Report'},
      {value:'improvement',label:'Improvement'},
      {value:'other',label:'Other'}
    ],'suggestion',{})+'</div>'
    +'<div class="form-group"><label class="form-label">Message</label>'
    +'<textarea autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="fb-msg" rows="4" placeholder="Describe your idea, bug or suggestion..." style="resize:vertical;min-height:90px"></textarea></div>'
    +'<button class="btn btn-success" style="width:100%" onclick="sendFeedback(event)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg> Send via WhatsApp</button>'
    +'</div>'
    +'</div>';
}

function sendFeedback(e){
  e.preventDefault();
  var name=document.getElementById('fb-name').value.trim()||'Anonymous';
  var type=document.getElementById('fb-type').value||'suggestion';
  var msg=(document.getElementById('fb-msg').value||'').trim();
  if(!msg) return toast('Please enter your message','error');
  var typeLabels={suggestion:'Feature Suggestion',bug:'Bug Report',improvement:'Improvement',other:'Message'};
  var text='*Winzera App Feedback*\n*From:* '+name+'\n*Type:* '+(typeLabels[type]||type)+'\n\n'+msg;
  window.open('https://wa.me/919747415247?text='+encodeURIComponent(text),'_blank');
}

function checkForAppUpdate(){
  showModal('<div class="modal-handle"></div><div class="modal-title"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Check for Updates</div>'
    +'<div style="background:rgba(240,165,0,.1);border:1px solid rgba(240,165,0,.3);border-radius:10px;padding:14px;margin-bottom:16px">'
    +'<div style="font-size:.85rem;font-weight:700;color:var(--accent);margin-bottom:6px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h6"/></svg> Backup Reminder</div>'
    +'<div style="font-size:.8rem;color:var(--text2)">Please export a backup of your data before updating to avoid any data loss.</div>'
    +'</div>'
    +'<button class="btn btn-orange" style="width:100%;margin-bottom:10px" onclick="exportData()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h6"/></svg> Export Backup First</button>'
    +'<button class="btn btn-primary" style="width:100%;margin-bottom:10px" onclick="_doCheckUpdate()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Check Now &amp; Update</button>'
    +'<button class="btn btn-secondary" style="width:100%" onclick="closeModal()">Cancel</button>');
}
function _doCheckUpdate(){
  closeModal();
  if(!('serviceWorker' in navigator)){toast('Service worker not supported','error');return;}
  navigator.serviceWorker.ready.then(function(reg){
    reg.update().then(function(){
      if(reg.waiting){
        _showUpdateBanner(reg.waiting);
        toast('Update ready! Tap Update in the banner.');
        // 👇 Show changelog after update is ready
        showChangelog(true);
      } else {
        toast('You are on the latest version <svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>');
        // 👇 Show changelog anyway if user manually checked
        showChangelog(false);
      }
    }).catch(function(){ toast('Update check failed','error'); });
  });
}

function _applyImportData(data){
  if(!data||typeof data!=='object'){toast('Invalid data','error');return;}
  if(data.config) DB.saveConfig(data.config);
  if(data.teams) DB.saveTeams(data.teams);
  if(data.sections) DB.saveSections(data.sections);
  if(data.items) DB.saveItems(data.items);
  if(data.participants) DB.saveParticipants(data.participants);
  if(data.marks) DB.saveMarks(data.marks);
  if(data.groups) DB.saveGroups(data.groups);
  if(data.bonuses) DB.saveBonuses(data.bonuses);
  var withPhotos=(data.participants||[]).filter(function(p){return !!p.photo;}).length;
  toast('Imported!'+(withPhotos?' · '+withPhotos+' photo'+(withPhotos>1?'s':''):''));
  _closeModalClean();
  // Bypass setup dirty check — import always goes straight to dashboard
  _doNavigate('dashboard',{},false);
}

function _doImport(){
  var txt=(document.getElementById('_impTxt').value||'').trim();
  if(!txt){toast('Paste your backup text first','error');return;}
  try{
    // Try direct JSON parse first
    var data=JSON.parse(txt);
    _confirmImportData(data); return;
  }catch(e){}
  try{
    // Try base64 decode (from WhatsApp/copy method)
    // Strip any "Winzera BACKUP..." header line
    var lines=txt.split('\n');
    var b64=lines[lines.length-1].trim();
    if(b64.length<10) b64=lines.filter(function(l){return l.trim().length>50;}).join('');
    var decoded=decodeURIComponent(escape(atob(b64)));
    var data=JSON.parse(decoded);
    _confirmImportData(data); return;
  }catch(e){}
  toast('Could not read backup. Make sure you pasted the full text.','error');
}


function _importFromFile(event){
  var file=event.target.files[0]; if(!file) return;
  var reader=new FileReader();
  reader.onload=function(e){
    try{
      var data=JSON.parse(e.target.result);
      _confirmImportData(data, file.name);
    }catch(err){
      // Try putting in textarea for manual paste fallback
      var ta=document.getElementById('_impTxt');
      if(ta) ta.value=e.target.result.substring(0,50000); // truncate for display safety
      toast('File loaded — tap Restore to import');
    }
  };
  reader.readAsText(file);
}


function showImportModal(){
  var parts=DB.participants();
  var withPhotos=parts.filter(function(p){return !!p.photo;}).length;
  showModal('<div>'
    +'<div class="modal-handle"></div>'
    +'<div style="font-size:1rem;font-weight:800;margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg> Import Backup</div>'
    +'<div style="font-size:.75rem;color:var(--text3);margin-bottom:8px">Restores all data including participant photos.</div>'
    +'<div style="background:rgba(74,158,255,.08);border:1px solid rgba(74,158,255,.25);border-radius:8px;padding:8px 12px;font-size:.72rem;color:var(--text2);margin-bottom:10px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5"/><path d="M12 8h.01"/></svg> Backups include embedded participant photos as JPEG thumbnails. Larger files are normal if photos are present.</div>'
    +'<div style="display:flex;gap:8px;margin-bottom:10px">'
    +'<label style="flex:1;cursor:pointer"><input type="file" accept=".json,.txt" style="display:none" onchange="_importFromFile(event)">'
    +'<div class="btn btn-secondary" style="width:100%;text-align:center"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h6l2 3h8a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/></svg> Choose File</div></label>'
    +'</div>'
    +'<textarea autocomplete="off" data-lpignore="true" data-1p-ignore="true" id="_impTxt" style="width:100%;height:120px;background:var(--bg3);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:8px;font-size:.72rem;font-family:monospace;resize:none" placeholder="Paste backup JSON here..."></textarea>'
    +'<button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="_doImport()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg> Restore Data</button>'
    +'<button class="btn btn-secondary" style="width:100%;margin-top:8px" onclick="closeModal()">Cancel</button>'
    +'</div>');
}

function exportData(){
  var defaultName='Winzera_backup_'+new Date().toISOString().split('T')[0];
  showModal('<div class="modal-handle"></div>'
    +'<div class="modal-title"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h6"/></svg> Export Backup</div>'
    +'<div class="form-group"><label class="form-label">File Name</label>'
    +'<div style="display:flex;align-items:center;gap:8px">'
    +'<input autocomplete="off" data-lpignore="true" data-1p-ignore="true" class="form-input" id="exp-filename" value="'+defaultName+'" style="flex:1" autofocus>'
    +'<span style="color:var(--text3);font-size:.82rem;font-weight:600">.json</span>'
    +'</div><div style="font-size:.7rem;color:var(--text3);margin-top:6px">Leave as-is or rename it — this is the file that will be saved to your device.</div></div>'
    +'<button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="_doExportWithName()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Download</button>'
    +'<button class="btn btn-secondary" style="width:100%;margin-top:8px" onclick="closeModal()">Cancel</button>',
    {noDirtyGuard:true}
  );
}
function _sanitizeFileName(name){
  name=(name||'').trim().replace(/[\/\\:*?"<>|]/g,'').replace(/\s+/g,'_');
  return name||('Winzera_backup_'+new Date().toISOString().split('T')[0]);
}
function _doExportWithName(){
  var name=_sanitizeFileName(document.getElementById('exp-filename').value);
  var parts=DB.participants();
  var withPhotos=parts.filter(function(p){return !!p.photo;}).length;
  var data={config:DB.config(),teams:DB.teams(),sections:DB.sections(),items:DB.items(),
    participants:parts,marks:DB.marks(),groups:DB.groups(),bonuses:DB.bonuses(),
    exportDate:new Date().toISOString(),_v:'1.6.0'};
  var json=JSON.stringify(data);
  var sizeKB=Math.round(json.length/1024);
  var blob=new Blob([json],{type:'application/json'});
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name+'.json';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  _closeModalClean();
  toast('Backup exported! ('+sizeKB+'KB'+(withPhotos?' · '+withPhotos+' photos':'')+')');
}

function shareBackupFile(){
  var parts=DB.participants();
  var withPhotos=parts.filter(function(p){return !!p.photo;}).length;
  var data={config:DB.config(),teams:DB.teams(),sections:DB.sections(),items:DB.items(),
    participants:parts,marks:DB.marks(),groups:DB.groups(),bonuses:DB.bonuses(),
    exportDate:new Date().toISOString(),_v:'1.6.0'};
  var blob=new Blob([JSON.stringify(data)],{type:'application/json'});
  var name='Winzera_backup_'+new Date().toISOString().split('T')[0];
  // .txt has wider canShare support on Android Chrome than .json
  var txtFile=new File([blob],name+'.txt',{type:'text/plain'});
  var jsonFile=new File([blob],name+'.json',{type:'application/json'});
  if(!navigator.share){
    var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name+'.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast('Share not supported — file downloaded');
    return;
  }
  var file=(navigator.canShare&&navigator.canShare({files:[txtFile]}))?txtFile:
           (navigator.canShare&&navigator.canShare({files:[jsonFile]}))?jsonFile:null;
  if(!file){
    var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name+'.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast('File sharing unavailable — downloaded instead');
    return;
  }
  navigator.share({files:[file],title:'Winzera Backup',text:'Winzera backup'+(withPhotos?' (includes '+withPhotos+' participant photos)':'')+'. Rename to .json to restore.'})
    .then(function(){toast('Backup shared!');})
    .catch(function(e){
      if(e.name!=='AbortError'){
        var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name+'.json';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        toast('Share failed — downloaded instead');
      }
    });
}

function importData(event){
  // Legacy file input path (desktop browsers)
  if(event&&event.target&&event.target.files&&event.target.files[0]){
    var file=event.target.files[0];
    var reader=new FileReader();
    reader.onload=function(e){
      try{
        var data=JSON.parse(e.target.result);
        _confirmImportData(data, file.name);
      }catch(err){toast('Invalid file','error');}
    };
    reader.readAsText(file);
    event.target.value=''; // allow re-selecting the same file next time
  }
}
function _confirmImportData(data, fileName){
  if(!data||typeof data!=='object'){ toast('Invalid backup file','error'); return; }
  window._pendingImportData=data;
  var c={
    participants:(data.participants||[]).length,
    items:(data.items||[]).length,
    teams:(data.teams||[]).length,
    sections:(data.sections||[]).length,
    marks:(data.marks||[]).length,
    groups:(data.groups||[]).length,
    bonuses:(data.bonuses||[]).length
  };
  showModal('<div class="modal-handle"></div>'
    +'<div class="modal-title" style="color:var(--red)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg> Confirm Import</div>'
    +'<div style="background:rgba(240,80,80,.1);border:1px solid rgba(240,80,80,.3);border-radius:10px;padding:12px 14px;margin-bottom:14px">'
    +'<div style="font-weight:800;font-size:.88rem;color:var(--red);margin-bottom:6px">This will replace ALL your current data</div>'
    +'<div style="font-size:.8rem;color:var(--text2)">Importing '+(fileName?'"'+fileName+'"':'this backup')+' will permanently overwrite everything currently in the app — participants, items, marks, teams, sections, and groups. This cannot be undone.</div>'
    +'</div>'
    +'<div style="font-size:.78rem;color:var(--text3);margin-bottom:14px">This backup contains: <b>'+c.participants+'</b> participants, <b>'+c.items+'</b> items, <b>'+c.teams+'</b> teams, <b>'+c.sections+'</b> sections, <b>'+c.groups+'</b> groups, <b>'+c.marks+'</b> marks, <b>'+c.bonuses+'</b> bonus entries.</div>'
    +'<button class="btn btn-danger" style="width:100%;margin-bottom:8px" onclick="_confirmedImport()">Yes, Overwrite &amp; Import</button>'
    +'<button class="btn btn-secondary" style="width:100%" onclick="window._pendingImportData=null;closeModal()">Cancel</button>',
    {noDirtyGuard:true}
  );
}
function _confirmedImport(){
  var data=window._pendingImportData;
  window._pendingImportData=null;
  if(!data) return;
  _applyImportData(data);
}

function v(id){ const el=document.getElementById(id); return el?el.value:''; }
// Toggles a password field between hidden/visible, swapping the eye icon in place.
function _togglePwVisibility(inputId, btnEl){
  var el=document.getElementById(inputId);
  if(!el) return;
  var showing=el.type==='text';
  el.type=showing?'password':'text';
  btnEl.innerHTML=showing
    ? '<svg viewBox="0 0 24 24" style="width:1.1em;height:1.1em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>'
    : '<svg viewBox="0 0 24 24" style="width:1.1em;height:1.1em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.9 4.24A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a17.7 17.7 0 0 1-2.6 3.8M6.6 6.6C3.7 8.5 2 11.7 2 11.7s3.5 7 10 7a10.4 10.4 0 0 0 4.2-.86"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="M2 2l20 20"/></svg>';
}

// =============================================
// UNSAVED CHANGES GUARD SYSTEM
// =============================================
var _modalDirty=false, _modalDirtySnap=null, _modalDirtyIgnore=false;
var _modalSaveCallback = null;

function _snapModalInputs(){
  var mc=document.getElementById('modalContent'); if(!mc) return;
  var snap={}; var inputs=mc.querySelectorAll('input,textarea,select');
  inputs.forEach(function(el){
    var key=el.id||(el.name||'')+'_'+(el.className||'');
    if(el.type==='checkbox'||el.type==='radio') snap[key+'__'+el.value]=el.checked;
    else snap[key]=el.value;
  });
  _modalDirtySnap=snap; _modalDirty=false;
}
function _checkModalDirty(){
  var mc=document.getElementById('modalContent'); if(!mc||!_modalDirtySnap) return false;
  var inputs=mc.querySelectorAll('input,textarea,select'); var dirty=false;
  inputs.forEach(function(el){
    if(dirty) return;
    var key=el.id||(el.name||'')+'_'+(el.className||'');
    if(el.type==='checkbox'||el.type==='radio'){ if(_modalDirtySnap[key+'__'+el.value]!==el.checked) dirty=true; }
    else { if(_modalDirtySnap[key]!==undefined&&_modalDirtySnap[key]!==el.value) dirty=true; }
  });
  return dirty;
}
function _modalInputChanged(){ _modalDirty=true; }
function _attachDirtyListeners(){
  setTimeout(function(){
    var mc=document.getElementById('modalContent'); if(!mc) return;
    mc.querySelectorAll('input,textarea,select').forEach(function(el){
      el.addEventListener('input',_modalInputChanged);
      el.addEventListener('change',_modalInputChanged);
    });
    _snapModalInputs();
    // If a photo was changed in a crop session, the modal is dirty even though
    // no <input autocomplete="off" data-lpignore="true" data-1p-ignore="true"> value changed — mark dirty here after the snapshot is taken
    if(_participantPhotoChanged){
      _modalDirty=true;
      _participantPhotoChanged=false;
    }
  },100);
}
function _showUnsavedConfirm(onDiscard){
  var mc = document.getElementById('modalContent');
  var prevHtml = mc.innerHTML;

  // Snapshot the LIVE runtime state of every input/select/textarea
  // (innerHTML only stores default attribute values, not what the user typed/checked)
  var prevState = [];
  mc.querySelectorAll('input,textarea,select').forEach(function(el){
    prevState.push({ value: el.value, checked: el.checked });
  });

  mc.innerHTML = `
    <div style="text-align:center;padding:12px 4px">
      <div class="modal-handle"></div>
      <div style="font-size:2.2rem;margin-bottom:10px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>️</div>
      <div style="font-size:1rem;font-weight:800;margin-bottom:6px;color:var(--gold)">Unsaved Changes</div>
      <div style="font-size:.85rem;color:var(--text2);margin-bottom:20px">You have unsaved changes.<br>What would you like to do?</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button class="btn btn-primary" id="_modalSaveBtn"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h6"/></svg> Save</button>
        <button class="btn btn-secondary" id="_modalCancelBtn"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>️ Cancel</button>
        <button class="btn btn-danger"  id="_modalDiscardBtn"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>️ Don't Save</button>
      </div>
    </div>
  `;

  // Helper: restore HTML then re-apply runtime state so typed/checked values survive
  function _restoreForm(){
    mc.innerHTML = prevHtml;
    mc.querySelectorAll('input,textarea,select').forEach(function(el, i){
      if(i >= prevState.length) return;
      if(el.type === 'checkbox' || el.type === 'radio'){
        el.checked = prevState[i].checked;
      } else {
        el.value = prevState[i].value;
      }
    });
  }

  // Save – restore form then trigger save callback
  document.getElementById('_modalSaveBtn').onclick = function(){
    _restoreForm();
    _attachDirtyListeners();   // This will take a fresh snapshot after save is complete
    _modalDirty = false;
    _modalDirtySnap = null;
    if (_modalSaveCallback) {
      _modalSaveCallback();
    }
  };

  // Cancel – restore form with all user changes intact, keep dirty flag and original snapshot
  document.getElementById('_modalCancelBtn').onclick = function(){
    _restoreForm();
    // Re-attach input listeners WITHOUT re-snapshotting (preserve original baseline)
    var mcFresh = document.getElementById('modalContent');
    mcFresh.querySelectorAll('input,textarea,select').forEach(function(el){
      el.addEventListener('input', _modalInputChanged);
      el.addEventListener('change', _modalInputChanged);
    });
    // _modalDirty and _modalDirtySnap remain as they were
  };

  // Don't Save – discard changes and close
  document.getElementById('_modalDiscardBtn').onclick = function(){
    _modalDirty = false;
    _modalDirtySnap = null;
    mc.innerHTML = '';
    document.getElementById('modalOverlay').classList.add('hidden');
    _wzModalClosed();
    if (onDiscard) onDiscard();
  };
}
function showModal(html, opts){
  opts = opts || {};
  var mc = document.getElementById('modalContent');
  var ov = document.getElementById('modalOverlay');
  var wasHidden = ov.classList.contains('hidden');
  mc.innerHTML = html;
  mc.scrollTop = 0;
  ov.scrollTop = 0;
  ov.classList.remove('hidden');
  _modalDirty = false;
  _modalDirtySnap = null;
  _modalDirtyIgnore = false;
  
  // ===== ADD THIS LINE =====
  _modalSaveCallback = opts.saveCallback || null;
  // =========================
  
  if (!opts.noDirtyGuard) _attachDirtyListeners();

  // ── Hardware back-button bookkeeping ──
  // Only push a guard entry when the overlay is genuinely opening (not when
  // an already-open modal's content is being swapped for another screen).
  if(wasHidden){
    history.pushState({wz:'modal'},'');
    _wzModalGuard=true;
  }
}
function closeModal(){
  if(!_modalDirtyIgnore&&(_modalDirty||_checkModalDirty())){
    _showUnsavedConfirm(null); return;
  }
  _modalDirty=false; _modalDirtySnap=null;
  document.getElementById('modalOverlay').classList.add('hidden');
  if(typeof _stopQRScan==='function') _stopQRScan();
  _wzModalClosed();
}
function _closeModalClean(){
  _modalDirty=false; _modalDirtySnap=null; _modalDirtyIgnore=true;
  document.getElementById('modalOverlay').classList.add('hidden');
  if(typeof _stopQRScan==='function') _stopQRScan();
  _wzModalClosed();
}
function _wzModalClosed(){
  if(!_wzModalGuard) return;
  if(_wzProcessingRealPop){ _wzModalGuard=false; }
  else { _wzModalGuard=false; _wzConsumeGuard(); }
}


// =============================================
// SHARE RESULT AS IMAGE
// =============================================
function _ordinalSuffix(n){
  var m=n%100;
  if(m>=11&&m<=13) return 'th';
  switch(n%10){case 1:return 'st';case 2:return 'nd';case 3:return 'rd';default:return 'th';}
}
function shareResultImage(itemId){
  var items=DB.items(),participants=DB.participants(),marks=DB.marks(),groups=DB.groups(),cfg=DB.config();
  var item=items.find(function(i){return i.id==itemId;});
  if(!item) return toast('Item not found','error');
  var im=marks.filter(function(m){return m.itemId==itemId&&m.total>0;}).sort(function(a,b){return b.total-a.total;});
  if(!im.length) return toast('No marks to share','error');
  applyDenseRank(im);
  var top=im.filter(function(m){return (m.point||0)>0;});
  if(!top.length) top=im.slice(0,5);
  // Result ordinal label - which declared result is this, in true declare
  // chronological order (sorted by declaredAt), matching the numbering used
  // on the broadcast poster (_buildPublicPayload's ordinalFor) — previously
  // this sorted by each item's position in the master items list instead,
  // which doesn't reflect the actual order items were declared in and could
  // show the wrong "Result N" here.
  var declaredItems=items.filter(function(i){return i.declared;})
    .sort(function(a,b){return (a.declaredAt||0)-(b.declaredAt||0);});
  var itemOrdinal=declaredItems.findIndex(function(i){return i.id==itemId;})+1;
  var resultLabel='Result '+(itemOrdinal||1);
  function doDrawPoster(logoImg){
    var DPR=2, W=640, PAD=28;
    var LOGO_R=38;
    var FEST_H=LOGO_R*2+78+(cfg.tagline?15:0); // logo + fest info lines (+tagline if set)
    var ITEM_H=74; // section + item name
    var SEP_H=32; // column header zone
    var ROW_H=72, FOOTER_H=50;
    var HEADER_H=FEST_H+ITEM_H+SEP_H;
    var H=HEADER_H+(top.length*ROW_H)+FOOTER_H;
    var canvas=document.createElement('canvas');
    canvas.width=W*DPR; canvas.height=H*DPR;
    var ctx=canvas.getContext('2d'); ctx.scale(DPR,DPR);

    // ── BACKGROUND: random palette ──
    var PALETTES=[
      // 0 Navy-Gold — diagonal line texture
      {bg1:'#0a1628',bg2:'#0d1f3c',bg3:'#091420',dot:'#8080ff',glow:'rgba(255,180,20,0.13)',bar1:'#f0a500',bar2:'#ffcc00',tex:'diag'},
      // 1 Deep Teal-Emerald — hex grid
      {bg1:'#071a16',bg2:'#0b2420',bg3:'#051310',dot:'#40e0b0',glow:'rgba(40,220,140,0.12)',bar1:'#00c896',bar2:'#00e8b0',tex:'hex'},
      // 2 Midnight Purple — dot grid
      {bg1:'#120820',bg2:'#1a0d35',bg3:'#0d0618',dot:'#c080ff',glow:'rgba(160,80,255,0.14)',bar1:'#a050f0',bar2:'#c880ff',tex:'dots'},
      // 3 Deep Crimson-Rose — crosshatch
      {bg1:'#1a0810',bg2:'#2a0d18',bg3:'#120508',dot:'#ff8080',glow:'rgba(255,60,100,0.13)',bar1:'#e02060',bar2:'#ff4080',tex:'cross'},
      // 4 Slate-Cyan — wave lines
      {bg1:'#081828',bg2:'#0c2035',bg3:'#061018',dot:'#60c8ff',glow:'rgba(40,160,255,0.13)',bar1:'#0090e0',bar2:'#40c0ff',tex:'wave'},
      // 5 Forest Night — dot rings
      {bg1:'#071510',bg2:'#0c2318',bg3:'#050e0a',dot:'#80ffb0',glow:'rgba(60,200,100,0.13)',bar1:'#20b060',bar2:'#40e080',tex:'rings'},
      // 6 Deep Amber — horizontal dashes
      {bg1:'#180f02',bg2:'#281a04',bg3:'#100a01',dot:'#ffcc60',glow:'rgba(255,160,20,0.14)',bar1:'#e08010',bar2:'#ffb030',tex:'dash'},
      // 7 Indigo-Pink — scattered squares
      {bg1:'#0e0828',bg2:'#18104a',bg3:'#08051c',dot:'#ff80d0',glow:'rgba(200,80,240,0.13)',bar1:'#c040e0',bar2:'#ff60f0',tex:'squares'},
      // 8 Deep Bronze — zigzag
      {bg1:'#161008',bg2:'#221808',bg3:'#100c04',dot:'#ffb060',glow:'rgba(200,120,20,0.13)',bar1:'#c07820',bar2:'#e0a040',tex:'zig'},
      // 9 Arctic Blue — plus signs
      {bg1:'#061820',bg2:'#0a2838',bg3:'#040e16',dot:'#a0e8ff',glow:'rgba(80,200,255,0.13)',bar1:'#20b8e0',bar2:'#60d8ff',tex:'plus'},
    ];
    var pal=PALETTES[itemId%PALETTES.length]||PALETTES[0];
    var bg=ctx.createLinearGradient(0,0,W,H);
    bg.addColorStop(0,pal.bg1); bg.addColorStop(0.5,pal.bg2); bg.addColorStop(1,pal.bg3);
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    // ── Per-palette texture ──
    ctx.save(); ctx.globalAlpha=0.045; ctx.strokeStyle=pal.dot; ctx.fillStyle=pal.dot;
    if(pal.tex==='dots'){
      for(var dy=10;dy<H;dy+=22) for(var dx=10;dx<W;dx+=22){ctx.beginPath();ctx.arc(dx,dy,1,0,Math.PI*2);ctx.fill();}
    } else if(pal.tex==='diag'){
      ctx.lineWidth=0.7;
      for(var d=-W;d<H+W;d+=18){ctx.beginPath();ctx.moveTo(d,0);ctx.lineTo(d+W,W);ctx.stroke();}
    } else if(pal.tex==='hex'){
      ctx.lineWidth=0.6;
      var hx=28,hy=16;
      for(var row=0;row<Math.ceil(H/hy)+1;row++) for(var col=0;col<Math.ceil(W/hx)+1;col++){
        var ox=(row%2)*hx/2,cx2=col*hx+ox,cy2=row*hy;
        ctx.beginPath();for(var a=0;a<6;a++){var ang=a*Math.PI/3;ctx.lineTo(cx2+8*Math.cos(ang),cy2+8*Math.sin(ang));}ctx.closePath();ctx.stroke();
      }
    } else if(pal.tex==='cross'){
      ctx.lineWidth=0.6;
      for(var dy=12;dy<H;dy+=20) for(var dx=12;dx<W;dx+=20){
        ctx.beginPath();ctx.moveTo(dx-4,dy);ctx.lineTo(dx+4,dy);ctx.stroke();
        ctx.beginPath();ctx.moveTo(dx,dy-4);ctx.lineTo(dx,dy+4);ctx.stroke();
      }
    } else if(pal.tex==='wave'){
      ctx.lineWidth=0.8;
      for(var wy=14;wy<H;wy+=18){ctx.beginPath();for(var wx=0;wx<W;wx+=2){ctx.lineTo(wx,wy+4*Math.sin(wx/14));}ctx.stroke();}
    } else if(pal.tex==='rings'){
      ctx.lineWidth=0.6;
      for(var dy=24;dy<H;dy+=32) for(var dx=24;dx<W;dx+=32){ctx.beginPath();ctx.arc(dx,dy,6,0,Math.PI*2);ctx.stroke();}
    } else if(pal.tex==='dash'){
      ctx.lineWidth=0.8;
      for(var dy=12;dy<H;dy+=18) for(var dx=6;dx<W;dx+=22){ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx+10,dy);ctx.stroke();}
    } else if(pal.tex==='squares'){
      ctx.lineWidth=0.6;
      for(var dy=10;dy<H;dy+=20) for(var dx=10;dx<W;dx+=20){ctx.strokeRect(dx-3,dy-3,6,6);}
    } else if(pal.tex==='zig'){
      ctx.lineWidth=0.8;
      for(var wy=14;wy<H;wy+=20){ctx.beginPath();for(var wx=0;wx<W;wx+=10){ctx.lineTo(wx,wy+(wx%20===0?5:-5));}ctx.stroke();}
    } else if(pal.tex==='plus'){
      for(var dy=14;dy<H;dy+=22) for(var dx=14;dx<W;dx+=22){
        ctx.beginPath();ctx.arc(dx,dy,1.2,0,Math.PI*2);ctx.fill();
        if((dx+dy)%44===0){ctx.beginPath();ctx.arc(dx,dy,3,0,Math.PI*2);ctx.stroke();}
      }
    }
    ctx.restore();
    // Top radial glow
    var gl=ctx.createRadialGradient(W/2,0,0,W/2,0,340);
    gl.addColorStop(0,pal.glow); gl.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=gl; ctx.fillRect(0,0,W,H);
    // Fest band
    var festBand=ctx.createLinearGradient(0,0,0,FEST_H);
    festBand.addColorStop(0,'rgba(255,200,40,0.06)'); festBand.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=festBand; ctx.fillRect(0,0,W,FEST_H);
    // Top accent bar
    var tb=ctx.createLinearGradient(0,0,W,0);
    tb.addColorStop(0,'transparent'); tb.addColorStop(0.2,pal.bar1); tb.addColorStop(0.8,pal.bar2); tb.addColorStop(1,'transparent');
    ctx.fillStyle=tb; ctx.fillRect(0,0,W,5);
    // Bottom bar
    var bb=ctx.createLinearGradient(0,0,W,0);
    bb.addColorStop(0,'transparent'); bb.addColorStop(0.2,pal.bar1); bb.addColorStop(0.8,pal.bar2); bb.addColorStop(1,'transparent');
    ctx.fillStyle=bb; ctx.fillRect(0,H-5,W,5);
    // Outer border — colour matches palette
    ctx.strokeStyle=pal.bar1+'33'; ctx.lineWidth=1; ctx.strokeRect(10,10,W-20,H-20);

    // ── LOGO (top-centre) ──
    var logoTopY=18;
    var logoCX=W/2, logoCY=logoTopY+LOGO_R;
    if(logoImg){
      // Drop shadow under logo
      ctx.save(); ctx.shadowColor='rgba(255,180,0,0.35)'; ctx.shadowBlur=18;
      ctx.beginPath(); ctx.arc(logoCX,logoCY,LOGO_R+3,0,Math.PI*2);
      ctx.strokeStyle='rgba(240,165,0,0.9)'; ctx.lineWidth=3; ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.beginPath(); ctx.arc(logoCX,logoCY,LOGO_R,0,Math.PI*2); ctx.clip();
      ctx.drawImage(logoImg,logoCX-LOGO_R,logoTopY,LOGO_R*2,LOGO_R*2);
      ctx.restore();
    } else {
      // No logo: show trophy big, centred
      ctx.font='62px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('\uD83C\uDFC6',logoCX,logoCY+4);
      ctx.textBaseline='alphabetic';
    }

    // ── FESTIVAL INFO (centred below logo) ──
    var iy=logoTopY+LOGO_R*2+16;
    ctx.textAlign='center'; ctx.textBaseline='top';
    // Fest name — bold gold
    ctx.font='800 18px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='#ffd700';
    ctx.shadowColor='rgba(255,200,0,0.3)'; ctx.shadowBlur=8;
    ctx.fillText(cfg.festName||'Winzera',W/2,iy,W-PAD*4); iy+=24;
    ctx.shadowBlur=0;
    // Tagline / slogan
    if(cfg.tagline){
      ctx.font='italic 700 11px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(255,215,0,0.75)';
      ctx.fillText(cfg.tagline,W/2,iy,W-PAD*4); iy+=15;
    }
    // Venue + Date (date string already includes the year)
    var _fd=formatFestDate(cfg);
    if(cfg.venue||_fd){
      ctx.font='700 11px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(180,160,220,0.65)';
      var vd=(cfg.venue||'')+(cfg.venue&&_fd?', ':'')+(_fd||'');
      ctx.fillText(vd,W/2,iy,W-PAD*3); iy+=16;
    }
    ctx.textBaseline='alphabetic';

    // ── ITEM NAME + SECTION (centred, prominent) ──
    var itemZoneY=FEST_H;
    // Thin separator above item zone
    var sl=ctx.createLinearGradient(0,0,W,0);
    sl.addColorStop(0,'transparent'); sl.addColorStop(0.2,'rgba(255,200,0,0.25)'); sl.addColorStop(0.8,'rgba(255,200,0,0.25)'); sl.addColorStop(1,'transparent');
    ctx.strokeStyle=sl; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(PAD*2,itemZoneY); ctx.lineTo(W-PAD*2,itemZoneY); ctx.stroke();

    // Result ordinal badge — top right corner of item zone
    ctx.textAlign='right'; ctx.textBaseline='top';
    ctx.font='700 10px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(240,165,0,0.75)';
    ctx.fillText(resultLabel,W-PAD,itemZoneY+8);
    // Section label — centred
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.font='700 11px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(180,200,255,0.65)';
    ctx.fillText((item.section||''),W/2,itemZoneY+10,W-PAD*3);
    // Item name — wrap to 2 lines, centred
    ctx.font='800 22px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='#ffffff';
    ctx.shadowColor='rgba(200,180,255,0.4)'; ctx.shadowBlur=14;
    var iName=item.name||'', maxItemW=W-PAD*4;
    if(ctx.measureText(iName).width<=maxItemW){
      ctx.fillText(iName,W/2,itemZoneY+26);
    } else {
      var wds=iName.split(' '),l1='',l2='';
      for(var wi=0;wi<wds.length;wi++){var t2=(l1?l1+' ':'')+wds[wi];if(ctx.measureText(t2).width>maxItemW&&l1){l2=wds.slice(wi).join(' ');break;}l1=t2;}
      ctx.font='800 19px "Segoe UI",Arial,sans-serif';
      ctx.fillText(trunc(l1,maxItemW,'800 19px "Segoe UI",Arial'),W/2,itemZoneY+24);
      if(l2) ctx.fillText(trunc(l2,maxItemW,'800 19px "Segoe UI",Arial'),W/2,itemZoneY+48);
    }
    ctx.shadowBlur=0; ctx.textBaseline='alphabetic';

    // ── COLUMN HEADERS ──
    var divY=HEADER_H-SEP_H+6;
    var hdl=ctx.createLinearGradient(0,0,W,0);
    hdl.addColorStop(0,'transparent'); hdl.addColorStop(0.1,'rgba(240,165,0,0.3)'); hdl.addColorStop(0.9,'rgba(240,165,0,0.3)'); hdl.addColorStop(1,'transparent');
    ctx.strokeStyle=hdl; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(PAD,divY); ctx.lineTo(W-PAD,divY); ctx.stroke();
    ctx.save(); ctx.fillStyle='#f0a500'; ctx.translate(W/2,divY); ctx.rotate(Math.PI/4); ctx.fillRect(-4,-4,8,8); ctx.restore();
    ctx.font='700 9px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(140,160,200,0.55)'; ctx.textAlign='left';
    ctx.fillText('RANK',PAD,HEADER_H-10);
    ctx.fillText('CODE',PAD+72,HEADER_H-10);
    ctx.fillText('PARTICIPANT',PAD+116,HEADER_H-10);
    ctx.textAlign='right'; ctx.fillText('GRADE',W-PAD-48,HEADER_H-10); ctx.fillText('PTS',W-PAD,HEADER_H-10);

    // ── ROWS ──
    var RANK_BG=['rgba(255,215,0,0.14)','rgba(192,192,192,0.11)','rgba(205,127,50,0.11)','rgba(255,255,255,0.04)','rgba(255,255,255,0.04)'];
    var RANK_STROKE=['#ffd700','#c0c0c0','#cd7f32','rgba(180,160,220,0.22)','rgba(180,160,220,0.22)'];
    var RANK_TEXT=['#ffd700','#d0d0d0','#e8a055','rgba(185,165,215,0.65)','rgba(185,165,215,0.65)'];
    var RANK_LABEL=['1st','2nd','3rd','4th','5th'];
    top.forEach(function(m,i){
      var grp=item.type==='group'?groups.find(function(g){return g.groupChestNo===m.chestNo&&_grpHasItem(g,itemId);}):null;
      var p=participants.find(function(pt){return pt.chestNo===m.chestNo;});
      var name=grp?grp.name:(p?p.name:'#'+m.chestNo);
      var team=grp?grp.team:(p?p.team:'');
      var code=m.codeLetter||'';
      var rk=m._rank||i+1; var ri=Math.min(rk-1,4);
      var rowY=HEADER_H+(i*ROW_H), rowCY=rowY+ROW_H/2;
      ctx.fillStyle=i%2===0?'rgba(255,255,255,0.018)':'rgba(0,0,0,0)'; ctx.fillRect(PAD-8,rowY,W-PAD*2+16,ROW_H);
      if(rk<=3){ ctx.fillStyle=RANK_STROKE[ri]; ctx.fillRect(PAD-8,rowY+10,3,ROW_H-20); }
      var bW=52,bH=27,bX=PAD,bY=rowCY-13;
      ctx.beginPath(); ctx.roundRect(bX,bY,bW,bH,14);
      ctx.fillStyle=RANK_BG[ri]; ctx.fill(); ctx.strokeStyle=RANK_STROKE[ri]; ctx.lineWidth=1; ctx.stroke();
      ctx.font='800 12px "Segoe UI",Arial,sans-serif'; ctx.fillStyle=RANK_TEXT[ri]; ctx.textAlign='center';
      var rankLbl=rk<=5?RANK_LABEL[ri]:(rk+_ordinalSuffix(rk));
      ctx.fillText(rankLbl,bX+bW/2,rowCY+4);
      if(code){
        ctx.beginPath(); ctx.arc(PAD+72+13,rowCY,14,0,Math.PI*2);
        ctx.fillStyle=RANK_BG[ri]; ctx.fill(); ctx.strokeStyle=RANK_STROKE[ri]; ctx.lineWidth=1; ctx.stroke();
        ctx.font='800 12px "Segoe UI",Arial,sans-serif'; ctx.fillStyle=RANK_TEXT[ri]; ctx.textAlign='center';
        ctx.fillText(code,PAD+85,rowCY+4);
      }
      var nx=PAD+112, maxNW=W-nx-PAD-92;
      ctx.textAlign='left';
      ctx.font='800 14px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='#eef2ff';
      if(rk<=3){ctx.shadowColor=RANK_STROKE[ri]; ctx.shadowBlur=5;}
      ctx.fillText(trunc(name,maxNW,'700 14px "Segoe UI",Arial,sans-serif'),nx,rowCY-4);
      ctx.shadowBlur=0;
      ctx.font='700 10px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(140,160,200,0.55)';
      ctx.fillText(trunc(team,maxNW,'400 10px "Segoe UI",Arial'),nx,rowCY+13);
      var grade=m.grade||'';
      if(grade){
        ctx.font='800 11px "Segoe UI",Arial,sans-serif';
        var gw=Math.max(ctx.measureText(grade).width+16,32), gX=W-PAD-48;
        ctx.beginPath(); ctx.roundRect(gX-gw/2,rowCY-13,gw,26,13);
        ctx.fillStyle=RANK_BG[ri]; ctx.fill(); ctx.strokeStyle=RANK_STROKE[ri]; ctx.stroke();
        ctx.fillStyle=RANK_TEXT[ri]; ctx.textAlign='center'; ctx.fillText(grade,gX,rowCY+4);
      }
      ctx.font='800 17px "Segoe UI",Arial,sans-serif';
      ctx.fillStyle=rk===1?'#ffd700':(rk===2?'#c0c0c0':(rk===3?'#e8a055':'rgba(185,165,215,0.8)'));
      ctx.textAlign='right'; ctx.fillText((m.point||0)+'',W-PAD,rowCY+2);
      ctx.font='700 9px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(140,120,170,0.45)';
      ctx.fillText('pts',W-PAD,rowCY+14);
      if(i<top.length-1){
        ctx.strokeStyle='rgba(255,255,255,0.055)'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(PAD,rowY+ROW_H); ctx.lineTo(W-PAD,rowY+ROW_H); ctx.stroke();
      }
    });

    // ── FOOTER: institution left, app credit right ──
    var fY=HEADER_H+(top.length*ROW_H);
    var fl=ctx.createLinearGradient(0,0,W,0);
    fl.addColorStop(0,'transparent'); fl.addColorStop(0.1,'rgba(240,165,0,0.25)'); fl.addColorStop(0.9,'rgba(240,165,0,0.25)'); fl.addColorStop(1,'transparent');
    ctx.strokeStyle=fl; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(PAD,fY+10); ctx.lineTo(W-PAD,fY+10); ctx.stroke();
    // Institution name — left
    ctx.font='700 11px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(200,190,240,0.7)';
    ctx.textAlign='left';
    if(cfg.institution) ctx.fillText(trunc(cfg.institution,(W-PAD*2)/2-10,'500 11px Arial'),PAD,fY+30);
    // App credit — right
    ctx.font='700 11px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(150,130,190,0.6)';
    ctx.textAlign='right';
    ctx.fillText('Winzera \xb7 Competition Manager',W-PAD,fY+30);

    var dataUrl=canvas.toDataURL('image/png');
    window._lastShareDataUrl=dataUrl;
    window._posterUrls=[dataUrl,null]; // [0]=full result, [1]=public (generated below)
    var enc=_encForOnclickAttr(item.name);
    var slots=cfg.posterPresets||[];
    var presetItems=[{value:'random',label:'Default (Random Style)'}]
      .concat(slots.map(function(p,i){ return p?{value:i,label:'Preset '+(i+1)}:null; }).filter(Boolean));
    showModal('<div style="text-align:center">'
      +'<div class="modal-handle"></div>'
      +'<div style="font-size:1rem;font-weight:800;margin-bottom:4px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></svg> Share Result</div>'
      +'<div style="font-size:.72rem;color:var(--text3);margin-bottom:10px">Choose poster style</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">'
      +'<button id="_pTab1" class="btn btn-primary" style="font-size:.8rem;padding:7px" onclick="_switchPosterTab(1)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M5 4H3v2a4 4 0 0 0 4 4"/><path d="M19 4h2v2a4 4 0 0 1-4 4"/></svg> Full Result</button>'
      +'<button id="_pTab2" class="btn btn-secondary" style="font-size:.8rem;padding:7px;color:var(--text2)" onclick="_switchPosterTab(2)"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4"/><path d="M12 17v4"/><path d="M3 12h4"/><path d="M17 12h4"/><path d="M6 6l2 2"/><path d="M16 16l2 2"/><path d="M6 18l2-2"/><path d="M16 8l2-2"/></svg> Public Podium</button>'
      +'</div>'
      +'<div id="_posterPresetPicker" style="display:none;margin-bottom:10px;text-align:left">'
      +'<label class="form-label">Poster Style for Public Podium</label>'
      +_wzDropdown('_posterPresetSelect',presetItems,'random',{onSelect:"_regenPodiumPoster($val)"})
      +'<label class="form-label" style="margin-top:10px">Rank Badge Style</label>'
      +_wzDropdown('_posterBadgeStyleSelect',[
          {value:'ribbon',label:'Classic Ribbon'},
          {value:'minimal',label:'Minimalist Badge'},
          {value:'shield',label:'3D Shield'},
          {value:'emoji',label:'Emoji Medals (Classic)'}
        ],cfg.posterBadgeStyle||'ribbon',{onSelect:"_posterBadgeStyleSetAndRegen($val)"})
      +'</div>'
      +'<img id="_posterPreview" src="'+dataUrl+'" style="width:100%;border-radius:10px;border:1px solid var(--border);margin-bottom:12px">'
      +'<div style="display:flex;gap:8px">'
      +'<button class="btn btn-primary" style="flex:1" onclick="_downloadResultImg(\''+enc+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg> Download</button>'
      +'<button class="btn btn-success" style="flex:1" onclick="_shareViaAPI(\''+enc+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg> Share</button>'
      +'</div>'
      +'<button class="btn btn-secondary" style="width:100%;margin-top:8px" onclick="closeModal()">Close</button>'
      +'</div>',{noDirtyGuard:true});
    // Pre-generate public poster
    window._activePosterId=1;
    window._shareCtx={item:item,top:top,cfg:cfg,resultLabel:resultLabel,logoImg:logoImg};
    _genPublicPoster(item,top,cfg,resultLabel,logoImg,window._presetBgImg||null,(_preset&&_preset.layout)||null,function(pubUrl){
      window._lastShareDataUrl2=pubUrl;
      window._posterUrls[1]=pubUrl; // store for tab switching
    });
  }
  function trunc(t,mw,f){var tc=document.createElement('canvas').getContext('2d');tc.font=f;if(tc.measureText(t).width<=mw)return t;while(t.length>1&&tc.measureText(t+'…').width>mw)t=t.slice(0,-1);return t+'…';}
  var _preset=getActivePosterPreset();
  function _startDraw(){
    if(cfg.logo){
      var li=new Image(); li.onload=function(){doDrawPoster(li);}; li.onerror=function(){doDrawPoster(null);}; li.src=cfg.logo;
    } else { doDrawPoster(null); }
  }
  window._presetBgImg=null;
  if(_preset&&_preset.bg){
    var bi=new Image();
    bi.onload=function(){ window._presetBgImg=bi; _startDraw(); };
    bi.onerror=function(){ window._presetBgImg=null; _startDraw(); };
    bi.src=_preset.bg;
  } else { _startDraw(); }
}


// Switch between full result and public podium poster tabs
window._activePosterId = 1;
// _posterUrls[0]=full result, _posterUrls[1]=public podium
window._posterUrls = [null, null];
function _switchPosterTab(n) {
  window._activePosterId = n;
  var url = window._posterUrls[n - 1];
  if (url) {
    var p = document.getElementById('_posterPreview');
    if (p) p.src = url;
    // Update _lastShareDataUrl to the currently active poster for share/download
    window._lastShareDataUrl = url;
  } else if (n === 2) {
    toast('Still generating...','error');
  }
  var t1 = document.getElementById('_pTab1'), t2 = document.getElementById('_pTab2');
  if (t1) t1.className = 'btn ' + (n === 1 ? 'btn-primary' : 'btn-secondary');
  if (t2) t2.className = 'btn ' + (n === 2 ? 'btn-primary' : 'btn-secondary');
  if (t2 && n !== 2) t2.style.color = 'var(--text2)';
  if (t2 && n === 2) t2.style.color = '';
  var picker = document.getElementById('_posterPresetPicker');
  if (picker) picker.style.display = (n === 2) ? 'block' : 'none';
}
function _posterBadgeStyleSetAndRegen(val){
  _posterBadgeStyleSet(val);
  var sel=document.getElementById('_posterPresetSelect');
  _regenPodiumPoster(sel?sel.value:'random');
}
// Regenerate the Public Podium poster using a specific preset slot ('random' = default palettes)
function _regenPodiumPoster(value){
  var sc = window._shareCtx; if(!sc) return;
  var img = document.getElementById('_posterPreview');
  if(img) img.style.opacity='0.5';
  function proceed(bgImg, layout){
    _genPublicPoster(sc.item, sc.top, sc.cfg, sc.resultLabel, sc.logoImg, bgImg, layout, function(url){
      window._posterUrls[1]=url;
      window._lastShareDataUrl2=url;
      if(window._activePosterId===2){
        window._lastShareDataUrl=url;
        var p=document.getElementById('_posterPreview');
        if(p){ p.src=url; p.style.opacity='1'; }
      }
    });
  }
  if(value==='random'){
    proceed(null,null);
  } else {
    var idx=parseInt(value);
    var preset=(sc.cfg.posterPresets||[])[idx];
    if(!preset||!preset.bg){ proceed(null,null); return; }
    var bi=new Image();
    bi.onload=function(){ proceed(bi, preset.layout||null); };
    bi.onerror=function(){ proceed(null,null); };
    bi.src=preset.bg;
  }
}

// Clean public podium poster - 1st/2nd/3rd only, no marks/grades
function _genPublicPoster(item, top, cfg, resultLabel, logoImg, customBg, layoutCfg, cb) {
  layoutCfg = layoutCfg || {};
  var L = {
    photoScale: layoutCfg.photoScale||1,
    textScale: layoutCfg.textScale||1,
    textWeight: layoutCfg.textWeight||800,
    textColor: layoutCfg.textColor||null
  };
  // Helper: scaled+weighted font string for this poster's text elements.
  // baseWeight lets secondary text (team/year) stay a bit lighter than the
  // primary weight even when the user cranks textWeight way up.
  function PF(baseSize, baseWeight){
    var w = Math.round(L.textWeight * (baseWeight/800));
    w = Math.max(300, Math.min(900, w));
    return w+' '+Math.round(baseSize*L.textScale)+'px "Segoe UI",Arial,sans-serif';
  }
  var PALETTES = [
    // 0 Warm Sand — diagonal lines
    { bg: '#faf6ee', bg2: '#f0e8d0', accent: '#8b3a0f', sub: '#c47a35', text: '#2a1a08', muted: '#9a7a5a', dot: 'rgba(160,100,30,0.10)', bar: '#c47a35', rowBg: 'rgba(196,122,53,0.08)', tex:'diag' },
    // 1 Forest Mint — hex grid
    { bg: '#f0f9f5', bg2: '#ddf0e8', accent: '#0a5c3a', sub: '#1a9060', text: '#062318', muted: '#4a8060', dot: 'rgba(20,120,70,0.09)', bar: '#1a9060', rowBg: 'rgba(26,144,96,0.08)', tex:'hex' },
    // 2 Soft Lavender — dot scatter
    { bg: '#f5f0fc', bg2: '#e8dff8', accent: '#4a1a8a', sub: '#7a40cc', text: '#1e0840', muted: '#8060aa', dot: 'rgba(100,40,180,0.09)', bar: '#7a40cc', rowBg: 'rgba(122,64,204,0.08)', tex:'dots' },
    // 3 Blush Rose — crosshatch
    { bg: '#fdf0f3', bg2: '#f8dce4', accent: '#8a1a38', sub: '#cc3060', text: '#380818', muted: '#a06070', dot: 'rgba(180,40,80,0.09)', bar: '#cc3060', rowBg: 'rgba(204,48,96,0.08)', tex:'cross' },
    // 4 Sky Blue — wave lines
    { bg: '#f0f4fa', bg2: '#dce6f8', accent: '#1a3870', sub: '#2a5aac', text: '#0a1830', muted: '#506090', dot: 'rgba(40,80,160,0.09)', bar: '#2a5aac', rowBg: 'rgba(42,90,172,0.08)', tex:'wave' },
    // 5 Golden Ivory — circles
    { bg: '#fffbf0', bg2: '#fdf0c8', accent: '#7a5000', sub: '#c89020', text: '#3a2800', muted: '#907840', dot: 'rgba(180,130,0,0.09)', bar: '#c89020', rowBg: 'rgba(200,144,32,0.07)', tex:'rings' },
    // 6 Peach Coral — dashes
    { bg: '#fff4f0', bg2: '#fde4d8', accent: '#8a2c10', sub: '#e05030', text: '#3a1008', muted: '#a07060', dot: 'rgba(200,80,40,0.09)', bar: '#e05030', rowBg: 'rgba(224,80,48,0.07)', tex:'dash' },
    // 7 Slate Teal — squares
    { bg: '#f0fafa', bg2: '#d8f0f0', accent: '#0a4848', sub: '#1a8080', text: '#041818', muted: '#406868', dot: 'rgba(20,120,120,0.09)', bar: '#1a8080', rowBg: 'rgba(26,128,128,0.07)', tex:'squares' },
    // 8 Warm Mauve — zigzag
    { bg: '#faf0f8', bg2: '#f0d8f0', accent: '#580860', sub: '#a030b0', text: '#280430', muted: '#886090', dot: 'rgba(140,30,160,0.09)', bar: '#a030b0', rowBg: 'rgba(160,48,176,0.07)', tex:'zig' },
    // 9 Lime Fresh — dots & rings
    { bg: '#f4faf0', bg2: '#ddf0d0', accent: '#205010', sub: '#409020', text: '#0c2008', muted: '#507040', dot: 'rgba(50,130,10,0.09)', bar: '#409020', rowBg: 'rgba(64,144,32,0.07)', tex:'plus' },
  ];
  var pal = PALETTES[(item.id || 0) % PALETTES.length];
  if(customBg){
    // Custom Poster Design preset in use: this poster's default palette assumes a
    // LIGHT background with dark text, so switch to light text on the dark
    // composited preset background (which already bakes in the overlay for contrast).
    var txt = L.textColor || '#ffffff';
    pal={bg:'#000',bg2:'#000',accent:txt,sub:_hexAlpha(txt,0.85),text:txt,muted:_hexAlpha(txt,0.8),dot:_hexAlpha(txt,0.10),bar:txt,rowBg:_hexAlpha(txt,0.08),tex:'none'};
  }
  var top3 = top.filter(function(m) { return m._rank <= 3; }).slice(0, 3);
  if (!top3.length) { cb(null); return; }

  // ── Poster Content visibility toggles ──
  // NOTE: hidden fields still reserve their normal vertical space (gap is
  // preserved) so poster backgrounds designed around the default layout
  // continue to line up correctly even when some text is hidden.
  var viz = Object.assign({festName:true,logo:true,date:true,venue:true,tagline:true}, cfg.posterViz||{});
  var showLogo = viz.logo !== false;
  var showFestName = viz.festName !== false;
  var _fdPP = formatFestDate(cfg);
  var showDateText = viz.date !== false && !!_fdPP;
  var showVenueText = viz.venue !== false && !!cfg.venue;
  var showDateLine = showDateText || showVenueText;
  var showTagline = viz.tagline !== false && !!cfg.tagline;
  var badgeStyle = cfg.posterBadgeStyle || 'ribbon';

  // Canvas grows gently with Text Size so bigger text never feels cramped
  // on a poster that stayed a fixed small size.
  var TS = L.textScale || 1;
  var DPR = 2, W = Math.round(640 * (1 + (TS - 1) * 0.35)), PAD = 32;
  var LOGO_R = Math.round(40 * (1 + (TS - 1) * 0.2));
  var ROW_H = Math.round(82 * (1 + (TS - 1) * 0.4));
  var H_HEADER = LOGO_R * 2 + Math.round((112+(showTagline?16:0)) * (1 + (TS - 1) * 0.25));
  var H_PODIUM = top3.length * ROW_H + 20;
  var H_FOOTER = Math.round(54 * (1 + (TS - 1) * 0.15));
  var H = H_HEADER + H_PODIUM + H_FOOTER;

  var canvas = document.createElement('canvas');
  canvas.width = W * DPR; canvas.height = H * DPR;
  var ctx = canvas.getContext('2d'); ctx.scale(DPR, DPR);

  // Background gradient
  if(customBg){
    drawImageCover(ctx,customBg,0,0,W,H);
  } else {
  var bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, pal.bg); bgGrad.addColorStop(1, pal.bg2);
  ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

  // ── Per-palette texture ──
  ctx.save(); ctx.globalAlpha = 0.08;
  var dotCol = pal.dot;
  if (pal.tex === 'dots') {
    for (var dy = 0; dy < H; dy += 26) for (var dx = 0; dx < W; dx += 26) {
      ctx.beginPath(); ctx.arc(dx, dy, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = dotCol; ctx.fill();
    }
  } else if (pal.tex === 'diag') {
    ctx.strokeStyle = dotCol; ctx.lineWidth = 0.8;
    for (var d = -W; d < H + W; d += 20) { ctx.beginPath(); ctx.moveTo(d, 0); ctx.lineTo(d + W, W); ctx.stroke(); }
  } else if (pal.tex === 'hex') {
    ctx.strokeStyle = dotCol; ctx.lineWidth = 0.7;
    for (var row = 0; row < Math.ceil(H / 18) + 1; row++) for (var col = 0; col < Math.ceil(W / 30) + 1; col++) {
      var ox = (row % 2) * 15, cx2 = col * 30 + ox, cy2 = row * 18;
      ctx.beginPath(); for (var a = 0; a < 6; a++) { var ang = a * Math.PI / 3; ctx.lineTo(cx2 + 9 * Math.cos(ang), cy2 + 9 * Math.sin(ang)); } ctx.closePath(); ctx.stroke();
    }
  } else if (pal.tex === 'cross') {
    ctx.strokeStyle = dotCol; ctx.lineWidth = 0.7;
    for (var dy = 14; dy < H; dy += 22) for (var dx = 14; dx < W; dx += 22) {
      ctx.beginPath(); ctx.moveTo(dx - 5, dy); ctx.lineTo(dx + 5, dy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(dx, dy - 5); ctx.lineTo(dx, dy + 5); ctx.stroke();
    }
  } else if (pal.tex === 'wave') {
    ctx.strokeStyle = dotCol; ctx.lineWidth = 0.9;
    for (var wy = 16; wy < H; wy += 20) { ctx.beginPath(); for (var wx = 0; wx < W; wx += 2) { ctx.lineTo(wx, wy + 5 * Math.sin(wx / 16)); } ctx.stroke(); }
  } else if (pal.tex === 'rings') {
    ctx.strokeStyle = dotCol; ctx.lineWidth = 0.7;
    for (var dy = 20; dy < H; dy += 30) for (var dx = 20; dx < W; dx += 30) { ctx.beginPath(); ctx.arc(dx, dy, 7, 0, Math.PI * 2); ctx.stroke(); }
  } else if (pal.tex === 'dash') {
    ctx.strokeStyle = dotCol; ctx.lineWidth = 0.9;
    for (var dy = 14; dy < H; dy += 20) for (var dx = 8; dx < W; dx += 26) { ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(dx + 12, dy); ctx.stroke(); }
  } else if (pal.tex === 'squares') {
    ctx.strokeStyle = dotCol; ctx.lineWidth = 0.7;
    for (var dy = 12; dy < H; dy += 24) for (var dx = 12; dx < W; dx += 24) { ctx.strokeRect(dx - 4, dy - 4, 8, 8); }
  } else if (pal.tex === 'zig') {
    ctx.strokeStyle = dotCol; ctx.lineWidth = 0.9;
    for (var wy = 16; wy < H; wy += 22) { ctx.beginPath(); for (var wx = 0; wx < W; wx += 12) { ctx.lineTo(wx, wy + (Math.floor(wx / 12) % 2 === 0 ? 6 : -6)); } ctx.stroke(); }
  } else if (pal.tex === 'plus') {
    ctx.fillStyle = dotCol;
    for (var dy = 16; dy < H; dy += 26) for (var dx = 16; dx < W; dx += 26) { ctx.beginPath(); ctx.arc(dx, dy, 1.4, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = dotCol; ctx.lineWidth = 0.7;
    for (var dy = 29; dy < H; dy += 26) for (var dx = 29; dx < W; dx += 26) { ctx.strokeRect(dx - 4, dy - 4, 8, 8); }
  }
  ctx.restore();
  }

  if(customBg){
    // Legibility boost: a soft dark halo behind all subsequent drawing (text,
    // badges, icons) keeps the fixed light text readable on ANY custom
    // background — light, dark, or busy photo — without needing to detect
    // background brightness. Left on for the rest of the draw.
    ctx.shadowColor='rgba(0,0,0,0.85)'; ctx.shadowBlur=5; ctx.shadowOffsetX=0; ctx.shadowOffsetY=1;
  }
  function _halo(){ if(customBg){ ctx.shadowColor='rgba(0,0,0,0.85)'; ctx.shadowBlur=5; ctx.shadowOffsetX=0; ctx.shadowOffsetY=1; } else { ctx.shadowBlur=0; } }

  // Decorative blob top-right
  ctx.save(); ctx.globalAlpha = 0.08;
  ctx.beginPath(); ctx.arc(W + 55, -55, 250, 0, Math.PI * 2);
  ctx.fillStyle = pal.sub; ctx.fill(); ctx.restore();

  // Decorative blob bottom-left
  ctx.save(); ctx.globalAlpha = 0.07;
  ctx.beginPath(); ctx.arc(-55, H + 55, 210, 0, Math.PI * 2);
  ctx.fillStyle = pal.accent; ctx.fill(); ctx.restore();

  // Top bar
  var tb = ctx.createLinearGradient(0, 0, W, 0);
  tb.addColorStop(0, 'transparent'); tb.addColorStop(0.15, pal.bar);
  tb.addColorStop(0.85, pal.bar); tb.addColorStop(1, 'transparent');
  ctx.fillStyle = tb; ctx.globalAlpha = 0.8;
  ctx.fillRect(0, 0, W, 5); ctx.globalAlpha = 1;

  // Bottom bar
  ctx.fillStyle = tb; ctx.globalAlpha = 0.5;
  ctx.fillRect(0, H - 4, W, 4); ctx.globalAlpha = 1;

  // Result count badge (top right)
  ctx.textAlign = 'right'; ctx.textBaseline = 'top';
  ctx.font = '700 10px "Segoe UI",Arial,sans-serif';
  ctx.fillStyle = pal.sub; ctx.globalAlpha = 0.75;
  ctx.fillText(resultLabel, W - PAD, 12); ctx.globalAlpha = 1;

  // Logo
  var logoTopY = 16, logoCX = W / 2, logoCY = logoTopY + LOGO_R;
  if (showLogo) {
    if (logoImg) {
      ctx.save();
      ctx.shadowColor = pal.accent; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(logoCX, logoCY, LOGO_R + 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = pal.sub; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.arc(logoCX, logoCY, LOGO_R, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(logoImg, logoCX - LOGO_R, logoTopY, LOGO_R * 2, LOGO_R * 2);
      ctx.restore();
    } else {
      ctx.font = '62px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('\uD83C\uDFC6', logoCX, logoCY + 2);
      ctx.textBaseline = 'alphabetic';
    }
  }

  // Fest name
  var iy = logoTopY + LOGO_R*2 + 14;
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  if (showFestName) {
    ctx.font = PF(17,800);
    ctx.fillStyle = L.textColor || pal.accent;
    ctx.fillText(cfg.festName || 'Winzera', W / 2, iy, W - PAD * 4); iy += Math.round(22*L.textScale);
  }
  if (showTagline) {
    ctx.font = 'italic ' + PF(11,700); ctx.fillStyle = L.textColor ? _hexAlpha(L.textColor,0.7) : pal.muted;
    ctx.fillText(cfg.tagline, W / 2, iy, W - PAD * 4); iy += Math.round(16*L.textScale);
  }
  if (showDateLine) {
    var _dvParts = [];
    if (showDateText) _dvParts.push(_fdPP);
    if (showVenueText) _dvParts.push(cfg.venue);
    ctx.font = PF(11,700); ctx.fillStyle = L.textColor ? _hexAlpha(L.textColor,0.75) : pal.muted;
    ctx.fillText(_dvParts.join(' · '), W / 2, iy, W - PAD * 4); iy += Math.round(16*L.textScale);
  }

  // Thin separator
  var sl = ctx.createLinearGradient(0, 0, W, 0);
  sl.addColorStop(0, 'transparent'); sl.addColorStop(0.15, pal.bar + '60');
  sl.addColorStop(0.85, pal.bar + '60'); sl.addColorStop(1, 'transparent');
  ctx.strokeStyle = sl; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD * 2, iy + 4); ctx.lineTo(W - PAD * 2, iy + 4); ctx.stroke();
  iy += 14;

  // Section + item name
  ctx.font = PF(11,700); ctx.fillStyle = L.textColor ? _hexAlpha(L.textColor,0.75) : pal.muted;
  ctx.fillText((item.section || ''), W / 2, iy, W - PAD * 3); iy += Math.round(18*L.textScale);
  ctx.font = PF(21,800); ctx.fillStyle = L.textColor || pal.accent;
  ctx.shadowColor = pal.accent + '30'; ctx.shadowBlur = 5;
  var iName = item.name || '', maxItemW = W - PAD * 4;
  if (ctx.measureText(iName).width <= maxItemW) {
    ctx.fillText(iName, W / 2, iy, maxItemW);
  } else {
    var wds = iName.split(' '), l1 = '', l2 = '';
    for (var wi = 0; wi < wds.length; wi++) {
      var t2 = (l1 ? l1 + ' ' : '') + wds[wi];
      if (ctx.measureText(t2).width > maxItemW && l1) { l2 = wds.slice(wi).join(' '); break; }
      l1 = t2;
    }
    ctx.font = PF(18,800);
    ctx.fillText(l1, W / 2, iy); if (l2) ctx.fillText(l2, W / 2, iy + Math.round(22*L.textScale));
  }
  ctx.shadowBlur = 0; ctx.textBaseline = 'alphabetic'; _halo();

  // Podium rows
  var MEDALS = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49'];
  var RANK_ACCENT = ['#c47a10', '#707880', '#b06020'];
  var rowY = H_HEADER + 12;

  // ── Attractive Rank Badges: Minimalist / Classic Ribbon / 3D Shield / Emoji ──
  var _BADGE_PAL = [
    {main:'#FFD700', dark:'#B8860B', light:'#FFF6D0', ink:'#3a2a00'}, // gold
    {main:'#C7CDD6', dark:'#8A8F98', light:'#F2F4F6', ink:'#2a2c30'}, // silver
    {main:'#CD7F32', dark:'#8B5A2B', light:'#EFC79A', ink:'#3a2308'}  // bronze
  ];
  function _drawRankBadge(style, rank, cx, cy, r){
    var c = _BADGE_PAL[Math.max(0, Math.min(2, rank-1))];
    if (style === 'emoji') {
      ctx.save(); ctx.font = Math.round(r*1.7)+'px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(MEDALS[rank-1]||'', cx, cy); ctx.restore();
      return;
    }
    if (style === 'minimal') {
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
      ctx.fillStyle = c.main; ctx.fill();
      ctx.lineWidth = Math.max(1, r*0.14); ctx.strokeStyle = c.dark; ctx.stroke();
      ctx.fillStyle = c.ink; ctx.font = '800 '+Math.round(r*1.05)+'px "Segoe UI",Arial,sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(rank), cx, cy+r*0.04);
      ctx.restore();
      return;
    }
    if (style === 'shield') {
      ctx.save();
      var w = r*1.6, h = r*2.05, top = cy - h/2, bottom = cy + h/2;
      ctx.beginPath();
      ctx.moveTo(cx-w/2, top+h*0.12);
      ctx.quadraticCurveTo(cx-w/2, top, cx-w/4, top);
      ctx.lineTo(cx+w/4, top);
      ctx.quadraticCurveTo(cx+w/2, top, cx+w/2, top+h*0.12);
      ctx.lineTo(cx+w/2, top+h*0.55);
      ctx.quadraticCurveTo(cx+w/2, top+h*0.85, cx, bottom);
      ctx.quadraticCurveTo(cx-w/2, top+h*0.85, cx-w/2, top+h*0.55);
      ctx.closePath();
      var grad = ctx.createLinearGradient(cx-w/2, top, cx+w/2, bottom);
      grad.addColorStop(0, c.light); grad.addColorStop(0.45, c.main); grad.addColorStop(1, c.dark);
      ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = r*0.3; ctx.shadowOffsetY = r*0.12;
      ctx.fillStyle = grad; ctx.fill();
      ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      ctx.lineWidth = Math.max(1, r*0.09); ctx.strokeStyle = c.dark; ctx.stroke();
      ctx.save(); ctx.clip();
      ctx.globalAlpha = 0.32; ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.moveTo(cx-w/2, top); ctx.lineTo(cx-w/6, top); ctx.lineTo(cx-w/2, top+h*0.5); ctx.closePath(); ctx.fill();
      ctx.restore();
      ctx.fillStyle = c.ink; ctx.font = '800 '+Math.round(r*1.05)+'px "Segoe UI",Arial,sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(rank), cx, top+h*0.42);
      ctx.restore();
      return;
    }
    // default: Classic Ribbon
    ctx.save();
    var tailW = r*0.62, tailH = r*1.65, tailGap = r*0.26;
    function tail(dx, rot){
      ctx.save();
      ctx.translate(cx+dx, cy+r*0.5); ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(-tailW/2, 0); ctx.lineTo(tailW/2, 0);
      ctx.lineTo(tailW/2, tailH); ctx.lineTo(0, tailH-tailW*0.5); ctx.lineTo(-tailW/2, tailH);
      ctx.closePath();
      ctx.fillStyle = c.dark; ctx.fill();
      ctx.restore();
    }
    tail(-tailGap, -0.18); tail(tailGap, 0.18);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
    var mgrad = ctx.createRadialGradient(cx-r*0.3, cy-r*0.3, r*0.1, cx, cy, r);
    mgrad.addColorStop(0, c.light); mgrad.addColorStop(0.55, c.main); mgrad.addColorStop(1, c.dark);
    ctx.fillStyle = mgrad; ctx.fill();
    ctx.lineWidth = Math.max(1, r*0.1); ctx.strokeStyle = c.dark; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r*0.72, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = Math.max(1, r*0.05); ctx.stroke();
    ctx.fillStyle = c.ink; ctx.font = '800 '+Math.round(r*1.0)+'px Georgia,serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(rank), cx, cy+r*0.04);
    ctx.restore();
  }

  // Helper: draw circular image on canvas
  function drawCircleImg(ctx, img, cx, cy, r){
    ctx.save();
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.clip();
    ctx.drawImage(img, cx-r, cy-r, r*2, r*2);
    ctx.restore();
  }

  // Draw a row (may be async due to photo loading); collect promises
  var rowPromises = top3.map(function(m, i) {
    return new Promise(function(resolve) {
      var name = '', team = '', photoSrc = null;
      if (item.type === 'group') {
        try {
          var grps = DB.groups();
          var gFound = grps.find(function(g) { return g.groupChestNo===m.chestNo&&_grpHasItem(g,item); });
          if (gFound) { name = gFound.name; team = gFound.team || ''; }
          else { name = 'Group #' + (m.chestNo || ''); }
        } catch(e) { name = '#' + (m.chestNo || ''); }
      } else {
        try {
          var ps = DB.participants();
          var pFound = ps.find(function(px) { return px.chestNo === m.chestNo; });
          if (pFound) { name = pFound.name; team = pFound.team || ''; photoSrc = pFound.photo||null; }
          else { name = '#' + m.chestNo; }
        } catch(e) { name = '#' + (m.chestNo || ''); }
      }

      var ry = rowY + i * ROW_H;
      var mi = Math.max(0, Math.min(2, (m._rank || (i+1)) - 1)); // medal/accent by ACTUAL rank, not array position — so tied ranks (e.g. three 1st-place ties) all get the same gold treatment instead of gold/silver/bronze
      var rowAcc = RANK_ACCENT[mi] || '#888888';
      var rowScale = ROW_H / 82;
      var PHOTO_R = 24 * L.photoScale * rowScale;
      var photoCX = PAD + 20 + PHOTO_R; // centre of photo circle
      var photoCY = ry + 36 * rowScale;

      function drawRow(photoImg) {
        // Row background
        ctx.save(); ctx.globalAlpha = 0.09;
        ctx.fillStyle = rowAcc;
        roundRectPath(ctx, PAD, ry, W - PAD * 2, 72*rowScale, 12);
        ctx.fill(); ctx.restore();

        // Left accent bar
        ctx.save(); ctx.globalAlpha = 0.85;
        ctx.fillStyle = rowAcc;
        roundRectPath(ctx, PAD, ry + 10*rowScale, 4, 52*rowScale, 2);
        ctx.fill(); ctx.restore();

        // Photo or badge
        if(photoImg && item.type !== 'group') {
          // Ring around photo
          ctx.save(); ctx.strokeStyle = rowAcc; ctx.lineWidth = 2; ctx.globalAlpha = 0.85;
          ctx.beginPath(); ctx.arc(photoCX, photoCY, PHOTO_R+2, 0, Math.PI*2); ctx.stroke(); ctx.restore();
          drawCircleImg(ctx, photoImg, photoCX, photoCY, PHOTO_R);
          // Rank badge bottom-right of photo
          _drawRankBadge(badgeStyle, mi+1, photoCX+PHOTO_R-2, photoCY+PHOTO_R-2, Math.max(9, PHOTO_R*0.42));
        } else if(item.type === 'group') {
          // Group rank badge (no photo available)
          _drawRankBadge(badgeStyle, mi+1, photoCX, photoCY, PHOTO_R*0.9);
        } else {
          // Initials circle avatar
          var col = _AVATAR_COLORS[(m.chestNo||0) % _AVATAR_COLORS.length];
          ctx.save(); ctx.beginPath(); ctx.arc(photoCX, photoCY, PHOTO_R, 0, Math.PI*2);
          ctx.fillStyle = col; ctx.fill(); ctx.restore();
          var initials = _getInitials(name);
          ctx.font = 'bold 15px "Segoe UI",Arial,sans-serif'; ctx.fillStyle = '#fff';
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(initials, photoCX, photoCY);
          // Rank badge
          _drawRankBadge(badgeStyle, mi+1, photoCX+PHOTO_R-2, photoCY+PHOTO_R-2, Math.max(9, PHOTO_R*0.42));
        }

        var textX = photoCX + PHOTO_R + 14;
        // Name
        ctx.font = PF(15,800);
        ctx.fillStyle = L.textColor || pal.text; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(name, textX, ry + 14*rowScale, W - textX - PAD - 8);

        // Team
        ctx.font = PF(11,700);
        ctx.fillStyle = L.textColor ? _hexAlpha(L.textColor,0.75) : pal.muted;
        ctx.fillText(team, textX, ry + 36*rowScale, W - textX - PAD - 8);

        resolve();
      }

      if(photoSrc && item.type !== 'group') {
        var img = new Image();
        img.onload = function(){ drawRow(img); };
        img.onerror = function(){ drawRow(null); };
        img.src = photoSrc;
      } else {
        drawRow(null);
      }
    });
  });

  Promise.all(rowPromises).then(function() {
  // Footer
  var fY = H_HEADER + H_PODIUM + 8;
  var fl = ctx.createLinearGradient(0, 0, W, 0);
  fl.addColorStop(0, 'transparent'); fl.addColorStop(0.15, pal.bar + '50');
  fl.addColorStop(0.85, pal.bar + '50'); fl.addColorStop(1, 'transparent');
  ctx.strokeStyle = fl; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD, fY); ctx.lineTo(W - PAD, fY); ctx.stroke();
  ctx.font = '700 11px "Segoe UI",Arial,sans-serif';
  ctx.fillStyle = pal.muted; ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  if (cfg.institution) ctx.fillText(cfg.institution, PAD, fY + 10, (W - PAD * 2) / 2 - 10);
  ctx.textAlign = 'right';
  ctx.fillText('Winzera · Competition Manager', W - PAD, fY + 10);

  cb(canvas.toDataURL('image/png'));
  }); // end Promise.all
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// Item/poster names get embedded inside a single-quoted JS string within an
// onclick="..." attribute (see shareResultImage, shareIndvChampionPoster).
// encodeURIComponent leaves the apostrophe character unescaped, so a name
// like "Qira'th" produced onclick="_downloadResultImg('Qira'th')" — the
// embedded apostrophe closed the string early and broke the handler, so
// Download/Share silently did nothing for any name containing one. This
// wrapper also escapes apostrophes (decodeURIComponent still recovers the
// original name, since %27 decodes back to ').
function _encForOnclickAttr(str){
  return encodeURIComponent(str).replace(/'/g,'%27');
}
function _downloadResultImg(encodedName){
  var a=document.createElement('a');
  a.href=window._lastShareDataUrl;
  a.download='result_'+decodeURIComponent(encodedName).replace(/[^a-z0-9]/gi,'_')+'.png';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  toast('Downloaded!');
}

function _shareViaAPI(encodedName){
  var name=decodeURIComponent(encodedName||'result');
  var fname=name.replace(/[^a-z0-9]/gi,'_')+'.png';
  var dataUrl=window._lastShareDataUrl;
  if(!dataUrl){ toast('No image to share','error'); return; }
  // Convert dataURL to blob then File
  fetch(dataUrl).then(function(r){return r.blob();}).then(function(blob){
    var file=new File([blob],fname,{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){
      navigator.share({files:[file],title:name}).catch(function(e){if(e.name!=='AbortError')toast('Share cancelled or failed','error');});
    } else if(navigator.share){
      // File share not supported — try URL share
      navigator.share({title:name,text:'Check out the result!'}).catch(function(e){if(e.name!=='AbortError')toast('Share cancelled','error');});
    } else {
      // Fallback: auto-download
      var a=document.createElement('a'); a.href=dataUrl; a.download=fname;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      toast('Share not supported — downloaded instead');
    }
  }).catch(function(){
    // fetch on dataURL failed (rare) — direct download fallback
    var a=document.createElement('a'); a.href=dataUrl; a.download=fname;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast('Downloaded!');
  });
}

// =============================================
// SHARE TEAM POINTS AS IMAGE
// =============================================
function shareTeamPointsImage(){
  var cfg=DB.config(), tp=calcTeamPoints();
  var sorted=Object.entries(tp).sort(function(a,b){return b[1].total-a[1].total;}).slice(0,8);
  if(!sorted.length||sorted[0][1].total===0) return toast('No declared results yet','error');
  var declared=DB.items().filter(function(i){return i.declared;}).length;
  function doDrawTeam(logoImg,customBg,layoutCfg){
    layoutCfg=layoutCfg||{};
    var L={showFestName:layoutCfg.showFestName!==false,showLogo:layoutCfg.showLogo!==false,logoScale:layoutCfg.logoScale||1,logoOffsetY:layoutCfg.logoOffsetY||0};
    var DPR=2, W=640, PAD=28;
    var LOGO_R=38*L.logoScale;
    var FEST_H=LOGO_R*2+78+(cfg.tagline?15:0);
    var TITLE_H=68; // "Team Standings" + declared count
    var SEP_H=32;
    var ROW_H=62, FOOTER_H=50;
    var HEADER_H=FEST_H+TITLE_H+SEP_H;
    var H=HEADER_H+(sorted.length*ROW_H)+FOOTER_H;
    var canvas=document.createElement('canvas');
    canvas.width=W*DPR; canvas.height=H*DPR;
    var ctx=canvas.getContext('2d'); ctx.scale(DPR,DPR);
    function trunc(t,mw,f){var tc=document.createElement('canvas').getContext('2d');tc.font=f;if(tc.measureText(t).width<=mw)return t;while(t.length>1&&tc.measureText(t+'\u2026').width>mw)t=t.slice(0,-1);return t+'\u2026';}

    // ── BACKGROUND: random palette (seeded by declared count) ──
    var TPAL=[
      {bg1:'#0a1628',bg2:'#0d1f3c',bg3:'#091420',dot:'#8080ff',glow:'rgba(255,180,20,0.13)',bar1:'#f0a500',bar2:'#ffcc00'},
      {bg1:'#071a16',bg2:'#0b2420',bg3:'#051310',dot:'#40e0b0',glow:'rgba(40,220,140,0.12)',bar1:'#00c896',bar2:'#00e8b0'},
      {bg1:'#120820',bg2:'#1a0d35',bg3:'#0d0618',dot:'#c080ff',glow:'rgba(160,80,255,0.14)',bar1:'#a050f0',bar2:'#c880ff'},
      {bg1:'#1a0810',bg2:'#2a0d18',bg3:'#120508',dot:'#ff8080',glow:'rgba(255,60,100,0.13)',bar1:'#e02060',bar2:'#ff4080'},
      {bg1:'#081828',bg2:'#0c2035',bg3:'#061018',dot:'#60c8ff',glow:'rgba(40,160,255,0.13)',bar1:'#0090e0',bar2:'#40c0ff'},
    ];
    var tpal=TPAL[declared%TPAL.length]||TPAL[1];
    if(customBg){
      drawImageCover(ctx,customBg,0,0,W,H);
      ctx.shadowColor='rgba(0,0,0,0.85)'; ctx.shadowBlur=5; ctx.shadowOffsetX=0; ctx.shadowOffsetY=1;
    } else {
    var bg=ctx.createLinearGradient(0,0,W,H);
    bg.addColorStop(0,tpal.bg1); bg.addColorStop(0.5,tpal.bg2); bg.addColorStop(1,tpal.bg3);
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    ctx.save(); ctx.globalAlpha=0.035; ctx.fillStyle=tpal.dot;
    for(var dy=10;dy<H;dy+=22) for(var dx=10;dx<W;dx+=22){ctx.beginPath();ctx.arc(dx,dy,1,0,Math.PI*2);ctx.fill();}
    ctx.restore();
    var gl=ctx.createRadialGradient(W/2,0,0,W/2,0,340);
    gl.addColorStop(0,tpal.glow); gl.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=gl; ctx.fillRect(0,0,W,H);
    var festBand=ctx.createLinearGradient(0,0,0,FEST_H);
    festBand.addColorStop(0,'rgba(255,200,40,0.06)'); festBand.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=festBand; ctx.fillRect(0,0,W,FEST_H);
    var tb=ctx.createLinearGradient(0,0,W,0);
    tb.addColorStop(0,'transparent'); tb.addColorStop(0.2,tpal.bar1); tb.addColorStop(0.8,tpal.bar2); tb.addColorStop(1,'transparent');
    ctx.fillStyle=tb; ctx.fillRect(0,0,W,5);
    var bb=ctx.createLinearGradient(0,0,W,0);
    bb.addColorStop(0,'transparent'); bb.addColorStop(0.2,tpal.bar1); bb.addColorStop(0.8,tpal.bar2); bb.addColorStop(1,'transparent');
    ctx.fillStyle=bb; ctx.fillRect(0,H-5,W,5);
    ctx.strokeStyle='rgba(240,180,0,0.2)'; ctx.lineWidth=1; ctx.strokeRect(10,10,W-20,H-20);
    }
    function _halo(){ if(customBg){ ctx.shadowColor='rgba(0,0,0,0.85)'; ctx.shadowBlur=5; ctx.shadowOffsetX=0; ctx.shadowOffsetY=1; } else { ctx.shadowBlur=0; } }

    // ── LOGO (top-centre) ──
    var logoTopY=18+L.logoOffsetY, logoCX=W/2, logoCY=logoTopY+LOGO_R;
    if(L.showLogo){
      if(logoImg){
        ctx.save(); ctx.shadowColor='rgba(255,180,0,0.35)'; ctx.shadowBlur=18;
        ctx.beginPath(); ctx.arc(logoCX,logoCY,LOGO_R+3,0,Math.PI*2);
        ctx.strokeStyle='rgba(240,165,0,0.9)'; ctx.lineWidth=3; ctx.stroke(); ctx.restore();
        ctx.save();
        ctx.beginPath(); ctx.arc(logoCX,logoCY,LOGO_R,0,Math.PI*2); ctx.clip();
        ctx.drawImage(logoImg,logoCX-LOGO_R,logoTopY,LOGO_R*2,LOGO_R*2); ctx.restore();
      } else {
        ctx.font=Math.round(62*L.logoScale)+'px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('\uD83C\uDFC6',logoCX,logoCY+4); ctx.textBaseline='alphabetic';
      }
    }

    // ── FESTIVAL INFO (centred) ──
    var iy=logoTopY+(L.showLogo?LOGO_R*2:6)+16;
    ctx.textAlign='center'; ctx.textBaseline='top';
    if(L.showFestName){
      ctx.font='800 18px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='#ffd700';
      ctx.shadowColor='rgba(255,200,0,0.3)'; ctx.shadowBlur=8;
      ctx.fillText(cfg.festName||'Winzera',W/2,iy,W-PAD*4); iy+=24; _halo();
      if(cfg.tagline){
        ctx.font='italic 700 11px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(255,215,0,0.75)';
        ctx.fillText(cfg.tagline,W/2,iy,W-PAD*4); iy+=15;
      }
      var _fd2=formatFestDate(cfg);
      if(cfg.venue||_fd2){
        ctx.font='700 11px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(180,160,220,0.65)';
        ctx.fillText((cfg.venue||'')+(cfg.venue&&_fd2?', ':'')+(_fd2||''),W/2,iy,W-PAD*3); iy+=16;
      }
    }
    ctx.textBaseline='alphabetic';

    // ── TITLE ZONE ──
    var titleZoneY=FEST_H;
    var sl=ctx.createLinearGradient(0,0,W,0);
    sl.addColorStop(0,'transparent'); sl.addColorStop(0.2,'rgba(255,200,0,0.25)'); sl.addColorStop(0.8,'rgba(255,200,0,0.25)'); sl.addColorStop(1,'transparent');
    ctx.strokeStyle=sl; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(PAD*2,titleZoneY); ctx.lineTo(W-PAD*2,titleZoneY); ctx.stroke();
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.font='800 24px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='#ffffff';
    ctx.shadowColor='rgba(200,180,255,0.4)'; ctx.shadowBlur=14;
    ctx.fillText('Team Standings',W/2,titleZoneY+10);
    _halo();
    ctx.font='700 11px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(180,200,255,0.55)';
    var _totalI=DB.items().length;
    var _teamSubLabel=(declared>=_totalI&&_totalI>0)?'Final Result':(declared+'/'+_totalI+' Results');
    ctx.fillText(_teamSubLabel,W/2,titleZoneY+40);
    ctx.textBaseline='alphabetic';

    // ── COL HEADERS ──
    var divY=HEADER_H-SEP_H+6;
    var hdl=ctx.createLinearGradient(0,0,W,0);
    hdl.addColorStop(0,'transparent'); hdl.addColorStop(0.1,'rgba(240,165,0,0.3)'); hdl.addColorStop(0.9,'rgba(240,165,0,0.3)'); hdl.addColorStop(1,'transparent');
    ctx.strokeStyle=hdl; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(PAD,divY); ctx.lineTo(W-PAD,divY); ctx.stroke();
    ctx.save(); ctx.fillStyle='#f0a500'; ctx.translate(W/2,divY); ctx.rotate(Math.PI/4); ctx.fillRect(-4,-4,8,8); ctx.restore();
    ctx.font='700 9px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(140,160,200,0.55)';
    ctx.textAlign='left'; ctx.fillText('POS',PAD,HEADER_H-10); ctx.fillText('TEAM',PAD+60,HEADER_H-10);
    ctx.textAlign='right'; ctx.fillText('PTS',W-PAD,HEADER_H-10);

    var RC=['#ffd700','#c0c0c0','#cd7f32'];
    sorted.forEach(function(entry,i){
      var teamName=entry[0], pts=entry[1];
      var rowY=HEADER_H+(i*ROW_H), rowCY=rowY+ROW_H/2;
      var isTop3=i<3;
      ctx.fillStyle=i%2===0?'rgba(255,255,255,0.018)':'rgba(0,0,0,0)'; ctx.fillRect(PAD-8,rowY,W-PAD*2+16,ROW_H);
      if(isTop3){ctx.fillStyle=RC[i]; ctx.fillRect(PAD-8,rowY+10,3,ROW_H-20);}
      var bW=50,bH=27,bX=PAD,bY=rowCY-13;
      ctx.beginPath(); ctx.roundRect(bX,bY,bW,bH,14);
      ctx.fillStyle=isTop3?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.04)'; ctx.fill();
      ctx.strokeStyle=isTop3?RC[i]:'rgba(180,160,220,0.15)'; ctx.lineWidth=1; ctx.stroke();
      ctx.font='800 12px "Segoe UI",Arial,sans-serif'; ctx.fillStyle=isTop3?RC[i]:'rgba(185,165,215,0.65)'; ctx.textAlign='center';
      ctx.fillText(['1st','2nd','3rd'][i]||(i+1)+'th',bX+bW/2,rowCY+4);
      ctx.textAlign='left'; ctx.font='800 15px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='#eef2ff';
      if(isTop3){ctx.shadowColor=RC[i]; ctx.shadowBlur=5;}
      ctx.fillText(trunc(teamName,W-PAD-60-70,'700 15px "Segoe UI",Arial'),PAD+60,rowCY+5);
      _halo();
      ctx.font='800 18px "Segoe UI",Arial,sans-serif'; ctx.fillStyle=isTop3?RC[i]:'rgba(185,165,215,0.8)';
      ctx.textAlign='right'; ctx.fillText(pts.total,W-PAD,rowCY+6);
      if(i<sorted.length-1){ctx.strokeStyle='rgba(255,255,255,0.055)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(PAD,rowY+ROW_H); ctx.lineTo(W-PAD,rowY+ROW_H); ctx.stroke();}
    });

    var fY=HEADER_H+(sorted.length*ROW_H);
    var fl=ctx.createLinearGradient(0,0,W,0);
    fl.addColorStop(0,'transparent'); fl.addColorStop(0.1,'rgba(240,165,0,0.25)'); fl.addColorStop(0.9,'rgba(240,165,0,0.25)'); fl.addColorStop(1,'transparent');
    ctx.strokeStyle=fl; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(PAD,fY+10); ctx.lineTo(W-PAD,fY+10); ctx.stroke();
    ctx.font='700 11px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(200,190,240,0.7)';
    ctx.textAlign='left';
    if(cfg.institution) ctx.fillText(trunc(cfg.institution,(W-PAD*2)/2-10,'500 11px Arial'),PAD,fY+30);
    ctx.font='700 11px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(150,130,190,0.6)';
    ctx.textAlign='right'; ctx.fillText('Winzera \xb7 Competition Manager',W-PAD,fY+30);
    var dataUrl=canvas.toDataURL('image/png');
    window._lastShareDataUrl=dataUrl;
    showModal('<div style="text-align:center">'
      +'<div class="modal-handle"></div>'
      +'<div style="font-size:1rem;font-weight:800;margin-bottom:12px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></svg> Share Team Standings</div>'
      +'<img src="'+dataUrl+'" style="width:100%;border-radius:10px;border:1px solid var(--border);margin-bottom:14px">'
      +'<div style="display:flex;gap:8px">'
      +'<button class="btn btn-primary" style="flex:1" onclick="_downloadResultImg(\'Team_Standings\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg> Download</button>'
      +'<button class="btn btn-success" style="flex:1" onclick="_shareViaAPI(\'Team_Standings\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg> Share</button>'
      +'</div>'
      +'<button class="btn btn-secondary" style="width:100%;margin-top:8px" onclick="closeModal()">Close</button>'
      +'</div>');
  }
  var _preset=getActivePosterPreset();
  function _startDraw(){
    if(cfg.logo){var li=new Image();li.onload=function(){doDrawTeam(li,window._presetBgImg,(_preset&&_preset.layout)||null);};li.onerror=function(){doDrawTeam(null,window._presetBgImg,(_preset&&_preset.layout)||null);};li.src=cfg.logo;}
    else{doDrawTeam(null,window._presetBgImg,(_preset&&_preset.layout)||null);}
  }
  window._presetBgImg=null;
  if(_preset&&_preset.bg){
    var bi=new Image();
    bi.onload=function(){ window._presetBgImg=bi; _startDraw(); };
    bi.onerror=function(){ window._presetBgImg=null; _startDraw(); };
    bi.src=_preset.bg;
  } else { _startDraw(); }
}

function shareIndvChampionPoster(section, tab){
  var participants=DB.participants(), marks=DB.marks(), items=DB.items(), cfg=DB.config();
  var declaredItems=items.filter(function(i){return i.declared;});
  var filtered=section==='All'?participants:participants.filter(function(p){return p.section===section;});
  var indvPoints=filtered.map(function(p){return Object.assign({p:p},calcIndvPoints(p,declaredItems,marks,cfg));}).filter(function(x){return x.total>0||x.r1>0;});
  var ptKey=tab==='stage'?'stage':tab==='offstage'?'offStage':'total';
  var sorted=indvPoints.filter(function(x){return x[ptKey]>0;}).sort(function(a,b){return b[ptKey]-a[ptKey];});
  if(!sorted.length) return toast('No champion data yet','error');
  var champion=sorted[0];
  var tabLabel=tab==='stage'?'On-Stage Champion':tab==='offstage'?'Off-Stage Champion':'Individual Champion';

  function doDrawChamp(logoImg,customBg,layoutCfg){
    layoutCfg=layoutCfg||{};
    var L={showFestName:layoutCfg.showFestName!==false,showLogo:layoutCfg.showLogo!==false,logoScale:layoutCfg.logoScale||1,logoOffsetY:layoutCfg.logoOffsetY||0};
    var DPR=2, W=640, H=520, PAD=28;
    var canvas=document.createElement('canvas');
    canvas.width=W*DPR; canvas.height=H*DPR;
    var ctx=canvas.getContext('2d'); ctx.scale(DPR,DPR);
    function trunc(t,mw,f){var tc=document.createElement('canvas').getContext('2d');tc.font=f;if(tc.measureText(t).width<=mw)return t;while(t.length>1&&tc.measureText(t+'\u2026').width>mw)t=t.slice(0,-1);return t+'\u2026';}

    // ── BACKGROUND: palette seeded by tab (stage/offstage/total) ──
    var CPAL=[
      {bg1:'#120820',bg2:'#1a0d35',bg3:'#0d0618',dot:'#c080ff',glow:'rgba(160,80,255,0.14)',bar1:'#a050f0',bar2:'#c880ff'},
      {bg1:'#071a16',bg2:'#0b2420',bg3:'#051310',dot:'#40e0b0',glow:'rgba(40,220,140,0.12)',bar1:'#00c896',bar2:'#00e8b0'},
      {bg1:'#0a1628',bg2:'#0d1f3c',bg3:'#091420',dot:'#8080ff',glow:'rgba(255,180,20,0.13)',bar1:'#f0a500',bar2:'#ffcc00'},
    ];
    var cpalIdx=tab==='stage'?0:tab==='offstage'?1:2;
    var cpal=CPAL[cpalIdx];
    if(customBg){
      drawImageCover(ctx,customBg,0,0,W,H);
      ctx.shadowColor='rgba(0,0,0,0.85)'; ctx.shadowBlur=5; ctx.shadowOffsetX=0; ctx.shadowOffsetY=1;
    } else {
    var bg=ctx.createLinearGradient(0,0,W,H);
    bg.addColorStop(0,cpal.bg1); bg.addColorStop(0.5,cpal.bg2); bg.addColorStop(1,cpal.bg3);
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
    ctx.save(); ctx.globalAlpha=0.035; ctx.fillStyle=cpal.dot;
    for(var dy=10;dy<H;dy+=22) for(var dx=10;dx<W;dx+=22){ctx.beginPath();ctx.arc(dx,dy,1,0,Math.PI*2);ctx.fill();}
    ctx.restore();
    var gl=ctx.createRadialGradient(W/2,0,0,W/2,0,340);
    gl.addColorStop(0,cpal.glow); gl.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=gl; ctx.fillRect(0,0,W,H);
    var gl2=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,260);
    gl2.addColorStop(0,'rgba(80,40,160,0.08)'); gl2.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=gl2; ctx.fillRect(0,0,W,H);
    var tb=ctx.createLinearGradient(0,0,W,0);
    tb.addColorStop(0,'transparent'); tb.addColorStop(0.2,cpal.bar1); tb.addColorStop(0.8,cpal.bar2); tb.addColorStop(1,'transparent');
    ctx.fillStyle=tb; ctx.fillRect(0,0,W,5);
    var bb=ctx.createLinearGradient(0,0,W,0);
    bb.addColorStop(0,'transparent'); bb.addColorStop(0.2,cpal.bar1); bb.addColorStop(0.8,cpal.bar2); bb.addColorStop(1,'transparent');
    ctx.fillStyle=bb; ctx.fillRect(0,H-5,W,5);
    ctx.strokeStyle='rgba(240,180,0,0.2)'; ctx.lineWidth=1; ctx.strokeRect(10,10,W-20,H-20);
    }
    function _halo(){ if(customBg){ ctx.shadowColor='rgba(0,0,0,0.85)'; ctx.shadowBlur=5; ctx.shadowOffsetX=0; ctx.shadowOffsetY=1; } else { ctx.shadowBlur=0; } }

    // ── LOGO (top-centre) ──
    var LOGO_R=38*L.logoScale, logoTopY=18+L.logoOffsetY, logoCX=W/2, logoCY=logoTopY+LOGO_R;
    if(L.showLogo){
      if(logoImg){
        ctx.save(); ctx.shadowColor='rgba(255,180,0,0.35)'; ctx.shadowBlur=18;
        ctx.beginPath(); ctx.arc(logoCX,logoCY,LOGO_R+3,0,Math.PI*2);
        ctx.strokeStyle='rgba(240,165,0,0.9)'; ctx.lineWidth=3; ctx.stroke(); ctx.restore();
        ctx.save(); ctx.beginPath(); ctx.arc(logoCX,logoCY,LOGO_R,0,Math.PI*2); ctx.clip();
        ctx.drawImage(logoImg,logoCX-LOGO_R,logoTopY,LOGO_R*2,LOGO_R*2); ctx.restore();
      } else {
        ctx.font=Math.round(62*L.logoScale)+'px serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('\uD83C\uDFC6',logoCX,logoCY+4); ctx.textBaseline='alphabetic';
      }
    }

    // ── FESTIVAL INFO (centred) ──
    var iy=logoTopY+(L.showLogo?LOGO_R*2:6)+16;
    ctx.textAlign='center'; ctx.textBaseline='top';
    if(L.showFestName){
      ctx.font='800 18px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='#ffd700';
      ctx.shadowColor='rgba(255,200,0,0.3)'; ctx.shadowBlur=8;
      ctx.fillText(cfg.festName||'Winzera',W/2,iy,W-PAD*4); iy+=24; _halo();
      if(cfg.tagline){
        ctx.font='italic 700 11px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(255,215,0,0.75)';
        ctx.fillText(cfg.tagline,W/2,iy,W-PAD*4); iy+=15;
      }
      var _fd3=formatFestDate(cfg);
      if(cfg.venue||_fd3){
        ctx.font='700 11px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(180,160,220,0.65)';
        ctx.fillText((cfg.venue||'')+(cfg.venue&&_fd3?', ':'')+(_fd3||''),W/2,iy,W-PAD*3);
      }
    }
    ctx.textBaseline='alphabetic';

    // ── DIVIDER ──
    var divY=logoTopY+LOGO_R*2+108;
    var sl=ctx.createLinearGradient(0,0,W,0);
    sl.addColorStop(0,'transparent'); sl.addColorStop(0.2,'rgba(255,200,0,0.3)'); sl.addColorStop(0.8,'rgba(255,200,0,0.3)'); sl.addColorStop(1,'transparent');
    ctx.strokeStyle=sl; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(PAD*2,divY); ctx.lineTo(W-PAD*2,divY); ctx.stroke();
    ctx.save(); ctx.fillStyle='#f0a500'; ctx.translate(W/2,divY); ctx.rotate(Math.PI/4); ctx.fillRect(-4,-4,8,8); ctx.restore();

    // ── CHAMPION CONTENT ──
    var cY=divY+22;
    // Champion type label (e.g. "INDIVIDUAL CHAMPION")
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.font='700 11px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(200,220,255,0.7)';
    ctx.fillText(tabLabel.toUpperCase(),W/2,cY,W-PAD*3); cY+=20;
    // Section sub-label
    if(section&&section!=='All'){
      ctx.font='700 10px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(160,180,230,0.55)';
      ctx.fillText(section,W/2,cY,W-PAD*4); cY+=16;
    }
    cY+=4;

    // Champion photo or avatar circle
    var CPHOTO_R=52;
    var champPhotoSrc=champion.p&&champion.p.photo?champion.p.photo:null;
    function drawChampContent(champPhotoImg){
      if(champPhotoImg){
        // Glow ring
        ctx.save(); ctx.shadowColor=cpal.bar1; ctx.shadowBlur=22;
        ctx.beginPath(); ctx.arc(W/2,cY+CPHOTO_R,CPHOTO_R+4,0,Math.PI*2);
        ctx.strokeStyle=cpal.bar1; ctx.lineWidth=3; ctx.stroke(); ctx.restore();
        // Clip and draw photo
        ctx.save(); ctx.beginPath(); ctx.arc(W/2,cY+CPHOTO_R,CPHOTO_R,0,Math.PI*2); ctx.clip();
        ctx.drawImage(champPhotoImg,W/2-CPHOTO_R,cY,CPHOTO_R*2,CPHOTO_R*2); ctx.restore();
      } else {
        // Initials avatar circle
        var col=_AVATAR_COLORS[(champion.p&&champion.p.chestNo||0)%_AVATAR_COLORS.length];
        ctx.save(); ctx.beginPath(); ctx.arc(W/2,cY+CPHOTO_R,CPHOTO_R,0,Math.PI*2);
        ctx.fillStyle=col; ctx.fill(); ctx.restore();
        // Glow
        ctx.save(); ctx.shadowColor=cpal.bar1; ctx.shadowBlur=18;
        ctx.beginPath(); ctx.arc(W/2,cY+CPHOTO_R,CPHOTO_R+2,0,Math.PI*2);
        ctx.strokeStyle=cpal.bar1+'99'; ctx.lineWidth=2.5; ctx.stroke(); ctx.restore();
        var champInitials=_getInitials(champion.p&&champion.p.name||'');
        ctx.font='bold 30px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='#fff';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(champInitials,W/2,cY+CPHOTO_R+1);
      }
      cY+=CPHOTO_R*2+18;
      ctx.textAlign='center'; ctx.textBaseline='top';
      // Champion name — large gold, wrapping
      ctx.font='bold 28px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='#ffd700';
      ctx.shadowColor='rgba(255,215,0,0.4)'; ctx.shadowBlur=16;
      var champName=champion.p.name||'', maxNW=W-PAD*3;
      if(ctx.measureText(champName).width<=maxNW){
        ctx.fillText(champName,W/2,cY); cY+=38;
      } else {
        var cws=champName.split(' '),cl1='',cl2='';
        for(var ci=0;ci<cws.length;ci++){var ct=(cl1?cl1+' ':'')+cws[ci];if(ctx.measureText(ct).width>maxNW&&cl1){cl2=cws.slice(ci).join(' ');break;}cl1=ct;}
        ctx.font='bold 22px "Segoe UI",Arial,sans-serif';
        ctx.fillText(cl1,W/2,cY); if(cl2) ctx.fillText(cl2,W/2,cY+28); cY+=cl2?60:38;
      }
      _halo();
      // Team · section
      ctx.font='700 14px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(200,185,255,0.75)';
      ctx.fillText(champion.p.team+(champion.p.section?' \xb7 '+champion.p.section:''),W/2,cY,W-PAD*3); cY+=26;
      // Points badge
      var ptStr=(champion[ptKey]||0)+' Points';
      ctx.font='bold 17px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='#f0a500';
      ctx.shadowColor='rgba(240,165,0,0.3)'; ctx.shadowBlur=10;
      ctx.fillText(ptStr,W/2,cY);
      _halo(); ctx.textBaseline='alphabetic';

      // ── FOOTER: institution left, app credit right ──
      var fY=H-38;
      var fl=ctx.createLinearGradient(0,0,W,0);
      fl.addColorStop(0,'transparent'); fl.addColorStop(0.1,'rgba(240,165,0,0.25)'); fl.addColorStop(0.9,'rgba(240,165,0,0.25)'); fl.addColorStop(1,'transparent');
      ctx.strokeStyle=fl; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(PAD,fY); ctx.lineTo(W-PAD,fY); ctx.stroke();
      ctx.font='700 11px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(200,190,240,0.7)';
      ctx.textAlign='left';
      if(cfg.institution) ctx.fillText(trunc(cfg.institution,(W-PAD*2)/2-10,'500 11px Arial'),PAD,fY+22);
      ctx.font='700 11px "Segoe UI",Arial,sans-serif'; ctx.fillStyle='rgba(150,130,190,0.6)';
      ctx.textAlign='right'; ctx.fillText('Winzera \xb7 Competition Manager',W-PAD,fY+22);
      var dataUrl=canvas.toDataURL('image/png');
      window._lastShareDataUrl=dataUrl;
      showModal('<div style="text-align:center">'
        +'<div class="modal-handle"></div>'
        +'<div style="font-size:1rem;font-weight:800;margin-bottom:12px"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M5 4H3v2a4 4 0 0 0 4 4"/><path d="M19 4h2v2a4 4 0 0 1-4 4"/></svg> Share Champion Poster</div>'
        +'<img src="'+dataUrl+'" style="width:100%;border-radius:10px;border:1px solid var(--border);margin-bottom:14px">'
        +'<div style="display:flex;gap:8px">'
        +'<button class="btn btn-primary" style="flex:1" onclick="_downloadResultImg(\''+_encForOnclickAttr(tabLabel.replace(/ /g,'_'))+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg> Download</button>'
        +'<button class="btn btn-success" style="flex:1" onclick="_shareViaAPI(\''+_encForOnclickAttr(tabLabel.replace(/ /g,'_'))+'\')"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg> Share</button>'
        +'</div>'
        +'<button class="btn btn-secondary" style="width:100%;margin-top:8px" onclick="closeModal()">Close</button>'
        +'</div>');
    }
    if(champPhotoSrc){
      var ci=new Image(); ci.onload=function(){drawChampContent(ci);}; ci.onerror=function(){drawChampContent(null);}; ci.src=champPhotoSrc;
    } else { drawChampContent(null); }
  }
  var _preset=getActivePosterPreset();
  function _startDraw(){
    if(cfg.logo){var li=new Image();li.onload=function(){doDrawChamp(li,window._presetBgImg,(_preset&&_preset.layout)||null);};li.onerror=function(){doDrawChamp(null,window._presetBgImg,(_preset&&_preset.layout)||null);};li.src=cfg.logo;}
    else{doDrawChamp(null,window._presetBgImg,(_preset&&_preset.layout)||null);}
  }
  window._presetBgImg=null;
  if(_preset&&_preset.bg){
    var bi=new Image();
    bi.onload=function(){ window._presetBgImg=bi; _startDraw(); };
    bi.onerror=function(){ window._presetBgImg=null; _startDraw(); };
    bi.src=_preset.bg;
  } else { _startDraw(); }
}

var _hasNavigated=false; // guards safeNavigate so splash exit logic only ever runs once

// Auth-aware routing: decides where the splash hands off to, based purely on
// the current session state.
// A logged-in relaunch has real network work to do (re-validate the
// session, pull fresh data) before the dashboard can show — on a slower
// connection or a PC without a warm cache, that gap was completely blank,
// which looked like the app had frozen. This gives it a visible pulse so
// it's obviously still working, not stuck.
function _wzShowSyncingOverlay(msg){
  var el=document.getElementById('wzSyncOverlay');
  if(!el){
    el=document.createElement('div');
    el.id='wzSyncOverlay';
    el.style.cssText='position:fixed;inset:0;z-index:4000;background:var(--bg,#0d0618);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px';
    el.innerHTML='<div style="width:36px;height:36px;border:3px solid rgba(240,165,0,.25);border-top-color:#f0a500;border-radius:50%;animation:wzspin .8s linear infinite"></div>'
      +'<div id="wzSyncOverlayMsg" style="color:#b0a0d0;font-size:.85rem"></div>'
      +'<style>@keyframes wzspin{to{transform:rotate(360deg)}}</style>';
    document.body.appendChild(el);
  }
  document.getElementById('wzSyncOverlayMsg').textContent=msg||'Loading\u2026';
  el.style.display='flex';
}
function _wzHideSyncingOverlay(){
  var el=document.getElementById('wzSyncOverlay');
  if(el) el.style.display='none';
}

async function checkAuthAndNavigate(){
  var splash=document.getElementById('splash');
  splash.classList.add('wz14-leave');
  setTimeout(async function(){
    splash.style.display='none';
    document.body.classList.remove('wz14-lock');
    var session=getSession();
    var cfg=DB.config();
    document.getElementById('loginFestName').textContent=cfg.festName||'Winzera';
    var isLoggedIn = !!(session && (session.role==='admin' || session.role==='team'));
    if(isLoggedIn) _wzShowSyncingOverlay('Loading your dashboard\u2026');
    // Re-validate against the real backend on every relaunch — a session
    // object sitting in localStorage is never enough on its own to grant
    // access; only a live Supabase session (admin) or a still-valid
    // server-issued token (team) does.
    if(isLoggedIn && window.WinzeraSync){
      try{
        if(session.role==='admin'){
          var adminInfo = await window.WinzeraSync.adminRestoreSession();
          var route=location.pathname.split('/').filter(Boolean);
          if(adminInfo && ((route[0]==='super-admin' && adminInfo.role!=='super_admin') ||
             (route.length>1 && route[1]==='admin' && adminInfo.role!=='super_admin' && adminInfo.orgCode!==route[0]))) adminInfo=null;
          if(!adminInfo){ isLoggedIn=false; clearSession(); }
          else{
            session.orgCode = adminInfo.orgCode; setSession(session);
            await _wzBootstrapAdminSync(adminInfo.orgId || session.orgId);
          }
        } else if(session.role==='team' && !session.offline){
          var teamInfo = await window.WinzeraSync.teamRestoreSession();
          if(!teamInfo){ isLoggedIn=false; clearSession(); }
          else _wzApplyTeamDashboard(teamInfo.dash);
        }
      }catch(e){ console.error('Session revalidation failed:', e); }
    }
    _wzHideSyncingOverlay();
    if(isLoggedIn){
      if(session.role==='team' && _teamIsLocked(session.teamId)){
        // No dedicated "team-locked" page exists in this app — land on the
        // team login tab with the same locked message doTeamLogin() shows,
        // instead of navigating to a page that doesn't exist.
        clearSession();
        _mountLoginForms();
        document.getElementById('loginScreen').style.display='block';
        setLoginRole('team');
        _loginErr('This team account has been locked by the Admin.');
        return;
      }
      document.getElementById('app').style.display='flex';
      applyRoleUI();
      navigate(session.role==='team'?'teamHome':'dashboard', {}, false);
    } else {
      // No valid session — covers brand-new users, signed-out users, and
      // legacy users updating from a version that predates saved sessions.
      clearSession();
      _mountLoginForms();
      document.getElementById('loginScreen').style.display='block';
      setLoginRole('admin');
    }
  }, 600);
}

// One-shot wrapper: no matter how many times startup code tries to trigger
// the splash exit (normal completion, error path, 5s watchdog), only the
// first call actually runs.
function safeNavigate(){
  if(_hasNavigated) return;
  _hasNavigated=true;
  checkAuthAndNavigate();
}

function _teamIsLocked(teamId){
  var t=DB.teams().find(function(x){ return x.id===teamId; });
  return !t || !!t.locked;
}
function _orgCodeBannerHTML(){
  var s=getSession();
  var code=(s&&s.orgCode)?s.orgCode:'';
  if(!code) return '';
  return '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:rgba(74,158,255,.08);border:1px solid rgba(74,158,255,.3);border-radius:10px;padding:10px 12px;margin-bottom:14px">'
    +'<div><div style="font-size:.68rem;color:var(--text3);text-transform:uppercase;letter-spacing:.04em">Organization Code \u2014 give this to your Team Managers</div>'
    +'<div style="font-size:1.05rem;font-weight:800;letter-spacing:.08em;color:var(--accent)" id="orgCodeText">'+code+'</div></div>'
    +'<button class="btn btn-secondary btn-sm" onclick="copyOrgCode()"><svg viewBox="0 0 24 24" style="width:1em;height:1em;vertical-align:-0.15em;flex-shrink:0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</button>'
    +'</div>';
}
function copyOrgCode(){
  var s=getSession();
  if(!s||!s.orgCode) return;
  var done=function(){ toast('Organization Code copied!'); };
  if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(s.orgCode).then(done).catch(done); }
  else{
    var ta=document.createElement('textarea'); ta.value=s.orgCode; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); }catch(e){}
    document.body.removeChild(ta); done();
  }
}

// All startup data/service work the splash waits on.
// One-time migration: older data (declared before the "declaredAt" timestamp
// existed) has declared items with no declaredAt at all. Left alone, those
// items all tie at 0 when sorted by recency, so the Recent Results feed and
// full-screen recap fall back to whatever order they happen to sit in in the
// items list — which can look like "oldest/first declared shows first"
// instead of true declare order. This only ever mattered for pre-existing
// local IndexedDB installs from before Winzera went fully online — real
// server data is reconciled once, directly in Supabase, not per-device here.
async function initAppDataAndServices(){
  // Nothing to load locally anymore — checkAuthAndNavigate() (below) is what
  // actually populates _mem, via _wzBootstrapAdminSync()/_wzApplyTeamDashboard()
  // once the server session is verified.
}

async function _launchApp(){
  // A broadcast link (?view=broadcast&token=...) skips the entire
  // app/login flow — no splash, no auth, straight to the live viewer.
  var _urlParams=new URLSearchParams(location.search);
  // Root is intentionally not an institute. Only the super admin provisions institutes.
  if(location.pathname==='/' || location.pathname==='/index.html'){
    if(!_urlParams.has('view')){
      var splashRoot=document.getElementById('splash');
      if(splashRoot) splashRoot.style.display='none';
      document.body.classList.remove('wz14-lock');
      var root=document.createElement('main');
      root.setAttribute('role','main');
      root.style.cssText='position:fixed;inset:0;display:grid;place-items:center;background:#0d0618;color:#f3edff;font:500 17px system-ui,sans-serif;text-align:center;padding:24px;z-index:2147483645';
      root.innerHTML='<div><h1 style="font-size:26px;margin:0 0 12px">Winzera Pro</h1><p style="opacity:.8;margin:0">Use Winzera Pro with an institution.</p></div>';
      document.body.appendChild(root);
      return;
    }
  }
  // Institute-first deep links. Keep legacy ?view=broadcast&org= links working.
  var _routeParts=location.pathname.split('/').filter(Boolean);
  var _routeReserved=['super-admin','index.html','judge.html','broadcast.html','admin'];
  var _instituteSlug=(_routeParts.length && _routeReserved.indexOf(_routeParts[0].toLowerCase())<0)
    ? decodeURIComponent(_routeParts[0]) : '';
  var _isInstituteAdminRoute=!!(_instituteSlug && _routeParts[1]==='admin');
  if(_instituteSlug && !_isInstituteAdminRoute && !_urlParams.has('view')){
    _urlParams.set('view','broadcast');
    _urlParams.set('org',_instituteSlug);
  }
  if(_urlParams.get('view')==='broadcast' && _urlParams.get('org')){
    // Discreet administration access; real authorization remains Supabase RLS/Auth.
    if(_instituteSlug){
      var _publicHeader=document.querySelector('#publicViewScreen > div');
      if(_publicHeader && !document.getElementById('wzInstituteAdminEntry')){
        var _entry=document.createElement('a');
        _entry.id='wzInstituteAdminEntry';
        _entry.href='/'+encodeURIComponent(_instituteSlug)+'/admin';
        _entry.textContent='⚙';
        _entry.title='Institute administration';
        _entry.setAttribute('aria-label','Institute administration');
        _entry.style.cssText='position:absolute;right:14px;bottom:12px;z-index:15;color:#a094c9;opacity:.55;text-decoration:none;font-size:17px;padding:8px';
        document.getElementById('publicViewScreen').appendChild(_entry);
      }
    }
    document.getElementById('splash').style.display='none';
    document.body.classList.remove('wz14-lock');
    applyAccentColor(getAccentColor()); // cosmetic only — skips initTheme(), which expects login-screen elements this boot path never renders
    _bootBroadcastViewer(_urlParams.get('org'));
    return;
  }
  // Reset the history baseline so a page reload (which can restore an old
  // pushState payload) never leaves a stale wz:'modal'/'page' guard behind.
  history.replaceState({wz:'root'},'');
  _wzModalGuard=false;
  initTheme();
  initAccentColor();
  var splash=document.getElementById('splash');
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('wz14-lock');
  if(!reducedMotion){
    // Double-rAF guarantees the browser paints the pre-flip frame first, so the
    // 720° coin flip always plays instead of sometimes rendering flat/invisible.
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ splash.classList.add('wz14-run'); });
    });
  }
  var minDisplayMs = reducedMotion ? 300 : 3300; // let the coin-flip sequence finish playing
  var startTime = Date.now();
  try{
    await initAppDataAndServices();
  }catch(e){
    // Startup task failed — fall through to safeNavigate() below rather than
    // leaving the splash stuck on an unhandled rejection.
  }
  var elapsed = Date.now()-startTime;
  var remaining = Math.max(0, minDisplayMs-elapsed);
  setTimeout(safeNavigate, remaining);
}

// Use DOMContentLoaded — fires as soon as HTML is parsed, doesn't wait for fonts/images
// This prevents getting stuck if Google Fonts or other resources are slow/offline
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', _launchApp);
} else {
  // Already loaded (e.g. cached page)
  _launchApp();
}

// Extra safety: if somehow still on splash after 5s, force the same
// auth-aware exit path — never a hardcoded dashboard/page.
setTimeout(safeNavigate, 5000);

if('serviceWorker' in navigator){
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('/sw.js').then(function(reg){
      // Check for updates on load
      reg.update();
      // Listen for a new SW waiting to activate
      reg.addEventListener('updatefound', function(){
        var newSW=reg.installing;
        if(!newSW) return;
        newSW.addEventListener('statechange', function(){
          if(newSW.state==='installed' && navigator.serviceWorker.controller){
            // New version is ready — show update banner
            _showUpdateBanner(newSW);
          }
        });
      });
    }).catch(function(){});
    // Also handle the case where SW was already waiting on page load
    navigator.serviceWorker.ready.then(function(reg){
      if(reg.waiting && navigator.serviceWorker.controller){
        _showUpdateBanner(reg.waiting);
      }
    });
  });
}

function _showUpdateBanner(sw){
  var b=document.getElementById('_updateBanner');
  if(!b) return;
  b.style.display='flex';
  document.getElementById('_updateBtn').onclick=function(){
    sw.postMessage({type:'SKIP_WAITING'});
    window.location.reload();
  };
  document.getElementById('_updateDismiss').onclick=function(){
    b.style.display='none';
  };
}
window.addEventListener('beforeinstallprompt', function(e) {

    e.preventDefault();

    deferredPrompt = e;

    if (
        !installBannerClosed &&
        !window.matchMedia('(display-mode: standalone)').matches
    ) {
        document.getElementById('installBanner').style.display = 'block';
    }
});

document.getElementById('installBannerBtn').addEventListener('click', async function() {

    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    deferredPrompt = null;

    document.getElementById('installBanner').style.display = 'none';
});

window.addEventListener('appinstalled', function() {

    document.getElementById('installBanner').style.display = 'none';

    deferredPrompt = null;
});
