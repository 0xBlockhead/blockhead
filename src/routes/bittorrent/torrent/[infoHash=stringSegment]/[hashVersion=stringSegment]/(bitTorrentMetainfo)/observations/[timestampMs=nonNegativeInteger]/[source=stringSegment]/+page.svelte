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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BitTorrentSwarmObservation_Timestamp, {
		$torrent: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentSwarmObservation_TimestampView from '$/views/BitTorrentSwarmObservation_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'bit torrent swarm observation timestamp')} • bit torrent swarm observation timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bit torrent swarm observation timestamp'} • bit torrent swarm observation timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BitTorrentSwarmObservation_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
