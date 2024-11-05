const supabase = createClient(
    "https://qfhslzgmkljwsgclxzpi.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmaHNsemdta2xqd3NnY2x4enBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4MTk3MzMsImV4cCI6MjA0NjM5NTczM30.7xCgTNh4dj7NnJoO3qRNl0LQogru5mVKCnTJ_UlYd4M"
);

// Sign Up (Not usabale)
async function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { user, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.error("Sign Up Error:", error.message);
        alert("Error signing up: " + error.message);
    } else {
        alert("Sign-up successful!");
        checkSession(); // Optional: check if a user is logged in
    }
}

// Sign In
async function signIn() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { user, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Sign In Error:", error.message);
        alert("Error signing in: " + error.message);
    } else {
        alert("Sign-in successful!");
        checkSession(); // Optional: check if a user is logged in
    }
}

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
        window.location.href = "/";
    } else {
        console.log("No user logged in.");
        if (window.location.pathname == "/") {
            window.location.href = "/auth/login.html";
        }
    }
}

// Check session on page load
document.addEventListener("DOMContentLoaded", checkSession);

// This is ail for user login logis is after this


