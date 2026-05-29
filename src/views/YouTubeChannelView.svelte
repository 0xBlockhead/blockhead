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
			publishedAtMs: {},
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
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
				{#if (
					channel.$icon
					&& channel.$icon[EntityMetaKey.Id].url
				)}
					<IconComponent
						shape={IconShape.Circle}
						src={channel.$icon[EntityMetaKey.Id].url}
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
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading channel…"
		>
			{#snippet children(channel)}
				{#if channel.description}
					<p>
						<TruncatedValue
							value={channel.description}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">
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
								{#if channel.publishedAtMs != null}
									<Timestamp timestamp={channel.publishedAtMs} />
								{:else if channel.publishedAt != null}
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
		<CollapsibleTabs
				id={`${idKey}:carousel-channel`}
				sectionIdPrefix={idKey}
				sections={[
					{ id: 'videos', label: 'Videos' },
					{ id: 'playlists', label: 'Playlists' },
				]}
				data-card
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
						CollapsibleProps={{ canToggle: false }}
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
						CollapsibleProps={{ canToggle: false }}
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
	{/snippet}
</EntityView>
