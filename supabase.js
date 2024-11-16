// Sign In/Out
async function signInOut() {
    const userid = await checkSession();
    if (userid) {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert("Error signing out: " + error.message);
        } else {
            window.location.href = "/Scheduler/"; // redirect to home page
            return;
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
