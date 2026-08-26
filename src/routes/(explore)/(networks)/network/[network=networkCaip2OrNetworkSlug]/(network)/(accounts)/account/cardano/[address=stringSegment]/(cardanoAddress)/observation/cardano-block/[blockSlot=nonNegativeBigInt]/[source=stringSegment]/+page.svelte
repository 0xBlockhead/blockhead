<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CardanoAddress_Timestamp, {
		$address: data.selector,
		blockSlot: BigInt(params.blockSlot),
		source: params.source,
	}, {
		sources: [params.source],
		fields: {
			timestampMs: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoAddress_TimestampView from '$/views/CardanoAddress_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.blockSlot ?? '') || 'Cardano address timestamp' : String(pageSelection.entity.timestampMs ?? '') || String(pageSelection.entitySelector.blockSlot) || 'Cardano address timestamp')} • Cardano address timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano address timestamp'} • Cardano address timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CardanoAddress_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
