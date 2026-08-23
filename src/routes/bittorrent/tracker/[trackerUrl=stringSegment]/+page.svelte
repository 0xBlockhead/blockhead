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
	import BitTorrentTrackerView from '$/views/BitTorrentTrackerView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BitTorrentTracker, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.trackerUrl || 'bit torrent tracker')} • bit torrent tracker • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bit torrent tracker'} • bit torrent tracker • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BitTorrentTracker, data.selector)}

	<BitTorrentTrackerView
		selection={pageSelection}
	/>
	{/if}
</Page>
