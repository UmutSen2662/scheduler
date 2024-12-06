<script>
    import Modal from "./components/Modal.svelte";
    import DataList from "./components/DataList.svelte";
    import Header from "./components/Header/Header.svelte";
    import ExamList from "./components/Exams/ExamList.svelte";
    import Schedule from "./components/Schedule/Schedule.svelte";
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