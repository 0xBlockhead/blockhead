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

	const pageSelection = $derived(select(EntityType.BitTorrentFileTreeEntry, {
		$torrent: data.selector,
		path: params.path,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentFileTreeEntryView from '$/views/BitTorrentFileTreeEntryView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.path || 'bit torrent file tree entry')} • bit torrent file tree entry • Blockhead</title>
</svelte:head>


<Page>
	<BitTorrentFileTreeEntryView
		selection={pageSelection}
	/>
</Page>
