<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
		title = 'Blockhead Cashu mint quotes',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCashuMintQuotes-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadCashuMintQuote>
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
	entityType={EntityType.BlockheadCashuMintQuote}
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
				quoteId: true,
				amount: true,
				unit: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadCashuMintQuotes) => [...new Map(blockheadCashuMintQuotes.values.map((blockheadCashuMintQuote) => [blockheadCashuMintQuote[EntityMetaKey.SelectorKey], blockheadCashuMintQuote])).values()]}
	getKey={(blockheadCashuMintQuote) => blockheadCashuMintQuote[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Cashu mint quotes yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadCashuMintQuote })}
		{@const blockheadCashuMintQuoteFields = { ...blockheadCashuMintQuote[EntityMetaKey.Selector], ...blockheadCashuMintQuote }}
		<EntityView
			entityType={EntityType.BlockheadCashuMintQuote}
			entitySelector={blockheadCashuMintQuote[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadCashuMintQuoteFields.quoteId) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu mint quote'}
			{/snippet}

			{#snippet Value()}
				{[(String((blockheadCashuMintQuoteFields.amount) ?? '') ? String((blockheadCashuMintQuoteFields.amount) ?? '') + blockheadCashuMintQuoteFields.unit : '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
