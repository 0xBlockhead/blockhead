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
		title = 'Blockhead Cashu melt quotes',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadCashuMeltQuotes-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadCashuMeltQuote>
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
	entityType={EntityType.BlockheadCashuMeltQuote}
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
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadCashuMeltQuotes) => [...new Map(blockheadCashuMeltQuotes.values.map((blockheadCashuMeltQuote) => [blockheadCashuMeltQuote[EntityMetaKey.SelectorKey], blockheadCashuMeltQuote])).values()]}
	getKey={(blockheadCashuMeltQuote) => blockheadCashuMeltQuote[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead Cashu melt quotes yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadCashuMeltQuote })}
		{@const blockheadCashuMeltQuoteFields = { ...blockheadCashuMeltQuote[EntityMetaKey.Selector], ...blockheadCashuMeltQuote }}
		<EntityView
			entityType={EntityType.BlockheadCashuMeltQuote}
			entitySelector={blockheadCashuMeltQuote[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadCashuMeltQuoteFields.quoteId) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu melt quote'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadCashuMeltQuoteFields.amount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
