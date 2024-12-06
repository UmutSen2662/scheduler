<script>
    import Modal from "./Modal.svelte";
    import Header from "./Header.svelte";
    import Schedule from "./Schedule.svelte";
    import ExamList from "./ExamList.svelte";
    import DataList from "./DataList.svelte";
</script>

<main>
    <Header/>
    <Modal/>
    <Schedule/>
    <ExamList />
    <DataList />
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 18rem;
    }
</style>