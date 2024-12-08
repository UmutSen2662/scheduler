<script>
    import { showCellModal } from "../../store";
    let { course } = $props();

    let id = course;
    if (typeof course != "string") {
        id = "c" + course.row.toString(16) + course.col.toString(16);
    }
</script>

<td draggable="true" onclick={() => ($showCellModal = id)} style="background-color: {course.color || 'transparent'}">
    {#if typeof course != "string"}
        {course.name} ({course.section}) [{course.room}]
    {/if}
</td>

<style>
    td {
        position: relative;
        text-align: center;
        padding: 0.3em;
        width: 18%;
        cursor: pointer;
    }
    td::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 9;
    }
    td:hover::after {
        box-shadow: 0 0 0.6rem 0.1rem black;
    }
</style>
