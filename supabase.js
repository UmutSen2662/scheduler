const supabase = createClient(
    "https://gpprfxmjjjowyuqgvwzr.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcHJmeG1qampvd3l1cWd2d3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NDU0NTQsImV4cCI6MjA0NjQyMTQ1NH0.e_RwbQVTsd4ggnH79bcX8gWL8o61pZ_wan5ypQjB77Q"
);

// Sign In/Out
async function signInOut() {
    const userid = await checkSession();
    if (userid) {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert("Error signing out: " + error.message);
        } else {
            window.location.href = "/Scheduler/"; // redirect to home page
        }
    }
    window.location.href = "/Scheduler/auth/signin.html";
}

// Check if a user is signed in
async function checkSession() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        console.error("Session Check Error:", error);
    } else if (data) {
        return data.user.id;
    } else {
        console.log("No user signed in.");
    }
    return null;
}
