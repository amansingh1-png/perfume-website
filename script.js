const CONFIG={instagram:'https://www.instagram.com/_aman_singh__81?stkn=MWptejJ2N3R3ejg1Yw%3D%3D&utm_source=qr',whatsapp:'919718209148',email:'hello@rozana.in'};
let cart=JSON.parse(localStorage.getItem('rozanaCart')||'[]');
const $=s=>document.querySelector(s);const $$=s=>document.querySelectorAll(s);
function money(n){return '₹'+n.toLocaleString('en-IN')}
function save(){localStorage.setItem('rozanaCart',JSON.stringify(cart));renderCart()}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function addToCart(name,price,img){const x=cart.find(i=>i.name===name);if(x)x.qty++;else cart.push({name,price,img,qty:1});save();toast(`${name} added to your bag`);openCart()}
function changeQty(name,delta){const x=cart.find(i=>i.name===name);if(!x)return;x.qty+=delta;if(x.qty<=0)cart=cart.filter(i=>i.name!==name);save()}
function removeItem(name){cart=cart.filter(i=>i.name!==name);save()}
function renderCart(){const n=cart.reduce((s,i)=>s+i.qty,0);$('#cartCount').textContent=n;const box=$('#cartItems');if(!cart.length){box.innerHTML='<div style="padding:50px 10px;text-align:center;color:#82786f;font-size:12px">Your bag is waiting for a signature scent.</div>';$('#cartTotal').textContent='₹0';return}box.innerHTML=cart.map(i=>`<div class="cart-row"><img src="${i.img}" alt="${i.name}"><div><h4>${i.name}</h4><small>${money(i.price)}</small><div class="qty"><button onclick="changeQty('${i.name}',-1)">−</button><span>${i.qty}</span><button onclick="changeQty('${i.name}',1)">+</button></div><button class="remove" onclick="removeItem('${i.name}')">Remove</button></div><strong>${money(i.price*i.qty)}</strong></div>`).join('');$('#cartTotal').textContent=money(cart.reduce((s,i)=>s+i.price*i.qty,0))}
function openCart(){renderCart();$('#cartDrawer').classList.add('open');$('#overlay').classList.add('show');document.body.classList.add('no-scroll')}
function closeCart(){ $('#cartDrawer').classList.remove('open');$('#overlay').classList.remove('show');document.body.classList.remove('no-scroll')}
function closeAll(){closeCart();closeSearch();closeCheckout();closeQuick()}
function openSearch(){$('#searchModal').classList.add('open');$('#searchInput').focus();document.body.classList.add('no-scroll');searchProducts('')}
function closeSearch(){$('#searchModal').classList.remove('open');if(!$('#cartDrawer').classList.contains('open'))document.body.classList.remove('no-scroll')}
function searchProducts(q){const term=q.toLowerCase();const arr=[...$$('.product')].filter(p=>p.dataset.name.toLowerCase().includes(term));$('#searchResults').innerHTML=arr.map(p=>`<div class="result" onclick="addToCart('${p.dataset.name}',${p.dataset.price},'${p.dataset.img}');closeSearch()"><span>${p.dataset.name}</span><b>${money(Number(p.dataset.price))}</b></div>`).join('')||'<p style="color:#82786f;padding:25px 0;font-size:11px">No fragrance found.</p>'}
function quickView(btn){const p=btn.closest('.product');$('#quickImg').src=p.dataset.img;$('#quickName').textContent=p.dataset.name;$('#quickPrice').textContent=money(Number(p.dataset.price));$('#quickAdd').onclick=()=>{addToCart(p.dataset.name,Number(p.dataset.price),p.dataset.img);closeQuick()};$('#quickModal').classList.add('open');document.body.classList.add('no-scroll')}
function closeQuick(){$('#quickModal').classList.remove('open');if(!$('#cartDrawer').classList.contains('open'))document.body.classList.remove('no-scroll')}
function openCheckout(){if(!cart.length){toast('Add a fragrance before checkout');return}closeCart();const total=cart.reduce((s,i)=>s+i.price*i.qty,0);$('#checkoutSummary').innerHTML=cart.map(i=>`<div class="summary-row"><span>${i.name} × ${i.qty}</span><b>${money(i.price*i.qty)}</b></div>`).join('')+`<div class="summary-row total"><span>Total</span><strong>${money(total)}</strong></div>`;$('#checkoutModal').classList.add('open');document.body.classList.add('no-scroll')}
function closeCheckout(){$('#checkoutModal').classList.remove('open');document.body.classList.remove('no-scroll')}
function giftMessage(){const toggle=$('#giftCardToggle');const box=$('#giftCardBox');if(toggle&&box){box.classList.toggle('hidden',!toggle.checked)}}
function updateGiftWords(){const ta=$('#giftMessage'),count=$('#wordCount');if(!ta||!count)return;let words=ta.value.trim()?ta.value.trim().split(/\s+/):[];if(words.length>200){ta.value=words.slice(0,200).join(' ');words=ta.value.trim().split(/\s+/)}count.textContent=`${words.length} / 200 words`}
function placeOrder(e){e.preventDefault();const f=new FormData(e.target);const total=cart.reduce((s,i)=>s+i.price*i.qty,0);const items=cart.map(i=>`${i.name} x${i.qty}`).join(', ');const gift=f.get('giftCard')==='on';const note=gift?String(f.get('giftMessage')||'').trim():'';if(gift&&note.split(/\s+/).filter(Boolean).length>200){toast('Please keep your gift message within 200 words');return}const giftLine=gift?`%0A%0ASECRET GIFT CARD:%0A${encodeURIComponent(note)}`:'';const msg=`ROZANA ORDER%0A%0AName: ${encodeURIComponent(f.get('name'))}%0APhone: ${encodeURIComponent(f.get('phone'))}%0AAddress: ${encodeURIComponent(f.get('address'))}%0AItems: ${encodeURIComponent(items)}%0ATotal: ${money(total)}%0APayment: ${encodeURIComponent(f.get('payment')==='upi'?'UPI / Online':'Cash on Delivery')}${giftLine}`;if(f.get('payment')==='upi'){toast('UPI checkout selected — connect Razorpay to collect live payment.');window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`,'_blank')}else{window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`,'_blank');cart=[];save();closeCheckout();toast('Order details sent to ROZANA WhatsApp');}}
const quizAnswers={};
$$('.mode').forEach(b=>b.onclick=()=>{ $$('.mode').forEach(x=>x.classList.remove('active')); b.classList.add('active'); const quick=b.dataset.mode==='quick'; $('#dayQuiz').classList.toggle('hidden',quick); $('#quickQuiz').classList.toggle('hidden',!quick); });
$$('.answer').forEach(b=>b.onclick=()=>{ const q=b.dataset.q; quizAnswers[q]=b.dataset.v; $$(`.answer[data-q=\"${q}\"]`).forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); });
function recommend(){
  const a=quizAnswers;
  if(['soft'].includes(a.vibe)) return ['Blush Aura',840,'Floral, soft and effortless — made for a gentle signature.'];
  if(['clean'].includes(a.vibe)||['morning','work'].includes(a.time)||['hot'].includes(a.weather)) return ['Ocean Drive',812,'Fresh, clean and aquatic — perfect for an easy everyday trail.'];
  if(['bold'].includes(a.vibe)||['bold'].includes(a.pace)||['evening','night'].includes(a.time)) return ['Noir Essence',924,'Bold, warm and memorable — built to leave an impression.'];
  if(['trendy'].includes(a.vibe)) return ['Amber Touch',1036,'Warm, modern and distinctive — a statement for your mood.'];
  return ['Noir Essence',924,'A versatile signature with depth and presence.'];
}
function revealPersonalisedSet(){const r=recommend(); $('#setRecommendation').textContent=`Your ROZANA match: ${r[0]} — ${r[2]}`; $('#setTotal').textContent=money(r[1]); $('#customResult').innerHTML=`<strong>${r[0]}</strong><span>${r[2]}</span><button class=\"btn primary full\" onclick=\"addToCart('${r[0]}',${r[1]},'${r[0].toLowerCase().split(' ')[0]}.jpg')\">Add ${r[0]} to Bag ↗</button>`; $('#customResult').classList.remove('hidden'); toast('Your personalised ROZANA match is ready');}
function resetPersonalised(){Object.keys(quizAnswers).forEach(k=>delete quizAnswers[k]); $$('.answer').forEach(x=>x.classList.remove('selected')); $('#customResult').classList.add('hidden'); $('#setRecommendation').textContent='Answer a few questions and reveal your signature.'; $('#setTotal').textContent='₹924';}

