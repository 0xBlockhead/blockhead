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


	// Context
	import { select } from '$/routes/+layout.svelte'


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
			selection: EntityProxyResource<typeof schema, EntityType.YoutubePlaylist>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.YoutubePlaylist>>
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
	const youtubePlaylist = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			title: true,
			publishedAtMs: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.title) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.playlistId) ?? '')].filter(Boolean).join(' ') || 'YouTube playlist')
	const viewDomId = $derived('youtube-playlist-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import YoutubeVideosView from '$/views/YoutubeVideosView.svelte'
	import YoutubeChannelView from '$/views/YoutubeChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.YoutubePlaylist}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={youtubePlaylist}>
			{#snippet Pending()}
				{[String((pendingEntity.title) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.playlistId) ?? '')].filter(Boolean).join(' ') || 'YouTube playlist'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.title) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={youtubePlaylist}>
			{#snippet Pending()}
				{@const publishedAtMs0 = pendingEntity.publishedAtMs}
				{#if publishedAtMs0 !== undefined && publishedAtMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(publishedAtMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const publishedAtMs0 = resolvedEntity.publishedAtMs}
				{#if publishedAtMs0 !== undefined && publishedAtMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(publishedAtMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								description: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const description = pendingEntity.description}
						{#if description !== undefined && description !== null}
							<div>
								<dt>Description</dt>
								<dd>
									<span data-text="long-text">{String((description) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const description = resolvedEntity.description}
						{#if description !== undefined && description !== null}
							<div>
								<dt>Description</dt>
								<dd>
									<span data-text="long-text">{String((description) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			<div>
				<dt>Playlist ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									playlistId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const playlistId = pendingEntity.playlistId}
							{#if playlistId !== undefined && playlistId !== null}
								<TruncatedValue value={String((playlistId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const playlistId = resolvedEntity.playlistId}
							{#if playlistId !== undefined && playlistId !== null}
								<TruncatedValue value={String((playlistId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								publishedAtMs: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const publishedAtMs = pendingEntity.publishedAtMs}
						{#if publishedAtMs !== undefined && publishedAtMs !== null}
							<div>
								<dt>Published</dt>
								<dd>
									<Timestamp timestamp={Number(publishedAtMs)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const publishedAtMs = resolvedEntity.publishedAtMs}
						{#if publishedAtMs !== undefined && publishedAtMs !== null}
							<div>
								<dt>Published</dt>
								<dd>
									<Timestamp timestamp={Number(publishedAtMs)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$channel}
				>
					{#snippet Pending()}{/snippet}

					{#snippet children(youtubeChannel)}
						{#if youtubeChannel != null && youtubeChannel[EntityMetaKey.Selector] != null}
							<div>
								<dt>Channel</dt>
								<dd>
									<YoutubeChannelView
										selection={select(EntityType.YoutubeChannel, youtubeChannel[EntityMetaKey.Selector])}
										prefetched={youtubeChannel}
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

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<YoutubeVideosView
				selection={
						selection.$$videos({
							sources: [
								Source.Constants_Internal,
								Source.Youtube_Rest,
								Source.Piped_Rest,
							],
							count: true,
						})
					}
				title='Videos'
				href={resolve('/youtube/videos')}
				id='YoutubeVideosView-videos'
			/>
		{/if}
	{/snippet}
</EntityView>
