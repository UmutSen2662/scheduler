<script>
    import { getTags } from "../../store.svelte";

    const tags = getTags();
    let input = $state("");

    let lastLen = 0;
    $effect(() => {
        input = input.toUpperCase();
        let diff = input.length - lastLen;
        if (diff > 2) {
            lastLen = 0;
            if (tags.addTags(input)) input = "";
        }
        lastLen = input.length;
    });
</script>

<div>
    <label for="tagsInput">Write course codes then press enter</label>
    <form
        onsubmit={(e) => {
            e.preventDefault();
            if (tags.addTags(input)) input = "";
        }}
    >
        {#each tags.tags as tag}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span
                onclick={() => {
                    tags.removeTag(tag);
                }}>{tag}</span
            >
        {/each}
        <input
            type="text"
            id="tagsInput"
            list="courseCodes"
            bind:value={input}
            onkeydown={(e) => {
                if (e.key === "Backspace" && input == "") {
                    let tag = Array.from(tags.tags).slice(-1);
                    tags.removeTag(tag);
                }
            }}
        />
    </form>
</div>

<style>
    div {
        width: min(90%, 50rem);
        margin: 4rem 0 1rem 0;
    }
    div label {
        padding-left: 0.4rem;
    }

    form {
        gap: 0.6rem;
        display: flex;
        flex-wrap: wrap;
        padding: 0.4rem;
        border: var(--borderSize) solid #000;
    }

    input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 1rem;
        min-width: 6rem;
        line-height: 160%;
    }
    span {
        display: flex;
        color: #fff;
        cursor: pointer;
        padding: 0.4rem;
        background: var(--acccent);
    }
    span:hover {
        background: var(--red);
    }
</style>
