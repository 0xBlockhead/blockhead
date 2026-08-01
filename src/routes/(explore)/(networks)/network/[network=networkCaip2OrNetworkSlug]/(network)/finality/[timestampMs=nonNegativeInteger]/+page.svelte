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

	const pageSelection = $derived(select(EntityType.EthereumBeaconFinality_Timestamp, data.selector, {
		fields: {
			finalizedCheckpointEpoch: true,
			finalizedCheckpointRoot: true,
			currentJustifiedCheckpointEpoch: true,
			currentJustifiedCheckpointRoot: true,
			previousJustifiedCheckpointEpoch: true,
			previousJustifiedCheckpointRoot: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EthereumBeaconFinality_TimestampView from '$/views/EthereumBeaconFinality_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'ethereum beacon finality timestamp' : 'Finalized epoch ' + String(pageSelection.entity.finalizedCheckpointEpoch))} • ethereum beacon finality timestamp • Blockhead</title>
</svelte:head>


<Page>
	<EthereumBeaconFinality_TimestampView
		selection={pageSelection}
	/>
</Page>
