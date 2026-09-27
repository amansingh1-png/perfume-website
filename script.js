const nav=document.getElementById("nav");
const count=document.getElementById("cartCount");
const toast=document.getElementById("toast");
let cart=0;

window.addEventListener("scroll",()=>nav.classList.toggle("scrolled",scrollY>30));

document.addEventListener("mousemove",(e)=>{
  const glow=document.querySelector(".cursor-glow");
  glow.style.left=e.clientX+"px"; glow.style.top=e.clientY+"px";
});

const observer=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

function addToCart(name,price){
  cart++;
  count.textContent=cart;
  toast.textContent=`${name} added to cart • ₹${price.toLocaleString("en-IN")}`;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2200);
}
function scrollToCart(){
  if(cart===0){toast.textContent="Your cart is empty — explore the collection.";toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2200)}
  else {toast.textContent=`You have ${cart} item${cart>1?"s":""} in your cart.`;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2200)}
}
