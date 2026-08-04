<script lang="ts">
	// State
	import type { Snippet } from 'svelte'

	let {
		children,
	}: {
		children: Snippet
	} = $props()


	// Components
	import WalletConnectionsControl from './WalletConnectionsControl.svelte'
</script>


<div data-column="gap-4">
	<WalletConnectionsControl />

	{@render children()}
</div>
