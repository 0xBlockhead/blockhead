<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'YouTube Videos',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubeVideos-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.YoutubeVideo>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import YoutubeVideoView from '$/views/YoutubeVideoView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					title: true,
					videoId: true,
					publishedAtMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubeVideo}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(youtubeVideos)}
			{@const uniqueYoutubeVideos = [...new Map(youtubeVideos.values.map((youtubeVideo) => [youtubeVideo[EntityMetaKey.SelectorKey], youtubeVideo])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubeVideo}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={youtubeVideos.totalCount}
				getKey={(youtubeVideo) => youtubeVideo[EntityMetaKey.SelectorKey]}
				items={uniqueYoutubeVideos}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No YouTube Videos yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: youtubeVideo }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.YoutubeVideo> })}
					{@const youtubeVideoFields = { ...youtubeVideo[EntityMetaKey.Selector], ...youtubeVideo }}
					{@const youtubeVideoHrefFields = { ...youtubeVideo, ...youtubeVideo[EntityMetaKey.Selector] }}
					<YoutubeVideoView
						selection={select(EntityType.YoutubeVideo, youtubeVideo[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={youtubeVideoFields}
						href={
							(youtubeVideoHrefFields.videoId !== undefined ? resolve('/(social)/(youtube)/youtube/video/[videoId]', {
								videoId: encodeURIComponent(String(youtubeVideoHrefFields.videoId ?? '')),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.YoutubeVideo}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
