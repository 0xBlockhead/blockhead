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
		title = 'AT Protocol posts',
		typeAnnotationParagraphs = ['A Bluesky feed post record addressed by an at-URI inside an actor repository. Text, author, reply edges, labels, languages, and engagement counts resolve through appview sources.'],
		placeholderText = 'Loading AT Protocol posts...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AtprotoPosts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AtprotoPost>
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
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
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
					text: true,
					uri: true,
					createdAt: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AtprotoPost}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(atprotoPosts)}
			{@const uniqueAtprotoPosts = [...new Map(atprotoPosts.values.map((atprotoPost) => [atprotoPost[EntityMetaKey.SelectorKey], atprotoPost])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.AtprotoPost}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={atprotoPosts.values.length === uniqueAtprotoPosts.length && atprotoPosts.totalCount != null && atprotoPosts.totalCount >= uniqueAtprotoPosts.length ? atprotoPosts.totalCount : uniqueAtprotoPosts.length}
				getKey={(atprotoPost) => atprotoPost[EntityMetaKey.SelectorKey]}
				items={uniqueAtprotoPosts}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No AT Protocol posts yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: atprotoPost }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.AtprotoPost> })}
					<AtprotoPostView
						href={
							resolve('/(social)/(atproto)/atproto/post/[...uri]', {
								uri: String(atprotoPost.entitySelector.uri),
							})
						}
						selection={select(EntityType.AtprotoPost, atprotoPost.entitySelector)}
						prefetched={atprotoPost}
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
		entityType={EntityType.AtprotoPost}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
