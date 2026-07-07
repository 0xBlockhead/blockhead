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
		title = 'Transactions',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosTransactions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CosmosTransaction>
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
	import CosmosTransactionView from '$/views/CosmosTransactionView.svelte'
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
					txHash: true,
					code: true,
					gasUsed: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosTransaction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(cosmosTransactions)}
			{@const uniqueCosmosTransactions = [...new Map(cosmosTransactions.values.map((cosmosTransaction) => [cosmosTransaction[EntityMetaKey.SelectorKey], cosmosTransaction])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosTransaction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cosmosTransactions.totalCount}
				getKey={(cosmosTransaction) => cosmosTransaction[EntityMetaKey.SelectorKey]}
				items={uniqueCosmosTransactions}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cosmos transactions yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cosmosTransaction }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CosmosTransaction> })}
					{@const cosmosTransactionFields = { ...cosmosTransaction[EntityMetaKey.Selector], ...cosmosTransaction }}
					{@const cosmosTransactionHrefFields = { ...cosmosTransaction, ...cosmosTransaction[EntityMetaKey.Selector] }}
					<CosmosTransactionView
						selection={select(EntityType.CosmosTransaction, cosmosTransaction[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={cosmosTransactionFields}
						href={
							(cosmosTransactionHrefFields.$network !== undefined && cosmosTransactionHrefFields.$network.caip2 !== undefined && cosmosTransactionHrefFields.$network.caip2.namespace !== undefined && cosmosTransactionHrefFields.$network !== undefined && cosmosTransactionHrefFields.$network.caip2 !== undefined && cosmosTransactionHrefFields.$network.caip2.reference !== undefined && cosmosTransactionHrefFields.txHash !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/tx/[txHash]', {
								caip2: `${String(cosmosTransactionHrefFields.$network.caip2.namespace ?? '')}:${String(cosmosTransactionHrefFields.$network.caip2.reference ?? '')}`,
								txHash: String(cosmosTransactionHrefFields.txHash ?? ''),
							}) : undefined)
						}
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
		entityType={EntityType.CosmosTransaction}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
