// Supabase Edge Function: deploy as "institution-admin" with JWT verification enabled.
// Uses service-role ONLY on the server. Never put SUPABASE_SERVICE_ROLE_KEY in frontend files.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const json=(v,status=200)=>new Response(JSON.stringify(v),{status,headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization,apikey,content-type','Access-Control-Allow-Methods':'POST,OPTIONS','Cache-Control':'no-store'}});
const safe=(s)=>String(s||'').trim();
const emailFor=(slug,user)=>slug+'--'+user+'@accounts.winzera.invalid';
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return json({});
 if(req.method!=='POST')return json({error:'Method not allowed'},405);
 try{
 const url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!,service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
 const token=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
 if(!token)return json({error:'Sign in required'},401);
 const userClient=createClient(url,anon,{global:{headers:{Authorization:'Bearer '+token}},auth:{persistSession:false}});
 const {data:{user},error:authError}=await userClient.auth.getUser(token);
 if(authError||!user)return json({error:'Invalid session'},401);
 const admin=createClient(url,service,{auth:{persistSession:false}});
 const {data:profile,error:profileError}=await admin.from('users').select('role').eq('id',user.id).single();
 if(profileError||profile?.role!=='super_admin')return json({error:'Super Admin required'},403);
 const b=await req.json(),action=b.action;
 const fetchOrg=async()=>{const {data,error}=await admin.from('institution_management').select('*,organizations!inner(name,slug)').eq('org_id',b.id).maybeSingle();if(error)throw error;if(!data)throw Error('This is a legacy institution without management settings. Migrate it before editing or deleting.');return data};
 if(action==='list'){
 const {data:orgs,error}=await admin.from('organizations').select('id,name,slug').order('name');if(error)throw error;
 const {data:meta,error:metaErr}=await admin.from('institution_management').select('*');if(metaErr)throw metaErr;
 const byId=new Map((meta||[]).map(m=>[m.org_id,m]));
 return json({institutions:(orgs||[]).map(o=>({...o,...(byId.get(o.id)||{}),id:o.id}))});
 }
 if(action==='create'){
 const name=safe(b.name),slug=safe(b.slug).toLowerCase(),username=safe(b.username).toLowerCase(),password=String(b.password||'');
 if(!name||name.length>150||!/^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/.test(slug)||['super-admin','admin','api','assets','icons','judge','broadcast','index','login','app','manifest'].includes(slug))throw Error('Invalid institution name or slug');
 if(!/^[a-z0-9][a-z0-9_.-]{2,31}$/.test(username)||password.length<8)throw Error('Invalid username or password');
 const {data:org,error:orgError}=await admin.from('organizations').insert({name,slug}).select('id,name,slug').single();if(orgError)throw orgError;
 let authId=null;
 try{
 const created=await admin.auth.admin.createUser({email:emailFor(slug,username),password,email_confirm:true,app_metadata:{winzera_org_id:org.id}});
 if(created.error)throw created.error;authId=created.data.user.id;
 const {error:userError}=await admin.from('users').insert({id:authId,org_id:org.id,role:'admin'});if(userError)throw userError;
 const {error:metaError}=await admin.from('institution_management').insert({org_id:org.id,admin_user_id:authId,admin_username:username,plan:safe(b.plan)||'standard',paid_until:b.paid_until||null,participant_limit:Number(b.participant_limit)||0,contact:safe(b.contact),notes:safe(b.notes)});if(metaError)throw metaError;
 return json({institution:{...org,admin_username:username}});
 }catch(e){if(authId)await admin.auth.admin.deleteUser(authId);await admin.from('organizations').delete().eq('id',org.id);throw e;}
 }
 if(!b.id)return json({error:'Institution id required'},400);
 const org=await fetchOrg();
 if(action==='edit'){
 const patch={name:safe(b.name)};
 if(!patch.name)throw Error('Name required');
 const {error:e1}=await admin.from('organizations').update(patch).eq('id',b.id);if(e1)throw e1;
 const {error:e2}=await admin.from('institution_management').update({plan:safe(b.plan)||'standard',contact:safe(b.contact),notes:safe(b.notes)}).eq('org_id',b.id);if(e2)throw e2;
 return json({ok:true});
 }
 if(action==='reset-password'){
 const password=String(b.password||'');if(password.length<8)throw Error('Minimum 8-character password required');
 const {error}=await admin.auth.admin.updateUserById(org.admin_user_id,{password});if(error)throw error;return json({ok:true});
 }
 if(action==='status'){const {error}=await admin.from('institution_management').update({suspended:!!b.suspended}).eq('org_id',b.id);if(error)throw error;return json({ok:true});}
 if(action==='delete'){
 // Reject deletion if institution has operational data: avoid orphaned records and surprise data loss.
 for(const table of ['teams','participants','items','sections','groups','marks']){
 const {count,error}=await admin.from(table).select('*',{count:'exact',head:true}).eq('org_id',b.id);
 if(error)throw error;if((count||0)>0)throw Error('Institution contains '+table+'. Clear its data before deleting.');
 }
 const {error}=await admin.from('organizations').delete().eq('id',b.id);if(error)throw error;
 const removed=await admin.auth.admin.deleteUser(org.admin_user_id);if(removed.error)throw removed.error;
 return json({ok:true});
 }
 return json({error:'Unknown action'},400);
 }catch(e){return json({error:e instanceof Error?e.message:'Unexpected error'},400)}
});
