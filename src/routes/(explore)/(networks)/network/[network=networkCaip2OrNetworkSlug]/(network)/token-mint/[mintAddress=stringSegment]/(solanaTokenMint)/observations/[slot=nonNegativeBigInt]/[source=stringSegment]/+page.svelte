<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SolanaTokenMint_TimestampView from '$/views/SolanaTokenMint_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SolanaTokenMint_Timestamp, {
					$mint: data.selector,
					slot: BigInt(params.slot),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.slot) || 'solana token mint timestamp')} • solana token mint timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'solana token mint timestamp'} • solana token mint timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SolanaTokenMint_Timestamp, {
					$mint: data.selector,
					slot: BigInt(params.slot),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<SolanaTokenMint_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
