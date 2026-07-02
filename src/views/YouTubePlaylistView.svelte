<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const youtubePlaylist = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.Piped_Rest,
		],
		fields: {
			title: true,
			publishedAtMs: true,
			description: true,
			...(open && {
				$$videos: true,
				$channel: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).title) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.playlistId) ?? '')].filter(Boolean).join(' ') || 'YouTube playlist')
	const viewDomId = $derived('youtube-playlist-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import YoutubeVideosView from '$/views/YoutubeVideosView.svelte'
	import YoutubeChannelView from '$/views/YoutubeChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.YoutubePlaylist}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.playlistId) ?? '')].filter(Boolean).join(' ') || 'YouTube playlist'}
		{:else}
			<ResourceBoundary resource={youtubePlaylist}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.playlistId) ?? '')].filter(Boolean).join(' ') || 'YouTube playlist'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.title) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const publishedAtMs0 = prefetched.publishedAtMs}
			{#if publishedAtMs0 !== undefined && publishedAtMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(publishedAtMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={youtubePlaylist}>
				{#snippet Pending()}
					{@const publishedAtMs0 = prefetched.publishedAtMs}
					{#if publishedAtMs0 !== undefined && publishedAtMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(publishedAtMs0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const publishedAtMs0 = entity.publishedAtMs}
					{#if publishedAtMs0 !== undefined && publishedAtMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(publishedAtMs0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary resource={youtubePlaylist}>
					{#snippet Pending()}
						{@const description = prefetched.description ?? selection.entitySelector.description}
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
						{@const description = entity.description ?? selection.entitySelector.description ?? prefetched.description}
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

			{#if contentOpen}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.YoutubeChannel, false>('$channel')}
				>
					{#snippet children(youtubeChannel)}
						{#if youtubeChannel != null}
							<div>
								<dt>Channel</dt>
								<dd>
									<YoutubeChannelView
										selection={select(EntityType.YoutubeChannel, youtubeChannel.entitySelector)}
										prefetched={youtubeChannel}
										layout={EntityLayout.Title}
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
				selection={selection[EntityProxyField]<EntityType.YoutubeVideo>('$$videos')}
				title='Videos'
				href={resolve('/(social)/(youtube)/youtube/videos')}
				id='YoutubeVideosView-$$videos'
			/>
		{/if}
	{/snippet}
</EntityView>
