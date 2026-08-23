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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetwork_GasEstimate_TimestampView from '$/views/EvmNetwork_GasEstimate_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmNetwork_GasEstimate_Timestamp, data.selector, {
					sources: [data.selector.source],
					fields: {
						fastGwei: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.timestampMs ?? '') || 'EVM network gas estimate timestamp' : [(pageSelection.entity.fastGwei != null ? String(pageSelection.entity.fastGwei) + ' gwei' : ''), String(pageSelection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'EVM network gas estimate timestamp')} • EVM network gas estimate timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'EVM network gas estimate timestamp'} • EVM network gas estimate timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmNetwork_GasEstimate_Timestamp, data.selector, {
					sources: [data.selector.source],
					fields: {
						fastGwei: true,
					},
				}))}

		<EvmNetwork_GasEstimate_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
