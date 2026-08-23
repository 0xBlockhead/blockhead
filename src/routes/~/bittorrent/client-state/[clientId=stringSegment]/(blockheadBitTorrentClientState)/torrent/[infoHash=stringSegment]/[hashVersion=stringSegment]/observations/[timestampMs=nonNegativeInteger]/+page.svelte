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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadBitTorrentTransfer_Timestamp, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.timestampMs) || 'blockhead bit torrent transfer timestamp')} • blockhead bit torrent transfer timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead bit torrent transfer timestamp'} • blockhead bit torrent transfer timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadBitTorrentTransfer_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
