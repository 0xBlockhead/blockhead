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
	import BitcoinMiningPool_TimestampView from '$/views/BitcoinMiningPool_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BitcoinMiningPool_Timestamp, {
				$pool: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'Bitcoin mining pool observation')} • Bitcoin mining pool observation • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Bitcoin mining pool observation'} • Bitcoin mining pool observation • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BitcoinMiningPool_Timestamp, {
				$pool: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<BitcoinMiningPool_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
