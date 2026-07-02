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
		title = 'Reddit subreddits',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Reddit subreddits...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RedditSubreddits-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.RedditSubreddit>
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
					title: true,
					name: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RedditSubreddit}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(redditSubreddits)}
			{@const uniqueRedditSubreddits = [...new Map(redditSubreddits.values.map((redditSubreddit) => [redditSubreddit[EntityMetaKey.SelectorKey], redditSubreddit])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RedditSubreddit}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={redditSubreddits.values.length === uniqueRedditSubreddits.length && redditSubreddits.totalCount != null && redditSubreddits.totalCount >= uniqueRedditSubreddits.length ? redditSubreddits.totalCount : uniqueRedditSubreddits.length}
				getKey={(redditSubreddit) => redditSubreddit[EntityMetaKey.SelectorKey]}
				items={uniqueRedditSubreddits}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Reddit subreddits yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: redditSubreddit }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.RedditSubreddit> })}
					<EntityView
						entityType={EntityType.RedditSubreddit}
						entitySelector={redditSubreddit.entitySelector}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const title0 = ({ ...redditSubreddit.entitySelector, ...redditSubreddit }).title}
							{String((title0) ?? '')}
							{@const name1 = ({ ...redditSubreddit.entitySelector, ...redditSubreddit }).name}
							r/
							<span>r/</span>
							{String((name1) ?? '')}
						{/snippet}
					</EntityView>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.RedditSubreddit}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
