<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType._GlobalYoutubeNetwork>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType._GlobalYoutubeNetwork>>
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
		sources: selection.sources,
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
	href={href ?? (pendingEntity.scope === '_GlobalYoutubeNetwork' ? resolve('/youtube') : undefined)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{['YouTube'].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={globalYoutubeNetwork}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{['YouTube'].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									scope: true,
								},
							})
						}
					>
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
							label: 'Popular-chart channels',
						},
						{
							id: 'youtube-videos',
							label: 'Popular videos (provider-default region and category; Piped US)',
						},
						{
							id: 'youtube-playlists',
							label: 'Seeded-channel playlists',
						},
					]
				}
				data-card
				class='network-view-collapsible-directory'
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Bounded discovery</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionYoutubeChannels({ id, label, open })}
					<YoutubeChannelsView
						selection={
							selection.$$observedChannels({
								sources: [
									Source.Constants_Internal,
									Source.Youtube_Rest,
									Source.Piped_Rest,
								],
							})
						}
						href={resolve('/youtube/channels')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No popular-chart channels available.'
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
									Source.Piped_Rest,
								],
							})
						}
						href={resolve('/youtube/videos')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No popular videos (provider-default region and category; piped us) available.'
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
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No seeded-channel playlists available.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
