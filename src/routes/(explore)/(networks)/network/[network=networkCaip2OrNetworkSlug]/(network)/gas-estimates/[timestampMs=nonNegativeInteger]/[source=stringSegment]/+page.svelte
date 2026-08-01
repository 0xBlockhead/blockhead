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

	const pageSelection = $derived(select(EntityType.EvmNetwork_GasEstimate_Timestamp, data.selector, {
		sources: [data.selector.source],
		fields: {
			fastGwei: true,
			slowGwei: true,
			averageGwei: true,
			transport: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetwork_GasEstimate_TimestampView from '$/views/EvmNetwork_GasEstimate_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.timestampMs ?? '') || 'EVM network gas estimate timestamp' : [(pageSelection.entity.fastGwei != null ? String(pageSelection.entity.fastGwei) + ' gwei' : ''), String(pageSelection.entitySelector.timestampMs)].filter(Boolean).join(' ') || 'EVM network gas estimate timestamp')} • EVM network gas estimate timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_GasEstimate_TimestampView
		selection={pageSelection}
	/>
</Page>
