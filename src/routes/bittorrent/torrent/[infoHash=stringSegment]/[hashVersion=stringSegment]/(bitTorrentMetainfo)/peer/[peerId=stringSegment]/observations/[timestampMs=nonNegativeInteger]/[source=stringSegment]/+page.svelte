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


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentPeer_TimestampView from '$/views/BitTorrentPeer_TimestampView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BitTorrentPeer_Timestamp, {
				$torrent: data.selector,
				peerId: params.peerId,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.peerId || 'bit torrent peer timestamp')} • bit torrent peer timestamp • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bit torrent peer timestamp'} • bit torrent peer timestamp • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BitTorrentPeer_Timestamp, {
				$torrent: data.selector,
				peerId: params.peerId,
				timestampMs: Number(params.timestampMs),
				source: params.source,
			}, {
				sources: [params.source],
			})}

	<BitTorrentPeer_TimestampView
		selection={pageSelection}
	/>
	{/if}
</Page>
