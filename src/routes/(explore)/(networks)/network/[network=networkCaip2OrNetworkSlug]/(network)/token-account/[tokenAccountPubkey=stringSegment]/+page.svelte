<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.SolanaTokenAccount, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaTokenAccountView from '$/views/SolanaTokenAccountView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.tokenAccountPubkey || 'solana token account')} • solana token account • Blockhead</title>
</svelte:head>


<Page>
	<SolanaTokenAccountView
		selection={pageSelection}
	/>
</Page>
