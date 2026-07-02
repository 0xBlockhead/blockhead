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
		title = 'Transactions',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Bridge transactions...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadBridgeTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadBridgeTransaction>
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
	import BlockheadBridgeTransactionView from '$/views/BlockheadBridgeTransactionView.svelte'
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
					createdAt: true,
					$sourceTx: true,
					$account: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadBridgeTransaction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(blockheadBridgeTransactions)}
			{@const uniqueBlockheadBridgeTransactions = [...new Map(blockheadBridgeTransactions.values.map((blockheadBridgeTransaction) => [blockheadBridgeTransaction[EntityMetaKey.SelectorKey], blockheadBridgeTransaction])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadBridgeTransaction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadBridgeTransactions.values.length === uniqueBlockheadBridgeTransactions.length && blockheadBridgeTransactions.totalCount != null && blockheadBridgeTransactions.totalCount >= uniqueBlockheadBridgeTransactions.length ? blockheadBridgeTransactions.totalCount : uniqueBlockheadBridgeTransactions.length}
				getKey={(blockheadBridgeTransaction) => blockheadBridgeTransaction[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadBridgeTransactions}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No bridge transactions yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadBridgeTransaction }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadBridgeTransaction> })}
					<BlockheadBridgeTransactionView
						selection={select(EntityType.BlockheadBridgeTransaction, blockheadBridgeTransaction.entitySelector)}
						prefetched={blockheadBridgeTransaction}
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
		entityType={EntityType.BlockheadBridgeTransaction}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
