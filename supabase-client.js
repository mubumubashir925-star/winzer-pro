/**
 * Winzera Supabase Client Integration
 * ------------------------------------------------------------------
 * Loaded as a plain classic <script> (no type="module" needed — it uses
 * dynamic import() internally, which works fine in classic scripts).
 *
 * Everything the rest of the app needs is exposed on window.WinzeraSync.
 * The app's existing DB.* object (in index.html) keeps working exactly as
 * before for fast local reads/renders — this file is what keeps that local
 * cache in sync with Supabase and pushes local writes up to the server.
 * ------------------------------------------------------------------
 */

// ============================================
// CONFIGURATION
// ============================================
// This is the "publishable"/anon key — it is safe to ship in client code.
// All real access control happens via Row Level Security + the RPC
// functions in schema-v2-migration.sql, not by hiding this key.
const SUPABASE_URL = 'https://wzecrbhwlryzucgbpoxu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_HUJ7n4ESUTsAu9l8X8iu2g_el2aKuxK';

let supabase = null;
let _initPromise = null;

async function _ensureClient() {
  if (supabase) return supabase;
  if (!_initPromise) {
    _initPromise = (async () => {
      const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true }
      });
      return supabase;
    })();
  }
  return _initPromise;
}

// ============================================
// STATE
// ============================================
const TABLES = ['teams', 'sections', 'items', 'participants', 'marks', 'groups', 'bonuses'];
const TEAM_TOKEN_KEY = 'wz_team_token';
const TEAM_ORG_KEY = 'wz_team_org';

let _orgId = null;          // current admin's org id
let _channels = [];         // active realtime channels
let _onRemoteChange = null; // callback(table, payload) the app registers

// ============================================
// ADMIN AUTH (real Supabase Auth — email + password)
// ============================================

/**
 * Sign in an admin/super_admin. Throws on bad credentials.
 * Returns { userId, role, orgId, orgName, orgCode }.
 */
async function adminLogin(email, password) {
  const sb = await _ensureClient();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const { data: profile, error: profileError } = await sb
    .from('users')
    .select('id, role, org_id, organizations(name, slug)')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    await sb.auth.signOut();
    throw new Error('This account has no Winzera profile. Ask your super admin to run Setup Organization for you.');
  }
  if (profile.role !== 'admin' && profile.role !== 'super_admin') {
    await sb.auth.signOut();
    throw new Error('This account is not an admin.');
  }

  _orgId = profile.org_id || null;
  return {
    userId: profile.id,
    role: profile.role,
    orgId: profile.org_id,
    orgName: profile.organizations ? profile.organizations.name : null,
    orgCode: profile.organizations ? profile.organizations.slug : null
  };
}

async function adminRestoreSession() {
  const sb = await _ensureClient();
  const { data } = await sb.auth.getSession();
  if (!data.session) return null;

  const { data: profile } = await sb
    .from('users')
    .select('id, role, org_id, organizations(name, slug)')
    .eq('id', data.session.user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) return null;
  _orgId = profile.org_id || null;
  return {
    userId: profile.id, role: profile.role, orgId: profile.org_id,
    orgName: profile.organizations ? profile.organizations.name : null,
    orgCode: profile.organizations ? profile.organizations.slug : null
  };
}

async function adminSignOut() {
  const sb = await _ensureClient();
  try { await sb.auth.signOut(); } catch (e) {}
  stopSync();
  _orgId = null;
}

// ============================================
// TEAM MANAGER AUTH (custom token, via team_login RPC)
// ============================================

/**
 * orgCode is either a raw org UUID or the short org slug shown to the admin
 * when they set up the team. Resolves it, then verifies username/password.
 * Returns { token, teamId, teamName, orgId } or throws.
 */
async function teamLogin(orgCode, username, password) {
  const orgId = await resolveOrgCode(orgCode);
  if (!orgId) throw new Error('Organization not found. Check the code your admin gave you.');

  const sb = await _ensureClient();
  const { data, error } = await sb.rpc('team_login', {
    p_org_id: orgId, p_username: username, p_password: password
  });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || !row.team_id) throw new Error('WRONG_CREDENTIALS');
  if (row.locked) throw new Error('LOCKED');

  localStorage.setItem(TEAM_TOKEN_KEY, row.token);
  localStorage.setItem(TEAM_ORG_KEY, orgId);
  return { token: row.token, teamId: row.team_id, teamName: row.team_name, orgId };
}

async function resolveOrgCode(orgCode) {
  if (!orgCode) return null;
  const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRe.test(orgCode.trim())) return orgCode.trim();

  const sb = await _ensureClient();
  const { data, error } = await sb.rpc('resolve_org_slug', { p_slug: orgCode.trim() });
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return row ? row.id : null;
}

async function teamRestoreSession() {
  const token = localStorage.getItem(TEAM_TOKEN_KEY);
  if (!token) return null;
  try {
    const dash = await teamFetchDashboard();
    return { token, dash };
  } catch (e) {
    localStorage.removeItem(TEAM_TOKEN_KEY);
    localStorage.removeItem(TEAM_ORG_KEY);
    return null;
  }
}

async function teamLogout() {
  const token = localStorage.getItem(TEAM_TOKEN_KEY);
  if (token) {
    try { const sb = await _ensureClient(); await sb.rpc('team_logout', { p_token: token }); } catch (e) {}
  }
  localStorage.removeItem(TEAM_TOKEN_KEY);
  localStorage.removeItem(TEAM_ORG_KEY);
  stopSync();
}

async function teamFetchDashboard() {
  const token = localStorage.getItem(TEAM_TOKEN_KEY);
  if (!token) throw new Error('Not logged in');
  const sb = await _ensureClient();
  const { data, error } = await sb.rpc('team_get_dashboard', { p_token: token });
  if (error) throw error;
  return data;
}

async function teamAddParticipant(name, sectionId, chestNo, photo) {
  const token = localStorage.getItem(TEAM_TOKEN_KEY);
  const sb = await _ensureClient();
  const { data, error } = await sb.rpc('team_add_participant', {
    p_token: token, p_name: name, p_section_id: sectionId || null,
    p_chest_no: chestNo != null ? String(chestNo) : null, p_photo: photo || null
  });
  if (error) throw error;
  return data;
}

