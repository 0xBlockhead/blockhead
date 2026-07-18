<script lang="ts">
	// State
	import type { Snippet } from 'svelte'

	let {
		children,
	}: {
		children: Snippet
	} = $props()


	// Components
	import BlockheadSessionCreateControl from '$/components/BlockheadSessionCreateControl.svelte'
</script>


<div data-column="gap-4">
	<BlockheadSessionCreateControl />

	{@render children()}
</div>
