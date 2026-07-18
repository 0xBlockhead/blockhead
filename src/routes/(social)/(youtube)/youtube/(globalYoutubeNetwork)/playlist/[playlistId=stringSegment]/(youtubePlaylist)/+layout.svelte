<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import YoutubePlaylistView from '$/views/YoutubePlaylistView.svelte'
</script>


{#key params.playlistId}
	<ParentPageCollapsible
		href={
			resolve('/youtube/playlist/[playlistId=stringSegment]', {
				playlistId: params.playlistId,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = YoutubePlaylistView}

			<DetailView
				selection={select(EntityType.YoutubePlaylist, data.selector, { sources: [
		Source.Youtube_Rest,
		Source.Piped_Rest,
		Source.Constants_Internal,
	] })}
				href={
					resolve('/youtube/playlist/[playlistId=stringSegment]', {
						playlistId: params.playlistId,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