function submitContact(e){e.preventDefault();toast('Thank you — ROZANA will get back to you shortly.');e.target.reset()}
function toggleMenu(){const m=$('#mobileMenu');m.classList.toggle('show')}
function toggleSeo(){const b=document.getElementById('seoBody');const t=document.getElementById('seoToggle');const open=b.classList.toggle('open');t.textContent=open?'Read Less ↑':'Read More ↓';}
function toggleFaq(btn){const item=btn.closest('.faq-item');const isOpen=item.classList.contains('open');document.querySelectorAll('.faq-item.open').forEach(x=>x.classList.remove('open'));if(!isOpen)item.classList.add('open');}
const ANNOUNCEMENTS=['Flat 72% off — storewide launch offer','Free shipping on all prepaid orders','COD available Pan-India','Secret Gift Card available with any perfume'];
document.getElementById('announceTrack').innerHTML=ANNOUNCEMENTS.map(m=>`<span>${m}</span>`).join('')+ANNOUNCEMENTS.map(m=>`<span>${m}</span>`).join('');
window.addEventListener('scroll',()=>$('#nav').classList.toggle('scrolled',scrollY>30));document.addEventListener('mousemove',e=>{const g=$('.cursor-glow');if(g){g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'}});
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});$$('.reveal').forEach(x=>observer.observe(x));renderCart();

const giftToggle=$('#giftCardToggle');if(giftToggle)giftToggle.addEventListener('change',giftMessage);
function closeCouplePopup(){const p=$('#couplePopup');if(p){p.classList.remove('open');sessionStorage.setItem('rozanaCouplePopupSeen','1')}}
window.addEventListener('load',()=>{const p=$('#couplePopup');if(p&&!sessionStorage.getItem('rozanaCouplePopupSeen'))setTimeout(()=>p.classList.add('open'),1600)});
