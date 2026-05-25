<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve('/(social)/(youtube)/youtube/playlist/[playlistId]', {
			playlistId: entityId.playlistId,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.YouTubePlaylist>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const playlist = useEntity(
		EntityType.YouTubePlaylist,
		entityId,
		{
			$: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
			title: {},
			description: {},
			itemCount: {},
			publishedAt: {},
			$channel: {},
			...(open ?
				{
					$$videos: {
						$: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						],
					},
				}
			:
				{}),
		},
	)

	const idKey = stringify(entityId)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import YouTubeChannelView from '$/views/YouTubeChannelView.svelte'
	import YouTubeVideosView from '$/views/YouTubeVideosView.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubePlaylist}
	{entityId}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.playlistId}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={playlist}
			placeholderText="Loading playlist…"
		>
			{#snippet children(loadedPlaylist)}
				{loadedPlaylist.title ?? entityId.playlistId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Playlist ids are opaque PL… curator lists or UU… channel-upload feeds from the Data API (or Piped equivalents).
		</p>
		<p>
			Each item resolves to an 11-character videoId—not a Farcaster channel slug or Reddit submission id.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if open}
				<ResourceBoundary
					resource={playlist}
					placeholderText="Loading playlist…"
				>
					{#snippet children(loadedPlaylist)}
						{#if loadedPlaylist.description}
							<div>
								<dt>Description</dt>
								<dd>{loadedPlaylist.description}</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
			{#if open}
				<ResourceBoundary
					resource={playlist}
					placeholderText="Loading playlist…"
				>
					{#snippet children(loadedPlaylist)}
						{#if loadedPlaylist.itemCount != null}
							<div>
								<dt>Items</dt>
								<dd>{String(playlist.itemCount)}</dd>
							</div>
						{/if}

						{#if loadedPlaylist.publishedAt != null}
							<div>
								<dt>Published</dt>
								<dd>{loadedPlaylist.publishedAt}</dd>
							</div>
						{/if}

						{#if loadedPlaylist.$channel}
							<div>
								<dt>Channel</dt>
								<dd>
									<YouTubeChannelView
										entityId={loadedPlaylist.$channel[EntityMetaKey.Id]}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.YouTubePlaylist}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idKey}:carousel-videos`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({
					open: _summaryOpen,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Playlist items
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({
					open: _markersOpen,
				})}
					<a
						data-scroll-marker-label="Videos"
						href={`#${idKey}:videos`}
					>Videos</a>
				{/snippet}

				{#snippet body({ open: _sectionOpen })}
					<section data-scroll-marker-label="Videos">
						<YouTubeVideosView
							href={resolve('/youtube/videos')}
							entityFieldReference={{
								entityType: EntityType.YouTubePlaylist,
								entityId,
								fieldName: '$$videos',
							}}
							id={`${idKey}:youtube-videos`}
							open={_open}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


