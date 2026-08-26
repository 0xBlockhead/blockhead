<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EthereumBeaconFinality_Timestamp, data.selector, {
		fields: {
			finalizedCheckpointEpoch: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EthereumBeaconFinality_TimestampView from '$/views/EthereumBeaconFinality_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'ethereum beacon finality timestamp' : 'Finalized epoch ' + String(pageSelection.entity.finalizedCheckpointEpoch))} • ethereum beacon finality timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ethereum beacon finality timestamp'} • ethereum beacon finality timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EthereumBeaconFinality_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