async function teamUpdateParticipant(participantId, name, sectionId, chestNo, photo) {
  const token = localStorage.getItem(TEAM_TOKEN_KEY);
  const sb = await _ensureClient();
  const { data, error } = await sb.rpc('team_update_participant', {
    p_token: token, p_participant_id: participantId, p_name: name || null,
    p_section_id: sectionId || null, p_chest_no: chestNo != null ? String(chestNo) : null, p_photo: photo || null
  });
  if (error) throw error;
  return data;
}

async function teamDeleteParticipant(participantId) {
  const token = localStorage.getItem(TEAM_TOKEN_KEY);
  const sb = await _ensureClient();
  const { error } = await sb.rpc('team_delete_participant', { p_token: token, p_participant_id: participantId });
  if (error) throw error;
}

async function teamAssignItem(participantId, itemId, codeLetter) {
  const token = localStorage.getItem(TEAM_TOKEN_KEY);
  const sb = await _ensureClient();
  const { data, error } = await sb.rpc('team_assign_item', { p_token: token, p_participant_id: participantId, p_item_id: itemId, p_code_letter: codeLetter || null });
  if (error) throw error;
  return data;
}

async function teamUnassignItem(participantId, itemId) {
  const token = localStorage.getItem(TEAM_TOKEN_KEY);
  const sb = await _ensureClient();
  const { error } = await sb.rpc('team_unassign_item', { p_token: token, p_participant_id: participantId, p_item_id: itemId });
  if (error) throw error;
}

// ============================================
// TEAM-SESSION PUSH (writes via RPC, not direct table access — team
// managers are not Supabase Auth users, so RLS blocks direct table writes
// for them entirely; every mutation must go through a SECURITY DEFINER
// function that validates their token itself)
// ============================================

/**
 * Populates the same name<->id translation maps pullOrgSnapshot builds,
 * but from a team dashboard payload instead — needed so participant saves
 * from a team session can resolve section names to section_id the same
 * way the admin side does.
 */
function primeMapsFromTeamDashboard(dash) {
  _sectionNameToId = {}; _sectionIdToName = {};
  (dash.sections || []).forEach(s => { _sectionNameToId[s.name] = s.id; _sectionIdToName[s.id] = s.name; });
  (dash.items || []).forEach(i => { _itemLocalToRemoteId[i.id] = i.id; });
  const localParticipants = (dash.participants || []).map(p => ({
    id: p.id, chestNo: p.chest_no ? parseInt(p.chest_no, 10) : undefined, name: p.name,
    section: _sectionIdToName[p.section_id] || '', team: dash.team ? dash.team.name : '',
    items: (dash.assignments || []).filter(a => a.participant_id === p.id).map(a => a.item_id),
    photo: p.photo || null
  }));
  _lastKnown.participants = JSON.parse(JSON.stringify(localParticipants));
}

/**
 * Diffs a team manager's local participants array the same way
 * pushParticipants does for admins, but routes every change through the
 * token-checked RPCs instead of direct table access.
 */
async function pushParticipantsAsTeam(participantsArray) {
  const prev = _lastKnown.participants || [];
  const prevById = {}; prev.forEach(p => { prevById[p.id] = p; });
  const seen = {};

  for (const p of participantsArray) {
    seen[p.id] = true;
    const before = prevById[p.id];
    const sectionId = _sectionNameToId[p.section] || null;
    let remoteId = _isUuid(p.id) ? p.id : null;

    try {
      if (!remoteId) {
        const data = await teamAddParticipant(p.name, sectionId, p.chestNo, p.photo);
        const oldId = p.id;
        p.id = data.id; remoteId = data.id;
      } else {
        const changed = !before || before.name !== p.name || before.section !== p.section ||
          before.chestNo !== p.chestNo || before.photo !== p.photo;
        if (changed) await teamUpdateParticipant(remoteId, p.name, sectionId, p.chestNo, p.photo);
      }

      const beforeItems = (before && before.items) || [];
      const nowItems = p.items || [];
      for (const itemId of nowItems.filter(i => !beforeItems.includes(i))) {
        if (_isUuid(itemId)) await teamAssignItem(remoteId, itemId);
      }
      for (const itemId of beforeItems.filter(i => !nowItems.includes(i))) {
        if (_isUuid(itemId)) await teamUnassignItem(remoteId, itemId);
      }
    } catch (e) {
      console.error('Winzera team sync: participant save failed', e);
    }
  }
  for (const p of prev) {
    if (!seen[p.id] && _isUuid(p.id)) {
      try { await teamDeleteParticipant(p.id); } catch (e) { console.error('Winzera team sync: participant delete failed', e); }
    }
  }
  _lastKnown.participants = JSON.parse(JSON.stringify(participantsArray));
}

// ============================================
// ADMIN: CREATE ORG / TEAM (super admin + org admin flows)
// ============================================

async function createOrganization(name) {
  const sb = await _ensureClient();
  const { data, error } = await sb.from('organizations').insert({ name }).select().single();
  if (error) throw error;
  return data;
}

async function createTeam(name, description) {
  const sb = await _ensureClient();
  if (!_orgId) throw new Error('Not signed in to an organization');
  const { data, error } = await sb.from('teams').insert({ org_id: _orgId, name, description: description || null }).select().single();
  if (error) throw error;
  return data;
}

async function setTeamCredentials(teamId, username, password) {
  const sb = await _ensureClient();
  const { error } = await sb.rpc('admin_set_team_credentials', { p_team_id: teamId, p_username: username, p_password: password || null });
  if (error) throw error;
}

// ============================================
// ADMIN DATA SYNC — BOUNDARY TRANSLATION LAYER
// ------------------------------------------------------------------
// index.html's own logic is untouched: sections are plain name strings,
// teams/participants reference each other BY NAME, items carry a local
// numeric-ish id. None of that changes. Translation to/from Supabase's
// real UUIDs/foreign keys happens only here, at the sync boundary.
//
// STAGE COVERED: teams, sections, items, participants (incl. assigned
// items, via item_assignments). Marks/groups/bonuses are NOT yet wired —
// DB.saveMarks/saveGroups/saveBonuses are safe no-ops for now.
// ============================================

// name <-> remote-uuid maps, rebuilt on every pull, used on every push
let _sectionNameToId = {};   // "Junior" -> uuid
let _sectionIdToName = {};   // uuid -> "Junior"
let _teamNameToId = {};      // "Team A" -> uuid
let _teamIdToName = {};      // uuid -> "Team A"
// old-local-id -> remote-uuid, so stale references (e.g. an item id saved
// on a participant before that item was first synced) still resolve
let _itemLocalToRemoteId = {};
let _participantLocalToRemoteId = {};

