<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.YouTubePlaylist>
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'layout'
			| 'title'
			| 'Details'
			| 'Icon'
			| 'Content'
		>
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
	{href}
	{layout}
	bind:open
	{...entityViewRest}
>
	{#snippet Value()}
		<span>
			{entityId.playlistId}
		</span>
	{/snippet}

		{Title()}
		<ResourceBoundary
			resource={playlist}
			placeholderText="Loading playlist…"
		>
			{#snippet children(playlist)}
				{playlist.title ?? entityId.playlistId}
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
			<div>
				<dt>Description</dt>
				<dd>
					<ResourceBoundary
						resource={playlist}
						placeholderText="Loading playlist…"
					>
						{#snippet children(playlist)}
							{#if playlist.description}
								{playlist.description}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			{#if open}
				<div>
					<dt>Items</dt>
					<dd>
						<ResourceBoundary
							resource={playlist}
							placeholderText="Loading playlist…"
						>
							{#snippet children(playlist)}
								{#if playlist.itemCount != null}
									{String(playlist.itemCount)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Published</dt>
					<dd>
						<ResourceBoundary
							resource={playlist}
							placeholderText="Loading playlist…"
						>
							{#snippet children(playlist)}
								{#if playlist.publishedAt != null}
									{playlist.publishedAt}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Channel</dt>
					<dd>
						<ResourceBoundary
							resource={playlist}
							placeholderText="Loading playlist…"
						>
							{#snippet children(playlist)}
								{#if playlist.$channel}
									<YouTubeChannelView
										entityId={playlist.$channel[EntityMetaKey.Id]}
										href={resolve(
											'/(social)/(youtube)/youtube/channel/[channelId]',
											{
												channelId: encodeURIComponent(
													playlist.$channel[EntityMetaKey.Id].channelId,
													),
											},
										)}
										layout={EntityLayout.Value}
										open={false}
										showTypeAnnotation={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
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
							entityFieldReference={{
								entityType: EntityType.YouTubePlaylist,
								entityId,
								fieldName: '$$videos',
							}}
							href={resolve('/(social)/(youtube)/youtube/playlist/[playlistId]/(playlist)/videos', {
								playlistId: encodeURIComponent(entityId.playlistId),
							})}
							id={`${idKey}:youtube-videos`}
							open={_open}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
