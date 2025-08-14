
const products = [
  {id:'m1', name:'Classic Milk Pudding', price:28000, img:'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop', desc:'Puding susu klasik, lembut.'},
  {id:'m2', name:'Strawberry Velvet', price:32000, img:'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?q=80&w=800&auto=format&fit=crop', desc:'Rasa stroberi, topping buah.'},
  {id:'m3', name:'Matcha Dream', price:35000, img:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop', desc:'Matcha premium, rasa lembut.'},
  {id:'m4', name:'Chocolate Lava Pudding', price:38000, img:'https://images.unsplash.com/photo-1603133872876-96e4d0e6b9e6?q=80&w=800&auto=format&fit=crop', desc:'Cokelat meleleh, sensasi hangat.'}
];

// Slider
const slidesWrap = document.querySelector('.slides');
const slideEls = Array.from(document.querySelectorAll('.slide'));
const dotsWrap = document.getElementById('dots');
let current=0, timer=null;
function buildDots(){ if(!dotsWrap) return; dotsWrap.innerHTML=''; slideEls.forEach((_,i)=>{ const b=document.createElement('button'); if(i===current) b.classList.add('active'); b.addEventListener('click', ()=>goTo(i)); dotsWrap.appendChild(b); }); }
function goTo(i){ current=(i+slideEls.length)%slideEls.length; slidesWrap.style.transform=`translateX(-${current*100}%)`; buildDots(); restart(); }
function next(){ goTo(current+1) } function prev(){ goTo(current-1) }
document.getElementById('next').addEventListener('click', next); document.getElementById('prev').addEventListener('click', prev);
document.getElementById('slider').addEventListener('mouseenter', ()=>clearInterval(timer)); document.getElementById('slider').addEventListener('mouseleave', startAuto);
function startAuto(){ timer = setInterval(next, 4500) } function stopAuto(){ clearInterval(timer) } function restart(){ stopAuto(); startAuto(); }
buildDots(); startAuto();

// Render menu
const menuGrid = document.getElementById('menuGrid');
const qty={};
function renderMenu(){ menuGrid.innerHTML=''; products.forEach((p,i)=>{ qty[p.id]=1; const card=document.createElement('article'); card.className='card'; card.style.animationDelay=(i*80)+'ms'; card.innerHTML = `<img src="${p.img}" alt="${p.name}"><div class="info"><h3>${p.name}</h3><p>${p.desc}</p><div class="row"><div><strong>Rp${p.price.toLocaleString()}</strong></div><div style="display:flex;align-items:center;gap:8px"><div class="qty"><button onclick="changeQty('${p.id}',-1)">−</button><span id="q-${p.id}">1</span><button onclick="changeQty('${p.id}',1)">+</button></div><button class="btn primary" onclick="addToCart('${p.id}')">Tambah</button></div></div></div>`; menuGrid.appendChild(card); }); }
function changeQty(id,delta){ qty[id]=Math.max(1,(qty[id]||1)+delta); const el=document.getElementById('q-'+id); if(el) el.textContent=qty[id]; }
renderMenu();

// Cart localStorage
const KEY='meltedmood_cart_v1';
function getCart(){ return JSON.parse(localStorage.getItem(KEY)||'[]'); }
function saveCart(c){ localStorage.setItem(KEY, JSON.stringify(c)); updateCart(); renderCheckout(); }
function addToCart(id){ const p=products.find(x=>x.id===id); if(!p) return; const cart=getCart(); const q=qty[id]||1; const idx=cart.findIndex(i=>i.id===id); if(idx>-1) cart[idx].qty+=q; else cart.push({id:p.id,name:p.name,price:p.price,img:p.img,qty:q}); saveCart(cart); showToast(p.name+' ditambahkan'); openCart(); }
function removeFromCart(id){ saveCart(getCart().filter(i=>i.id!==id)); }
function changeCartQty(id,delta){ const c=getCart().map(i=> i.id===id ? {...i, qty: Math.max(1,i.qty+delta)} : i); saveCart(c); }
function updateCart(){ const cart=getCart(); const cartCount=document.getElementById('cartCount'); const cartItems=document.getElementById('cartItems'); const cartTotal=document.getElementById('cartTotal'); cartItems.innerHTML=''; let total=0,count=0; cart.forEach(it=>{ total+=it.price*it.qty; count+=it.qty; const row=document.createElement('div'); row.className='cart-item'; row.innerHTML=`<img src="${it.img}" alt="${it.name}"><div style="flex:1"><strong>${it.name}</strong><div style="color:#666;font-size:12px">Rp${it.price.toLocaleString()} × ${it.qty}</div><div style="margin-top:8px;display:flex;gap:6px"><button class="btn ghost" onclick="changeCartQty('${it.id}',-1)">−</button><button class="btn ghost" onclick="changeCartQty('${it.id}',1)">+</button><button class="btn outline" onclick="removeFromCart('${it.id}')">Hapus</button></div></div><div style="font-weight:700">Rp${(it.price*it.qty).toLocaleString()}</div>`; cartItems.appendChild(row); }); cartCount.textContent=count; cartTotal.textContent=`Rp${total.toLocaleString()}`; }
document.getElementById('openCart').addEventListener('click', ()=>{ document.getElementById('cartDrawer').classList.add('open'); document.getElementById('overlay').hidden=false; });
document.getElementById('closeCart').addEventListener('click', ()=>{ document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('overlay').hidden=true; });
document.getElementById('clearCart').addEventListener('click', ()=> saveCart([])); document.getElementById('gotoCheckout').addEventListener('click', ()=> location.hash='checkout');
function openCart(){ document.getElementById('cartDrawer').classList.add('open'); document.getElementById('overlay').hidden=false; }
function showToast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2600); }

// Checkout render & form
function renderCheckout(){ const checkoutItems=document.getElementById('checkoutItems'); const cart=getCart(); checkoutItems.innerHTML=''; let subtotal=0; cart.forEach(i=>{ subtotal+=i.price*i.qty; const row=document.createElement('div'); row.className='checkout-item'; row.innerHTML=`<img src="${i.img}" alt="${i.name}"><div><div>${i.name}</div><div style="font-size:12px;color:#666">Rp${i.price.toLocaleString()} × ${i.qty}</div></div><div style="font-weight:700">Rp${(i.price*i.qty).toLocaleString()}</div>`; checkoutItems.appendChild(row); }); const tax=Math.round(subtotal*0.1); document.getElementById('subtotal').textContent=`Rp${subtotal.toLocaleString()}`; document.getElementById('tax').textContent=`Rp${tax.toLocaleString()}`; document.getElementById('grandTotal').textContent=`Rp${(subtotal+tax).toLocaleString()}`; }
document.getElementById('checkoutForm').addEventListener('submit',(e)=>{ e.preventDefault(); const f=e.currentTarget; if(!f.reportValidity()) return; showToast('Pesanan dibuat! Kami hubungi via nomor Anda.'); saveCart([]); f.reset(); location.hash='hero'; });

// Audio toggle
const bgm=document.getElementById('bgm'); const audioToggle=document.getElementById('audioToggle'); audioToggle.addEventListener('click', ()=>{ if(bgm.paused){ bgm.play().catch(()=>{}); audioToggle.classList.add('active'); } else { bgm.pause(); audioToggle.classList.remove('active'); } });

// init
renderCheckout(); updateCart();
