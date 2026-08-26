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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BitTorrentFileTreeEntry, {
		$torrent: data.selector,
		path: params.path,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentFileTreeEntryView from '$/views/BitTorrentFileTreeEntryView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.path || 'bit torrent file tree entry')} • bit torrent file tree entry • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bit torrent file tree entry'} • bit torrent file tree entry • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BitTorrentFileTreeEntryView
		selection={pageSelection}
	/>
	{/if}
</Page>
