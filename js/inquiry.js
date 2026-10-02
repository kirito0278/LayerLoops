const items = $("#inquiryItems"), form = $("#inquiryForm");
const WEB3FORMS_ACCESS_KEY = "5235b5b5-a3b8-4d71-ab95-00ecfec4be88";

function renderInquiry(){
 const list=LayerLoops.getInquiry();
 items.innerHTML=list.length?list.map(p=>`<div class="inquiry-item"><img src="${p.image}" alt=""><div><strong>${escapeHtml(p.name)}</strong><button class="remove" data-id="${p.id}">Remove</button></div></div>`).join(""):`<div class="empty">Your inquiry is empty.<br><a href="products.html">Browse products ↗</a></div>`;
 $$(".remove").forEach(b=>b.onclick=()=>{const next=LayerLoops.getInquiry().filter(x=>x.id!==Number(b.dataset.id));localStorage.setItem("layerloopsInquiry",JSON.stringify(next));LayerLoops.updateInquiryCount();renderInquiry()});
}

form.addEventListener("submit", async (e)=>{
 e.preventDefault();

 const selectedProducts = LayerLoops.getInquiry();
 if(!selectedProducts.length){
   $("#formStatus").textContent="Add at least one product first.";
   return;
 }

 const status = $("#formStatus");
 const button = form.querySelector('button[type="submit"]');
 const originalText = button.textContent;
 const data = new FormData(form);

 data.append("access_key", WEB3FORMS_ACCESS_KEY);
 data.append("subject", "New Product Inquiry — LayerLoops");
 data.append("from_name", "LayerLoops Website");
 data.append("selected_products", selectedProducts.map(x=>x.name).join(", "));

 button.disabled = true;
 button.textContent = "Sending...";
 status.textContent = "Sending your inquiry...";

 try {
   const response = await fetch("https://api.web3forms.com/submit", {
     method: "POST",
     headers: { Accept: "application/json" },
     body: data
   });

   const result = await response.json();

   if(!response.ok || !result.success){
     throw new Error(result.message || "Unable to send the inquiry.");
   }

   status.textContent = "Inquiry sent successfully! We'll contact you soon.";
   form.reset();
   localStorage.removeItem("layerloopsInquiry");
   LayerLoops.updateInquiryCount();
   renderInquiry();
 } catch(error) {
   console.error("Web3Forms error:", error);
   status.textContent = "Something went wrong. Please try again.";
 } finally {
   button.disabled = false;
   button.textContent = originalText;
 }
});

function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
renderInquiry();