const _uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function _isUuid(v) { return typeof v === 'string' && _uuidRe.test(v); }

/**
 * Pulls teams/sections/items/participants (+ their item assignments) and
 * translates every row back into the exact shape index.html already
 * expects locally. Called after login and after every realtime change.
 */
async function pullOrgSnapshot() {
  const sb = await _ensureClient();
  if (!_orgId) throw new Error('No organization context');

  const [orgRes, teamsRes, sectionsRes, itemsRes, participantsRes, assignRes, marksRes, groupsRes, bonusesRes] = await Promise.all([
    sb.from('organizations').select('settings').eq('id', _orgId).single(),
    sb.from('teams').select('*').eq('org_id', _orgId).order('name'),
    sb.from('sections').select('*').eq('org_id', _orgId).order('order_index'),
    sb.from('items').select('*').eq('org_id', _orgId),
    sb.from('participants').select('*').eq('org_id', _orgId),
    sb.from('item_assignments').select('*').eq('org_id', _orgId),
    sb.from('marks').select('*').eq('org_id', _orgId),
    sb.from('groups').select('*').eq('org_id', _orgId),
    sb.from('bonuses').select('*').eq('org_id', _orgId)
  ]);
  [orgRes, teamsRes, sectionsRes, itemsRes, participantsRes, assignRes, marksRes, groupsRes, bonusesRes].forEach(r => { if (r.error) throw r.error; });
  const localConfig = (orgRes.data && orgRes.data.settings) || {};

  // ---- sections: remote rows -> plain name-string array ----
  const remoteSections = sectionsRes.data || [];
  _sectionNameToId = {}; _sectionIdToName = {};
  remoteSections.forEach(s => { _sectionNameToId[s.name] = s.id; _sectionIdToName[s.id] = s.name; });
  const localSections = remoteSections.map(s => s.name);

  // ---- teams: remote rows -> local shape (name-keyed everywhere else) ----
  const remoteTeams = teamsRes.data || [];
  _teamNameToId = {}; _teamIdToName = {};
  remoteTeams.forEach(t => { _teamNameToId[t.name] = t.id; _teamIdToName[t.id] = t.name; });
  const localTeams = remoteTeams.map(t => ({
    id: t.id, name: t.name, shortName: t.short_name || undefined, code: t.code || undefined,
    username: t.username || undefined, locked: !!t.locked,
    chestFrom: t.chest_from || undefined, chestTo: t.chest_to || undefined
    // password is intentionally never pulled — only a hash exists server-side
  }));

  // ---- items: section_id -> section name ----
  const remoteItems = itemsRes.data || [];
  const oldItemLocalToRemote = _itemLocalToRemoteId;
  _itemLocalToRemoteId = {};
  remoteItems.forEach(i => { _itemLocalToRemoteId[i.id] = i.id; }); // uuid maps to itself now
  Object.keys(oldItemLocalToRemote).forEach(k => { _itemLocalToRemoteId[k] = oldItemLocalToRemote[k]; });
  const itemsById = {}; remoteItems.forEach(i => { itemsById[i.id] = i; });
  const localItems = remoteItems.map(i => ({
    id: i.id, name: i.name, section: _sectionIdToName[i.section_id] || 'General',
    type: i.type || 'individual', maxTeam: i.max_participants != null ? i.max_participants : 2,
    code: i.code || undefined, time: i.event_time || '',
    isStage: !!i.is_stage, stageId: i.stage_id || undefined, date: i.event_date || '',
    customRankBonus: !!i.custom_rank_bonus,
    rankBonus1: i.rank_bonus_1 || 0, rankBonus2: i.rank_bonus_2 || 0, rankBonus3: i.rank_bonus_3 || 0,
    inclIndiv: i.incl_indiv !== false, countsToLimit: i.counts_to_limit !== false,
    declared: !!i.declared, declaredAt: i.declared_at || undefined,
    // Which named judge (from Setup) sits in each numbered judge slot for
    // this item. This had no column at all — pushItems never sent it, so it
    // only ever lived in that one browser tab's memory and reset to
    // "unnamed" the moment anything (a refresh, another device, even the
    // routine background resync) re-pulled the item list.
    judgeIds: Array.isArray(i.judge_ids) ? i.judge_ids : []
  }));

  // ---- item_assignments: build participant_id -> [local item ids] and (participant_id,item_id) -> code_letter ----
  const assignByParticipant = {};
  const codeLetterByPair = {};
  (assignRes.data || []).forEach(a => {
    if (!assignByParticipant[a.participant_id]) assignByParticipant[a.participant_id] = [];
    assignByParticipant[a.participant_id].push(a.item_id); // already the local-usable uuid
    codeLetterByPair[a.participant_id + '|' + a.item_id] = a.code_letter || '';
  });

  // ---- participants: team_id/section_id -> names, attach assigned items ----
  const remoteParticipants = participantsRes.data || [];
  const oldPLocalToRemote = _participantLocalToRemoteId;
  _participantLocalToRemoteId = {};
  remoteParticipants.forEach(p => { _participantLocalToRemoteId[p.id] = p.id; });
  Object.keys(oldPLocalToRemote).forEach(k => { _participantLocalToRemoteId[k] = oldPLocalToRemote[k]; });
  const participantsById = {}; remoteParticipants.forEach(p => { participantsById[p.id] = p; });
  const localParticipants = remoteParticipants.map(p => ({
    id: p.id,
    chestNo: p.chest_no ? parseInt(p.chest_no, 10) : undefined,
    name: p.name,
    section: _sectionIdToName[p.section_id] || '',
    team: _teamIdToName[p.team_id] || '',
    items: assignByParticipant[p.id] || [],
    photo: p.photo || null
  }));
  // chest number -> participant, needed to translate marks/groups back below
  const chestNoToParticipant = {};
  localParticipants.forEach(p => { if (p.chestNo != null) chestNoToParticipant[p.chestNo] = p; });

  // ---- marks: one row per participant+item (judge_id always NULL) ----
  // Local records use discrete mark1/mark2/mark3 fields (not an array) —
  // translate the remote JSONB array into that shape directly here.
  // grade/pct/point/maximum are derived values the local app recomputes
  // from total + config every time it renders (see saveInlineMarks in
  // index.html) — index.html's applySnap() does that same recompute right
  // after this pull, so those fields aren't set here.
  const localMarks = (marksRes.data || []).map(m => {
    const participant = participantsById[m.participant_id];
    const chestNo = participant && participant.chest_no ? parseInt(participant.chest_no, 10) : undefined;
    const scores = Array.isArray(m.marks_breakdown) ? m.marks_breakdown : [];
    return {
      itemId: m.item_id, chestNo: chestNo,
      codeLetter: codeLetterByPair[m.participant_id + '|' + m.item_id] || '',
      mark1: scores[0] || 0, mark2: scores[1] || 0, mark3: scores[2] || 0,
      total: m.total || 0, rank: m.rank || 0
    };
  }).filter(m => m.chestNo !== undefined);

  // ---- groups: team_id/section_id -> names, item_ids -> local ids ----
  const localGroups = (groupsRes.data || []).map(g => {
    const primaryItemId = (g.item_ids && g.item_ids[0]) || null;
    return {
      id: g.id,
      groupChestNo: g.group_chest_no ? parseInt(g.group_chest_no, 10) : undefined,
      name: g.name,
      section: _sectionIdToName[g.section_id] || '',
      team: _teamIdToName[g.team_id] || '',
      itemId: primaryItemId,
      itemIds: g.item_ids || [],
      itemName: primaryItemId && itemsById[primaryItemId] ? itemsById[primaryItemId].name : '',
      captainChestNo: g.captain_chest_no ? parseInt(g.captain_chest_no, 10) : undefined,
      members: Array.isArray(g.member_names) ? g.member_names : [],
      isOnStage: !!g.is_on_stage
    };
  });

  // ---- bonuses: team_id IS the local team id already (no name translation needed) ----
  const localBonuses = (bonusesRes.data || []).map(b => ({
    id: b.id, teamId: b.team_id, reason: b.reason || '', points: b.points || 0,
    date: b.created_at
  }));

  return {
    config: localConfig,
    teams: localTeams, sections: localSections, items: localItems, participants: localParticipants,
    marks: localMarks, groups: localGroups, bonuses: localBonuses
  };
}

