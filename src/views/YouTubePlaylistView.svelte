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
			publishedAtMs: {},
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
	import Timestamp from '$/components/Timestamp.svelte'
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
			{#if open}
				<ResourceBoundary
					resource={playlist}
					placeholderText="Loading playlist…"
				>
					{#snippet children(playlist)}
						{#if playlist.description}
							<div>
								<dt>Description</dt>
								<dd>{playlist.description}</dd>
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
					{#snippet children(playlist)}
						{#if playlist.itemCount != null}
							<div>
								<dt>Items</dt>
								<dd>{String(playlist.itemCount)}</dd>
							</div>
						{/if}

						{#if playlist.publishedAtMs != null}
							<div>
								<dt>Published</dt>
								<dd><Timestamp timestamp={playlist.publishedAtMs} /></dd>
							</div>
						{:else if playlist.publishedAt != null}
							<div>
								<dt>Published</dt>
								<dd>{playlist.publishedAt}</dd>
							</div>
						{/if}

						{#if playlist.$channel}
							<div>
								<dt>Channel</dt>
								<dd>
									<YouTubeChannelView
										entityId={playlist.$channel[EntityMetaKey.Id]}
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
				sections={[
					{ id: 'videos', label: 'Videos' },
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
							Playlist items
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionVideos({ id, label })}
					<YouTubeVideosView
						CollapsibleProps={{ canToggle: false }}
						href={resolve('/youtube/videos')}
						entityFieldReference={{
							entityType: EntityType.YouTubePlaylist,
							entityId,
							fieldName: '$$videos',
						}}
						id={`${idKey}:youtube-videos`}
						open={_open}
					/>
				{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
