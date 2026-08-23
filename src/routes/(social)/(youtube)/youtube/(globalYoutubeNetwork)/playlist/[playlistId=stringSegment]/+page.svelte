<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubePlaylistView from '$/views/YoutubePlaylistView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.YoutubePlaylist, data.selector, {
				sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
					Source.Constants_Internal,
				],
				fields: {
					title: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.playlistId ?? '') || 'YouTube playlist' : (pageSelection.entity.title ?? '') || pageSelection.entitySelector.playlistId || 'YouTube playlist')} • YouTube playlist • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'YouTube playlist'} • YouTube playlist • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.YoutubePlaylist, data.selector, {
				sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
					Source.Constants_Internal,
				],
				fields: {
					title: true,
				},
			})}

	<YoutubePlaylistView
		selection={pageSelection}
	/>
	{/if}
</Page>