// ---- last-known snapshots per table, for diffing on push ----
let _lastKnown = { teams: [], sections: [], items: [], participants: [], marks: [], groups: [], bonuses: [] };
function rememberSnapshot(snapshot) {
  ['teams', 'sections', 'items', 'participants', 'marks', 'groups', 'bonuses'].forEach(t => {
    _lastKnown[t] = JSON.parse(JSON.stringify(snapshot[t] || []));
  });
}

// ---- push: teams ----
async function pushTeams(teamsArray) {
  if (!_orgId) return;
  const sb = await _ensureClient();
  const prev = _lastKnown.teams || [];
  const prevById = {}; prev.forEach(t => { prevById[t.id] = t; });
  const seen = {};

  for (const team of teamsArray) {
    seen[team.id] = true;
    const before = prevById[team.id];
    const pendingPassword = team.password; // never persisted locally past this point

    if (!before) {
      // brand-new team created locally
      const { data, error } = await sb.from('teams')
        .insert({ org_id: _orgId, name: team.name, short_name: team.shortName || null, code: team.code || null, locked: !!team.locked,
                  chest_from: team.chestFrom || null, chest_to: team.chestTo || null })
        .select().single();
      if (error) { console.error('Winzera sync: team insert failed', error); continue; }
      team.id = data.id; // patch local object with the real id
      if (team.username || pendingPassword) {
        await setTeamCredentials(data.id, team.username || '', pendingPassword || '');
      }
    } else if (
      before.name !== team.name || before.shortName !== team.shortName || before.code !== team.code ||
      before.locked !== team.locked || before.chestFrom !== team.chestFrom || before.chestTo !== team.chestTo
    ) {
      const { error } = await sb.from('teams')
        .update({ name: team.name, short_name: team.shortName || null, code: team.code || null, locked: !!team.locked,
                  chest_from: team.chestFrom || null, chest_to: team.chestTo || null })
        .eq('id', team.id);
      if (error) console.error('Winzera sync: team update failed', error);
    }

    if (pendingPassword || (before && before.username !== team.username)) {
      if (_isUuid(team.id)) await setTeamCredentials(team.id, team.username || '', pendingPassword || '');
    }
    delete team.password; // plaintext never lingers locally past the sync tick
  }

  for (const team of prev) {
    if (!seen[team.id] && _isUuid(team.id)) {
      await sb.from('teams').delete().eq('id', team.id);
    }
  }
  _lastKnown.teams = JSON.parse(JSON.stringify(teamsArray.map(t => { const c = Object.assign({}, t); delete c.password; return c; })));
}

// ---- push: sections (plain name-string array) ----
async function pushSections(sectionsArray) {
  if (!_orgId) return;
  const sb = await _ensureClient();
  const prev = _lastKnown.sections || [];
  const added = sectionsArray.filter(n => !prev.includes(n));
  const removed = prev.filter(n => !sectionsArray.includes(n));

  for (const name of added) {
    const { data, error } = await sb.from('sections')
      .insert({ org_id: _orgId, name, order_index: sectionsArray.indexOf(name) })
      .select().single();
    if (error) { console.error('Winzera sync: section insert failed', error); continue; }
    _sectionNameToId[name] = data.id; _sectionIdToName[data.id] = name;
  }
  for (const name of removed) {
    const id = _sectionNameToId[name];
    if (id) { await sb.from('sections').delete().eq('id', id); delete _sectionIdToName[id]; delete _sectionNameToId[name]; }
  }
  // keep order_index in sync so the pull order matches the admin's arrangement
  for (let idx = 0; idx < sectionsArray.length; idx++) {
    const id = _sectionNameToId[sectionsArray[idx]];
    if (id) await sb.from('sections').update({ order_index: idx }).eq('id', id);
  }
  _lastKnown.sections = sectionsArray.slice();
}

