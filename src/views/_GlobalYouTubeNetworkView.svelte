<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const globalYoutubeNetwork = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
	}))
	const titleFallback = $derived(['YouTube'].filter(Boolean).join(' ') || 'YouTube network')
	const viewDomId = $derived('-global-youtube-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import YoutubeChannelsView from '$/views/YoutubeChannelsView.svelte'
	import YoutubeVideosView from '$/views/YoutubeVideosView.svelte'
	import YoutubePlaylistsView from '$/views/YoutubePlaylistsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalYoutubeNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalYoutubeNetwork}>
			{#snippet Pending()}
				{['YouTube'].filter(Boolean).join(' ') || title || 'YouTube network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{['YouTube'].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									scope: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const scope = pendingEntity.scope}
							{#if scope !== undefined && scope !== null}
								{String(('YouTube') ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const scope = resolvedEntity.scope}
							{#if scope !== undefined && scope !== null}
								{String(('YouTube') ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-youtube-directory'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'youtube-channels',
							label: 'Channels',
						},
						{
							id: 'youtube-videos',
							label: 'Videos',
						},
						{
							id: 'youtube-playlists',
							label: 'Playlists',
						},
					]
				}
				data-card
				class='network-view-collapsible-directory'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Directory</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionYoutubeChannels({ id, label, open })}
					<YoutubeChannelsView
						selection={
							selection.$$observedChannels({
								sources: [
									Source.Constants_Internal,
									Source.Youtube_Rest,
								],
							})
						}
						href={resolve('/youtube/channels')}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionYoutubeVideos({ id, label, open })}
					<YoutubeVideosView
						selection={
							selection.$$observedVideos({
								sources: [
									Source.Constants_Internal,
									Source.Youtube_Rest,
								],
							})
						}
						href={resolve('/youtube/videos')}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionYoutubePlaylists({ id, label, open })}
					<YoutubePlaylistsView
						selection={
							selection.$$observedPlaylists({
								sources: [
									Source.Constants_Internal,
									Source.Youtube_Rest,
								],
							})
						}
						href={resolve('/youtube/playlists')}
						CollapsibleProps={{ canToggle: false }}
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
