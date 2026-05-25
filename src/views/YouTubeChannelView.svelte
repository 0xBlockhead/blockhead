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


	// State
	let {
		entityId,
		href = resolve('/(social)/(youtube)/youtube/channel/[channelId]', {
			channelId: entityId.channelId,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.YouTubeChannel>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
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
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
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
			{#snippet children(loadedChannel)}
				{loadedChannel.title ?? entityId.channelId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading channel…"
		>
			{#snippet children(loadedChannel)}
				{#if (
					channel.$icon
					&& channel.$icon[EntityMetaKey.Id].url
				)}
					<IconComponent
						shape={IconShape.Circle}
						src={loadedChannel.$icon[EntityMetaKey.Id].url}
						alt=""
					/>
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
						{#snippet children(loadedChannel)}
							{#if loadedChannel.description}
								{loadedChannel.description}
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
							{#snippet children(loadedChannel)}
								{#if loadedChannel.subscriberCount != null}
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
							{#snippet children(loadedChannel)}
								{#if loadedChannel.videoCount != null}
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
							{#snippet children(loadedChannel)}
								{#if loadedChannel.viewCount != null}
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
							{#snippet children(loadedChannel)}
								{#if loadedChannel.publishedAt != null}
									{loadedChannel.publishedAt}
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
							{#snippet children(loadedChannel)}
								{#if loadedChannel.customUrl}
									{loadedChannel.customUrl}
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
				sectionIdPrefix={idKey}
				sections={[
					{ id: 'videos', label: 'Videos' },
					{ id: 'playlists', label: 'Playlists' },
				]}
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

				{#snippet SectionVideos({ id, label })}
					<YouTubeVideosView
						href={resolve('/youtube/videos')}
						entityFieldReference={{
							entityType: EntityType.YouTubeChannel,
							entityId,
							fieldName: '$$videos',
						}}
						id={`${idKey}:youtube-videos`}
						open={_open}
					/>
				{/snippet}

				{#snippet SectionPlaylists({ id, label })}
					<YouTubePlaylistsView
						href={resolve('/youtube/playlists')}
						entityFieldReference={{
							entityType: EntityType.YouTubeChannel,
							entityId,
							fieldName: '$$playlists',
						}}
						id={`${idKey}:youtube-playlists`}
						open={_open}
					/>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

