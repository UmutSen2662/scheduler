<script>
    import { modals } from "../../store.svelte";
    let { course } = $props();

    let id = course;
    if (typeof course != "string") {
        id = "c" + course.row.toString(16) + course.col.toString(16);
    }
</script>

<td
    draggable="true"
    onclick={() => (modals.cellModalId = id)}
    style="color: var(--o{course.color || 't'});
        outline: var(--cellOutline) solid var(--o{course.color || 't'});
        background-color: var(--{course.color || 't'})"
>
    {#if typeof course != "string"}
        {course.name} ({course.section}) [{course.room}]
    {/if}
</td>

<style>
    td {
        position: relative;
        text-align: center;
        background-color: transparent;
        padding: 0.3em;
        width: 18%;
        cursor: pointer;
        text-shadow: var(--cellFont);
        outline-offset: calc(var(--cellOutline) * -1.5);
    }
    td::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 9;
    }
    td:hover::after {
        box-shadow: var(--cellShadow);
    }
</style>
