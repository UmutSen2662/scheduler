<script>
    import { signOut, userid } from "../supabase.svelte";
    import { signInModal } from "../store";
    import SignIn from "./SignIn.svelte";
    import SignUp from "./SignUp.svelte";
</script>

<div>
    <SignIn />
    <SignUp />
    <h2>METU Schedule and CEF</h2>
    <button class="{userid ? "signout" : "signin"}" onclick={userid ? signOut : () => {$signInModal = true}}>{userid ? "Sign Out" : "Sign In"}</button>
</div>

<style>
    div {
        display: flex; justify-content: space-between; padding: 0.5rem; width: 100%;    
    }

    h2 {
        margin: 0;
    }

    button {
        padding: 0.6rem;
    }

    .signout {
        background: #666;
    }
</style>