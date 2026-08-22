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

	const pageSelection = $derived(select(EntityType.BlockheadBitTorrentTransfer_Timestamp, {
		$client: data.selector,
		$torrent: {
			infoHash: params.infoHash,
			hashVersion: params.hashVersion,
		},
		timestampMs: Number(params.timestampMs),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadBitTorrentTransfer_TimestampView from '$/views/BlockheadBitTorrentTransfer_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead bit torrent transfer timestamp')} • blockhead bit torrent transfer timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadBitTorrentTransfer_TimestampView
		selection={pageSelection}
	/>
</Page>
