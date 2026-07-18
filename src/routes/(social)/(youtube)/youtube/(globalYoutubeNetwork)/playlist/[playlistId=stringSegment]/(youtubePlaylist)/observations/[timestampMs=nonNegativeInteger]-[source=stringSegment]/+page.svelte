<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.YoutubePlaylist_Timestamp, {
		$playlist: {
			playlistId: decodeURIComponent(params.playlistId),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$playlist: {
				playlistId: decodeURIComponent(params.playlistId),
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.timestampMs) ?? ''), String((pageSelection.entitySelector.source) ?? '')].filter(Boolean).join(' ') || 'YouTube playlist observation' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).source) ?? '')].filter(Boolean).join(' ') || 'YouTube playlist observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubePlaylist_TimestampView from '$/views/YoutubePlaylist_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • YouTube playlist observation • Blockhead</title>
</svelte:head>


<Page>
	<YoutubePlaylist_TimestampView
		href={
			resolve('/youtube/playlist/[playlistId=stringSegment]/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', {
				playlistId: params.playlistId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
