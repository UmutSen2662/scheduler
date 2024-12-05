<script>
    import Modal from "./Modal.svelte";
    import Schedule from "./Schedule.svelte";
    import { getSchedule } from "./supabase.svelte";
</script>

<main>
    <Modal/>
    <Schedule/>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>