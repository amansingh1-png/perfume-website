/* ROZANA simple free email/password account UI.
   Static-site version: credentials are stored locally in this browser.
   For production authentication, connect a backend/auth provider later. */
(function(){
  const KEY='rozanaLocalAccounts'; const SESSION='rozanaCurrentUser';
  const $=s=>document.querySelector(s);
  function accounts(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
  function current(){try{return JSON.parse(localStorage.getItem(SESSION)||'null')}catch(e){return null}}
  function setUser(u){localStorage.setItem(SESSION,JSON.stringify(u)); updateButton();}
  function updateButton(){document.querySelectorAll('.rz-auth-btn').forEach(b=>{const u=current();b.textContent=u?`Hi, ${u.name||u.email.split('@')[0]}`:'Login';});}
  function toast(m){if(typeof window.toast==='function')window.toast(m);else alert(m)}
  function inject(){
    document.querySelectorAll('.nav-actions').forEach(a=>{if(a.querySelector('.rz-auth-btn'))return;const b=document.createElement('button');b.className='rz-auth-btn';b.textContent='Login';b.onclick=open; a.insertBefore(b,a.firstChild)});
    if($('#rzAuthOverlay'))return;
    const wrap=document.createElement('div');wrap.innerHTML=`<div class="rz-auth-overlay" id="rzAuthOverlay"><div class="rz-auth-card"><button class="rz-auth-close" onclick="window.rzCloseAuth()">×</button><div class="rz-auth-brand">ROZANA</div><p class="rz-auth-sub">Your account, simply. No OTP. No Google. Just email & password.</p><div id="rzAuthError" class="rz-auth-error"></div><div class="rz-auth-tabs"><button class="rz-auth-tab active" data-mode="login">Login</button><button class="rz-auth-tab" data-mode="signup">Create Account</button></div><input class="rz-auth-field" id="rzName" placeholder="Your name" autocomplete="name"><input class="rz-auth-field" id="rzEmail" type="email" placeholder="Email address" autocomplete="email"><input class="rz-auth-field" id="rzPassword" type="password" placeholder="Password (6+ characters)" autocomplete="current-password"><button class="rz-auth-primary" id="rzAuthSubmit">Login</button><button class="rz-auth-logout" id="rzLogoutBtn" style="display:none">Log Out</button><p class="rz-auth-hint">This free version keeps your account on this browser only.</p></div></div>`;
    document.body.appendChild(wrap.firstElementChild);
    let mode='login';
    document.querySelectorAll('.rz-auth-tab').forEach(t=>t.onclick=()=>{mode=t.dataset.mode;document.querySelectorAll('.rz-auth-tab').forEach(x=>x.classList.toggle('active',x===t));$('#rzName').style.display=mode==='signup'?'block':'none';$('#rzAuthSubmit').textContent=mode==='signup'?'Create Account':'Login';clearError()});
    $('#rzName').style.display='none'; $('#rzAuthSubmit').onclick=()=>submit(mode); $('#rzLogoutBtn').onclick=logout;
  }
  function err(m){const e=$('#rzAuthError');e.textContent=m;e.classList.add('show')}
  function clearError(){const e=$('#rzAuthError');if(e){e.textContent='';e.classList.remove('show')}}
  function open(){clearError();const u=current();$('#rzAuthOverlay').classList.add('open');if(u){$('#rzName').value=u.name||'';$('#rzEmail').value=u.email||'';$('#rzPassword').value='';$('#rzLogoutBtn').style.display='block';$('#rzAuthSubmit').style.display='none';}else{$('#rzLogoutBtn').style.display='none';$('#rzAuthSubmit').style.display='block';}}
  function close(){const o=$('#rzAuthOverlay');if(o)o.classList.remove('open')}
  function submit(mode){clearError();const name=$('#rzName').value.trim(),email=$('#rzEmail').value.trim().toLowerCase(),pass=$('#rzPassword').value;if(!/^\S+@\S+\.\S+$/.test(email)){err('Please enter a valid email address.');return}if(pass.length<6){err('Password must be at least 6 characters.');return}const a=accounts();if(mode==='signup'){if(a[email]){err('An account already exists with this email.');return}a[email]={name:name||email.split('@')[0],email,password:pass};localStorage.setItem(KEY,JSON.stringify(a));setUser(a[email]);close();toast('Your ROZANA account is ready.')}else{if(!a[email]||a[email].password!==pass){err('Email or password is incorrect.');return}setUser(a[email]);close();toast('Welcome back to ROZANA.')}}
  function logout(){localStorage.removeItem(SESSION);close();updateButton();toast('You have been logged out.')}
  window.rzCloseAuth=close; window.rzOpenAuth=open;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{inject();updateButton()});else{inject();updateButton()}
})();