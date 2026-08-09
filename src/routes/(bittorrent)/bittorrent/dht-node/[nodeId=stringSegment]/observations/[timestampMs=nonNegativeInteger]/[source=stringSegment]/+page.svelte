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

	const pageSelection = $derived(select(EntityType.BitTorrentDhtNode_Timestamp, {
		nodeId: params.nodeId,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentDhtNode_TimestampView from '$/views/BitTorrentDhtNode_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.nodeId || 'bit torrent DHT node timestamp'} • bit torrent DHT node timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BitTorrentDhtNode_TimestampView
		selection={pageSelection}
	/>
</Page>
