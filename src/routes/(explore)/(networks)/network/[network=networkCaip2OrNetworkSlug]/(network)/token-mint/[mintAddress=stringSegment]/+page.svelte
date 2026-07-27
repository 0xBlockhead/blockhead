<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.SolanaTokenMint, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaTokenMintView from '$/views/SolanaTokenMintView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entitySelector.mintAddress || 'solana token mint'))} • solana token mint • Blockhead</title>
</svelte:head>


<Page>
	<SolanaTokenMintView
		selection={pageSelection}
	/>
</Page>
