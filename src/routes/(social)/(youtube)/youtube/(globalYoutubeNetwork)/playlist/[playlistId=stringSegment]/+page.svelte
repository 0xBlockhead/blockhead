<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.YoutubePlaylist, data.selector, {
		sources: [
			Source.Youtube_Rest,
			Source.Piped_Rest,
			Source.Constants_Internal,
		],
		fields: {
			$thumbnail: true,
			title: true,
			$channel: true,
			publishedAtMs: true,
			description: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubePlaylistView from '$/views/YoutubePlaylistView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.playlistId) ?? '')].filter(Boolean).join(' ') || 'YouTube playlist' : [String((({ ...data.selector, ...pageSelection.entity }).title) ?? '')].filter(Boolean).join(' ') || [String((({ ...data.selector, ...pageSelection.entity }).playlistId) ?? '')].filter(Boolean).join(' ') || 'YouTube playlist'))} • YouTube playlist • Blockhead</title>
</svelte:head>


<Page>
	<YoutubePlaylistView
		href={
			resolve('/youtube/playlist/[playlistId=stringSegment]', {
				playlistId: params.playlistId,
			})
		}
		selection={pageSelection}
	/>
</Page>
