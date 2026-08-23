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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BitTorrentAnnounce_Timestamp, {
		$torrent: data.selector,
		$tracker: {
			trackerUrl: params.trackerUrl,
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentAnnounce_TimestampView from '$/views/BitTorrentAnnounce_TimestampView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'bit torrent announce timestamp')} • bit torrent announce timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bit torrent announce timestamp'} • bit torrent announce timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BitTorrentAnnounce_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
