import { getSchedule, getCourseCodes, updateCourseCodes } from "./supabase.svelte";
import { SvelteSet } from "svelte/reactivity";

class Schedule {
    schedule = $state(
        JSON.parse(localStorage.getItem("schedule")) != ""
            ? JSON.parse(localStorage.getItem("schedule")) || []
            : []
    );

    constructor() {
        getSchedule().then((s) => {
            if (s) schedule.schedule = s;
        });
    }
}
export const schedule = new Schedule();

class Modals {
    cellModalId = $state("");
    signInModal = $state(false);
    signUpModal = $state(false);
}
export const modals = new Modals();

class Tags {
    tags = $state(
        new SvelteSet(
            localStorage.getItem("tags") != "" ? localStorage.getItem("tags").split(",") : []
        )
    );

    constructor() {
        $effect(() => {
            localStorage.setItem("tags", Array.from(this.tags).join(","));
        });
    }

    addTags(input) {
        let inputValid = false;
        Array.from(input.matchAll(/([A-Z]{3,4})\s?(\d{3,4})/g)).forEach((r) => {
            this.tags.add(r[1] + " " + r[2]);
            inputValid = true;
        });

        updateCourseCodes(this.tags);
        return inputValid;
    }

    removeTag(tag) {
        this.tags.delete(tag);
        console.log("removed tag " + this.tags);

        updateCourseCodes(this.tags);
    }
}
let tags;
export function getTags() {
    if (!tags) {
        tags = new Tags();

        getCourseCodes().then((data) => {
            tags.addTags(data);
        });

        return tags;
    }
    return tags;
}
