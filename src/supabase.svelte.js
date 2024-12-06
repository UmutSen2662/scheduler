import { createClient } from "@supabase/supabase-js";
import { schedule } from "./store.js";

export const supabase = createClient(
    "https://gpprfxmjjjowyuqgvwzr.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcHJmeG1qampvd3l1cWd2d3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NDU0NTQsImV4cCI6MjA0NjQyMTQ1NH0.e_RwbQVTsd4ggnH79bcX8gWL8o61pZ_wan5ypQjB77Q"
);

export const userid = await checkSession();
getSchedule().then((s) => {
    if (s) schedule.set(s);
});

// Check if a user is signed in
export async function checkSession() {
    const { data, error } = await supabase.auth.getUser();

    if (!error) return data.user.id;
    return null;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) alert("Error signing out: " + error.message);
    else window.location.reload();
}

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) alert("Error signing in: " + error.message);
    else window.location.reload();
}

export async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });
    if (error) alert("Error signing up: " + error.message);
    else window.location.reload();
}

export async function getExamList() {
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
