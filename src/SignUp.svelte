<script>
    import { signInModal, signUpModal } from "./store";
    import { signUp } from "./supabase.svelte";

    let dialog = $state();
    let email = $state("");
    let password = $state("");
    let password2 = $state("");

    $effect(() => {
        if (!$signUpModal) {
            dialog.close();
            return;
        }
        dialog.showModal();
        email = "";
        password = "";
    });

    function validate(email, password, password2) {
        if (password.length < 8) {
            alert("Password must be at least 8 characters long");
            return;
        }
        if (password !== password2) {
            alert("Passwords do not match");
            return;
        }
        signUp(email, password);
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
    onclose={() => $signUpModal = false}
	onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
    <div class="modal">
        <form onsubmit={(e) => {e.preventDefault(); validate(email, password, password2)}}>
            <h2>Sign Up</h2>
            <input type="email" bind:value={email} placeholder="Email">
            <input type="password" bind:value={password} placeholder="Password">
            <input type="password" bind:value={password2} placeholder="Confirm Password">
            <button>Sign Up</button>
            <p>Already have an account? <span role="button" tabindex="0" onclick={() => {dialog.close(); $signInModal = true}}>Sign in</span></p>
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

    form button {
        padding: 0.6rem;
    }

    p {
        margin: 0;
    }

    span {
        padding: 0;
        color: #2070d0;
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