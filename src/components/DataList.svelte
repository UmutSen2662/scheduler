<script>
    import { SvelteSet } from "svelte/reactivity";
    import { schedule } from "../store";

    let course_codes = $state(new SvelteSet());
    let sections = $state(new SvelteSet());
    let classrooms = $state(new SvelteSet());

    schedule.subscribe((value) => {
        course_codes.clear();
        sections.clear();
        classrooms.clear();
        value.forEach((v) => {
            course_codes.add(v.name);
            sections.add(v.section);
            classrooms.add(v.room);
        })
    });
</script>

<!-- These are used as autocomplete for course codes, sections, and classrooms -->
<datalist id="courseCodes">
    {#each course_codes as course_code}
        <option value="{course_code}"></option>
    {/each}
</datalist>
<datalist id="sections">
    {#each sections as section}
        <option value="{section}"></option>
    {/each}
</datalist>
<datalist id="classrooms">
    {#each classrooms as classroom}
        <option value="{classroom}"></option>
    {/each}
</datalist>