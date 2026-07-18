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
		title = 'Reddit comment observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RedditComment_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.RedditComment_Timestamp>
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
	import RedditComment_TimestampView from '$/views/RedditComment_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RedditComment_Timestamp}
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
				timestampMs: true,
				score: true,
				source: true,
				$comment: true,
			},
		})
	}
	getResourceItems={(redditCommentTimestamps) => [...new Map(redditCommentTimestamps.values.map((redditCommentTimestamp) => [redditCommentTimestamp[EntityMetaKey.SelectorKey], redditCommentTimestamp])).values()]}
	getKey={(redditCommentTimestamp) => redditCommentTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Reddit comment observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: redditCommentTimestamp })}
		{@const redditCommentTimestampFields = { ...redditCommentTimestamp[EntityMetaKey.Selector], ...redditCommentTimestamp }}
		{@const selection = select(EntityType.RedditComment_Timestamp, redditCommentTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const redditCommentTimestampHrefFields = { ...redditCommentTimestamp, ...redditCommentTimestamp[EntityMetaKey.Selector] }}
		<RedditComment_TimestampView
			selection={selection}
			prefetched={redditCommentTimestampFields}
			href={
				(redditCommentTimestampHrefFields.timestampMs !== undefined && redditCommentTimestampHrefFields.source !== undefined && redditCommentTimestampHrefFields.$comment !== undefined && redditCommentTimestampHrefFields.$comment.fullname !== undefined ? resolve('/reddit/comment/[fullname=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(redditCommentTimestampHrefFields.timestampMs ?? ''),
					source: String(redditCommentTimestampHrefFields.source ?? ''),
					fullname: encodeURIComponent(String(redditCommentTimestampHrefFields.$comment.fullname ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
