<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const playlistId = $derived(
		page.params.playlistId ?? '',
	)


	// Components
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
			entityId={{ playlistId: decodeURIComponent(playlistId) }}
			href={resolve('/(social)/(youtube)/youtube/playlist/[playlistId]', {
				playlistId: encodeURIComponent(playlistId),
			})}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
