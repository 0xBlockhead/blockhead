<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Blockhead Quilibrium pending transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadQuilibriumPendingTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadQuilibriumPendingTransaction>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadQuilibriumPendingTransactionView from '$/views/BlockheadQuilibriumPendingTransactionView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadQuilibriumPendingTransaction}
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
				transactionAddress: true,
				amount: true,
				deliveryType: true,
			},
		})
	}
	getResourceItems={(blockheadQuilibriumPendingTransactions) => [...new Map(blockheadQuilibriumPendingTransactions.values.map((blockheadQuilibriumPendingTransaction) => [blockheadQuilibriumPendingTransaction[EntityMetaKey.SelectorKey], blockheadQuilibriumPendingTransaction])).values()]}
	getKey={(blockheadQuilibriumPendingTransaction) => blockheadQuilibriumPendingTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead quilibrium pending transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadQuilibriumPendingTransaction })}
		{@const blockheadQuilibriumPendingTransactionFields = { ...blockheadQuilibriumPendingTransaction[EntityMetaKey.Selector], ...blockheadQuilibriumPendingTransaction }}
		{@const selection = select(EntityType.BlockheadQuilibriumPendingTransaction, blockheadQuilibriumPendingTransaction[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadQuilibriumPendingTransactionView
			selection={selection}
			prefetched={blockheadQuilibriumPendingTransactionFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
