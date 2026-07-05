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


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Blockhead intent quotes',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadIntentQuotes-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadIntentQuote>
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
	import BlockheadIntentQuoteView from '$/views/BlockheadIntentQuoteView.svelte'
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
					providerProtocol: true,
					source: true,
					requestedAt: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(blockheadIntentQuotes)}
			{@const uniqueBlockheadIntentQuotes = [...new Map(blockheadIntentQuotes.values.map((blockheadIntentQuote) => [blockheadIntentQuote[EntityMetaKey.SelectorKey], blockheadIntentQuote])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadIntentQuote}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadIntentQuotes.totalCount}
				getKey={(blockheadIntentQuote) => blockheadIntentQuote[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadIntentQuotes}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead intent quotes yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadIntentQuote }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadIntentQuote> })}
					{@const blockheadIntentQuoteFields = { ...blockheadIntentQuote[EntityMetaKey.Selector], ...blockheadIntentQuote }}
					<BlockheadIntentQuoteView
						selection={select(EntityType.BlockheadIntentQuote, blockheadIntentQuote[EntityMetaKey.Selector])}
						prefetched={blockheadIntentQuoteFields}
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
		entityType={EntityType.BlockheadIntentQuote}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
