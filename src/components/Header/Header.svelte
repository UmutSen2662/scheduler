<script>
    import { signOut, userid, online } from "../../supabase.svelte";
    import { signInModal } from "../../store";
    import Offline from "./Offline.svelte";
    import SignIn from "./SignIn.svelte";
    import SignUp from "./SignUp.svelte";

    const button = online ? (userid ? "Sign_Out" : "Sign_In") : "Offline";
</script>

<div>
    <Offline />
    <SignIn />
    <SignUp />
    <h2>METU Scheduler and CEF</h2>
    <button
        class={button}
        onclick={userid
            ? signOut
            : () => {
                  $signInModal = true;
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
    }

    .Sign_Out {
        color: var(--acccent);
    }

    .Offline {
        color: var(--red);
    }
</style>
