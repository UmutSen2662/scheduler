<script>
    import Modal from "./Modal.svelte";
    import Header from "./Header.svelte";
    import Schedule from "./Schedule.svelte";
</script>

<main>
    <Header/>
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