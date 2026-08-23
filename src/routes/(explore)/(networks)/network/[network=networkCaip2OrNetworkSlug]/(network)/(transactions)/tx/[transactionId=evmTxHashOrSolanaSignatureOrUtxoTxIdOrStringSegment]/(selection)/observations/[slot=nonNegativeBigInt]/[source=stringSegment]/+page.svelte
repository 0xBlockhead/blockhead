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
	import SolanaTransaction_TimestampView from '$/views/SolanaTransaction_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SolanaTransaction_Timestamp, {
					$transaction: data.selector,
					slot: BigInt(params.slot),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.slot) || 'solana transaction timestamp')} • solana transaction timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'solana transaction timestamp'} • solana transaction timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.SolanaTransaction_Timestamp, {
					$transaction: data.selector,
					slot: BigInt(params.slot),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<SolanaTransaction_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
