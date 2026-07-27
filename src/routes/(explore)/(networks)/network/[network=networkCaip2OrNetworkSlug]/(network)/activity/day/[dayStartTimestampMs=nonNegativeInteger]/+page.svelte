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

	const pageSelection = $derived(select(EntityType.Network_Activity_Day, data.selector, {
		sources: [data.selector.source],
		fields: {
			transactionCount: true,
			trustModel: true,
			blockCount: true,
			endBlockNumber: true,
			indexedThroughTimestampMs: true,
			resolvedAtMs: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Network_Activity_DayView from '$/views/Network_Activity_DayView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (String(pageSelection.entitySelector.dayStartTimestampMs) || 'network activity day'))} • network activity day • Blockhead</title>
</svelte:head>


<Page>
	<Network_Activity_DayView
		selection={pageSelection}
	/>
</Page>
