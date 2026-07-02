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
		title = 'Reddit submissions',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Reddit submissions...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'RedditLinks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.RedditLink>
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
					title: true,
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
				entityType={EntityType.RedditLink}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(redditLinks)}
			{@const uniqueRedditLinks = [...new Map(redditLinks.values.map((redditLink) => [redditLink[EntityMetaKey.SelectorKey], redditLink])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.RedditLink}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={redditLinks.values.length === uniqueRedditLinks.length && redditLinks.totalCount != null && redditLinks.totalCount >= uniqueRedditLinks.length ? redditLinks.totalCount : uniqueRedditLinks.length}
				getKey={(redditLink) => redditLink[EntityMetaKey.SelectorKey]}
				items={uniqueRedditLinks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Reddit submissions yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: redditLink }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.RedditLink> })}
					<EntityView
						entityType={EntityType.RedditLink}
						entitySelector={redditLink.entitySelector}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const title0 = ({ ...redditLink.entitySelector, ...redditLink }).title}
							{String((title0) ?? '')}
							{@const fullname1 = ({ ...redditLink.entitySelector, ...redditLink }).fullname}
							<TruncatedValue value={String(fullname1)} />
						{/snippet}

						{#snippet HeadingAfter()}
							{@const createdAtAfter0 = ({ ...redditLink.entitySelector, ...redditLink }).createdAt}
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
		entityType={EntityType.RedditLink}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
