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
		title = 'YouTube comment observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubeComment_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.YoutubeComment_Timestamp>
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
	entityType={EntityType.YoutubeComment_Timestamp}
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
				$comment: true,
				timestampMs: true,
				source: true,
			},
		})
	}
	{countResource}
	getResourceItems={(youtubeCommentTimestamps) => [...new Map(youtubeCommentTimestamps.values.map((youtubeCommentTimestamp) => [youtubeCommentTimestamp[EntityMetaKey.SelectorKey], youtubeCommentTimestamp])).values()]}
	getKey={(youtubeCommentTimestamp) => youtubeCommentTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No YouTube comment observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: youtubeCommentTimestamp })}
		{@const youtubeCommentTimestampFields = { ...youtubeCommentTimestamp[EntityMetaKey.Selector], ...youtubeCommentTimestamp }}
		<EntityView
			entityType={EntityType.YoutubeComment_Timestamp}
			entitySelector={youtubeCommentTimestamp[EntityMetaKey.Selector]}
			href={
				(
					youtubeCommentTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in youtubeCommentTimestamp[EntityMetaKey.Selector]
					&& youtubeCommentTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& youtubeCommentTimestamp[EntityMetaKey.Selector] != null && 'source' in youtubeCommentTimestamp[EntityMetaKey.Selector]
					&& youtubeCommentTimestamp[EntityMetaKey.Selector].source != null
					&& youtubeCommentTimestamp[EntityMetaKey.Selector] != null && '$comment' in youtubeCommentTimestamp[EntityMetaKey.Selector]
					&& youtubeCommentTimestamp[EntityMetaKey.Selector].$comment != null && 'videoId' in youtubeCommentTimestamp[EntityMetaKey.Selector].$comment
					&& youtubeCommentTimestamp[EntityMetaKey.Selector].$comment.videoId != null
					&& youtubeCommentTimestamp[EntityMetaKey.Selector].$comment != null && 'commentId' in youtubeCommentTimestamp[EntityMetaKey.Selector].$comment
					&& youtubeCommentTimestamp[EntityMetaKey.Selector].$comment.commentId != null ?
						resolve('/youtube/comment/[videoId=stringSegment]/[commentId=stringSegment]/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', {
					timestampMs: String(youtubeCommentTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(youtubeCommentTimestamp[EntityMetaKey.Selector].source ?? ''),
					videoId: encodeURIComponent(String(youtubeCommentTimestamp[EntityMetaKey.Selector].$comment.videoId ?? '')),
					commentId: encodeURIComponent(String(youtubeCommentTimestamp[EntityMetaKey.Selector].$comment.commentId ?? '')),
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
				{[[String((youtubeCommentTimestampFields.$comment.text) ?? '')].filter(Boolean).join(' ') || 'YouTube comment', String((youtubeCommentTimestampFields.timestampMs) ?? ''), String((youtubeCommentTimestampFields.source) ?? '')].filter(Boolean).join(' ') || 'YouTube comment observation'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
