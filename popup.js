document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const url = new URL(activeTab.url);

    document.getElementById("status").innerText = url.protocol === "https:"
      ? "Sicher Zahlen"
      : "Vorsicht nicht Sicher";

    const accordion = document.getElementById("cookieAccordion");
    accordion.innerHTML = "";

    chrome.cookies.getAll({ url: activeTab.url }, (cookies) => {
      cookies.forEach((cookie, index) => {
        const isActive = !cookie.expirationDate || cookie.expirationDate * 1000 > Date.now();
        const backgroundColor = isActive ? "#F8F9FA" : "#F8D7D9";

        const card = document.createElement("div");
        card.className = "accordion-item";
        card.style.backgroundColor = backgroundColor;
        card.innerHTML = `
          <h2 class="accordion-header" id="heading${index}">
            <button class="accordion-button collapsed" type="button" id="button${index}" aria-expanded="false" aria-controls="collapse${index}">
              ${cookie.name}
            </button>
          </h2>
          <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#cookieAccordion">
            <div class="accordion-body">
              Name: ${cookie.name} <br>
              Value: ${cookie.value} <br>
              Domain: ${cookie.domain} <br>
              Path: ${cookie.path} <br>
              Secure: ${cookie.secure} <br>
              HttpOnly: ${cookie.httpOnly} <br>
              SameSite: ${cookie.sameSite} <br>
              StoreId: ${cookie.storeId} <br>
              Expiration Date: ${cookie.expirationDate ? new Date(cookie.expirationDate * 1000).toLocaleString() : 'Session'} <br>
              Host Only: ${cookie.hostOnly} <br>
              Active: ${isActive}
            </div>
          </div>
        `;
        accordion.appendChild(card);

        document.getElementById(`button${index}`).addEventListener("click", () => {
          const collapseElement = document.getElementById(`collapse${index}`);
          collapseElement.classList.toggle("show");
        });
      });

      const reportSslButton = document.createElement("button");
      reportSslButton.className = "btn btn-secondary mt-3 me-2";
      reportSslButton.innerText = "Report SSL";
      reportSslButton.addEventListener("click", () => {
        window.open(`https://www.ssllabs.com/ssltest/analyze.html?d=${url.hostname}`, "_blank");
      });
      document.body.insertBefore(reportSslButton, document.getElementById("closeAllButton"));

      document.getElementById("closeAllButton").addEventListener("click", () => {
        cookies.forEach((_, index) => {
          const collapseElement = document.getElementById(`collapse${index}`);
          if (collapseElement.classList.contains("show")) {
            collapseElement.classList.remove("show");
          }
        });
      });
    });
  });
});
