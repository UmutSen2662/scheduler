<script>
    import { getCourseCodes, updateCourseCodes } from "../../supabase.svelte";
    import { SvelteSet } from "svelte/reactivity";
    import { tags } from "../../store";

    let input = $state("");
    getCourseCodes().then((data) => {
        input = data;
        addTags();
    });

    let lastLen = 0;
    $effect(() => {
        input = input.toUpperCase();
        let diff = input.length - lastLen;
        if (diff > 2) {
            lastLen = 0;
            addTags();
        }
        lastLen = input.length;
    });

    function addTags() {
        let inputValid = false;
        Array.from(input.matchAll(/([A-Z]{3,4})\s?(\d{3,4})/g)).forEach((r) => {
            tags.update((n) => {
                n.add(r[1] + " " + r[2]);
                return n;
            });
            inputValid = true;
        });
        updateCourseCodes($tags);

        if (inputValid) input = "";
    }

    function removeTag(e) {
        if (e.key === "Backspace" && input == "") {
            let arr = Array.from($tags).slice(0, -1);
            $tags = new SvelteSet(arr);
        }
        updateCourseCodes($tags);
    }
</script>

<div>
    <label for="tagsInput">Write course codes then press enter</label>
    <form
        onsubmit={(e) => {
            e.preventDefault();
            addTags();
        }}
    >
        {#each $tags as tag}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span
                onclick={() => {
                    tags.update((n) => {
                        n.delete(tag);
                        return n;
                    });
                    updateCourseCodes($tags);
                }}>{tag}</span
            >
        {/each}
        <input
            type="text"
            id="tagsInput"
            list="courseCodes"
            bind:value={input}
            onkeydown={(e) => {
                removeTag(e);
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
