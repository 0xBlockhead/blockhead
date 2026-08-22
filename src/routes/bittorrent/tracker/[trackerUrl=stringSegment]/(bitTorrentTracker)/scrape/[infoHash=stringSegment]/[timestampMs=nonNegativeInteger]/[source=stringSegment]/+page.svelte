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

	const pageSelection = $derived(select(EntityType.BitTorrentTrackerScrape_Timestamp, {
		$tracker: data.selector,
		infoHash: params.infoHash,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentTrackerScrape_TimestampView from '$/views/BitTorrentTrackerScrape_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'bit torrent tracker scrape timestamp')} • bit torrent tracker scrape timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BitTorrentTrackerScrape_TimestampView
		selection={pageSelection}
	/>
</Page>
