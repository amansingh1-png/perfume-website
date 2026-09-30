(function(){
  'use strict';

  const firebaseConfig = {
    apiKey: "AIzaSyAba3cpZYvbtskh3kmtAlfsUHuFamb8vig",
    authDomain: "rozana-ee5dd.firebaseapp.com",
    projectId: "rozana-ee5dd",
    storageBucket: "rozana-ee5dd.firebasestorage.app",
    messagingSenderId: "740074902164",
    appId: "1:740074902164:web:cff1f74b73ba3f3e0a1a81",
    measurementId: "G-WXXCSF7CJ4"
  };

  if (!window.firebase) return;
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  let confirmationResult = null;
  let recaptchaVerifier = null;

  const css = `
  .rz-auth-btn{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.04);color:inherit;border-radius:999px;padding:10px 15px;font:600 11px/1 DM Sans, sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:.25s;white-space:nowrap}
  .rz-auth-btn:hover{border-color:rgba(243,208,140,.7);transform:translateY(-1px)}
  .rz-auth-user{display:none;align-items:center;gap:8px}
  .rz-auth-user.show{display:flex}
  .rz-auth-user-name{max-width:105px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;opacity:.9}
  .rz-auth-overlay{position:fixed;inset:0;background:rgba(0,0,0,.72);backdrop-filter:blur(12px);z-index:10050;display:none;align-items:center;justify-content:center;padding:20px}
  .rz-auth-overlay.open{display:flex}
  .rz-auth-card{position:relative;width:min(440px,100%);max-height:92vh;overflow:auto;background:#171411;border:1px solid rgba(243,208,140,.22);box-shadow:0 30px 100px rgba(0,0,0,.5);border-radius:22px;padding:30px;color:#f5eee6}
  .rz-auth-close{position:absolute;right:18px;top:15px;border:0;background:none;color:#cfc5bb;font-size:27px;cursor:pointer}
  .rz-auth-brand{font:700 26px/1 'Playfair Display',serif;letter-spacing:.08em;margin-bottom:6px}
  .rz-auth-sub{color:#9e948a;font-size:12px;margin:0 0 22px}
  .rz-auth-tabs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;background:#0f0d0b;padding:5px;border-radius:12px;margin-bottom:18px}
  .rz-auth-tab{border:0;background:transparent;color:#968c82;border-radius:9px;padding:10px 6px;font-size:11px;cursor:pointer}
  .rz-auth-tab.active{background:#29231d;color:#f3d08c}
  .rz-auth-form{display:none}.rz-auth-form.active{display:block}
  .rz-auth-field{width:100%;box-sizing:border-box;margin:0 0 10px;padding:13px 14px;border-radius:11px;border:1px solid #39322c;background:#100e0c;color:#fff;outline:none;font:13px DM Sans,sans-serif}
  .rz-auth-field:focus{border-color:#c89346}
  .rz-auth-primary{width:100%;border:0;border-radius:11px;padding:13px;background:linear-gradient(135deg,#c89346,#f3d08c);color:#16110b;font:700 12px DM Sans,sans-serif;cursor:pointer;margin-top:4px}
  .rz-auth-google{width:100%;border:1px solid #4a433c;border-radius:11px;padding:12px;background:#211d19;color:#fff;font:600 12px DM Sans,sans-serif;cursor:pointer;margin-top:10px}
  .rz-auth-divider{display:flex;align-items:center;gap:10px;color:#6f675f;font-size:10px;margin:17px 0}.rz-auth-divider:before,.rz-auth-divider:after{content:'';height:1px;background:#332d28;flex:1}
  .rz-auth-hint{font-size:10px;color:#847a70;margin:10px 0 0;line-height:1.5}
  .rz-auth-error{display:none;color:#ffb0a7;background:rgba(140,38,28,.15);border:1px solid rgba(255,100,80,.2);padding:10px;border-radius:9px;font-size:11px;margin-bottom:10px}
  .rz-auth-error.show{display:block}
  .rz-auth-success{color:#bfe9c7;font-size:11px;margin:8px 0}
  .rz-auth-account{display:none}.rz-auth-account.open{display:block}
  .rz-auth-account p{color:#aaa096;font-size:12px;line-height:1.5}.rz-auth-account strong{color:#f3d08c}
  .rz-auth-logout{margin-top:15px;width:100%;border:1px solid #4a433c;background:transparent;color:#eee;border-radius:11px;padding:12px;cursor:pointer}
  .rz-phone-wrap{display:none}.rz-phone-wrap.active{display:block}
  #rz-recaptcha{margin:10px 0}
  @media(max-width:700px){.rz-auth-user-name{display:none}.rz-auth-card{padding:24px 18px}.rz-auth-btn{padding:9px 12px}}
  `;
  const style=document.createElement('style'); style.textContent=css; document.head.appendChild(style);

  function injectUI(){
    document.querySelectorAll('.nav-actions').forEach(actions=>{
      if(actions.querySelector('.rz-auth-btn')) return;
      const btn=document.createElement('button'); btn.className='rz-auth-btn'; btn.id='rzAuthOpen'; btn.textContent='Login'; btn.onclick=()=>openAuth();
      actions.insertBefore(btn, actions.firstChild);
    });

    if(document.getElementById('rzAuthOverlay')) return;
    const wrap=document.createElement('div');
    wrap.innerHTML=`
      <div class="rz-auth-overlay" id="rzAuthOverlay">
        <div class="rz-auth-card" role="dialog" aria-modal="true" aria-label="ROZANA account">
          <button class="rz-auth-close" onclick="window.rzCloseAuth()">×</button>
          <div class="rz-auth-brand">ROZANA</div>
          <p class="rz-auth-sub">Sign in to save your account and continue your fragrance journey.</p>
          <div id="rzAuthError" class="rz-auth-error"></div>
          <div id="rzAuthLoginView">
            <div class="rz-auth-tabs">
              <button class="rz-auth-tab active" data-view="email">Email</button>
              <button class="rz-auth-tab" data-view="phone">Phone</button>
              <button class="rz-auth-tab" data-view="account">Account</button>
            </div>
            <div class="rz-auth-form active" id="rzEmailForm">
              <input class="rz-auth-field" id="rzEmail" type="email" placeholder="Email address" autocomplete="email">
              <input class="rz-auth-field" id="rzPassword" type="password" placeholder="Password" autocomplete="current-password">
              <button class="rz-auth-primary" onclick="window.rzEmailLogin()">Login with Email</button>
              <button class="rz-auth-google" onclick="window.rzGoogleLogin()">Continue with Google</button>
              <div class="rz-auth-divider">NEW TO ROZANA?</div>
              <button class="rz-auth-primary" onclick="window.rzEmailSignup()">Create Account with Email</button>
              <p class="rz-auth-hint">Use at least 6 characters for your password.</p>
            </div>
            <div class="rz-auth-form" id="rzPhoneForm">
              <div class="rz-phone-wrap active" id="rzPhoneStepOne">
                <input class="rz-auth-field" id="rzPhone" type="tel" placeholder="Phone number e.g. +91 9718209148" autocomplete="tel">
                <div id="rz-recaptcha"></div>
                <button class="rz-auth-primary" onclick="window.rzSendOtp()">Send OTP</button>
                <p class="rz-auth-hint">A verification code will be sent by SMS. Include country code, e.g. +91.</p>
              </div>
              <div class="rz-phone-wrap" id="rzPhoneStepTwo">
                <input class="rz-auth-field" id="rzOtp" inputmode="numeric" placeholder="Enter 6-digit OTP" autocomplete="one-time-code">
                <button class="rz-auth-primary" onclick="window.rzVerifyOtp()">Verify & Continue</button>
                <button class="rz-auth-google" onclick="window.rzResetPhone()">Use another number</button>
              </div>
            </div>
            <div class="rz-auth-account" id="rzAccountView">
              <p>You are signed in as<br><strong id="rzAccountName">—</strong></p>
              <p id="rzAccountEmail"></p>
              <button class="rz-auth-logout" onclick="window.rzLogout()">Log Out</button>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(wrap.firstElementChild);
    document.querySelectorAll('.rz-auth-tab').forEach(tab=>tab.addEventListener('click',()=>switchAuthTab(tab.dataset.view)));
  }

  function showError(msg){const e=document.getElementById('rzAuthError');if(e){e.textContent=msg;e.classList.add('show')}}
  function clearError(){const e=document.getElementById('rzAuthError');if(e){e.textContent='';e.classList.remove('show')}}
  function openAuth(){clearError();document.getElementById('rzAuthOverlay').classList.add('open');document.body.classList.add('no-scroll');updateUI(auth.currentUser);}
  function closeAuth(){const o=document.getElementById('rzAuthOverlay');if(o)o.classList.remove('open');document.body.classList.remove('no-scroll')}
  function switchAuthTab(view){clearError();document.querySelectorAll('.rz-auth-tab').forEach(t=>t.classList.toggle('active',t.dataset.view===view));document.getElementById('rzEmailForm').classList.toggle('active',view==='email');document.getElementById('rzPhoneForm').classList.toggle('active',view==='phone');document.getElementById('rzAccountView').classList.toggle('open',view==='account');}

  function friendlyError(err){
    const code=err && err.code || '';
    const map={
      'auth/invalid-email':'Please enter a valid email address.',
      'auth/user-not-found':'No account found with this email.',
      'auth/wrong-password':'Incorrect password. Please try again.',
      'auth/email-already-in-use':'An account already exists with this email.',
      'auth/weak-password':'Password should be at least 6 characters.',
      'auth/popup-closed-by-user':'Google sign-in was closed.',
      'auth/invalid-phone-number':'Please enter a valid phone number with country code.',
      'auth/too-many-requests':'Too many attempts. Please try again later.',
      'auth/invalid-verification-code':'Incorrect OTP. Please check and try again.',
      'auth/code-expired':'OTP expired. Please request a new code.'
    };
    return map[code] || (err && err.message ? err.message.replace(/^Firebase:\s*/,'') : 'Something went wrong. Please try again.');
  }

  async function emailLogin(){
    clearError();
    const email=document.getElementById('rzEmail').value.trim(), password=document.getElementById('rzPassword').value;
    if(!email||!password){showError('Please enter your email and password.');return;}
    try{await auth.signInWithEmailAndPassword(email,password);closeAuth();toastSafe('Welcome back to ROZANA.');}
    catch(e){showError(friendlyError(e));}
  }
  async function emailSignup(){
    clearError();
    const email=document.getElementById('rzEmail').value.trim(), password=document.getElementById('rzPassword').value;
    if(!email||!password){showError('Please enter your email and password to create an account.');return;}
    try{await auth.createUserWithEmailAndPassword(email,password);closeAuth();toastSafe('Your ROZANA account is ready.');}
    catch(e){showError(friendlyError(e));}
  }
  async function googleLogin(){
    clearError();
    try{await auth.signInWithPopup(googleProvider);closeAuth();toastSafe('Signed in with Google.');}
    catch(e){showError(friendlyError(e));}
  }
  function setupRecaptcha(){
    if(recaptchaVerifier) return;
    recaptchaVerifier=new firebase.auth.RecaptchaVerifier('rz-recaptcha',{size:'normal',callback:function(){},'expired-callback':function(){recaptchaVerifier=null;}});
    recaptchaVerifier.render();
  }
  async function sendOtp(){
    clearError();
    const phone=document.getElementById('rzPhone').value.trim();
    if(!/^\+[1-9]\d{7,14}$/.test(phone)){showError('Enter the phone number with country code, e.g. +91 9718209148.');return;}
    try{
      setupRecaptcha();
      confirmationResult=await auth.signInWithPhoneNumber(phone,recaptchaVerifier);
      document.getElementById('rzPhoneStepOne').classList.remove('active');document.getElementById('rzPhoneStepTwo').classList.add('active');
    }catch(e){if(recaptchaVerifier){try{recaptchaVerifier.clear()}catch(_){ } recaptchaVerifier=null;}showError(friendlyError(e));}
  }
  async function verifyOtp(){
    clearError(); const code=document.getElementById('rzOtp').value.trim();
    if(!confirmationResult){showError('Please request an OTP first.');return;}
    if(!/^\d{6}$/.test(code)){showError('Please enter the 6-digit OTP.');return;}
    try{await confirmationResult.confirm(code);confirmationResult=null;closeAuth();toastSafe('Phone verified. Welcome to ROZANA.');}
    catch(e){showError(friendlyError(e));}
  }
  function resetPhone(){clearError();confirmationResult=null;document.getElementById('rzPhoneStepTwo').classList.remove('active');document.getElementById('rzPhoneStepOne').classList.add('active');if(recaptchaVerifier){try{recaptchaVerifier.clear()}catch(_){ }recaptchaVerifier=null;}setTimeout(setupRecaptcha,50)}
  async function logout(){try{await auth.signOut();closeAuth();toastSafe('You have been logged out.')}catch(e){showError(friendlyError(e))}}
  function updateUI(user){
    document.querySelectorAll('.rz-auth-btn').forEach(btn=>{btn.textContent=user?(user.displayName||user.email||user.phoneNumber||'Account'):'Login';btn.onclick=()=>openAuth()});
    const tab=document.querySelector('.rz-auth-tab[data-view="account"]');
    if(user){document.getElementById('rzAccountName').textContent=user.displayName||'ROZANA Customer';document.getElementById('rzAccountEmail').textContent=user.email||user.phoneNumber||'';if(tab){tab.style.display='block'}}
    else if(tab){tab.style.display='none'}
    if(document.getElementById('rzAccountView')) switchAuthTab(user?'account':'email');
  }
  function toastSafe(msg){if(typeof window.toast==='function')window.toast(msg);}

  window.rzCloseAuth=closeAuth;window.rzEmailLogin=emailLogin;window.rzEmailSignup=emailSignup;window.rzGoogleLogin=googleLogin;window.rzSendOtp=sendOtp;window.rzVerifyOtp=verifyOtp;window.rzResetPhone=resetPhone;window.rzLogout=logout;
  window.rzOpenAuth=openAuth;

  function init(){injectUI();auth.onAuthStateChanged(updateUI)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
