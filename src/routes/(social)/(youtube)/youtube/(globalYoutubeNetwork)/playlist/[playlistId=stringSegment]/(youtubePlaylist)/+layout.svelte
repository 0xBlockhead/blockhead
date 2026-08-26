<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]',
			{
				playlistId: params.playlistId,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.YoutubePlaylist, data.selector, {
		sources: [
			Source.Youtube_Rest,
			Source.Piped_Rest,
			Source.Constants_Internal,
		],
	}))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import YoutubePlaylistView from '$/views/YoutubePlaylistView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<YoutubePlaylistView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
