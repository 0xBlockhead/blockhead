<script lang="ts">
	// State
	import type { Snippet } from 'svelte'

	let {
		children,
	}: {
		children: Snippet
	} = $props()


	// Components
	import AccountEnrollmentControl from './AccountEnrollmentControl.svelte'
	import WalletConnectionsControl from './WalletConnectionsControl.svelte'
</script>


<div data-column="gap-4">
	<AccountEnrollmentControl />

	<WalletConnectionsControl id="wallet-connections" />

	{@render children()}
</div>
