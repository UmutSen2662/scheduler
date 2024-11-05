const supabase = createClient(
    "https://gpprfxmjjjowyuqgvwzr.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcHJmeG1qampvd3l1cWd2d3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NDU0NTQsImV4cCI6MjA0NjQyMTQ1NH0.e_RwbQVTsd4ggnH79bcX8gWL8o61pZ_wan5ypQjB77Q"
);

// Sign Out
async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Sign Out Error:", error.message);
        alert("Error signing out: " + error.message);
    } else {
        alert("Sign-out successful!");
        checkSession(); // Optional: check if a user is signed in
    }
}

// Check if a user is signed in (Session Management)
async function checkSession() {
    const { data, error } = await supabase.auth.getSession();

    if (data) {
        console.log("User signed in:", user);
        if (window.location.pathname !== "/Web-App/") {
            window.location.href = "/Web-App";
        }
    } else if (error) {
        console.error("Session Check Error:", error.message);
    } else {
        console.log("No user signed in.");
        if (window.location.pathname == "/Web-App/") {
            window.location.href = "/Web-App/auth/signin.html";
        }
    }
}

// Check session on page load
document.addEventListener("DOMContentLoaded", checkSession);
