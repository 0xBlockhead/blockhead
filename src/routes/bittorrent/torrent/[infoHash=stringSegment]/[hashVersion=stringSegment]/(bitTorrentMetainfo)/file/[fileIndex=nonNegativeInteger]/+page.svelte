<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentFileView from '$/views/BitTorrentFileView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitTorrentFile, {
					$torrent: data.selector,
					fileIndex: Number(params.fileIndex),
				}, {
					fields: {
						path: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'bit torrent file' : pageSelection.entity.path || 'bit torrent file')} • bit torrent file • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'bit torrent file'} • bit torrent file • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitTorrentFile, {
					$torrent: data.selector,
					fileIndex: Number(params.fileIndex),
				}, {
					fields: {
						path: true,
					},
				}))}

		<BitTorrentFileView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
