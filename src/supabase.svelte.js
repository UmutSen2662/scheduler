import { createClient } from "@supabase/supabase-js";
import { schedule } from "./store.js";

async function isOnline() {
    if (!window.navigator.onLine) return false;

    // avoid CORS errors with a request to your own origin
    const url = new URL(window.location.origin + "./isOnline");

    // random value to prevent cached responses
    url.searchParams.set("rand", Math.random().toString(36).substring(2, 15));
    try {
        const response = await fetch(url.toString(), { method: "HEAD" });
        return response.ok;
    } catch {
        return false;
    }
}
export const online = await isOnline();

export const supabase = online
    ? createClient(
          "https://gpprfxmjjjowyuqgvwzr.supabase.co",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcHJmeG1qampvd3l1cWd2d3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NDU0NTQsImV4cCI6MjA0NjQyMTQ1NH0.e_RwbQVTsd4ggnH79bcX8gWL8o61pZ_wan5ypQjB77Q"
      )
    : null;

export const userid = online ? await checkSession() : null;
getSchedule().then((s) => {
    if (s) schedule.set(s);
});

// Check if a user is signed in
export async function checkSession() {
    if (!online) return null;

    const { data, error } = await supabase.auth.getUser();

    if (!error) return data.user.id;
    return null;
}

export async function signOut() {
    if (!online) return null;

    const { error } = await supabase.auth.signOut();
    if (error) alert("Error signing out: " + error.message);
    else window.location.reload();
}

export async function signIn(email, password) {
    if (!online) return null;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) alert("Error signing in: " + error.message);
    else window.location.reload();
}

export async function signUp(email, password) {
    if (!online) return null;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });
    if (error) alert("Error signing up: " + error.message);
    else window.location.reload();
}

export async function getExamList() {
    if (!online) return null;

    const { data: data } = await supabase
        .from("exams")
        .select("course_exam, start_time, classrooms");
    if (data) {
        localStorage.setItem("exams", JSON.stringify(data));
        return data;
    }
    return JSON.parse(localStorage.getItem("exams"));
}

export async function getCourseCodes() {
    if (!online) return null;

    const { data: data } = await supabase.from("course_codes").select("courses");
    if (data)
        if (data.length > 0) {
            const str = data[0].courses;
            localStorage.setItem("course_codes", str);

            if (str != "") {
                return data[0].courses;
            }
        }
    return "";
}

export async function updateCourseCodes(set) {
    if (!online) return null;

    const str = Array.from(set).join(",");
    if (userid) {
        const { error } = await supabase
            .from("course_codes")
            .upsert({ userid: userid, courses: str });
        if (error) {
            console.error(error);
        }
    }
}

async function getSchedule() {
    if (!online) return null;

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
            return mapped;
        }
    return null;
}
