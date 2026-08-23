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


	// Components
	import Page from '$/components/Page.svelte'
	import EthereumBeaconFinality_TimestampView from '$/views/EthereumBeaconFinality_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EthereumBeaconFinality_Timestamp, data.selector, {
				fields: {
					finalizedCheckpointEpoch: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'ethereum beacon finality timestamp' : 'Finalized epoch ' + String(pageSelection.entity.finalizedCheckpointEpoch))} • ethereum beacon finality timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ethereum beacon finality timestamp'} • ethereum beacon finality timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.EthereumBeaconFinality_Timestamp, data.selector, {
				fields: {
					finalizedCheckpointEpoch: true,
				},
			})}

	<EthereumBeaconFinality_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
