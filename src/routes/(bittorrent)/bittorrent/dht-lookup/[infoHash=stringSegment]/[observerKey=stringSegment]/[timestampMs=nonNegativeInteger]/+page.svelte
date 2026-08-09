<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BitTorrentDhtLookup_Timestamp, {
		infoHash: params.infoHash,
		observerKey: params.observerKey,
		timestampMs: Number(params.timestampMs),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentDhtLookup_TimestampView from '$/views/BitTorrentDhtLookup_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.infoHash || 'bit torrent DHT lookup timestamp'} • bit torrent DHT lookup timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BitTorrentDhtLookup_TimestampView
		selection={pageSelection}
	/>
</Page>
