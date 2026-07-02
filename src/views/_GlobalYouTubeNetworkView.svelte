<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType._GlobalYoutubeNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalYoutubeNetwork>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const globalYoutubeNetwork = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
	}))
	const titleFallback = $derived(['YouTube'].filter(Boolean).join(' ') || 'YouTube network')
	const viewDomId = $derived('-global-youtube-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import YoutubeChannelsView from '$/views/YoutubeChannelsView.svelte'
	import YoutubeVideosView from '$/views/YoutubeVideosView.svelte'
	import YoutubePlaylistsView from '$/views/YoutubePlaylistsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalYoutubeNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{['YouTube'].filter(Boolean).join(' ') || title || 'YouTube network'}
		{:else}
			<ResourceBoundary resource={globalYoutubeNetwork}>
				{#snippet Pending()}
					{['YouTube'].filter(Boolean).join(' ') || title || 'YouTube network'}
				{/snippet}

				{#snippet children(entity)}
					{['YouTube'].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<YoutubeChannelsView
				selection={selection[EntityProxyField]<EntityType.YoutubeChannel>('$$sourceWindowChannels')}
				title='Channels'
				href={resolve('/(social)/(youtube)/youtube/channels')}
				id='YoutubeChannelsView-$$sourceWindowChannels'
			/>

			<YoutubeVideosView
				selection={selection[EntityProxyField]<EntityType.YoutubeVideo>('$$sourceWindowVideos')}
				title='Videos'
				href={resolve('/(social)/(youtube)/youtube/videos')}
				id='YoutubeVideosView-$$sourceWindowVideos'
			/>

			<YoutubePlaylistsView
				selection={selection[EntityProxyField]<EntityType.YoutubePlaylist>('$$sourceWindowPlaylists')}
				title='Playlists'
				href={resolve('/(social)/(youtube)/youtube/playlists')}
				id='YoutubePlaylistsView-$$sourceWindowPlaylists'
			/>
		{/if}
	{/snippet}
</EntityView>
