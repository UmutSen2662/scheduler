<script>
    import { signOut, userid, online } from "../../supabase.svelte";
    import { modals } from "../../store.svelte";
    import Offline from "./Offline.svelte";
    import SignIn from "./SignIn.svelte";
    import SignUp from "./SignUp.svelte";

    let theme = $state(JSON.parse(localStorage.getItem("theme")) || false);

    $effect(() => {
        if (theme) document.documentElement.className = "dark";
        else document.documentElement.className = "light";
        localStorage.setItem("theme", JSON.stringify(theme));
    });

    const button = online ? (userid ? "Sign_Out" : "Sign_In") : "Offline";
</script>

<div>
    <Offline />
    <SignIn />
    <SignUp />
    <h2>METU Scheduler and CEF</h2>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        onclick={() => {
            theme = !theme;
        }}
    >
        <path
            d="M192 64C86 64 0 150 0 256S86 448 192 448l192 0c106 0 192-86 192-192s-86-192-192-192L192 64zm192 96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
        />
    </svg>
    <button
        class={button}
        onclick={userid
            ? signOut
            : () => {
                  modals.signInModal = true;
              }}
    >
        {button.replace("_", " ")}
    </button>
</div>

<style>
    div {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        width: 100%;
    }

    h2 {
        margin: 0;
        margin-right: auto;
    }

    svg {
        width: 2.4rem;
        fill: var(--color);
        margin-right: 1rem;
        transform: var(--svg);
    }

    .Sign_Out {
        color: var(--acccent);
    }

    .Offline {
        color: var(--red);
    }
</style>
