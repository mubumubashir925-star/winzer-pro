(()=>{
'use strict';
const $=id=>document.getElementById(id);
const sb=window.supabase.createClient('https://wzecrbhwlryzucgbpoxu.supabase.co','sb_publishable_HUJ7n4ESUTsAu9l8X8iu2g_el2aKuxK',{auth:{persistSession:true,autoRefreshToken:true}});
const busy=x=>$('busy').classList.toggle('active',x),notice=x=>{const el=$('notice');el.textContent=x||'';clearTimeout(window._wzToastTimeout);if(x)window._wzToastTimeout=setTimeout(()=>{el.textContent=''},5000)};
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
 button('▣ Delete',()=>deleteInstitution(o));
 body.append(actions);wrap.append(body);box.append(wrap);
 }
}
function showShare(o,password){const u=location.origin+'/'+o.slug;const msg=o.name+' - Winzera Pro\n\nPublic page (share with participants and parents):\n'+u+'\n\nAdmin login (staff only):\n'+u+'/admin\nUsername: '+(o.admin_username||'admin')+(password?'\nPassword: '+password:'\nPassword: (use the password set by the administrator)')+'\n\nPlease change the password after first login. Before installing the PWA, set the institution app name in its profile.';$('shareText').value=msg;$('shareDialog').showModal();}
async function act(action,payload,question){if(question&&!confirm(question))return;busy(true);$('busy').textContent=action==='delete'?'Deleting institution…':'Saving changes…';notice('');try{await api(action,payload);await load();notice('Saved successfully.')}catch(e){notice(e.message)}finally{busy(false)}}
function formDialog(title,fields,onSave,warning=''){
 const d=document.createElement('dialog');d.className='modal';d.style.cssText='padding:22px;width:min(94vw,430px);max-height:85vh;overflow:auto;z-index:2147483640';
 const form=document.createElement('form');form.style.cssText='display:grid;gap:12px';form.onsubmit=async e=>{e.preventDefault();const values={};fields.forEach(f=>values[f.key]=form.elements.namedItem(f.key).value);const submit=form.querySelector('[type=submit]');submit.disabled=true;submit.textContent='Saving…';try{await onSave(values);d.close();d.remove()}catch(err){errBox.textContent=err.message||String(err);submit.disabled=false;submit.textContent='Save changes'}};
 const heading=document.createElement('h2');heading.textContent=title;form.append(heading);
 if(warning){const p=document.createElement('p');p.style.cssText='color:#9b3232;line-height:1.5';p.textContent=warning;form.append(p)}
 for(const f of fields){const label=document.createElement('label');label.textContent=f.label;const input=document.createElement(f.multiline?'textarea':'input');input.name=f.key;if(!f.multiline)input.type=f.type||'text';input.value=f.value??'';input.required=!!f.required;if(f.minLength)input.minLength=f.minLength;input.style.marginTop='5px';label.append(input);form.append(label)}
 const errBox=document.createElement('p');errBox.style.color='#b91c1c';form.append(errBox);
 const controls=document.createElement('div');controls.style.cssText='display:flex;gap:8px;justify-content:flex-end';const cancel=document.createElement('button');cancel.type='button';cancel.textContent='Cancel';cancel.style.background='#e7edf2';cancel.style.color='#233';cancel.onclick=()=>{d.close();d.remove()};const save=document.createElement('button');save.type='submit';save.textContent='Save changes';controls.append(cancel,save);form.append(controls);d.append(form);document.body.append(d);d.showModal();return d;
}
async function edit(o){
 formDialog('Edit institution — '+o.name,[
 {key:'name',label:'Institution name',value:o.name,required:true},
 {key:'plan',label:'Plan',value:o.plan||'standard',required:true},
 {key:'contact',label:'Contact',value:o.contact||''},
 {key:'notes',label:'Notes',value:o.notes||'',multiline:true}
 ],async v=>{busy(true);try{await api('edit',{id:o.id,...v});await load();notice('Institution updated')}finally{busy(false)}});
}
async function resetPassword(o){
 formDialog('Reset admin password — '+o.name,[{key:'password',label:'New password (at least 8 characters)',type:'password',required:true,minLength:8}],async v=>{
 busy(true);try{await api('reset-password',{id:o.id,password:v.password});notice('Password reset. Share privately.');showShare(o,v.password)}finally{busy(false)}
 },'The previous password will stop working. This does not change the admin username.');
}
async function deleteInstitution(o){
 formDialog('Delete institution — '+o.name,[{key:'confirmation',label:'Type '+o.slug+' to confirm deletion',required:true}],async v=>{
 if(v.confirmation!==o.slug)throw Error('Institution slug does not match');
 busy(true);try{await api('delete',{id:o.id});await load();notice('Institution deleted')}finally{busy(false)}
 },'Deletion is permanent. Institutions containing competition data cannot be deleted until their data has been safely handled.');
}
async function render(){busy(true);try{const ok=await authorized();$('login').classList.toggle('hidden',ok);$('dashboard').classList.toggle('hidden',!ok);$('logout').classList.toggle('hidden',!ok);if(ok)await load();}catch(e){notice(e.message)}finally{busy(false)}}
$('loginForm').onsubmit=async e=>{e.preventDefault();busy(true);notice('');try{const {error}=await sb.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value});if(error)throw error;if(!await authorized()){await sb.auth.signOut();throw Error('Super Admin access required')}$('password').value='';}catch(e){notice(e.message)}finally{busy(false)}await render()};
$('logout').onclick=async()=>{busy(true);await sb.auth.signOut();busy(false);await render()};
$('search').oninput=renderList;$('filter').onchange=renderList;
$('name').oninput=()=>{if(!$('slug').dataset.edited)$('slug').value=$('name').value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9 -]/g,'').trim().replace(/\s+/g,'-').slice(0,40);preview()};
$('slug').oninput=()=>{$('slug').dataset.edited='1';preview()};
function preview(){$('preview').textContent=location.origin+'/'+$('slug').value}
$('createForm').onsubmit=async e=>{e.preventDefault();notice('');const slug=$('slug').value.trim().toLowerCase(),username=$('adminUsername').value.trim().toLowerCase(),password=$('adminPassword').value;if(!/^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/.test(slug)||reserved.has(slug)){notice('Invalid or reserved institution slug');return}if(!/^[a-z0-9][a-z0-9_.-]{2,31}$/.test(username)||password.length<8){notice('Invalid username or password (minimum 8 characters)');return}busy(true);$('busy').textContent='Creating institution and admin account…';try{const result=await api('create',{name:$('name').value.trim(),slug,username,password,plan:$('plan').value.trim(),paid_until:$('paidUntil').value||null,participant_limit:Number($('participantLimit').value),contact:$('contact').value.trim(),notes:$('notes').value.trim()});$('createForm').reset();delete $('slug').dataset.edited;preview();await load();$('createDialog').close();notice('Institution created.');showShare(result.institution||{name:result.name||slug,slug,admin_username:username},password)}catch(e){notice(e.message)}finally{busy(false)}};
$('copyShare').onclick=async()=>{try{await navigator.clipboard.writeText($('shareText').value);notice('Copied to clipboard')}catch(e){notice('Copy manually from the message')}};
$('closeShare').onclick=()=>$('shareDialog').close();
$('closeShareTop').onclick=()=>$('shareDialog').close();
$('addInstitution').onclick=()=>{$('createDialog').showModal();};
$('closeCreate').onclick=()=>$('createDialog').close();
$('cancelCreate').onclick=()=>$('createDialog').close();
$('myLogin').onclick=async()=>{try{if(!await authorized()){notice('Please sign in as Super Admin first.');return}const {data:{user},error}=await sb.auth.getUser();if(error)throw error;$('accountEmail').value=user?.email||'';$('newAccountPassword').value='';$('confirmAccountPassword').value='';$('accountDialog').showModal()}catch(e){notice(e.message)}};
$('closeAccount').onclick=$('closeAccountBottom').onclick=()=>$('accountDialog').close();
$('changePasswordForm').onsubmit=async e=>{e.preventDefault();const pass=$('newAccountPassword').value,confirm=$('confirmAccountPassword').value;if(pass.length<12){notice('Password must contain at least 12 characters.');return}if(pass!==confirm){notice('Passwords do not match.');return}busy(true);try{if(!await authorized())throw Error('Super Admin session expired. Sign in again.');const {error}=await sb.auth.updateUser({password:pass});if(error)throw error;$('changePasswordForm').reset();$('accountDialog').close();notice('Password changed successfully. Store your new password securely.')}catch(err){notice(err.message)}finally{busy(false)}};
$('forgotPassword').onclick=async()=>{const email=$('email').value.trim();if(!email){notice('Enter your Super Admin email first.');$('email').focus();return}busy(true);try{const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+'/super-admin.html'});if(error)throw error;notice('If this email has an account, password recovery instructions will be sent.')}catch(err){notice(err.message)}finally{busy(false)}};
preview();render();
})();