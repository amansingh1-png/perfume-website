/* ROZANA — animation add-on. Just include this file, no other edits needed. */
(function(){
  "use strict";
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- inject extra CSS ---- */
  const css = `
  #rz-progress{position:fixed;top:0;left:0;height:3px;width:0%;background:linear-gradient(90deg,#c89346,#f3d08c);z-index:999;transition:width .12s ease;box-shadow:0 0 10px rgba(216,170,94,.6);}

  .btn.primary,.add{position:relative;overflow:hidden;}
  .btn.primary::after,.add::after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;
    background:linear-gradient(115deg,transparent,rgba(255,255,255,.35),transparent);
    transform:skewX(-20deg);transition:left .6s ease;}
  .btn.primary:hover::after,.add:hover::after{left:130%;}

  .links a{position:relative;}
  .links a::after{content:"";position:absolute;left:0;bottom:-6px;width:0;height:1px;background:var(--gold2);transition:width .3s ease;}
  .links a:hover::after{width:100%;}

  .product,.note{transition:transform .35s ease, box-shadow .35s ease !important; will-change:transform;}
  .btn,.cart-btn{transition:transform .25s ease;}

  .hero-art img{transition:transform .25s ease-out;}
  .orbit{transition:transform .3s ease-out;}

  .rz-spark{position:absolute;width:4px;height:4px;border-radius:50%;background:#f3d08c;pointer-events:none;
    box-shadow:0 0 8px 2px rgba(243,208,140,.8);animation:rzTwinkle 2.6s ease-in-out infinite;}
  @keyframes rzTwinkle{0%,100%{opacity:.15;transform:scale(.6);}50%{opacity:1;transform:scale(1.3);}}

  h1 i,.section h2 i,.experience h2 i,.custom h2 i,.founder h2 i,.notes h2 i,.contact h2 i{
    animation:rzGlow 3.5s ease-in-out infinite;}
  @keyframes rzGlow{0%,100%{text-shadow:0 0 6px rgba(243,208,140,.15);}50%{text-shadow:0 0 18px rgba(243,208,140,.55);}}

  .marquee div{animation-play-state:running;}
  .marquee:hover div{animation-play-state:paused;}

  .reveal{transition-timing-function:cubic-bezier(.16,.8,.3,1) !important;}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  if(reduced) return; /* skip motion-heavy JS for reduced-motion users, keep base CSS only */

  /* ---- scroll progress bar ---- */
  const bar = document.createElement('div');
  bar.id = 'rz-progress';
  document.body.appendChild(bar);
  window.addEventListener('scroll', ()=>{
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = pct + '%';
  }, {passive:true});

  /* ---- stagger .reveal siblings so groups don't fade in all at once ---- */
  const groups = {};
  document.querySelectorAll('.reveal').forEach(el=>{
    const parent = el.parentElement;
    if(!groups[parent] ) groups[parent] = [];
    groups[parent].push(el);
  });
  Object.values(groups).forEach(list=>{
    list.forEach((el,i)=>{ el.style.transitionDelay = Math.min(i*90,360)+'ms'; });
  });

  /* ---- magnetic buttons ---- */
  document.querySelectorAll('.btn, .cart-btn, .icon-btn').forEach(btn=>{
    btn.addEventListener('mousemove', e=>{
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) * 0.25;
      const y = (e.clientY - r.top - r.height/2) * 0.35;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', ()=>{ btn.style.transform = ''; });
  });

  /* ---- 3D tilt on product & note cards ---- */
  document.querySelectorAll('.product, .note').forEach(card=>{
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${(-py*6).toFixed(2)}deg) rotateY(${(px*8).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', ()=>{ card.style.transform = ''; });
  });

  /* ---- hero parallax ---- */
  const hero = document.querySelector('.hero');
  const heroImg = document.querySelector('.hero-art img');
  const orbits = document.querySelectorAll('.orbit');
  if(hero && heroImg){
    hero.addEventListener('mousemove', e=>{
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      heroImg.style.transform = `translate(${px*14}px,${py*14}px)`;
      orbits.forEach((o,i)=>{ o.style.transform = `translate(${-px*(10+i*6)}px,${-py*(10+i*6)}px)`; });
    });
    hero.addEventListener('mouseleave', ()=>{
      heroImg.style.transform = '';
      orbits.forEach(o=> o.style.transform = '');
    });
  }

  /* ---- sparkle particles inside hero art ---- */
  const heroArt = document.querySelector('.hero-art');
  if(heroArt){
    for(let i=0;i<7;i++){
      const s = document.createElement('span');
      s.className = 'rz-spark';
      s.style.left = (10+Math.random()*80)+'%';
      s.style.top = (8+Math.random()*84)+'%';
      s.style.animationDelay = (Math.random()*2.6)+'s';
      heroArt.appendChild(s);
    }
  }
})();
