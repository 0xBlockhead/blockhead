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
			entityId: EntityId<typeof schema, EntityType.YouTubeChannel>
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

	const channel = useEntity(
		EntityType.YouTubeChannel,
		entityId,
		{
			$: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			],
			title: {},
			description: {},
			subscriberCount: {},
			videoCount: {},
			viewCount: {},
			publishedAt: {},
			customUrl: {},
			$icon: {},
			...(open ?
				{
					$$videos: {
						$: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						],
					},
					$$playlists: {
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
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import YouTubePlaylistsView from '$/views/YouTubePlaylistsView.svelte'
	import YouTubeVideosView from '$/views/YouTubeVideosView.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubeChannel}
	{entityId}
	{href}
	{layout}
	bind:open
	{...entityViewRest}
>
	{#snippet Value()}
		<span>
			{entityId.channelId}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading channel…"
		>
			{#snippet children(channel)}
				{channel.title ?? entityId.channelId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading channel…"
		>
			{#snippet children(channel)}
				{#if channel.$icon}
					{#if channel.$icon[EntityMetaKey.Id].url}
						<IconComponent
							shape={IconShape.Circle}
							src={channel.$icon[EntityMetaKey.Id].url}
							alt=""
						/>
					{/if}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Channel ids are opaque UC… publisher keys from the Data API (or Piped); @handles in customUrl are aliases, not the primary id.
		</p>
		<p>
			Not Farcaster FIDs, wallet inboxes, or federated ActivityPub actors.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Description</dt>
				<dd>
					<ResourceBoundary
						resource={channel}
						placeholderText="Loading channel…"
					>
						{#snippet children(channel)}
							{#if channel.description}
								{channel.description}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			{#if open}
				<div>
					<dt>Subscribers</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading channel…"
						>
							{#snippet children(channel)}
								{#if channel.subscriberCount != null}
									{String(channel.subscriberCount)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Videos</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading channel…"
						>
							{#snippet children(channel)}
								{#if channel.videoCount != null}
									{String(channel.videoCount)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Views</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading channel…"
						>
							{#snippet children(channel)}
								{#if channel.viewCount != null}
									{String(channel.viewCount)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Published</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading channel…"
						>
							{#snippet children(channel)}
								{#if channel.publishedAt != null}
									{channel.publishedAt}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Handle</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading channel…"
						>
							{#snippet children(channel)}
								{#if channel.customUrl}
									{channel.customUrl}
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
			entityType={EntityType.YouTubeChannel}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idKey}:carousel-channel`}
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
							Channel library
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
					<a
						data-scroll-marker-label="Playlists"
						href={`#${idKey}:playlists`}
					>Playlists</a>
				{/snippet}

				{#snippet body({ open: _sectionOpen })}
					<section data-scroll-marker-label="Videos">
						<YouTubeVideosView
							entityFieldReference={{
								entityType: EntityType.YouTubeChannel,
								entityId,
								fieldName: '$$videos',
							}}
							href={resolve('/(social)/(youtube)/youtube/channel/[channelId]/(channel)/videos', {
								channelId: encodeURIComponent(entityId.channelId),
							})}
							id={`${idKey}:youtube-videos`}
							open={_open}
						/>
					</section>

					<section data-scroll-marker-label="Playlists">
						<YouTubePlaylistsView
							entityFieldReference={{
								entityType: EntityType.YouTubeChannel,
								entityId,
								fieldName: '$$playlists',
							}}
							href={resolve('/(social)/(youtube)/youtube/channel/[channelId]/(channel)/playlists', {
								channelId: encodeURIComponent(entityId.channelId),
							})}
							id={`${idKey}:youtube-playlists`}
							open={_open}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

