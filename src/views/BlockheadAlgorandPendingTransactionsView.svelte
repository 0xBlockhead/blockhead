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
		title = 'Blockhead Algorand pending transactions',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAlgorandPendingTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadAlgorandPendingTransaction>
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
	import BlockheadAlgorandPendingTransactionView from '$/views/BlockheadAlgorandPendingTransactionView.svelte'
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
					txId: true,
					transactionType: true,
					observedAtMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadAlgorandPendingTransaction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(blockheadAlgorandPendingTransactions)}
			{@const uniqueBlockheadAlgorandPendingTransactions = [...new Map(blockheadAlgorandPendingTransactions.values.map((blockheadAlgorandPendingTransaction) => [blockheadAlgorandPendingTransaction[EntityMetaKey.SelectorKey], blockheadAlgorandPendingTransaction])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadAlgorandPendingTransaction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadAlgorandPendingTransactions.totalCount}
				getKey={(blockheadAlgorandPendingTransaction) => blockheadAlgorandPendingTransaction[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadAlgorandPendingTransactions}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead algorand pending transactions yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadAlgorandPendingTransaction }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadAlgorandPendingTransaction> })}
					{@const blockheadAlgorandPendingTransactionFields = { ...blockheadAlgorandPendingTransaction[EntityMetaKey.Selector], ...blockheadAlgorandPendingTransaction }}
					<BlockheadAlgorandPendingTransactionView
						selection={select(EntityType.BlockheadAlgorandPendingTransaction, blockheadAlgorandPendingTransaction[EntityMetaKey.Selector])}
						prefetched={blockheadAlgorandPendingTransactionFields}
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
		entityType={EntityType.BlockheadAlgorandPendingTransaction}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
