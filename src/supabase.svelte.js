import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://gpprfxmjjjowyuqgvwzr.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcHJmeG1qampvd3l1cWd2d3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NDU0NTQsImV4cCI6MjA0NjQyMTQ1NH0.e_RwbQVTsd4ggnH79bcX8gWL8o61pZ_wan5ypQjB77Q"
);

export const userid = await checkSession();

async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) {
        console.error("Sign In Error:", error.message);
        alert("Error signing in: " + error.message);
    } else if (data) {
        window.location.href = "/Scheduler/"; // redirect to home page
    } else {
        console.log("User could not be signed in.");
    }
}

async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });
    if (error) {
        console.error("Sign Up Error:", error.message);
        alert("Error signing up: " + error.message);
    } else if (data) {
        window.location.href = "/Scheduler/"; // redirect to home page
    } else {
        console.log("User could not be signed up.");
    }
}

// Check if a user is signed in
async function checkSession() {
    const { data, error } = await supabase.auth.getUser();

    if (!error) return data.user.id;
    return null;
}

export async function getSchedule() {
    const { data: course } = await supabase.from("course").select("*");
    if (course)
        if (course.length > 0) {
            const mapped = course.map((c) => ({
                name: c.name,
                section: c.section,
                room: c.room,
                color: c.color,
                row: c.row.toString(16),
                col: c.col.toString(16),
            }));
            localStorage.setItem("course", JSON.stringify(mapped));
            return mapped;
        }
    return [];
}
