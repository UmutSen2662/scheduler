// Check if a user is signed in
async function checkSession() {
    const { data, error } = await window.supabase.auth.getUser();

    if (error) {
        console.error("Session Check Error:", error);
    } else if (data) {
        return data.user.id;
    } else {
        console.log("No user signed in.");
    }
    return null;
}

// If offline set supabase and userid to null else check session
if (navigator.onLine) {
    import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm")
        .then(async ({ createClient }) => {
            window.supabase = await createClient(
                "https://gpprfxmjjjowyuqgvwzr.supabase.co",
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcHJmeG1qampvd3l1cWd2d3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NDU0NTQsImV4cCI6MjA0NjQyMTQ1NH0.e_RwbQVTsd4ggnH79bcX8gWL8o61pZ_wan5ypQjB77Q"
            );
            window.userid = await checkSession();
        })
        .catch((error) => {
            console.error(error);
        });
} else {
    window.supabase = null;
    window.userid = null;
}
