<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BeaconExecutionPayloadEnvelope, data.selector, {
		sources: [
			Source.Beacon_Rest,
		],
		fields: {
			blockNumber: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconExecutionPayloadEnvelopeView from '$/views/BeaconExecutionPayloadEnvelopeView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'Beacon execution payload envelope' : 'Execution block ' + String(pageSelection.entity.blockNumber))} • Beacon execution payload envelope • Blockhead</title>
</svelte:head>


<Page>
	<BeaconExecutionPayloadEnvelopeView
		selection={pageSelection}
	/>
</Page>
