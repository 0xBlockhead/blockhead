<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const playlistId = $derived(
		page.params.playlistId ?? '',
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import YouTubePlaylistView from '$/views/YouTubePlaylistView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(youtube)/youtube/playlist/[playlistId]', {
		playlistId: encodeURIComponent(playlistId),
	})}
	id={playlistId}
>
	{#snippet Summary({ open: _open })}
		<YouTubePlaylistView
			selection={select(EntityType.YouTubePlaylist, { playlistId: decodeURIComponent(playlistId) })}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
