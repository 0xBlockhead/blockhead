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

	const pageSelection = $derived(select(EntityType.BitTorrentPiece, {
		$torrent: data.selector,
		pieceIndex: Number(params.pieceIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentPieceView from '$/views/BitTorrentPieceView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.pieceIndex) || 'bit torrent piece')} • bit torrent piece • Blockhead</title>
</svelte:head>


<Page>
	<BitTorrentPieceView
		selection={pageSelection}
	/>
</Page>
