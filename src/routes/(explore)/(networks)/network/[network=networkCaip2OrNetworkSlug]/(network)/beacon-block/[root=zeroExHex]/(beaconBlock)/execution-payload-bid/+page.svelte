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


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconExecutionPayloadBidView from '$/views/BeaconExecutionPayloadBidView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BeaconExecutionPayloadBid, {
				$beaconBlock: data.selector,
			}, {
				sources: [
					Source.Beacon_Rest,
				],
				fields: {
					builderIndex: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Beacon execution payload bid' : 'Builder ' + String(pageSelection.entity.builderIndex))} • Beacon execution payload bid • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Beacon execution payload bid'} • Beacon execution payload bid • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BeaconExecutionPayloadBid, {
				$beaconBlock: data.selector,
			}, {
				sources: [
					Source.Beacon_Rest,
				],
				fields: {
					builderIndex: true,
				},
			})}

	<BeaconExecutionPayloadBidView
		selection={pageSelection}
	/>
	{/if}
</Page>
