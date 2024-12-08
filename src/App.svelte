<script>
    import DataList from "./components/DataList.svelte";
    import Header from "./components/Header/Header.svelte";
    import ExamList from "./components/Exams/ExamList.svelte";
    import Schedule from "./components/Schedule/Schedule.svelte";
</script>

<main>
    <Header />
    <Schedule />
    <ExamList />
    <DataList />
    <a href="https://github.com/UmutSen2662/Scheduler" target="_blank">Github Page</a>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    a {
        margin: 1.2rem;
        text-align: end;
        margin-left: auto;
    }
</style>
