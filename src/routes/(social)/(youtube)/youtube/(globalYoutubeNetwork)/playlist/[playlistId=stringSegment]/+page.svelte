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
			Source.Constants_Internal,
		],
		fields: {
			title: true,
			publishedAtMs: true,
			description: true,
			$channel: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.title) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.playlistId) ?? '')].filter(Boolean).join(' ') || 'YouTube playlist' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).title) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).playlistId) ?? '')].filter(Boolean).join(' ') || 'YouTube playlist')))


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubePlaylistView from '$/views/YoutubePlaylistView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • YouTube playlist • Blockhead</title>
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