// ---- push: items ----
async function pushItems(itemsArray) {
  if (!_orgId) return;
  const sb = await _ensureClient();
  const prev = _lastKnown.items || [];
  const prevById = {}; prev.forEach(i => { prevById[i.id] = i; });
  const seen = {};
  const errors = [];

  // Concurrent, not sequential — a Bulk Add of many items doing one
  // network round-trip at a time could take several seconds, long enough
  // for someone to navigate away before the last few rows ever reach the
  // server (they'd look "erased" on reopening, even though they were only
  // ever saved locally). Running them together cuts that window down to
  // roughly one round-trip regardless of batch size.
  await Promise.all(itemsArray.map(async (item) => {
    seen[item.id] = true;
    const payload = {
      org_id: _orgId,
      section_id: _sectionNameToId[item.section] || null,
      name: item.name, code: item.code || null, type: item.type || 'individual',
      max_participants: item.maxTeam != null ? item.maxTeam : 2,
      is_stage: !!item.isStage, stage_id: item.stageId || null, event_date: item.date || null,
      custom_rank_bonus: !!item.customRankBonus,
      rank_bonus_1: item.rankBonus1 || 0, rank_bonus_2: item.rankBonus2 || 0, rank_bonus_3: item.rankBonus3 || 0,
      incl_indiv: item.inclIndiv !== false, counts_to_limit: item.countsToLimit !== false,
      event_time: item.time || null, declared: !!item.declared, declared_at: item.declaredAt || null,
      judge_ids: Array.isArray(item.judgeIds) ? item.judgeIds : []
    };
    const before = prevById[item.id];
    if (!before) {
      const { data, error } = await sb.from('items').insert(payload).select().single();
      if (error) { console.error('Winzera sync: item insert failed', error); errors.push(item.name + ': ' + error.message); return; }
      const oldId = item.id;
      item.id = data.id;
      _itemLocalToRemoteId[oldId] = data.id;
      _itemLocalToRemoteId[data.id] = data.id;
    } else if (JSON.stringify(before) !== JSON.stringify(item)) {
      if (_isUuid(item.id)) {
        const { error } = await sb.from('items').update(payload).eq('id', item.id);
        if (error) { console.error('Winzera sync: item update failed', error); errors.push(item.name + ': ' + error.message); }
      }
    }
  }));

  await Promise.all(prev.map(async (item) => {
    if (!seen[item.id] && _isUuid(item.id)) await sb.from('items').delete().eq('id', item.id);
  }));
  _lastKnown.items = JSON.parse(JSON.stringify(itemsArray));
  if (errors.length) throw new Error(errors.length + ' item(s) failed to save: ' + errors.slice(0, 3).join('; ') + (errors.length > 3 ? '...' : ''));
}

// ---- push: participants (+ their assigned items via item_assignments) ----
async function pushParticipants(participantsArray) {
  if (!_orgId) return;
  const sb = await _ensureClient();
  const prev = _lastKnown.participants || [];
  const prevById = {}; prev.forEach(p => { prevById[p.id] = p; });
  const seen = {};
  const errors = [];

  // Concurrent per participant, same reasoning as pushItems — Bulk Add
  // Participants can be a long list, and one-at-a-time network round-trips
  // create a window where navigating away mid-save loses whatever hadn't
  // reached the server yet.
  await Promise.all(participantsArray.map(async (p) => {
    seen[p.id] = true;
    const payload = {
      org_id: _orgId,
      team_id: _teamNameToId[p.team] || null,
      section_id: _sectionNameToId[p.section] || null,
      chest_no: p.chestNo != null ? String(p.chestNo) : null,
      name: p.name, photo: p.photo || null
    };
    const before = prevById[p.id];
    let remoteId = _isUuid(p.id) ? p.id : _participantLocalToRemoteId[p.id];

    if (!remoteId) {
      const { data, error } = await sb.from('participants').insert(payload).select().single();
      if (error) { console.error('Winzera sync: participant insert failed', error); errors.push(p.name + ': ' + error.message); return; }
      const oldId = p.id;
      p.id = data.id; remoteId = data.id;
      _participantLocalToRemoteId[oldId] = data.id;
      _participantLocalToRemoteId[data.id] = data.id;
    } else {
      const corePayloadChanged = !before ||
        before.name !== p.name || before.team !== p.team || before.section !== p.section ||
        before.chestNo !== p.chestNo || before.photo !== p.photo;
      if (corePayloadChanged) {
        const { error } = await sb.from('participants').update(payload).eq('id', remoteId);
        if (error) { console.error('Winzera sync: participant update failed', error); errors.push(p.name + ': ' + error.message); }
      }
    }

    // reconcile assigned items -> item_assignments rows
    const beforeItems = (before && before.items) || [];
    const nowItems = p.items || [];
    const addedItems = nowItems.filter(i => !beforeItems.includes(i));
    const removedItems = beforeItems.filter(i => !nowItems.includes(i));
    await Promise.all(addedItems.map(async (localItemId) => {
      const remoteItemId = _itemLocalToRemoteId[localItemId] || (_isUuid(localItemId) ? localItemId : null);
      if (!remoteItemId) return; // item not synced yet — will retry once it is
      await sb.from('item_assignments').upsert(
        { org_id: _orgId, participant_id: remoteId, item_id: remoteItemId },
        { onConflict: 'participant_id,item_id' }
      );
    }));
    await Promise.all(removedItems.map(async (localItemId) => {
      const remoteItemId = _itemLocalToRemoteId[localItemId] || (_isUuid(localItemId) ? localItemId : null);
      if (!remoteItemId) return;
      await sb.from('item_assignments').delete().eq('participant_id', remoteId).eq('item_id', remoteItemId);
    }));
  }));
  for (const p of prev) {
    if (!seen[p.id]) {
      const remoteId = _isUuid(p.id) ? p.id : _participantLocalToRemoteId[p.id];
      if (remoteId) await sb.from('participants').delete().eq('id', remoteId);
    }
  }
  _lastKnown.participants = JSON.parse(JSON.stringify(participantsArray));
  if (errors.length) throw new Error(errors.length + ' participant(s) failed to save: ' + errors.slice(0, 3).join('; ') + (errors.length > 3 ? '...' : ''));
}

