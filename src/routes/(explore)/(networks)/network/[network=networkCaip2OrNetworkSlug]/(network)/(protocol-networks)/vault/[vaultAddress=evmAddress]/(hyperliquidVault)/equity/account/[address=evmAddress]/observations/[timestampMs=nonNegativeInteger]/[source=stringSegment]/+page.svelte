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
	import HyperliquidVaultEquity_TimestampView from '$/views/HyperliquidVaultEquity_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidVaultEquity_Timestamp, {
				$account: {
					$network: data.selector.$network,
					address: params.address,
				},
				$vault: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? 'hyperliquid vault equity timestamp'} • hyperliquid vault equity timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'hyperliquid vault equity timestamp'} • hyperliquid vault equity timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.HyperliquidVaultEquity_Timestamp, {
				$account: {
					$network: data.selector.$network,
					address: params.address,
				},
				$vault: data.selector,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<HyperliquidVaultEquity_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
