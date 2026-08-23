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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaTokenAccount_TimestampView from '$/views/SolanaTokenAccount_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SolanaTokenAccount_Timestamp, {
				$tokenAccount: data.selector,
				slot: BigInt(params.slot),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.slot) || 'solana token account timestamp')} • solana token account timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'solana token account timestamp'} • solana token account timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SolanaTokenAccount_Timestamp, {
				$tokenAccount: data.selector,
				slot: BigInt(params.slot),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<SolanaTokenAccount_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
