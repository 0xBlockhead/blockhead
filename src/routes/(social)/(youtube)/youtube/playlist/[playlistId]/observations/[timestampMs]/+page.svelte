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


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubePlaylist_TimestampView from '$/views/YoutubePlaylist_TimestampView.svelte'
</script>


<Page>
	<YoutubePlaylist_TimestampView
		href={
			resolve('/(social)/(youtube)/youtube/playlist/[playlistId]/observations/[timestampMs]', {
				playlistId: params.playlistId,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.YoutubePlaylist_Timestamp, {
				$playlist: {
					playlistId: decodeURIComponent(params.playlistId),
				},
				timestampMs: Number(params.timestampMs),
			})
		}
	/>
</Page>
