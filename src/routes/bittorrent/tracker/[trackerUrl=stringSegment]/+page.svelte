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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BitTorrentTracker, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentTrackerView from '$/views/BitTorrentTrackerView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.trackerUrl || 'bit torrent tracker')} • bit torrent tracker • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bit torrent tracker'} • bit torrent tracker • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BitTorrentTrackerView
		selection={pageSelection}
	/>
	{/if}
</Page>
