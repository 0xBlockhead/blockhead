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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.RedditComment_Timestamp>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.RedditComment_Timestamp}
			entitySelector={redditCommentTimestamp[EntityMetaKey.Selector]}
			href={
				(
					redditCommentTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in redditCommentTimestamp[EntityMetaKey.Selector]
					&& redditCommentTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& redditCommentTimestamp[EntityMetaKey.Selector] != null && 'source' in redditCommentTimestamp[EntityMetaKey.Selector]
					&& redditCommentTimestamp[EntityMetaKey.Selector].source != null
					&& redditCommentTimestamp[EntityMetaKey.Selector] != null && '$comment' in redditCommentTimestamp[EntityMetaKey.Selector]
					&& redditCommentTimestamp[EntityMetaKey.Selector].$comment != null && 'fullname' in redditCommentTimestamp[EntityMetaKey.Selector].$comment
					&& redditCommentTimestamp[EntityMetaKey.Selector].$comment.fullname != null ?
						resolve('/reddit/comment/[fullname=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(redditCommentTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
					source: String(redditCommentTimestamp[EntityMetaKey.Selector].source ?? ''),
					fullname: encodeURIComponent(String(redditCommentTimestamp[EntityMetaKey.Selector].$comment.fullname ?? '')),
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
				{[String((redditCommentTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Reddit comment timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((redditCommentTimestampFields.score) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((redditCommentTimestampFields.source) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
