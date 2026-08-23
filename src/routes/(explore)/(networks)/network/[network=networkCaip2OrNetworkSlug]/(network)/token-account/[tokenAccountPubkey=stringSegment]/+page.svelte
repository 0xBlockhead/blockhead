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


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaTokenAccountView from '$/views/SolanaTokenAccountView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SolanaTokenAccount, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.tokenAccountPubkey || 'solana token account')} • solana token account • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'solana token account'} • solana token account • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SolanaTokenAccount, data.selector)}

	<SolanaTokenAccountView
		selection={pageSelection}
	/>
	{/if}
</Page>
