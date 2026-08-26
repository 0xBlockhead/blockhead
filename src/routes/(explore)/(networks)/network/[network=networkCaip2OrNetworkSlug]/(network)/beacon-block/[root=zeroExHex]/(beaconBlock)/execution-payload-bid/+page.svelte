<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BeaconExecutionPayloadBid, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Beacon execution payload bid' : 'Builder ' + String(pageSelection.entity.builderIndex))} • Beacon execution payload bid • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Beacon execution payload bid'} • Beacon execution payload bid • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BeaconExecutionPayloadBidView
		selection={pageSelection}
	/>
	{/if}
</Page>
