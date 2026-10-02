const WEB3FORMS_ACCESS_KEY = "5235b5b5-a3b8-4d71-ab95-00ecfec4be88";

const customForm = $("#customForm");

customForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const status = $("#formStatus");
  const button = customForm.querySelector('button[type="submit"]');
  const originalText = button.textContent;

  button.disabled = true;
  button.textContent = "Sending...";
  status.textContent = "Sending your request...";

  const formData = new FormData(customForm);
  formData.append("access_key", WEB3FORMS_ACCESS_KEY);
  formData.append("subject", "New Custom Printing Request — LayerLoops");
  formData.append("from_name", "LayerLoops Website");

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        Accept: "application/json"
      },
      body: formData
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to send the request.");
    }

    status.textContent = "Request sent successfully! We'll contact you soon.";
    customForm.reset();
  } catch (error) {
    console.error("Web3Forms error:", error);
    status.textContent = "Something went wrong. Please try again.";
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});
