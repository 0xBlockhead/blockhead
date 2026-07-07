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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubePlaylistView from '$/views/YoutubePlaylistView.svelte'
</script>


<Page>
	<YoutubePlaylistView
		href={
			resolve('/(social)/(youtube)/youtube/playlist/[playlistId]', {
				playlistId: params.playlistId,
			})
		}
		selection={
			select(EntityType.YoutubePlaylist, {
				playlistId: decodeURIComponent(params.playlistId),
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					title: true,
					publishedAtMs: true,
					description: true,
					$channel: true,
				},
			})
		}
	/>
</Page>
