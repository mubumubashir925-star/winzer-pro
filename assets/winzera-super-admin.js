(()=>{
'use strict';
const $=id=>document.getElementById(id);
const sb=window.supabase.createClient('https://wzecrbhwlryzucgbpoxu.supabase.co','sb_publishable_HUJ7n4ESUTsAu9l8X8iu2g_el2aKuxK',{auth:{persistSession:true,autoRefreshToken:true}});
const busy=x=>$('busy').classList.toggle('active',x),notice=x=>$('notice').textContent=x||'';
const reserved=new Set(['super-admin','super','admin','api','assets','icons','judge','broadcast','index','login','app','manifest']);
let institutions=[];
async function authorized(){const {data:{user}}=await sb.auth.getUser();if(!user)return false;const {data}=await sb.from('users').select('role').eq('id',user.id).single();return data?.role==='super_admin';}
async function api(action,payload={}){const {data:{session}}=await sb.auth.getSession();if(!session)throw Error('Sign in first');const res=await fetch('https://wzecrbhwlryzucgbpoxu.supabase.co/functions/v1/institution-admin',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token,'apikey':'sb_publishable_HUJ7n4ESUTsAu9l8X8iu2g_el2aKuxK'},body:JSON.stringify({action,...payload})});const data=await res.json().catch(()=>({}));if(!res.ok)throw Error(data.error||'Institution management backend is not deployed or unavailable');return data;}
async function load(){const result=await api('list');institutions=result.institutions||[];renderList();}
function line(label,value){const p=document.createElement('p'),b=document.createElement('b'),v=document.createElement('span');b.textContent=label;v.textContent=String(value??'—');p.append(b,v);return p;}
function renderList(){
 const q=$('search').value.trim().toLowerCase(),filter=$('filter').value,box=$('institutions');
 box.replaceChildren();
 const active=institutions.filter(o=>!o.suspended).length;
 $('statTotal').textContent=institutions.length;$('statActive').textContent=active;
 const counts=institutions.map(o=>Number(o.participant_count)).filter(Number.isFinite);
 $('statParticipants').textContent=counts.length===institutions.length?counts.reduce((a,b)=>a+b,0):'—';
 const rows=institutions.filter(o=>(filter==='all'||(o.suspended?'suspended':'active')===filter)&&[o.name,o.slug,o.admin_username].some(v=>String(v||'').toLowerCase().includes(q)));
 if(!rows.length){const p=document.createElement('p');p.className='muted';p.textContent='No matching institutions.';box.append(p);return;}
 for(const o of rows){
 const wrap=document.createElement('details');wrap.className='detail';
 const summary=document.createElement('summary');
 const title=document.createElement('span');title.textContent=o.name;
 const meta=document.createElement('small');
 const state=document.createElement('span');state.className=o.suspended?'suspended':'active';state.textContent='● '+(o.suspended?'Suspended':'Active');
 meta.append(state,document.createTextNode(' · /'+o.slug+(Number.isFinite(Number(o.participant_count))?' · '+o.participant_count+' participants':'')));
 summary.append(title,meta);wrap.append(summary);
 const body=document.createElement('div');body.className='detailBody';
 const publicUrl=location.origin+'/'+encodeURIComponent(o.slug),adminUrl=publicUrl+'/admin';
 for(const [k,v] of [['Public page',publicUrl],['Admin page',adminUrl],['Admin username',o.admin_username],['Plan',o.plan],['Paid until',o.paid_until||'No expiry'],['Participant limit',o.participant_limit===0?'Unlimited':o.participant_limit],['Contact',o.contact],['Notes',o.notes]])body.append(line(k,v));
 const actions=document.createElement('div');actions.className='actions';
 function button(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;actions.append(b);}
 button('↗ Open',()=>window.open(publicUrl,'_blank','noopener'));
 button('➜ Login as admin',()=>window.open(adminUrl,'_blank','noopener'));
 button('✎ Edit',()=>edit(o));
 button('⚿ Reset password',()=>resetPassword(o));
 button(o.suspended?'▶ Activate':'Ⅱ Suspend',()=>act('status',{id:o.id,suspended:!o.suspended},'Change institution status?'));
 button('⌂ Share',()=>showShare(o));
 button('▣ Delete',()=>act('delete',{id:o.id},'Permanently delete this institution and its data?'));
 body.append(actions);wrap.append(body);box.append(wrap);
 }
}
function showShare(o,password){const u=location.origin+'/'+o.slug;const msg=o.name+' - Winzera Pro\n\nPublic page (share with participants and parents):\n'+u+'\n\nAdmin login (staff only):\n'+u+'/admin\nUsername: '+(o.admin_username||'admin')+(password?'\nPassword: '+password:'\nPassword: (use the password set by the administrator)')+'\n\nPlease change the password after first login. Before installing the PWA, set the institution app name in its profile.';$('shareText').value=msg;$('shareDialog').showModal();}
async function act(action,payload,question){if(question&&!confirm(question))return;busy(true);notice('');try{await api(action,payload);await load();notice('Saved successfully.')}catch(e){notice(e.message)}finally{busy(false)}}
async function edit(o){const name=prompt('Institution name',o.name);if(name===null)return;const plan=prompt('Plan',o.plan||'standard');if(plan===null)return;const contact=prompt('Contact',o.contact||'');if(contact===null)return;const notes=prompt('Notes',o.notes||'');if(notes===null)return;await act('edit',{id:o.id,name,plan,contact,notes});}
async function resetPassword(o){const password=prompt('New password for '+o.admin_username+' (minimum 8 characters)');if(password===null)return;if(password.length<8){notice('Password must be at least 8 characters');return;}busy(true);try{await api('reset-password',{id:o.id,password});notice('Password changed. Share it privately with the institution.');showShare(o,password)}catch(e){notice(e.message)}finally{busy(false)}}
async function render(){busy(true);try{const ok=await authorized();$('login').classList.toggle('hidden',ok);$('dashboard').classList.toggle('hidden',!ok);$('logout').classList.toggle('hidden',!ok);if(ok)await load();}catch(e){notice(e.message)}finally{busy(false)}}
$('loginForm').onsubmit=async e=>{e.preventDefault();busy(true);notice('');try{const {error}=await sb.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value});if(error)throw error;if(!await authorized()){await sb.auth.signOut();throw Error('Super Admin access required')}$('password').value='';}catch(e){notice(e.message)}finally{busy(false)}await render()};
$('logout').onclick=async()=>{busy(true);await sb.auth.signOut();busy(false);await render()};
$('search').oninput=renderList;$('filter').onchange=renderList;
$('name').oninput=()=>{if(!$('slug').dataset.edited)$('slug').value=$('name').value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9 -]/g,'').trim().replace(/\s+/g,'-').slice(0,40);preview()};
$('slug').oninput=()=>{$('slug').dataset.edited='1';preview()};
function preview(){$('preview').textContent=location.origin+'/'+$('slug').value}
$('createForm').onsubmit=async e=>{e.preventDefault();notice('');const slug=$('slug').value.trim().toLowerCase(),username=$('adminUsername').value.trim().toLowerCase(),password=$('adminPassword').value;if(!/^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/.test(slug)||reserved.has(slug)){notice('Invalid or reserved institution slug');return}if(!/^[a-z0-9][a-z0-9_.-]{2,31}$/.test(username)||password.length<8){notice('Invalid username or password (minimum 8 characters)');return}busy(true);try{const result=await api('create',{name:$('name').value.trim(),slug,username,password,plan:$('plan').value.trim(),paid_until:$('paidUntil').value||null,participant_limit:Number($('participantLimit').value),contact:$('contact').value.trim(),notes:$('notes').value.trim()});$('createForm').reset();delete $('slug').dataset.edited;preview();await load();$('createDialog').close();notice('Institution created.');showShare(result.institution||{name:result.name||slug,slug,admin_username:username},password)}catch(e){notice(e.message)}finally{busy(false)}};
$('copyShare').onclick=async()=>{try{await navigator.clipboard.writeText($('shareText').value);notice('Copied to clipboard')}catch(e){notice('Copy manually from the message')}};
$('closeShare').onclick=()=>$('shareDialog').close();
$('closeShareTop').onclick=()=>$('shareDialog').close();
$('addInstitution').onclick=()=>{$('createDialog').showModal();};
$('closeCreate').onclick=()=>$('createDialog').close();
$('cancelCreate').onclick=()=>$('createDialog').close();
$('myLogin').onclick=()=>{notice('Signed-in Super Admin account. Use Supabase Auth to manage your platform credentials.');};
preview();render();
})();