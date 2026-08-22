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

	const pageSelection = $derived(select(EntityType.BitTorrentTracker, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentTrackerView from '$/views/BitTorrentTrackerView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.trackerUrl || 'bit torrent tracker')} • bit torrent tracker • Blockhead</title>
</svelte:head>


<Page>
	<BitTorrentTrackerView
		selection={pageSelection}
	/>
</Page>
