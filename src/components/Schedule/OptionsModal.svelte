<script>
    import { getOptions, updateOptions } from "../../supabase.svelte";

    let {
        showOptionsModal = $bindable(false),
        startTime = $bindable("08:40"),
        rowNum = $bindable(12),
    } = $props();

    getOptions().then((options) => {
        if (!options) return;
        startTime = options.time;
        rowNum = options.rows;
    });

    let dialog = $state();

    $effect(() => {
        if (!showOptionsModal) {
            dialog.close();
            return;
        }
        dialog.showModal();
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
    bind:this={dialog}
    onclose={() => {
        showOptionsModal = false;
        updateOptions({ time: startTime, rows: rowNum });
    }}
    onclick={(e) => {
        if (e.target === dialog) dialog.close();
    }}
>
    <div class="modal">
        <h2>Options</h2>
        <form
            class="rows"
            onsubmit={(e) => {
                e.preventDefault();
                dialog.close();
            }}
        >
            <label for="startTime">
                <span>Start Time</span>
                <input type="time" name="startTime" id="startTime" bind:value={startTime} />
            </label>
            <label for="rowNum">
                <span>Number of Rows</span>
                <input
                    style="width: 5rem"
                    type="number"
                    name="rowNum"
                    id="rowNum"
                    min="2"
                    max="16"
                    bind:value={rowNum}
                />
            </label>
        </form>
        <input
            class="reset"
            type="button"
            value="Restore defaults"
            onclick={() => {
                startTime = "08:40";
                rowNum = 12;
                dialog.close();
            }}
        />
    </div>
</dialog>

<style>
    h2 {
        margin-top: 0;
    }

    .modal {
        padding: 1rem;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .rows {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        width: 100%;
    }

    .rows label {
        display: flex;
        justify-content: space-between;
    }

    .reset {
        margin-top: 1rem;
        background: transparent;
        cursor: pointer;
        padding: 0.2rem;
        padding-bottom: 0;
        color: var(--red);
        border: none;
    }
    .reset:hover {
        text-decoration: underline;
    }
</style>
