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

	const pageSelection = $derived(select(EntityType.BeaconExecutionPayloadBid, {
		$beaconBlock: data.selector,
	}, {
		sources: [
			Source.Beacon_Rest,
		],
		fields: {
			builderIndex: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconExecutionPayloadBidView from '$/views/BeaconExecutionPayloadBidView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'Beacon execution payload bid' : 'Builder ' + String(pageSelection.entity.builderIndex))} • Beacon execution payload bid • Blockhead</title>
</svelte:head>


<Page>
	<BeaconExecutionPayloadBidView
		selection={pageSelection}
	/>
</Page>
