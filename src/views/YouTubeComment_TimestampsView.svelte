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
		title = 'YouTube comment observations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading YouTube comment observations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'YoutubeComment_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.YoutubeComment_Timestamp>
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
	import YoutubeComment_TimestampView from '$/views/YoutubeComment_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					$comment: true,
					timestampMs: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubeComment_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(youtubeCommentTimestamps)}
			{@const uniqueYoutubeCommentTimestamps = [...new Map(youtubeCommentTimestamps.values.map((youtubeCommentTimestamp) => [youtubeCommentTimestamp[EntityMetaKey.SelectorKey], youtubeCommentTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.YoutubeComment_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={youtubeCommentTimestamps.values.length === uniqueYoutubeCommentTimestamps.length && youtubeCommentTimestamps.totalCount != null && youtubeCommentTimestamps.totalCount >= uniqueYoutubeCommentTimestamps.length ? youtubeCommentTimestamps.totalCount : uniqueYoutubeCommentTimestamps.length}
				getKey={(youtubeCommentTimestamp) => youtubeCommentTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueYoutubeCommentTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No YouTube comment observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: youtubeCommentTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.YoutubeComment_Timestamp> })}
					<YoutubeComment_TimestampView
						href={
							resolve('/(social)/(youtube)/youtube/comment/[videoId]/[commentId]/observations/[timestampMs]', {
								videoId: String(youtubeCommentTimestamp.entitySelector.$comment.videoId),
								commentId: String(youtubeCommentTimestamp.entitySelector.$comment.commentId),
								timestampMs: String(youtubeCommentTimestamp.entitySelector.timestampMs),
							})
						}
						selection={select(EntityType.YoutubeComment_Timestamp, youtubeCommentTimestamp.entitySelector)}
						prefetched={youtubeCommentTimestamp}
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
		entityType={EntityType.YoutubeComment_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
