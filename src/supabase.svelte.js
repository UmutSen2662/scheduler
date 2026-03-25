import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = "https://gpprfxmjjjowyuqgvwzr.supabase.co";
const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcHJmeG1qampvd3l1cWd2d3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NDU0NTQsImV4cCI6MjA0NjQyMTQ1NH0.e_RwbQVTsd4ggnH79bcX8gWL8o61pZ_wan5ypQjB77Q";
const ONLINE_CHECK_TIMEOUT = 1500;

let onlineState = $state(typeof navigator === "undefined" ? true : navigator.onLine);
let useridState = $state(null);

export function online() {
    return onlineState;
}

export function userid() {
    return useridState;
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let sessionInitialized = false;

if (typeof window !== "undefined") {
    window.addEventListener("online", async () => {
        onlineState = true;
        useridState = await checkSession(ONLINE_CHECK_TIMEOUT);
    });

    window.addEventListener("offline", () => {
        onlineState = false;
        useridState = null;
    });

    supabase.auth.onAuthStateChange((_event, session) => {
        useridState = session?.user?.id ?? null;
    });

    initializeSession();
}

// Check if a user is signed in
async function checkSession(timeoutMs = 0) {
    if (!onlineState) return null;

    try {
        const getUserRequest = supabase.auth.getUser();
        const { data, error } = timeoutMs
            ? await withTimeout(getUserRequest, timeoutMs)
            : await getUserRequest;

        if (!error && data?.user) return data.user.id;
    } catch {
        return null;
    }
    return null;
}

async function ensureUserId() {
    if (!onlineState) return null;
    if (useridState) return useridState;

    useridState = await checkSession(ONLINE_CHECK_TIMEOUT);
    return useridState;
}

export async function getUserId() {
    return await ensureUserId();
}

async function initializeSession() {
    if (sessionInitialized) return;
    sessionInitialized = true;

    onlineState = typeof navigator === "undefined" ? true : navigator.onLine;
    if (!onlineState) {
        useridState = null;
        return;
    }

    useridState = await checkSession(ONLINE_CHECK_TIMEOUT);
}

async function withTimeout(promise, timeoutMs) {
    let timeoutId;

    try {
        return await Promise.race([
            promise,
            new Promise((_, reject) => {
                timeoutId = setTimeout(() => {
                    reject(new Error("timeout"));
                }, timeoutMs);
            }),
        ]);
    } finally {
        clearTimeout(timeoutId);
    }
}

export async function signOut() {
    if (!onlineState) return null;

    const { error } = await supabase.auth.signOut();
    if (error) alert("Error signing out: " + error.message);
    else window.location.reload();
}

export async function signIn(email, password) {
    if (!onlineState) return null;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });
    if (error) alert("Error signing in: " + error.message);
    else window.location.reload();
}

export async function signUp(email, password) {
    if (!onlineState) return null;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });
    if (error) alert("Error signing up: " + error.message);
    else window.location.reload();
}

export async function getExamList() {
    if (onlineState) {
        const { data: data } = await supabase
            .from("exams")
            .select("course_exam, start_time, classrooms")
            .order("start_time", { ascending: true });
        if (data) {
            localStorage.setItem("exams", JSON.stringify(data));
            return data;
        }
    }
    return JSON.parse(localStorage.getItem("exams"));
}

export async function getCourseCodes() {
    if (!onlineState) return null;

    const uid = await ensureUserId();
    if (!uid) return null;

    const { data: data } = await supabase.from("course_codes").select("courses").eq("userid", uid).limit(1);
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
    if (!onlineState) return null;

    const str = Array.from(set).join(",");
    const uid = await ensureUserId();
    if (uid) {
        const { error } = await supabase.from("course_codes").upsert({ userid: uid, courses: str });
        if (error) {
            console.error(error);
        }
    }
}

export async function getOptions() {
    if (!onlineState) return null;

    const uid = await ensureUserId();
    if (!uid) return null;

    const { data: data } = await supabase.from("options").select("*").eq("userid", uid).limit(1);
    if (data && data.length > 0) {
        return data[0];
    }
    return null;
}

export async function updateOptions(options) {
    if (!onlineState) return null;

    const uid = await ensureUserId();
    if (uid) {
        const { error } = await supabase
            .from("options")
            .upsert({ userid: uid, time: options.time, rows: options.rows });
        if (error) {
            console.error(error);
        }
    }
}

export async function getSchedule() {
    if (!onlineState) return null;

    const uid = await ensureUserId();
    if (!uid) return null;

    const { data: course } = await supabase.from("course").select("*").eq("userid", uid);
    if (course) {
        const mapped = course.map((c) => ({
            name: c.name,
            section: c.section,
            room: c.room,
            color: String(c.color),
            row: c.row,
            col: c.col,
        }));
        return mapped;
    }
    return null;
}

export async function getLastUpdate() {
    if (onlineState) {
        const { data } = await supabase.from("exams_update_date").select("last_updated").eq("id", 1).single();
        const lastUpdated = new Date(data.last_updated);
        return lastUpdated.getTime();
    }
    return 1741703246690;
}

export async function updateExams(midterms, finals) {
    if (onlineState) {
        if (midterms.length > 0) {
            const deleteResponse = await supabase.from("exams").delete().eq("is_final", false);
            if (deleteResponse.error) {
                console.error("Error deleting old exams:", deleteResponse.error.message);
                return;
            }

            const examlist = parseExamData(midterms, false);
            const insertResponse = await supabase.from("exams").insert(examlist);
            if (insertResponse.error) {
                console.error("Failed to insert exams:", insertResponse.error.message);
                return;
            }

            const { error } = await supabase.from("exams_update_date").upsert({ id: 1, last_updated: new Date() });
            if (error) console.log(error);
        }

        if (finals.length > 0) {
            const deleteResponse = await supabase.from("exams").delete().eq("is_final", true);
            if (deleteResponse.error) {
                console.error("Error deleting old exams:", deleteResponse.error.message);
                return;
            }

            const examlist = parseExamData(finals, true);
            const insertResponse = await supabase.from("exams").insert(examlist);
            if (insertResponse.error) {
                console.error("Failed to insert exams:", insertResponse.error.message);
                return;
            }

            const { error } = await supabase.from("exams_update_date").upsert({ id: 1, last_updated: new Date() });
            if (error) console.log(error);
        }
    }
}

function parseExamData(data, isFinal) {
    const formatting = data.slice(0, 20).includes("Date");
    const rows = data.split("\n").slice(1);
    const parsed = [];

    if (formatting) {
        for (const row of rows) {
            const columns = row.split("\t");
            parsed.push({
                course_exam: columns[0],
                start_time: columns[1].split(" ")[0] + "T" + columns[2].slice(0, 5) + ":00",
                classrooms: columns[3],
                is_final: isFinal,
            });
        }
    } else {
        for (const row of rows) {
            const columns = row.split("\t");
            let time = columns[1].split(" ");
            parsed.push({
                course_exam: columns[0],
                start_time: time[0] + "T" + time[2] + ":00",
                classrooms: columns[3],
                is_final: isFinal,
            });
        }
    }
    console.log(parsed);

    return parsed;
}