// Marks/Groups/Bonuses: not yet wired to Supabase. Kept as safe no-ops so
// calling them doesn't throw — local IndexedDB storage still works exactly
// as before for these three.
// ---- push: marks (one row per participant+item, judge_id always NULL) ----
// Local mark records use discrete mark1/mark2/mark3 properties (matching
// exactly how saveInlineMarks() builds them) — NOT an array, and they have
// no stable .id at all (saveInlineMarks never sets one). The natural key
// is chestNo+itemId, same as the local app itself uses to find/update them.
async function pushMarks(marksArray) {
  if (!_orgId) return;
  const sb = await _ensureClient();
  const prev = _lastKnown.marks || [];
  const keyOf = m => m.chestNo + '|' + m.itemId;
  const prevByKey = {}; prev.forEach(m => { prevByKey[keyOf(m)] = m; });
  const seen = {};

  // local marks are keyed by chestNo — need chestNo -> remote participant_id
  const participants = _lastKnown.participants || [];
  const chestToParticipantId = {};
  participants.forEach(p => {
    const remoteId = _isUuid(p.id) ? p.id : _participantLocalToRemoteId[p.id];
    if (p.chestNo != null && remoteId) chestToParticipantId[p.chestNo] = remoteId;
  });

  for (const mark of marksArray) {
    const key = keyOf(mark);
    seen[key] = true;
    const participantId = chestToParticipantId[mark.chestNo];
    const itemId = _itemLocalToRemoteId[mark.itemId] || (_isUuid(mark.itemId) ? mark.itemId : null);
    if (!participantId || !itemId) continue; // participant/item not synced yet — retry next cycle

    const before = prevByKey[key];
    if (before && JSON.stringify(before) === JSON.stringify(mark)) continue;

    const rawScores = [mark.mark1 || 0, mark.mark2 || 0, mark.mark3 || 0];
    const payload = {
      org_id: _orgId, participant_id: participantId, item_id: itemId, judge_id: null,
      marks_breakdown: rawScores, total: mark.total || 0,
      grade: mark.grade || null, rank: mark.rank || null
    };
    // manual upsert keyed on (participant_id, item_id) WHERE judge_id IS NULL —
    // see schema-v3-stage3-additions.sql for the matching partial unique index
    const { data: existing } = await sb.from('marks').select('id')
      .eq('participant_id', participantId).eq('item_id', itemId).is('judge_id', null).maybeSingle();
    if (existing) {
      const { error } = await sb.from('marks').update(payload).eq('id', existing.id);
      if (error) console.error('Winzera sync: mark update failed', error);
    } else {
      const { error } = await sb.from('marks').insert(payload);
      if (error) console.error('Winzera sync: mark insert failed', error);
    }

    // BUG FIX: the code letter lives on the local mark record, but is read
    // back on pull from item_assignments.code_letter — without writing it
    // here too, a freshly-assigned code gets silently overwritten by the
    // stale (empty) value on the very next sync refresh.
    if (mark.codeLetter !== undefined) {
      const { error: codeErr } = await sb.from('item_assignments')
        .update({ code_letter: mark.codeLetter || null })
        .eq('participant_id', participantId).eq('item_id', itemId);
      if (codeErr) console.error('Winzera sync: code letter write failed', codeErr);
    }
  }
  for (const mark of prev) {
    if (!seen[keyOf(mark)]) {
      const participantId = chestToParticipantId[mark.chestNo];
      const itemId = _itemLocalToRemoteId[mark.itemId] || (_isUuid(mark.itemId) ? mark.itemId : null);
      if (participantId && itemId) {
        await sb.from('marks').delete().eq('participant_id', participantId).eq('item_id', itemId).is('judge_id', null);
      }
    }
  }
  _lastKnown.marks = JSON.parse(JSON.stringify(marksArray));
}

// ---- push: groups ----
async function pushGroups(groupsArray) {
  if (!_orgId) return;
  const sb = await _ensureClient();
  const prev = _lastKnown.groups || [];
  const prevById = {}; prev.forEach(g => { prevById[g.id] = g; });
  const seen = {};

  for (const g of groupsArray) {
    seen[g.id] = true;
    const remoteItemIds = (g.itemIds || []).map(li => _itemLocalToRemoteId[li] || (_isUuid(li) ? li : null)).filter(Boolean);
    const payload = {
      org_id: _orgId,
      team_id: _teamNameToId[g.team] || null,
      section_id: _sectionNameToId[g.section] || null,
      group_chest_no: g.groupChestNo != null ? String(g.groupChestNo) : null,
      name: g.name, item_ids: remoteItemIds,
      captain_chest_no: g.captainChestNo != null ? String(g.captainChestNo) : null,
      member_names: g.members || [], is_on_stage: !!g.isOnStage
    };
    const before = prevById[g.id];
    let remoteId = _isUuid(g.id) ? g.id : null;

    if (!remoteId) {
      const { data, error } = await sb.from('groups').insert(payload).select().single();
      if (error) { console.error('Winzera sync: group insert failed', error); continue; }
      g.id = data.id;
    } else if (!before || JSON.stringify(before) !== JSON.stringify(g)) {
      const { error } = await sb.from('groups').update(payload).eq('id', remoteId);
      if (error) console.error('Winzera sync: group update failed', error);
    }
  }
  for (const g of prev) {
    if (!seen[g.id] && _isUuid(g.id)) await sb.from('groups').delete().eq('id', g.id);
  }
  _lastKnown.groups = JSON.parse(JSON.stringify(groupsArray));
}

// ---- push: bonuses (team_id already IS the local team id, no translation) ----
// ---- push: config (fest name, judges, max judges, chest range fallback, etc.) ----
// Single JSON blob on the organization row, since this is one settings
// object rather than a table of rows — no diffing needed, just overwrite.
async function pushConfig(cfg) {
  if (!_orgId) return;
  const sb = await _ensureClient();
  const { error } = await sb.from('organizations').update({ settings: cfg || {} }).eq('id', _orgId);
  if (error) console.error('Winzera sync: config push failed', error);
}

async function pushBonuses(bonusesArray) {
  if (!_orgId) return;
  const sb = await _ensureClient();
  const prev = _lastKnown.bonuses || [];
  const prevById = {}; prev.forEach(b => { prevById[b.id] = b; });
  const seen = {};

  for (const b of bonusesArray) {
    seen[b.id] = true;
    if (prevById[b.id]) continue; // bonuses are append-only in the local UI (no edit path) — nothing to update
    if (!_isUuid(b.teamId)) continue; // team not synced yet — retry next cycle
    const { data, error } = await sb.from('bonuses')
      .insert({ org_id: _orgId, team_id: b.teamId, reason: b.reason || null, points: b.points || 0 })
      .select().single();
    if (error) { console.error('Winzera sync: bonus insert failed', error); continue; }
    b.id = data.id;
  }
  for (const b of prev) {
    if (!seen[b.id] && _isUuid(b.id)) await sb.from('bonuses').delete().eq('id', b.id);
  }
  _lastKnown.bonuses = JSON.parse(JSON.stringify(bonusesArray));
}

