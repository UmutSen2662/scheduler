<script>
    import { signInModal, signUpModal } from "../../store";
    import { signIn } from "../../supabase.svelte";

    let dialog = $state();
    let email = $state("");
    let password = $state("");

    $effect(() => {
        if (!$signInModal) {
            dialog.close();
            return;
        }
        dialog.showModal();
        email = "";
        password = "";
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
    onclose={() => $signInModal = false}
	onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
    <div class="modal">
        <form onsubmit={(e) => {e.preventDefault(); signIn(email, password)}}>
            <h2>Sign In</h2>
            <input type="email" bind:value={email} placeholder="Email">
            <input type="password" bind:value={password} placeholder="Password">
            <button type="submit">Sign In</button>
            <p>New to the app? <span role="button" tabindex="0" onclick={() => {dialog.close(); $signUpModal = true}}>Sign up</span></p>
        </form>
    </div>
</dialog>

<style>
    h2 {
        margin: 0;
    }

    .modal {
        padding: 1rem;
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
    }

    form input {
        padding: 0.4rem;
        width: 100%;
    }

    p {
        margin: 0;
    }

    span {
        padding: 0;
        color: var(--main);
        border: none;
        background: none;
        cursor: pointer;
    }
    span:hover {
        text-decoration: underline;
    }
    span:focus {
        text-decoration: underline;
        outline: none;
    }
</style>