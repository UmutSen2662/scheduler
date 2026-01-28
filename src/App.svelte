<script>
    import DataList from "./components/DataList.svelte";
    import Header from "./components/Header/Header.svelte";
    import ExamList from "./components/Exams/ExamList.svelte";
    import Schedule from "./components/Schedule/Schedule.svelte";
    import SecretComponent from "./components/SecretComponent.svelte";

    // test
    let showSecretComponent = false;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("admin") === "true") {
        showSecretComponent = true;
    }
</script>

<main>
    <Header />
    <Schedule />
    <ExamList />
    <DataList />
    {#if showSecretComponent}<SecretComponent />{/if}
    <a href="https://github.com/UmutSen2662/scheduler" target="_blank">Github Page</a>
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
