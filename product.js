const PRODUCT_DATA={
  noir:{name:'Noir Essence',img:'noir.jpg',price:924,old:3299,badge:'BEST SELLER',category:'WOODY · SPICY · BOLD',intro:'A deeper signature for evenings, confidence and moments that deserve to be remembered.',description:'Noir Essence balances warm woods with a spicy edge. It is designed for someone who wants their fragrance to feel confident, polished and memorable without becoming overwhelming.',notes:[['Top','Black Pepper · Bergamot'],['Heart','Spices · Aromatic Accord'],['Base','Woody Amber · Musk']],best:'Evenings · occasions',character:'Bold · refined · warm',experience:'Long-lasting presence'},
  blush:{name:'Blush Aura',img:'blush.jpg',price:840,old:2999,badge:'NEW',category:'FLORAL · FRUITY · FRESH',intro:'Soft, luminous and effortless — a feminine signature made for everyday moments.',description:'Blush Aura blends a delicate floral character with fresh fruity brightness. The result is easy to wear, graceful and quietly expressive.',notes:[['Top','Pear · Fresh Fruits'],['Heart','Rose · Jasmine'],['Base','Soft Vanilla · Musk']],best:'Daytime · everyday',character:'Soft · graceful · playful',experience:'Fresh floral trail'},
  ocean:{name:'Ocean Drive',img:'ocean.jpg',price:812,old:2899,badge:'POPULAR',category:'CITRUS · AQUATIC · FRESH',intro:'Clean aquatic freshness for mornings, workdays and anyone who likes a crisp signature.',description:'Ocean Drive opens with a clean citrus lift and settles into a fresh aquatic character. It is built for an easy, confident everyday trail.',notes:[['Top','Citrus · Bergamot'],['Heart','Aquatic Accord · Marine Notes'],['Base','Clean Woods · Musk']],best:'Work · daytime · summer',character:'Clean · fresh · energetic',experience:'Crisp everyday freshness'},
  amber:{name:'Amber Touch',img:'amber.jpg',price:1036,old:3699,badge:'LIMITED',category:'AMBER · VANILLA · WARM',intro:'Warm amber and creamy vanilla for a richer, modern statement.',description:'Amber Touch is the warmer side of ROZANA — smooth, inviting and distinctive. It is made for evenings, celebrations and anyone who prefers a richer scent profile.',notes:[['Top','Warm Spices · Citrus'],['Heart','Amber · Floral Accord'],['Base','Vanilla · Woods · Musk']],best:'Evenings · celebrations',character:'Warm · modern · addictive',experience:'Rich amber warmth'},
  ishq:{name:'ROZANA ISHQ',img:'ishq.jpg',price:980,old:3500,badge:'FOR HER',category:'ROSE · JASMINE · VANILLA',intro:'A romantic floral signature designed to feel soft, intimate and memorable.',description:'ISHQ brings rose and jasmine into a creamy vanilla base. It is the softer half of the Couple Collection and pairs naturally with JUNOON.',notes:[['Top','Fresh Petals · Fruity Lift'],['Heart','Rose · Jasmine'],['Base','Vanilla · Soft Musk']],best:'Gifting · dates · evenings',character:'Romantic · soft · elegant',experience:'Floral vanilla comfort'},
  junoon:{name:'ROZANA JUNOON',img:'junoon.jpg',price:980,old:3500,badge:'FOR HIM',category:'BERGAMOT · TOBACCO · SANDALWOOD',intro:'A confident woody profile with tobacco warmth — made to pair with ISHQ.',description:'JUNOON combines bright bergamot with tobacco warmth and a smooth sandalwood base. It is designed as the masculine counterpart to ISHQ.',notes:[['Top','Bergamot · Citrus'],['Heart','Tobacco · Aromatic Notes'],['Base','Sandalwood · Amber · Musk']],best:'Evenings · occasions',character:'Confident · woody · warm',experience:'Smooth statement trail'}
};

function getProduct(){
  const id=new URLSearchParams(window.location.search).get('product')||'noir';
  return PRODUCT_DATA[id]||PRODUCT_DATA.noir;
}
function applyProduct(){
  const p=getProduct();
  document.title=`${p.name} — ROZANA`;
  const set=(id,value,prop='textContent')=>{const el=document.getElementById(id);if(el)el[prop]=value;};
  set('detailName',p.name); set('detailImg',p.img,'src'); set('detailImg',p.name,'alt'); set('detailBadge',p.badge); set('detailCategory',p.category); set('detailIntro',p.intro); set('detailPrice',money(p.price)); set('detailOld',money(p.old)); set('detailDescription',p.description); set('detailBest',p.best); set('detailCharacter',p.character); set('detailExperience',p.experience);
  const notes=document.getElementById('detailNotes');
  if(notes)notes.innerHTML=p.notes.map(n=>`<div><span>${n[0]}</span><b>${n[1]}</b></div>`).join('');
  const add=document.getElementById('detailAdd');
  if(add)add.onclick=()=>addToCart(p.name,p.price,p.img);
  const faq=document.getElementById('detailFaq');
  if(faq)faq.innerHTML=[
    ['How does this fragrance feel?','The profile is '+p.character.toLowerCase()+', with '+p.notes.map(n=>n[1]).join(', ')+'.'],
    ['When should I wear it?',p.best+'.'],
    ['How will my order be delivered?','Delhi, Noida and Gurugram are targeted for delivery within 24 hours. Other Indian locations are targeted within 3–4 business days.'],
    ['Can I add a gift message?','Yes. ROZANA supports a Secret Gift Card with up to 200 words during checkout.']
  ].map(x=>`<div class="faq-item"><button type="button" onclick="toggleFaq(this)">${x[0]} <span>+</span></button><div class="faq-answer">${x[1]}</div></div>`).join('');
  const rec=document.getElementById('coupleRecommend');
  if(rec && !localStorage.getItem('rozanaFirstVisitSeen')){rec.classList.add('first-visit');localStorage.setItem('rozanaFirstVisitSeen','1');}
}
function copyCoupon(){
  const save=()=>{localStorage.setItem('rozanaCoupon','ROZANA20');if(typeof toast==='function')toast('ROZANA20 saved — discount will apply at checkout');};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText('ROZANA20').then(save).catch(save);else save();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyProduct);else applyProduct();
