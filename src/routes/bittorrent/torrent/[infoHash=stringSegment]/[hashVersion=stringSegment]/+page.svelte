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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentMetainfoView from '$/views/BitTorrentMetainfoView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BitTorrentMetainfo, data.selector, {
				fields: {
					name: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.infoHash ?? '') || 'bit torrent metainfo' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.infoHash || 'bit torrent metainfo')} • bit torrent metainfo • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bit torrent metainfo'} • bit torrent metainfo • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BitTorrentMetainfo, data.selector, {
				fields: {
					name: true,
				},
			})}

	<BitTorrentMetainfoView
		selection={pageSelection}
	/>
	{/if}
</Page>
