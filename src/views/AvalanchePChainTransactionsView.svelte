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
		title = 'Avalanche p chain transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AvalanchePChainTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AvalanchePChainTransaction>
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
	entityType={EntityType.AvalanchePChainTransaction}
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
				txId: true,
				txType: true,
				$block: true,
			},
		})
	}
	{countResource}
	getResourceItems={(avalanchePChainTransactions) => [...new Map(avalanchePChainTransactions.values.map((avalanchePChainTransaction) => [avalanchePChainTransaction[EntityMetaKey.SelectorKey], avalanchePChainTransaction])).values()]}
	getKey={(avalanchePChainTransaction) => avalanchePChainTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Avalanche p chain transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: avalanchePChainTransaction })}
		{@const avalanchePChainTransactionFields = { ...avalanchePChainTransaction[EntityMetaKey.Selector], ...avalanchePChainTransaction }}
		<EntityView
			entityType={EntityType.AvalanchePChainTransaction}
			entitySelector={avalanchePChainTransaction[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((avalanchePChainTransactionFields.txId) ?? '')].filter(Boolean).join(' ') || 'avalanche p chain transaction'}
			{/snippet}

			{#snippet Value()}
				{[String((avalanchePChainTransactionFields.txType) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((avalanchePChainTransactionFields.$block.height) ?? '')].filter(Boolean).join(' ') || [String((avalanchePChainTransactionFields.$block.blockId) ?? '')].filter(Boolean).join(' ') || 'avalanche p chain block'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