// ---- Realtime ----
// Any change to any of these tables just re-pulls + re-translates the
// whole snapshot and hands it back — simpler and safer than patching
// individual rows across three different translation maps, and at
// event-day data volumes (dozens to low hundreds of rows) the cost is
// negligible.
async function startRealtime(orgId, onChange) {
  await stopRealtime();
  const sb = await _ensureClient();
  _onRemoteChange = onChange;

  ['teams', 'sections', 'items', 'participants', 'item_assignments', 'marks', 'groups', 'bonuses'].forEach(table => {
    const ch = sb.channel('wz:' + table + ':' + orgId)
      .on('postgres_changes', { event: '*', schema: 'public', table, filter: `org_id=eq.${orgId}` }, (payload) => {
        if (_onRemoteChange) _onRemoteChange(table, payload);
      })
      .subscribe();
    _channels.push(ch);
  });

  // The 'organizations' row itself holds the settings JSON blob — fest
  // name, judges roster, rank/grade point config, chest-range fallback,
  // and accent color all live there via pushConfig(). It was missing from
  // the list above, so a config change on one admin device never notified
  // any other logged-in admin device: only a full reload (which re-pulls
  // everything from scratch on boot) would ever pick it up. This table is
  // keyed by its own id, not an org_id column, so it needs its own filter.
  const orgCh = sb.channel('wz:organizations:' + orgId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'organizations', filter: `id=eq.${orgId}` }, (payload) => {
      if (_onRemoteChange) _onRemoteChange('organizations', payload);
    })
    .subscribe();
  _channels.push(orgCh);
}

async function stopRealtime() {
  if (!_channels.length) return;
  const sb = await _ensureClient();
  for (const ch of _channels) {
    try { await sb.removeChannel(ch); } catch (e) {}
  }
  _channels = [];
}

function stopSync() {
  stopRealtime();
  _lastKnown = { teams: [], sections: [], items: [], participants: [] };
}

// ============================================
// BROADCAST — a fixed, short link per institution (index.html?view=
// broadcast&org=<slug>), reusing the org's existing short code instead of a
// random token that would change every time broadcasting restarts. The
// same rich payload the old WebRTC system sent now lives directly on the
// organization row and updates live via Realtime.
// ============================================
function _buildBroadcastViewerUrl(orgSlug) {
  const baseUrl = window.location.origin + window.location.pathname.replace(/index\.html$/, '');
  return `${baseUrl}index.html?view=broadcast&org=${orgSlug}`;
}

/** Turns broadcasting on for this org and returns its (fixed) public link. */
async function startBroadcasting() {
  const sb = await _ensureClient();
  if (!_orgId) throw new Error('No organization context');
  const { data, error } = await sb.from('organizations')
    .update({ broadcast_enabled: true }).eq('id', _orgId).select('slug').single();
  if (error) throw error;
  return { link: _buildBroadcastViewerUrl(data.slug), orgSlug: data.slug };
}

async function stopBroadcasting() {
  const sb = await _ensureClient();
  if (!_orgId) throw new Error('No organization context');
  const { error } = await sb.from('organizations').update({ broadcast_enabled: false }).eq('id', _orgId);
  if (error) throw error;
}

/** Current broadcast state for this org — whether it's on, and its link either way. */
async function getBroadcastStatus() {
  const sb = await _ensureClient();
  if (!_orgId) return null;
  const { data, error } = await sb.from('organizations').select('slug, broadcast_enabled').eq('id', _orgId).single();
  if (error) throw error;
  return { enabled: !!data.broadcast_enabled, link: _buildBroadcastViewerUrl(data.slug), orgSlug: data.slug };
}

/** Pushes a fresh live-results payload — safe no-op if broadcasting is off. */
async function pushBroadcastPayload(payload) {
  if (!_orgId) return;
  const sb = await _ensureClient();
  const { error } = await sb.from('organizations')
    .update({ broadcast_payload: payload, broadcast_payload_updated_at: new Date().toISOString() })
    .eq('id', _orgId).eq('broadcast_enabled', true);
  if (error) console.error('Winzera sync: broadcast payload push failed', error);
}

/** Viewer side: resolve an org's short code and fetch its current broadcast state. No login needed. */
// Public results: durable per-institution IndexedDB cache. Never stores credentials.
// Read a small version marker on reconnect; fetch the JSON only when it changes.
const _wzPublicCacheDb='winzera-public-cache-v1';
function _wzPublicStore(mode,fn){
  return new Promise((resolve,reject)=>{
    if(typeof indexedDB==='undefined'){resolve(null);return;}
    const request=indexedDB.open(_wzPublicCacheDb,1);
    request.onupgradeneeded=()=>request.result.createObjectStore('results');
    request.onerror=()=>reject(request.error);
    request.onsuccess=()=>{
      const db=request.result,tx=db.transaction('results',mode),store=tx.objectStore('results');
      let req;try{req=fn(store);}catch(e){db.close();reject(e);return;}
      req.onsuccess=()=>resolve(req.result||null);
      req.onerror=()=>reject(req.error);
      tx.oncomplete=()=>db.close();
      tx.onerror=()=>db.close();
    };
  });
}
async function readPublicCache(slug){
  try{return await _wzPublicStore('readonly',s=>s.get(String(slug).toLowerCase()));}
  catch(e){console.warn('Public cache unavailable',e);return null;}
}
async function writePublicCache(slug,entry){
  try{await _wzPublicStore('readwrite',s=>s.put(entry,String(slug).toLowerCase()));}
  catch(e){console.warn('Could not persist public results',e);}
}
async function fetchBroadcastPayload(orgSlug) {
  const cached=await readPublicCache(orgSlug);
  try{
    const sb=await _ensureClient();
    const {data,error}=await sb.from('organizations')
      .select('id,broadcast_enabled,broadcast_payload_updated_at')
      .eq('slug',orgSlug).maybeSingle();
    if(error)throw error;
    if(!data){return {status:'not_found'};}
    if(!data.broadcast_enabled){return {status:'ended',orgId:data.id};}
    if(cached && cached.orgId===data.id && cached.version===data.broadcast_payload_updated_at && cached.payload){
      return {status:'ok',payload:cached.payload,orgId:data.id,fromCache:true};
    }
    const {data:full,error:fullError}=await sb.from('organizations')
      .select('broadcast_payload,broadcast_payload_updated_at')
      .eq('id',data.id).eq('broadcast_enabled',true).maybeSingle();
    if(fullError)throw fullError;
    if(!full)return {status:'ended',orgId:data.id};
    const entry={orgId:data.id,version:full.broadcast_payload_updated_at,payload:full.broadcast_payload||null};
    await writePublicCache(orgSlug,entry);
    return {status:'ok',payload:entry.payload,orgId:data.id};
  }catch(e){
    // Offline public viewing is explicitly stale; never use a different institution cache.
    if(cached && cached.payload)return {status:'ok',payload:cached.payload,orgId:cached.orgId,offline:true};
    throw e;
  }
}

