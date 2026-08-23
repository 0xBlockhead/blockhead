<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentTrackerScrape_TimestampView from '$/views/BitTorrentTrackerScrape_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitTorrentTrackerScrape_Timestamp, {
					$tracker: data.selector,
					infoHash: params.infoHash,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'bit torrent tracker scrape timestamp')} • bit torrent tracker scrape timestamp • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'bit torrent tracker scrape timestamp'} • bit torrent tracker scrape timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitTorrentTrackerScrape_Timestamp, {
					$tracker: data.selector,
					infoHash: params.infoHash,
					timestampMs: Number(params.timestampMs),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<BitTorrentTrackerScrape_TimestampView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
