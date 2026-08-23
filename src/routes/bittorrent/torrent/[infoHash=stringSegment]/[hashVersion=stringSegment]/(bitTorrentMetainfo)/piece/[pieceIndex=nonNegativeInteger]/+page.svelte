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
	import BitTorrentPieceView from '$/views/BitTorrentPieceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BitTorrentPiece, {
				$torrent: data.selector,
				pieceIndex: Number(params.pieceIndex),
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.pieceIndex) || 'bit torrent piece')} • bit torrent piece • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bit torrent piece'} • bit torrent piece • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BitTorrentPiece, {
				$torrent: data.selector,
				pieceIndex: Number(params.pieceIndex),
			})}

	<BitTorrentPieceView
		selection={pageSelection}
	/>
	{/if}
</Page>
