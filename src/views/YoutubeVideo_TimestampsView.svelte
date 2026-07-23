<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
		title = 'YouTube video observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubeVideo_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.YoutubeVideo_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.YoutubeVideo_Timestamp}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				$video: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(youtubeVideoTimestamps) => [...new Map(youtubeVideoTimestamps.values.map((youtubeVideoTimestamp) => [youtubeVideoTimestamp[EntityMetaKey.SelectorKey], youtubeVideoTimestamp])).values()]}
	getKey={(youtubeVideoTimestamp) => youtubeVideoTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No YouTube video observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: youtubeVideoTimestamp })}
		{@const youtubeVideoTimestampFields = { ...youtubeVideoTimestamp[EntityMetaKey.Selector], ...youtubeVideoTimestamp }}
		<EntityView
			entityType={EntityType.YoutubeVideo_Timestamp}
			entitySelector={youtubeVideoTimestamp[EntityMetaKey.Selector]}
			href={
				(
					youtubeVideoTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in youtubeVideoTimestamp[EntityMetaKey.Selector]
					&& youtubeVideoTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& youtubeVideoTimestamp[EntityMetaKey.Selector] != null && 'source' in youtubeVideoTimestamp[EntityMetaKey.Selector]
					&& youtubeVideoTimestamp[EntityMetaKey.Selector].source != null
					&& youtubeVideoTimestamp[EntityMetaKey.Selector] != null && '$video' in youtubeVideoTimestamp[EntityMetaKey.Selector]
					&& youtubeVideoTimestamp[EntityMetaKey.Selector].$video != null && 'videoId' in youtubeVideoTimestamp[EntityMetaKey.Selector].$video
					&& youtubeVideoTimestamp[EntityMetaKey.Selector].$video.videoId != null ?
						resolve('/youtube/video/[videoId=stringSegment]/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', {
					timestampMs: String(youtubeVideoTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(youtubeVideoTimestamp[EntityMetaKey.Selector].source ?? ''),
					videoId: encodeURIComponent(String(youtubeVideoTimestamp[EntityMetaKey.Selector].$video.videoId ?? '')),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((youtubeVideoTimestampFields.$video.title) ?? '')].filter(Boolean).join(' ') || [String((youtubeVideoTimestampFields.$video.videoId) ?? '')].filter(Boolean).join(' ') || 'YouTube video', String((youtubeVideoTimestampFields.timestampMs) ?? ''), String((youtubeVideoTimestampFields.source) ?? '')].filter(Boolean).join(' ') || 'YouTube video observation'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
