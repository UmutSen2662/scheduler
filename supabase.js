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
        const userid = await checkSession();
        if (userid) {
            alert("Could not Sign-out");
        } else {
            alert("Sign-out successful!");
            window.location.href = "/Web-App/auth/signin.html";
        }
    }
}

// Check if a user is signed in
async function checkSession() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        console.error("Session Check Error:", error);
    } else if (data) {
        console.log("User signed in:", data.user.email);
        return data.user.id;
    } else {
        console.log("No user signed in.");
    }
    return null;
}
