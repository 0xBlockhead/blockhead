<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.YoutubeChannel>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.YoutubeChannel>>
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

	const youtubeChannel = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.Piped_Rest,
		],
		fields: {
			$icon: true,
			title: true,
			description: true,
			customUrl: true,
			publishedAtMs: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).title) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.channelId) ?? '')].filter(Boolean).join(' ') || 'YouTube channel')
	const viewDomId = $derived('youtube-channel-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import YoutubeVideosView from '$/views/YoutubeVideosView.svelte'
	import YoutubePlaylistsView from '$/views/YoutubePlaylistsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.YoutubeChannel}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={youtubeChannel}>
			{#snippet Pending()}
				<IconComponent />
			{/snippet}

			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference?.[EntityMetaKey.Selector] !== undefined}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.channelId) ?? '')].filter(Boolean).join(' ') || 'YouTube channel'}
		{:else}
			<ResourceBoundary resource={youtubeChannel}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.channelId) ?? '')].filter(Boolean).join(' ') || 'YouTube channel'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.title) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary resource={youtubeChannel}>
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
				<ResourceBoundary resource={youtubeChannel}>
					{#snippet Pending()}
						{@const customUrl = prefetched.customUrl ?? selection.entitySelector.customUrl}
						{#if customUrl !== undefined && customUrl !== null}
							<div>
								<dt>Handle alias</dt>
								<dd>
									<TruncatedValue value={String(customUrl)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const customUrl = entity.customUrl ?? selection.entitySelector.customUrl ?? prefetched.customUrl}
						{#if customUrl !== undefined && customUrl !== null}
							<div>
								<dt>Handle alias</dt>
								<dd>
									<TruncatedValue value={String(customUrl)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={youtubeChannel}>
					{#snippet Pending()}
						{@const publishedAtMs = prefetched.publishedAtMs ?? selection.entitySelector.publishedAtMs}
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
						{@const publishedAtMs = entity.publishedAtMs ?? selection.entitySelector.publishedAtMs ?? prefetched.publishedAtMs}
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

			<YoutubePlaylistsView
				selection={selection[EntityProxyField]<EntityType.YoutubePlaylist>('$$playlists')}
				title='Playlists'
				href={resolve('/(social)/(youtube)/youtube/playlists')}
				id='YoutubePlaylistsView-$$playlists'
			/>
		{/if}
	{/snippet}
</EntityView>
