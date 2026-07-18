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
		title = 'Blockhead Algorand pending transactions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAlgorandPendingTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadAlgorandPendingTransaction>
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
	import BlockheadAlgorandPendingTransactionView from '$/views/BlockheadAlgorandPendingTransactionView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAlgorandPendingTransaction}
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
				transactionType: true,
				observedAtMs: true,
			},
		})
	}
	getResourceItems={(blockheadAlgorandPendingTransactions) => [...new Map(blockheadAlgorandPendingTransactions.values.map((blockheadAlgorandPendingTransaction) => [blockheadAlgorandPendingTransaction[EntityMetaKey.SelectorKey], blockheadAlgorandPendingTransaction])).values()]}
	getKey={(blockheadAlgorandPendingTransaction) => blockheadAlgorandPendingTransaction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead algorand pending transactions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAlgorandPendingTransaction })}
		{@const blockheadAlgorandPendingTransactionFields = { ...blockheadAlgorandPendingTransaction[EntityMetaKey.Selector], ...blockheadAlgorandPendingTransaction }}
		{@const selection = select(EntityType.BlockheadAlgorandPendingTransaction, blockheadAlgorandPendingTransaction[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadAlgorandPendingTransactionView
			selection={selection}
			prefetched={blockheadAlgorandPendingTransactionFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
