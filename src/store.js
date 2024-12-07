import { SvelteSet } from "svelte/reactivity";
import { writable } from "svelte/store";

export const showModal = writable("");
export const signInModal = writable(false);
export const signUpModal = writable(false);
export const schedule = writable(JSON.parse(localStorage.getItem("schedule")) || []);
let str = localStorage.getItem("course_codes") || "";
export const tags = writable(new SvelteSet(str != "" ? str.split(",") : []));

schedule.subscribe((value) => {
    localStorage.setItem("schedule", JSON.stringify(value));
});

tags.subscribe((value) => {
    const str = Array.from(value).join(",");
    localStorage.setItem("course_codes", str);
});
