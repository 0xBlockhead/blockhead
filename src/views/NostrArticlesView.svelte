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


	// State
	let {
		selection,
		title = 'Nostr articles',
		typeAnnotationParagraphs = ['A Nostr long-form article is a replaceable kind-30023 event addressed by author public key and identifier.'],
		placeholderText = 'Loading Nostr articles...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrArticles-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.NostrArticle>
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
				fields: {
					identifier: true,
					pubkey: true,
					kind: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.NostrArticle}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(nostrArticles)}
			{@const uniqueNostrArticles = [...new Map(nostrArticles.values.map((nostrArticle) => [nostrArticle[EntityMetaKey.SelectorKey], nostrArticle])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.NostrArticle}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={nostrArticles.values.length === uniqueNostrArticles.length && nostrArticles.totalCount != null && nostrArticles.totalCount >= uniqueNostrArticles.length ? nostrArticles.totalCount : uniqueNostrArticles.length}
				getKey={(nostrArticle) => nostrArticle[EntityMetaKey.SelectorKey]}
				items={uniqueNostrArticles}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Nostr articles yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: nostrArticle }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.NostrArticle> })}
					<EntityView
						entityType={EntityType.NostrArticle}
						entitySelector={nostrArticle.entitySelector}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const identifier0 = ({ ...nostrArticle.entitySelector, ...nostrArticle }).identifier}
							{String((identifier0) ?? '')}
							{@const pubkey1 = ({ ...nostrArticle.entitySelector, ...nostrArticle }).pubkey}
							<TruncatedValue value={String(pubkey1)} />
						{/snippet}

						{#snippet HeadingAfter()}
							{@const kindAfter0 = ({ ...nostrArticle.entitySelector, ...nostrArticle }).kind}
							{#if kindAfter0 != null}
								<span data-text="muted">
									kind
									<span>kind </span>
									{String((kindAfter0) ?? '')}
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
		entityType={EntityType.NostrArticle}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
