<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { resolve } from '$app/paths'


	// State
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

	const playlist = useEntity(entityCollectionsContext, EntityType.YouTubePlaylist,
		entityId,
		({ sources: [
				Source.Youtube_Rest,
				Source.Piped_Rest,
			], fields: { title: true, description: true, itemCount: true, $$timestamps: ({ sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
				], limit: 1 }), publishedAt: true, publishedAtMs: true, $channel: true, ...(open ? ({ $$videos: ({ sources: [
							Source.Youtube_Rest,
							Source.Piped_Rest,
						] }) }) : ({  })) } }),
	)

	const idKey = stringify(entityId)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
	import YouTubeChannelView from '$/views/YouTubeChannelView.svelte'
	import YouTubePlaylist_TimestampsView from '$/views/YouTubePlaylist_TimestampsView.svelte'
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
			{#snippet children(playlist)}
				{playlist.fields.title ?? entityId.playlistId}
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

	{#snippet Content({})}
		{#if open}
			<ResourceBoundary
				resource={playlist}
				placeholderText="Loading playlist…"
			>
				{#snippet children(playlist)}
					{#if playlist.fields.description}
						<p>
							<TruncatedValue
								value={playlist.fields.description}
								format={TruncatedValueFormat.Visual}
							/>
						</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}

		<dl data-column-item="center">
			{#if open}
				<ResourceBoundary
					resource={playlist}
					placeholderText="Loading playlist…"
				>
					{#snippet children(playlist)}
						<SocialMetricSnapshotRows
							metrics={[
								{
									label: 'Items',
									value: playlist.fields.$$timestamps[0]?.itemCount ?? playlist.fields.itemCount,
								},
							]}
						/>

						{#if playlist.fields.publishedAtMs != null}
							<div>
								<dt>Published</dt>
								<dd><Timestamp timestamp={playlist.fields.publishedAtMs} /></dd>
							</div>
						{:else if playlist.fields.publishedAt != null}
							<div>
								<dt>Published</dt>
								<dd>{playlist.fields.publishedAt}</dd>
							</div>
						{/if}

						{#if playlist.fields.$channel}
							<div>
								<dt>Channel</dt>
								<dd>
									<YouTubeChannelView
										entityId={playlist.fields.$channel[EntityMetaKey.Id]}
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
		<CollapsibleTabs
			id={`${idKey}:carousel-videos`}
			sectionIdPrefix={idKey}
			sections={collapsibleTabsSections([
				{ id: 'videos', label: 'Videos' },
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
						Playlist items
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionVideos()}
				<YouTubeVideosView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.YouTubePlaylist,
						entityId,
						fieldName: '$$videos',
					}}
					id={`${idKey}:youtube-videos`}
					open={_open}
				/>
			{/snippet}

			{#snippet SectionMetricSnapshots()}
				<YouTubePlaylist_TimestampsView
					entityFieldReference={{
						entityType: EntityType.YouTubePlaylist,
						entityId,
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
