const grid=$("#productGrid"), search=$("#search"), filters=$("#filters");
let active="All";
const cats=["All",...new Set(LAYERLOOPS_PRODUCTS.map(p=>p.category))];
filters.innerHTML=cats.map(c=>`<button class="filter ${c==="All"?"active":""}" data-cat="${c}">${c}</button>`).join("");
filters.addEventListener("click",e=>{const b=e.target.closest(".filter");if(!b)return;active=b.dataset.cat;$$(".filter").forEach(x=>x.classList.toggle("active",x===b));render()});
search.addEventListener("input",render);
function render(){
 const q=search.value.toLowerCase().trim();
 const list=LAYERLOOPS_PRODUCTS.filter(p=>(active==="All"||p.category===active)&&(!q||`${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q)));
 grid.innerHTML=list.map(card).join("")||`<div class="empty">Nothing found. Try another search.</div>`;
 $$(".add-btn").forEach(b=>b.addEventListener("click",()=>addInquiry(Number(b.dataset.id),b)));
}
function card(p){const added=LayerLoops.getInquiry().some(x=>x.id===p.id);return `<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${escapeAttr(p.name)}" loading="lazy"></div><div class="product-info"><span class="tag">${p.category}</span><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description||"A playful LayerLoops piece made to be enjoyed.")}</p><button class="btn btn--dark add-btn${added?" is-added":""}" data-id="${p.id}" ${added?"disabled":""}>${added?"Added":"Add to Inquiry"}</button></div></article>`}
function addInquiry(id,button){const p=LAYERLOOPS_PRODUCTS.find(x=>x.id===id);if(!p)return;let list=LayerLoops.getInquiry();if(!list.some(x=>x.id===id)){list.push({id:p.id,name:p.name,image:p.image});localStorage.setItem("layerloopsInquiry",JSON.stringify(list));LayerLoops.updateInquiryCount();}button.textContent="Added";button.classList.add("is-added");button.disabled=true;}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function escapeAttr(s){return escapeHtml(s)}
render();
