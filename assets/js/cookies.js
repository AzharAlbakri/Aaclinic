$(document).ready(function () {
  // Function to set a cookie
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
      name + "=" + encodeURIComponent(value) + expires + "; path=/";
  }

  // Function to get a cookie by name
  function getCookie(name) {
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split(";");

    for (let i = 0; i < cookiesArray.length; i++) {
      let cookie = cookiesArray[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  }

  // Function to delete a cookie
  function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  // Function to initialize required cookies (only if the user accepted cookies)
  function initializeCookies() {
    if (!getCookie("cookiesAccepted")) {
      return; // Don't set cookies if the user hasn't accepted yet
    }

    // 1. Authentication Cookie (stores token or session)
    setCookie("authToken", "user123456token", 7); // Expires in 7 days

    // 2. User Preferences (e.g., language, dark mode)
    setCookie(
      "userPreferences",
      JSON.stringify({ language: "en", theme: "dark" }),
      30
    );

    // 3. Analytics Cookie (tracks visits)
    const visitCount = getCookie("visitCount")
      ? parseInt(getCookie("visitCount")) + 1
      : 1;
    setCookie("visitCount", visitCount, 365); // Tracks number of visits for 1 year

    // 4. Booking Info (stores last appointment date)
    setCookie("lastBooking", new Date().toISOString(), 30);
  }

  // Function to handle cookie consent banner and interaction
  function handleCookieConsent() {
    const cookieBanner = document.getElementById("cookieConsentBanner");
    const acceptBtn = document.getElementById("acceptCookies");

    // Check if cookies are already accepted
    if (!localStorage.getItem("cookiesAccepted")) {
      cookieBanner.style.display = "block"; // Show banner
    } else {
      initializeCookies(); // If already accepted, initialize cookies
    }

    // When user clicks "Accept"
    acceptBtn.addEventListener("click", function () {
      localStorage.setItem("cookiesAccepted", "true");
      setCookie("cookiesAccepted", "true", 365); // Store in cookies too
      cookieBanner.style.display = "none"; // Hide banner
      initializeCookies(); // Initialize cookies after acceptance
    });
  }

  // Load cookie banner and handle consent logic
  $(".cookiesShared").load("/cookies-banner.html", function () {
    handleCookieConsent(); // Run the consent handling after banner loads
  });
});