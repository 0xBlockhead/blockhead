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

	const pageSelection = $derived(select(EntityType.BlockheadBitTorrentClientState_Timestamp, {
		$clientState: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadBitTorrentClientState_TimestampView from '$/views/BlockheadBitTorrentClientState_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead bit torrent client state timestamp')} • blockhead bit torrent client state timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadBitTorrentClientState_TimestampView
		selection={pageSelection}
	/>
</Page>
