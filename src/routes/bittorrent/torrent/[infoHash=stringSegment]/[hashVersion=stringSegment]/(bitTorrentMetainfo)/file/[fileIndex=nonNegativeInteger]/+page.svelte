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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BitTorrentFile, {
		$torrent: data.selector,
		fileIndex: Number(params.fileIndex),
	}, {
		fields: {
			path: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentFileView from '$/views/BitTorrentFileView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'bit torrent file' : pageSelection.entity.path || 'bit torrent file')} • bit torrent file • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bit torrent file'} • bit torrent file • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BitTorrentFileView
		selection={pageSelection}
	/>
	{/if}
</Page>
