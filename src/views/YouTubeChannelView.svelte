<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(social)/(youtube)/youtube/channel/[channelId]', {
			channelId: selector.channelId,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.YouTubeChannel>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const channel = subscribe(EntityType.YouTubeChannel,
		selector,
		({ sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			], fields: { title: true, description: true, subscriberCount: true, videoCount: true, viewCount: true, $$timestamps: ({ sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				], limit: 1 }), publishedAt: true, publishedAtMs: true, customUrl: true, $icon: true, ...(open ? ({ $$videos: ({ sources: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						] }), $$playlists: ({ sources: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						] }) }) : ({  })) } }),
	)

	const idKey = stringify(selector)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
	import YouTubeChannel_TimestampsView from '$/views/YouTubeChannel_TimestampsView.svelte'
	import YouTubePlaylistsView from '$/views/YouTubePlaylistsView.svelte'
	import YouTubeVideosView from '$/views/YouTubeVideosView.svelte'
</script>


<EntityView
	entityType={EntityType.YouTubeChannel}
	entitySelector={selector}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading channel…"
		>
			{#snippet children(channel)}
				{#if (
					channel.fields.$icon
					&& channel.fields.$icon[EntityMetaKey.Selector].url
				)}
					<IconComponent
						shape={IconShape.Circle}
						src={channel.fields.$icon[EntityMetaKey.Selector].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			{selector.channelId}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading channel…"
		>
			{#snippet children(channel)}
				{channel.fields.title ?? selector.channelId}
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

	{#snippet Content({})}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading channel…"
		>
			{#snippet children(channel)}
				{#if channel.fields.description}
					<p>
						<TruncatedValue
							value={channel.fields.description}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">
			{#if open}
				<ResourceBoundary
					resource={channel}
					placeholderText="Loading channel…"
				>
					{#snippet children(channel)}
						<SocialMetricSnapshotRows
							metrics={[
								{
									label: 'Subscribers',
									value: channel.fields.$$timestamps[0]?.subscriberCount ?? channel.fields.subscriberCount,
								},
								{
									label: 'Videos',
									value: channel.fields.$$timestamps[0]?.videoCount ?? channel.fields.videoCount,
								},
								{
									label: 'Views',
									value: channel.fields.$$timestamps[0]?.viewCount ?? channel.fields.viewCount,
								},
							]}
						/>
					{/snippet}
				</ResourceBoundary>
				<div>
					<dt>Published</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading channel…"
						>
							{#snippet children(channel)}
								{#if channel.fields.publishedAtMs != null}
									<Timestamp timestamp={channel.fields.publishedAtMs} />
								{:else if channel.fields.publishedAt != null}
									{channel.fields.publishedAt}
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
								{#if channel.fields.customUrl}
									{channel.fields.customUrl}
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
				sections={collapsibleTabsSections([
					{ id: 'videos', label: 'Videos' },
					{ id: 'playlists', label: 'Playlists' },
					{ id: 'metric-snapshots', label: 'Metrics' },
				])}
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

			{#snippet SectionVideos()}
				<YouTubeVideosView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.YouTubeChannel,
						selector,
						fieldName: '$$videos',
					}}
					id={`${idKey}:youtube-videos`}
					open={_open}
				/>
			{/snippet}

			{#snippet SectionPlaylists()}
				<YouTubePlaylistsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.YouTubeChannel,
						selector,
						fieldName: '$$playlists',
					}}
					id={`${idKey}:youtube-playlists`}
					open={_open}
				/>
			{/snippet}

			{#snippet SectionMetricSnapshots()}
				<YouTubeChannel_TimestampsView
					entityFieldReference={{
						entityType: EntityType.YouTubeChannel,
						selector,
						fieldName: '$$timestamps',
					}}
					href={href}
					id={`${idKey}:metric-snapshots`}
					title="Metric snapshots"
				/>
			{/snippet}
		</CollapsibleTabs>
		{/snippet}
	</EntityView>
