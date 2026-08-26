<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BitTorrentPiece, {
		$torrent: data.selector,
		pieceIndex: Number(params.pieceIndex),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentPieceView from '$/views/BitTorrentPieceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.pieceIndex) || 'bit torrent piece')} • bit torrent piece • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bit torrent piece'} • bit torrent piece • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BitTorrentPieceView
		selection={pageSelection}
	/>
	{/if}
</Page>
