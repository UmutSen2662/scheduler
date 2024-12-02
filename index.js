// Track whether each condition is met
let isMainLogicFinished = false;
let isSupabaseSet = window.userid !== undefined;
document.addEventListener("DOMContentLoaded", async () => {
    await preSupabaseLogic();
    isMainLogicFinished = true;
    tryRunMainLogic();
});
window.addEventListener("supabase-set", () => {
    isSupabaseSet = true;
    tryRunMainLogic();
});

async function preSupabaseLogic() {
    if (!localStorage.getItem("course")) localStorage.setItem("course", "[]");
    if (!localStorage.getItem("course_codes")) localStorage.setItem("course_codes", "");

    fillSchedule();

    const tagsInput = document.getElementById("tagsInput");
    const tagsContainer = document.getElementById("tagsContainer");
    tagsInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") evalCourseCodes(tagsInput, tagsContainer);
    });
    tagsInput.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && tagsInput.value == "")
            Array.from(tagsContainer.querySelectorAll(".tag")).slice(-1)[0].click();
    });
    tagsInput.value = localStorage.getItem("course_codes");
    evalCourseCodes(tagsInput, tagsContainer);
}

// This function makes sure the main logic is run after the DOM is loaded and supabase is set
async function tryRunMainLogic() {
    if (isMainLogicFinished && isSupabaseSet) {
        if (window.userid) {
            const signInOut = document.getElementById("signInOut");
            signInOut.style.backgroundColor = "#888";
            signInOut.innerHTML = "Sign Out";
        }

        await syncScheduleData();
        fillSchedule();

        const modal = document.getElementById("modal");
        modal.addEventListener("click", (event) => {
            if (event.target == modal) modal.close();
        });

        const tagsInput = document.getElementById("tagsInput");
        const tagsContainer = document.getElementById("tagsContainer");
        tagsInput.value = localStorage.getItem("course_codes");
        evalCourseCodes(tagsInput, tagsContainer);

        // This is called here even though it's not supabase dependent because it is low priority
        updateDataLists();
    }
}

