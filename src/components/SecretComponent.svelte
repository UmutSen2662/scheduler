<script>
    import { onMount } from "svelte";
    import { updateExams } from "../supabase.svelte";
    let dialog = $state();
    let midterms = $state("");
    let finals = $state("");

    onMount(async () => {
        dialog.showModal();
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
    bind:this={dialog}
    onclick={(e) => {
        if (e.target === dialog) dialog.close();
    }}
>
    <div class="modal">
        <h2>Update Exams</h2>
        <textarea bind:value={midterms} placeholder="Paste midterm exams"></textarea>
        <textarea bind:value={finals} placeholder="Paste final exams"></textarea>
        <button
            onclick={() => {
                updateExams(midterms.trim(), finals.trim());
                midterms = "";
                finals = "";
            }}>Update</button
        >
    </div>
</dialog>

<style>
    .modal {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
    }

    h2 {
        margin: 0;
    }

    textarea {
        border: 2px solid var(--color);
        font-size: 1rem;
        padding: 0.4rem;
        resize: none;
    }

    button {
        width: 4rem;
    }
</style>
