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

	const pageSelection = $derived(select(EntityType.CardanoAddress_Timestamp, {
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
	<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.blockSlot ?? '') || 'Cardano address timestamp' : String(pageSelection.entity.timestampMs ?? '') || String(pageSelection.entitySelector.blockSlot) || 'Cardano address timestamp')} • Cardano address timestamp • Blockhead</title>
</svelte:head>


<Page>
	<CardanoAddress_TimestampView
		selection={pageSelection}
	/>
</Page>
