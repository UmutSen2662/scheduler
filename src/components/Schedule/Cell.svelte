<script>
    import { showModal } from "../../store";
    let { course } = $props();

    let id = course;
    if (typeof(course) != "string") {
        id = "c" + course.row.toString(16) + course.col.toString(16);
    }
</script>

<td onclick={() => $showModal = id} style="background-color: {course.color}">
    {#if typeof(course) != "string"}
        {course.name} ({course.section}) [{course.room}]
    {/if}
</td>

<style>
    td {
        text-align: center;
        padding: 0.3em;
        width: 18%;
        cursor: pointer;
    }
</style>