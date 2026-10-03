const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

window.addEventListener("load", () => {
  setTimeout(() => $("#loader")?.classList.add("is-hidden"), 450);
  updateInquiryCount();
  setupMenu();
  setupReveal();
  setupMagnetic();
});

function setupMenu(){
  const btn = $("#menuBtn"), nav = $(".nav");
  btn?.addEventListener("click", () => nav?.classList.toggle("is-open"));
}
function setupReveal(){
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){e.target.classList.add("is-visible");io.unobserve(e.target)} });
  }, {threshold:.12});
  items.forEach(x=>io.observe(x));
}
function setupMagnetic(){
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  $$(".magnetic").forEach(el=>{
    el.addEventListener("pointermove", e=>{
      const r=el.getBoundingClientRect(), x=(e.clientX-r.left-r.width/2)*.08, y=(e.clientY-r.top-r.height/2)*.08;
      el.style.transform=`translate(${x}px,${y}px)`;
    });
    el.addEventListener("pointerleave",()=>el.style.transform="");
  });
}
function getInquiry(){ try{return JSON.parse(localStorage.getItem("layerloopsInquiry")||"[]")}catch{return[]}}
function updateInquiryCount(){
  const count=getInquiry().length;
  $$("#inquiryCount").forEach(el=>el.textContent=count);
  $$("#floatingInquiryCount").forEach(el=>el.textContent=count);
  $$("#heroInquiryCount").forEach(el=>el.textContent=count);
  $$("#floatingInquiry").forEach(el=>el.classList.toggle("is-visible",count>0));
}
window.LayerLoops={getInquiry,updateInquiryCount};
