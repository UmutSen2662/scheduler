<script>
    import { online } from "../../supabase.svelte";
</script>

<div style="display: {online ? 'none' : 'block'};"></div>

<style>
    div {
        position: fixed;
        z-index: 999;
        inset: 0;
    }
</style>