<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.YoutubeComment_Timestamp>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import YoutubeComment_TimestampView from '$/views/YoutubeComment_TimestampView.svelte'
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
		{@const selection = select(EntityType.YoutubeComment_Timestamp, youtubeCommentTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const youtubeCommentTimestampHrefFields = { ...youtubeCommentTimestamp, ...youtubeCommentTimestamp[EntityMetaKey.Selector] }}
		<YoutubeComment_TimestampView
			selection={selection}
			prefetched={youtubeCommentTimestampFields}
			href={
				(youtubeCommentTimestampHrefFields.timestampMs !== undefined && youtubeCommentTimestampHrefFields.source !== undefined && youtubeCommentTimestampHrefFields.$comment !== undefined && youtubeCommentTimestampHrefFields.$comment.videoId !== undefined && youtubeCommentTimestampHrefFields.$comment.commentId !== undefined ? resolve('/youtube/comment/[videoId=stringSegment]/[commentId=stringSegment]/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', {
					timestampMs: String(youtubeCommentTimestampHrefFields.timestampMs ?? ''),
					source: String(youtubeCommentTimestampHrefFields.source ?? ''),
					videoId: encodeURIComponent(String(youtubeCommentTimestampHrefFields.$comment.videoId ?? '')),
					commentId: encodeURIComponent(String(youtubeCommentTimestampHrefFields.$comment.commentId ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
