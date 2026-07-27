<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.EvmNetwork_Timestamp, data.selector, {
		sources: [data.selector.source],
		fields: {
			blockHeight: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetwork_TimestampView from '$/views/EvmNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.timestampMs ?? '') || 'EVM network timestamp' : ([(String(pageSelection.entity.blockHeight) ? 'Block ' + String(pageSelection.entity.blockHeight) : ''), String(pageSelection.entitySelector.timestampMs)].filter(Boolean).join(' ')) || 'EVM network timestamp'))} • EVM network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetwork_TimestampView
		selection={pageSelection}
	/>
</Page>
