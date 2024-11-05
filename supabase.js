const supabase = createClient(
    "https://qfhslzgmkljwsgclxzpi.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmaHNsemdta2xqd3NnY2x4enBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MTk3MzMsImV4cCI6MjA0NjM5NTczM30.7xCgTNh4dj7NnJoO3qRNl0LQogru5mVKCnTJ_UlYd4M"
);

// Sign Out
async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Sign Out Error:", error.message);
        alert("Error signing out: " + error.message);
    } else {
        alert("Sign-out successful!");
        checkSession(); // Optional: check if a user is logged in
    }
}

// Check if a user is logged in (Session Management)
async function checkSession() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        console.log("User logged in:", user);
        window.location.href = "/Web-App";
    } else {
        console.log("No user logged in.");
        if (window.location.pathname == "/Web-App/") {
            window.location.href = "/Web-App/auth/login.html";
        }
    }
}

// Check session on page load
document.addEventListener("DOMContentLoaded", checkSession);