/** Realtime only sends a small invalidation; reload the payload on a changed version. */
let _broadcastViewerChannel=null;
async function subscribeBroadcastPayload(orgId,onPayload){
  const sb=await _ensureClient();
  if(_broadcastViewerChannel){try{await sb.removeChannel(_broadcastViewerChannel);}catch(e){}}
  const slug=location.pathname.split('/').filter(Boolean)[0]||new URLSearchParams(location.search).get('org');
  _broadcastViewerChannel=sb.channel('wz:public:'+orgId)
    .on('postgres_changes',{event:'UPDATE',schema:'public',table:'organizations',filter:`id=eq.${orgId}`},async event=>{
      try{
        const row=event.new;
        if(!row)return;
        if(!row.broadcast_enabled){onPayload('ended',null);return;}
        const fresh=await fetchBroadcastPayload(slug);
        if(fresh.status==='ok')onPayload('ok',fresh.payload);
        else onPayload('ended',null);
      }catch(e){console.warn('Public results refresh failed',e);}
    }).subscribe();
  return _broadcastViewerChannel;
}

// ============================================
// PHOTO UPLOAD
// ============================================
async function uploadPhoto(participantIdOrKey, file) {
  const sb = await _ensureClient();
  const orgId = _orgId || localStorage.getItem(TEAM_ORG_KEY);
  if (!orgId) throw new Error('No organization context');
  const filePath = `${orgId}/${participantIdOrKey}.jpg`;

  const { error } = await sb.storage.from('photos').upload(filePath, file, { cacheControl: '3600', upsert: true });
  if (error) throw error;
  const { data } = sb.storage.from('photos').getPublicUrl(filePath);
  return data.publicUrl;
}

// ============================================
// FULL ORGANIZATION WIPE (Supabase-side)
// Deletes every row for the current org across all synced tables, in an
// order that respects foreign keys. Also kills any team manager sessions
// and broadcast links, since a wipe should log everyone out too.
// ============================================
async function wipeOrgData() {
  const sb = await _ensureClient();
  if (!_orgId) throw new Error('No organization context');
  const oid = _orgId;

  const steps = [
    () => sb.from('item_assignments').delete().eq('org_id', oid),
    () => sb.from('marks').delete().eq('org_id', oid),
    () => sb.from('groups').delete().eq('org_id', oid),
    () => sb.from('bonuses').delete().eq('org_id', oid),
    () => sb.from('participants').delete().eq('org_id', oid),
    () => sb.from('items').delete().eq('org_id', oid),
    () => sb.from('sections').delete().eq('org_id', oid),
    () => sb.from('broadcast_links').delete().eq('org_id', oid),
    () => sb.from('team_sessions').delete().eq('org_id', oid), // logs out every team manager
    () => sb.from('teams').delete().eq('org_id', oid)
  ];
  for (const step of steps) {
    const { error } = await step();
    if (error) throw error;
  }
  _lastKnown = { teams: [], sections: [], items: [], participants: [], marks: [], groups: [], bonuses: [] };
}

// ============================================
// JUDGE MARKING LINKS
// ============================================
async function createJudgeLink(itemId, judgeIndex, label) {
  const sb = await _ensureClient();
  const { data, error } = await sb.rpc('admin_create_judge_link', { p_item_id: itemId, p_judge_index: judgeIndex, p_label: label || null });
  if (error) throw error;
  const baseUrl = window.location.origin + window.location.pathname.replace(/index\.html$/, '');
  return { link: baseUrl + 'judge.html?token=' + data.token, token: data.token, id: data.id };
}

async function listJudgeLinks() {
  const sb = await _ensureClient();
  const { data, error } = await sb.rpc('admin_list_judge_links');
  if (error) throw error;
  const baseUrl = window.location.origin + window.location.pathname.replace(/index\.html$/, '');
  return (data || []).map(row => Object.assign({}, row, { link: baseUrl + 'judge.html?token=' + row.token }));
}

async function toggleJudgeLink(linkId, isActive) {
  const sb = await _ensureClient();
  const { error } = await sb.rpc('admin_toggle_judge_link', { p_link_id: linkId, p_is_active: isActive });
  if (error) throw error;
}

// ============================================
// EXPORT
// ============================================
window.WinzeraSync = {
  // admin auth
  adminLogin, adminRestoreSession, adminSignOut,
  // team auth
  teamLogin, teamRestoreSession, teamLogout, teamFetchDashboard,
  teamAddParticipant, teamUpdateParticipant, teamDeleteParticipant,
  teamAssignItem, teamUnassignItem, primeMapsFromTeamDashboard, pushParticipantsAsTeam,
  // org/team management
  createOrganization, createTeam, setTeamCredentials, resolveOrgCode,
  // data sync (Stage 1+2: teams, sections, items, participants)
  pullOrgSnapshot, pushTeams, pushSections, pushItems, pushParticipants, pushConfig,
  pushMarks, pushGroups, pushBonuses, // no-ops for now, safe to call
  startRealtime, stopRealtime, stopSync, rememberSnapshot,
  getOrgId: () => _orgId,
  setOrgId: (id) => { _orgId = id; },
  // broadcast
  startBroadcasting, stopBroadcasting, getBroadcastStatus,
  pushBroadcastPayload, fetchBroadcastPayload, subscribeBroadcastPayload,
  // storage
  uploadPhoto,
  // full wipe
  wipeOrgData,
  // judge links
  createJudgeLink, listJudgeLinks, toggleJudgeLink
};

console.log('Winzera Supabase Client loaded');
