import { writable } from "svelte/store";

export const showModal = writable("");
export const schedule = writable(JSON.parse(localStorage.getItem("schedule")) || []);

schedule.subscribe((value) => {
    localStorage.setItem("schedule", JSON.stringify(value));
});
