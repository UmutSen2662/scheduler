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

async function isOnline() {
    if (!window.navigator.onLine) return false;

    // avoid CORS errors with a request to your own origin
    const url = new URL(window.location.origin + "/Scheduler/isOnline");

    // random value to prevent cached responses
    url.searchParams.set("rand", Math.random().toString(36).substring(2, 15));

    try {
        const response = await fetch(url.toString(), { method: "HEAD" });
        return response.ok;
    } catch {
        return false;
    }
}

// If offline set supabase and userid to null else check session
if (await isOnline()) {
    await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm")
        .then(async ({ createClient }) => {
            window.supabase = await createClient(
                "https://gpprfxmjjjowyuqgvwzr.supabase.co",
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcHJmeG1qampvd3l1cWd2d3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NDU0NTQsImV4cCI6MjA0NjQyMTQ1NH0.e_RwbQVTsd4ggnH79bcX8gWL8o61pZ_wan5ypQjB77Q"
            );
            if (window.location.pathname == "/Scheduler/") window.userid = await checkSession();
            console.log(window.userid + " ");
        })
        .catch((error) => {
            console.error(error);
        });
} else {
    window.supabase = null;
    window.userid = null;
}

console.log(window.userid + " ");
window.dispatchEvent(new CustomEvent("supabase-set"));
