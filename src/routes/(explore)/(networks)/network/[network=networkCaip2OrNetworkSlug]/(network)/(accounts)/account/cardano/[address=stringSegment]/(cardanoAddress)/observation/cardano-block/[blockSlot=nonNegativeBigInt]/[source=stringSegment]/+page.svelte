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
	import CardanoAddress_TimestampView from '$/views/CardanoAddress_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoAddress_Timestamp, {
					$address: data.selector,
					blockSlot: BigInt(params.blockSlot),
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						timestampMs: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.blockSlot ?? '') || 'Cardano address timestamp' : String(pageSelection.entity.timestampMs ?? '') || String(pageSelection.entitySelector.blockSlot) || 'Cardano address timestamp')} • Cardano address timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Cardano address timestamp'} • Cardano address timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.CardanoAddress_Timestamp, {
					$address: data.selector,
					blockSlot: BigInt(params.blockSlot),
					source: params.source,
				}, {
					sources: [params.source],
					fields: {
						timestampMs: true,
					},
				}))}

		<CardanoAddress_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
