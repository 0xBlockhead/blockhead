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


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Reddit comment observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RedditComment_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.RedditComment_Timestamp>
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
	import RedditComment_TimestampView from '$/views/RedditComment_TimestampView.svelte'
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
				fields: {
					timestampMs: true,
					score: true,
					source: true,
					$comment: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(redditCommentTimestamps)}
			{@const uniqueRedditCommentTimestamps = [...new Map(redditCommentTimestamps.values.map((redditCommentTimestamp) => [redditCommentTimestamp[EntityMetaKey.SelectorKey], redditCommentTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RedditComment_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={redditCommentTimestamps.totalCount}
				getKey={(redditCommentTimestamp) => redditCommentTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueRedditCommentTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Reddit comment observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: redditCommentTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.RedditComment_Timestamp> })}
					{@const redditCommentTimestampFields = { ...redditCommentTimestamp[EntityMetaKey.Selector], ...redditCommentTimestamp }}
					{@const redditCommentTimestampHrefFields = { ...redditCommentTimestamp, ...redditCommentTimestamp[EntityMetaKey.Selector] }}
					<RedditComment_TimestampView
						selection={select(EntityType.RedditComment_Timestamp, redditCommentTimestamp[EntityMetaKey.Selector])}
						prefetched={redditCommentTimestampFields}
						href={
							(redditCommentTimestampHrefFields.$comment !== undefined && redditCommentTimestampHrefFields.$comment.fullname !== undefined && redditCommentTimestampHrefFields.timestampMs !== undefined && redditCommentTimestampHrefFields.source !== undefined ? resolve('/(social)/(reddit)/reddit/comment/[fullname]/(comment)/observations/[timestampMs=nonNegativeInteger]/[source]', {
								fullname: String(redditCommentTimestampHrefFields.$comment.fullname ?? ''),
								timestampMs: String(redditCommentTimestampHrefFields.timestampMs ?? ''),
								source: String(redditCommentTimestampHrefFields.source ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.RedditComment_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
