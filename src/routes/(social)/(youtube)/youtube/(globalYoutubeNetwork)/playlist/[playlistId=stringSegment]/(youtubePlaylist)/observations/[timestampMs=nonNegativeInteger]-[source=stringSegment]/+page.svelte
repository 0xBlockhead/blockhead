<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
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


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubePlaylist_TimestampView from '$/views/YoutubePlaylist_TimestampView.svelte'
</script>


<svelte:head>
	<title>{[String(pageSelection.entitySelector.timestampMs), pageSelection.entitySelector.source].filter(Boolean).join(' ') || 'YouTube playlist observation'} • YouTube playlist observation • Blockhead</title>
</svelte:head>


<Page>
	<YoutubePlaylist_TimestampView
		selection={pageSelection}
	/>
</Page>