async function evalCourseCodes(input, container, remove = false) {
    const set = new Set();

    let inputValid = false;
    container.querySelectorAll(".tag").forEach((tag) => {
        set.add(tag.innerHTML);
        tag.remove();
    });
    if (!remove) {
        Array.from(input.value.toUpperCase().matchAll(/([A-Z]{3,4})\s?(\d{3,4})/g)).forEach((r) => {
            set.add(r[1] + " " + r[2]);
            inputValid = true;
        });

        if (inputValid) {
            input.value = "";
        }
    }

    // Create tags from the set
    for (const course of Array.from(set).reverse()) {
        const tag = document.createElement("span");
        tag.classList.add("tag");
        tag.innerHTML = course;
        tag.addEventListener("click", () => {
            tag.remove();
            evalCourseCodes(input, container, true);
        });
        container.prepend(tag);
    }

    // Depending on if the user is signed in or not, store the course codes in either the local storage or the database
    const str = Array.from(set).join(",");
    localStorage.setItem("course_codes", str);
    if (window.userid) {
        const { error } = await window.supabase
            .from("course_codes")
            .upsert({ userid: window.userid, courses: str });
        if (error) {
            console.error(error);
        }
    }

    const exams = document.getElementById("exams");
    // this is not user dependent no need to check userid
    let { data: data } = window.supabase
        ? await window.supabase.from("exams").select("*")
        : { data: JSON.parse(localStorage.getItem("exams")) };
    if (data) localStorage.setItem("exams", JSON.stringify(data));

    let prevDate = Date.now();
    exams.querySelectorAll("tr:not(:first-child)").forEach((tr) => tr.remove());
    data.forEach((exam) => {
        if (!set.has(exam.course_exam.match(/[A-Z]{3,4}\s?\d{3,4}/g)[0])) return; // skip if the course code is not in the set

        const dateObj = new Date(exam.start_time);
        // Get the components of the date
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed, so add 1
        const day = String(dateObj.getDate()).padStart(2, "0");
        const weekday = dateObj.toLocaleString("en-US", { weekday: "short" });
        const hour = String(dateObj.getHours()).padStart(2, "0");
        const minute = String(dateObj.getMinutes()).padStart(2, "0");
        // Format the string
        const formattedDate = `${year}-${month}-${day} ${weekday} ${hour}:${minute}`;
        const now = Date.now() - new Date().getTimezoneOffset() * 60000;
        const today = now - (now % 86400000);
        const date = dateObj.getTime() - (dateObj.getTime() % 86400000);

        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${exam.course_exam}</td><td>${Math.max(
            Math.floor(date / 86400000) - Math.floor(today / 86400000),
            0
        )}</td><td>${Math.max(
            Math.floor(date / 86400000) - Math.floor(prevDate / 86400000),
            0
        )}</td><td>${formattedDate}</td><td>${exam.classrooms}</td>`;
        exams.appendChild(tr);
        prevDate = date;
    });
}

async function syncScheduleData() {
    if (window.userid) {
        const { data: course } = await window.supabase.from("course").select("*");
        if (course)
            if (course.length > 0) {
                const mapped = course.map((c) => ({
                    name: c.name,
                    section: c.section,
                    room: c.room,
                    color: c.color,
                    row: c.row,
                    col: c.col,
                }));
                localStorage.setItem("course", JSON.stringify(mapped));
            }

        const { data: data } = await window.supabase.from("course_codes").select("courses");
        if (data) if (data.length > 0) localStorage.setItem("course_codes", data[0].courses);
    }
}

async function fillSchedule() {
    const data = JSON.parse(localStorage.getItem("course"));
    data.forEach((course) => {
        const td = document.getElementById(`${course.col}${course.row.toString(16)}`);
        td.innerHTML = `${course.name} (${course.section}) [${course.room}]`;
        td.style.backgroundColor = course.color;
    });

    const schedule = document.getElementById("schedule");
    schedule.querySelectorAll("td").forEach((td) => {
        if (td.id[0] == "0" || td.id[1] == "0") return;
        td.style.cursor = "pointer";
        td.addEventListener("click", () => {
            clicked.call(td);
        });
    });
}

function clicked() {
    let name = this.innerHTML.match(/.+ \(/);
    let section = this.innerHTML.match(/\(.+\)/);
    let room = this.innerHTML.match(/\[.+\]/);

    name = name == null ? "" : name[0].slice(0, -2);
    section = section == null ? "" : section[0].slice(1, -1);
    room = room == null ? "" : room[0].slice(1, -1);

    openModal(name, section, room, this.style.backgroundColor, this.id);
}

const Modal = (function () {
    const data = {};

    return {
        set(key, value) {
            data[key] = value;
        },
        get(key) {
            return data[key];
        },
    };
})();

function modalButtons(color) {
    const colors = document.getElementById("modalColor");
    Array.from(colors.children)
        .filter((node) => node.tagName == "BUTTON")
        .forEach((btn) => {
            if (btn.style.backgroundColor == color) btn.classList.add("active");
            else btn.classList.remove("active");
        });
}

function openModal(name, section, room, color, id) {
    const modal = document.getElementById("modal");
    const inside = document.getElementById("modalInside");

    modalButtons(color);
    Modal.set("id", id);
    Modal.set("color", color);
    inside.innerHTML = `
    <input type="text" id="modalName" placeholder="Name" list="courseCodes" value="${name}">
    <input type="text" id="modalSection" placeholder="Section" list="sections" value="${section}">
    <input type="text" id="modalRoom" placeholder="Room" list="classrooms" value="${room}">
`;
    modal.showModal();
}

async function modalSave() {
    const nameInput = document.getElementById("modalName");
    const sectionInput = document.getElementById("modalSection");
    const roomInput = document.getElementById("modalRoom");

    const id = Modal.get("id");
    const name = nameInput.value.toUpperCase();
    const section = sectionInput.value.toUpperCase();
    const room = roomInput.value.toUpperCase();

    const td = document.getElementById(id);
    td.innerHTML = `${name} (${section}) [${room}]`;
    td.style.backgroundColor = Modal.get("color");

    if (window.userid) {
        const { error } = await window.supabase.from("course").upsert({
            userid: window.userid,
            name: name,
            section: section,
            room: room,
            color: td.style.backgroundColor,
            col: parseInt(id[0], 16),
            row: parseInt(id[1], 16),
        });
        if (error) console.log(error);
    }
    let found = false;
    const course = JSON.parse(localStorage.getItem("course"));
    course.forEach((c) => {
        if (c.col == parseInt(id[0], 16) && c.row == parseInt(id[1], 16)) {
            c.name = name;
            c.section = section;
            c.room = room;
            c.color = td.style.backgroundColor;
            found = true;
        }
        if (!found) {
            course.push({
                name: name,
                section: section,
                room: room,
                color: td.style.backgroundColor,
                col: parseInt(id[0], 16),
                row: parseInt(id[1], 16),
            });
        }
    });
    localStorage.setItem("course", JSON.stringify(course));
    updateDataLists();
}

async function modalDelete() {
    const id = Modal.get("id");
    const td = document.getElementById(id);
    td.style.backgroundColor = "";
    td.innerHTML = "";

    if (window.userid) {
        const { error } = await window.supabase
            .from("course")
            .delete()
            .eq("userid", window.userid)
            .eq("col", parseInt(id[0], 16))
            .eq("row", parseInt(id[1], 16));
        if (error) console.log(error);
    }
    const course = JSON.parse(localStorage.getItem("course"));
    const filtered = course.filter(
        (c) => c.col != parseInt(id[0], 16) || c.row != parseInt(id[1], 16)
    );
    localStorage.setItem("course", JSON.stringify(filtered));
    updateDataLists();
}

async function signInOut() {
    if (window.userid) {
        const { error } = await window.supabase.auth.signOut();
        if (error) {
            alert("Error signing out: " + error.message);
        } else {
            window.location.href = "/Scheduler/"; // redirect to home page
            return;
        }
    }
    window.location.href = "/Scheduler/auth/signin.html";
}

async function updateDataLists() {
    const courseCodes = document.getElementById("courseCodes");
    const sections = document.getElementById("sections");
    const classrooms = document.getElementById("classrooms");

    courseCodes.innerHTML = "";
    sections.innerHTML = "";
    classrooms.innerHTML = "";

    const course = JSON.parse(localStorage.getItem("course"));
    const courseSet = new Set();
    const sectionSet = new Set();
    const classroomSet = new Set();

    course.forEach((c) => {
        courseSet.add(c.name);
        sectionSet.add(c.section);
        classroomSet.add(c.room);
    });

    courseSet.forEach((c) => {
        courseCodes.innerHTML += `<option value="${c}"></option>`;
    });

    sectionSet.forEach((s) => {
        sections.innerHTML += `<option value="${s}"></option>`;
    });

    classroomSet.forEach((c) => {
        classrooms.innerHTML += `<option value="${c}"></option>`;
    });
}
