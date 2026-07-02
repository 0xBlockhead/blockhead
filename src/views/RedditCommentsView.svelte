<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title = 'Reddit comments',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Reddit comments...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RedditComments-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.RedditComment>
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
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					body: true,
					fullname: true,
					createdAt: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RedditComment}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(redditComments)}
			{@const uniqueRedditComments = [...new Map(redditComments.values.map((redditComment) => [redditComment[EntityMetaKey.SelectorKey], redditComment])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RedditComment}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={redditComments.values.length === uniqueRedditComments.length && redditComments.totalCount != null && redditComments.totalCount >= uniqueRedditComments.length ? redditComments.totalCount : uniqueRedditComments.length}
				getKey={(redditComment) => redditComment[EntityMetaKey.SelectorKey]}
				items={uniqueRedditComments}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Reddit comments yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: redditComment }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.RedditComment> })}
					<EntityView
						entityType={EntityType.RedditComment}
						entitySelector={redditComment.entitySelector}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const body0 = ({ ...redditComment.entitySelector, ...redditComment }).body}
							<span data-text="long-text">{String((body0) ?? '')}</span>
							{@const fullname1 = ({ ...redditComment.entitySelector, ...redditComment }).fullname}
							<TruncatedValue value={String(fullname1)} />
						{/snippet}

						{#snippet HeadingAfter()}
							{@const createdAtAfter0 = ({ ...redditComment.entitySelector, ...redditComment }).createdAt}
							{#if createdAtAfter0 != null}
								<span data-text="muted">
									<Timestamp timestamp={Number(createdAtAfter0)} />
								</span>
							{/if}
						{/snippet}
					</EntityView>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.RedditComment}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
