<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		children,
	}: {
		children: Snippet
	} = $props()

	import FarcasterAccountControl from '../FarcasterAccountControl.svelte'
</script>


<FarcasterAccountControl />

{@render children()}
